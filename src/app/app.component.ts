import { EventLoggerService } from './services/event-logger.service';
import { PublicationDataService } from 'src/app/services/publication-data.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GetServerDataService } from './services/getServerData.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'publication-app';
  subscriptionArr: Subscription[] = [];
  interval: any;

  constructor(
    private getServerDataService: GetServerDataService,
    private _snackBar: MatSnackBar,
    private publicationService: PublicationDataService,
    private eventLoggerService: EventLoggerService
  ) {}
  ngOnInit() {
    this.startTelemetry();
    this.subscriptionArr.push(
      this.getServerDataService.showSnackbar.subscribe((el) => {
        this.showErrorMessage(el);
      })
    );
    this.subscriptionArr.push(
      this.getServerDataService.isLoggedIn.subscribe((el) => {
        if (el)
          this.getServerDataService.initActiveList((data) => {
            if (data)
              this.publicationService.setNewActiveList(
                this.publicationService.getCurrentActiveListId()
              );
          });
      })
    );
  }
  startTelemetry() {
    this.interval = setInterval(() => {
      let telemetryData = this.eventLoggerService.getEventList();
      if (telemetryData && telemetryData.length > 0)
        this.getServerDataService.updateTelemetry(
          telemetryData,
          (data: any) => {
            this.eventLoggerService.clearEventList();
          }
        );
    }, 15000);
  }
  showErrorMessage(message: string) {
    this._snackBar.open(message, 'Okay', {
      duration: 4000,
    });
  }

  ngOnDestroy() {
    this.subscriptionArr.forEach((el) => el.unsubscribe());
  }
}
