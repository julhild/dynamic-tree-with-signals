import { signal, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TreeNode } from 'primeng/api';
import { Author, AuthorDetails, Work } from './models';

@Injectable()

export class SignalsService {
  // a fake back en
  allData: Author[] = [];
  treeNodes = signal<TreeNode[]>([]);
  isTreeLoading = signal<boolean>(true);
  selectedNode = signal<TreeNode | null>(null);
  displayNumberOfNodes = 5;

  constructor(private readonly router: Router, private readonly route: ActivatedRoute) {}

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
    this.route.params.subscribe(params => {
      let foundNode: TreeNode | undefined = undefined;

      if (params['authorKey']) {
        foundNode = this.treeNodes().find(node => node.key === params['authorKey']);
      } else if (params['workKey']) {
        foundNode = this.treeNodes().find(node => node.children?.some(child => child.key === params['workKey']));
      }

      console.log('params: ', params);

      if (foundNode === undefined) {
        // this.setDefaultNode();
      } else {
        this.selectedNode.set(foundNode);
      }
    });

    const routeParts = this.router.url.split('/');
    let foundNode: TreeNode | undefined = undefined;

      if (routeParts[1] === 'author') {
        foundNode = this.treeNodes().find(node => node.key === routeParts[2]);
      } else if (routeParts[1] === 'work') {
        const workKey = routeParts[2].replaceAll('%2F', '/');

        console.log(this.treeNodes(), workKey)

        // TODO user reduce
        foundNode = this.treeNodes().find(node => {
          node.children?.some(child => child.key === workKey)
        });
      }

        console.log(foundNode)

      if (foundNode === undefined) {
        // this.setDefaultNode();
      } else {
        foundNode.expanded = true;
        this.selectedNode.set(foundNode);
      }
  }

  setDefaultNode() {
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

  // TODO: add addWorkNode
  // TODO: add updateWorkNode
  // TODO: add deleteAuthorNode
  // TODO: add deleteWorkNode
}

