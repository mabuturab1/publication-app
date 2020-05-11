import { PublicationDataService } from 'src/app/services/publication-data.service';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { UtilsService } from './utils.service';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
export interface PUBLICATION_LIST {
  name?: string;
  publication_ids?: string[];
}
export interface Managed_List {
  list_id: string;
  list_name: string;
}
export interface PUBLICATION_ID {
  mag_id?: string;
}
export interface PUBLICATION_RECORD {
  abstract?: string;
  affiliations?: { key: string; name: string }[];
  authors?: AUTHOR[];

  doc_type?: string;
  doi?: string;
  id?: string;
  journal?: string;
  language?: string[];

  locator?: string;
  publication_type?: string;
  mag_id?: string;
  metrics?: METRIC[];
  tags?: [
    {
      type?: string;
      tooltip?: string;
    }
  ];
  title?: string;

  urls?: { url: string }[];
  year?: 0;
}

export interface PUBLICATION_RECORD_EXTRA {
  abstract?: '';
  data_series?: [
    {
      name?: string;
      label?: string | number;
      x_axis?: string;
      y_axis?: string;

      data_points?: number[][];
    }
  ];
  metrics?: METRIC[];
}

export interface AUTHOR {
  display_name?: string;
  affiliations?: string[];
}

export interface DISCOVERY_SORT {
  type?: string;
}

export interface DISCOVERY_FILTER {
  year_start?: number;
  year_end?: number;
  exclude_keywords?: string;
  cutoff?: number | 200;
  exclude_in_refs?: true;
  exclude_out_refs?: true;
}

export interface SEARCH_SORT {
  type?: string;
}
export interface SEARCH_FILTER {
  year_start?: number;
  year_end?: number;
  exclude_keywords?: string;
  cutoff?: string;
  [key: string]: string | number;
}

export interface LIST {
  name?: string;
  publication_ids?: string[];
}
export interface METRIC {
  type?: string;
  relates_to?: string;
  display_name?: string;
  value_type?: string;
  value?: '' | 0;
}

export interface ERROR {
  success?: false;
  error_id?: '';
  message?: '';
}
export interface USER_RESPONSE {
  subject?: string;
  message?: string;
}
@Injectable({
  providedIn: 'root',
})
export class GetServerDataService {
  token = null;
  isLoggedIn = new BehaviorSubject<boolean>(false);
  userLoginStatus = false;
  gettingActiveList = false;
  showSnackbar = new Subject<string>();
  constructor(
    private http: HttpClient,
    private utilsService: UtilsService,
    private publicationService: PublicationDataService
  ) {}
  getHttpHeaders() {
    return new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
  }
  setSnackbarMessage(el: string) {
    this.showSnackbar.next(el);
  }
  login(uid: string, callback) {
    this.http.get(this.utilsService.getLoginUrl(uid)).subscribe(
      (el: any) => {
        if (el != null) {
          this.token = el.login.token;
          this.userLoginStatus = true;
          localStorage.setItem('infoDiscoveryToken', this.token);
          this.isLoggedIn.next(true);
          console.log('token is', this.token);
          callback(true);
        }
      },
      (error) => {
        callback(false);
        this.showSnackbar.next('An error occurred during login');
      }
    );
  }
  initActiveList(callback) {
    //   if (this.gettingActiveList) return;
    //  this.gettingActiveList=true;
    this.getActiveList((listId) => {
      if (listId == null) {
        callback(false);
        // this.gettingActiveList = false;
        return;
      }
      this.publicationService.setCurrentActiveListId(listId);
      this.getPublicationListById(listId, (activeList) => {
        if (activeList == null) {
          // this.gettingActiveList = false;
          callback(false);
          return;
        }
        this.publicationService.setCurrentActiveList(activeList);
        // this.gettingActiveList = false;
        callback(true);
      });
    });
  }
  getUserLoginStatus() {
    return this.userLoginStatus;
  }
  getToken(callback) {
    var token = localStorage.getItem('infoDiscoveryToken');
    if (token != null) {
      callback(token);
    } else callback(null);
  }
  searchForLists(query: string, filter: SEARCH_FILTER, sort: string, callback) {
    this.http
      .post(
        this.utilsService.publicationSearch(),
        {
          query: query,
          filter: filter,
          sort: sort,
          offset: 0,
          length: 50,
        },
        {
          headers: this.getHttpHeaders(),
        }
      )
      .subscribe(
        (response: any) => {
          console.log(response);
          callback(response.publication_ids);
        },
        (error) => {
          callback(null);

          this.showSnackbar.next(
            'An error occurred during search.Please try again'
          );
        }
      );
  }
  // searchForLists(
  //   query: string,
  //   filter: SEARCH_FILTER,
  //   sort: SEARCH_SORT,
  //   callback
  // ) {
  //   let httpParams = new HttpParams({
  //     fromString: 'filter=' + encodeURIComponent(JSON.stringify({})),
  //   });
  //   httpParams = httpParams.append('query', encodeURIComponent(query));
  //   httpParams = httpParams.append('sort', encodeURIComponent(sort.type));

  //   this.http
  //     .get(this.utilsService.publicationSearch(), {
  //       headers: this.getHttpHeaders(),
  //       params: httpParams,
  //     })
  //     .subscribe(
  //       (response: any) => {
  //         console.log(response);
  //         callback(response.publication_ids);
  //       },
  //       (error) => callback(null)
  //     );
  // }
  createNewList(data: any, callback) {
    this.http.post(this.utilsService.createNewPublicationList(), {});
  }

