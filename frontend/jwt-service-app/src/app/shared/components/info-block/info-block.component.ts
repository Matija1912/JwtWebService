import {Component, Input} from '@angular/core';
import {InfoData} from './infoData.model';

type InfoType = 'danger' | 'success' | 'info';

@Component({
  selector: 'app-info-block',
  templateUrl: './info-block.component.html',
  styleUrl: './info-block.component.css'
})
export class InfoBlockComponent {

  @Input() data: InfoData | null = null;

}
