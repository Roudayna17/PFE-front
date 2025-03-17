import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateEquipemntComponent } from './update-equipemnt.component';

describe('UpdateEquipemntComponent', () => {
  let component: UpdateEquipemntComponent;
  let fixture: ComponentFixture<UpdateEquipemntComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateEquipemntComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateEquipemntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
