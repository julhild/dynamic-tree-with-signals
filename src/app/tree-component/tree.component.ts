import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { Author, SignalsService, Work } from '../signals.service';
import { Tree, TreeNodeSelectEvent } from 'primeng/tree';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';

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
  selectedNode = this.signalsService.selectedNode;

  numberOfLoadedNodes = 10;

  constructor(
    private http: HttpClient,
    private readonly router: Router
  ) { }

  ngOnInit() {
    let authors: Author[] = [];
    const workCalls: Promise<Work[]>[] = [];

    this.http.get(`https://openlibrary.org/search/authors.json?q=christie&limit=${this.numberOfLoadedNodes}&fields=key,name`)
    .subscribe(
      {
        next: (data: unknown) => {
          authors = (data as Record<string, undefined>)['docs'] as unknown as Author[];

          authors.forEach((author: Author) => {
            workCalls.push(this.getWorkPromise(author));
          });
        },
        complete: () => this.getAuthorWorks(workCalls, authors)
      });
  }

  getWorkPromise(author: Author): Promise<Work[]> {
    const response = this.http.get<Work[]>(`https://openlibrary.org/authors/${author.key}/works.json`);
    return lastValueFrom(response);
  }

  getAuthorWorks(calls: Promise<Work[]>[], authors: Author[]) {
    Promise.allSettled(calls).then((results) =>
      results.forEach((result: unknown, index) => {
        authors[index].works = [];

        const entries: Record<string, undefined>[] = (result as Record<string, undefined>)?.['value']?.['entries'] ?? [];

        entries.forEach((entry: Record<string, undefined>) => {
          const work: Work = {
            key: entry['key'] ?? '',
            title: entry['title'] ?? '',
            created: entry['created']?.['value'] ?? new Date(),
            lastModified: entry['last_modified']?.['value'] ?? new Date()
          };

          authors[index].works.push(work);
        });

        authors[index].works = authors[index].works.sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));
      })
    ).finally(() => this.signalsService.setTreeNodes(authors))
  }

  onSelect(event: TreeNodeSelectEvent) {
    if (event.node.type === 'work') {
      this.router.navigate(['/work', event.node.key]);
    } else {
      this.router.navigate(['/author', event.node.key]);
    }
  }

  onAddAuthor() {
    this.signalsService.addAuthorNode();
  }
}
