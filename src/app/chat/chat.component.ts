import { Component } from '@angular/core';
import { API_KEY_CONF } from '../config/api';
import { GeminiConfig } from '../config/gemini.config';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent {
  constructor() {
   }
  messages: any = []
  title: any = ''
  chatId: string = ''
  chatHistory: any = localStorage.getItem('chatHistory') ? JSON.parse(localStorage.getItem('chatHistory')!) : [];
  geminiConfig: GeminiConfig = {
    apiKey: API_KEY_CONF,
    temperature: 0.7,
    bot: {
      id: 0,
      value: 'AITA'
    },
    model: 'gemini-1.0-pro-001'
  }
  parentFunction(id: any) {
    if (id) {
      this.chatId = id;
      const chats = this.chatHistory.find((messages: any) => messages["id"] == id)
      this.messages = chats?.message
    }
  }
  newChat(id: any) {
    console.log(this.chatHistory, id)
    this.chatHistory.push({
      id: id,
      title: 'new chat',
      message: []
    })
    this.messages = this.chatHistory[this.chatHistory.length - 1].message
    this.chatId = id;
  }
  addTitle(prompt: any) {
    let title = this.chatHistory.find((messages: any) => messages["id"] == this.chatId).title
    if (title === 'new chat')
      this.chatHistory.find((messages: any) => messages["id"] == this.chatId).title = prompt.split(" ").splice(0, 3).join(" ");
  }
  updateCharacter (event:any) {
      this.geminiConfig.bot.value = event;
  }
}
