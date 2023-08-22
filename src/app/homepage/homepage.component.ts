import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { NextConventionWhereGQL, Convention, SponsorsGQL, Sponsors, Newspost, FeaturedNewsGQL } from 'src/generated/types.graphql-gen';
import { Router } from '@angular/router';
import moment from 'moment';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit, OnDestroy {

  geekwayToTheWest: Observable<any>;
  geekwayToTheWestSubscription: Subscription;

  geekwayMini: Observable<any>;
  geekwayMiniSubscription: Subscription;

  geekwayMicro: Observable<any>;
  geekwayMicroSubscription: Subscription;

  sponsors: Observable<any[]>;
  sponsorsSubscription: Subscription;

  featuredNews: Observable<any[]>;
  featuredNewsSubscription: Subscription;
  todaysDate = new Date();

  apiLoaded: Observable<boolean>;

  constructor(
    private nextGWConventionWhere: NextConventionWhereGQL,
    private nextGWMiniConventionWhere: NextConventionWhereGQL,
    private nextGWMicroConventionWhere: NextConventionWhereGQL,
    private sponsorsGQL: SponsorsGQL,
    private featuredNewsGQL: FeaturedNewsGQL,
    private router: Router,
    private httpClient: HttpClient) {

    this.apiLoaded = httpClient.jsonp('https://maps.googleapis.com/maps/api/js?key=YOUR_KEY_HERE', 'callback')
      .pipe(
        map(() => true),
        catchError(() => of(false)),
      );
  }

  ngOnInit() {
    const whereClauseGW = {
      Type: 'GeekwayToTheWest',
      endDate_gt: new Date().toISOString()
    };

    this.geekwayToTheWest = this.nextGWConventionWhere.watch({whereClause: whereClauseGW})
      .valueChanges
      .pipe(
        map(result => result.data.conventions[0])
      );

    this.geekwayToTheWestSubscription = this.geekwayToTheWest.subscribe();

    const whereClauseGWMini = {
      Type: 'GeekwayMini',
      endDate_gt: new Date().toISOString()
    };

    this.geekwayMini = this.nextGWMiniConventionWhere.watch({whereClause: whereClauseGWMini})
      .valueChanges
      .pipe(
        map(result => result.data.conventions[0])
      );

    this.geekwayMiniSubscription = this.geekwayMini.subscribe();

    const whereClauseGWMicro = {
      Type: 'GeekwayMicro',
      endDate_gt: new Date().toISOString()
    };

    this.geekwayMicro = this.nextGWMicroConventionWhere.watch({whereClause: whereClauseGWMicro})
      .valueChanges
      .pipe(
        map(result => result.data.conventions[0])
      );

    this.geekwayMicroSubscription = this.geekwayMicro.subscribe();

    this.sponsors = this.sponsorsGQL.watch()
      .valueChanges
      .pipe(
        map(result => result.data.sponsors)
      );

    this.sponsorsSubscription = this.sponsors.subscribe();

    this.featuredNews = this.featuredNewsGQL.watch()
      .valueChanges
      .pipe(
        map(result => result.data.newsposts)
      );

    this.featuredNewsSubscription = this.featuredNews.subscribe();
  }

  ngOnDestroy() {
    if (this.geekwayToTheWestSubscription) {
      this.geekwayToTheWestSubscription.unsubscribe();
    }

    if (this.geekwayMiniSubscription) {
      this.geekwayMiniSubscription.unsubscribe();
    }

    if (this.geekwayMicroSubscription) {
      this.geekwayMicroSubscription.unsubscribe();
    }

    if (this.featuredNewsSubscription) {
      this.featuredNewsSubscription.unsubscribe();
    }
  }

  redirect(url: string) {
    if (url.startsWith('http')) {
      this.router.navigate(['/externalRedirect', { externalUrl: url }], {
        skipLocationChange: true,
      });
    } else {
      this.router.navigate([url]);
    }

    event.preventDefault();
  }

  isRegistrationOpen(reg) {
    return moment(reg.date).isBefore(moment(this.todaysDate)) && moment(reg.dateClosed).isAfter(moment(this.todaysDate));
  }

  isRegistrationSoon(reg) {
    return moment(reg.date).isAfter(moment(this.todaysDate));
  }

}
