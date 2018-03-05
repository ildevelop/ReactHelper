'use strict';
const TelegramBot = require('node-telegram-bot-api');
const configApi = require('./conf.json');


const DATABASE_URL = 'mongodb://localhost:27017/test12';
const KEYBOARD_COMAND = '/keyboard';
const KEYBOARD_COMAND_SHOW = 'show';
const KEYBOARD_COMAND_HIDE = 'hide';
const KEYBOARD_COMAND_INLINE = 'inline';


const COMMAND_FORWARD = 'forward';
const COMMAND_REPLAY = 'reply';
const COMMAND_EDIT = 'edit';
const COMMAND_DELETE = 'delete';

const inline_keyboard = [
  [
    {
      text: 'Forward',
      callback_data: COMMAND_FORWARD
    },
    {
      text: 'Reply',
      callback_data: COMMAND_REPLAY
    },
  ],
  [
    {
      text: 'Edit',
      callback_data: COMMAND_EDIT
    },
    {
      text: 'Delete',
      callback_data: COMMAND_DELETE
    },
  ]
];
let mongo = require('mongodb');
let MongoClient = mongo.MongoClient;
let botApi = null;

class TelegramApi {
  constructor() {
    this.api = null;
  }

  init() {
    console.log("init bot");
    try {
      this.api = new TelegramBot(configApi.telegram.token, {polling: true});
      botApi = this.api;
      this.api.on('callback_query',this.callback_query);
      this.api.on('message',this.message);
      this.api.onText(/\/keyboard (.+)/,this.keyboard);
      this.api.onText(/\/add (.+)/,this.addPartnerToApi);
      this.api.onText(/\/add_category (.+)/,this.addCategory);
      this.api.onText(/\/delete (.+)/,this.deletePartner);

    }
    catch (ex) {
      console.error(ex);
      return false;
    }
    console.log('Initiated telegram bot api successfully!');
    return true;
  }

  getTelegramControllers(direction) {
    switch (direction) {
      case 'add_category':
        return {
          'add_category': {
            'function': this.addCategory,
            'regex': /\/add_category (.+)/
          }
        };
      case 'delete_partner':
        return {
          'delete': {
            'function': this.deletePartner,
            'regex': /\/delete (.+)/
          }
        };
      case 'add_partner_to_api':
        return {
          'add': {
            'function': this.addPartnerToApi,
            'regex': /\/add (.+)/
          }
        };
      case 'keyboard':
        return {
          'keyboard': {
            'function': this.keyboard,
            'regex': /\/keyboard (.+)/
          }
        };
      case 'callback_query':
        return {
          'callback_query': {
            'function': this.callback_query,
            'regex': /(.+)/
          }
        }
      case 'message':
        return {
          'message': {
            'function': this.message,
            'regex': /(.+)/
          }
        }
    }
  }

  keyboard(msg, match) {
    console.log('keyboard start');
    const {from: {id}} = msg;
    const resp = match[1]; // the captured "whatever"
    console.log('msg', msg);
    console.log('resp', resp);
    console.log("here!", botApi);
    switch (resp) {
      case KEYBOARD_COMAND_SHOW:
        console.log('SHOW:');
        botApi.sendMessage(id, 'Showing a keyboard', {
          reply_markup: {
            keyboard: [
              [
                `${KEYBOARD_COMAND} ${KEYBOARD_COMAND_HIDE}`
              ]
            ]
          }
        });
        break;
      case KEYBOARD_COMAND_HIDE:
        console.log('HIDE:');
        botApi.sendMessage(id, 'Hiding a keyboard', {
          reply_markup: {
            remove_keyboard: true
          }
        });
        break;
      case KEYBOARD_COMAND_INLINE:
        console.log('INLINE:');
        botApi.sendMessage(id, 'InLine keybord is below', {
          reply_markup: {
            inline_keyboard
          }
        });
        break;
      default:
        botApi.sendMessage(id, 'Invalid input')
    }
  }

