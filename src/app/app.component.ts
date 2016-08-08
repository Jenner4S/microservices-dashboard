import { Component, ViewEncapsulation } from '@angular/core';
import { Msdtopbar } from './topbar/topbar.component';
import { MsdResourceNode } from './visuals/resource-node';
/*
 * App Component
 * Top Level Component
 */
@Component({
    selector: 'app',
    encapsulation: ViewEncapsulation.None,
    styleUrls: [
        './app.style.css'
    ],
    directives: [Msdtopbar, MsdResourceNode],
    template: `
    <msd-topbar></msd-topbar>
    <msd-resource-node
        id="position" 
        [width]="myWidth" 
        [height]="410">
    </msd-resource-node>
    <input [(ngModel)]="myWidth" type="text" />
  `
})
export class App {
    public myWidth: any;
    ngOnInit() {
        this.myWidth = '141';
    }
}
