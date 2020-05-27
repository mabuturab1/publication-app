import { Managed_List } from 'src/app/services/getServerData.service';
import {
  GetServerDataService,
  LIST,
  PUBLICATION_RECORD,
  PUBLICATION_LIST,
} from './../../services/getServerData.service';
import { DataProviderService } from './../../services/dataProvider.service';

import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  OnDestroy,
} from '@angular/core';
import { faTimes, faArrowsAltV } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { PublicationDataService } from 'src/app/services/publication-data.service';
@Component({
  selector: 'app-publication-list',
  templateUrl: './publication-list.component.html',
  styleUrls: ['./publication-list.component.scss'],
})
export class PublicationListComponent implements OnInit, OnDestroy {
  itemsList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  @Input() data: any;
  @Input() scrollPosition = 0;
  faTimes = faTimes;
  faArrowsAltV = faArrowsAltV;
  @Output() closeDrawerClicked = new EventEmitter<boolean>();
  @Output() toggleDrawerClicked = new EventEmitter<boolean>();

  @Input() showManageButton = true;
  @Input() themedList = false;
  @Input() fixedHeader = false;
  @Input() showFullScreenToggle = true;
  @Input() onlyLocateScreen = false;
  @Input() showCurrentPublication = true;
  currentActiveListId = '';
  publicationRecordsListId: string[] = [];
  subscriptionArr: Subscription[] = [];
  showDetailedLookForPublication = false;
  showLocatePublication = false;
  showManageScreen = false;
  viewPublication = false;
  isMultipleSelection = false;
  screenInit = false;
  showSpinner = false;
  managedList: string[] = [];
  maangedListIds: string[] = [];

  @Output() showListAsNewsFeed = new EventEmitter<boolean>();
  @Output() setScrollPosition = new EventEmitter<string>();
  closeDrawer(event: Event) {
    this.closeDrawerClicked.emit(true);
  }
  toggleDrawer(event: Event) {
    this.toggleDrawerClicked.emit(true);
  }
  constructor(
    private publicationService: PublicationDataService,
    private dataProviderService: DataProviderService,
    private getServerDataService: GetServerDataService
  ) {}

  ngOnInit(): void {
    this.subscriptionArr.push(
      this.getServerDataService.isLoggedIn.subscribe((el) => {
        if (el) {
          if (this.publicationService.getAllManagedLists() == null) {
            this.getServerDataService.initAllPublicationLists((data) => {
              if (data != null) this.updateManagedList();
            });
          } else this.updateManagedList();
        }
      })
    );
    this.subscriptionArr.push(
      this.publicationService.updateManagedLists.subscribe((data) => {
        this.updateManagedList();
      })
    );
  }
  updateManagedList() {
    this.managedList = this.publicationService
      .getAllManagedLists()
      .map((el) => {
        return el.list_name;
      });
    this.maangedListIds = this.publicationService
      .getAllManagedLists()
      .map((el) => {
        return el.list_id;
      });
    let index = this.maangedListIds.findIndex(
      (el) => el === this.publicationService.getCurrentActiveListId()
    );
    if (index < 0) return;
    this.managedList.splice(index, 1);
    this.maangedListIds.splice(index, 1);
  }

  resetAllItems() {
    this.showLocatePublication = false;
    this.showManageScreen = false;
    this.viewPublication = false;
    this.isMultipleSelection = false;
  }
  showManageWindow(event: Event) {
    this.showManageScreen = true;
    this.publicationService.setLocateSidebar(false);
    this.showListAsNewsFeed.emit(true);
  }
  hideManageWindow(event: Event) {
    this.showManageScreen = false;

    this.showListAsNewsFeed.emit(false);
  }
  viewTypeChanged(event: boolean) {
    this.showDetailedLookForPublication = event;
    this.publicationService.setCurrentPublications({
      ...this.publicationService.getCurrentPublicationsData(),
      sortType: this.showDetailedLookForPublication ? 'Detailed' : 'Compact',
    });
  }
  ngOnDestroy() {
    this.subscriptionArr.forEach((el) => el.unsubscribe());
  }
  selectionModeUpdated(event: string) {
    this.isMultipleSelection = event == 'multiple';
    this.publicationService.setMultiSelection(this.isMultipleSelection);
  }
  removeButtonClicked() {
    this.publicationService.removeMultipleItemsFromActiveList(
      this.publicationRecordsListId
    );
    this.isMultipleSelection = false;
  }

  locatePublication(show: boolean) {
    this.publicationService.toggleLocateSidebar();
  }
  multipleSelectedItemsChanged(event: string[]) {
    this.publicationRecordsListId = event;
  }
  managedListItemSelected(listId: string) {
    var item = this.publicationService
      .getAllManagedLists()
      .find((el) => el.list_id === listId);
    if (item == null) return;
    this.showSpinner = true;
    this.getExistingList(item, (data) => {
      this.showSpinner = false;
      this.publicationRecordsListId = this.publicationRecordsListId.concat(
        data.publication_ids
      );
      this.updateExistingList(
        item.list_id,
        item.list_name,
        this.publicationRecordsListId,
        (data) => {
          if (data != null) {
            this.isMultipleSelection = false;
            this.getServerDataService.setSnackbarMessage(
              'items copied successfully'
            );
          }
        }
      );
    });
  }
  getExistingList(item: Managed_List, callback) {
    this.getServerDataService.getPublicationListById(
      item.list_id,
      (data: PUBLICATION_LIST) => {
        if (data == null) return;
        callback(data);
      }
    );
  }
  updateExistingList(
    listId: string,
    name: string,
    updatedPublicationIds: string[],
    callback
  ) {
    this.showSpinner = true;
    this.getServerDataService.updateExistingList(
      listId,
      { name: name, publication_ids: updatedPublicationIds },
      (data) => {
        this.showSpinner = false;
        callback(data);
      }
    );
  }

  updateScrollPosition(event: string) {
    this.setScrollPosition.emit(event);
  }
}
