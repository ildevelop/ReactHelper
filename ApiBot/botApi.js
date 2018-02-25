var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var url = 'mongodb://localhost:27017/test12';

const TelegramBot = require('node-telegram-bot-api');
const configApi = require('./conf.json');
const bot = new TelegramBot(configApi.telegram.token, {polling: true});

const KEYBOARD_COMAND = '/keyboard';
const KEYBOARD_COMAND_SHOW = 'show';
const KEYBOARD_COMAND_HIDE = 'hide';
const KEYBOARD_COMAND_INLINE = 'inline';
const COMAND_ADD = '/add';

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
]

bot.onText(/\/add (.+)/, (msg, match) => {
  const {from: {id}} = msg;
  const newvalues = {$set: {chat_id: id}};
  const resp = match[1]; // the captured "whatever"
  // console.log('msg', msg);
  var arr = resp.split(' ');
  console.log('resp', arr);
  if (resp && !msg.from.is_bot) {
    var foundAccount;
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      console.log("id", id);
      foundAccount = db.collection("partners").findOneAndUpdate({fname: arr[0], sname: arr[1]}, {$set: {"chatId": id}},
        {
          returnNewDocument: true,
        });
    });
    // setTimeout(console.log('finded',foundAccount ),2000)
  }
  else {
    bot.sendMessage(id, 'wrong name, please resent the full name of partner !');
  }
});
bot.onText(/\/keyboard (.+)/, (msg, match) => {
  const {from: {id}} = msg;
  const resp = match[1]; // the captured "whatever"
  console.log('msg', msg);

  console.log('resp', resp);

  switch (resp) {
    case KEYBOARD_COMAND_SHOW:
      console.log('SHOW:');
      bot.sendMessage(id, 'Showing a keyboard', {
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
      bot.sendMessage(id, 'Hiding a keyboard', {
        reply_markup: {
          remove_keyboard: true
        }
      });
      break;
    case KEYBOARD_COMAND_INLINE:
      console.log('INLINE:');
      bot.sendMessage(id, 'InLine keybord is below', {
        reply_markup: {
          inline_keyboard
        }
      });
      break;
    default:
      bot.sendMessage(id, 'Invalid input')
  }
});

bot.on('message', (msg) => {
  const {from: {id}} = msg;
  // bot.sendMessage(id, msg.text);
  if (msg.text === '/add' || msg.text === '/add ') {
    bot.sendMessage(id, 'wrong name, please resent the full name of partner !');
  }
});
bot.on('callback_query', query => {
  console.log('query', query);
  const {message: {chat, message_id, text}} = query;

  switch (query.data) {
    case COMMAND_FORWARD:
      bot.forwardMessage(chat.id, chat.id, message_id);
      break;
    case COMMAND_REPLAY:
      bot.sendMessage(chat.id, 'Reply to message', {
        reply_to_message_id: message_id
      });
      break;
    case COMMAND_EDIT:
      bot.editMessageText(`${text}(edited)`, {
        chat_id: chat.id,
        message_id: message_id,
        reply_markup: {inline_keyboard}
      });
      break;
    case COMMAND_DELETE:
      bot.deleteMessage(chat.id, message_id);
      break;
  }
  bot.answerCallbackQuery({callback_query_id: query.id})
});

bot.onText(/\/echo (.+)/, (msg, match) => {
  const {chat: {id}} = msg;
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(id, resp);
});
// Listen for any kind of message. There are different kinds of
// messages.
// bot.on('message', (msg) => {
//   const {chat: {id}} = msg;
//
//   console.log('msg', msg);
//   // send a message to the chat acknowledging receipt of their message
//   bot.sendMessage(id, msg.text);
// });



