import { Component, Inject } from '@angular/core'
import { MAT_DIALOG_DATA } from '@angular/material'
import { MovieModel } from '../movie/movie.model'
import { LogService } from '../log/log.service'
import { Emitter, Emittable } from '@ngxs-labs/emitter'
import { MoviesState } from '../movies/movies.state'

@Component({
  selector: 'app-delete-movie',
  templateUrl: './delete-movie.component.html',
  styleUrls: ['./delete-movie.component.scss']
})
export class DeleteMovieComponent {

  @Emitter(MoviesState.remove)
  delete: Emittable<MovieModel['Id'][]>

  constructor(
    @Inject(MAT_DIALOG_DATA)
    readonly movie: MovieModel,
    readonly logService: LogService) {
    logService.debugClass(this)
  }

}
