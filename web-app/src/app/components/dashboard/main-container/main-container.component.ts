import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {Subscription} from "rxjs/Subscription";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-main-container',
  templateUrl: './main-container.component.html',
  styleUrls: ['./main-container.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MainContainerComponent implements OnInit {

    public constructor() { }

    public ngOnInit(): void {}

    public ngOnDestroy ():void  {}

}
