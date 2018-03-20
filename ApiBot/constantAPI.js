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
const constAPI = {
  DATABASE_URL: DATABASE_URL,
  TelegramBot: TelegramBot,
  configApi: configApi,
  COMMAND_DELETE: COMMAND_DELETE,
  COMMAND_FINISH: COMMAND_FINISH,
  COMMAND_EDIT: COMMAND_EDIT,
  COMMAND_REPLAY: COMMAND_REPLAY,
  COMMAND_FORWARD: COMMAND_FORWARD,
  COMMAND_YES: COMMAND_YES,
  inline_keyboard: inline_keyboard,
  process_step: process_step,
  FILTER_PROBLEM: FILTER_PROBLEM
};
module.exports = constAPI;