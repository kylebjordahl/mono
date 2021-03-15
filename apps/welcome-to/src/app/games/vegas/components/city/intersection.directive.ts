import { Directive, Input } from '@angular/core'

@Directive({
  selector: 'intersection',
})
export class IntersectionDirective {
  @Input() intersection: boolean
}
