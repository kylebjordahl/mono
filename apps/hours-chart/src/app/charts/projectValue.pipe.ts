import { Pipe, PipeTransform } from '@angular/core'
import { Duration } from 'luxon'

@Pipe({
  name: 'projectValue',
  pure: false,
})
export class ProjectValuePipe implements PipeTransform {
  transform(projects: { id: string; value: number }[], projectId: string) {
    return projects.find(({ id }) => id === projectId)?.value
  }
}
