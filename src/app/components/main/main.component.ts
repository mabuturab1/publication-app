import { Subscription } from 'rxjs';
import {
  PUBLICATION_RECORD,
  GetServerDataService,
  LIST,
  DISCOVERY_FILTER,
  PUBLICATION_LIST,
} from './../../services/getServerData.service';
import { PublicationDataService } from './../../services/publication-data.service';
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
  noData = false;

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
    this.getServerDataService.isLoggedIn.subscribe((el) => {
      if (!this.showSpinner) this.getDiscoveryData();
    });
  }
  getDiscoveryData() {
    var data = this.publicationService.getDiscoveryFeedData();

    if (data == null) this.getDiscoveryLists();
    else {
      setTimeout(() => {
        this.currIndex = data.currentIndex;
        this.allIds = data.allIds;
        this.publicationRecords = data.publicationRecords;
        // this.filter = data.filter;
        // this.sortType = data.sortType;
        if (this.publicationRecords.length < 1) this.noData = true;
      }, 10);
      this.updateFilterPair();
    }
  }
  getActiveList() {
    this.getServerDataService.initActiveList((data) => {
      if (data) this.getDiscoveryLists();
    });
  }
  getDiscoveryLists() {
    if (this.publicationService.getCurrentActiveListId() == null) return;
    this.updateFilterPair();
    this.itemsList = [];
    this.publicationRecords = [];
    this.showSpinner = true;
    this.noData = false;
    this.getServerDataService.getDiscoveryLists(
      this.publicationService.getCurrentActiveListId(),
      this.filter,
      this.sortType,
      (data: any[]) => {
        this.showSpinner = false;
        if (data == null) {
          this.noData = true;
          return;
        }
        this.publicationRecords = this.publicationRecords.concat(data);
        if (this.publicationRecords.length < 1) this.noData = true;
        else this.noData = false;
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
        this.showSpinner = false;

        this.getServerDataService.initActiveList((data) => {});
        this.publicationService.setNewActiveList(
          this.publicationService.getCurrentActiveListId()
        );

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
    console.log(filterPair);
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
  thumbsUpClicked(event: boolean, item: PUBLICATION_RECORD) {
    this.setUserReaction('thumbs up', item.id, (data) => {
      if (data) {
        this.getServerDataService.setSnackbarMessage(
          'Thank you for your feedback'
        );
        this.updateUserReactionOfPublication('thumbs up', item.id);
        this.contractPublication.set(item.id, true);
      }
    });
  }
  thumbsDownClicked(event: boolean, item: PUBLICATION_RECORD) {
    this.setUserReaction('thumbs down', item.id, (data) => {
      if (data) {
        this.contractPublication.set(item.id, true);

        this.getServerDataService.setSnackbarMessage(
          'Thank you for your feedback. This irrelevant result will now be hidden'
        );
        this.updateUserReactionOfPublication('thumbs down', item.id);
      }
    });
  }
  shrugClicked(event: boolean, item: PUBLICATION_RECORD) {
    this.setUserReaction('shrug', item.id, (data) => {
      if (data) {
        this.getServerDataService.setSnackbarMessage(
          'Thank you for your feedback'
        );
        this.updateUserReactionOfPublication('shrug', item.id);
        this.contractPublication.set(item.id, true);
      }
    });
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
  }
}
