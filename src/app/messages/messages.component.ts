import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from '../model/message';
import { tap } from 'rxjs/operators';
import { MessagesService } from './messages.service';

@Component({
  selector: 'messages',
  template: `
    <ng-container *ngIf="errors$ | async as errors">
      <div class="messages-container" *ngIf="showMessages">
        <div class="message" *ngFor="let error of errors">
          {{ error }}
          <mat-icon class="close" (click)="onClose()">close</mat-icon>
        </div>
      </div>
    </ng-container>
  `,
  styleUrls: ['./messages.component.css'],
})
export class MessagesComponent implements OnInit {
  showMessages = false;

  errors$: Observable<string[]>;
  constructor(public messagesService: MessagesService) {
    console.log('init mess');
  }

  ngOnInit() {
    this.errors$ = this.messagesService.errors$.pipe(tap(() => (this.showMessages = true)));
  }

  onClose() {
    this.showMessages = false;
  }
}
