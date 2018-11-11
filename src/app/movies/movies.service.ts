import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { LogService } from '../log/log.service'
import { forkJoin } from 'rxjs'
import { random, times, padStart, deburr, startCase, cloneDeep, remove, find, merge } from 'lodash'
import { generate } from 'shortid'
import { IMovie } from '../movie/movie.model'


@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  constructor(
    readonly logService: LogService,
    private readonly httpClient: HttpClient) {

    logService.debugClass(this)

    this.fetchMovies()

  }

  private readonly _list: IMovie[] = []

  get list() {
    return cloneDeep(this._list)
  }

  private fetchMovies(apikeyIndex = 0) {
    forkJoin(
      times(100, () => this.httpClient.get(environment.OMDB_API_ORIGIN, {
        params: {
          apikey: environment.OMDB_API_KEYS[apikeyIndex],
          i: `tt${padStart(random(1, 1000000, false).toString(), 7, '0')}`
        }
      }))
    ).subscribe({
      next: value => this._list.push(...value.
        filter(({ Type, Poster, Runtime, Director, Title, Year, Genre }: IMovie & { Type: string }) =>
          Type === 'movie' &&
          Poster.startsWith('http') &&
          Title !== 'N/A' &&
          Runtime !== 'N/A' &&
          Genre !== 'N/A' &&
          Year !== 'N/A' &&
          Director !== 'N/A').
        map(({ Title, Runtime, Genre, Year, Director, Poster }: IMovie) => (<IMovie>{
          Runtime, Genre, Year, Director, Poster,
          Title: this.treatTitle(Title),
          Id: generate()
        }))),
      error: e => environment.OMDB_API_KEYS[++apikeyIndex] ? this.fetchMovies(apikeyIndex) : this.logService.error(e)
    })
  }

  private treatTitle(value: string) {
    if (typeof value === 'string' && value) return startCase(deburr(value).toLowerCase()).replace(/[^\w\s]/g, '')
  }

  upsert(item: Partial<IMovie>) {

    if (item.Title) item.Title = this.treatTitle(item.Title)

    const original = find(this._list, { Id: item.Id }) //safety  

    original ? merge(original, item) : this._list.push(<IMovie>item)

  }

  remove(Id: IMovie['Id']) {
    remove(this._list, { Id })
  }

}
