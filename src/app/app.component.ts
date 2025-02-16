import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TreeComponent } from "./tree-component/tree.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TreeComponent],
  templateUrl: './app.component.html',
  providers: [HttpClient],
  styleUrl: './app.component.css'
})

export class AppComponent {
  authors: { key: string, name: string }[] = [];
  openLibraryApi = 'https://openlibrary.org/';

  constructor(private http: HttpClient) { }

  ngOnInit() {

    // this.http.get(this.openLibraryApi + 'search/authors.json?q=tolstoy&limit=10&fields=key,name')
    //   .subscribe(
    //     {
    //       next: (authors: any) => {

    //     this.authors = [];

    //     authors.docs.forEach((element: { key: any; name: any; }) => {
    //       const loadedAutor = { key: element.key, name: element.name };
    //       this.authors.push(loadedAutor);
    //     });
    //     console.log(authors);
    //   }
    // });

    // how to get author details
    // this.http.get(this.openLibraryApi + 'authors/OL781761A/works.json')
    //   .subscribe(
    //     {
    //       next: (authorData: any) => {

    //     console.log('author works: ');
    //     console.log(authorData);
    //   }
    // });

        // how to get work details
    // this.http.get(this.openLibraryApi + 'works/OL12744320W.json')
    //   .subscribe(
    //     {
    //       next: (workData: any) => {

    //     console.log('work details: ');
    //     console.log(workData);
    //   }
    // });

  }

}
