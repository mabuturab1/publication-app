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

  constructor(
    private getServerDataService: GetServerDataService,
    private _snackBar: MatSnackBar
  ) {}
  ngOnInit() {
    this.subscriptionArr.push(
      this.getServerDataService.errorOccurred.subscribe((el) => {
        this.showErrorMessage('An error Occurred');
        console.log('show error called');
      })
    );
    this.subscriptionArr.push(
      this.getServerDataService.isLoggedIn.subscribe((el) => {
        this.getServerDataService.initAppData();
      })
    );
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
