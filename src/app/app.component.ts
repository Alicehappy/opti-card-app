import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Welcome to Optim Card Choice App 🎉';

  onClick() {
    this.router.navigate(['/opti-card']);
  }

  constructor (private readonly router: Router) {}
}
