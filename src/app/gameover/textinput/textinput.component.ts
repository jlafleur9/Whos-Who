import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-textinput',
  templateUrl: './textinput.component.html',
  styleUrls: ['./textinput.component.css']
})
export class TextinputComponent implements OnInit {
  @Output() nameChange: EventEmitter<string> = new EventEmitter<string>();

  name: string = '';

  constructor() { }

  ngOnInit(): void {
  }

  setName(name: string) {
    this.name = name;
    this.nameChange.emit(this.name);
  }
  

}
