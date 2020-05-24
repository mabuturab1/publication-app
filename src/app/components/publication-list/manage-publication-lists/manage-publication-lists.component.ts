import {
  GetServerDataService,
  PUBLICATION_LIST,
  Managed_List,
} from './../../../services/getServerData.service';
import { DataProviderService } from '../../../services/dataProvider.service';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { ResearchData } from 'src/app/services/dataProvider.service';
import { PublicationDataService } from 'src/app/services/publication-data.service';
@Component({
  selector: 'app-manage-publication',
  templateUrl: './manage-publication-lists.component.html',
  styleUrls: ['./manage-publication-lists.component.scss'],
})
export class ManagePublicationListsComponent implements OnInit {
  faTimes = faTimes;
  researchList: ResearchData[] = [];
  newListName = '';
  renamingList = false;
  duplicatingList = false;
  duplicatePublicationIds = [];
  renamedListId = '';
  activeList = '';
  isNewList = false;
  showSpinner = false;
  noData = false;
  itemList: { data: Managed_List; isActive: boolean }[] = [];
  @Output() hideManageScreen = new EventEmitter<boolean>();
  constructor(
    private dataProviderService: DataProviderService,
    private publicationService: PublicationDataService,
    private getServerDataService: GetServerDataService
  ) {}
  ngOnInit(): void {
    this.researchList = this.dataProviderService.getItemList();
    this.getAllManagedLists();
  }
  hideManage(event: Event) {
    this.hideManageScreen.emit(true);
  }

  activateCurrentList(id: string) {
    this.showSpinner = true;
    this.getServerDataService.updateActiveList(id, (el: any) => {
      this.showSpinner = false;
      this.updateActiveLisLocally(id);
      this.updateActiveList(id, true);
    });
  }
  updateActiveLisLocally(id: string) {
    let index = this.itemList.findIndex((el) => el.data.list_id == id);
    if (index < 0) return;
    for (let i = 0; i < this.itemList.length; i++) {
      if (i == index) this.itemList[i].isActive = true;
      else this.itemList[i].isActive = false;
    }
    let temp = this.itemList[index];
    this.itemList.splice(index, 1);
    this.itemList.splice(0, 0, temp);
  }

  newButtonClicked() {
    this.isNewList = !this.isNewList;
  }
  getAllManagedLists(callback?) {
    this.showSpinner = true;
    this.publicationService.setSpinnerInCurrentList(true);
    this.getServerDataService.getAllPublicationList((data: Managed_List[]) => {
      this.itemList = [];
      this.showSpinner = false;

      if (data == null) return;
      if (callback != null) callback(true);
      this.publicationService.setTotalManagedLists(data.length);
      this.publicationService.setAllManagedLists(data);
      data.forEach((el) => {
        this.itemList.push({ data: el, isActive: false });
      });
      if (data.length < 1) this.noData = true;
      else this.noData = false;
      this.getActiveList();
    });
  }
  getActiveList() {
    let listId = this.publicationService.getCurrentActiveListId();
    if (listId == null) {
      this.showSpinner = true;
      this.getServerDataService.initActiveList((data) => {
        this.showSpinner = false;
        if (!data) return;
        let listIdTemp = this.publicationService.getCurrentActiveListId();

        this.updateActiveList(listIdTemp, false);
      });
    } else this.updateActiveList(listId, false);
  }

  updateActiveList(id: string, sendUpdated: boolean) {
    this.updateActiveLisLocally(id);
    let index = this.itemList.findIndex((el) => el.data.list_id == id);
    if (index >= 0) this.activeList = this.itemList[index].data.list_name;

    if (sendUpdated) {
      this.publicationService.setCurrentActiveListId(id);
      this.publicationService.setCurrentActiveList(null);
      this.publicationService.setDiscoveryFeedData(null);
      this.publicationService.setCurrentPublications(null);
      this.publicationService.setNewActiveList(id);
    }
  }
  removeClicked(list: Managed_List) {
    this.getServerDataService.deletePublicationList(list.list_id, (data) => {
      if (data != null) this.getAllManagedLists();
    });
  }
  renameClicked(list: Managed_List) {
    this.newListName = list.list_name;
    this.renamingList = true;
    this.renamedListId = list.list_id;
    this.isNewList = true;
  }
  duplicateClicked(list: Managed_List) {
    this.newListName = list.list_name;
    this.getExistingList(list.list_id, (data: PUBLICATION_LIST) => {
      if (data == null) return;
      this.duplicatingList = true;
      this.duplicatePublicationIds = data.publication_ids;
      this.newListName = list.list_name + ' (copy)';
      this.isNewList = true;
    });
  }
  getExistingList(id: string, callback) {
    this.getServerDataService.getPublicationListById(id, (data) => {
      if (data != null) callback(data);
    });
  }

  listDataChanged(event: { name: string; subtitle: string }) {
    if (event == null) {
      this.renamingList = false;
      this.isNewList = false;
      this.duplicatingList = false;
      this.duplicatePublicationIds = [];
      this.newListName = null;
      return;
    }
    this.newListName = event.name;
    this.isNewList = false;
    let ids = [];

    if (this.renamingList) {
      this.updateList();
      this.renamingList = false;
    } else if (this.duplicatingList) {
      this.createNewList(this.newListName, this.duplicatePublicationIds);
      this.duplicatingList = false;
      this.duplicatePublicationIds = [];
      this.newListName = null;
    } else this.createNewList(this.newListName, []);
  }
  updateList() {
    this.showSpinner = true;
    this.getServerDataService.updateExistingList(
      this.renamedListId,
      { name: this.newListName },
      (data) => {
        this.showSpinner = false;
        if (
          this.renamedListId == this.publicationService.getCurrentActiveListId()
        )
          this.getServerDataService.initActiveList((data) => {});
        this.getAllManagedLists();
      }
    );
  }
  createNewList(name: string, publicationIds: string[]) {
    this.showSpinner = true;
    this.getServerDataService.createNewPublicationList(
      {
        name: name,
        publication_ids: publicationIds,
      },
      (publicationId: any) => {
        if (!publicationId) this.showSpinner = false;

        this.showSpinner = false;
        this.getAllManagedLists((updated) => {
          if (!updated) return;
          this.showSpinner = true;
          this.activateCurrentList(publicationId);
        });
      }
    );
  }
}
