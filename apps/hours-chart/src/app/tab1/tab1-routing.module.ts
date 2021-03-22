import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { Tab1Page } from './tab1.page'
import { NgxChartsModule } from '@swimlane/ngx-charts'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

const routes: Routes = [
  {
    path: '',
    component: Tab1Page,
  },
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HttpClientModule,
    NgxChartsModule,
    FormsModule,
  ],
  exports: [RouterModule],
})
export class Tab1PageRoutingModule {}
