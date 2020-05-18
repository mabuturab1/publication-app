import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UtilsService {
  constructor() {}
  getLoginUrl(uid: string) {
    return `/api/login?uid=${uid}`;
  }
  updateActiveList() {
    return `api/users/active_list`;
  }
  getActiveList() {
    return `api/users/active_list`;
  }
  importReadingList() {
    return `/api/import`;
  }

  getPublication(id: string, publicationView: string) {
    return `/api/publications/${id}?view=${publicationView}`;
  }
  createNewPublicationList() {
    return `/api/publication_lists`;
  }
  getAllPublicationList() {
    return `/api/publication_lists`;
  }
  getPublicationListById(id: string) {
    return `/api/publication_lists/${id}`;
  }
  deletePublicationList(id: string) {
    return `/api/publication_lists/${id}`;
  }
  updateExistingList(listId: string) {
    return `/api/publication_lists/${listId}`;
  }
  getDiscoveryLists() {
    return `/api/discovery`;
  }
  publicationSearch() {
    return `/api/publications/locate`;
    // return `/api/publications`;
  }
  getMultiplePublicationsByIds() {
    return '/api/publications/load_several';
  }
  setUserResponse() {
    return `api/feedback`;
  }
  getReactions(listId: string, publicationId: string) {
    return `/api/reactions/${listId}/${publicationId}`;
  }
  getQueryParam(obj: Object) {
    let query = '';
    query = query + encodeURIComponent('{');

    for (let key in obj) {
      query =
        query +
        encodeURIComponent('"') +
        encodeURIComponent(key) +
        encodeURIComponent('"') +
        encodeURIComponent(':') +
        encodeURIComponent(obj[key]) +
        encodeURIComponent(',');
    }
    query = query + encodeURIComponent('}');

    return query;
  }
}
