import { signal, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TreeNode } from 'primeng/api';
import { Author, AuthorDetails, Work, WorkDetails } from './models';

@Injectable()

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
    const routeParts = this.router.url.split('/');
    let foundNode: TreeNode | undefined = undefined;

    if (routeParts[1] === 'author') {
      foundNode = this.treeNodes().find(node => node.key === routeParts[2]);
    } else if (routeParts[1] === 'work') {
      const workKey = routeParts[2].replaceAll('%2F', '/');
      const nodes = this.treeNodes().slice(0);

      foundNode = nodes.reduce<TreeNode | undefined>((prevValue, authorNode, index, arr)  => {
        const value = prevValue || authorNode.children?.find(workNode => workNode.key === workKey);

        if (value !== undefined) {
          authorNode.expanded = true;
          arr.splice(index);
        }

        return value;
      }, undefined);
    }

    if (foundNode === undefined) {
      this.setDefaultNode();
    } else {
      foundNode.expanded = true;
      this.selectedNode.set(foundNode);
    }
  }

  setDefaultNode() {
    const defaultNode = this.treeNodes()[0];
    defaultNode.expanded = true;

    this.router.navigate(['/author', defaultNode.key]);
    this.selectedNode.set(defaultNode);
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
    console.log('newNode: ', this.treeNodes());

    this.treeNodes.update(nodes => nodes.concat(newNode))
  }

  updateAuthorNode(author: AuthorDetails) {
    this.treeNodes.update(nodes => nodes.map(node => {
      if (node.key === author.key) {
        node.label = author.name;
        node.data = author;

      }

      return node;
    }));
  }

  deleteAuthorNode(author: AuthorDetails) {
    const nodes = this.treeNodes().filter(node => node.key !== author.key);
    this.treeNodes.set(nodes);
    this.setDefaultNode();
  }

  addWorkNode(author: AuthorDetails) {
    const authorNode = this.treeNodes().find(node => node.key === author.key);
    const allWords = this.allData.find(n => n.key === author.key)?.works ?? [];

    const notShownWorks = allWords.filter(work => !authorNode?.children?.find(node => node.key === work.key));

    if (notShownWorks.length > 0) {
      const newWorkNode = this.getWorkNodes(notShownWorks)[0];
      authorNode?.children?.push(newWorkNode);
      this.treeNodes.update(nodes => nodes);
    }
  }

  updateWorkNode(work: WorkDetails) {
    const treeNodes = this.treeNodes().map(node => {
      if (node.children?.find(child => child.key === work.key)) {
        node.children = node.children.map(child => {
          if (child.key === work.key) {
            child.label = work.title;
            child.data = work;
          }

          return child;
        });
      }

      return node;
    });

    this.treeNodes.set(treeNodes);
  }

  deleteWorkNode(work: WorkDetails) {
    const authorNode = this.treeNodes().find(node => node.children?.find(child => child.key === work.key));

    if (authorNode !== undefined) {
      authorNode.children = authorNode.children?.filter(node => node.key !== work.key);
      this.treeNodes.update(nodes => nodes);

      this.router.navigate(['/author', authorNode.key]);
      this.selectedNode.set(authorNode);
    }
  }
}

