import { Subscription } from 'rxjs';
import {
  PUBLICATION_RECORD,
  GetServerDataService,
  LIST,
} from './../../../services/getServerData.service';
import { PublicationDataService } from './../../../services/publication-data.service';
import { DataProviderService } from './../../../services/dataProvider.service';
import {
  Component,
  OnInit,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';

import { Router } from '@angular/router';

@Component({
  selector: 'app-current-publication-list',
  templateUrl: './current-publication-list.component.html',
  styleUrls: ['./current-publication-list.component.scss'],
})
export class CurrentPublicationListComponent
  implements OnInit, OnChanges, OnDestroy {
  @Input() themedComponent = true;
  @Input() isDetailed = false;
  @Input() isMultipleSelection = false;
  @Input() showSpinner = false;

  @Output() multipleSelectedItems = new EventEmitter<string[]>();
  allIds: string[] = [];
  prevActiveListId = '';
  noData = false;
  preLoadItems = 3;
  loadedItems = 0;
  itemsList: string[] = [];
  currentActiveListId = '';
  multiSelectionArray: string[] = [];

  subscriptionArr: Subscription[] = [];
  fetchingData = false;
  publicationRecords: PUBLICATION_RECORD[] = [];

  constructor(
    private dataProviderService: DataProviderService,
    private publicationService: PublicationDataService,
    private getServerDataService: GetServerDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscriptionArr.push(
      this.publicationService.activeListUpdated.subscribe((el: string) => {
        console.log(
          'active list updated called in current publication',
          this.prevActiveListId,
          this.publicationService.getCurrentActiveListId()
        );

        this.getActiveList();
      })
    );
    this.subscriptionArr.push(
      this.getServerDataService.isLoggedIn.subscribe((el: boolean) => {
        if (el) {
          if (this.publicationService.getCurrentPublicationsData() == null)
            this.getActiveList();
          else this.updateLocalData();
        }
      })
    );

    this.subscriptionArr.push(
      this.publicationService.onPublicationListScrollDown.subscribe((el) => {
        this.onScroll();
      })
    );
    this.subscriptionArr.push(
      this.publicationService.removeMultiplePublicationItems.subscribe(
        (publicationRecords: string[]) => {
          this.removeMultipleItems(publicationRecords);
        }
      )
    );
  }
  removeMultipleItems(removeList: string[]) {
    let publicationIds = this.allIds.map((el) => el);
    publicationIds = publicationIds.filter((el) => !removeList.includes(el));
    this.showSpinner = true;
    this.getServerDataService.updateExistingList(
      this.publicationService.getCurrentActiveListId(),
      {
        name: this.publicationService.getCurrentActiveList().name,
        publication_ids: publicationIds,
      },
      (data) => {
        this.showSpinner = false;
        this.loadedItems = this.loadedItems - removeList.length;
        if (data) {
          this.showSpinner = true;

          this.getServerDataService.initActiveList((data1) => {
            this.showSpinner = false;
            if (data1) {
              this.publicationService.setNewActiveList(
                this.publicationService.getCurrentActiveListId()
              );
            }
          });
        }
      }
    );
  }

  resetData() {
    this.publicationRecords = [];
    this.allIds = [];
  }
  updateLocalData() {
    var data = this.publicationService.getCurrentPublicationsData();

    this.loadedItems = data.currentIndex;
    this.allIds = data.allIds;
    this.publicationRecords = data.publicationRecords;
    if (this.publicationRecords.length < 1) this.noData = true;
  }
  getActiveList() {
    console.log('get active list called');
    this.showSpinner = true;
    this.resetData();
    this.getServerDataService.initActiveList((data: boolean) => {
      this.showSpinner = false;
      if (!data) return;
      var list = this.publicationService.getCurrentActiveList();
      if (
        this.prevActiveListId !=
        this.publicationService.getCurrentActiveListId()
      ) {
        this.loadedItems = 0;
      }
      this.prevActiveListId = this.publicationService.getCurrentActiveListId();

      if (data == null) return;
      this.allIds = [...new Set(list.publication_ids)];
      if (this.allIds.length < 1) this.noData = true;
      else this.noData = false;
      this.updateItemList();
    });
  }
  hideClicked(publicationData: PUBLICATION_RECORD) {
    var index = this.publicationRecords.findIndex(
      (el) => el.id === publicationData.id
    );
    if (index >= 0) {
      this.publicationRecords.splice(index, 1);
      this.allIds.splice(index, 1);
      if (this.publicationRecords.length < 1) this.noData = true;
      else this.noData = false;
    }
  }

  getNewIds() {
    this.itemsList = [];
    let currIndex = this.publicationRecords.length;
    this.loadedItems = this.loadedItems + this.preLoadItems;
    if (this.loadedItems > this.allIds.length)
      this.loadedItems = this.allIds.length;
    for (let i = currIndex; i < this.loadedItems; i++) {
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
      }
    );
  }
  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'showSpin': {
            // this.doSomething(change.currentValue)
          }
        }
      }
    }

    if (this.itemsList != null && this.itemsList.length > 0)
      this.updateItemList();
  }
  viewPublicationClicked(publicationData: PUBLICATION_RECORD) {
    this.publicationService.setCurrentlySelectedPublication(publicationData);

    this.router.navigate(['view', publicationData.id]);
  }
  onScroll() {
    // console.log(this.currIndex);
    if (this.loadedItems >= this.allIds.length || this.fetchingData) return;
    this.updateItemList();
  }
  removeClicked(item: PUBLICATION_RECORD) {
    this.removeId(item.id);
  }
  removeId(id: string) {
    var list = this.publicationService.getCurrentActiveList();
    if (list == null) return;

    let tempList = this.allIds.filter((el) => el != id);
    this.showSpinner = true;
    this.getServerDataService.updateExistingList(
      this.publicationService.getCurrentActiveListId(),
      { name: list.name, publication_ids: tempList },
      (data) => {
        this.showSpinner = false;
        if (data == null) return;
        this.removeLocally(id);
      }
    );
  }
  removeLocally(id: string) {
    this.allIds = this.allIds.filter((el) => el != id);
    this.publicationRecords = this.publicationRecords.filter(
      (el) => el.id != id
    );
    if (this.allIds.length < 1) this.noData = true;
    else this.noData = false;

    let temp = this.preLoadItems;
    this.publicationService.setDiscoveryFeedData(null);
    this.preLoadItems = 1;
    this.onScroll();
    this.preLoadItems = temp;
    this.storeDataLocally();
    this.loadedItems = this.loadedItems - this.preLoadItems;
    this.publicationService.setNewActiveList(
      this.publicationService.getCurrentActiveListId()
    );
    this.getServerDataService.initActiveList((data) => {});
  }
  storeDataLocally() {
    this.publicationService.setCurrentPublications({
      currentIndex: this.loadedItems,
      allIds: this.allIds,
      publicationRecords: this.publicationRecords,
    });
  }
  selectionStatusChanged(checked: boolean, item: PUBLICATION_RECORD) {
    console.log('item status', item.title, checked);
    let index = this.multiSelectionArray.findIndex((el) => el === item.id);
    if (checked && index < 0) this.multiSelectionArray.push(item.id);
    else if (!checked && index >= 0) this.multiSelectionArray.splice(index, 1);

    this.multipleSelectedItems.emit(this.multiSelectionArray);
  }
  ngOnDestroy() {
    this.storeDataLocally();
    this.subscriptionArr.forEach((el) => el.unsubscribe());
  }
}
