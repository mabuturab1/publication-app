import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { faTrashAlt, faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import { Managed_List } from 'src/app/services/getServerData.service';
@Component({
  selector: 'app-single-list',
  templateUrl: './publication-list-item.component.html',
  styleUrls: ['./publication-list-item.component.scss'],
})
export class PublicationListItemComponent implements OnInit {
  faTrashAlt = faTrashAlt;
  faCheckSquare = faCheckSquare;
  @Input() isActiveList = false;
  @Input() index = 0;
  @Input() data: Managed_List;
  @Output() activateItem = new EventEmitter<number>();
  @Output() renameClicked = new EventEmitter<boolean>();
  @Output() duplicateClicked = new EventEmitter<boolean>();
  @Output() removeClicked = new EventEmitter<boolean>();
  activateClicked() {
    this.activateItem.emit(this.index);
  }
  constructor() {}

  ngOnInit(): void {}
  renameButtonClicked() {
    this.renameClicked.emit(true);
  }
  duplicateButtonClicked() {
    this.duplicateClicked.emit(true);
  }
  removeButtonClicked() {
    this.removeClicked.emit(true);
  }
}
