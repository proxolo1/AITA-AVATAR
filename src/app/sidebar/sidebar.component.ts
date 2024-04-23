import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import ChatHistories from '../shared/models/chat-histories.model';
import { ChatCompletionRequestMessage } from 'openai';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  constructor(
  ) {
  }
  
   characterSelection = [
    { id: 0,
      value: "AI Teaching Assistant"
    },
    {
      id: 1,
      value: "GEMINI"
    }
  ]
  messages: ChatCompletionRequestMessage[] = [];
  @Input() history:any;
  chatHistories: ChatHistories = {
    chatHistoryDetails: [],
  };
  apiKey: string = '';
  selectedOption:string = ''
  isHistoricalChat: boolean = false;
  @Output() callParentFunction = new EventEmitter<void>();
  @Output() addNewChatFunction = new EventEmitter<void>();
  @Output() updateCharacter = new EventEmitter<string>();
  ngOnInit(): void {
    this.addNewChat();
  }
  async addNewChat() {
    const id: any = uuidv4();
   this.addNewChatFunction.emit(id);
  }

  getHistoryChatMessages(id: any) {
    this.callParentFunction.emit(id);
  }

  getCurrentChatHistoriesFromLocalStorage(): ChatHistories {
    const currentHistories = localStorage.getItem('chatHistories');

    if (currentHistories) {
      const histories = JSON.parse(currentHistories) as ChatHistories;
      return {
        chatHistoryDetails: histories.chatHistoryDetails,
      };
    }

    return {
      chatHistoryDetails: [],
    };
  }

  setChatHistoriesToLocalStorage(chatHistories: ChatHistories) {
    localStorage.setItem('chatHistories', JSON.stringify(chatHistories));
  }

  deleteHistoricalChat(id: string) {
    this.chatHistories.chatHistoryDetails =
      this.chatHistories.chatHistoryDetails.filter((c) => c.id !== id);

    this.setChatHistoriesToLocalStorage(this.chatHistories);
  }
  onSelectionChange(event:Event){
    console.log((event.target as HTMLSelectElement).value)
    this.updateCharacter.emit((event.target as HTMLSelectElement).value);
  }
}
