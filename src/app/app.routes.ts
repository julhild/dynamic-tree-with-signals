import { Routes } from '@angular/router';
import { AuthorDetailsComponent } from './author-details/author-details.component';
import { WorkDetailsComponent } from './work-details/work-details.component';

export const routes: Routes = [
  { path: 'author/:authorKey', component: AuthorDetailsComponent},
  { path: 'work/:workKey', component: WorkDetailsComponent },
  { path: '*', redirectTo: '/'}
];
