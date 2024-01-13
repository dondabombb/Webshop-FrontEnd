import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: false,
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Input() path?: string;
  @Input() type?: string = "button";
  @Input() formId?: string;
  @Input() styles!: string;
  @Input() disabled!: boolean;
  @Output() onClick: EventEmitter<any> = new EventEmitter();

  public onClickButton() {
    this.onClick.emit();
  }
}
