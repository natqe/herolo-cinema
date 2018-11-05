import { Component, Inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material'
import { movie } from '../movie/movie.type'
import { LogService } from '../log/log.service'
import { FormControl, Validators, FormGroup, AbstractControl } from '@angular/forms'
import { MoviesService } from '../movies/movies.service'
import { merge } from 'lodash'

@Component({
  selector: 'app-edit-movie',
  templateUrl: './edit-movie.component.html',
  styleUrls: ['./edit-movie.component.scss']
})
export class EditMovieComponent {

  private _displayErrors: boolean

  constructor(
    @Inject(MAT_DIALOG_DATA)
    readonly movie: movie,
    readonly logService: LogService,
    private readonly matDialogRef: MatDialogRef<EditMovieComponent>,
    private readonly moviesService: MoviesService) {

    logService.debugClass(this)

    // this.matDialogRef.disableClose = true

  }

  readonly form = new FormGroup({
    Title: new FormControl(this.movie.Title, [
      Validators.required,
      ({ value }) => this.moviesService.list.every(({ Title, Id }) => Title !== value || Id === this.movie.Id) ? null : { duplicate: true }
    ]),
    Genre: new FormControl(this.movie.Genre, [Validators.required]),
    Director: new FormControl(this.movie.Director, [Validators.required]),
    Runtime: new FormControl(+this.movie.Runtime.match(/\d+/)[0], [Validators.required, Validators.min(1)]),
    Year: new FormControl(this.movie.Year, [Validators.required, Validators.min(1870), Validators.max(2018)])
  })

  errorMessage(control, { key }) {
    switch (key) {
      case 'required': return `The field ${control.key} is required`
      case 'duplicate': return `The ${control.key} "${control.value.value}" already exist`
      case 'max':
      case 'min': return `${control.key} cant be ${control.value.value}`
    }
  }

  get displayErrors() {
    return this._displayErrors
  }

  typeFor(field: string) {
    switch (field) {
      case 'Runtime':
      case 'Year': return 'number'
      default: return 'text'
    }
  }

  submit() {
    if (this.form.valid) {

      let original = this.moviesService.list.find(({ Id }) => this.movie.Id === Id)

      if (!original) this.moviesService.list.push(original = <movie>{
        Id: this.movie.Id,
        Poster: this.movie.Poster
      })

      merge(original, this.form.value)

      original.Runtime = `${original.Runtime} min`

      original.Title = this.moviesService.treatTitle(original.Title)

    } else this._displayErrors = true
  }

}