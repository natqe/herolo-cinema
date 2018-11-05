import { Component } from '@angular/core'
import { MoviesService } from './movies.service'
import { LogService } from '../log/log.service'
import { movie } from '../movie/movie.type';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent {

  constructor(
    readonly logService: LogService,
    private readonly moviesService: MoviesService) {
    logService.debugClass(this)
  }

  get list() {
    return this.moviesService.list
  }

  uniqProp({ }, { Id }: movie) {
    return Id
  }

}
