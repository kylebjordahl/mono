import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HoursGaugeComponent } from './hours-gauge/hours-gauge.component'
import { NgxChartsModule } from '@swimlane/ngx-charts'
import { HoursPipe } from './hours.pipe'
import { ProjectValuePipe } from './projectValue.pipe'

@NgModule({
  declarations: [HoursGaugeComponent, HoursPipe, ProjectValuePipe],
  imports: [CommonModule, NgxChartsModule],
  exports: [HoursGaugeComponent, HoursPipe, ProjectValuePipe],
})
export class ChartsModule {}
