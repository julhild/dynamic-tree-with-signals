import { signal, resource, Injectable } from '@angular/core';
import { TreeNode } from 'primeng/api';

export interface Work {
  key: string,
  title: string,
  created: Date,
  lastModified: Date
}

export interface Author {
  key: string, name: string, works: Work[]
}

@Injectable({
  providedIn: 'root',
})

export class SignalsService {
  treeNodes = signal<TreeNode[]>([]);

  setTreeNodes(authors: Author[]): void {
    const nodes: TreeNode[] = [];
    authors.forEach((author: Author) => {
      const authorNode: TreeNode = {
        label: author.name,
        icon: 'fa-regular fa-user',
        data: author,
        key: author.key,
        children: this.getWorkNodes(author.works)
      }

      nodes.push(authorNode);
    });

    this.treeNodes.set(nodes);
  }

  getWorkNodes(works: Work[]): TreeNode[] {
    const nodes: TreeNode[] = [];

    works.forEach((work: Work) => {
      const node: TreeNode = {
        label: work.title,
        icon: 'fa-solid fa-book',
        data: work,
        key: work.key
      };

      nodes.push(node);
    });

    return nodes;
  }

}

