import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  Renderer2,
} from '@angular/core';
import { MarkdownService } from 'ngx-markdown';
import { GeminiService } from 'src/app/services/gemini.service';
import { API_KEY_CONF } from 'src/app/config/api';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';
import { convert } from 'html-to-text'
import { GeminiConfig } from 'src/app/config/gemini.config';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { AvatarComponent } from 'src/app/avatar/avatar.component';
@Component({
  selector: 'app-chat-content',
  templateUrl: './chat-content.component.html',
  styleUrls: ['./chat-content.component.css'],
})
export class ChatContentComponent
  implements OnInit, AfterViewChecked, AfterViewInit {
  constructor(
    private markdownService: MarkdownService,
    private gemini: GeminiService,
    private clipBoard: Clipboard,
    private snackBar: MatSnackBar,
    private service: AuthService,
    private dialogBox: MatDialog,
    private renderer: Renderer2,
    private el: ElementRef
  ) { }

  @Input() chatHistory: any;
  @Input() messages: any[] = [];
  @Input() geminiConfig!: GeminiConfig;
  @Output() title = new EventEmitter<string>();
  apiKey: string | null = '';
  isBusy: boolean = false;
  currChatSelected: string = '';
  switchYT: Boolean = false;
  @ViewChild('textInput', { static: true }) textInputRef!: ElementRef;
  @ViewChild('mainChatContainer', { static: false }) mainChatContainer!: ElementRef;
  isCopied: boolean = false;
  messageHistory: any = [];
  ngOnInit(): void {
    this.scrollToBottom();
  }
  ngAfterViewInit() {
    this.textInputRef.nativeElement.focus();
  }
  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  async createCompletion(element: HTMLTextAreaElement) {
    const prompt = element.value;
    if (prompt.length <= 1 || this.isBusy) {
      element.value = '';
      return;
    }
    element.value = '';
    this.scrollToBottom();
    this.title.emit(prompt);
    if (this.switchYT) {
      const message: any = {
        role: 'user',
        parts: prompt,
      };
      this.messages.push(message)
      this.switchYT = !this.switchYT
      this.service.getYoutubeData(prompt).subscribe((res: any) => {
        res.items.forEach((value: any) => {
          const responseMessage: any = {
            role: 'assistant',
            parts: `
            <span> ${value.snippet.title} </span>
            <a href='https://www.youtube.com/watch?v=${value.id.videoId}' target='_blank'>
            <img src='${value.snippet.thumbnails.high.url}'>
            </a>`,
          };
          this.messages.push(responseMessage)
        })
      })
      localStorage.setItem(`chatHistory`, JSON.stringify(this.chatHistory))
      return;
    }
    const geminiHistory = [{
      role: 'user',
      parts: prompt,
    }, {
      role: 'model',
      parts: '',
    }]
    const message: any = {
      role: 'user',
      parts: prompt,
    };
    this.messageHistory.push(geminiHistory);
    this.messages.push(message)
    if (prompt.indexOf('3') !== -1) {
      const responseMessage = {
        role: 'assistant',
        parts: "Please provide the name of the course you want for YouTube.",
      }
      this.messages.push(responseMessage);
      this.switchYT = true;
      return;
    }
    this.isBusy = true;
    this.gemini.generateContentWithGeminiPro(prompt, this.messageHistory, this.geminiConfig)
      .subscribe((data: any) => {
        const completeMessage = this.markdownService.parse(data)
        const responseMessage: any = {
          role: 'assistant',
          parts: completeMessage,
        };
        this.messages.push(responseMessage)
        localStorage.setItem(`chatHistory`, JSON.stringify(this.chatHistory))
        this.isBusy = false;
      }, error => this.snackBar.open(error, 'close'))

  }

  scrollToBottom() {
    try {
      let container = this.el.nativeElement.querySelector('#mainChatContainer');
      const scrollHeight = this.el.nativeElement.querySelector('#mainChatContainer').scrollHeight
      if (scrollHeight) {
        this.renderer.setProperty(
          container,
          'scrollTop',
          scrollHeight
        );
      }

    } catch (err) {
      console.warn(err);
    }
  }
  copyToClipboard(message: any) {
    this.clipBoard.copy(convert(message.parts))
    message.copied = true;
    this.snackBar.open('Copied to clipboard', 'Close', {
      duration: 1000,
    })
    setTimeout(() => {
      message.copied = false;
    }, 3000)
  }
  dialog() {
    this.dialogBox.open(AvatarComponent, {
      data: {
        message:
          "It's not stored in our end, it's only available in your browser localStorage",
        title: 'Please enter your API key',
      },
      width: '100%',
      height: '100%'
    })
  }
}
