import { TestBed } from '@angular/core/testing';

import { LessorService } from './lessor.service';

describe('LessorService', () => {
  let service: LessorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LessorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
