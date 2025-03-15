import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCaracteristiqueComponent } from './update-caracteristique.component';

describe('UpdateCaracteristiqueComponent', () => {
  let component: UpdateCaracteristiqueComponent;
  let fixture: ComponentFixture<UpdateCaracteristiqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateCaracteristiqueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateCaracteristiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
