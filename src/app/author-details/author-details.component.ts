import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SignalsService } from '../signals.service';

import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthorDetails } from '../models';

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
  author = new AuthorDetails();

  constructor(
    private readonly router: Router,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.key = params['authorKey'];

      if (this.key !== undefined) {
        this.http.get(`https://openlibrary.org/authors/${this.key}.json`)
          .subscribe({
            next: (data: unknown) => {
            const authorData = data as Record<string, undefined>;
            this.author = {
              key: this.key,
              name: authorData['name'] ?? '-',
              birthDate: authorData['birth_date'] ?? '-',
              deathDate: authorData['death_date'] ?? '-',
              bio: authorData['bio']?.['value'] ?? '-'
            };
            console.log('author works: ');
              console.log(authorData);

            }
        });
      }
    });
  }
}
