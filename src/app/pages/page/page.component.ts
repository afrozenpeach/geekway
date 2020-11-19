import { AfterViewChecked, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
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
  styleUrls: ['./page.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class PageComponent implements OnInit, AfterViewChecked, OnDestroy {

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
      this.pageContent = this.sanitizer.bypassSecurityTrustHtml(result.Content.replace(/<oembed url=(.*)><\/oembed>/, ' <div class="iframely-embed"><div class="iframely-responsive"><a data-iframely-url href=$1></div></div>').replace('src="/uploads/', 'src="https://cms.geekway.com/uploads/'));
      if (result.HeaderImage) {
        this.headerPhoto.announceHeaderPhotoChanged("https://cms.geekway.com" + result.HeaderImage.url);
      }
      this.headerPhoto.announceHeaderLabelChanged(result.Name);
    })
  }

  ngOnDestroy() {
    if (this.pageSubscription) {
      this.pageSubscription.unsubscribe();
    }
  }

  ngAfterViewChecked() {
    iframely.iframely.load();
  }

}
