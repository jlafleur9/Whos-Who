import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ButtonComponent implements OnInit {
  
  @Input() buttonText: string | undefined
  @Input() disabled: boolean | undefined;
  @Output() click = new EventEmitter<void>();

  handleClick(): void {
    console.log('Button clicked');
    this.click.emit();
  }
  
  constructor() { }
  
  ngOnInit(): void {
  }
  
}
