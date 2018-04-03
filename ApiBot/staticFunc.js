'use strict';

function seyHello(name){

    return 'Hello ' + name
}

function getDateNow() {
  let today = new Date();
  let h = today.getHours();
  h = h < 10 ? "0" + h : h;
  let m = today.getMinutes();
  m = m < 10 ? "0" + m : m;
  let date = today.getFullYear() + '-'
    + (today.getMonth() + 1) + '-'
    + today.getDate() + ' '
    + h + ':'
    + m;
  return date;
}

const staticFunc = {
  seyHello:seyHello,
  getDateNow:getDateNow

};
module.exports = staticFunc;