import {
  GetServerDataService,
  LIST,
  PUBLICATION_RECORD,
} from './../../services/getServerData.service';
import { DataProviderService } from './../../services/dataProvider.service';
import { Publication_Data } from './../../services/publication-data.service';

import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit,
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
  fetchingManagedLists = false;
  @Output() showListAsNewsFeed = new EventEmitter<boolean>();
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

  ngOnInit(): void {}

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
    console.log('Detailed look', this.showDetailedLookForPublication);
  }
  ngOnDestroy() {
    this.subscriptionArr.forEach((el) => el.unsubscribe());
  }
  selectionModeUpdated(event: string) {
    this.isMultipleSelection = event == 'multiple';
  }
  removeButtonClicked() {
    this.dataProviderService.removeItems();
    this.isMultipleSelection = false;
  }
  locatePublication(show: boolean) {
    this.publicationService.toggleLocateSidebar();
  }
}
