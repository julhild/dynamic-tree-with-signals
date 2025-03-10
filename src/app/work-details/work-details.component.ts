import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SignalsService } from '../signals.service';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { WorkDetails } from '../models';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
@Component({
  selector: 'app-work-details',
  templateUrl: './work-details.component.html',
  standalone: true,
  imports: [ButtonModule, InputTextModule, TagModule, FormsModule],
  providers: [HttpClient],
  encapsulation: ViewEncapsulation.None
})

export class WorkDetailsComponent implements OnInit {

  work = new WorkDetails();

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private signalsService: SignalsService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const workKey = params['workKey'];

      if (workKey !== undefined) {
        this.http.get(`https://openlibrary.org${workKey}.json`)
          .subscribe(
            {
              next: (data: unknown) => {
                const workData = data as Record<string, undefined>;

                this.work = {
                  key: workKey,
                  title: workData['title'] ?? '-',
                  cover: workData['covers'] ? (workData['covers'][0] ?? '') : '',
                  subjects: workData['subjects'] ?? []
                }
          }
        });
      }
    });
  }

  onUpdateWork() {
    this.signalsService.updateWorkNode(this.work);
  }

  onDeleteWork() {
    this.signalsService.deleteWorkNode(this.work);
  }
}
