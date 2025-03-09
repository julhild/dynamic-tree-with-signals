import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SignalsService } from '../signals.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { AuthorDetails } from '../models';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-author-details',
  templateUrl: './author-details.component.html',
  standalone: true,
  imports: [FormsModule, ButtonModule, InputTextModule],
  providers: [HttpClient],
  encapsulation: ViewEncapsulation.None
})

export class AuthorDetailsComponent implements OnInit {
  author = new AuthorDetails();

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private signalsService: SignalsService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const authorKey = params['authorKey'];

      if (authorKey !== undefined) {
        this.http.get(`https://openlibrary.org/authors/${authorKey}.json`)
          .subscribe({
            next: (data: unknown) => {
              const authorData = data as Record<string, undefined>;
              this.author = {
                key: authorKey,
                name: authorData['name'] ?? '-',
                birthDate: authorData['birth_date'] ?? '-',
                deathDate: authorData['death_date'] ?? '-',
                bio: authorData['bio']?.['value'] ?? '-'
              };
            }
        });
      }
    });
  }

  onUpdateAuthor() {
    this.signalsService.updateAuthorNode(this.author);
  }

  onDeleteAuthor() {
    this.signalsService.deleteAuthorNode(this.author);
  }

  onAddWork() {
    this.signalsService.addWorkNode(this.author);
  }
}
