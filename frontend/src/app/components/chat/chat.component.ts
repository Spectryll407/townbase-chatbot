import { Component } from '@angular/core';
import { ChatService } from '../../services/chat.service';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  messages: Message[] = [];
  inputMessage: string = '';
  loading = false;

  constructor(private chatService: ChatService) {}

  sendMessage() {
    if (!this.inputMessage.trim()) return;

    const userMessage: Message = { sender: 'user', text: this.inputMessage };
    this.messages.push(userMessage);

    this.loading = true;
    this.chatService.askBot(this.inputMessage).subscribe({
      next: (res) => {
        const reply = res.reply;
        let text = reply;

        if (res.events && res.events.length > 0) {
          text += '\n\n' + res.events.map(
            e => `🎟 ${e.name} (${e.start})\n${e.location || ''}\n${e.url || ''}`
          ).join('\n\n');
        }

        const botMessage: Message = { sender: 'bot', text };
        this.messages.push(botMessage);
        this.loading = false;
      },
      error: () => {
        this.messages.push({ sender: 'bot', text: '⚠️ Error contacting server' });
        this.loading = false;
      }
    });

    this.inputMessage = '';
  }
}