  getLoginUrl(uid: string) {}
  updateActiveList(id: string, callback) {
    this.http
      .put(
        this.utilsService.updateActiveList(),
        { list_id: id },
        { headers: this.getHttpHeaders() }
      )
      .subscribe(
        (el) => {
          console.log('updated list');
          callback(el);
        },
        (error) => {
          callback(null);

          this.showSnackbar.next(
            'An error occurred while updating active list'
          );
        }
      );
  }
  getActiveList(callback) {
    this.http
      .get(this.utilsService.getActiveList(), {
        headers: this.getHttpHeaders(),
      })
      .subscribe(
        (el: any) => {
          console.log('Active list is', el);
          callback(el.list_id);
        },
        (error) => {
          callback(null);
          this.showSnackbar.next('An error occurred while getting active list');
        }
      );
  }
  importReadingList() {}

  getPublicationById(id: string, onlyExtra: boolean, callback) {
    this.http
      .get(this.utilsService.getPublication(id, onlyExtra), {
        headers: this.getHttpHeaders(),
      })
      .subscribe(
        (el: any) => {
          console.log('got active list', el);
          callback(el.publications);
        },
        (error) => {
          callback(null);
          this.showSnackbar.next('An error occurred while getting pubication');
        }
      );
  }
  getPublicationListById(id: string, callback) {
    this.http
      .get(this.utilsService.getPublicationListById(id), {
        headers: this.getHttpHeaders(),
      })
      .subscribe(
        (el: any) => {
          console.log('got active list', el);
          callback(el.list);
        },
        (error) => {
          callback(null);
          this.showSnackbar.next(
            'An error occurred while getting publication list'
          );
        }
      );
  }
  createNewPublicationList(data: PUBLICATION_LIST, callback) {
    this.http
      .post(this.utilsService.createNewPublicationList(), data, {
        headers: this.getHttpHeaders(),
      })
      .subscribe(
        (el: any) => {
          console.log('create new publication list', el);
          callback(el.id);
        },
        (error) => {
          callback(null);
          this.showSnackbar.next('An error occurred while creating new list');
        }
      );
  }
  getAllPublicationList(callback) {
    this.http
      .get(this.utilsService.getAllPublicationList(), {
        headers: this.getHttpHeaders(),
      })
      .subscribe(
        (el: any) => {
          console.log('get publication list', el);
          callback(el.lists);
        },
        (error) => {
          callback(null);
          this.showSnackbar.next(
            'An error occurred while getting publication list'
          );
        }
      );
  }
  deletePublicationList(id: string, callback) {
    this.http
      .delete(this.utilsService.deletePublicationList(id), {
        headers: this.getHttpHeaders(),
      })
      .subscribe(
        (el) => {
          console.log('delete publication list', el);
          callback(el);
        },
        (error) => {
          callback(null);
          this.showSnackbar.next('An error occurred while deleting list');
        }
      );
  }
  updateExistingList(listId: string, payload: PUBLICATION_LIST, callback) {
    this.http
      .put(this.utilsService.updateExistingList(listId), payload, {
        headers: this.getHttpHeaders(),
      })
      .subscribe(
        (el) => {
          console.log('update existing list', el);
          callback(el);
        },
        (error) => {
          callback(null);
          this.showSnackbar.next('An error occurred while updating list');
        }
      );
  }
  getDiscoveryLists(listId: string, filter: any, sort: any, callback) {
    if (this.token == null) {
      return;
    }
    this.http
      .post(
        this.utilsService.getDiscoveryLists(),
        {
          list_id: listId,
          filter: filter,
          sort: sort,
        },
        { headers: this.getHttpHeaders() }
      )
      .subscribe(
        (el: any) => {
          console.log('el is', el);
          callback(el.results);
        },
        (error) => {
          callback(null);
          this.showSnackbar.next(
            'An error occurred while getting discovery feed'
          );
        }
      );
  }

  getMultiplePublicationByIds(list: string[], onlyExtra: boolean, callback) {
    this.http
      .post(
        this.utilsService.getMultiplePublicationsByIds(),
        {
          ids: list,
          only_extra: onlyExtra,
        },
        { headers: this.getHttpHeaders() }
      )
      .subscribe(
        (el: any) => {
          console.log('multiple list are', el.publications);
          callback(el.publications);
        },
        (error) => {
          callback(null);
          this.showSnackbar.next(
            'An error occurred while getting publications '
          );
        }
      );
  }
  setUserResponse(userResponse: USER_RESPONSE, callback) {
    console.log('sending request', userResponse);
    this.http
      .post(this.utilsService.setUserResponse(), userResponse, {
        headers: this.getHttpHeaders(),
      })
      .subscribe(
        (el) => {
          console.log('result send');
          callback(el);
        },
        (error) => callback(null)
      );
  }
  setReactions(
    listId: string,
    publicationId: string,
    reaction: string,
    callback
  ) {
    this.http
      .post(
        this.utilsService.getReactions(listId, publicationId),
        { reaction: reaction },
        { headers: this.getHttpHeaders() }
      )
      .subscribe(
        (el) => {
          callback(el);
        },
        (error) => callback(null)
      );
  }
}
