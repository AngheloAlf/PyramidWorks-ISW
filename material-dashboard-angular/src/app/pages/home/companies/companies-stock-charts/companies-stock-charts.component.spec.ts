import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesStockChartsComponent } from './companies-stock-charts.component';

describe('CompaniesStockChartsComponent', () => {
  let component: CompaniesStockChartsComponent;
  let fixture: ComponentFixture<CompaniesStockChartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompaniesStockChartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompaniesStockChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
