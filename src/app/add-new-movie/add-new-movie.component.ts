import { Component } from '@angular/core'
import { LogService } from '../log/log.service'
import { MatDialog } from '@angular/material'
import { EditMovieComponent } from '../edit-movie/edit-movie.component'
import { movie } from '../movie/movie.type'
import { generate } from 'shortid'

@Component({
  selector: 'app-add-new-movie',
  templateUrl: './add-new-movie.component.html',
  styleUrls: ['./add-new-movie.component.scss']
})
export class AddNewMovieComponent {

  constructor(
    readonly logService: LogService,
    private readonly matDialog: MatDialog) { }

  click() {
    this.matDialog.open(EditMovieComponent, {
      data: <movie>{
        Director: '',
        Genre: '',
        Id: generate(),
        Poster: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=b773010ee7ba32be1b3679fc010be23c&auto=format&fit=crop&w=634&q=80',
        Runtime: '0 min',
        Title: '',
        Year: ''
      }
    })
  }

}
