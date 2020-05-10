import { Subscription } from 'rxjs';
import {
  PUBLICATION_RECORD,
  GetServerDataService,
  LIST,
  DISCOVERY_FILTER,
} from './../../services/getServerData.service';
import {
  PublicationDetails,
  PublicationDataService,
} from './../../services/publication-data.service';
import { DataProviderService } from './../../services/dataProvider.service';
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  OnDestroy,
} from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy {
  publicationRecords: PUBLICATION_RECORD[] = [];
  contractPublication: Map<string, boolean> = new Map();
  showDetailedLook = true;
  faPlus = faPlus;
  @Output() buttonClicked = new EventEmitter<boolean>();
  @Input() showList = true;
  @Input() showToolbar = true;

  itemsList: string[] = [];
  filter: DISCOVERY_FILTER = {};
  currIndex = 0;
  preLoadItems = 10;
  allIds: string[] = [];
  showSpinner = false;
  fetchingData = false;
  subscriptionArr: Subscription[] = [];
  sortType: string = 'date';

  constructor(
    private dataProviderService: DataProviderService,
    private publicationService: PublicationDataService,
    private getServerDataService: GetServerDataService,
    private router: Router
  ) {}
  optionButtonClicked(event) {
    this.buttonClicked.emit(true);
  }
  viewTypeChanged(event: boolean) {
    this.showDetailedLook = event;
    console.log('show detailed look changed', this.showDetailedLook);
  }
  sortTypeUpdated(event: string) {
    this.sortType = event.toLowerCase();
    this.getDiscoveryLists();
  }
  ngOnInit(): void {
    // this.subscriptionArr.push(
    //   this.publicationService.activeListIdUpdated.subscribe((el: string) => {
    //     console.log('getting discovery list');
    //     this.getDiscoveryLists();
    //   })
    // );
    this.getServerDataService.isLoggedIn.subscribe((el) => {
      if (el) this.getDiscoveryData();
    });
  }
  getDiscoveryData() {
    var data = this.publicationService.getDiscoveryFeedData();
    if (data == null) this.getActiveList();
    else {
      setTimeout(() => {
        this.currIndex = data.currentIndex;
        this.allIds = data.allIds;
        this.publicationRecords = data.publicationRecords;
        this.filter = data.filter;
        this.sortType = data.sortType;
        console.log('obtained filter', this.filter);
      }, 10);
    }
  }
  getActiveList() {
    this.getServerDataService.getActiveList((data) => {
      if (data != null) this.publicationService.setCurrentActiveListId(data);
    });
  }
  getDiscoveryLists() {
    this.itemsList = [];
    this.publicationRecords = [];
    this.showSpinner = true;
    this.getServerDataService.getDiscoveryLists(
      this.publicationService.getCurrentActiveListId(),
      this.filter,
      this.sortType,
      (data: any[]) => {
        this.showSpinner = false;

        if (data == null) return;

        this.publicationRecords = this.publicationRecords.concat(data);
        console.log('publication records', this.publicationRecords);
      }
    );
  }
  filterResultsChanged(event: any) {
    this.filter = event;
    console.log('new filter is', this.filter);
    this.getDiscoveryLists();
  }
  hideClicked(publicationData: PUBLICATION_RECORD) {
    var index = this.publicationRecords.findIndex(
      (el) => el.id === publicationData.id
    );
    if (index >= 0) {
      this.publicationRecords.splice(index, 1);
      this.allIds.splice(index, 1);
    }
  }
  viewPublicationClicked(publicationData: PUBLICATION_RECORD) {
    this.publicationService.setCurrentlySelectedPublication(publicationData);

    this.router.navigate(['view', publicationData.id]);
  }
  onAddClicked() {
    this.publicationService.setListSidebar(true);
  }
  onScroll() {}
  updatePublicationForList(list_id: string) {
    this.itemsList = [];
    this.showSpinner = true;
    this.getServerDataService.getPublicationListById(list_id, (data: LIST) => {
      this.showSpinner = false;
      if (data == null) return;
      this.allIds = data.publication_ids;
      // this.publicationService.setCurrentPublicationIds(this.allIds.slice());
      this.updateItemList();
      this.showSpinner = false;
    });
  }

  getNewIds() {
    this.itemsList = [];
    let maxRange = this.currIndex + this.preLoadItems;
    if (maxRange > this.allIds.length) maxRange = this.allIds.length;
    for (let i = this.currIndex; i < maxRange; i++) {
      this.itemsList.push(this.allIds[i]);
    }
  }
  updateItemList() {
    this.getNewIds();
    this.fetchingData = true;
    this.getServerDataService.getMultiplePublicationByIds(
      this.itemsList,
      false,
      (data: Object) => {
        this.fetchingData = false;
        if (data == null) return;
        var objectKeys = Object.keys(data);

        objectKeys.forEach((key) => {
          this.contractPublication.set(data[key].id, false);
          this.publicationRecords.push(data[key]);
        });

        this.currIndex += objectKeys.length;
        console.log('new curr index is ', this.currIndex, objectKeys.length);
      }
    );
  }
  thumbsUpClicked(event: boolean, item: PUBLICATION_RECORD) {}
  thumbsDownClicked(event: boolean, item: PUBLICATION_RECORD) {
    this.contractPublication.set(item.id, event);
  }
  shrugClicked(event: boolean, item: PUBLICATION_RECORD) {}
  getContractStatus(item: PUBLICATION_RECORD) {
    if (this.contractPublication.has(item.id))
      return this.contractPublication.get(item.id);
    return false;
  }
  ngOnDestroy() {
    this.subscriptionArr.forEach((el) => el.unsubscribe());
    this.publicationService.setDiscoveryFeedData({
      currentIndex: this.currIndex,
      publicationRecords: this.publicationRecords,
      allIds: this.allIds,
      filter: this.filter,
      sortType: this.sortType,
    });
    console.log('stored filter is', this.filter);
  }
}
