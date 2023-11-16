import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'default-button',
  templateUrl: './default-button.component.html',
  styleUrls: ['./default-button.component.css']
})
export class DefaultButtonComponent {

  @Input()
  type: 'submit' | 'button' = 'submit';

  @Input()
  text: string = 'Submit';

  @Input()
  bgColor = '#379c56';

  @Input()
  color = 'white';

  @Input()
  fontSizeRem = 1.3;

  @Input()
  mTopRem = 1;

  @Input()
  mbottomRem = 0;

  @Input()
  marginRem = { top: this.mTopRem, right: 'auto', bottom: this.mbottomRem, left: 'auto' };

  @Input()
  heightRem = 3.5;

  @Input()
  widthRem = 12;

  @Output()
  onClick = new EventEmitter();

}
