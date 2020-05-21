import { DISCOVERY_FILTER } from './../../../services/getServerData.service';
import {
  Publication_Data,
  PublicationDataService,
} from './../../../services/publication-data.service';
import {
  Component,
  OnInit,
  ElementRef,
  EventEmitter,
  Output,
  Input,
} from '@angular/core';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-options',
  templateUrl: './main-options.component.html',
  styleUrls: ['./main-options.component.scss'],
})
export class MainOptionsComponent implements OnInit {
  showFilterDialog = false;
  @Input() filter: DISCOVERY_FILTER;
  @Output() buttonClicked = new EventEmitter<boolean>();
  @Output() sortTypeChanged = new EventEmitter<string>();
  @Output() filterResults = new EventEmitter<any>();
  @Input() sortLabel = '';
  @Input() showOptions = true;
  @Input() highlightAdd = false;
  @Input() highlightMyList = false;

  faAngleDown = faAngleDown;
  @Output() showDetailedLook = new EventEmitter<boolean>();
  addClicked() {
    this.publicationService.toggleLocateSidebar();
    this.buttonClicked.emit(true);
  }
  viewTypeChanged(event: boolean) {
    this.showDetailedLook.emit(event);
  }
  myListClicked() {
    this.publicationService.toggleListSidebar();
    this.buttonClicked.emit(true);
  }
  sortTypeUpdated(event: string) {
    this.sortTypeChanged.emit(event);
  }
  filterDialogButtonClicked(event: any) {
    this.showFilterDialog = !this.showFilterDialog;
    event.stopPropagation();
  }
  constructor(
    private eRef: ElementRef,
    private publicationService: PublicationDataService,
    private router: Router
  ) {}
  ngOnInit(): void {}
  contactUs() {
    this.router.navigate(['contact-us']);
  }
  filterResultsChanged(event: any) {
    this.filterResults.emit(event);
  }
}
