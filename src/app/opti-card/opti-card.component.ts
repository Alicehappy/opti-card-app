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
      'drugStore',     
      'entertainment',
      'furniture',
      'gas',
      'groceries',
      'homeImprovement',
      'hotel',
      'parking',  
      'recurringBills',
      'restaurants',
      'streaming',
      'travel',
      'other',
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
    console.log(this.categorySpendForm.controls['drugStore'].value);

    this.calculateRewards();
  }


  public get categories() {

    let categoriesArr: Array<Category> = [];
    
    for(let i = 0; i < this._categories.length; i++) {
     

      categoriesArr.push({
        label: this._categories[i],
        id: this._categories[i],
        description: this._categories[i],
        controlName: this._categories[i],
      })
    }

    return categoriesArr;
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
      let rewardValue = this.post.cards[i]['drugStore']*0.01*this.categorySpendForm.controls['drugStore'].value
      +this.post.cards[i]['entertainment']*0.01*this.categorySpendForm.controls['entertainment'].value
      +this.post.cards[i]['furniture']*0.01*this.categorySpendForm.controls['furniture'].value
      +this.post.cards[i]['gas']*0.01*this.categorySpendForm.controls['gas'].value
      +this.post.cards[i]['groceries']*0.01*this.categorySpendForm.controls['groceries'].value
      +this.post.cards[i]['homeImprovement']*0.01*this.categorySpendForm.controls['homeImprovement'].value
      +this.post.cards[i]['hotel']*0.01*this.categorySpendForm.controls['hotel'].value
      +this.post.cards[i]['other']*0.01*this.categorySpendForm.controls['other'].value
      +this.post.cards[i]['parking']*0.01*this.categorySpendForm.controls['parking'].value
      +this.post.cards[i]['recurringBills']*0.01*this.categorySpendForm.controls['recurringBills'].value
      +this.post.cards[i]['restaurants']*0.01*this.categorySpendForm.controls['restaurants'].value
      +this.post.cards[i]['streaming']*0.01*this.categorySpendForm.controls['streaming'].value
      +this.post.cards[i]['travel']*0.01*this.categorySpendForm.controls['travel'].value
      -this.post.cards[i]['annualFee'];

      console.log("count: " + i);
      console.log(rewardValue);

      let rewardObj = {
        cardName: this.post.cards[i]['name'],
        rewardValue: rewardValue
      }

      this.rewards.push(rewardObj);``
      
    }

    this.bestCard = this.rewards.reduce((max, item) => item.rewardValue > max.rewardValue ? item : max, this.rewards[0]);
  
    return this.rewards;
   
  }


}
