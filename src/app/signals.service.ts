import { signal, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TreeNode } from 'primeng/api';
import { Author, Work } from './models';

@Injectable({
  providedIn: 'root',
})

export class SignalsService {
  // a fake back end
  allData: Author[] = [];
  treeNodes = signal<TreeNode[]>([]);
  isTreeLoading = signal<boolean>(true);
  selectedNode = signal<TreeNode | null>(null);
  displayNumberOfNodes = 5;

  constructor(private readonly router: Router) {}

  setTreeNodes(authors: Author[]): void {
    const nodes: TreeNode[] = [];
    this.allData = authors.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

    this.allData.forEach((author: Author, index: number) => {
      if (index < this.displayNumberOfNodes) {
        nodes.push(this.setAuthorNode(author));
      }
    });

    this.treeNodes.set(nodes);
    this.setSelectedNode();
    this.isTreeLoading.set(false);
  }

  setSelectedNode() {
    const defaultNode = this.treeNodes()[0];
    defaultNode.expanded = true;

    this.selectedNode.set(defaultNode);
    this.router.navigate(['/author', defaultNode.key]);
  }

  setAuthorNode(author: Author) {
    const newAuthorNode: TreeNode = {
      label: author.name,
      icon: 'fa-regular fa-user',
      data: author,
      key: author.key,
      type: 'author',
      children: this.getWorkNodes(author.works)
    };

    return newAuthorNode;
  }

  getWorkNodes(works: Work[]): TreeNode[] {
    const nodes: TreeNode[] = [];

    works.forEach((work: Work, index: number) => {
      if (index < this.displayNumberOfNodes) {
        const node: TreeNode = {
          label: work.title,
          icon: 'fa-solid fa-book',
          data: work,
          key: work.key,
          type: 'work'
        };

        nodes.push(node);
      }
    });

    return nodes;
  }

  addAuthorNode() {
    const authorIndex = this.treeNodes().length;
    const newNode = this.setAuthorNode(this.allData[authorIndex]);

    this.treeNodes.update(nodes => nodes.concat(newNode))
  }

}

