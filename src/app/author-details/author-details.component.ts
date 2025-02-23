import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SignalsService } from '../signals.service';

import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-author-details',
  templateUrl: './author-details.component.html',
  standalone: true,
  imports: [],
  providers: [SignalsService, HttpClient],
  encapsulation: ViewEncapsulation.None
})

export class AuthorDetailsComponent implements OnInit {
  key = '';

  constructor(private readonly router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.key = params['authorKey'];
    })

        // how to get author details
    // this.http.get(this.openLibraryApi + 'authors/OL781761A/works.json')
    //   .subscribe(
    //     {
    //       next: (authorData: any) => {

    //     console.log('author works: ');
    //     console.log(authorData);
    //   }
    // });
  }
}
