import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';
import { Category } from './category.interface';
import {HttpClient} from '@angular/common/http';



export interface RewardObj {
  cardName: string,
  rewardValue: number
}


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
  
  public rewards: Array<RewardObj> = [];
  public bestCard: RewardObj = {cardName: '', rewardValue: 0};

  private http = inject(HttpClient);
  post: any;
  
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
    this.http.get('http://poto-tomato:3000/api/data')
                .subscribe(data => {
                  this.post = data;
                  console.log("opti card component data");
                  console.log(this.post);
                  this.calculateRewards();
                })
  }
  

  onSubmit() {
    console.warn(this.categorySpendForm.value)
    this.calculateRewards();
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
      _formGroupConfig[fieldName] = 3000; // Spending cost can manual change the number
    });

    return _formGroupConfig;

  }


  constructor(
    private formBuilder: FormBuilder,
    ) {
      
    }

  public calculateRewards() {
    console.log(this.post.cards.length);
 
    for(let i = 0; i < this.post.cards.length; i++) {
      let rewardValue = this.post.cards[i]['Drug Store']*0.01*this.categorySpendForm.controls['drug-Store'].value
      +this.post.cards[i]['Entertainment']*0.01*this.categorySpendForm.controls['entertainment'].value
      +this.post.cards[i]['Furniture']*0.01*this.categorySpendForm.controls['furniture'].value
      +this.post.cards[i]['Gas']*0.01*this.categorySpendForm.controls['gas'].value
      +this.post.cards[i]['Groceries']*0.01*this.categorySpendForm.controls['groceries'].value
      +this.post.cards[i]['Home Improvement']*0.01*this.categorySpendForm.controls['home-Improvement'].value
      +this.post.cards[i]['Hotel/Motel']*0.01*this.categorySpendForm.controls['hotel-Motel'].value
      +this.post.cards[i]['Other']*0.01*this.categorySpendForm.controls['other'].value
      +this.post.cards[i]['Parking/Public Transit/Rides']*0.01*this.categorySpendForm.controls['parking-Public-Transit-Rides'].value
      +this.post.cards[i]['Recurring Bills']*0.01*this.categorySpendForm.controls['recurring-Bills'].value
      +this.post.cards[i]['Restaurants/Dining']*0.01*this.categorySpendForm.controls['restaurants-Dining'].value
      +this.post.cards[i]['Streaming/Digital Subscriptions']*0.01*this.categorySpendForm.controls['streaming-Digital-Subscriptions'].value
      +this.post.cards[i]['Supplementary Card Fee']*0.01*this.categorySpendForm.controls['streaming-Digital-Subscriptions'].value
      +this.post.cards[i]['Travel']*0.01*this.categorySpendForm.controls['travel'].value
      -this.post.cards[i]['Annual Fee'];

      console.log("count: " + i);
      console.log(rewardValue);

      let rewardObj = {
        cardName: this.post.cards[i]['Name'],
        rewardValue: rewardValue
      }

      this.rewards.push(rewardObj);
      
    }

    this.bestCard = this.rewards.reduce((max, item) => item.rewardValue > max.rewardValue ? item : max, this.rewards[0]);
  
    return this.rewards;
   
  }


}