  addPartnerToApi(msg, match) {
    const {from: {id}} = msg;
    const resp = match[1]; // the captured "whatever"
    let arr = resp.split(' ');
    console.log('arr',arr);
    if (arr.length === 2) {
      let foundAccount;
      MongoClient.connect(DATABASE_URL, function (err, db) {
        if (err) throw err;
        console.log("id", id);
        try {
          foundAccount = db.collection("partners").findOneAndUpdate({
              fname: arr[0].toLowerCase(),
              sname: arr[1].toLowerCase()
            }, {$set: {"chatId": id}},
            {
              returnNewDocument: true,
            });
          db.close();
          botApi.sendMessage(id, 'good! we added ' + arr[0] + ' ' + arr[1]);
        } catch (e) {
          console.log('DB error',e);
          botApi.sendMessage(id, 'wrong name, please resent the full name of partner ! first name & second name');
        }

      });
    }
    else {
      botApi.sendMessage(id, 'wrong name, please resent the full name of partner ! first name & second name');
    }
  }

  deletePartner(msg, match) {
    const {from: {id}} = msg;
    const resp = match[1]; // the captured "whatever"
    let arr = resp.split(' ');

    // console.log('deleted partner: ', arr[0].toLowerCase() + ' ' + arr[1].toLowerCase());
    console.log('deleted partner: ', arr);
    if (arr.length === 2) {
      let foundAccount;
      MongoClient.connect(DATABASE_URL, function (err, db) {
        if (err) throw err;
        console.log("id", id);
        try {
          foundAccount = db.collection("partners").deleteOne({
            fname: arr[0].toLowerCase(),
            sname: arr[1].toLowerCase()
          });
          db.close();
          botApi.sendMessage(id, 'good! we deleted ' + arr[0] + ' ' + arr[1]);
        } catch (e) {
          console.log(e);
          botApi.sendMessage(id, 'wrong name, please resent the full name of partner ! first name & second name');
        }

      });
      // setTimeout(console.log('finded',foundAccount ),2000)
    }
    else {
      botApi.sendMessage(id, 'wrong name, please resent the full name of partner ! first name & second name');
    }
  }

  addCategory(message, matched_list) {
    const {from: {id}} = message;
    const response = matched_list[1]; // the captured "whatever"
    let categories = response.split(' ');
    console.log('add categories: ', categories[0].toLowerCase());
    if (categories.length === 1 && !message.from.is_bot) {
      let foundAccount = null;
      MongoClient.connect(DATABASE_URL, function (err, db) {
        if (err) throw err;
        console.log("id", id);
        try {
          foundAccount = db.collection("categories").insertOne({category: categories[0].toLowerCase()});
          db.close();
          botApi.sendMessage(id, 'good! we added ' + categories[0]);
        } catch (e) {
          console.log(e);
          botApi.sendMessage(id, 'wrong name, please resent the categories! in one string');
        }

      });
    }
    else {
      botApi.sendMessage(id, 'wrong name, please resent the categories! in one string');
    }
  }
  message(msg){
    const {from: {id}} = msg;
    // bot.sendMessage(id, msg.text);
    if (msg.text === '/add' || msg.text === '/add ') {
      botApi.sendMessage(id, 'wrong name, please resent the full name of partner !');
    }
  }

  callback_query(query){
    console.log('query', query);
    const {message: {chat, message_id, text}} = query;

    switch (query.data) {
      case COMMAND_FORWARD:
        botApi.forwardMessage(chat.id, chat.id, message_id);
        break;
      case COMMAND_REPLAY:
        botApi.sendMessage(chat.id, 'Reply to message', {
          reply_to_message_id: message_id
        });
        break;
      case COMMAND_EDIT:
        botApi.editMessageText(`${text}(edited)`, {
          chat_id: chat.id,
          message_id: message_id,
          reply_markup: {inline_keyboard}
        });
        break;
      case COMMAND_DELETE:
        botApi.deleteMessage(chat.id, message_id);
        break;
    }
    botApi.answerCallbackQuery({callback_query_id: query.id})
  }


}

module.exports = TelegramApi;