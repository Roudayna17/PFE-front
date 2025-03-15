import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteLocataireComponent } from './delete-locataire.component';

describe('DeleteLocataireComponent', () => {
  let component: DeleteLocataireComponent;
  let fixture: ComponentFixture<DeleteLocataireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteLocataireComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteLocataireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
