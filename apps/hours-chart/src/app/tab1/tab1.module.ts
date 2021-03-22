import { IonicModule } from '@ionic/angular'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Tab1Page } from './tab1.page'
import { Tab1PageRoutingModule } from './tab1-routing.module'
import { ChartsModule } from '../charts/charts.module'

@NgModule({
  imports: [IonicModule, CommonModule, Tab1PageRoutingModule, ChartsModule],
  declarations: [Tab1Page],
})
export class Tab1PageModule {}
