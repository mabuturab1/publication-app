import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import {
  PUBLICATION_RECORD,
  GetServerDataService,
  LIST,
  DISCOVERY_FILTER,
  PUBLICATION_LIST,
  HISTOGRAM_DATA,
} from './../../services/getServerData.service';
import {
  PublicationDataService,
  ComponentData,
} from './../../services/publication-data.service';
import { DataProviderService } from './../../services/dataProvider.service';
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  OnDestroy,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, AfterViewInit, OnDestroy {
  publicationRecords: PUBLICATION_RECORD[] = [];
  contractPublication: Map<string, boolean> = new Map();
  showDetailedLook = true;
  faPlus = faPlus;
  @Output() buttonClicked = new EventEmitter<boolean>();
  @Input() showList = true;
  @Input() showToolbar = true;
  error = false;

  itemsList: string[] = [];
  filter: DISCOVERY_FILTER = {};
  currIndex = 0;
  preLoadItems = 10;
  allIds: string[] = [];
  showSpinner = false;
  fetchingData = false;
  subscriptionArr: Subscription[] = [];
  sortType: string = 'date';
  noData = false;
  addSidebarOpened = false;
  myListSidebarOpened = false;
  histogram: HISTOGRAM_DATA;
  innerWidth: number;
  noDataText = 'No results found. Kindly add new items to your active list';
  @ViewChild('publicationWrapper', { static: false })
  publicationWrapper: ElementRef;
  @ViewChild('mainListWrapper', { static: false })
  mainListWrapper: ElementRef;
  @ViewChild('wrapper', { static: false })
  wrapper: ElementRef;
  wideTooltip = true; //no effect of widetooltip on app right now
  constructor(
    private dataProviderService: DataProviderService,
    private publicationService: PublicationDataService,
    private getServerDataService: GetServerDataService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {}
  optionButtonClicked(event) {
    this.buttonClicked.emit(true);
  }
  viewTypeChanged(event: boolean) {
    this.showDetailedLook = event;
  }
  sortTypeUpdated(event: string) {
    this.sortType = event.toLowerCase();
    this.setFilterPair();
    this.getDiscoveryLists();
  }
  ngOnInit(): void {
    this.subscriptionArr.push(
      this.publicationService.activeListUpdated.subscribe((el: string) => {
        this.getDiscoveryLists();
      })
    );
    this.subscriptionArr.push(
      this.getServerDataService.isLoggedIn.subscribe((el) => {
        if (!this.showSpinner && el) this.getDiscoveryData();
      })
    );
  }
  ngAfterViewInit() {
    this.subscriptionArr.push(
      this.publicationService.updateLeftSidebar.subscribe((el) => {
        this.addSidebarOpened = el;
        setTimeout(() => {
          if (
            this.mainListWrapper.nativeElement.offsetWidth + 300 <
            this.publicationWrapper.nativeElement.offsetWidth
          )
            this.wideTooltip = false;
        }, 1000);
      })
    );
    this.subscriptionArr.push(
      this.publicationService.updateRightSidebar.subscribe((el) => {
        this.myListSidebarOpened = el;
        setTimeout(() => {
          if (
            this.mainListWrapper.nativeElement.offsetWidth + 300 <
            this.publicationWrapper.nativeElement.offsetWidth
          )
            this.wideTooltip = false;
        }, 1000);
      })
    );
  }

  getDiscoveryData() {
    var data = this.publicationService.getDiscoveryFeedData();

    if (data == null) this.getDiscoveryLists();
    else {
      this.showSpinner = true;
      // if (data.publicationRecords.length < 10)
      //   this.publicationRecords = data.publicationRecords;
      // else this.publicationRecords = data.publicationRecords.slice(0, 9);
      setTimeout(() => {
        this.getLocallyStoredData(data);
        this.showSpinner = false;
      }, 1000);
      this.updateFilterPair();
    }
  }
  getLocallyStoredData(data: ComponentData) {
    this.currIndex = data.currentIndex;
    this.allIds = data.allIds;
    this.publicationRecords = data.publicationRecords;
    this.histogram = data.histogram;

    if (this.publicationRecords.length < 1) this.noData = true;
  }

  getDiscoveryLists() {
    if (this.publicationService.getCurrentActiveListId() == null) return;

    this.updateFilterPair();
    this.itemsList = [];
    this.publicationRecords = [];
    this.showSpinner = true;
    this.noData = false;
    this.error = false;
    this.getServerDataService.getDiscoveryLists(
      this.publicationService.getCurrentActiveListId(),
      this.filter,
      this.sortType,
      (data: any) => {
        this.showSpinner = false;
        if (data == null) {
          this.noData = true;
          this.error = true;
          return;
        }
        this.histogram = data.histograms;
        this.publicationRecords = this.publicationRecords.concat(data.results);
        if (this.publicationRecords.length < 1) {
          this.noData = true;
          if (data.message) this.noDataText = data.message;
        } else this.noData = false;
      }
    );
  }

  addItemToList(publication_id: string) {
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
        this.publicationService.updateCurrentActiveListIds(
          list.publication_ids.concat(publication_id)
        );
        this.publicationService.setNewActiveList(
          this.publicationService.getCurrentActiveListId()
        );
        // this.getServerDataService.initActiveList((data) => {
        //   if (!data) this.showSpinner = false;
        //   if (data)
        //     this.publicationService.setNewActiveList(
        //       this.publicationService.getCurrentActiveListId()
        //     );
        // });

        this.publicationService.setCurrentPublications(null);
      }
    );
  }
  setFilterPair() {
    this.publicationService.setCurrentDiscoveryFilterPair({
      filter: this.filter,
      sort: this.sortType,
    });
  }
  filterResultsChanged(event: any) {
    this.filter = event;

    this.setFilterPair();
    this.getDiscoveryLists();
  }
  updateFilterPair() {
    var filterPair = this.publicationService.getCurrentDiscoveryFilterPair();
    if (filterPair != null) {
      this.filter = filterPair.filter;
      this.sortType = filterPair.sort;
    }
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
  getReactionForPublication(publicationData: PUBLICATION_RECORD) {
    if (publicationData.user_data == null) return null;
    if (publicationData.user_data.reaction == null) return null;

    return publicationData.user_data.reaction;
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
      'publication_list_item',
      (data: Object) => {
        this.fetchingData = false;
        if (data == null) return;
        var objectKeys = Object.keys(data);

        objectKeys.forEach((key) => {
          this.contractPublication.set(data[key].id, false);
          this.publicationRecords.push(data[key]);
        });

        this.currIndex += objectKeys.length;
      }
    );
  }
  logoClicked() {
    this.router.navigate(['']);
  }
  thumbsUpClicked(event: boolean, item: PUBLICATION_RECORD) {
    this.setUserReaction('thumbs up', item.id, (data) => {
      if (data) {
        let snackbarRef = this._snackBar.open(
          'Thank you for your feedback',
          'Contact Us',
          {
            duration: 4000,
          }
        );
        this.onSnackbarAction(snackbarRef, 'thumbs up', item);
        this.updateUserReactionOfPublication('thumbs up', item.id);
        this.contractPublication.set(item.id, true);
      }
    });
  }

  thumbsDownClicked(event: boolean, item: PUBLICATION_RECORD) {
    this.setUserReaction('thumbs down', item.id, (data) => {
      if (data) {
        this.contractPublication.set(item.id, true);

        let snackbarRef = this._snackBar.open(
          'Thank you for your feedback. This irrelevant result will now be hidden',
          'Contact Us',
          {
            duration: 4000,
          }
        );
        this.updateUserReactionOfPublication('thumbs down', item.id);
        this.onSnackbarAction(snackbarRef, 'thumbs down', item);
      }
    });
  }
  shrugClicked(event: boolean, item: PUBLICATION_RECORD) {
    this.setUserReaction('shrug', item.id, (data) => {
      if (data) {
        let snackbarRef = this._snackBar.open(
          'Thank you for your feedback',
          'Contact Us',
          {
            duration: 4000,
          }
        );
        this.updateUserReactionOfPublication('shrug', item.id);
        this.contractPublication.set(item.id, true);
        this.onSnackbarAction(snackbarRef, 'thumbs up', item);
      }
    });
  }
  onSnackbarAction(
    snackbarRef: MatSnackBarRef<any>,
    reaction: string,
    item: PUBLICATION_RECORD
  ) {
    this.subscriptionArr.push(
      snackbarRef.onAction().subscribe((el) => {
        this.publicationService.setCustomContactUsText(
          'I reacted ' + reaction + 'to the publication' + '\n'
        );
        this.publicationService.setCurrentNeededPublication(item);
        this.router.navigate(['contact-us']);
      })
    );
  }
  updateUserReactionOfPublication(reaction: string, publication_id: string) {
    let index = this.publicationRecords.findIndex(
      (el) => el.id == publication_id
    );
    if (index < 0) return;
    this.publicationRecords[index] = {
      ...this.publicationRecords[index],
      user_data: {
        reaction: reaction,
      },
    };
  }
  clearReaction(event: boolean, item: PUBLICATION_RECORD) {
    this.getServerDataService.deleteReactions(
      this.publicationService.getCurrentActiveListId(),
      item.id,
      (data) => {
        if (data) {
          this.contractPublication.set(item.id, false);
          this.updateUserReactionOfPublication(null, item.id);
        }
      }
    );
  }

  setUserReaction(reaction: string, itemId: string, callback) {
    this.getServerDataService.setReactions(
      this.publicationService.getCurrentActiveListId(),
      itemId,
      reaction,
      (data) => {
        callback(data);
      }
    );
  }
  contactUsClicked() {
    this.publicationService.setCustomContactUsText(
      'I keep having problems with the Discovery Feed  \n.The publication list is:'
    );
    this.publicationService.setErrorInDiscovery(true);
    this.router.navigate(['contact-us']);
  }
  getContractStatus(item: PUBLICATION_RECORD) {
    if (this.contractPublication.has(item.id))
      return this.contractPublication.get(item.id);
    return false;
  }
  storeDataLocally() {
    this.publicationService.setDiscoveryFeedData({
      currentIndex: this.currIndex,
      publicationRecords: this.publicationRecords,
      allIds: this.allIds,
      filter: this.filter,
      sortType: this.sortType,
      histogram: this.histogram,
    });
  }
  ngOnDestroy() {
    this.subscriptionArr.forEach((el) => el.unsubscribe());
    this.storeDataLocally();
  }
}
