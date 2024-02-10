import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NopageComponent } from './nopage.component';

describe('NopageComponent', () => {
  let component: NopageComponent;
  let fixture: ComponentFixture<NopageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NopageComponent]
    });
    fixture = TestBed.createComponent(NopageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
