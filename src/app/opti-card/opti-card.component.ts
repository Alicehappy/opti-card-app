import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder,
  FormArray,
  Validators,
  ReactiveFormsModule,
  FormGroup,
  FormControl
} from '@angular/forms';
import { Category } from './category.interface';


@Component({
    selector: 'app-opti-card',
    standalone: true,
    templateUrl: './opti-card.component.html',
    styleUrl: './opti-card.component.scss',
    imports: [ReactiveFormsModule, CommonModule]
})


export class OptiCardComponent implements OnInit{

  public categorySpendForm: FormGroup = this.formBuilder.group({});

  private _categories: Array<string> = [];

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
    ];

    this.categorySpendForm = this.formBuilder.group(this.formGroupConfig);

  }
  

  onSubmit() {
    console.warn(this.categorySpendForm.value)
  }


  public get categories() {

    let categoriesData: Array<Category> = [];
    
    for(let i = 0; i < this._categories.length; i++) {
      let allCapWord = this._categories[i].replace(/[\/ ]/g, '-');
      let capFirstLetter = allCapWord[0].toLowerCase();
      let restOfWord = allCapWord.slice(1);

      categoriesData.push({
        label: this._categories[i].replace(/[\/ ]/g, '-').toLowerCase(),
        id: this._categories[i].replace(/[\/ ]/g, '-').toLowerCase(),
        description: this._categories[i] + ': ',
        controlName: capFirstLetter + restOfWord,
      })
    }

    return categoriesData;
  }

  private get formGroupConfig() {
    const _formGroupConfig: {[key: string]: any} = {};

    this.categories.forEach(category => {
      let fieldName = category.controlName;
      _formGroupConfig[fieldName] = [];
    });

    return _formGroupConfig;

  }


  constructor(private formBuilder: FormBuilder) {}


}
