import { Component, Input, ViewChild, AfterViewInit, ElementRef, OnChanges } from '@angular/core';
import * as resourceNodeStyles from './resource-node.styles.css';

@Component({
    selector: 'msd-resource-node',
    template: require('./resource-node.html'),
    styles: [
        resourceNodeStyles
    ]
})
export class MsdResourceNode implements AfterViewInit, OnChanges {

    @ViewChild('label')
    public label: ElementRef;

    private _width: number;
    private _height: number;
    private _id: string;

    @Input()
    public set id(v: string) {
        this._id = v;
    }
    public get id(): string {
        return this._id;
    }

    @Input()
    public set width(v: number) {
        this._width = v;
    }
    public get width(): number {
        return this._width;
    }

    @Input()
    public set height(v: number) {
        this._height = v;
    }

    public get height(): number {
        return this._height;
    }

    public ngAfterViewInit(): void {
        this.centerElement(this.label.nativeElement);
    }

    public ngOnChanges(): void {
        this.centerElement(this.label.nativeElement);
    }

    private centerElement(element: SVGTextElement): void {
        const x: string = String(this._width / 2 - element.clientWidth / 2);
        const y: string = String(this._height / 2 + element.clientHeight / 2);
        element.setAttribute('x', x);
        element.setAttribute('y', y);
    }
}
