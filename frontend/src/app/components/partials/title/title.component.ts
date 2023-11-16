import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.css']
})
export class TitleComponent {

  @Input()
  title!: string;

  @Input()
  mTopRem = 1;

  @Input()
  mRigthRem = 0;

  @Input()
  mBottomRem = 1;

  @Input()
  mLeftRem = 0.2;

  @Input()
  marginRem = { top: this.mTopRem, right: this.mRigthRem, bottom: this.mBottomRem, left: this.mLeftRem };

  @Input()
  fontSize?= '1.7rem';

}
