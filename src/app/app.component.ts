import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TreeComponent } from "./tree-component/tree.component";
import { SignalsService } from './signals.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TreeComponent],
  providers: [SignalsService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {

}
