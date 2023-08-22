import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConventionsComponent } from './conventions.component';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MomentModule } from 'ngx-moment';
import { MomentTimezoneModule } from '../shared/moment-timezone/moment-timezone.module';
import { ApolloTestingModule, ApolloTestingController } from 'apollo-angular/testing';
import { IvyCarouselModule } from 'angular-responsive-carousel';
import { AgmCoreModule } from '@agm/core';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { RouterTestingModule } from '@angular/router/testing';

describe('ConventionsComponent', () => {
  let component: ConventionsComponent;
  let fixture: ComponentFixture<ConventionsComponent>;
  let backend: ApolloTestingController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConventionsComponent ],
      imports: [
        MatTableModule,
        MomentModule,
        MomentTimezoneModule,
        ApolloTestingModule,
        IvyCarouselModule,
        AgmCoreModule,
        AgmSnazzyInfoWindowModule,
        RouterTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConventionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    backend = TestBed.get(ApolloTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
