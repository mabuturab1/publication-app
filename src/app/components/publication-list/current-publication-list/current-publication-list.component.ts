import { Subscription } from 'rxjs';
import {
  PUBLICATION_RECORD,
  PUBLICATION_LIST,
  GetServerDataService,
  LIST,
} from './../../../services/getServerData.service';
import {
  PublicationDetails,
  PublicationDataService,
} from './../../../services/publication-data.service';
import { DataProviderService } from './../../../services/dataProvider.service';
import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  OnChanges,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ResearchData } from 'src/app/services/dataProvider.service';
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
  allIds: string[] = [];
  currIndex = 0;
  noData = false;
  preLoadItems = 3;
  itemsList: string[] = [];
  currentActiveListId = '';
  @Input() showSpinner = false;
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
    // this.subscriptionArr.push(
    //   this.publicationService.updateActiveListData.subscribe((el: boolean) => {
    //     if (el) this.updatePublicationForList(this.currentActiveListId);
    //   })
    // );
    this.subscriptionArr.push(
      this.publicationService.onPublicationListScrollDown.subscribe((el) => {
        this.onScroll();
      })
    );
    console.log('initializing data in current list', this.itemsList);
  }
  resetData() {
    this.publicationRecords = [];
    this.allIds = [];
    this.currIndex = 0;
  }
  updateLocalData() {
    var data = this.publicationService.getCurrentPublicationsData();
    this.currIndex = data.currentIndex;
    this.allIds = data.allIds;
    this.publicationRecords = data.publicationRecords;
  }
  getActiveList() {
    this.showSpinner = true;
    this.resetData();
    this.getServerDataService.initActiveList((data: boolean) => {
      if (!data) return;
      var list = this.publicationService.getCurrentActiveList();
      this.showSpinner = false;
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
          this.publicationRecords.push(data[key]);
        });

        this.currIndex += objectKeys.length;
        console.log('new curr index is ', this.currIndex, objectKeys.length);
      }
    );
  }
  ngOnChanges() {
    if (this.itemsList != null && this.itemsList.length > 0)
      this.updateItemList();
  }
  viewPublicationClicked(publicationData: PUBLICATION_RECORD) {
    this.publicationService.setCurrentlySelectedPublication(publicationData);

    this.router.navigate(['view', publicationData.id]);
  }
  onScroll() {
    console.log(this.currIndex);
    if (this.currIndex >= this.allIds.length || this.fetchingData) return;
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
    if (this.currIndex > 0) this.currIndex--;
    let temp = this.preLoadItems;
    this.preLoadItems = 1;
    this.onScroll();
    this.preLoadItems = temp;
    this.storeDataLocally();
  }
  storeDataLocally() {
    this.publicationService.setCurrentPublications({
      currentIndex: this.currIndex,
      allIds: this.allIds,
      publicationRecords: this.publicationRecords,
    });
  }
  ngOnDestroy() {
    this.storeDataLocally();
    this.subscriptionArr.forEach((el) => el.unsubscribe());
  }
}
