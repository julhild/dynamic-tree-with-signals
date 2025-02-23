import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TreeComponent } from "./tree-component/tree.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TreeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {

}
