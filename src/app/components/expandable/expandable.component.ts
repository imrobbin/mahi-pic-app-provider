import {
    Component,
    OnInit,
    ViewChild,
    ElementRef,
    Input,
    Renderer2,
} from '@angular/core';

@Component({
    selector: 'app-expandable',
    templateUrl: './expandable.component.html',
    styleUrls: ['./expandable.component.scss'],
})
export class ExpandableComponent implements OnInit {
    @ViewChild('expandWrapper', { static: false }) expandWrapper: ElementRef;

    // tslint:disable-next-line: no-input-rename
    @Input('expanded') expanded = false;
    // tslint:disable-next-line: no-input-rename
    @Input('expandHeight') expandHeight = '150px';

    constructor(public renderer: Renderer2) {}

    ngOnInit() {
        this.renderer.setStyle(
            this.expandWrapper.nativeElement,
            'max-height',
            this.expandHeight
        );
    }
}
