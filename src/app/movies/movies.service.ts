import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { LogService } from '../log/log.service'
import { forkJoin } from 'rxjs'
import { random, times, padStart, deburr, startCase } from 'lodash'
import { generate } from 'shortid'
import { movie } from '../movie/movie.type'


@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  constructor(
    readonly logService: LogService,
    private readonly httpClient: HttpClient) {

    logService.debugClass(this)

    this.fetchMovies(0)

  }

  list: movie[] = []

  private fetchMovies(apikeyIndex: number) {
    forkJoin(
      times(100, () => this.httpClient.get(environment.OMDB_API_ORIGIN, {
        params: {
          apikey: environment.OMDB_API_KEYS[apikeyIndex],
          i: `tt${padStart(random(1, 1000000, false).toString(), 7, '0')}`
        }
      }))
    ).subscribe({
      next: value => this.list = value.
        filter(({ Type, Poster, Runtime, Director, Title, Year, Genre }: movie & { Type: string }) =>
          Type === 'movie' &&
          Poster.startsWith('http') &&
          Title !== 'N/A' &&
          Runtime !== 'N/A' &&
          Genre !== 'N/A' &&
          Year !== 'N/A' &&
          Director !== 'N/A').
        map(({ Title, Runtime, Genre, Year, Director, Poster }: movie) => (<movie>{
          Runtime, Genre, Year, Director, Poster, 
          Title: this.treatTitle(Title),
          Id: generate()
        })),
      error: e => environment.OMDB_API_KEYS[++apikeyIndex] ? this.fetchMovies(apikeyIndex) : this.logService.error(e)
    })
  }

  treatTitle(value: string) {
    if (typeof value === 'string' && value) return startCase(deburr(value).toLowerCase()).replace(/[^\w\s]/g, '')
  }

}
