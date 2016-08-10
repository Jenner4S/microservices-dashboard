import { Inject, Component, ViewEncapsulation } from '@angular/core';
import { Msdtopbar } from './topbar/topbar.component';
import { MsdResourceNode } from './visuals/resource-node';
import { BASE_ENDPOINT_TOKEN } from '../platform/tokens';
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
    div
    <msd-resource-node
        id="position" 
        [width]="myWidth" 
        [height]="410">
    </msd-resource-node>
        <msd-resource-node
        id="hello" 
        [width]="200" 
        [height]="50">
    </msd-resource-node>
    <msd-resource-node
        id="test" 
        [width]="300" 
        [height]="100">
    </msd-resource-node>

    <input [(ngModel)]="myWidth" type="text" />
  `
})
export class App {
    public myWidth: any;
    constructor( @Inject(BASE_ENDPOINT_TOKEN) baseUrl: any) {
        console.log(baseUrl, 'url');
    }
    ngOnInit() {
        this.myWidth = '141';
    }
}
