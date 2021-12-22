import { EventEmitter } from '@angular/core';

export class ChatEvents {
    private receivedMessageEventEmitter: EventEmitter<any>;

    constructor() {
        this.receivedMessageEventEmitter = new EventEmitter<any>();
    }

    public emitMessageReceived(data : any) {
        this.receivedMessageEventEmitter.emit(data);
    }

    public getReceivedMessageEventEmitter() {
        return this.receivedMessageEventEmitter;
    }
}