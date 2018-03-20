'use strict';
// const constAPI =  require('./constantAPI');
const DATABASE_URL = 'mongodb://localhost:27017/test12';
const TelegramBot = require('node-telegram-bot-api');
const configApi = require('./conf.json');
const COMMAND_FORWARD = 'forward';
const COMMAND_REPLAY = 'reply';
const COMMAND_EDIT = 'edit';
const COMMAND_DELETE = 'delete';
const COMMAND_YES = 'yes';
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
let fs = require('fs');
let http = require('https');
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
    console.log('init bot');
    try {
      this.api = new  TelegramBot( configApi.telegram.token, {polling: true});
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
      case 'callback_query':
        return {
          'callback_query': {
            'function': this.callback_query,
            'regex': /(.+)/
          }
        };
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
      'id': id,
      'messageFormClientToPartner': messageFormClientToPartner,
      'messageFormClientToPartnerFull': messageFormClientToPartnerFull,
      'workProcessId': workProcessId
    });
    botApi.sendMessage(id, msg, {
      reply_markup: {
        inline_keyboard: inline_keyboard
      }
    });
  }

  addPartnerToApi(msg, match) {
    const {from: {id}} = msg;
    const resp = match[1]; // the captured "whatever"
    let arr = resp.split(' ');
    console.log('arr', arr);
    if (arr.length === 2) {
      let foundAccount;
      MongoClient.connect( DATABASE_URL, function (err, db) {
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
      MongoClient.connect( DATABASE_URL, function (err, db) {
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
      MongoClient.connect( DATABASE_URL, function (err, db) {
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
      case  COMMAND_FORWARD:
        botApi.forwardMessage(chat.id, chat.id, message_id);
        break;
      case  COMMAND_REPLAY:
        botApi.sendMessage(chat.id, 'Reply to message', {
          reply_to_message_id: message_id
        });
        break;
      case  COMMAND_EDIT:
        botApi.editMessageText(`${text}(edited)`, {
          chat_id: chat.id,
          message_id: message_id,
          reply_markup: {inline_keyboard:  inline_keyboard}
        });
        break;
      case  COMMAND_DELETE:
        botApi.deleteMessage(chat.id, message_id);
        break;
      case  COMMAND_FINISH:
        botApi.deleteMessage(chat.id, message_id);
        // let file = fs.readFileSync('./ApiBot/sss.jpg');
        console.log('idProcess:::', idProcess);
        idProcess.map(process => {
          if (chat.id === process.id  && process.messageFormClientToPartnerFull.includes(text)) {
            console.log('******************');
            MongoClient.connect( DATABASE_URL, function (err, db) {
              if (err) throw err;
              console.log('Connected to process collection established!');
              let problemS = process.messageFormClientToPartner.match( FILTER_PROBLEM);
              let cleanProblem = problemS[0].replace(/PROBLEM:/g,'');

              var collection = db.collection('process');
              try {
                collection.findOne({"problem": cleanProblem}).then((res, err) => {
                  if (err) throw err;
                  if (process.messageFormClientToPartner.includes(res.problem)) {
                    console.log('INCLUDE PROBLEM !!!!!!!!!!!!!!!!');
                    MongoClient.connect( DATABASE_URL, function (err, db) {
                      if (err) throw err;
                      console.log('Connected to process collection established!');
                      let collection = db.collection('done_process');
                      try {
                        collection.insertOne(res, function (err, r) {
                          if (err) throw err;
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
            });
            idProcess = idProcess.filter(proc => proc.workProcessId !== process.workProcessId );
            botApi.sendMessage(chat.id, 'Good job !!! ');
          } else {
            botApi.editMessageText('develop mode', {
              chat_id: chat.id,
              message_id: message_id,
              reply_markup: {inline_keyboard:  process_step}
            });
          }
          const fileOpts = {
            filename: 'sss',
            contentType: 'image/jpeg'
          };
          // botApi.sendPhoto(chat.id, file, {}, fileOpts);
        });

        break;
      case  COMMAND_YES:
        console.log('YES:::');
        if (messageFormClientToPartnerFull) {
          console.log('idProcess::::', idProcess);
          idProcess.map(idProc => {
            if (idProc.id === id && idProc.messageFormClientToPartner.includes(text)) {
              console.log('COOOOOL NEW PROCESS!');
              botApi.editMessageText(idProc.messageFormClientToPartnerFull, {
                chat_id: id,
                message_id: message_id,
                reply_markup: {inline_keyboard:  process_step}
              });
              MongoClient.connect( DATABASE_URL, function (err, db) {
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

            } else {
              console.log('NOT YOU');
              if (idProc.messageFormClientToPartner.includes(text)) {
                messageFormClientToPartnerFull = null;
                botApi.sendMessage(idProc.id, 'Someone took  first. Process are closed you are miss!! next time');
              }
            }
          });
        }else{
          console.log('Someone took  first');
          botApi.deleteMessage(id, message_id);}
        break;
      default:
        botApi.sendMessage(chat.id, 'Wrong tipe')

    }
    botApi.answerCallbackQuery({callback_query_id: query.id})
  }
}

module.exports = TelegramApi;