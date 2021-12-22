import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'sas-button',
  templateUrl: 'sas-button.html',
})
export class SasButtonComponent {
  @Input() public label: string;
  @Input() public isDisabled: boolean;
  @Input() public isOutline: boolean;
  @Input() public noBorder: boolean;
  @Input() public ionIcon: boolean;
  @Input() public iconToShow: string;
  @Output() public sasButtonClick = new EventEmitter<any>();

  public fireClickEvent(): void {
    this.sasButtonClick.emit();
  }

  public send() {
      alert('clicou');
  }
}
