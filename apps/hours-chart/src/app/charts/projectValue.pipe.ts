import { Pipe, PipeTransform } from '@angular/core'
import { Duration } from 'luxon'

@Pipe({
  name: 'projectValue',
  pure: false,
})
export class ProjectValuePipe implements PipeTransform {
  transform(
    projects: { id?: string | number; value: number }[],
    projectId: string | number
  ) {
    return projects.find((project) => project.id === projectId)?.value
  }
}
