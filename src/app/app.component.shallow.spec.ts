import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('Shallow', () => {
    let fixture: ComponentFixture<AppComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [AppComponent],
            schemas     : [NO_ERRORS_SCHEMA]
        });
        fixture = TestBed.createComponent(AppComponent);
    });

    it('Shallow spec', () => {
        expect(fixture.componentInstance.title).toEqual('Hello');
    });
});
