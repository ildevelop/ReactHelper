import 'babel-polyfill';
import TelegramApi from '../ApiBot/TelegramApi.js';
import chai from 'chai';
import assert from 'assert';

let telegramApi = new TelegramApi();
describe('TestTelegramApi() Create Telegram interface chat', function() {

  beforeEach(function() {
     telegramApi = new TelegramApi();
  });

  it('init method in TelegramApi.init() ', function() {
    let didIitialSuccessfully = telegramApi.init();
    assert.equal(telegramApi.api !== null, true);
    assert.equal(didIitialSuccessfully, true);
  });
  it('add functionality to TelegramApi', function() {
    telegramApi.init();
    let controllers = telegramApi.getTelegramControllers('add_category');
    assert.ok(controllers['add_category'] !== undefined);
    // telegramApi.addControllers(controllers);
  });
  // test cases
});