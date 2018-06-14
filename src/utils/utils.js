function isPC () {
  var userAgentInfo = navigator.userAgent;
  var Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
  var flag = true;
  for (var v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }
  }
  return flag;
}

const token = {
  AK: 'naedy_dHVnwdxlUhekA9KmdPq__FUbcejvrDJiDl',
  SK: 'jxlfEmY-i5E_mYYD6mqh4FlXr6cebeIW58uoYgJb'
};

export {
  isPC,
  token
};
