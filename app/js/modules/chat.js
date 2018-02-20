import io from '../../../node_modules/socket.io-client/dist/socket.io';
import EVENTS from '../../../server/events';

const API_URL = 'https://randomuser.me/api/';

export class ChatService {

  constructor(options){
    this.input = options.input;
    this.chatOutlet = options.chatOutlet;
    this.usersOutlet = options.usersOutlet;
    this.chatForm = options.chatForm;
    this.joinForm = options.joinForm;
    this.randomUserImg = options.randomUserImg;
    this.username = options.username;
    this.error = options.error;

    this.randomUserImgUrl;

    /** Un-comment if running as a standalone service */
    
    // UPDATE IF IP CHANGES!!!!!!!!!!!!!!!
    this.socket = io.connect('http://ticklemycode.io/');
    
    /** START for Express Server */
    // this.socket = io();
    /** END for Express Server */

    this.onInit();
  }


  /**
   * addMessage
   * Adds chat message to chat outlet
   * @param {{msg:string,img:string,time:string,username:string}} data: 
   */
  addMessage(data) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', data.img, true);
    xhr.responseType = 'blob';
    xhr.onload = (e) => {
      let img = window.URL.createObjectURL(xhr.response);
      let chatWindow = document.querySelector('#chat-outlet');
      chatWindow.insertAdjacentHTML('beforeend', this.msgTemplate(data, img));
    
      // scroll to bottom of chat window
      chatWindow.scrollTop = this.chatOutlet.scrollHeight;
    };

    xhr.send();
  }

  /**
   * addUsers
   * Adds users to active users outlet
   * @param {[]} users 
   */
  addUsers(users) {
    this.usersOutlet.innerHTML = '';
    users.forEach((user) => {
      this.usersOutlet.insertAdjacentHTML('beforeend', this.userTemplate(user));
    });
  }


  /**
   * showChat
   * show chat area and high join form
   */
  showChat() {
    $('#join-chat').style.display = 'none';
    $('#chat').style.display = 'flex';
  }


  /**
   * setRandomImage
   * Fetches random image for user
   */
  setRandomImage() {    
    // TODO: choose gender `&gender=<male|female>`
    return fetch(`${API_URL}?inc=picture`)
    .then((resp) => resp.json())
    .then((data) => {
      this.randomUserImgUrl = data.results[0].picture.large;
      var xhr = new XMLHttpRequest();
      xhr.open('GET', data.results[0].picture.large, true);
      xhr.responseType = 'blob';
      xhr.onload = function(e) {
        document.querySelector('#random-user-img').src = window.URL.createObjectURL(this.response);
      };

      xhr.send();
    });
  }

  /**
   * msgTemplate
   * @param {{img:string,username:string,time:string,msg:string}} data 
   */
  msgTemplate(data, img) {
    return `
    <li class="media">
      <img class="mr-3 rounded-circle" src="${img}" alt="Person">
      <div class="media-body">
        <h6>${data.username} <small class="time">${data.time}</small></h6>
        ${data.msg}
      </div>
    </li>
    `;
  }


  /**
   * userTemplate
   * @param {string} user 
   */
  userTemplate(user) {
    return `
      <li class="media">
        <div class="media-body">
          <h6>${user}</h6>
        </div>
      </li>
    `;
  }


  /**
   * socketEventListeners
   * Listens for emitted events from server (socket)
   */
  socketEventListeners() {
    this.socket.on(EVENTS.NEW_MESSAGE, (data) => {
      this.addMessage(data);
    });

    this.socket.on(EVENTS.SEND_USERNAMES, (usernames) => {
      this.addUsers(usernames);
    });
  }



  /**
   * socketEventEmitters
   * Emits events to server (socket)
   */
  socketEventEmitters() {

    // submitting join form
    this.joinForm.addEventListener('submit', (e)=> {
      e.preventDefault();

      // with acknowledgement callback
      this.socket.emit(EVENTS.NEW_USER, this.username.value, (cbData) => {
        this.error.style.display = 'none';
        if(cbData){
          this.showChat();
        } else {
          this.error.innerHTML = 'Username already take... sowwy';
          this.error.style.display = 'block';
        }
      });
    });


    // submitting chat form
    this.chatForm.addEventListener('submit', (e)=> {
      e.preventDefault();
      
      this.socket.emit(EVENTS.SEND_MESSAGE, {
        msg: this.input.value,
        img: this.randomUserImgUrl
      });

      this.input.value = '';
    });
  }


  /**
   * onInit
   * Initialize chat service
   */
  onInit() {
    // events from server
    this.socketEventListeners();

    // events to server
    this.socketEventEmitters();

    // set random image
    this.setRandomImage();
  }
}