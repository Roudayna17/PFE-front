import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEquipemntComponent } from './list-equipemnt.component';

describe('ListEquipemntComponent', () => {
  let component: ListEquipemntComponent;
  let fixture: ComponentFixture<ListEquipemntComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListEquipemntComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListEquipemntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
