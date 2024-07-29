import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Category } from './category.interface';
import { HttpClient } from '@angular/common/http';
import { CategoryDescription } from './card-description.enum';
import { CardName } from './card-name.enum';
import { debounceTime } from 'rxjs';

export interface RewardObj {
  cardName: string;
  rewardValue: number;
}

@Component({
  selector: 'app-opti-card',
  standalone: true,
  templateUrl: './opti-card.component.html',
  styleUrl: './opti-card.component.scss',
  imports: [ReactiveFormsModule, CommonModule],
})
export class OptiCardComponent implements OnInit {
  public categorySpendForm: FormGroup = this.formBuilder.group({});
  private _categories: Array<string> = [];
  public rewards: Array<RewardObj> = [];
  public bestCard: RewardObj = { cardName: '', rewardValue: 0 };

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

    this.categorySpendForm.valueChanges
      .pipe(debounceTime(300))
      .subscribe((values) => {
        this.rewards = [];
        let rewardValue = 0;

        for (let i = 0; i < this.post.cards.length; i++) {
          //Case 1: Tangerine Money-Back MC will only give highest 3 categories 2% rewards, the rest categories are 0.5%
          if (
            this.post.cards[i]['name'] == CardName.TangerineMoneyBackMC ||
            CardName.TangerineWorldMC
          ) {
            let objToSort = values;
            let sortable: any[] = [];

            for (let obj in objToSort) {
              sortable.push([obj, objToSort[obj]]);
            }

            sortable.sort(function (a, b) {
              return b[1] - a[1];
            });

            for (let i = 0; i < sortable.length; i++) {
              if (i <= 2) {
                rewardValue += sortable[i][1] * 0.02;
              } else {
                rewardValue += sortable[i][1] * 0.005;
              }
            }
          }

          // TODO: Many cards first $2500 in groceries give 4%, the rest if other, eg. 1%
          else {
            rewardValue =
              this.post.cards[i]['drugStore'] * 0.01 * values['drugStore'] +
              this.post.cards[i]['entertainment'] *
                0.01 *
                values['entertainment'] +
              this.post.cards[i]['furniture'] * 0.01 * values['furniture'] +
              this.post.cards[i]['gas'] * 0.01 * values['gas'] +
              this.post.cards[i]['groceries'] * 0.01 * values['groceries'] +
              this.post.cards[i]['homeImprovement'] *
                0.01 *
                values['homeImprovement'] +
              this.post.cards[i]['hotel'] * 0.01 * values['hotel'] +
              this.post.cards[i]['other'] * 0.01 * values['other'] +
              this.post.cards[i]['parking'] * 0.01 * values['parking'] +
              this.post.cards[i]['recurringBills'] *
                0.01 *
                values['recurringBills'] +
              this.post.cards[i]['restaurants'] * 0.01 * values['restaurants'] +
              this.post.cards[i]['streaming'] * 0.01 * values['streaming'] +
              this.post.cards[i]['travel'] * 0.01 * values['travel'] -
              this.post.cards[i]['annualFee'];
          }

          let rewardObj = {
            cardName: this.post.cards[i]['name'],
            rewardValue: rewardValue,
          };

          this.rewards.push(rewardObj);
        }

        this.bestCard = this.rewards.reduce(
          (max, item) => (item.rewardValue > max.rewardValue ? item : max),
          this.rewards[0]
        );

        return this.rewards;
      });
  }

  public get categories() {
    let categoriesArr: Array<Category> = [];

    for (let i = 0; i < this._categories.length; i++) {
      let upperDesp =
        this._categories[i].charAt(0).toUpperCase() +
        this._categories[i].slice(1);

      let categoryObj = {
        label: this._categories[i],
        id: this._categories[i],
        description: upperDesp.split(/(?=[A-Z])/).join(' '),
        controlName: this._categories[i],
      };

      if (this._categories[i] === 'hotel') {
        categoryObj.description = CategoryDescription.Hotel;
      }

      if (this._categories[i] === 'parking') {
        categoryObj.description = CategoryDescription.Parking;
      }

      if (this._categories[i] === 'restaurants') {
        categoryObj.description = CategoryDescription.Restaurants;
      }

      if (this._categories[i] === 'streaming') {
        categoryObj.description = CategoryDescription.Streaming;
      }

      categoriesArr.push(categoryObj);
    }

    return categoriesArr;
  }

  private get formGroupConfig() {
    const _formGroupConfig: { [key: string]: any } = {};

    this.categories.forEach((category) => {
      let fieldName = category.controlName;
      _formGroupConfig[fieldName] = 3000; // Spending cost can manual change the number
    });

    return _formGroupConfig;
  }

  constructor(private formBuilder: FormBuilder) {
    this.http.get('http://poto-tomato:3000/api/data').subscribe((data) => {
      this.post = data;
    });
  }
}
