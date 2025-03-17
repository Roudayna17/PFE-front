import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCaracteristiqueComponent } from './delete-caracteristique.component';

describe('DeleteCaracteristiqueComponent', () => {
  let component: DeleteCaracteristiqueComponent;
  let fixture: ComponentFixture<DeleteCaracteristiqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteCaracteristiqueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteCaracteristiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
