import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptiCardComponent } from './opti-card.component';

describe('OptiCardComponent', () => {
  let component: OptiCardComponent;
  let fixture: ComponentFixture<OptiCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptiCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OptiCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
