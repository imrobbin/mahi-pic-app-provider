import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-tab-home',
    templateUrl: './tab-home.page.html',
    styleUrls: ['./tab-home.page.scss'],
})
export class TabHomePage implements OnInit {
    cards: any = [3];
    showMore = false;

    constructor(private router: Router, private auth: AuthService) {
        this.cards = [
            {
                name: 'Ravindra Patle',
                tag: 'This is random text',
                avatar: '../../assets/images/profile-avatar.png',
                images: {
                    imgUrl: '../../../assets/images/slide-5.png',
                    imgCaption:
                        // tslint:disable-next-line: max-line-length
                        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
                    imgLikes: 564,
                    expanded: false,
                },
            },
            {
                name: 'Ravindra Patle',
                tag: '',
                avatar: '../../assets/images/profile-avatar.png',
                images: {
                    imgUrl: '../../../assets/images/slide-2.png',
                    imgCaption:
                        // tslint:disable-next-line: max-line-length
                        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
                    imgLikes: 564,
                    expanded: false,
                },
            },
            {
                name: 'Ravindra Patle',
                tag: 'This is random text',
                avatar: '../../assets/images/profile-avatar.png',
                images: {
                    imgUrl: '../../../assets/images/slide-1.png',
                    imgCaption:
                        // tslint:disable-next-line: max-line-length
                        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
                    imgLikes: 564,
                    expanded: false,
                },
            },
        ];
    }

    ngOnInit() {}

    toggleCaption(item: any) {
        if (item.expanded) {
            item.expanded = false;
        } else {
            this.cards.map((listItem: any) => {
                console.log('item ', item);
                console.log('listItem ', listItem);
                if (item === listItem) {
                    listItem.expanded = !listItem.expanded;
                } else {
                    listItem.expanded = false;
                }
                return listItem;
            });
        }
    }

    gotoDetail() {
        this.router.navigateByUrl('/mahipic/tabs/tabHome/homeDetail');
    }
}
