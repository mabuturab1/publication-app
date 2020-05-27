import {
  GetServerDataService,
  PUBLICATION_LIST,
} from './../../../services/getServerData.service';
import { PublicationDataService } from 'src/app/services/publication-data.service';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { faAngleDown, faFileExport } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-publication-list-options',
  templateUrl: './publication-list-options.component.html',
  styleUrls: ['./publication-list-options.component.scss'],
})
export class PublicationListOptionsComponent implements OnInit {
  @Output() showLocatePublication = new EventEmitter<boolean>();
  @Output() showManageScreen = new EventEmitter<boolean>();
  @Output() showDetailedLook = new EventEmitter<boolean>();
  @Output() removeClicked = new EventEmitter<boolean>();
  @Input() showManageButton = true;
  @Input() alignAsRow = false;
  @Input() isMultipleSelection = false;
  @Input() showCopyTo = true;
  @Input() showRemove = true;
  @Output() selectionModeChanged = new EventEmitter<string>();
  @Input() copyToListItems: string[];
  @Input() copyToListItemValues: string[];
  @Output() copyToItemsSelected = new EventEmitter<string>();
  faFileExport = faFileExport;
  viewTypeChanged(event: boolean) {
    this.showDetailedLook.emit(event);
  }
  faAngleDown = faAngleDown;
  constructor(
    private publicationService: PublicationDataService,
    private getServerDataService: GetServerDataService
  ) {}

  ngOnInit(): void {}

  showLocate(event: Event) {
    this.showLocatePublication.emit(true);
  }
  showManage(event: Event) {
    this.showManageScreen.emit(true);
  }
  getPublicationName() {
    let list = this.publicationService.getCurrentActiveList();
    return list != null ? list.name : 'My List';
  }
  toggleMultipleSelection() {
    this.isMultipleSelection = !this.isMultipleSelection;
    if (this.isMultipleSelection) this.selectionModeChanged.emit('multiple');
    else this.selectionModeChanged.emit('single');
  }
  removeButtonClicked() {
    this.removeClicked.emit(true);
  }
  listItemSelected(listId: string) {
    this.copyToItemsSelected.emit(listId);
  }
}
