import { Component, Input } from '@angular/core';

@Component({
  selector: 'buttons-options',
  templateUrl: './buttons-options.component.html',
  styleUrls: ['./buttons-options.component.css']
})
export class ButtonsOptionsComponent {

  @Input()
  nameButtonOne!: string;

  @Input()
  routerlinkButtonOne!: string;

  @Input()
  isButtonTwo: boolean = false;

  @Input()
  nameButtonTwo!: string;

  @Input()
  routerlinkButtonTwo!: string;

  @Input()
  widthRem = 35;

  @Input()
  marginRem = 2;

  @Input()
  bgColor1 = '#e72929';

  @Input()
  color1 = 'white';

  @Input()
  bgColor2 = '#e72929';

  @Input()
  color2 = 'white';

}
