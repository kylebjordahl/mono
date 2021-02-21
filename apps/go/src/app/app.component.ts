import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { merge, timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { GoService } from './services/go/go.service';

@Component({
  selector: 'kylebjordahl-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  user$: GoService['user$'];
  constructor(public go: GoService, private change: ChangeDetectorRef) {
    //
  }

  ngOnInit() {
    this.user$ = this.go.user$;
    this.user$.subscribe(() => this.change.detectChanges());
  }
}
