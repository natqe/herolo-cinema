import { Component } from '@angular/core'
import { LogService } from './log/log.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'herolo-cinema'

  constructor(
    readonly logService: LogService) {
    logService.debugClass(this)
  }

}
