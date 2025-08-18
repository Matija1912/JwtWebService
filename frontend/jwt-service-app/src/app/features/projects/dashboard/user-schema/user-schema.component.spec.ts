import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSchemaComponent } from './user-schema.component';

describe('UserSchemaComponent', () => {
  let component: UserSchemaComponent;
  let fixture: ComponentFixture<UserSchemaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserSchemaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserSchemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
