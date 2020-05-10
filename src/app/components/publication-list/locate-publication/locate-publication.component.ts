import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  GetServerDataService,
  SEARCH_FILTER,
  SEARCH_SORT,
  PUBLICATION_RECORD,
  PUBLICATION_LIST,
} from './../../../services/getServerData.service';
import { DataProviderService } from './../../../services/dataProvider.service';
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import {
  faSearch,
  faLongArrowAltLeft,
  faAngleDown,
} from '@fortawesome/free-solid-svg-icons';

import {
  PublicationDetails,
  PublicationDataService,
} from 'src/app/services/publication-data.service';

@Component({
  selector: 'app-locate-publication',
  templateUrl: './locate-publication.component.html',
  styleUrls: ['./locate-publication.component.scss'],
})
export class LocatePublicationComponent implements OnInit, OnDestroy {
  locatePublication = '';
  faSearch = faSearch;
  faAngleDown = faAngleDown;
  faLongArrowAltLeft = faLongArrowAltLeft;
  showFilterDialog = false;
  showViewTypeDialog = false;
  showDetailedLook = true;
  interval: any;
  allIds: string[] = [];
  inCurrentPublicationIds: boolean[] = [];
  itemsList: string[] = [];
  currIndex = 0;
  preLoadItems = 3;
  showSpinner = false;
  searchFilter: SEARCH_FILTER = {
    year_start: 1940,
    year_end: 2018,
  };
  sortType = 'date';

  @Output() hideLocatePublication = new EventEmitter<boolean>();
  fetchingData = false;
  subscriptionArr: Subscription[] = [];
  publicationRecords: PUBLICATION_RECORD[] = [];
  hideLocate(event: Event) {
    this.hideLocatePublication.emit(true);
  }

  filterDialogButtonClicked(event: any) {
    this.showFilterDialog = !this.showFilterDialog;
    event.stopPropagation();
  }
  constructor(
    private dataProviderService: DataProviderService,
    private publicationService: PublicationDataService,
    private getServerDataService: GetServerDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscriptionArr.push(
      this.publicationService.updateLeftSidebar.subscribe((el) => {
        if (!el) this.resetItems();
      })
    );
    // this.subscriptionArr.push(
    //   this.publicationService.activeListDataUpdated.subscribe((el) => {
    //     console.log('active list updated called');
    //     this.allIds = this.allIds.filter((el: string) => {
    //       if (!this.publicationService.isCurrentPublication(el)) return el;
    //     });
    //     this.publicationRecords = this.publicationRecords.filter((el) => {
    //       if (!this.publicationService.isCurrentPublication(el.id)) return el;
    //     });
    //   })
    // );
    this.subscriptionArr.push(
      this.publicationService.onLocateScrollDown.subscribe((el) => {
        console.log('curr index is', this.currIndex, this.allIds.length);
        if (this.currIndex >= this.allIds.length - 1) return;
        if (el) this.onScroll();
      })
    );
  }
  resetItems() {
    this.publicationRecords = [];
    this.fetchingData = false;
    this.locatePublication = '';
  }
  toggleDetailDialog() {
    this.showViewTypeDialog = !this.showViewTypeDialog;
  }
  viewTypeChanged(event: boolean) {
    this.showDetailedLook = event;
  }
  viewPublicationClicked(publicationData: PUBLICATION_RECORD) {
    this.publicationService.setCurrentlySelectedPublication(publicationData);
    this.router.navigate(['view', publicationData.id]);
  }
  needButtonClicked(item: PUBLICATION_RECORD) {
    this.publicationService.setCurrentNeededPublication(item);
    this.router.navigate(['contact-us']);
  }
  locateInputChanged($event) {}
  filterResultsChanged(event: any) {
    console.log('seearch filter is ', this.searchFilter);

    this.searchFilter = event;
  }
  sortTypeChanged(event: string) {
    this.sortType = event.toLowerCase();
    console.log('sort type is', this.sortType);
  }
  onSearchClicked() {
    this.publicationRecords = [];
    this.allIds = [];
    this.showSpinner = true;
    this.getServerDataService.searchForLists(
      this.locatePublication,
      this.searchFilter,
      this.sortType,
      (data: any) => {
        this.showSpinner = false;
        console.log('data in locate publication is');
        console.log(data);
        this.allIds = [];
        if (data == null) return;
        this.allIds = data.filter((el: string) => {
          if (!this.publicationService.isCurrentPublication(el)) return el;
        });

        console.log('new ids in locate publication', this.allIds);

        this.updateItemList();
      }
    );
  }
  updateCurrentActiveList(publication_id: string) {
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
  }
  addItemToList(publication_id: string) {
    var list = this.publicationService.getCurrentActiveList();

    if (list == null) {
      this.updateCurrentActiveList(publication_id);
    } else this.updateExistingList(list, publication_id);
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
        // this.publicationService.activeListDataChanged();
        this.removeId(publication_id);
        let temp = this.preLoadItems;
        this.preLoadItems = 1;
        this.onScroll();
        this.preLoadItems = temp;
        this.publicationService.setCurrentPublications(null);
        this.publicationService.setDiscoveryFeedData(null);
      }
    );
  }
  removeId(publication_id: string) {
    this.publicationRecords = this.publicationRecords.filter(
      (el) => el.id !== publication_id
    );
    this.allIds = this.allIds.filter((el) => el !== publication_id);
    this.currIndex--;
  }
  seedNewListClicked(publicationId: string) {
    this.showSpinner = true;
    this.getServerDataService.getAllPublicationList((data: any) => {
      this.showSpinner = false;
      if (data != null)
        this.createNewPublicationList(data.length + 1, publicationId);
    });
  }
  createNewPublicationList(listnumber: number, publicationId: string) {
    this.showSpinner = true;
    this.getServerDataService.createNewPublicationList(
      {
        name: 'LIST ' + listnumber,
        publication_ids: [publicationId],
      },
      (data) => {
        this.showSpinner = false;
        if (data != null) this.updateActiveList(data);
      }
    );
  }
  updateActiveList(id: string) {
    this.showSpinner = true;
    this.getServerDataService.updateActiveList(id, (data) => {
      this.showSpinner = false;
      this.publicationService.fetchRecordsForCurrentlyActive(data);

      this.publicationService.setCurrentPublications(null);
      this.publicationService.setDiscoveryFeedData(null);
      this.publicationService.setCurrentActiveListId(id);
    });
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
  getNewIds() {
    this.itemsList = [];
    console.log('curr index at start is', this.currIndex);
    let maxRange = this.currIndex + this.preLoadItems;
    if (maxRange > this.allIds.length - 1) maxRange = this.allIds.length - 1;
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
          this.publicationRecords.push(data[key]);
        });

        this.fetchingData = false;
        this.currIndex += objectKeys.length;
        console.log('new curr index is ', this.currIndex, objectKeys.length);
      }
    );
  }
  onScroll() {
    console.log('scolled down n locate');
    if (!this.fetchingData) this.updateItemList();
  }
  ngOnDestroy() {
    this.subscriptionArr.forEach((el) => el.unsubscribe());
  }
}
