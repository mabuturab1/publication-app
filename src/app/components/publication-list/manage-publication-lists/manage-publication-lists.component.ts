import {
  GetServerDataService,
  PUBLICATION_LIST,
  Managed_List,
} from './../../../services/getServerData.service';
import { DataProviderService } from '../../../services/dataProvider.service';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { faLongArrowAltLeft } from '@fortawesome/free-solid-svg-icons';
import { ResearchData } from 'src/app/services/dataProvider.service';
import { PublicationDataService } from 'src/app/services/publication-data.service';
@Component({
  selector: 'app-manage-publication',
  templateUrl: './manage-publication-lists.component.html',
  styleUrls: ['./manage-publication-lists.component.scss'],
})
export class ManagePublicationListsComponent implements OnInit {
  faLongArrowAltLeft = faLongArrowAltLeft;
  researchList: ResearchData[] = [];
  newListName = '';
  renamingList = false;
  renamedListId = '';
  activeList = '';
  isNewList = false;
  fetchingData = false;
  itemList: { data: Managed_List; isActive: boolean }[] = [
    // { data: 'List 1', isActive: false },
    // { data: 'List 2', isActive: false },
    // { data: 'List 3', isActive: true },
    // { data: 'List 4', isActive: false },
    // { data: 'List 5', isActive: false },
    // { data: 'List 6', isActive: false },
    // { data: 'List 7', isActive: false },
    // { data: 'List 8', isActive: false },
    // { data: 'List 9', isActive: false },
  ];
  @Output() hideManageScreen = new EventEmitter<boolean>();
  hideManage(event: Event) {
    this.hideManageScreen.emit(true);
  }
  constructor(
    private dataProviderService: DataProviderService,
    private publicationService: PublicationDataService,
    private getServerData: GetServerDataService
  ) {}
  activateCurrentList(id: string) {
    // this.activeList = this.itemList[index].data;
    this.publicationService.setSpinnerInCurrentList(true);
    this.getServerData.updateActiveList(id, (el: any) => {
      let index = this.itemList.findIndex((el) => el.data.list_id == id);
      if (index < 0) return;
      for (let i = 0; i < this.itemList.length; i++) {
        if (i == index) this.itemList[i].isActive = true;
        else this.itemList[i].isActive = false;
      }
      this.updateActiveList(id, true);
    });
  }
  ngOnInit(): void {
    this.researchList = this.dataProviderService.getItemList();
    this.getAllManagedLists();
    // if (this.itemList.length < 1) return;
    // let index = this.itemList.findIndex((el) => el.isActive == true);
    // if (index < 0) index = 0;
    // this.activeList = this.itemList[index].data;
  }
  newButtonClicked() {
    this.isNewList = !this.isNewList;
  }
  getAllManagedLists() {
    this.fetchingData = true;
    this.publicationService.setSpinnerInCurrentList(true);
    this.getServerData.getAllPublicationList((data: Managed_List[]) => {
      this.itemList = [];
      this.publicationService.setTotalManagedLists(data.length);
      data.forEach((el) => {
        this.itemList.push({ data: el, isActive: false });
      });
      this.getActiveList();
    });
  }
  getActiveList() {
    this.getServerData.getActiveList((response) => {
      this.fetchingData = false;
      console.log('in update active list in managed lists');
      if (response != null) this.updateActiveList(response, false);
    });
  }

  updateActiveList(id: string, sendUpdated: boolean) {
    let index = this.itemList.findIndex((el) => el.data.list_id == id);
    if (index < 0) return;
    if (index >= 0) this.itemList[index].isActive = true;
    this.activeList = this.itemList[index].data.list_name;
    console.log('callong fetch records for current list');
    if (sendUpdated) {
      this.publicationService.fetchRecordsForCurrentlyActive(id);
      this.publicationService.setDiscoveryFeedData(null);
    }
  }
  removeClicked(list: Managed_List) {
    this.getServerData.deletePublicationList(list.list_id, (data) => {
      console.log(data);
      if (data != null) this.getAllManagedLists();
    });
  }
  renameClicked(list: Managed_List) {
    this.newListName = list.list_name;
    this.renamingList = true;
    this.renamedListId = list.list_id;
    this.isNewList = true;
    console.log('rename clicked', this.newListName, list);
  }
  duplicateClicked(list: Managed_List) {
    this.newListName = list.list_name;
    this.getExistingList(list.list_id, (data: PUBLICATION_LIST) => {
      this.createNewList(
        '--origin  ' + list.list_name + '   -- (copy)',
        data.publication_ids
      );
    });
  }
  getExistingList(id: string, callback) {
    this.getServerData.getPublicationListById(id, (data) => {
      callback(data);
    });
  }
  updateList() {
    this.getServerData.updateExistingList(
      this.renamedListId,
      { name: this.newListName },
      (data) => {
        this.fetchingData = false;
        this.getAllManagedLists();
      }
    );
  }
  listDataChanged(event: { name: string; subtitle: string }) {
    this.newListName = event.name;
    this.isNewList = false;
    let ids = [];
    this.fetchingData = true;
    if (this.renamingList) {
      this.updateList();
      this.renamingList = false;
    } else this.createNewList(this.newListName, []);
  }
  createNewList(name: string, publicationIds: string[]) {
    this.getServerData.createNewPublicationList(
      {
        name: name,
        publication_ids: publicationIds,
      },
      (data: any) => {
        this.fetchingData = false;
        this.getAllManagedLists();
      }
    );
  }
}
