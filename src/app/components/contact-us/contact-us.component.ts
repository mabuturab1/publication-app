import { GetServerDataService } from './../../services/getServerData.service';
import { Location } from '@angular/common';
import { PublicationDataService } from 'src/app/services/publication-data.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  faTimes,
  faPaperPlane,
  faBan,
} from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss'],
})
export class ContactUsComponent implements OnInit {
  dropdownList = ['Feedback', 'Query'];
  buttonLabel = 'Feedback';
  faTimes = faTimes;
  faPaperPlane = faPaperPlane;
  faBan = faBan;
  message = '';
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
    this.getServerDataService.isLoggedIn.subscribe((el) => {
      if (!el) {
        this.getServerDataService.setSnackbarMessage(
          'Kindly login to your account'
        );
        this.closeClicked();
      }
    });
    let publication = this.publicationService.getCurrentNeededPublication();
    if (publication != null) {
      this.message =
        'I would like you to include the following publication in the database' +
        JSON.stringify(publication);
    }
    this.publicationService.setCurrentNeededPublication(null);
  }
  closeClicked() {
    // this.location.back();
    this.router.navigate(['']);
  }
  sendMessage() {
    console.log('sending message');
    this.getServerDataService.setUserResponse(
      { subject: this.buttonLabel, message: this.message },
      (data) => {
        this.getServerDataService.setSnackbarMessage(
          'Thanks for contacting us. We will getback to you'
        );
        this.closeClicked();
      }
    );
  }
}