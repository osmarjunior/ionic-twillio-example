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
        this.getMsg();
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

        this.conversation.sendMessage(this.editorMsg);
        this.editorMsg = '';

        if (!this.showEmojiPicker) {
            this.focus();
        }
    }

    /**
     * @name pushNewMsg
     * @param msg
     */
    pushNewMsg(msg: ChatMessage) {
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