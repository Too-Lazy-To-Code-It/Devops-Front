import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SkierComponent } from "./skier/skier.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SkierComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Devops-front';
}
