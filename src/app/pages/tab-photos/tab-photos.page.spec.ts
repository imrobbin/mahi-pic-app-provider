import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TabPhotosPage } from './tab-photos.page';

describe('TabPhotosPage', () => {
  let component: TabPhotosPage;
  let fixture: ComponentFixture<TabPhotosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabPhotosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TabPhotosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
