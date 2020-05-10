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
    private location: Location
  ) {}

  ngOnInit(): void {
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
}
