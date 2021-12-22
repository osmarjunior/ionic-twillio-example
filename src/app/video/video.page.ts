import { Component, ElementRef, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { Chat } from '../chat/chat';
import { ChatEvents } from '../chat/chat.events';
import { ActivatedRoute, Router } from '@angular/router';
import { createLocalAudioTrack, createLocalVideoTrack, LocalAudioTrack, LocalTrack, LocalVideoTrack, RemoteAudioTrack, RemoteParticipant, RemoteTrack, RemoteTrackPublication, RemoteVideoTrack, Room } from 'twilio-video';
import { VideoChatService } from '../services/videochat.service';
import Conversations from '@twilio/conversations';
import { Conversation } from '@twilio/conversations/lib/conversation';
import { DeviceService } from '../services/device.service';
import { Subscription } from 'rxjs';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { debounceTime } from 'rxjs/operators';

//declare var cordova: any

@Component({
  selector: 'app-home',
  templateUrl: 'video.page.html',
  styleUrls: ['video.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VideoPage implements OnInit {

  @ViewChild('remoteMedia', { static: false }) remoteMediaRef: ElementRef;

  activeRoom: Room;
  activeChat: Conversations;
  activeConversation: Conversation;
  identity: string;
  conversationSid: string;
  muted: boolean;
  chatEvents: ChatEvents;
  chatMessages: any = [];
  participanteSid: any;
  server_add: any;
  loading: boolean = false;
  private subscription: Subscription;
  private devices: MediaDeviceInfo[] = [];
  selectedId: string;

  constructor(
    private videoChatService: VideoChatService,
    private modalController: ModalController,
    private route: ActivatedRoute,
    private router: Router,
    private readonly renderer: Renderer2,
    private deviceService: DeviceService,
    private diagnostic: Diagnostic,
    private platform: Platform) {
    this.route.queryParams.subscribe(params => {
      if (params) {
        this.server_add = params.server_add;
        this.identity = params.name;
      }
    });
  }

  async ngOnInit() {

    /*this.subscription = */
    console.log('ngOnInit1');
    await this.deviceService
        .getDeviceOptions().then
        (async deviceListPromise => {
          this.devices = await deviceListPromise;
          this.handleDeviceAvailabilityChanges();
        });
        console.log('ngOnInit2');
  }

  private handleDeviceAvailabilityChanges() {
    console.log(this.devices);
    this.selectedId = this.devices[0] ? this.devices[0].deviceId : null;
    if (this.devices && this.devices.length && this.selectedId) {
      let videoDevice = this.devices.find(d => d.deviceId === this.selectedId);
      if (!videoDevice) {
        videoDevice = this.devices.find(d => d.kind === 'videoinput');
        if (videoDevice) {
          this.selectedId = videoDevice.deviceId;
        }
      }
    }
  }

  ionViewDidLeave() {
    if (this.activeRoom) {
      this.activeRoom.disconnect();
    }
  }

  async startVideoCall(): Promise<void> {

    if(this.platform.is("desktop")) {
      this.joinVideoChatRoom();
      return;
    }


    let cameraGrant = await this.diagnostic.getCameraAuthorizationStatus(false)
    let microphoneGrant = await this.diagnostic.getMicrophoneAuthorizationStatus()

    if (cameraGrant === this.diagnostic.permissionStatus.GRANTED && microphoneGrant === this.diagnostic.permissionStatus.GRANTED) {
      this.joinVideoChatRoom();
    } else {
      const permissions = [];

      if (cameraGrant != this.diagnostic.permissionStatus.GRANTED) {
        permissions.push(this.diagnostic.permission.CAMERA)
      }

      if (microphoneGrant != this.diagnostic.permissionStatus.GRANTED) {
        permissions.push(this.diagnostic.permission.RECORD_AUDIO)
      }

      if (this.platform.is('android')) {
        await this.diagnostic.requestRuntimePermissions(permissions)
      } else {
        if (permissions.includes(this.diagnostic.permission.CAMERA)) {
          await this.diagnostic.requestCameraAuthorization(false)
        }

        if (permissions.includes(this.diagnostic.permission.RECORD_AUDIO)) {
          await this.diagnostic.requestMicrophoneAuthorization()
        }
      }
      cameraGrant = await this.diagnostic.getCameraAuthorizationStatus(false)
      microphoneGrant = await this.diagnostic.getMicrophoneAuthorizationStatus()

      if (cameraGrant === this.diagnostic.permissionStatus.GRANTED && microphoneGrant === this.diagnostic.permissionStatus.GRANTED) {
        this.joinVideoChatRoom();
      } else {
        console.log('Você precisa dar permissão para usar a camera e microfone!!');
      }
    }
  }

  public ionViewWillEnter() {
    this.chatEvents = new ChatEvents();
    this.startVideoCall();
  }

  flip() {
    console.log('flip');
  }

  mute() {
    this.muted = !this.muted;
  }

  addMessageToChat(message) {
    this.chatMessages.push(message);
    this.chatEvents.emitMessageReceived(message);
  }

  onEnter(value: string) {
    this.activeConversation.sendMessage(value);
  }

  connectChat(token, conversationSid) {

    return Conversations.create(token).then(_chat => {
      console.log(_chat);
      this.activeChat = _chat;
      return this.activeChat.getConversationBySid(conversationSid).then((_conv) => {
        console.log(_conv);
        this.activeConversation = _conv;
        this.activeConversation.on('messageAdded', (message) => {
          this.addMessageToChat(message);
        });
        return this.activeConversation.getMessages().then((messages) => {
          for (let i = 0; i < messages.items.length; i++) {
            this.addMessageToChat(messages.items[i]);
          }
        });
      });
    }).catch(e => {
      console.log(e);
    });
  };

  async joinVideoChatRoom() {
    this.loading = true;

    let deviceId = this.selectedId;

    console.log(deviceId);
    const tracks = await Promise.all([
      createLocalVideoTrack({deviceId: deviceId}),
      createLocalAudioTrack()
    ]).catch(erro => {
      console.log(erro.message);
      return null;
    });

    console.log(tracks);

    this.activeRoom = await this.videoChatService.joinRoom(this.server_add, this.identity, tracks);
    console.log(this.activeRoom);
    let authToken = this.videoChatService.getAuthToken();
    this.conversationSid = authToken.conversation_sid;
    this.participanteSid = authToken.participant_sid;
    this.activeRoom.participants.forEach(participant => this.registerParticipantEvents(participant));
    this.registerRoomEvents();
    this.loading = false;
    this.connectChat(authToken.token, this.conversationSid);
  }

  private registerRoomEvents() {
    this.activeRoom
      .on('disconnected',
        (room: Room) => {
          console.log('Left...')
          room.localParticipant.tracks.forEach(publication => this.detachLocalTrack(publication.track))
        })
      .on('participantConnected',
        (participant: RemoteParticipant) => this.registerParticipantEvents(participant))
      .on('participantDisconnected',
        (participant: RemoteParticipant) => {
          console.log(`RemoteParticipant '${participant.identity}' left the room`);
          participant.tracks.forEach(track => this.detachRemoteTrack(track.track));
        });
  }

  private registerParticipantEvents(participant: RemoteParticipant) {
    if (participant) {
      participant.tracks.forEach(publication => this.subscribe(publication));
      participant.on('trackPublished', publication => this.subscribe(publication));
      participant.on('trackUnpublished',
        publication => {
          if (publication && publication.track) {
            this.detachRemoteTrack(publication.track);
          }
        });
    }
  }

  private subscribe(publication: RemoteTrackPublication | any) {
    if (publication && publication.on) {
      publication.on('subscribed', (track: RemoteTrack) => this.attachRemoteTrack(track));
      publication.on('unsubscribed', (track: RemoteTrack) => this.detachRemoteTrack(track));
    }
  }

  leaveRoom() {
    console.log('Leaving room...');
    this.activeRoom.disconnect();
    this.router.navigate(['/home']);
  }

  async openChat() {
    const modal = await this.modalController.create({
      component: Chat,
      componentProps: {
        identity: this.identity,
        participanteSid: this.participanteSid,
        messages: this.chatMessages,
        'conversation': this.activeConversation,
        'chatEvents': this.chatEvents
      }
    });
    return await modal.present();
  }

  private attachRemoteTrack(track: RemoteTrack) {
    if (this.isAttachable(track)) {
      const element = track.attach();
      this.renderer.data.id = track.sid;
      this.renderer.setStyle(element, 'width', '95%');
      this.renderer.setStyle(element, 'margin-left', '2.5%');
      this.renderer.appendChild(this.remoteMediaRef.nativeElement, element);
    }
  }

  private detachRemoteTrack(track: RemoteTrack) {
    if (this.isDetachable(track)) {
      track.detach().forEach(el => el.remove());
    }
  }

  private detachLocalTrack(track: LocalTrack) {
    if (this.isLocalTrackDetachable(track)) {
      track.detach().forEach(el => el.remove());
    }
  }

  private isLocalTrackDetachable(track: LocalTrack): track is LocalAudioTrack | LocalVideoTrack {
    return !!track
      && ((track as LocalAudioTrack).detach !== undefined
        || (track as LocalVideoTrack).detach !== undefined);
  }

  private isAttachable(track: RemoteTrack): track is RemoteAudioTrack | RemoteVideoTrack {
    return !!track &&
      ((track as RemoteAudioTrack).attach !== undefined ||
        (track as RemoteVideoTrack).attach !== undefined);
  }

  private isDetachable(track: RemoteTrack): track is RemoteAudioTrack | RemoteVideoTrack {
    return !!track &&
      ((track as RemoteAudioTrack).detach !== undefined ||
        (track as RemoteVideoTrack).detach !== undefined);
  }
}