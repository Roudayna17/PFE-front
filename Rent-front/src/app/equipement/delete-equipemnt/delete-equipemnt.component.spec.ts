import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteEquipemntComponent } from './delete-equipemnt.component';

describe('DeleteEquipemntComponent', () => {
  let component: DeleteEquipemntComponent;
  let fixture: ComponentFixture<DeleteEquipemntComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteEquipemntComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteEquipemntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
