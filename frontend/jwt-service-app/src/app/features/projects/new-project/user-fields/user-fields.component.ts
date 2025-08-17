import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-user-fields',
  templateUrl: './user-fields.component.html',
  styleUrl: './user-fields.component.css'
})
export class UserFieldsComponent {

  @Input() customFields: {name: string, type: string, required: boolean}[]  = [{name: 'email', type: 'string', required: true}, {name: 'password', type: 'string', required: true}];

  @Output() remove = new EventEmitter<number>();

  removeField = (index: number) => {
    this.remove.emit(index);
  }

}
