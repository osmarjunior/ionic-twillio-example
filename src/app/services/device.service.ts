import { Injectable } from '@angular/core';
import { ReplaySubject, Observable } from 'rxjs';
import { LocalAudioTrack, LocalVideoTrack } from 'twilio-video';

export type Devices = MediaDeviceInfo[];

@Injectable()
export class DeviceService {
    $devicesUpdated: Observable<Promise<Devices>>;

    private deviceBroadcast = new ReplaySubject<Promise<Devices>>();

    constructor() {
        if (navigator && navigator.mediaDevices) {
            navigator.mediaDevices.ondevicechange = (_: Event) => {
                this.deviceBroadcast.next(this.getDeviceOptions());
            }
        }

        this.$devicesUpdated = this.deviceBroadcast.asObservable();
        this.deviceBroadcast.next(this.getDeviceOptions());
    }

    private async isGrantedMediaPermissions() {
        if (navigator && navigator.userAgent && navigator.userAgent.indexOf('Chrome') < 0) {
            return true; // Follows standard workflow for non-Chrome browsers.
        }

        if (navigator && navigator['permissions']) {
            try {
                const result = await navigator['permissions'].query({ name: 'camera' });
                alert('result ' + result);
                if (result) {
                    if (result.state === 'granted') {
                        return true;
                    } else {
                        const isGranted = await new Promise<boolean>(resolve => {
                            result.onchange = (_: Event) => {
                                const granted = _.target['state'] === 'granted';
                                if (granted) {
                                    resolve(true);
                                }
                            }
                        });

                        return isGranted;
                    }
                }
            } catch (e) {
                // This is only currently supported in Chrome.
                // https://stackoverflow.com/a/53155894/2410379
                return true;
            }
        }

        return false;
    }

    public async getDeviceOptions(): Promise<Devices> {
        const isGranted = await this.isGrantedMediaPermissions();
        if (navigator && navigator.mediaDevices && isGranted) {
            let devices = await this.tryGetDevices();
            if (devices.every(d => !d.label)) {
                devices = await this.tryGetDevices();
            }
            return devices.filter(d => !!d.label);
        }

        return null;
    }

    public async getTracksIOS() {
        console.log('getTracksIOS');
        const constraints = { audio: true, video: true };

        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        console.log(mediaStream);
        const tracks = mediaStream.getTracks().map(track => {
            console.log(track);
            track.kind === 'audio' ? new LocalAudioTrack(track) : new LocalVideoTrack(track)
        });

        console.log(tracks);
    }

    private async tryGetDevices() {
        const mediaDevices = await navigator.mediaDevices.enumerateDevices();
        const devices = ['audioinput', 'audiooutput', 'videoinput'].reduce((options, kind) => {
            return options[kind] = mediaDevices.filter(device => device.kind === kind);
        }, [] as Devices);

        return devices;
    }
}