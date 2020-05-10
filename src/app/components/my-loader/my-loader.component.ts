import { Component, OnInit, Input } from '@angular/core';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-my-loader',
  templateUrl: './my-loader.component.html',
  styleUrls: ['./my-loader.component.scss'],
})
export class MyLoaderComponent implements OnInit {
  @Input() loading: boolean = false;

  constructor(private loaderService: LoaderService) {
    // this.loaderService.isLoading.subscribe((v) => {
    //   console.log('isloading', v);
    //   this.loading = v;
    // });
  }
  ngOnInit() {}
}
