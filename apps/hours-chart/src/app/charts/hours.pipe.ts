import { Pipe, PipeTransform } from '@angular/core'
import { Duration } from 'luxon'

@Pipe({
  name: 'hours',
  pure: true,
})
export class HoursPipe implements PipeTransform {
  transform(value: number) {
    return Duration.fromObject({ hours: value }).toFormat('h:mm:ss')
  }
}
