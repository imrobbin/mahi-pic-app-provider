import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddPhotoPage } from './add-photo.page';

describe('AddPhotoPage', () => {
  let component: AddPhotoPage;
  let fixture: ComponentFixture<AddPhotoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPhotoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddPhotoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
