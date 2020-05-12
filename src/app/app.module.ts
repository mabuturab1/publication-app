import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainComponent } from './components/main/main.component';

import { PublicationListComponent } from './components/publication-list/publication-list.component';
import { MatCardModule } from '@angular/material/card';
import { MainOptionsComponent } from './components/main/main-options/main-options.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SingleListComponentComponent } from './components/publication-list/single-list-component/single-list-component.component';
import { PublicationListOptionsComponent } from './components/publication-list/publication-list-options/publication-list-options.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSelectModule } from '@angular/material/select';
import { LocatePublicationComponent } from './components/publication-list/locate-publication/locate-publication.component';
import { FilterDialogComponent } from './components/common/filter-dialog/filter-dialog.component';
import { ManagePublicationListsComponent } from './components/publication-list/manage-publication-lists/manage-publication-lists.component';
import { PublicationListItemComponent } from './components/publication-list/manage-publication-lists/publication-list-item/publication-list-item.component';
import { CurrentPublicationListComponent } from './components/publication-list/current-publication-list/current-publication-list.component';

import { HistogramComponent } from './components/common/histogram/histogram.component';
import { DropdownListComponent } from './components/common/dropdown-list/dropdown-list.component';
import { DropdownButton } from './components/common/dropdown-button/dropdown-button.component';
import { DetailButtonComponent } from './components/common/detail-button/detail-button.component';
import { FilterButtonComponent } from './components/common/filter-button/filter-button.component';
import { Ng5SliderModule } from 'ng5-slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { EventBlockerDirective } from './components/common/directives/event-blocker.directive';
import { HideMeDirective } from './components/common/directives/hide-me.directive';
import { SortButtonComponent } from './components/common/sort-button/sort-button.component';
import { ViewPublicationComponent } from './components/publication-list/view-publication/view-publication.component';
import { ExpandableButtonComponent } from './components/common/expandable-button/expandable-button.component';
import { BadgeButtonComponent } from './components/common/badge-button/badge-button.component';

import { HomeComponent } from './components/home/home.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MyLoaderComponent } from './components/my-loader/my-loader.component';
// import { LoaderInterceptor } from './interceptors/loader-interceptor.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NewListComponent } from './components/publication-list/manage-publication-lists/new-list/new-list.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { BadgeTooltipComponent } from './components/common/badge-tooltip/badge-tooltip.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,

    PublicationListComponent,
    MainOptionsComponent,
    SingleListComponentComponent,
    PublicationListOptionsComponent,
    LocatePublicationComponent,
    FilterDialogComponent,
    ManagePublicationListsComponent,
    PublicationListItemComponent,
    CurrentPublicationListComponent,

    HistogramComponent,
    DropdownListComponent,
    DropdownButton,
    DetailButtonComponent,
    FilterButtonComponent,
    EventBlockerDirective,
    HideMeDirective,
    SortButtonComponent,
    ViewPublicationComponent,
    ExpandableButtonComponent,
    BadgeButtonComponent,

    HomeComponent,

    ContactUsComponent,

    MyLoaderComponent,

    NewListComponent,

    BadgeTooltipComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatFormFieldModule,
    FormsModule,
    DropdownModule,
    MatButtonModule,
    FontAwesomeModule,
    MatSidenavModule,
    MatSelectModule,
    Ng5SliderModule,
    RouterModule,
    MatSnackBarModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    InfiniteScrollModule,
  ],
  providers: [
    // { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
