const TelegramBot = require('node-telegram-bot-api');
const configApi = require('./conf.json');
const bot = new TelegramBot(configApi.telegram.token, {polling: true});

const KEYBOARD_COMAND = '/keyboard';




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
bot.on('message', (msg) => {
  const {chat: {id}} = msg;

  console.log('msg', msg);
  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(id, msg.text);
});



