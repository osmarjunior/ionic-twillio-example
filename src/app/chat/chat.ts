import { Component, ContentChild, ElementRef, Input, ViewChild } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ChatEvents } from './chat.events';

export class ChatMessage {
    messageId: string;
    userId: string;
    userName: string;
    userAvatar: string;
    toUserId: string;
    time: number | string;
    message: string;
    status: string;
}

export class UserInfo {
    id: string;
    name?: string;
    avatar?: string;
}

@Component({
    selector: 'page-chat',
    templateUrl: './chat.html',
    styleUrls: ['./chat.scss']
})
export class Chat {

    @Input() chatEvents: ChatEvents;
    @Input() conversation: any;

    @ViewChild(ContentChild, { static: false }) content: ContentChild;
    @ViewChild('chat_input', { static: false }) messageInput: ElementRef;
    msgList: ChatMessage[] = [];
    user: UserInfo;
    toUser: UserInfo;
    editorMsg = '';
    showEmojiPicker = false;

    constructor(private navParams: NavParams, private modalCtrl: ModalController) {
        
        this.toUser = {
            id: '210000198410281948',
            name: 'User2'
        };

        this.user = {
            id: navParams.get('participanteSid'),
            name: navParams.get('identity')
        };

        const messages: any[] = this.navParams.get('messages');
        if(messages) {
            messages.forEach(message => {

                let newMsg: ChatMessage = {
                    messageId: message.sid,
                    userId: message.participantSid,
                    userName: message.author,
                    userAvatar: this.user.avatar,
                    toUserId: this.toUser.id,
                    time: message.dateCreated,
                    message: message.body,
                    status: 'success'
                };
    
                this.pushNewMsg(newMsg);
            });
        }
    }

    onKeydown(event) {
        if (event.key === "Enter") {
            this.sendMsg();
        } else {
            this.conversation.typing();
        }
    }

    closeModal() {
        this.modalCtrl.dismiss();
    }

    ionViewWillEnter() {
        this.chatEvents.getReceivedMessageEventEmitter().subscribe(message => {

            let newMsg: ChatMessage = {
                messageId: message.sid,
                userId: message.participantSid,
                userName: message.author,
                userAvatar: this.user.avatar,
                toUserId: '9999999',
                time: message.dateCreated,
                message: message.body,
                status: 'success'
            };

            this.pushNewMsg(newMsg);
        });
    }

    ionViewDidEnter() {
        //get message list
        this.getMsg();

        // Subscribe to received  new message events
        /*this.events.subscribe('chat:received', msg => {
          this.pushNewMsg(msg);
        })*/
    }

    onFocus() {
        this.showEmojiPicker = false;
        //this.content.resize();
        this.scrollToBottom();
    }

    /**
     * @name getMsg
     * @returns {Promise<ChatMessage[]>}
     */
    getMsg() {

        /*this.msgList = [
            {
                messageId: Date.now().toString(),
                userId: '210000198410281948',
                userName: 'User1',
                userAvatar: './assets/to-user.jpg',
                toUserId: '140000198202211138',
                time: Date.now(),
                message: 'Hi',
                status: 'success'
            },
            {
                messageId: Date.now().toString(),
                userId: '140000198202211138',
                userName: 'User2',
                userAvatar: './assets/to-user.jpg',
                toUserId: '210000198410281948',
                time: Date.now(),
                message: 'Hello',
                status: 'success'
            }
        ];*/

        // Get mock message list
        /*return this.chatService
        .getMsgList()
        .subscribe(res => {
          this.msgList = res;
          this.scrollToBottom();
        });*/
    }

    /**
     * @name sendMsg
     */
    sendMsg() {
        if (!this.editorMsg.trim()) return;

        // Mock message
        const id = Date.now().toString();
        let newMsg: ChatMessage = {
            messageId: Date.now().toString(),
            userId: this.user.id,
            userName: this.user.name,
            userAvatar: this.user.avatar,
            toUserId: this.toUser.id,
            time: Date.now(),
            message: this.editorMsg,
            status: 'pending'
        };

        //this.pushNewMsg(newMsg);
        this.conversation.sendMessage(this.editorMsg);
        this.editorMsg = '';

        if (!this.showEmojiPicker) {
            this.focus();
        }

        /*this.chatService.sendMsg(newMsg)
        .then(() => {
          let index = this.getMsgIndexById(id);
          if (index !== -1) {
            this.msgList[index].status = 'success';
          }
        })*/
    }

    /**
     * @name pushNewMsg
     * @param msg
     */
    pushNewMsg(msg: ChatMessage) {
        const userId = this.user.id,
            toUserId = this.toUser.id;
        // Verify user relationships
 /*       if (msg.userId === userId && msg.toUserId === toUserId) {
            this.msgList.push(msg);
        } else if (msg.toUserId === userId && msg.userId === toUserId) {
            this.msgList.push(msg);
        }*/
        this.msgList.push(msg);
        this.scrollToBottom();
    }

    getMsgIndexById(id: string) {
        return this.msgList.findIndex(e => e.messageId === id)
    }

    scrollToBottom() {
        setTimeout(() => {
            /*if (this.content.scrollToBottom) {
              this.content.scrollToBottom();
            }*/
        }, 400)
    }

    private focus() {
        if (this.messageInput && this.messageInput.nativeElement) {
            this.messageInput.nativeElement.focus();
        }
    }

    private setTextareaScroll() {
        const textarea = this.messageInput.nativeElement;
        textarea.scrollTop = textarea.scrollHeight;
    }
}