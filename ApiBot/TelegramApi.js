'use strict';
const TelegramBot = require('node-telegram-bot-api');
const configApi = require('./conf.json');
var fs = require('fs');
var http = require('https');

const DATABASE_URL = 'mongodb://localhost:27017/test12';
const KEYBOARD_COMAND = '/keyboard';
const KEYBOARD_COMAND_SHOW = 'show';
const KEYBOARD_COMAND_HIDE = 'hide';
const KEYBOARD_COMAND_INLINE = 'inline';


const COMMAND_FORWARD = 'forward';
const COMMAND_REPLAY = 'reply';
const COMMAND_EDIT = 'edit';
const COMMAND_DELETE = 'delete';
const COMMAND_YES = 'yes';
const COMMAND_NOT = 'not';
const COMMAND_FINISH = 'finish';

const inline_keyboard = [
  [
    {
      text: 'YES I Take it!!',
      callback_data: COMMAND_YES
    },
    {
      text: 'NOT!  I`m busy now',
      callback_data: COMMAND_DELETE
    },
  ]
];

const process_step = [
  [
    {
      text: 'FINISH Please send photo invoice!',
      callback_data: COMMAND_FINISH
    }
  ]
];
const FILTER_PROBLEM =  /PROBLEM:[a-zA-Z 1-9]*/;

let mongo = require('mongodb');
let MongoClient = mongo.MongoClient;
let botApi = null;
let messageFormClientToPartner = '';
let messageFormClientToPartnerFull = '';
let idProcess = [];

class TelegramApi {
  constructor() {
    this.api = null;
  }

