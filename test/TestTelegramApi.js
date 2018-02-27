import 'babel-polyfill';
import TelegramApi from '../ApiBot/TelegramApi.js';
import assert from 'assert';

let telegramApi = new TelegramApi();
describe('TestTelegramApi() Create Telegram interface chat', function() {

  beforeEach(function() {
     telegramApi = new TelegramApi();
  });

  it('what am i testing..', function() {
    let didIitialSuccessfully = telegramApi.init();
    assert.equal(didIitialSuccessfully, true);
  });
  // test cases
});