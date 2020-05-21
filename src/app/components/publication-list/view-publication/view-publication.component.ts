import { Subscription } from 'rxjs';
import {
  PUBLICATION_RECORD,
  GetServerDataService,
  PUBLICATION_LIST,
} from './../../../services/getServerData.service';
import {
  PublicationDetails,
  PublicationDataService,
} from './../../../services/publication-data.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-view-publication',
  templateUrl: './view-publication.component.html',
  styleUrls: ['./view-publication.component.scss'],
})
export class ViewPublicationComponent implements OnInit, OnDestroy {
  publicationData: PUBLICATION_RECORD;
  faTimes = faTimes;
  id: string;
  showSpinner = false;
  subscriptionArr: Subscription[] = [];
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
      if (this.getServerDataService.getUserLoginStatus()) this.getPublication();
    });
    this.subscriptionArr.push(
      this.getServerDataService.isLoggedIn.subscribe((el) => {
        if (el) {
          if (this.id != null) this.getPublication();
        } else this.checkForLogin();
      })
    );
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
    let item = this.publicationService.findPublicationDataLocally(this.id);
    if (item != null) this.publicationData = item;
    if (item == null) this.showSpinner = true;
    this.getServerDataService.getPublicationById(
      this.id,
      'publication_detail',
      (data) => {
        this.showSpinner = false;
        if (data != null) {
          if (this.publicationData == null) this.publicationData = {};
          this.publicationData = {
            ...this.publicationData,
            ...data[this.id],
          };
        }
      }
    );
  }
  closeClicked() {
    this.location.back();
  }
  addItemToList(publication_id: string) {
    let list = this.publicationService.getCurrentActiveList();

    if (list == null) {
      this.showSpinner = true;
      this.getServerDataService.initActiveList((data) => {
        if (data) {
          let list = this.publicationService.getCurrentActiveList();
          this.updateExistingList(list, publication_id);
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
        this.publicationService.setCurrentPublications(null);
        this.publicationService.setNewActiveList(
          this.publicationService.getCurrentActiveListId()
        );

        this.publicationService.setDiscoveryFeedData(null);
      }
    );
  }
  ngOnDestroy() {
    this.subscriptionArr.forEach((el) => el.unsubscribe());
  }
}
