import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'choice-box',
  templateUrl: './choice-box.component.html',
  styleUrls: ['./choice-box.component.css']
})

export class ChoiceBoxComponent {

  @Input()
  id!: string;

  @Input()
  title!: string;

  @Input()
  fontSize!: string;

  @Output()
  selectedTypeChange: EventEmitter<string> = new EventEmitter<string>();

  onInputChange(selectedType: string | boolean) {
    this.selectedType = selectedType;
    this.selectedTypeChange.emit(this.selectedType.toString());
  }

  @Input()
  selectedType: string | boolean | null = null;

  @Input()
  firstValue!: string | boolean;

  @Input()
  firstIcon!: string;

  @Input()
  secondValue!: string | boolean;

  @Input()
  secondIcon!: string;

  @Input()
  nameOption!: string;

  @Input()
  firstName!: string;

  @Input()
  secondName!: string;

}
