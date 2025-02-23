import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { Author, SignalsService, Work } from '../signals.service';
import { Tree } from 'primeng/tree';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Component({
    selector: 'app-tree',
    templateUrl: './tree.component.html',
    standalone: true,
    imports: [Tree, ButtonModule, TooltipModule],
  providers: [SignalsService, HttpClient],
    encapsulation: ViewEncapsulation.None
})

export class TreeComponent implements OnInit {
  private signalsService = inject(SignalsService);
  nodes = this.signalsService.treeNodes.asReadonly();
  isLoading = this.signalsService.isTreeLoading.asReadonly();
  selectedNode = this.signalsService.selectedNode.asReadonly();

  numberOfLoadedNodes = 10;

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit() {
    let authors: Author[] = [];
    let workCalls: Promise<any>[] = [];

    this.http.get(`https://openlibrary.org/search/authors.json?q=christie&limit=${this.numberOfLoadedNodes}&fields=key,name`)
    .subscribe(
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

        authors[index].works = authors[index].works.sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));
      })
    ).finally(() => this.signalsService.setTreeNodes(authors))
  }

  onAddAuthor() {
    this.signalsService.addAuthorNode();
  }
}
