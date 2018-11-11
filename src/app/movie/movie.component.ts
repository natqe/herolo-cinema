import { Component, Input } from '@angular/core'
import { IMovie } from './movie.model'
import { LogService } from '../log/log.service'
import { MatDialog } from '@angular/material'
import { EditMovieComponent } from '../edit-movie/edit-movie.component'
import { DeleteMovieComponent } from '../delete-movie/delete-movie.component'

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss']
})
export class MovieComponent implements IMovie {

  @Input()
  Title: string

  @Input()
  Director: string

  @Input()
  Genre: string

  @Input()
  Id: string

  @Input()
  Poster: string

  @Input()
  Runtime: string

  @Input()
  Year: string

  constructor(
    readonly logService: LogService,
    private readonly matDialog: MatDialog) {
    logService.debugClass(this)
  }

  private openDialog(component) {
    this.matDialog.open(component, {
      data: this
    })
  }

  edit() {
    this.openDialog(EditMovieComponent)
  }

  delete() {
    this.openDialog(DeleteMovieComponent)
  }

}
