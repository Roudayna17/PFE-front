import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserADDComponent } from './user-add.component';

describe('UserADDComponent', () => {
  let component: UserADDComponent;
  let fixture: ComponentFixture<UserADDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserADDComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserADDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
