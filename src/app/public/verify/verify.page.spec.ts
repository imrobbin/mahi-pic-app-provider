import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyPage } from './verify.page';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('VerifyPage', () => {
    let component: VerifyPage;
    let fixture: ComponentFixture<VerifyPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [VerifyPage],
            imports: [RouterTestingModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(async(() => {
        fixture = TestBed.createComponent(VerifyPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
