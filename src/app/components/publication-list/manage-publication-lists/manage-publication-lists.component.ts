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
    this.publicationService.setSpinnerInCurrentList(true);
    this.getServerDataService.updateActiveList(id, (el: any) => {
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
  }

  newButtonClicked() {
    this.isNewList = !this.isNewList;
  }
  getAllManagedLists() {
    this.showSpinner = true;
    this.publicationService.setSpinnerInCurrentList(true);
    this.getServerDataService.getAllPublicationList((data: Managed_List[]) => {
      this.itemList = [];
      this.showSpinner = false;
      if (data == null) return;
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
      this.publicationService.setNewActiveList(id);
      this.getServerDataService.initActiveList((data) => {
        if (data) this.publicationService.setDiscoveryFeedData(null);
      });
    }
  }
  removeClicked(list: Managed_List) {
    this.getServerDataService.deletePublicationList(list.list_id, (data) => {
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
    this.getServerDataService.getPublicationListById(id, (data) => {
      if (data != null) callback(data);
    });
  }

  listDataChanged(event: { name: string; subtitle: string }) {
    this.newListName = event.name;
    this.isNewList = false;
    let ids = [];

    if (this.renamingList) {
      this.updateList();
      this.renamingList = false;
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
      (data: any) => {
        this.showSpinner = false;
        this.getAllManagedLists();
      }
    );
  }
}
