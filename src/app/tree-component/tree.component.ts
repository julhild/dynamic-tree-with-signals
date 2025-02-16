import { Component, inject, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { Author, SignalsService, Work } from '../signals.service';
import { Tree } from 'primeng/tree';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Component({
    selector: 'app-tree',
    templateUrl: './tree.component.html',
    standalone: true,
    imports: [Tree],
    providers: [SignalsService, HttpClient]
})

export class TreeComponent implements OnInit {
  private signalsService = inject(SignalsService);
  nodes = this.signalsService.treeNodes.asReadonly();
  numberOfNodes = 10;

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit() {
    let authors: Author[] = [];
    let workCalls: Promise<any>[] = [];

    this.http.get(`https://openlibrary.org/search/authors.json?q=tolstoy&limit=${this.numberOfNodes}&fields=key,name`).subscribe(
      {
        next: (data: any) => {
          authors = data.docs as Author[];

          authors.forEach((author: Author) => {
            workCalls.push(this.getWorkPromise(author));
          });
        },
        complete: () => this.getAuthorWorks(workCalls, authors)
      });
  }

  getWorkPromise(author: Author): Promise<any> {
    const response = this.http.get(`https://openlibrary.org/authors/${author.key}/works.json`);
    return lastValueFrom(response);
  }

  getAuthorWorks(calls: Promise<any>[], authors: Author[]) {
    Promise.allSettled(calls).then((results) =>
      results.forEach((result: any, index) => {
        authors[index].works = [];
        result.value.entries.forEach((entry: any) => {
          const work: Work = {
            key: entry.key,
            title: entry.title,
            created: entry.created.value,
            lastModified: entry.last_modified.value
          };

          authors[index].works.push(work);
        });
      })
    ).finally(() => this.signalsService.setTreeNodes(authors))
  }
}
