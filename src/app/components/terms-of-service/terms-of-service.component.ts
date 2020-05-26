import { GetServerDataService } from './../../services/getServerData.service';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { faTimes, faWindowClose } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-terms-of-service',
  templateUrl: './terms-of-service.component.html',
  styleUrls: ['./terms-of-service.component.scss'],
})
export class TermsOfServiceComponent implements OnInit {
  faTimes = faTimes;
  faWindowClose = faWindowClose;
  termsOfService = '';
  showSpinner = false;
  constructor(
    private location: Location,
    private getServiceData: GetServerDataService
  ) {}

  ngOnInit(): void {
    this.termsOfService = this.getServiceData.getTermsOfService();
  }
  closeClicked() {
    this.location.back();
  }
}
