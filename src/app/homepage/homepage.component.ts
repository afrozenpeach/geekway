import { Component, OnInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { NextConventionWhereGQL, Convention, SponsorsGQL, Sponsors } from 'src/generated/types.graphql-gen';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  geekwayToTheWest: Observable<Convention>;
  geekwayToTheWestSubscription: Subscription;

  geekwayMini: Observable<Convention>;
  geekwayMiniSubscription: Subscription;

  geekwayMicro: Observable<Convention>;
  geekwayMicroSubscription: Subscription

  sponsors: Observable<Sponsors[]>;
  sponsorsSubscription: Subscription;
  
  constructor(
    private nextGWConventionWhere: NextConventionWhereGQL, 
    private nextGWMiniConventionWhere: NextConventionWhereGQL, 
    private nextGWMicroConventionWhere: NextConventionWhereGQL,
    private sponsorsGQL: SponsorsGQL,
    private router: Router) { 
  }

  ngOnInit() {
    let whereClauseGW = {
      "Type": "GeekwayToTheWest",
      "endDate_gt": new Date().toISOString()
    };

    this.geekwayToTheWest = this.nextGWConventionWhere.watch({whereClause: whereClauseGW})
      .valueChanges
      .pipe(        
        map(result => result.data.conventions[0])
      );

    this.geekwayToTheWestSubscription = this.geekwayToTheWest.subscribe();

    let whereClauseGWMini = {
      "Type": "GeekwayMini",
      "endDate_gt": new Date().toISOString()
    };

    this.geekwayMini = this.nextGWMiniConventionWhere.watch({whereClause: whereClauseGWMini})
      .valueChanges
      .pipe(
        map(result => result.data.conventions[0])
      );
      
    this.geekwayMiniSubscription = this.geekwayMini.subscribe();
    
    let whereClauseGWMicro = {
      "Type": "GeekwayMicro",
      "endDate_gt": new Date().toISOString()
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
  };

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
  }

  redirect(url: string) {
    if (url.startsWith("http")) {
      this.router.navigate(['/externalRedirect', { externalUrl: url }], {
        skipLocationChange: true,
      });
    } else {
      this.router.navigate([url]);
    }
    
    event.preventDefault();
  }

}
