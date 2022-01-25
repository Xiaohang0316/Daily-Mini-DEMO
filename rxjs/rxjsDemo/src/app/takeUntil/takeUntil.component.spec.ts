/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TakeUntilComponent } from './takeUntil.component';

describe('TakeUntilComponent', () => {
  let component: TakeUntilComponent;
  let fixture: ComponentFixture<TakeUntilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TakeUntilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TakeUntilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
