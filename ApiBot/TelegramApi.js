'use strict';
const constAPI = require('./constantAPI');
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
      this.api = new constAPI.TelegramBot(constAPI.configApi.telegram.token, {polling: true});
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
        inline_keyboard: constAPI.inline_keyboard
      }
    });
  }

  addPartnerToApi(msg, match) {
    const {from: {id}} = msg;
    const resp = match[1]; // the captured "whatever"
    let arr = resp.split(' ');
    if (arr.length === 1 && (!isNaN(resp)) && (13 > resp.length || resp.length > 5 )) {
      let foundAccount;
      MongoClient.connect(constAPI.DATABASE_URL, function (err, db) {
        if (err) throw err;
        console.log("id", id);
        try {
          foundAccount = db.collection("partners").findOneAndUpdate({
            phone_number: resp,
          }, {$set: {"chatId": id}});
          db.close();
          botApi.sendMessage(id, 'good! we added ' + resp);
        } catch (e) {
          console.log('DB error', e);
          botApi.sendMessage(id, 'wrong name, please resent the full phone number of partner! only Integer');
        }

      });
    }
    else {
      botApi.sendMessage(id, 'wrong name, please resent the full phone number of partner !');
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
      MongoClient.connect(constAPI.DATABASE_URL, function (err, db) {
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
      MongoClient.connect(constAPI.DATABASE_URL, function (err, db) {
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
      let inline_keyboard_new = [];
      idProcess.map((process, i) => {
          if (process.id === id) {
            i++;
            let messageClient = process.messageFormClientToPartnerFull.split(' ');
            let fullNameClient = i + ': ' + messageClient[1] + ' ' + messageClient [2];
            inline_keyboard_new.push([{
              text: fullNameClient,
              callback_data: constAPI.COMMAND_ADD_PHOTO[i-1]
            }]);
          }
        }
      );
      console.log('inline_keyboard_new', inline_keyboard_new);
      if (inline_keyboard_new.length > 0) {
        botApi.getFile(msg.photo[2].file_id).then((res) => {
          photoFormUser = res.file_path;
          let file = fs.createWriteStream(`./${res.file_path}`);
          let request = http.get(`https://api.telegram.org/file/bot${constAPI.configApi.telegram.token}/${photoFormUser}`, function (response) {
            response.pipe(file);
          });
          // console.log('request:::::::>', request);
        });
        botApi.sendMessage(msg.chat.id, "Choose the client with whom you have finished",
          {
            reply_to_message_id: msg.message_id,
            reply_markup: {inline_keyboard: inline_keyboard_new}
          });
      } else {
        botApi.sendMessage(msg.chat.id, "unfortunately you don't have open processes",
          {
            reply_to_message_id: msg.message_id
          });
      }


    }
    if (msg.text === '/add' || msg.text === '/add ') {
      botApi.sendMessage(id, 'wrong name, please resent the full name of partner !');
    }
  }

  callback_query(query) {
    console.log('query', query);
    const {message: {chat, message_id, text}, from: {id}} = query;
    switch (query.data) {
      case  constAPI.COMMAND_FORWARD:
        botApi.forwardMessage(chat.id, chat.id, message_id);
        break;
      case  constAPI.COMMAND_REPLAY:
        botApi.sendMessage(chat.id, 'Reply to message', {
          reply_to_message_id: message_id
        });
        break;
      case  constAPI.COMMAND_EDIT:
        botApi.editMessageText(`${text}(edited)`, {
          chat_id: chat.id,
          message_id: message_id,
          reply_markup: {inline_keyboard: constAPI.inline_keyboard}
        });
        break;
      case  constAPI.COMMAND_DELETE:
        botApi.deleteMessage(chat.id, message_id);
        idProcess.map(process => {
          idProcess = idProcess.filter(proc => proc.workProcessId !== process.workProcessId);
        });
        break;
      case  constAPI.COMMAND_FINISH:
        botApi.deleteMessage(chat.id, message_id);
        // let file = fs.readFileSync('./ApiBot/sss.jpg');
        console.log('idProcess:::', idProcess);
        idProcess.map(process => {
          if (chat.id === process.id && process.messageFormClientToPartnerFull.includes(text)) {
            console.log('******************');
            MongoClient.connect(constAPI.DATABASE_URL, function (err, db) {
              if (err) throw err;
              console.log('Connected to process collection established!');
              let problemS = process.messageFormClientToPartner.match(constAPI.FILTER_PROBLEM);
              let cleanProblem = problemS[0].replace(/PROBLEM:/g, '');

              var collection = db.collection('process');
              try {
                collection.findOne({"problem": cleanProblem}).then((res, err) => {
                  if (err) throw err;
                  if (process.messageFormClientToPartner.includes(res.problem)) {
                    console.log('INCLUDE PROBLEM !!!!!!!!!!!!!!!!');
                    MongoClient.connect(constAPI.DATABASE_URL, function (err, db) {
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
                  }
                  else {
                    console.log('WTF');
                  }
                });
                collection.deleteOne({"problem": cleanProblem}, function (err, res) {
                  if (err) throw err;
                  db.close();
                });
              } catch (e) {
                console.log(e)
              }
              collection = db.collection('partners');
              try {
                console.log('ID process in idProcess::::::::', process.workProcessId);
                collection.update({
                    work_process_id: process.workProcessId,
                  }, {$pull: {work_process_id: process.workProcessId}},
                  {
                    returnNewDocument: true,
                  });
                db.close();
              } catch (e) {
                console.log('DB error', e);
              }
            });
            // botApi.sendPhoto(chat.id, file, {}, fileOpts);
            idProcess = idProcess.filter(proc => proc.workProcessId !== process.workProcessId);
            botApi.sendMessage(chat.id, 'Good job !!! ');
          } else {
            botApi.editMessageText('develop mode', {
              chat_id: chat.id,
              message_id: message_id,
              reply_markup: {inline_keyboard: constAPI.process_step}
            });
          }
          const fileOpts = {
            filename: 'sss',
            contentType: 'image/jpeg'
          };
        });

        break;
      case  constAPI.COMMAND_YES:
        console.log('YES:::');
        if (messageFormClientToPartnerFull) {
          console.log('idProcess::::', idProcess);
          idProcess.map(idProc => {
            if (idProc.id === id && idProc.messageFormClientToPartner.includes(text)) {
              console.log('COOOOOL NEW PROCESS!');
              botApi.editMessageText(idProc.messageFormClientToPartnerFull, {
                chat_id: id,
                message_id: message_id,
                reply_markup: {inline_keyboard: constAPI.process_step}
              });
              MongoClient.connect(constAPI.DATABASE_URL, function (err, db) {
                if (err) throw err;
                try {
                  db.collection('partners').findOneAndUpdate({
                      chatId: id
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
        } else {
          console.log('Someone took  first');
          botApi.deleteMessage(id, message_id);
        }
        break;
      case  constAPI.COMMAND_ADD_PHOTO[0]:
        botApi.deleteMessage(chat.id, message_id);
        console.log('query.reply_to_message****',query.message.reply_to_message);
        let pathImg = query.message.reply_to_message.photo[2].file_path;
        console.log('query.reply_to_message.photo***',pathImg);
        //TODO add path to done process and before need check if process done
        break;
      case  constAPI.COMMAND_ADD_PHOTO[1]:
        botApi.deleteMessage(chat.id, message_id);
        break;
      case  constAPI.COMMAND_ADD_PHOTO[2]:
        botApi.deleteMessage(chat.id, message_id);
        break;

      default:
        botApi.sendMessage(chat.id, 'Wrong tipe')

    }
    botApi.answerCallbackQuery({callback_query_id: query.id})
  }
}

module.exports = TelegramApi;