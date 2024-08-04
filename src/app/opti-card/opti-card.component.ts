import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Category } from './category.interface';
import { HttpClient } from '@angular/common/http';
import { CategoryDescription } from './card-description.enum';
import { CardName } from './card-name.enum';
import { concatMap, debounceTime, map, mergeMap, tap } from 'rxjs';

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
export class OptiCardComponent implements OnInit, OnDestroy {
  public categorySpendForm: FormGroup = this.formBuilder.group({});
  private _categories: Array<string> = [];
  public rewards: Array<RewardObj> = [];
  public bestCard: RewardObj = { cardName: '', rewardValue: 0 };

  private http = inject(HttpClient);
  post: any;
  cardsData: any;
  result: any;

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

    this.cardsData = this.http.get('http://poto-tomato:3000/api/data');

    this.result = this.cardsData.pipe(
      map((_val) => (this.post = _val)),
      concatMap((_val) =>
        this.categorySpendForm.valueChanges.pipe(debounceTime(300))
      )
    );

    this.result.subscribe((values: any) => {
      console.log('subscribe data shown!!');
      console.log(values);
      console.log(this.post);

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

        //Case 2: Scotia Momentum VI, Up to 25000 for both the 4% and the 2%; not parking
        else if (this.post.cards[i]['name'] == CardName.ScotiaMomentumVI) {
          const card = this.post.cards[i];

          //TODO: suggestions for backend API: Add categories to simplify the code, so the below code could be used using for loop.

          //drugStore
          rewardValue += ScotiaMomentumVICalc(
            card['drugStore'],
            values['drugStore'],
            card['other']
          );

          //entertainment
          rewardValue += ScotiaMomentumVICalc(
            card['entertainment'],
            values['entertainment'],
            card['other']
          );

          // furniture
          rewardValue += ScotiaMomentumVICalc(
            card['furniture'],
            values['furniture'],
            card['other']
          );

          //gas
          rewardValue += ScotiaMomentumVICalc(
            card['gas'],
            values['gas'],
            card['other']
          );

          //groceries
          rewardValue += ScotiaMomentumVICalc(
            card['groceries'],
            values['groceries'],
            card['other']
          );

          //homeImprovement
          rewardValue += ScotiaMomentumVICalc(
            card['homeImprovement'],
            values['homeImprovement'],
            card['other']
          );

          //hotel
          rewardValue += ScotiaMomentumVICalc(
            card['hotel'],
            values['hotel'],
            card['other']
          );

          //parking
          rewardValue += ScotiaMomentumVICalc(
            card['parking'],
            values['parking'],
            card['other']
          );

          //recurringBills
          rewardValue += ScotiaMomentumVICalc(
            card['recurringBills'],
            values['recurringBills'],
            card['other']
          );

          //restaurants
          rewardValue += ScotiaMomentumVICalc(
            card['restaurants'],
            values['restaurants'],
            card['other']
          );

          //streaming
          rewardValue += ScotiaMomentumVICalc(
            card['streaming'],
            values['streaming'],
            card['other']
          );

          //travel
          rewardValue += ScotiaMomentumVICalc(
            card['travel'],
            values['travel'],
            card['others']
          );

          //other
          rewardValue += ScotiaMomentumVICalc(
            card['other'],
            values['other'],
            card['other']
          );

          rewardValue = rewardValue - card['annualFee'];
        }

        //Case 3: Scotia Momentum V, Up to 25000 for the 2%;
        else if (this.post.cards[i]['name'] == CardName.ScotiaMomentumV) {

          //TODO: similar idea as ScotiaMomentumVI, but waiting for the api change to have a loop.

        } else {
          rewardValue = regularCalculation(this.post.cards[i]);
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

      function ScotiaMomentumVICalc(
        category: number,
        value: number,
        otherCategory: number
      ) {
        if (category * 0.01 === 0.04 || 0.02) {
          if (value > 25000) {
            rewardValue += (value - 25000) * otherCategory * 0.01;
          } else {
            rewardValue += value * category * 0.01;
          }
        } else {
          rewardValue += value * category * 0.01;
        }

        return rewardValue;
      }

      function ScotiaMomentumVCalc(
        category: number,
        value: number,
        otherCategory: number
      ) {
        if (category * 0.01 === 0.02) {
          if (value > 25000) {
            rewardValue += (value - 25000) * otherCategory * 0.01;
          } else {
            rewardValue += value * category * 0.01;
          }
        } else {
          rewardValue += value * category * 0.01;
        }

        return rewardValue;
      }

      function regularCalculation(post: { [x: string]: number }) {
        return (
          post['drugStore'] * 0.01 * values['drugStore'] +
          post['entertainment'] * 0.01 * values['entertainment'] +
          post['furniture'] * 0.01 * values['furniture'] +
          post['gas'] * 0.01 * values['gas'] +
          post['groceries'] * 0.01 * values['groceries'] +
          post['homeImprovement'] * 0.01 * values['homeImprovement'] +
          post['hotel'] * 0.01 * values['hotel'] +
          post['other'] * 0.01 * values['other'] +
          post['parking'] * 0.01 * values['parking'] +
          post['recurringBills'] * 0.01 * values['recurringBills'] +
          post['restaurants'] * 0.01 * values['restaurants'] +
          post['streaming'] * 0.01 * values['streaming'] +
          post['travel'] * 0.01 * values['travel'] -
          post['annualFee']
        );
      }

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

  constructor(private formBuilder: FormBuilder) {}

  ngOnDestroy() {
    this.result.unsubscribe();
  }
}