  init() {
    console.log("init bot");
    try {
      this.api = new TelegramBot(configApi.telegram.token, {polling: true});
      botApi = this.api;
      this.api.on('callback_query', this.callback_query);
      this.api.on('message', this.message);
      this.api.onText(/\/keyboard (.+)/, this.keyboard);
      this.api.onText(/\/add (.+)/, this.addPartnerToApi);
      this.api.onText(/\/add_category (.+)/, this.addCategory);
      this.api.onText(/\/delete (.+)/, this.deletePartner);

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

  messageToPartners(id, msg, msg2, workProcessId) {
    messageFormClientToPartner = msg;
    console.log('messageFormClientToPartner', messageFormClientToPartner);
    messageFormClientToPartnerFull = msg2;
    idProcess.push({
      "id": id,
      "messageFormClientToPartner": messageFormClientToPartner,
      "workProcessId": workProcessId
    });
    botApi.sendMessage(id, msg, {
      reply_markup: {
        inline_keyboard
      }
    });
  }

  keyboard(msg, match) {
    console.log('keyboard start');
    const {from: {id}} = msg;
    const resp = match[1]; // the captured "whatever"
    console.log('msg', msg);
    console.log('resp', resp);
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
        if (messageFormClientToPartner) {
          botApi.sendMessage(id, messageFormClientToPartner, {
            reply_markup: {
              inline_keyboard
            }
          });
        } else {
          botApi.sendMessage(id, 'Development mode', {
            reply_markup: {
              inline_keyboard
            }
          });
        }


        break;
      default:
        botApi.sendMessage(id, 'Invalid input')
    }
  }

  addPartnerToApi(msg, match) {
    const {from: {id}} = msg;
    const resp = match[1]; // the captured "whatever"
    let arr = resp.split(' ');
    console.log('arr', arr);
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
          console.log('DB error', e);
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

  message(msg) {
    const {from: {id}} = msg;
    // bot.sendMessage(id, msg.text);
    console.log("msg here::::", msg);
    if (msg.photo) {
      let photoFormUser = '';

      console.log("PHOTO");
      botApi.getFile(msg.photo[3].file_id).then((res) => {
        photoFormUser = res.file_path;
        let file = fs.createWriteStream(`./${res.file_path}`);
        let request = http.get(`https://api.telegram.org/file/bot${configApi.telegram.token}/${photoFormUser}`, function (response) {
          response.pipe(file);
        });
        console.log('request:::::::>', request);

      });
    }
    if (msg.text === '/add' || msg.text === '/add ') {
      botApi.sendMessage(id, 'wrong name, please resent the full name of partner !');
    }
  }

  callback_query(query) {
    console.log('query', query);
    const {message: {chat, message_id, text}, from: {id}} = query;

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
      case COMMAND_FINISH:
        botApi.deleteMessage(chat.id, message_id);
        let file = fs.readFileSync('./ApiBot/sss.jpg');
        console.log('idProcess:::', idProcess);
        idProcess.map(process => {
          if (chat.id === process.id  && process.messageFormClientToPartner.includes(text)) {
            console.log('******************');
            let findedProcess = null;
            MongoClient.connect(DATABASE_URL, function (err, db) {
              if (err) throw err;
              console.log('Connected to process collection established!');
              let problemS = process.messageFormClientToPartner.match(FILTER_PROBLEM);
              console.log('findOne', problemS);
              let cleanProblem = problemS[0].replace(/PROBLEM:/g,'');
              console.log('findOne2', cleanProblem);

              var collection = db.collection('process');
              try {
                collection.findOne({"problem": cleanProblem}).then((res, err) => {
                  if (err) throw err;
                  findedProcess = res;
                  console.log('problem::::::::', res.problem);
                  if (process.messageFormClientToPartner.includes(res.problem)) {
                    console.log('INCLUDE PROBLEM !!!!!!!!!!!!!!!!');
                    MongoClient.connect(DATABASE_URL, function (err, db) {
                      if (err) throw err;
                      console.log('Connected to process collection established!');
                      let collection = db.collection('done_process');
                      try {
                        collection.insertOne(res, function (err, r) {
                          if (err) throw err;
                          // response.send({status: "Success"});
                          db.close();
                        })
                      } catch (e) {
                        console.log('ERROR:::', e)
                      }
                    });
                    //TODO need  remove from partner.work_process_id the id of process
                    // MongoClient.connect(DATABASE_URL, function (err, db) {
                    //   if (err) throw err;
                    //   try {
                    //     db.collection("partners").findOneAndUpdate({
                    //         work_process_id: process.messageFormClientToPartner,
                    //       }, {$pull: {"work_process_id": process.messageFormClientToPartner}},
                    //       {
                    //         returnNewDocument: true,
                    //       });
                    //     db.close();
                    //   } catch (e) {
                    //     console.log('DB error', e);
                    //   }
                    // });
                  }
                  else {
                    console.log('WTF');
                  }
                });
                collection.deleteOne({"problem": cleanProblem}, function (err, res) {
                  if (err) throw err;
                  db.close();
                })
              } catch (e) {
                console.log(e)
              }
              console.log('findedProcess', findedProcess);
            });
            idProcess = idProcess.filter(proc => proc.workProcessId !== process.workProcessId );
            botApi.sendMessage(chat.id, 'Good job !!! ');
          } else {
            botApi.editMessageText('develop mode', {
              chat_id: chat.id,
              message_id: message_id,
              reply_markup: {inline_keyboard: process_step}
            });
          }
          const fileOpts = {
            filename: 'sss',
            contentType: 'image/jpeg'
          };
          // botApi.sendPhoto(chat.id, file, {}, fileOpts);
        });

        break;
      case COMMAND_YES:
        console.log('YES:::');
        if (messageFormClientToPartnerFull) {
          console.log('idProcess::::', idProcess);
          console.log('message_id', id);
          idProcess.map(idProc => {
            console.log('idProc.messageFormClientToPartner:::', idProc.messageFormClientToPartner);
            console.log('workProcessId:::', idProc.workProcessId);
            if (idProc.id === id && idProc.messageFormClientToPartner.includes(text)) {
              console.log('COOOOOL!');
              MongoClient.connect(DATABASE_URL, function (err, db) {
                if (err) throw err;
                try {
                  db.collection('partners').findOneAndUpdate({
                    chatId:id
                    }, {$addToSet: {'work_process_id': idProc.workProcessId}},
                    {
                      returnNewDocument: true,
                    });
                  db.collection('process').findOneAndUpdate({
                      _id: idProc.workProcessId
                    }, {$set: {'partnerStarted': id}},
                    {
                      returnNewDocument: true,
                    });
                  db.close();
                } catch (e) {
                  console.log('ERROR:::', e);
                }
              });
              botApi.editMessageText(messageFormClientToPartnerFull, {
                chat_id: chat.id,
                message_id: message_id,
                reply_markup: {inline_keyboard: process_step}
              });
              idProc.messageFormClientToPartner = messageFormClientToPartnerFull;
            } else {
              //TODO  need delete message from another user
              if (idProc.messageFormClientToPartner.includes(text)) {
                botApi.sendMessage(idProc.id, 'Someone took  first. Process are closed you are miss!! next time');
                botApi.deleteMessage(chat.id, message_id);

              }

            }
          });


        }

        break;
      default:
        botApi.sendMessage(chat.id, 'Wrong tipe')

    }
    botApi.answerCallbackQuery({callback_query_id: query.id})
  }


}

module.exports = TelegramApi;