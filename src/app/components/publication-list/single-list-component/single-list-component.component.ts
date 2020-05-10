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
    this._snackBar.open('Thank you for your feedback', 'Okay', {
      duration: 4000,
    });
    this.thumbsUp.emit(true);
  }
  shrugClicked() {
    this._snackBar.open('Thank you for your feedback', 'Okay', {
      duration: 4000,
    });
    this.shrug.emit(true);
  }
  thumbsDownClicked() {
    this._snackBar.open(
      'Thank you for your feedback. This irrelevant result will now be hidden',
      'Okay',
      {
        duration: 4000,
      }
    );
    this.thumbsDown.emit(true);
  }

  needButtonClicked() {
    this.needClicked.emit(true);
  }
  clearReactionClicked() {
    this.thumbsDown.emit(false);
  }
  getJournalRank(publicationRecord: PUBLICATION_RECORD) {
    let item = publicationRecord.metrics.find(
      (el) => el.display_name == 'Journal Rank'
    );
    if (item == null) return 'N/A';
    return item.value;
  }
  getSemenality(publicationRecord: PUBLICATION_RECORD) {
    let item = publicationRecord.metrics.find(
      (el) => el.display_name == 'Seminality'
    );
    if (item == null) return 'N/A';
    return item.value;
  }
}
