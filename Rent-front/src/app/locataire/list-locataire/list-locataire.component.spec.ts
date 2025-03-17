import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListLocataireComponent } from './list-locataire.component';

describe('ListLocataireComponent', () => {
  let component: ListLocataireComponent;
  let fixture: ComponentFixture<ListLocataireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListLocataireComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListLocataireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
