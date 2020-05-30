import {
  Managed_List,
  HISTOGRAM_DATA,
} from 'src/app/services/getServerData.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  GetServerDataService,
  SEARCH_FILTER,
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
  ViewChild,
  ElementRef,
  AfterViewInit,
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
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-locate-publication',
  templateUrl: './locate-publication.component.html',
  styleUrls: ['./locate-publication.component.scss'],
})
export class LocatePublicationComponent
  implements OnInit, AfterViewInit, OnDestroy {
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
  noData = false;
  hasDataToStore = false;
  isNewList = false;
  newListName = '';
  currentSeedNewListPublicationId: string;
  histogram: HISTOGRAM_DATA;
  activeListEmpty = false;
  searchFilter: SEARCH_FILTER = {
    year_start: 1940,
    year_end: 2018,
  };
  sortType = 'date';
  httpSubscriptionArr: Subscription[] = [];
  @Output() hideLocatePublication = new EventEmitter<boolean>();
  @Output() updateScrollPosition = new EventEmitter<string>();

  @ViewChild('wrapper', { static: false })
  wrapper: ElementRef;

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
    if (this.publicationService.getCurrentLocatePublicationsData() != null)
      this.updateLocalData();
    this.subscriptionArr.push(
      this.publicationService.updateLeftSidebar.subscribe((el) => {
        if (!el) this.resetItems();
      })
    );

    this.subscriptionArr.push(
      this.publicationService.onLocateScrollDown.subscribe((el) => {
        if (this.currIndex >= this.allIds.length - 1) return;
        if (el) this.onScroll();
      })
    );
    this.subscriptionArr.push(
      this.publicationService.activeListUpdated.subscribe((el) => {
        this.updateEmptyActiveListStatus();
        this.allIds = this.allIds.filter((el: string) => {
          if (!this.publicationService.isCurrentPublication(el)) return el;
        });
        this.publicationRecords = this.publicationRecords.filter((el) =>
          this.allIds.includes(el.id)
        );
      })
    );
    this.updateEmptyActiveListStatus();
  }
  ngAfterViewInit() {}
  updateEmptyActiveListStatus() {
    let list = this.publicationService.getCurrentActiveList();
    if (list && list.publication_ids)
      this.activeListEmpty =
        this.publicationService.getCurrentActiveList().publication_ids.length <
        1;
  }
  resetItems() {
    this.showFilterDialog = false;
    this.showViewTypeDialog = false;
    this.showDetailedLook = true;

    this.allIds = [];
    this.inCurrentPublicationIds = [];
    this.itemsList = [];
    this.currIndex = 0;

    this.noData = false;
    this.hasDataToStore = false;
    this.isNewList = false;
    this.newListName = '';
    this.currentSeedNewListPublicationId = null;

    this.activeListEmpty = false;
    this.publicationRecords = [];
    this.fetchingData = false;
    this.locatePublication = '';
    this.showSpinner = false;
    this.clearSearchRequest();
    this.histogram = null;
    this.publicationService.setCurrentLocatePublications(null);
    this.storeDataLocally();
  }
  updateLocalData() {
    let data = this.publicationService.getCurrentLocatePublicationsData();

    this.currIndex = data.currentIndex;
    this.allIds = data.allIds;
    this.publicationRecords = data.publicationRecords;
    this.locatePublication = data.query;
    this.searchFilter = data.searchFilter;
    this.sortType = data.sortType;
    this.histogram = data.histogram;
    if (this.publicationRecords.length < 1) this.noData = true;
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
    this.publicationService.setCustomContactUsText(
      'I would like you to include the following publication in the database' +
        '\n'
    );
    this.router.navigate(['contact-us']);
  }
  locateInputChanged($event) {
    this.storeDataLocally();
  }
  filterResultsChanged(event: any) {
    if (this.allIds.length < 1 && this.publicationRecords.length < 1) {
      this.searchFilter = {
        year_start: 1940,
        year_end: 2018,
      };
    } else this.searchFilter = event;
    this.storeDataLocally();
  }
  sortTypeChanged(event: string) {
    this.sortType = event.toLowerCase();
    this.storeDataLocally();
  }

  onSearchClicked() {
    this.publicationRecords = [];
    this.allIds = [];
    this.currIndex = 0;
    this.showSpinner = true;
    this.getServerDataService.searchForLists(
      this.locatePublication,
      this.searchFilter,
      this.sortType,
      (data: any) => {
        this.showSpinner = false;
        this.hasDataToStore = true;

        this.allIds = [];
        if (data == null) return;
        this.allIds = data.publication_ids.filter((el: string) => {
          if (!this.publicationService.isCurrentPublication(el)) return el;
        });
        this.histogram = data.histograms;
        if (this.allIds.length < 1) this.noData = true;
        else this.noData = false;
        this.updateItemList();
      }
    );
  }
  addItemToList(publication_id: string) {
    this.updateScrollPosition.emit('store');
    var list = this.publicationService.getCurrentActiveList();
    if (list == null) {
      this.updateCurrentActiveList(publication_id);
    } else this.updateExistingList(list, publication_id);
  }
  updateCurrentActiveList(publication_id: string) {
    this.showSpinner = true;

    this.getServerDataService.initActiveList((data) => {
      this.showSpinner = false;
      if (!data) return;
      let currList = this.publicationService.getCurrentActiveList();
      let currListId = this.publicationService.getCurrentActiveListId();

      this.updateExistingList(currList, publication_id);
    });
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

        this.publicationService.setCurrentPublications(null);
        this.publicationService.setDiscoveryFeedData(null);
        this.publicationService.updateCurrentActiveListIds(
          list.publication_ids.concat(publication_id)
        );
        this.updateScrollPosition.emit('update');
        this.publicationService.setNewActiveList(
          this.publicationService.getCurrentActiveListId()
        );
        // this.getServerDataService.initActiveList((data) => {});

        this.removeId(publication_id);
        let temp = this.preLoadItems;
        this.preLoadItems = 1;
        this.onScroll();
        this.preLoadItems = temp;
        this.storeDataLocally();
      }
    );
  }
  removeId(publication_id: string) {
    this.publicationRecords = this.publicationRecords.filter(
      (el) => el.id !== publication_id
    );
    this.allIds = this.allIds.filter((el) => el !== publication_id);
    this.currIndex--;
    // this.getServerDataService.initActiveList((data) => {
    //   this.publicationService.setNewActiveList(
    //     this.publicationService.getCurrentActiveListId()
    //   );
    // });
  }
  seedNewListClicked(publicationId: string) {
    this.showSpinner = true;
    this.updateScrollPosition.emit('store');
    this.getServerDataService.getAllPublicationList((data: any) => {
      this.showSpinner = false;
      let listNumber = this.getMinListNumber(data);
      if (data != null) {
        this.isNewList = true;
        this.newListName = 'List ' + listNumber;
        this.currentSeedNewListPublicationId = publicationId;
      }
    });
  }
  getMinListNumber(data: Managed_List[]) {
    let availableList: number[] = [];
    data.forEach((el, index) => {
      if (el.list_name.toLowerCase().includes('list')) {
        var name = el.list_name.toLowerCase();
        name = name.replace('list', '');
        name = name.replace(' ', '');
        if (!isNaN(Number(name))) availableList.push(Number(name));
      }
    });
    let number = 1;

    if (availableList.length < 1) return 1;
    if (Math.min(...availableList) != 1) return 1;
    let candiatesElement = availableList.filter(
      (el) => !availableList.includes(el + 1)
    );
    if (candiatesElement.length < 1) return data.length + 1;
    let minAvailableElement = Math.min(...candiatesElement);
    return minAvailableElement + 1;
  }
  createNewPublicationList(listName: string, publicationId: string) {
    this.showSpinner = true;
    this.getServerDataService.createNewPublicationList(
      {
        name: listName,
        publication_ids: [publicationId],
      },
      (data) => {
        this.showSpinner = false;
        this.updateScrollPosition.emit('update');
        if (data != null) {
          this.updateActiveList(data);
          this.storeDataLocally();
        }
      }
    );
  }
  updateActiveList(id: string) {
    this.showSpinner = true;
    this.getServerDataService.updateActiveList(id, (data) => {
      this.showSpinner = false;
      if (data != null)
        this.getServerDataService.initActiveList((data1) => {
          if (data1) {
            this.publicationService.setCurrentPublications(null);
            this.publicationService.setDiscoveryFeedData(null);
            this.storeDataLocally();
            this.publicationService.setNewActiveList(
              this.publicationService.getCurrentActiveListId()
            );
          }
        });

      // this.publicationService.setCurrentActiveListId(id);
      this.updateScrollPosition.emit('update');
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
      'publication_list_item',
      (data: Object) => {
        this.fetchingData = false;
        if (data == null) return;
        var objectKeys = Object.keys(data);
        var filteredOrderedKeys = this.itemsList.filter((el) =>
          objectKeys.includes(el)
        );
        filteredOrderedKeys.forEach((key) => {
          this.publicationRecords.push(data[key]);
        });

        this.fetchingData = false;
        this.currIndex += objectKeys.length;
      }
    );
  }
  listDataChanged(event: { name: string; subtitle: string }) {
    if (event == null) {
      this.isNewList = false;

      this.newListName = null;
      this.currentSeedNewListPublicationId = null;
      this.updateScrollPosition.emit('update');
      return;
    }
    this.newListName = event.name;
    this.isNewList = false;

    this.createNewPublicationList(
      this.newListName,
      this.currentSeedNewListPublicationId
    );
  }
  onScroll() {
    if (!this.fetchingData) this.updateItemList();
  }
  listenForEnter(event: KeyboardEvent) {
    if (event.keyCode == 13) this.onSearchClicked();
  }
  storeDataLocally() {
    this.publicationService.setCurrentLocatePublications({
      publicationRecords: this.publicationRecords,
      query: this.locatePublication,
      allIds: this.allIds,
      currentIndex: this.currIndex,
      searchFilter: this.searchFilter,
      sortType: this.sortType,
      histogram: this.histogram,
    });
  }
  ngOnDestroy() {
    this.subscriptionArr.forEach((el) => el.unsubscribe());
    if (this.hasDataToStore) this.storeDataLocally();
  }
  clearSearchRequest() {
    this.httpSubscriptionArr.forEach((el) => el.unsubscribe());
  }
}
