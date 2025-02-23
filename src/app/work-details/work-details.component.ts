import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SignalsService } from '../signals.service';

import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-work-details',
  templateUrl: './work-details.component.html',
  standalone: true,
  imports: [],
  providers: [SignalsService, HttpClient],
  encapsulation: ViewEncapsulation.None
})

export class WorkDetailsComponent implements OnInit {

  key = '';

  constructor(private readonly router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => this.key = params['workKey'])

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
