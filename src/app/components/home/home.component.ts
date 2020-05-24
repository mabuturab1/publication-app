import { GetServerDataService } from './../../services/getServerData.service';
import { Publication_Data } from 'src/app/services/publication-data.service';
import {
  Component,
  ViewChild,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
  ElementRef,
} from '@angular/core';

import { PublicationDataService } from '../../services/publication-data.service';
import { Subscription } from 'rxjs';
import { MatDrawer } from '@angular/material/sidenav';

import { faArrowsAltV, faTimes } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  title = 'publication-app';
  faTimes = faTimes;
  faArrowsAltV = faArrowsAltV;
  showPublicationList = false;
  showFullSize = false;
  initDone = false;
  initCdr1 = false;
  initCdr2 = false;
  showFullScreenToggle = true;
  isAuthenticated = false;
  subscriptionArr: Subscription[] = [];
  locateScrollPosition = 10;
  prevLocatePosition = 0;
  removeTransition = false;

  @ViewChild('listDrawer', { static: false }) listDrawer: MatDrawer;
  @ViewChild('locateDrawer', { static: false }) locateDrawer: MatDrawer;
  @ViewChild('locateScreen', { static: false }) locateScreen: ElementRef;

  constructor(
    private publicationService: PublicationDataService,
    private route: ActivatedRoute,
    private getServerDataService: GetServerDataService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}
  showPublicationListAsNewsFeed(event) {
    this.showPublicationList = event;
    this.removeTransition = true;
  }
  toggleDrawerWindow(event: Event) {
    this.showFullSize = !this.showFullSize;
  }

  ngOnInit() {
    let uid = this.route.snapshot.queryParams['uid'];
    this.route.queryParams.subscribe((params) => {
      let uid = params['uid'];
      if (uid != null) {
        this.doLogin(uid);
        console.log('do login in subscribe home');
      } else
        this.getServerDataService.getToken((data) => {
          if (data != null)
            this.router.navigate([''], { queryParams: { uid: data } });
        });
    });
  }
  doLogin(uid: string) {
    console.log('do login in home');
    let status = this.getServerDataService.getUserLoginStatus();
    if (status) this.isAuthenticated = status;
    else
      this.getServerDataService.login(uid, (val: boolean) => {
        this.isAuthenticated = val;
      });
  }
  ngAfterViewInit() {
    this.subscriptionArr.push(
      this.publicationService.updateLeftSidebar.subscribe((el) => {
        this.removeTransition = false;
        this.showFullScreenToggle = true;
        this.showFullSize = false;

        if (this.locateDrawer.opened != el) {
          this.locateDrawer.toggle();
        }
      })
    );
    this.subscriptionArr.push(
      this.publicationService.updateRightSidebar.subscribe((el) => {
        this.removeTransition = false;
        this.showFullScreenToggle = true;
        this.showFullSize = false;

        if (this.listDrawer.opened != el) {
          this.listDrawer.toggle();
        }
        if (this.listDrawer.opened)
          this.publicationService.initActiveListInPublication();
      })
    );

    this.processForDrawerState();
  }
  processForDrawerState() {
    let status = this.publicationService.getDrawerStatus();
    if (this.listDrawer.opened != status.listDrawer) this.listDrawer.toggle();
    if (this.locateDrawer.opened != status.locateDrawer)
      this.locateDrawer.toggle();
    if (!this.initCdr1) this.cdr.detectChanges();
    this.initCdr1 = true;
  }

  ngOnDestroy() {
    this.subscriptionArr.forEach((el) => el.unsubscribe());
  }

  closeListDrawer() {
    this.publicationService.setListSidebar(false);
  }
  closeLocateDrawer() {
    this.publicationService.setLocateSidebar(false);
  }
  trackLocateScroll(event: any) {
    if (event.target != null && event.target.scrollTop != null) {
      this.locateScrollPosition = event.target.scrollTop;
    }
  }
  storeLocateScrollPosition() {
    this.prevLocatePosition = this.locateScrollPosition;
  }
  onLocateScroll(event: Event) {
    this.publicationService.onLocateScrollDownCalled();
  }
  onPublicationListScroll() {
    this.publicationService.onPublicationListScrollDownCalled();
  }
  setLocateScreenScrollPosition(event: string) {
    if (event == 'store') {
      this.storeLocateScrollPosition();
      return;
    } else if (event == 'update') {
      setTimeout(() => {
        this.locateScreen.nativeElement.scrollTop = this.prevLocatePosition;
      }, 10);
    }
  }
}
