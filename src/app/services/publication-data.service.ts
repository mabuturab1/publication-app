import {
  PUBLICATION_LIST,
  PUBLICATION_RECORD,
  DISCOVERY_FILTER,
} from './getServerData.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
export enum Publication_Data {
  PUBLICATION_HOME,
  PUBLICATION_ADD,
  PUBLICATION_VIEW,
  PUBLICATION_MANAGE,
}
export interface ComponentData {
  allIds: string[];
  currentIndex: number;
  publicationRecords: PUBLICATION_RECORD[];
  filter?: DISCOVERY_FILTER;
  sortType?: string;
}

export interface Author {
  name: string;
  affiliations: string[];
}
export interface PublicationDetails {
  id?: number;
  title: string;
  journalName?: string;
  journalRank?: string;
  authors?: Author[];
  affiliations?: string[];

  abstract?: string;
  content?: string;
}
@Injectable({
  providedIn: 'root',
})
export class PublicationDataService {
  currentNeededPublication: PUBLICATION_RECORD;
  currentDiscoveryFeedData: ComponentData;
  currentPublicationsData: ComponentData;
  currentlySelectedPublication: PUBLICATION_RECORD;
  activeListUpdated = new Subject<string>();
  // updateActiveListData = new Subject<boolean>();
  // activeListIdUpdated = new Subject<string>();
  // activeListDataUpdated = new Subject<boolean>();
  initActiveList = new Subject<boolean>();
  onLocateScrollDown = new Subject<boolean>();
  onPublicationListScrollDown = new Subject<boolean>();
  totalNumberOfList = 0;
  listDrawerOpened = false;
  locateDrawerOpened = false;
  currentPublicationIds: string[] = [];
  currentActiveList: PUBLICATION_LIST = null;
  currentActiveListId = '';
  setCurrentNeededPublication(publication: PUBLICATION_RECORD) {
    this.currentNeededPublication = publication;
  }

  setDiscoveryFeedData(discoveryFeedData: ComponentData) {
    this.currentDiscoveryFeedData = discoveryFeedData;
  }
  getDiscoveryFeedData() {
    return this.currentDiscoveryFeedData;
  }
  setCurrentPublications(pubData: ComponentData) {
    this.currentPublicationsData = pubData;
  }
  getCurrentPublicationsData() {
    return this.currentPublicationsData;
  }
  getCurrentNeededPublication() {
    return this.currentNeededPublication;
  }
  // activeListDataChanged() {
  //   this.updateActiveListData.next(true);
  // }
  setTotalManagedLists(totalList: number) {
    this.totalNumberOfList = totalList;
  }
  getTotalManagedLists() {
    return this.totalNumberOfList;
  }
  getCurrentActiveList() {
    return this.currentActiveList;
  }
  setCurrentActiveListId(listId: string) {
    this.currentActiveListId = listId;
    // this.activeListIdUpdated.next(listId);
  }
  getCurrentActiveListId() {
    return this.currentActiveListId;
  }
  setCurrentActiveList(list: PUBLICATION_LIST) {
    this.currentActiveList = list;
  }
  isCurrentPublication(list_id: string) {
    return this.currentPublicationIds.includes(list_id);
  }
  // setCurrentPublicationIds(val: string[]) {
  //   this.currentPublicationIds = val;
  //   console.log('new current publication ids');
  //   this.activeListDataUpdated.next(true);
  // }
  getDrawerStatus(): { listDrawer: boolean; locateDrawer: boolean } {
    return {
      listDrawer: this.listDrawerOpened,
      locateDrawer: this.locateDrawerOpened,
    };
  }

  listFullScreens = [Publication_Data.PUBLICATION_VIEW];
  updateLeftSidebar = new Subject<boolean>();
  updateRightSidebar = new Subject<boolean>();
  showSpinnerForCurrenltList = new Subject<boolean>();
  setCurrentlySelectedPublication(publication: PUBLICATION_RECORD) {
    this.currentlySelectedPublication = publication;
  }
  setLocateSidebar(isOpened: boolean) {
    this.locateDrawerOpened = isOpened;
    this.updateLeftSidebar.next(this.locateDrawerOpened);
  }
  setListSidebar(isOpened: boolean) {
    this.listDrawerOpened = isOpened;
    this.updateRightSidebar.next(this.listDrawerOpened);
  }

  toggleListSidebar() {
    this.listDrawerOpened = !this.listDrawerOpened;
    this.updateRightSidebar.next(this.listDrawerOpened);
  }
  toggleLocateSidebar() {
    this.locateDrawerOpened = !this.locateDrawerOpened;
    this.updateLeftSidebar.next(this.locateDrawerOpened);
  }
  getCurrentlySelectedPublication() {
    return this.currentlySelectedPublication;
  }

  isFullScreen(pubScreen: Publication_Data) {
    if (this.listFullScreens.includes(pubScreen)) return true;
    else return false;
  }
  fetchRecordsForCurrentlyActive(id: string) {
    console.log(' active list updated in publication service');
    this.activeListUpdated.next(id);
  }
  setSpinnerInCurrentList(val: boolean) {
    this.showSpinnerForCurrenltList.next(val);
  }
  initActiveListInPublication() {
    this.initActiveList.next(true);
  }
  onLocateScrollDownCalled() {
    this.onLocateScrollDown.next(true);
  }
  onPublicationListScrollDownCalled() {
    this.onPublicationListScrollDown.next(true);
  }
}
