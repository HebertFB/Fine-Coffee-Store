import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

@Component({
  selector: 'text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.css']
})
export class TextInputComponent {

  @Input()
  control!: AbstractControl;

  @Input()
  showErrorsWhen: boolean = true;

  @Input()
  label!: string;

  @Input()
  isCep: boolean = false;

  @Input()
  isPhone: boolean = false;

  @Input()
  isUF: boolean = false;
  customPatterns = { 'A': { pattern: new RegExp(/[a-zA-ZÀ-ú]/) } };

  @Input()
  isText: boolean = false;

  @Input()
  isPrice: boolean = false;

  @Input()
  isPreparationTime: boolean = false;

  @Input()
  isNumberHouse: boolean = false;

  @Input()
  type: 'text' | 'password' | 'email' = 'text';

  get formControl() {
    return this.control as FormControl;
  }

}
