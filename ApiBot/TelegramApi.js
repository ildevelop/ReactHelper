const TelegramBot = require('node-telegram-bot-api');
const configApi = require('./conf.json');
let mongo = require('mongodb');
let MongoClient = mongo.MongoClient;

const DATABASE_URL = 'mongodb://localhost:27017/test12';

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

  getTelegramControllers() {
    return {
      'add_category': {
        'function': this.addCategory,
        'regex': /\/add_category (.+)/
    }}
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
          this.api.sendMessage(id, 'good! we added ' + categories[0]);
        } catch (e) {
          console.log(e);
          this.api.sendMessage(id, 'wrong name, please resent the categories! in one string');
        }

      });
    }
    else {
      this.api.sendMessage(id, 'wrong name, please resent the categories! in one string');
    }
  }

  // addControllers(controllers) {
  //   controllers.forEach(controller => {
  //     this.api.onText(controller)
  //   })
  // }
}
module.exports = TelegramApi;