import { Component, Inject } from '@angular/core'
import { MAT_DIALOG_DATA } from '@angular/material'
import { IMovie } from '../movie/movie.model'
import { LogService } from '../log/log.service'
import { MoviesService } from '../movies/movies.service'

@Component({
  selector: 'app-delete-movie',
  templateUrl: './delete-movie.component.html',
  styleUrls: ['./delete-movie.component.scss']
})
export class DeleteMovieComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA)
    readonly movie: IMovie,
    readonly logService: LogService,
    private readonly moviesService: MoviesService) {
    logService.debugClass(this)
  }

  delete() {
    this.moviesService.remove(this.movie.Id)
  }

}
