import { connect, LocalTrack, Room } from 'twilio-video';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ReplaySubject , Observable } from 'rxjs';
import { ConnectOptions, CreateLocalTrackOptions, CreateLocalTracksOptions } from 'twilio-video/tsdef/types';

interface AuthToken {
    token: string;
    identity?: string;
    conversation_sid?: string;
    participant_sid?: string;
}

@Injectable()
export class VideoChatService {
    
    private authToken: AuthToken;

    constructor(private readonly http: HttpClient) {
    }

    public getAuthToken() {
        return this.authToken;
    }

    private async authenticate(serverUrl: string, identity: string) {
        const auth =
            await this.http
                      .get<AuthToken>(`${serverUrl}/api/video/token?identity=${identity}&roomName=room2`)
                      .toPromise()

        return auth;
    }

    async joinRoom(serverUrl: string, identity: string, tracks: LocalTrack[]) {
        let room: Room = null;
        try {
            this.authToken = await this.authenticate(serverUrl, identity);


            /*const LocalTrackOptions: CreateLocalTrackOptions = {
                height: 720, frameRate: 24, width: 1280
            };

            const connectOptions: ConnectOptions = {
                // Comment this line if you are playing music.
                maxAudioBitrate: 16000,
                // Capture 720p video @ 24 fps.
                video: true
            };*/
            
            // Add the specified video device ID to ConnectOptions.
            //connectOptions.video.deviceId = { exact: deviceIds.video };

            room = await connect(this.authToken.token, {logLevel: 'debug', tracks: tracks});
        } catch (error) {
            alert(`Unable to connect to Room: ${error.message}`);
        }

        return room;
    }
}