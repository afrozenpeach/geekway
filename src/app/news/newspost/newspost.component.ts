import { Component, OnInit } from '@angular/core';
import iframely from '@iframely/embed.js';
import { Observable, Subscription } from 'rxjs';
import { Newspost, SingleNewsPostGQL } from 'src/generated/types.graphql-gen';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-newspost',
  templateUrl: './newspost.component.html',
  styleUrls: ['./newspost.component.scss']
})
export class NewspostComponent implements OnInit {

  newsPost: Observable<Newspost>;
  newsPostSubscription: Subscription;
  newsContent: SafeHtml;
  
  constructor(
    private route: ActivatedRoute,
    private singlePostGQL: SingleNewsPostGQL,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    iframely.iframely.extendOptions({api_key: '24efd7ca731658c92b362e'});

    this.newsPost = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {        
        let whereClauseGW = {
          "slug": params.get('slug')
        };

        return this.singlePostGQL.watch({whereClause: whereClauseGW})
          .valueChanges
          .pipe(        
            map(result => result.data.newsposts[0])
          );
      })
    );

    this.newsPostSubscription = this.newsPost.subscribe(result => {
      this.newsContent = this.sanitizer.bypassSecurityTrustHtml(result.content.replace('<oembed url=', ' <div class="iframely-embed"><div class="iframely-responsive"><a data-iframely-url href=') + '</div></div>');
    })
  }

  ngOnDestroy() {
    this.newsPostSubscription.unsubscribe();
  }

  ngAfterViewChecked() {
    iframely.iframely.load();
  }

}