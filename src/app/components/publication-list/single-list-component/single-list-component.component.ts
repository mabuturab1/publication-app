import { PUBLICATION_RECORD } from './../../../services/getServerData.service';
import { DataProviderService } from './../../../services/dataProvider.service';

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  faEye,
  faPlus,
  faTrashAlt,
  faFileExport,
  faThumbsUp,
  faThumbsDown,
  faEyeSlash,
  faExternalLinkAlt,
  faMehRollingEyes,
  faBan,
  faGem,
} from '@fortawesome/free-solid-svg-icons';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EventLoggerService } from 'src/app/services/event-logger.service';
@Component({
  selector: 'app-single-list-component',
  templateUrl: './single-list-component.component.html',
  styleUrls: ['./single-list-component.component.scss'],
})
export class SingleListComponentComponent implements OnInit {
  faEye = faEye;
  faPlus = faPlus;
  faTrashAlt = faTrashAlt;
  faFileExport = faFileExport;
  faThumbsUp = faThumbsUp;
  faThumbsDown = faThumbsDown;
  faEyeSlash = faEyeSlash;
  faMehRollingEyes = faMehRollingEyes;
  faExternalLinkAlt = faExternalLinkAlt;
  faBan = faBan;
  faGem = faGem;

  testText = 'test';
  @Input() componentName: string;
  @Input() isMultipleSelection = false;
  @Input() showSpinner = false;
  @Input() wideTooltip = true;
  @Input() fetchingPublication = false;
  @Input() publicationData: PUBLICATION_RECORD = {};
  @Input() showAbstract = true;
  @Input() showRemove = false;
  @Input() showAdd = false;
  @Input() showSeedNewList = false;
  @Input() showView = false;
  @Input() applyTheme = true;
  @Input() isDetailed = false;
  @Input() removeShadow = false;
  @Input() showReactions = false;
  @Input() showHide = false;
  @Input() disabled = false;
  @Input() userReaction: string = null;
  @Input() contractPublication = false;
  @Input() viewMode = false;
  @Input() animateAdd = false;
  @Input() windowWidthpx: number;
  @Output() addClicked = new EventEmitter<boolean>();
  @Output() removeClicked = new EventEmitter<boolean>();
  @Output() viewClicked = new EventEmitter<boolean>();
  @Output() hideClicked = new EventEmitter<boolean>();
  @Output() seedNewListClicked = new EventEmitter<boolean>();
  @Input() showAuthorsAndAffilis = true;
  @Output() needClicked = new EventEmitter<boolean>();
  @Output() thumbsUp = new EventEmitter<boolean>();
  @Output() shrug = new EventEmitter<boolean>();
  @Output() thumbsDown = new EventEmitter<boolean>();
  @Output() clearReaction = new EventEmitter<boolean>();
  @Output() iAmSelected = new EventEmitter<boolean>();
  expandBadges = false;

  constructor(
    private dataProviderService: DataProviderService,
    private _snackBar: MatSnackBar,
    private eventLoggerService: EventLoggerService
  ) {}

  ngOnInit(): void {}
  selectionChanged(event: any) {
    this.iAmSelected.emit(event.target.checked);
  }
  addButtonClicked(event: Event) {
    this.addClicked.emit(true);
  }
  viewButtonClicked() {
    this.viewClicked.emit(true);
  }
  seedNewListButtonClicked() {
    this.seedNewListClicked.emit(true);
  }
  removeButtonClicked() {
    this.removeClicked.emit(true);
  }
  getTextColorForBadge() {
    return this.applyTheme ? '#ffffff' : 'rgba(0,0,0,0.87)';
  }
  expansionStatusChanged(event: boolean) {
    this.expandBadges = event;
  }
  hideButtonClicked() {
    this.hideClicked.emit(true);
  }

  thumbsUpClicked() {
    this.thumbsUp.emit(true);
  }
  shrugClicked() {
    this.shrug.emit(true);
  }
  thumbsDownClicked() {
    this.thumbsDown.emit(true);
  }

  needButtonClicked() {
    this.needClicked.emit(true);
  }
  clearReactionClicked() {
    this.clearReaction.emit(true);
  }
  getRelatesToJournal(publicationRecord: PUBLICATION_RECORD) {
    let items = publicationRecord.metrics.filter(
      (el) => el.relates_to == 'journal'
    );
    if (items == null) return [];
    return items;
  }
  getTags(publicationRecord: PUBLICATION_RECORD) {
    if (publicationRecord.tags == null) return [];
    if (publicationRecord.tags.length < 1) return [];

    return publicationRecord.tags;
  }
  getRelatesToPublication(publicationRecord: PUBLICATION_RECORD) {
    let items = publicationRecord.metrics.filter(
      (el) => el.relates_to == 'publication'
    );
    if (items == null || items.length < 1) return [];
    return items;
  }
  getIconForContractPublication(publicationData: PUBLICATION_RECORD) {
    if (
      publicationData.user_data == null ||
      publicationData.user_data.reaction == null
    )
      return null;
    if (publicationData.user_data.reaction == 'thumbs up') return faThumbsUp;
    if (publicationData.user_data.reaction == 'thumbs down')
      return faThumbsDown;
    if (publicationData.user_data.reaction == 'shrug') return faMehRollingEyes;
  }
  getSelectedReactionTooltip(publicationData: PUBLICATION_RECORD) {
    if (
      publicationData.user_data == null ||
      publicationData.user_data.reaction == null
    )
      return null;
    if (publicationData.user_data.reaction == 'thumbs up')
      return 'You reacted "Best match"';
    if (publicationData.user_data.reaction == 'thumbs down')
      return 'You reacted "Bad match"';
    if (publicationData.user_data.reaction == 'shrug')
      return 'You reacted "Shrug"';
  }
  isThumbsDown(publicationData: PUBLICATION_RECORD) {
    return this.getIconForContractPublication(publicationData) == faThumbsDown;
  }
  getUserReaction(publicationData: PUBLICATION_RECORD) {
    if (
      publicationData.user_data == null ||
      publicationData.user_data.reaction == null
    )
      return null;
    if (publicationData.user_data.reaction == 'thumbs up') return 'thumbs up';
    if (publicationData.user_data.reaction == 'thumbs down')
      return 'thumbs down';
    if (publicationData.user_data.reaction == 'shrug') return 'shrug';
  }
}
