import { Subscription } from 'rxjs';
import { GetServerDataService } from './../../services/getServerData.service';
import { Location } from '@angular/common';
import { PublicationDataService } from 'src/app/services/publication-data.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {
  faTimes,
  faPaperPlane,
  faBan,
  faCheckSquare,
} from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss'],
})
export class ContactUsComponent implements OnInit, OnDestroy {
  dropdownList = ['Feedback', 'Query'];
  buttonLabel = 'Feedback';
  faTimes = faTimes;
  faPaperPlane = faPaperPlane;
  faBan = faBan;
  faCheckSquare = faCheckSquare;
  message = '';
  messageId = '';
  userEmail = 'user@example.org';
  supportEmail = 'user@example.org';
  messageSent = false;
  errorOccurred = false;
  subscriptionArr: Subscription[] = [];
  constructor(
    private router: Router,
    private publicationService: PublicationDataService,
    private location: Location,
    private getServerDataService: GetServerDataService
  ) {}
  selectionChanged(event: string) {
    this.buttonLabel = event;
  }
  ngOnInit(): void {
    this.subscriptionArr.push(
      this.getServerDataService.isLoggedIn.subscribe((el) => {
        if (!el) {
          this.getServerDataService.setSnackbarMessage(
            'Kindly login to your account'
          );
          this.closeClicked();
        }
      })
    );
    let publication = this.publicationService.getCurrentNeededPublication();
    if (publication != null) {
      this.message =
        this.publicationService.getCustomContactUsText() +
        JSON.stringify(publication);
    }
    this.publicationService.setCurrentNeededPublication(null);
  }
  closeClicked() {
    // this.location.back();
    this.router.navigate(['']);
  }
  sendMessage() {
    this.getServerDataService.setUserResponse(
      { subject: this.buttonLabel, message: this.message },
      (data: any) => {
        if (data == null) {
          this.errorOccurred = true;
          return;
        }

        this.messageSent = true;
        this.messageId = data.message_id;
        // this.closeClicked();
      }
    );
  }
  ngOnDestroy() {
    this.subscriptionArr.forEach((el) => el.unsubscribe());
  }
}
