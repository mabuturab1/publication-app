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
  @Output() selectionModeChanged = new EventEmitter<string>();
  faFileExport = faFileExport;

  listItems = [
    'List 1',
    'List 2',
    'List 3',
    'List 4',
    'List 5',
    'List 6',
    'List 7',
    'List 8',
    'List 9',
    'List 10',
  ];
  viewTypeChanged(event: boolean) {
    this.showDetailedLook.emit(event);
  }
  faAngleDown = faAngleDown;
  constructor(private publicationService: PublicationDataService) {}

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
}
