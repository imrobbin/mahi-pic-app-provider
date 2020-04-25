import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-tabs',
    templateUrl: './tabs.page.html',
    styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
    tabHomeIcon: boolean;
    tabPhotosIcon: boolean;
    tabSettingsIcon: boolean;

    constructor() {}

    ngOnInit() {}

    onTabChangeStart(tab) {
        if (tab.tab === 'tabHome') {
            this.resetTabs();
            this.tabHomeIcon = true;
        } else if (tab.tab === 'tabPhotos') {
            this.resetTabs();
            this.tabPhotosIcon = true;
        } else if (tab.tab === 'tabSettings') {
            this.resetTabs();
            this.tabSettingsIcon = true;
        }
    }

    resetTabs() {
        this.tabHomeIcon = false;
        this.tabPhotosIcon = false;
        this.tabSettingsIcon = false;
    }
}
