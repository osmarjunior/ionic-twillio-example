import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { fromEvent, Observable, Subscription } from 'rxjs';
import * as io from 'socket.io-client';

type StatusAttendance = 'CREATE' | 'CONFIRM' | 'FIND_PROFESSIONAL' | 'PROFESSIONAL_CONFIRM' | 'CHECK_IN' | 'CANCEL';
type statusRequestAttendance = 'in-progress' | 'confirm' | 'cancel';

enum EventsDoctorOnScreenWaitRoom {
  CONNECT = 'connect',
  ATTENDANCE_CREATE = 'ATTENDANCE_CREATED',
  ATTENDANCE_CONFIRM = 'ATTENDANCE_CONFIRM',
  FIVE_MINUTES_FOR_ATTENDANCE = 'FIVE_MINUTES_FOR_ATTENDANCE',
  PROFESSIONAL_CONFIRM = 'PROFESSIONAL_CONFIRM',
  CHECK_IN = 'CHECK_IN',
  AUTHENTICATED = 'authenticated',
  AUTHENTICATE = 'authenticate',
  GET_ACCESS_TOKEN = 'getAccessToken',
  BENEFIT_CONNECT = 'benefitConnect',
  ACCESS_TOKEN = 'accessToken',
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage implements OnInit {

  text_input: any;
  server_response: any;
  socket:any;
  server_add: any = 'http://192.168.1.75:8080'
  name: string;
  private readonly subscriptions: Subscription[] = [];

  public readonly STATUS_REQUEST_ATTENDANCE = {
    CREATE: 'in-progress',
    CONFIRM: 'confirm',
    CANCEL: 'cancel',
  }

  public readonly STATUS_ATTENDANCE = {
    CREATE: 'CREATE',
    CONFIRM: 'CONFIRM',
    FIND_PROFESSIONAL: 'FIND_PROFESSIONAL',
    PROFESSIONAL_CONFIRM: 'PROFESSIONAL_CONFIRM',
    CHECK_IN: 'CHECK_IN',
    CANCEL: 'CANCEL'
  }

  public pageModel: {
    professional?: {
      photo: string;
      name: string;
      specialty: string;
      code: string;
      bio: string;
    }
    attendance: {
      dateTime: {
        formated: string;
        value: Date;
      };
      attendanceId: number;
      externalId: string;
      statusRequest: statusRequestAttendance;
      status: StatusAttendance;
      ciCode: string;
      roomName?: string;
      token?: string;
      benefitName: string;
    }
  }

  constructor(private cdr: ChangeDetectorRef, private router: Router) {
  }

  ngOnInit(): void {

    this.pageModel = {
      attendance: {
        status: 'CREATE',
        statusRequest: 'in-progress',
        attendanceId: 1,
        ciCode: '',
        externalId: '',
        dateTime: {
          formated: '',
          value: new Date()
        },
        benefitName: ''
      }
    }

    this.cdr.detectChanges();
  }

  connectTele() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        name: this.name,
        server_add: this.server_add
      }
    };
    this.router.navigate(['/video'], navigationExtras);
  }

  connect(){
    console.log('connect - ' + this.server_add);
    this.socket = io(this.server_add, {
      rejectUnauthorized: true,
      transports: ['websocket'],
      autoConnect: false,
      reconnectionAttempts: 20,
      reconnectionDelay: 1000
    });

    this.onCheckin();
    this.onProfessionalConfirm();
    //this.Receive();

    console.log('connecting - ' + this.server_add);
    this.socket.connect();
    console.log('connected - ' + this.server_add);

    this.socket.on("connect_error", (error) => {
      alert('connect_error - ' + error);
    });

    this.socket.on("uncaughtException", (error) => {
      alert('uncaughtException - ' + error);
    });
  }

  toHex(str) {
    var result = '';
    for (var i=0; i<str.length; i++) {
      result += str.charCodeAt(i).toString(16);
    }
    return result;
  }

  send(msg) {
    if(msg!='') {
     this.socket.emit('message', this.toHex(msg));
    }
    this.text_input='';
  }

  private setAttendanceCheckIN(response: any) {
    console.log('antes checkin - ' + this.pageModel.attendance.status);
    this.pageModel.attendance.status = 'CHECK_IN';
    this.cdr.detectChanges();
    console.log('depois checkin - ' + this.pageModel.attendance.status);
  }

  fromEvent<T>(event: string): Observable<T> {
    return fromEvent(this.socket, event)
  }

  private onProfessionalConfirm() {
    this.subscriptions.push(this.fromEvent(EventsDoctorOnScreenWaitRoom.PROFESSIONAL_CONFIRM)
      .subscribe({
        next: (response: any) => {
          if (!['CANCEL'].includes(this.pageModel.attendance.status)) {
            this.setProfessionalConfirm(response);
          }
        }
      }))

  }

  private onCheckin() {
    this.subscriptions.push(this.fromEvent(EventsDoctorOnScreenWaitRoom.CHECK_IN)
    .subscribe({
      next: (response: any) => {
        if (!['CANCEL'].includes(this.pageModel.attendance.status)) {
          this.setAttendanceCheckIN(response);
        }
      }
    }))
  }

  private setProfessionalConfirm(response: any) {
    console.log('antes confirm - ' + this.pageModel.attendance.status);
    this.pageModel.attendance.status = this.pageModel.attendance.status !== 'CHECK_IN' ? 'PROFESSIONAL_CONFIRM' : 'CHECK_IN';
    this.cdr.detectChanges();
    console.log('depois confirm - ' + this.pageModel.attendance.status);
  }

  Receive(){
    this.socket.on('message', (msg) => {
      this.server_response = msg;
    });
 }
}
