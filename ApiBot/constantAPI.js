export const DATABASE_URL = 'mongodb://localhost:27017/test12';
export const TelegramBot = require('node-telegram-bot-api');
export const configApi = require('./conf.json');
export const COMMAND_FORWARD = 'forward';
export const COMMAND_REPLAY = 'reply';
export const COMMAND_EDIT = 'edit';
export const COMMAND_DELETE = 'delete';
export const COMMAND_YES = 'yes';
export const COMMAND_FINISH = 'finish';

export const inline_keyboard = [
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

export const process_step = [
  [
    {
      text: 'FINISH Please send photo invoice!',
      callback_data: COMMAND_FINISH
    }
  ]
];
export const FILTER_PROBLEM =  /PROBLEM:[a-zA-Z 1-9]*/;