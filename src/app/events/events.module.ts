import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventComponent } from './event/event.component';
import { EventsComponent } from './events/events.component';
import { Routes, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { IvyCarouselModule } from 'angular-responsive-carousel';

const eventsRoutes: Routes = [  
  { path: '', component: EventsComponent, pathMatch: 'full' },
  { path: 'event/:slug', component: EventComponent }
]

@NgModule({
  declarations: [EventComponent, EventsComponent],
  imports: [
    CommonModule,
    MatCardModule,
    IvyCarouselModule,
    RouterModule.forChild(eventsRoutes)
  ]
})
export class EventsModule { }
