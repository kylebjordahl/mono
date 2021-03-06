import { Component, OnInit } from '@angular/core';
import { Lot } from '../../state/properties/properties.models';

@Component({
  selector: 'vegas-block',
  templateUrl: './vegas-block.component.html',
  styleUrls: ['./vegas-block.component.scss']
})
export class VegasBlockComponent implements OnInit {
  lot: Lot

  constructor() { }

  ngOnInit(): void {
  }

}
