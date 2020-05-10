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

  constructor(
    private getServerDataService: GetServerDataService,
    private _snackBar: MatSnackBar,
    private publicationService: PublicationDataService
  ) {}
  ngOnInit() {
    this.subscriptionArr.push(
      this.getServerDataService.showSnackbar.subscribe((el) => {
        this.showErrorMessage(el);
        console.log('show error called');
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
  showErrorMessage(message: string) {
    this._snackBar.open(message, 'Okay', {
      duration: 4000,
    });
  }
  ngOnDestroy() {
    this.subscriptionArr.forEach((el) => el.unsubscribe());
  }
}
