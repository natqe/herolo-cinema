import { Component, Inject } from '@angular/core'
import { MAT_DIALOG_DATA } from '@angular/material'
import { movie } from '../movie/movie.type'
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
    readonly movie: movie,
    readonly logService: LogService,
    private readonly moviesService: MoviesService, ) {
    logService.debugClass(this)
  }

  delete() {
    this.moviesService.list = [...this.moviesService.list.filter(({ Id }) => this.movie.Id !== Id)]
  }

}
