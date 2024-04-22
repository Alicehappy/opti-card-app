import { Component, OnInit } from '@angular/core';
import { RowComponent } from "./row/row.component";
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-opti-card',
    standalone: true,
    templateUrl: './opti-card.component.html',
    styleUrl: './opti-card.component.scss',
    imports: [RowComponent, CommonModule]
})
export class OptiCardComponent implements OnInit{

  ngOnInit(): void {
    this._categories = [
      'Grocery',
      'Gas',
      'Restaurant',
      'Recreation',
      'Travel',
      'Property Tax',
      'Home and Car Insurance',
      'Gift'
    ]
  }
  private _categories: Array<string> = [];

  public get categories() {
    return this._categories;
  }


}
