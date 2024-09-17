import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-button',
  template: `<button>{{ buttonText }}</button>`,
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent implements OnInit {
  
  @Input() buttonText: string | undefined
  // @Input() isDisabled: boolean = false;

  
  
  constructor() { }
  
  ngOnInit(): void {
  }
  
}
