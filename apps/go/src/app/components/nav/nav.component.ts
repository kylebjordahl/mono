import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'go-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  @Input() userName: string;
  @Output() onLogout = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}
}
