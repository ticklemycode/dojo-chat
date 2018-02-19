const events = {
  NEW_MESSAGE : '[client emits] new message',
  SEND_MESSAGE : '[server emits] send message',
  SEND_USERNAMES: '[server emit] usernames',
  NEW_USER: '[client emits] new user',
  DISCONNECT : 'disconnect'
}

module.exports = events;