import { Component, OnInit, Input } from '@angular/core';
import * as resourceNodeStyles from './resource-node.styles.css';

@Component({
    selector: 'msd-resource-node',
    template: require('./resource-node.html'),
    styles: [
        resourceNodeStyles
    ]
})
export class MsdResourceNode implements OnInit {
    // TODO position text label
    private _width: string;
    private _height: string;
    private _id: string;

    @Input()
    public set id(v: string) {
        this._id = v;
    }
    public get id(): string {
        return this._id;
    }

    @Input()
    public set width(v: string) {
        this._width = v;
    }
    public get width(): string {
        return this._width;
    }

    @Input()
    public set height(v: string) {
        this._height = v;
    }

    public get height(): string {
        return this._height;
    }

    constructor() { }

    ngOnInit() {

    }
}