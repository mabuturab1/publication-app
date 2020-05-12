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
} from '@fortawesome/free-solid-svg-icons';
import { MatSnackBar } from '@angular/material/snack-bar';
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

  testText = 'test';
  @Input() isMultipleSelection = false;
  @Input() showSpinner = false;
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
  expandBadges = false;
  constructor(
    private dataProviderService: DataProviderService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}
  selectionChanged(event) {
    // this.dataProviderService.setIndexToRemove(
    //   this.publicationData.id,
    //   event.target.checked
    // );
  }
  addButtonClicked() {
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
  getRetracted(publicationRecord: PUBLICATION_RECORD) {
    if (publicationRecord.tags == null) return null;
    if (publicationRecord.tags.length < 1) return null;
    let item = publicationRecord.tags.find((el) => el.type == 'retracted');
    return item;
  }
  getRelatesToPublication(publicationRecord: PUBLICATION_RECORD) {
    let items = publicationRecord.metrics.filter(
      (el) => el.relates_to == 'publication'
    );
    if (items == null || items.length < 1) return [];
    return items;
  }
  getIconForContractPublication(publicaionData: PUBLICATION_RECORD) {
    if (
      publicaionData.user_data == null ||
      publicaionData.user_data.reaction == null
    )
      return null;
    if (publicaionData.user_data.reaction == 'thumbs up') return faThumbsUp;
    if (publicaionData.user_data.reaction == 'thumbs down') return faThumbsDown;
    if (publicaionData.user_data.reaction == 'shrug') return faMehRollingEyes;
  }
  isThumbsDown(publicationData: PUBLICATION_RECORD) {
    return this.getIconForContractPublication(publicationData) == faThumbsDown;
  }
}
