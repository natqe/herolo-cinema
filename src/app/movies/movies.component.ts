import { Component } from '@angular/core'
import { LogService } from '../log/log.service'
import { MovieModel } from '../movie/movie.model'
import { Observable } from 'rxjs'
import { Select } from '@ngxs/store'
import { MoviesState } from './movies.state'

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent {

  @Select(MoviesState.items)
  movies: Observable<ReturnType<typeof MoviesState.items>>

  @Select(MoviesState.inLoadProcess)
  loading: Observable<ReturnType<typeof MoviesState.inLoadProcess>>

  constructor(readonly logService: LogService) {
    logService.debugClass(this)
  }

  uniqProp({ }, { Id }: MovieModel) {
    return Id
  }

}
