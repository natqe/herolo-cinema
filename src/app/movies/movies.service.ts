import { Injectable } from '@angular/core'
import { Http } from '@angular/http'
import { environment } from '../../environments/environment'
import { LogService } from '../log/log.service'
import { forkJoin } from 'rxjs'
import { map } from 'rxjs/operators'
import { random, times, padStart, deburr, startCase } from 'lodash'
import { generate } from 'shortid'
import { movie } from '../movie/movie.type'


@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  list: movie[]

  constructor(logService: LogService, http: Http) {

    logService.debugClass(this)

    forkJoin(
      times(100, () => 'tt' + padStart(random(1, 1000000, false).toString(), 7, '0')).map(i => http.get(environment.OMDB_API_ORIGIN, {
        params: {
          i,
          apikey: environment.OMDB_API_KEY
        }
      }).pipe(map(res => res.json())))
    ).subscribe({
      next: value => this.list = value.
        filter(({ Type, Poster, Runtime, Director, Title, Year, Genre }) =>
          Type === 'movie' &&
          Poster.startsWith('http') &&
          Title !== 'N/A' &&
          Runtime !== 'N/A' &&
          Genre !== 'N/A' &&
          Year !== 'N/A' &&
          Director !== 'N/A').
        map(({ Title, Runtime, Genre, Year, Director, Poster }) => (<movie>{
          Runtime, Genre, Year, Director, Poster,
          Title: this.treatTitle(Title),
          Id: generate()
        })),
      error: logService.error
    })

  }

  treatTitle(value: string) {
    if (typeof value === 'string' && value) return startCase(deburr(value).toLowerCase()).replace(/[^\w\s]/g, '')
  }

}
