import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder,
  FormArray,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
@Component({
    selector: 'app-opti-card',
    standalone: true,
    templateUrl: './opti-card.component.html',
    styleUrl: './opti-card.component.scss',
    imports: [ReactiveFormsModule, CommonModule]
})


export class OptiCardComponent implements OnInit{

  categorySpendForm = this.formBuilder.group({
    drugStore: [],
    entertainment: [],
    furniture: [],
    gas: [],
    groceries: [],
    homeImprovement: [],
    hotelMotel: [],
    parkingPublicTransitRides: [],
    recurringBills: [],
    restaurantsDining: [],
    streamingDigitalSubscriptions: [],
    travel: [],
    other: [],
    moreCategories:
    this.formBuilder.array([this.formBuilder.control('')]),
  });

  get moreCategories() {
    return this.categorySpendForm.get('moreCategories') as FormArray;
  }

  addCategory() {
    this.moreCategories.push(this.formBuilder.control(''));
  }

  onSubmit() {
    console.warn(this.categorySpendForm.value)
  }

  ngOnInit(): void {
    this._categories = [     
      'Drug Store',     
      'Entertainment',
      'Furniture',
      'Gas',
      'Groceries',
      'Home Improvement',
      'Hotel/Motel',
      'Parking/Public Transit/Rides',  
      'Recurring Bills',
      'Restaurants/Dining',
      'Streaming/Digital Subscriptions',
      'Travel',
      'Other',
    ]
  }
  private _categories: Array<string> = [];

  public get categories() {
    return this._categories;
  }

  constructor(private formBuilder: FormBuilder) {}


}
