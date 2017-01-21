import { Component } from '@angular/core';
@Component({
    selector: 'my-app',
    template: `
<div>
    <h1>{{title}}</h1>
</div>
`
})
export class AppComponent {
    public title: string = `Hello`;
}
