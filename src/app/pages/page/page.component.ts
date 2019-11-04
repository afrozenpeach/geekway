import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Page, SinglePageGQL } from 'src/generated/types.graphql-gen';
import { switchMap, map } from 'rxjs/operators';
import { DomSanitizer, SafeHtml, Meta, Title } from '@angular/platform-browser';
import iframely from '@iframely/embed.js';
import { HeaderPhotoService } from 'src/app/shared/header-photo/header-photo.service';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {

  page: Observable<Page>;
  pageSubscription: Subscription;
  pageContent: SafeHtml;
  
  constructor(
    private route: ActivatedRoute,
    private singlepageGQL: SinglePageGQL,
    private sanitizer: DomSanitizer,
    private meta: Meta,
    private title: Title,
    public headerPhoto: HeaderPhotoService
  ) { 
  }

  ngOnInit() {
    iframely.iframely.extendOptions({api_key: '24efd7ca731658c92b362e'});

    this.page = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {        
        let whereClauseGW = {
          "slug": params.get('slug')
        };

        return this.singlepageGQL.watch({whereClause: whereClauseGW})
          .valueChanges
          .pipe(        
            map(result => result.data.pages[0])
          );
      })
    );

    this.pageSubscription = this.page.subscribe(result => {
      this.pageContent = this.sanitizer.bypassSecurityTrustHtml(result.Content.replace('<oembed url=', ' <div class="iframely-embed"><div class="iframely-responsive"><a data-iframely-url href=') + '</div></div>');
      this.headerPhoto.announceHeaderPhotoChanged("https://cms.geekwaytothewest.com/" + result.HeaderImage.url);
      this.headerPhoto.announceHeaderLabelChanged(result.Name);
    })
  }

  ngOnDestroy() {
    this.pageSubscription.unsubscribe();
  }

  ngAfterViewChecked() {
    iframely.iframely.load();
  }

}
