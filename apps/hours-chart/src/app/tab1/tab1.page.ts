import { Component, OnInit } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { DateTime, Duration, Interval } from 'luxon'
import { delay, map, switchMap, tap } from 'rxjs/operators'
import * as R from 'ramda'
import { interval, merge, of } from 'rxjs'
import { TogglService } from '../services/toggl.service'
@Component({
  selector: 'kylebjordahl-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {}
