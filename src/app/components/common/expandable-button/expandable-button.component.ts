import { AUTHOR } from './../../../services/getServerData.service';

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-expandable-button',
  templateUrl: './expandable-button.component.html',
  styleUrls: ['./expandable-button.component.scss'],
})
export class ExpandableButtonComponent implements OnInit {
  @Input() list: string[] = [];
  @Input() affiliationsList: { key: string; name: string }[] = [];
  @Input() authors: AUTHOR[] = [];
  @Input() showNumberPrefix = false;
  @Input() isExpanded = false;
  @Output() currentExpansionStatus = new EventEmitter<boolean>();
  initialItems: string[] = [];
  initialSuperScript: string[] = [];
  lastSuperScript: string[] = [];
  showAffiliations = false;
  @Input() startItems = 2;
  @Input() endItems = 1;
  @Input() textColor = '#ffffff';
  affiliations: string[] = [];
  buttonLabel = '0';
  showButton = false;

  lastItems: string[] = [];
  constructor() {}

  ngOnInit(): void {
    if (this.authors != null && this.authors.length > 0) {
      this.list = this.getAuthorNames(this.authors);

      this.affiliations = this.getAuthorAffiliations(this.authors);
      this.assignSuperScript();
    } else if (
      this.affiliationsList != null &&
      this.affiliationsList.length > 0
    ) {
      this.list = this.getAffiliationsList();
    }
    this.assignItems();
  }
  getAffiliationsList() {
    var list = [];
    for (let i = 0; i < this.affiliationsList.length; i++) {
      if (
        this.affiliationsList[i].key != null &&
        this.affiliationsList[i].name != null
      )
        list.push(
          this.affiliationsList[i].key + ' ' + this.affiliationsList[i].name
        );
    }
    return list;
  }
  assignItems() {
    if (this.list.length > this.startItems + this.endItems) {
      this.showButton = true;
      for (let i = 0; i < this.startItems; i++) {
        this.initialItems.push(this.list[i]);
      }
      var len = this.list.length;
      for (let i = len - this.endItems; i < len; i++) {
        this.lastItems.push(this.list[i]);
      }

      var remainingItems = this.list.length - (this.startItems + this.endItems);
      this.buttonLabel = '+' + remainingItems;
    } else {
      this.initialItems = this.list;
      this.showButton = false;
      this.isExpanded = true;
    }
  }
  assignSuperScript() {
    this.showAffiliations = true;
    if (this.list.length > this.startItems + this.endItems) {
      this.showButton = true;
      for (let i = 0; i < this.startItems; i++) {
        this.initialSuperScript.push(this.affiliations[i]);
      }
      var len = this.list.length;
      for (let i = len - this.endItems; i < len; i++) {
        this.lastSuperScript.push(this.affiliations[i]);
      }
    } else {
      this.initialSuperScript = this.affiliations;
    }
  }
  getAuthorNames(authors: AUTHOR[]) {
    let list: string[] = [];
    authors.forEach((el) => {
      list.push(el.display_name);
    });
    return list;
  }
  getAuthorAffiliations(authors: AUTHOR[]) {
    let list: string[] = [];
    authors.forEach((el) => {
      list.push(el.affiliations.join(' '));
    });
    return list;
  }
  changeExpandStatus(val: boolean) {
    this.isExpanded = val;
    this.currentExpansionStatus.emit(val);
  }
}
