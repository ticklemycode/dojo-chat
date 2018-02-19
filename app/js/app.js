import { HELLO_WORLD } from './modules/hw';
import { ChatService } from './modules/chat';

console.log(`Just want to say, ${HELLO_WORLD}`);

window.$ = document.querySelector.bind(document);

const options = {
  joinForm: $('#join'),
  chatForm: $('#chat-form'),
  input: $('#chat-input'),
  usersOutlet: $('#users-outlet'),
  chatOutlet: $('#chat-outlet'),
  randomUserImg: $('#random-user-img'),
  username: $('#username'),
  error: $('#error')
}

const DojoChat = new ChatService(options);

