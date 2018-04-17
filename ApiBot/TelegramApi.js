'use strict';
const constAPI = require('./constantAPI');
let fs = require('fs');
let http = require('https');
let mongo = require('mongodb');
let MongoClient = mongo.MongoClient;
let botApi = null;
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
    MongoClient.connect(constAPI.DATABASE_URL, function (err, db) {
      if (err) throw err;
      try {
        db.collection('idProcess').find({}).toArray((err, result) => {
          if (err) throw err;
          console.log('resssss:', result);
          idProcess = result;
        });
        db.close();
      } catch (e) {
        console.log('ERROR Remove:::', e);
      }
    });
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
    idProcess.push({
      'id': id,
      'messageFormClientToPartner': msg,
      'messageFormClientToPartnerFull': msg2,
      'workProcessId': workProcessId
    });
    MongoClient.connect(constAPI.DATABASE_URL, function (err, db) {
      if (err) throw err;
      try {
        db.collection('idProcess').insertOne({
          'id': id,
          'messageFormClientToPartner': msg,
          'messageFormClientToPartnerFull': msg2,
          'workProcessId': workProcessId
        });
        db.close();
      } catch (e) {
        console.log('ERROR Insert idProcess:', e);
      }
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
    if (arr.length === 1 && (!isNaN(resp)) && (13 > resp.length || resp.length > 5)) {
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
    console.log("msg here::::", msg);
    console.log("idProcess here::::", idProcess);
    if (msg.photo) {
      let photoFormUser = '';
      let inline_keyboard_new = [];
      let i = 0;
      idProcess.map((process) => {
          if (process.id === id && process.heSayYes) {
            console.log('PHOTO AFTER YES:');
            i++;
            let messageClient = process.messageFormClientToPartnerFull.split(' ');
            let fullNameClient = i + ': ' + messageClient[1] + ' ' + messageClient [2];
            inline_keyboard_new.push([{
              text: fullNameClient,
              callback_data: constAPI.COMMAND_ADD_PHOTO[i - 1],
              idUser: id
            }]);
          }
        }
      );
      console.log('inline_keyboard_new', inline_keyboard_new);
      if (inline_keyboard_new.length > 0) {
        botApi.getFile(msg.photo[2].file_id).then((res) => {
          photoFormUser = res.file_path;
          let file = fs.createWriteStream(`./${res.file_path}`);
          http.get(`https://api.telegram.org/file/bot${constAPI.configApi.telegram.token}/${photoFormUser}`, function (response, err) {
            response.pipe(file);
            MongoClient.connect(constAPI.DATABASE_URL, function (err, db) {
              if (err) throw err;
              let bucket = new mongo.GridFSBucket(db, {
                bucketName: 'process_images',
                chunkSizeBytes: 10240 * 2058
              });

              fs.createReadStream(photoFormUser).pipe(
                bucket.openUploadStream(photoFormUser)).on('error', function (error) {
                console.log('Error:-', error);
              }).on('finish', function () {
                try {
                  db.collection("process_images.files").findOneAndUpdate({
                    filename: res.file_path
                  }, {$set: {"UserId": id}});
                } catch (e) {
                  console.log('DB error', e);
                }
                db.close();
                console.log('File Inserted!!');
              });
            });

          });
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
    let workProcessID = [];
    for (let process in idProcess) {
      console.log('process', process);
      if (idProcess[process].id === id && idProcess[process].heSayYes) {
        console.log('FINDING PHOTO ');
        let messageClient = idProcess[process].messageFormClientToPartnerFull.split(' ');
        let fullNameClient = messageClient[1] + ' ' + messageClient [2];
        workProcessID.push({
          text: fullNameClient,
          workProcessId: idProcess[process].workProcessId
        });
      }
    }
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
        console.log('REMOVE idProcess');
        MongoClient.connect(constAPI.DATABASE_URL, function (err, db) {
          if (err) throw err;
          try {
            db.collection('idProcess').removeMany();
            db.close();
          } catch (e) {
            console.log('ERROR Remove:::', e);
          }
        });
        let idProcessLocal = [];
        idProcess.map(process => {
          idProcessLocal = idProcess.filter(proc => proc.workProcessId !== process.workProcessId);
        });
        idProcess = idProcessLocal;
        MongoClient.connect(constAPI.DATABASE_URL, function (err, db) {
          if (err) throw err;
          try {
            db.collection('idProcess').insertMany(idProcess);
            db.close();
          } catch (e) {
            console.log('ERROR INSERTMANY to IDPROCESS:::', e);
          }
        });
        //TODO need delete work_process_id from partner
        break;
      //case  constAPI.COMMAND_FINISH:

      case  constAPI.COMMAND_YES:
        console.log('YES:::');
        console.log('idProcess::::', idProcess);
        let weHaveYes = 0;
        idProcess.map(idProcF => {
          if (idProcF.messageFormClientToPartner.includes(text)) {
            if (idProcF.heSayYes) weHaveYes++

          }
        });
        console.log('weHaveYes', weHaveYes);
        idProcess.map(idProc => {
          if (idProc.id === id && idProc.messageFormClientToPartner.includes(text)) {
            if (weHaveYes === 0) {
              idProc['heSayYes'] = true;
              console.log('COOOOOL NEW PROCESS!');
              MongoClient.connect(constAPI.DATABASE_URL, function (err, db) {
                if (err) throw err;
                try {
                  db.collection('idProcess').findOneAndUpdate({
                    id: id, workProcessId: idProc.workProcessId
                  }, {$set: {'heSayYes': true}});
                  db.close();
                } catch (e) {
                  console.log('ERROR INSERTMANY to IDPROCESS:::', e);
                }
              });
              botApi.editMessageText(idProc.messageFormClientToPartnerFull, {
                chat_id: id,
                message_id: message_id
              });
              botApi.sendMessage(id, 'Please send photo invoice');
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
              let problemS = idProc.messageFormClientToPartner.match(constAPI.FILTER_PROBLEM);
              let cleanProblem = problemS[0].replace(/PROBLEM:/g, '');
              if (idProc.messageFormClientToPartner.includes(cleanProblem) && idProc.id === id) {
                botApi.deleteMessage(id, message_id);
                botApi.sendMessage(id, 'Someone took  first process.');
              }
            }


          } else {
            console.log('NOT YOU');
            let problemS = idProc.messageFormClientToPartner.match(constAPI.FILTER_PROBLEM);
            let cleanProblem = problemS[0].replace(/PROBLEM:/g, '');
            if (idProc.messageFormClientToPartner.includes(cleanProblem) && idProc.id === id) {
              botApi.deleteMessage(id, message_id);
              botApi.sendMessage(id, 'Someone took  first process.');
            }
          }
        });
        break;
      case  constAPI.COMMAND_ADD_PHOTO[0]:
        botApi.deleteMessage(chat.id, message_id);
        let pathImg = query.message.reply_to_message.photo[2].file_path;
        TelegramApi.addImageToProcess(pathImg, id, workProcessID[0]);
        break;
      case  constAPI.COMMAND_ADD_PHOTO[1]:
        botApi.deleteMessage(chat.id, message_id);
        let pathImg2 = query.message.reply_to_message.photo[2].file_path;
        TelegramApi.addImageToProcess(pathImg2, id, workProcessID[1]);
        break;
      case  constAPI.COMMAND_ADD_PHOTO[2]:
        botApi.deleteMessage(chat.id, message_id);
        let pathImg3 = query.message.reply_to_message.photo[2].file_path;
        TelegramApi.addImageToProcess(pathImg3, id, workProcessID[2]);
        break;

      default:
        botApi.sendMessage(chat.id, 'Wrong tipe')

    }
    botApi.answerCallbackQuery({callback_query_id: query.id})
  }

  static addImageToProcess(pathImg, id, workProcessID) {
    console.log('workProcessID::::::', workProcessID);
    let pathIMGlocal = pathImg;
    /////////////////////////////////////////
    if (!pathIMGlocal) {
      MongoClient.connect(constAPI.DATABASE_URL, function (err, db) {
          try {
            db.collection("process_images.files").find({
              UserId: id
            }).toArray(function (err, res) {
              console.log("resresres:", res[res.length - 1].filename);
              pathIMGlocal = res[res.length - 1].filename;
              MongoClient.connect(constAPI.DATABASE_URL, function (err, dbb) {
                try {
                  console.log('workProcessID.workProcessId:::::::', workProcessID.workProcessId);
                  dbb.collection("process").findOneAndUpdate({
                    _id: workProcessID.workProcessId
                  }, {$set: {"imgPath": pathIMGlocal}});
                  dbb.close();
                  botApi.sendMessage(id, 'good! we added img to process');
                } catch (e) {
                  console.log('DB error', e);
                  botApi.sendMessage(id, 'wrong image , please resent, image must be jpeg');
                }
              });
              db.close();
            });
          } catch
            (e) {
            console.log('DB error:*-', e);

          }
        }
      );
      // botApi.sendMessage(id, 'try again!');
      console.log('>>>>SOMETHING WRONG !!!!!!!!!!!!!!!!!!!!!pathIMGlocal:', pathIMGlocal)
    } else {
      MongoClient.connect(constAPI.DATABASE_URL, function (err, dbb) {
        try {
          console.log('workProcessID.workProcessId:::::::', workProcessID.workProcessId);
          dbb.collection("process").findOneAndUpdate({
            _id: new mongo.ObjectID(workProcessID.workProcessId)
          }, {$set: {"imgPath": pathIMGlocal}});
          dbb.close();
          botApi.sendMessage(id, 'good! we added img to process');
        } catch (e) {
          console.log('DB error', e);
          botApi.sendMessage(id, 'wrong image , please resent, image must be jpeg');
        }
      });
    }

    //******FINISH PROCESS
    // let file = fs.readFileSync('./ApiBot/sss.jpg');
    setTimeout(() => {
      idProcess.map(process => {
        if (process.workProcessId === workProcessID.workProcessId && process.id === id) {
          console.log('******************');
          MongoClient.connect(constAPI.DATABASE_URL, function (err, db) {
            if (err) throw err;
            console.log('Connected to process collection established!');
            let problemS = process.messageFormClientToPartner.match(constAPI.FILTER_PROBLEM);
            let cleanProblem = problemS[0].replace(/PROBLEM:/g, '');

            let collection = db.collection('process');
            try {
              collection.findOne({"problem": cleanProblem}).then((res, err) => {
                if (err) throw err;
                // console.log('RESSSSS!!: ', res);
                if (res.partnerStarted === id) {
                  console.log('INCLUDE PROBLEM !!!!!!!!!!!!!!!!');
                  try {
                    MongoClient.connect(constAPI.DATABASE_URL, function (err, db) {
                      if (err) throw err;
                      console.log('Connected to process collection established!');
                      let collection = db.collection('done_process');
                      res['finish_data'] = constAPI.staticFunction.getDateNow();
                      res['finish_partnerID'] = id;
                      collection.insertOne(res, function (err, r) {
                        if (err) throw err;
                        db.close();
                      })
                    });

                  } catch (e) {
                    console.log('ERROR:::', e)
                  }
                }
                else {
                  console.log('WTF');
                }
              });
              db.collection('process').deleteOne({"partnerStarted": id}, function (err, res) {
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
              }, {$pull: {work_process_id: process.workProcessId}});
              db.close();
            } catch (e) {
              console.log('DB error', e);
            }
          });
          MongoClient.connect(constAPI.DATABASE_URL, function (err, db) {
            if (err) throw err;
            try {
              db.collection('idProcess').removeMany();
              db.close();
            } catch (e) {
              console.log('ERROR Remove:::', e);
            }
          });
          let idProcessLocal = [];
          idProcess.map(process => {
            idProcessLocal = idProcess.filter(proc => proc.workProcessId !== process.workProcessId);
          });
          idProcess = idProcessLocal;
          MongoClient.connect(constAPI.DATABASE_URL, function (err, db) {
            if (err) throw err;
            try {
              db.collection('idProcess').insertMany(idProcess);
              db.close();
            } catch (e) {
              console.log('ERROR INSERTMANY to IDPROCESS:::', e);
            }
          });
          botApi.sendMessage(id, 'Good job !!! ');
        }
      });
    }, 1000);
  }
}

module.exports = TelegramApi;