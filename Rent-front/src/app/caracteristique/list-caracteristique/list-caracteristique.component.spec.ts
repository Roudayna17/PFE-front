import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCaracteristiqueComponent } from './list-caracteristique.component';

describe('ListCaracteristiqueComponent', () => {
  let component: ListCaracteristiqueComponent;
  let fixture: ComponentFixture<ListCaracteristiqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListCaracteristiqueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListCaracteristiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
