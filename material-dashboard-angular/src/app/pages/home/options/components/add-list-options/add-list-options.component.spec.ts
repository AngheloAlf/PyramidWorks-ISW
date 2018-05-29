import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddListOptionsComponent } from './add-list-options.component';

describe('AddListOptionsComponent', () => {
  let component: AddListOptionsComponent;
  let fixture: ComponentFixture<AddListOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddListOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddListOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
