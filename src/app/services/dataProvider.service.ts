import { PUBLICATION_LIST } from './getServerData.service';
import { PublicationDetails } from './publication-data.service';
import { Injectable } from '@angular/core';
export interface ResearchData {
  title: string;
}

@Injectable({
  providedIn: 'root',
})
export class DataProviderService {
  indexToRemove = [];
  itemList: PublicationDetails[] = [
    {
      id: 1,
      title:
        'Biochemistry and molecular cell biology of diabetic complications',
      journalName: '2018 Molecular Bilogy',
      journalRank: '13.7',
      authors: [
        { name: 'John', affiliations: ['1', '2'] },
        { name: 'Marry', affiliations: ['2', '3'] },
        { name: 'William', affiliations: ['3', '1'] },
        { name: 'Winston X', affiliations: ['1', '4'] },
        { name: 'Huabin Zhang', affiliations: ['2', '1'] },
      ],
      affiliations: [
        'University of Warsaw',
        'Rotgers University',
        'Jimjimban University',
        'Shaba University',
      ],
      abstract: `Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illum, quaerat ducimus repellendus fugiat voluptatibus vitae! Iste quasi nihil atque,
       nostrum tempore consequatur natus iusto tenetur sequi voluptate quae corrupti officiis?`,
      content: `Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illum, quaerat ducimus repellendus fugiat voluptatibus vitae! Iste quasi nihil atque,
       nostrum tempore consequatur natus iusto tenetur sequi voluptate quae corrupti officiis?`,
    },

    {
      id: 2,
      title:
        'RnaPredict—An Evolutionary Algorithm for RNA Secondary Structure Prediction',
      journalName: '2018 Molecular Bilogy',
      journalRank: '13.7',
      authors: [
        { name: 'John', affiliations: ['1', '2'] },
        { name: 'Marry', affiliations: ['2', '3'] },
        { name: 'William', affiliations: ['3', '1'] },
        { name: 'Winston X', affiliations: ['1', '4'] },
        { name: 'Huabin Zhang', affiliations: ['2', '1'] },
      ],
      affiliations: [
        'University of Warsaw',
        'Rotgers University',
        'Jimjimban University',
        'Shaba University',
      ],
      abstract: `Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illum, quaerat ducimus repellendus fugiat voluptatibus vitae! Iste quasi nihil atque,
         nostrum tempore consequatur natus iusto tenetur sequi voluptate quae corrupti officiis?`,
      content: `Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illum, quaerat ducimus repellendus fugiat voluptatibus vitae! Iste quasi nihil atque,
         nostrum tempore consequatur natus iusto tenetur sequi voluptate quae corrupti officiis?`,
    },
    {
      id: 3,
      title:
        'Pure multiple RNA secondary structure alignments: a progressive profile approach',
      journalName: '2018 Molecular Bilogy',
      journalRank: '13.7',
      authors: [
        { name: 'John', affiliations: ['1', '2'] },
        { name: 'Marry', affiliations: ['2', '3'] },
        { name: 'William', affiliations: ['3', '1'] },
        { name: 'Winston X', affiliations: ['1', '4'] },
        { name: 'Huabin Zhang', affiliations: ['2', '1'] },
      ],
      affiliations: [
        'University of Warsaw',
        'Rotgers University',
        'Jimjimban University',
        'Shaba University',
      ],
      abstract: `Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illum, quaerat ducimus repellendus fugiat voluptatibus vitae! Iste quasi nihil atque,
         nostrum tempore consequatur natus iusto tenetur sequi voluptate quae corrupti officiis?`,
      content: `Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illum, quaerat ducimus repellendus fugiat voluptatibus vitae! Iste quasi nihil atque,
         nostrum tempore consequatur natus iusto tenetur sequi voluptate quae corrupti officiis?`,
    },
    {
      id: 4,
      title:
        'P-RnaPredict-a parallel evolutionary algorithm for RNA folding: effects of pseudorandom number quality',
      journalName: '2018 Molecular Bilogy',
      journalRank: '13.7',
      authors: [
        { name: 'John', affiliations: ['1', '2'] },
        { name: 'Marry', affiliations: ['2', '3'] },
        { name: 'William', affiliations: ['3', '1'] },
        { name: 'Winston X', affiliations: ['1', '4'] },
        { name: 'Huabin Zhang', affiliations: ['2', '1'] },
      ],
      affiliations: [
        'University of Warsaw',
        'Rotgers University',
        'Jimjimban University',
        'Shaba University',
      ],
      abstract: `Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illum, quaerat ducimus repellendus fugiat voluptatibus vitae! Iste quasi nihil atque,
         nostrum tempore consequatur natus iusto tenetur sequi voluptate quae corrupti officiis?`,
      content: `Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illum, quaerat ducimus repellendus fugiat voluptatibus vitae! Iste quasi nihil atque,
         nostrum tempore consequatur natus iusto tenetur sequi voluptate quae corrupti officiis?`,
    },
    {
      id: 5,
      title:
        'RADAR: An InteractiveWeb-Based Toolkit for RNA Data Analysis and Research',
      journalName: '2018 Molecular Bilogy',
      journalRank: '13.7',
      authors: [
        { name: 'John', affiliations: ['1', '2'] },
        { name: 'Marry', affiliations: ['2', '3'] },
        { name: 'William', affiliations: ['3', '1'] },
        { name: 'Winston X', affiliations: ['1', '4'] },
        { name: 'Huabin Zhang', affiliations: ['2', '1'] },
      ],
      affiliations: [
        'University of Warsaw',
        'Rotgers University',
        'Jimjimban University',
        'Shaba University',
      ],
      abstract: `Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illum, quaerat ducimus repellendus fugiat voluptatibus vitae! Iste quasi nihil atque,
         nostrum tempore consequatur natus iusto tenetur sequi voluptate quae corrupti officiis?`,
      content: `Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illum, quaerat ducimus repellendus fugiat voluptatibus vitae! Iste quasi nihil atque,
         nostrum tempore consequatur natus iusto tenetur sequi voluptate quae corrupti officiis?`,
    },
    {
      id: 6,
      title:
        'Structural Alignment of RNAs Using Profile-csHMMs and Its Application to RNA Homology Search: Overview and New Results',
      journalName: '2018 Molecular Bilogy',
      journalRank: '13.7',
      authors: [
        { name: 'John', affiliations: ['1', '2'] },
        { name: 'Marry', affiliations: ['2', '3'] },
        { name: 'William', affiliations: ['3', '1'] },
        { name: 'Winston X', affiliations: ['1', '4'] },
        { name: 'Huabin Zhang', affiliations: ['2', '1'] },
      ],
      affiliations: [
        'University of Warsaw',
        'Rotgers University',
        'Jimjimban University',
        'Shaba University',
      ],
      abstract: `Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illum, quaerat ducimus repellendus fugiat voluptatibus vitae! Iste quasi nihil atque,
         nostrum tempore consequatur natus iusto tenetur sequi voluptate quae corrupti officiis?`,
      content: `Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illum, quaerat ducimus repellendus fugiat voluptatibus vitae! Iste quasi nihil atque,
         nostrum tempore consequatur natus iusto tenetur sequi voluptate quae corrupti officiis?`,
    },
    {
      id: 7,
      title:
        'Heterogeneous Network Model to Infer Human Disease-Long Intergenic Non-Coding RNA Associations',
      journalName: '2018 Molecular Bilogy',
      journalRank: '13.7',
      authors: [
        { name: 'John', affiliations: ['1', '2'] },
        { name: 'Marry', affiliations: ['2', '3'] },
        { name: 'William', affiliations: ['3', '1'] },
        { name: 'Winston X', affiliations: ['1', '4'] },
        { name: 'Huabin Zhang', affiliations: ['2', '1'] },
      ],
      affiliations: [
        'University of Warsaw',
        'Rotgers University',
        'Jimjimban University',
        'Shaba University',
      ],
      abstract: `Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illum, quaerat ducimus repellendus fugiat voluptatibus vitae! Iste quasi nihil atque,
         nostrum tempore consequatur natus iusto tenetur sequi voluptate quae corrupti officiis?`,
      content: `Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illum, quaerat ducimus repellendus fugiat voluptatibus vitae! Iste quasi nihil atque,
         nostrum tempore consequatur natus iusto tenetur sequi voluptate quae corrupti officiis?`,
    },
    {
      id: 8,
      title:
        'The SILVA ribosomal RNA gene database project: improved data processing and web-based tools',
      journalName: '2018 Molecular Bilogy',
      journalRank: '13.7',
      authors: [
        { name: 'John', affiliations: ['1', '2'] },
        { name: 'Marry', affiliations: ['2', '3'] },
        { name: 'William', affiliations: ['3', '1'] },
        { name: 'Winston X', affiliations: ['1', '4'] },
        { name: 'Huabin Zhang', affiliations: ['2', '1'] },
      ],
      affiliations: [
        'University of Warsaw',
        'Rotgers University',
        'Jimjimban University',
        'Shaba University',
      ],
      abstract: `Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illum, quaerat ducimus repellendus fugiat voluptatibus vitae! Iste quasi nihil atque,
         nostrum tempore consequatur natus iusto tenetur sequi voluptate quae corrupti officiis?`,
      content: `Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illum, quaerat ducimus repellendus fugiat voluptatibus vitae! Iste quasi nihil atque,
         nostrum tempore consequatur natus iusto tenetur sequi voluptate quae corrupti officiis?`,
    },
    {
      id: 9,
      title:
        'Definition, diagnosis and classification of diabetes mellitus and its complications',
      journalName: '2018 Molecular Bilogy',
      journalRank: '13.7',
      authors: [
        { name: 'John', affiliations: ['1', '2'] },
        { name: 'Marry', affiliations: ['2', '3'] },
        { name: 'William', affiliations: ['3', '1'] },
        { name: 'Winston X', affiliations: ['1', '4'] },
        { name: 'Huabin Zhang', affiliations: ['2', '1'] },
      ],
      affiliations: [
        'University of Warsaw',
        'Rotgers University',
        'Jimjimban University',
        'Shaba University',
      ],
      abstract: `Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illum, quaerat ducimus repellendus fugiat voluptatibus vitae! Iste quasi nihil atque,
         nostrum tempore consequatur natus iusto tenetur sequi voluptate quae corrupti officiis?`,
      content: `Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illum, quaerat ducimus repellendus fugiat voluptatibus vitae! Iste quasi nihil atque,
         nostrum tempore consequatur natus iusto tenetur sequi voluptate quae corrupti officiis?`,
    },
    {
      id: 10,
      title:
        'Diabetes Mellitus and Risk of Alzheimer Disease and Decline in Cognitive Function',
      journalName: '2018 Molecular Bilogy',
      journalRank: '13.7',
      authors: [
        { name: 'John', affiliations: ['1', '2'] },
        { name: 'Marry', affiliations: ['2', '3'] },
        { name: 'William', affiliations: ['3', '1'] },
        { name: 'Winston X', affiliations: ['1', '4'] },
        { name: 'Huabin Zhang', affiliations: ['2', '1'] },
      ],
      affiliations: [
        'University of Warsaw',
        'Rotgers University',
        'Jimjimban University',
        'Shaba University',
      ],
      abstract: `Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illum, quaerat ducimus repellendus fugiat voluptatibus vitae! Iste quasi nihil atque,
         nostrum tempore consequatur natus iusto tenetur sequi voluptate quae corrupti officiis?`,
      content: `Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illum, quaerat ducimus repellendus fugiat voluptatibus vitae! Iste quasi nihil atque,
         nostrum tempore consequatur natus iusto tenetur sequi voluptate quae corrupti officiis?`,
    },
    {
      id: 11,
      title:
        'Biochemistry and molecular cell biology of diabetic complications',
      journalName: '2018 Molecular Bilogy',
      journalRank: '13.7',
      authors: [
        { name: 'John', affiliations: ['1', '2'] },
        { name: 'Marry', affiliations: ['2', '3'] },
        { name: 'William', affiliations: ['3', '1'] },
        { name: 'Winston X', affiliations: ['1', '4'] },
        { name: 'Huabin Zhang', affiliations: ['2', '1'] },
      ],
      affiliations: [
        'University of Warsaw',
        'Rotgers University',
        'Jimjimban University',
        'Shaba University',
      ],
      abstract: `Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illum, quaerat ducimus repellendus fugiat voluptatibus vitae! Iste quasi nihil atque,
         nostrum tempore consequatur natus iusto tenetur sequi voluptate quae corrupti officiis?`,
      content: `Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illum, quaerat ducimus repellendus fugiat voluptatibus vitae! Iste quasi nihil atque,
         nostrum tempore consequatur natus iusto tenetur sequi voluptate quae corrupti officiis?`,
    },
  ];
  initIndexToRemove() {
    this.indexToRemove = [];
  }
  removeItems() {
    let itemsList = [];
    this.indexToRemove.forEach((el) => {
      let item = this.itemList.findIndex((ele) => ele.id == el);
      if (item >= 0) this.itemList.splice(item, 1);
    });
  }
  setIndexToRemove(index: number, val: boolean) {
    if (val) this.indexToRemove.push(index);
    else {
      let item = this.indexToRemove.findIndex((el) => el == index);
      if (item >= 0) this.indexToRemove.splice(item, 1);
    }
  }
  getItemList() {
    return this.itemList;
  }
}
