import { Component, NgModule, VERSION, QueryList, ViewChildren, enableProdMode, AfterViewInit, OnDestroy } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-root',
  template: `
        <h2>Steps to reproduce</h2>
        <ol>
          <li>Click on the button to show the element - this will attach and instantly detach the scroll event handler</li>
          <li>Click again on the button to hide it</li>
          <li>Open Chrome dev tools and take a Memory snapshot</li>
          <li>Switch to <b>Containment</b></li>
          <li>Inspect <b>Detached DOM tree</b>. There should be one entry which is our div element</li>
        </ol>

        <button (click)="toggle = !toggle">{{toggle ? 'attached' : 'detached'}}</button>
        <div #container *ngIf="toggle" style="background:red; height: 200px; width: 200px"></div>
        `
})
export class AppComponent implements AfterViewInit, OnDestroy {
  private subscription: Subscription;

  toggle = false;

  @ViewChildren('container') containers = new QueryList<any>();

  ngAfterViewInit() {
    this.subscription = this.containers.changes.filter(x => x.length).subscribe(e => {
      Observable.fromEvent(e.first.nativeElement, 'scroll').subscribe(() => console.log(42)).unsubscribe();
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
