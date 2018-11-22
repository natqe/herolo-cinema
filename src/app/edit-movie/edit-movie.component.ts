import { Component, Inject } from '@angular/core'
import { MAT_DIALOG_DATA } from '@angular/material'
import { MovieModel } from '../movie/movie.model'
import { LogService } from '../log/log.service'
import { FormControl, Validators, FormGroup, ValidationErrors } from '@angular/forms'
import { get } from 'lodash'
import { Emitter, Emittable } from '@ngxs-labs/emitter'
import { MoviesState } from '../movies/movies.state'
import { Select } from '@ngxs/store'
import { Observable } from 'rxjs'

@Component({
  selector: 'app-edit-movie',
  templateUrl: './edit-movie.component.html',
  styleUrls: ['./edit-movie.component.scss']
})
export class EditMovieComponent {

  @Select(MoviesState.items)
  movies: Observable<ReturnType<typeof MoviesState.items>>

  @Emitter(MoviesState.upsert)
  upsert: Emittable<Array<Partial<MovieModel> & { Id: MovieModel['Id'] }>>

  constructor(
    @Inject(MAT_DIALOG_DATA)
    readonly movie: MovieModel,
    readonly logService: LogService) {
    logService.debugClass(this)
  }

  readonly form = new FormGroup({
    Title: new FormControl(this.movie.Title, [
      Validators.required,
      ({ value }) => {

        let validationErrors: ValidationErrors

        this.movies.
          subscribe(movies => {
            if (movies.some(({ Title, Id }) => Title === value.trim() && Id !== this.movie.Id)) validationErrors = { duplicate: true }
          }).
          unsubscribe()

        return validationErrors

      }
    ]),
    Genre: new FormControl(this.movie.Genre, [Validators.required]),
    Director: new FormControl(this.movie.Director, [Validators.required]),
    Runtime: new FormControl(+get(this.movie.Runtime.match(/\d+/), '0') || undefined, [Validators.required, Validators.min(1)]),
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

  typeFor(field: string) {
    switch (field) {
      case 'Runtime':
      case 'Year': return 'number'
      default: return 'text'
    }
  }

  submit() {
    if (this.form.valid) this.upsert.emit([{
      ...this.form.value,
      Id: this.movie.Id,
      Poster: this.movie.Poster,
      Runtime: `${this.form.value.Runtime} min`
    }])
  }

}
