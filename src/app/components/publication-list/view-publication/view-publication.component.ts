import {
  PUBLICATION_RECORD,
  GetServerDataService,
  PUBLICATION_LIST,
} from './../../../services/getServerData.service';
import {
  PublicationDetails,
  PublicationDataService,
} from './../../../services/publication-data.service';
import { Component, OnInit, Input } from '@angular/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-view-publication',
  templateUrl: './view-publication.component.html',
  styleUrls: ['./view-publication.component.scss'],
})
export class ViewPublicationComponent implements OnInit {
  publicationData: PUBLICATION_RECORD;
  faTimes = faTimes;
  id: string;
  showSpinner = false;
  constructor(
    private publicationService: PublicationDataService,
    private router: Router,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private getServerDataService: GetServerDataService
  ) {}

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.activatedRoute.params.subscribe((data) => {
      this.id = data['id'];
      this.getPublication();
    });
    this.getServerDataService.isLoggedIn.subscribe((el) => {
      if (el) {
        if (this.id != null) this.getPublication();
      } else this.checkForLogin();
    });
  }
  checkForLogin() {
    this.getServerDataService.getToken((data) => {
      if (data != null) this.doLogin(data);
    });
  }
  doLogin(uid: string) {
    this.getServerDataService.login(uid, (val: boolean) => {});
  }
  getPublication() {
    this.showSpinner = true;
    this.getServerDataService.getPublicationById(this.id, false, (data) => {
      this.showSpinner = false;
      if (data != null) this.publicationData = data[this.id];
    });
  }
  closeClicked() {
    this.location.back();
  }
  addItemToList(publication_id: string) {
    var list = this.publicationService.getCurrentActiveList();

    if (list == null) {
      this.showSpinner = true;
      this.getServerDataService.getActiveList((data) => {
        this.showSpinner = false;
        console.log(data);
        if (data != null) {
          this.showSpinner = true;
          this.publicationService.setCurrentActiveListId(data);
          this.getServerDataService.getPublicationListById(data, (data1) => {
            this.showSpinner = false;
            if (data1 != null) {
              this.publicationService.setCurrentActiveList(data1);
              this.updateExistingList(data1, publication_id);
            }
          });
        }
      });
    } else {
      this.updateExistingList(list, publication_id);
    }
  }
  updateExistingList(list: PUBLICATION_LIST, publication_id: string) {
    this.showSpinner = true;
    this.getServerDataService.updateExistingList(
      this.publicationService.getCurrentActiveListId(),
      {
        name: list.name,
        publication_ids: list.publication_ids.concat(publication_id),
      },
      (result) => {
        this.showSpinner = false;
        this.publicationService.activeListDataChanged();
        this.publicationService.setDiscoveryFeedData(null);
      }
    );
  }
}
