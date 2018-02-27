const TelegramBot = require('node-telegram-bot-api');
const configApi = require('./conf.json');
class TelegramApi{
  constructor(){
    this.api = null;
  }
  init() {
    try {
      this.api = new TelegramBot(configApi.telegram.token, {polling: true});
    }
    catch(ex){
      return false;
    }
    return true;
  }

}
module.exports = TelegramApi;