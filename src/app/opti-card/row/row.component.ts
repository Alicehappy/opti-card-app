import { Component, Input } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-row',
  standalone: true,
  imports: [MatCardModule, FormsModule, MatInputModule],
  templateUrl: './row.component.html',
  styleUrl: './row.component.scss'
})
export class RowComponent {
  @Input() category: string = '';

}
