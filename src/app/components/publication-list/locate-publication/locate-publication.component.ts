import { Managed_List } from 'src/app/services/getServerData.service';
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
import { ViewportScroller } from '@angular/common';

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
  noData = false;
  hasDataToStore = false;
  searchFilter: SEARCH_FILTER = {
    year_start: 1940,
    year_end: 2018,
  };
  sortType = 'date';

  @Output() updateScrollPosition = new EventEmitter<string>();

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
  }
  resetItems() {
    this.publicationRecords = [];
    this.fetchingData = false;
    this.locatePublication = '';
    this.currIndex = 0;
    this.publicationService.setCurrentLocatePublications(null);
  }
  updateLocalData() {
    let data = this.publicationService.getCurrentLocatePublicationsData();

    this.currIndex = data.currentIndex;
    this.allIds = data.allIds;
    this.publicationRecords = data.publicationRecords;
    this.locatePublication = data.query;
    this.searchFilter = data.searchFilter;
    this.sortType = data.sortType;
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
  locateInputChanged($event) {}
  filterResultsChanged(event: any) {
    this.searchFilter = event;
  }
  sortTypeChanged(event: string) {
    this.sortType = event.toLowerCase();
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
        this.allIds = data.filter((el: string) => {
          if (!this.publicationService.isCurrentPublication(el)) return el;
        });
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
      this.getMinimumNumber(data);
      if (data != null)
        this.createNewPublicationList(
          this.getMinimumNumber(data),
          publicationId
        );
    });
  }
  getMinimumNumber(data: Managed_List[]) {
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
  createNewPublicationList(listnumber: number, publicationId: string) {
    this.showSpinner = true;
    this.getServerDataService.createNewPublicationList(
      {
        name: 'List ' + listnumber,
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
      if (data != null)
        this.getServerDataService.initActiveList((data1) => {
          if (data1) {
            this.publicationService.setCurrentPublications(null);
            this.publicationService.setDiscoveryFeedData(null);
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
      'publication_list_item',
      (data: Object) => {
        this.fetchingData = false;
        if (data == null) return;
        var objectKeys = Object.keys(data);

        objectKeys.forEach((key) => {
          this.publicationRecords.push(data[key]);
        });

        this.fetchingData = false;
        this.currIndex += objectKeys.length;
      }
    );
  }
  onScroll() {
    if (!this.fetchingData) this.updateItemList();
  }
  listenForEnter(event: KeyboardEvent) {
    if (event.keyCode == 13) this.onSearchClicked();
  }
  ngOnDestroy() {
    this.subscriptionArr.forEach((el) => el.unsubscribe());
    if (this.hasDataToStore)
      this.publicationService.setCurrentLocatePublications({
        publicationRecords: this.publicationRecords,
        query: this.locatePublication,
        allIds: this.allIds,
        currentIndex: this.currIndex,
        searchFilter: this.searchFilter,
        sortType: this.sortType,
      });
  }
}
