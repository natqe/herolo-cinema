import { State, Selector, StateContext, NgxsOnInit } from '@ngxs/store'
import { MovieModel } from '../movie/movie.model'
import { startCase, deburr, defaultsDeep, times, padStart, random, findIndex } from 'lodash'
import { Receiver, EmitterAction } from '@ngxs-labs/emitter'
import { HttpClient } from '@angular/common/http'
import { forkJoin } from 'rxjs'
import { environment } from '../../environments/environment'
import { generate } from 'shortid'
import { LogService } from '../log/log.service'
import { doDeclare } from 'utilizes'

const defaults = {
  loading: true,
  movies: <MovieModel[]>[]
}

@State<(typeof defaults)>({
  defaults,
  name: 'movies'
})
export class MoviesState implements NgxsOnInit {

  private static treatTitle(value: string) {
    return typeof value === 'string' ? startCase(deburr(value).toLowerCase()).replace(/[^\w\s]/g, '') : value
  }

  @Selector()
  static items({ movies }: typeof defaults) {
    return movies
  }

  @Selector()
  static inLoadProcess({ loading }: typeof defaults) {
    return loading
  }

  @Receiver({ type: '[MOVIES] Upsert' })
  static upsert({ getState, patchState }: StateContext<typeof defaults>, { payload }: EmitterAction<Array<Partial<MovieModel> & { Id: MovieModel['Id'] }>>) {

    const movies = [...getState().movies]

    for (const item of payload) {

      const originalIndex = findIndex(movies, { Id: item.Id })

      item.Title = this.treatTitle(item.Title)

      originalIndex !== -1 ? movies[originalIndex] = defaultsDeep(item, movies[originalIndex]) : movies.push(<MovieModel>item)
      
    }

    patchState({ movies })

  }

  @Receiver({ type: '[MOVIES] Remove' })
  static remove({ getState, patchState }: StateContext<typeof defaults>, { payload }: EmitterAction<MovieModel['Id'][]>) {
    patchState({
      movies: getState().movies.filter(({ Id }) => !payload.includes(Id))
    })
  }

  constructor(
    private readonly logService: LogService,
    private readonly httpClient: HttpClient) {
    logService.debugClass(this)
  }

  ngxsOnInit({ patchState }: StateContext<typeof defaults>) {
    const fetchData = doDeclare((apikeyIndex = 0) => forkJoin(
      times(100, () => this.httpClient.get<MovieModel>(environment.OMDB_API_ORIGIN, {
        params: {
          apikey: environment.OMDB_API_KEYS[apikeyIndex],
          i: `tt${padStart(random(1, 1000000, false).toString(), 7, '0')}`
        }
      }))
    ).subscribe({
      next: value => patchState({
        loading: false,
        movies: value.
          filter(({ Type, Poster, Runtime, Director, Title, Year, Genre }: MovieModel & { Type: string }) =>
            Type === 'movie' &&
            Poster.startsWith('http') &&
            Title !== 'N/A' &&
            Runtime !== 'N/A' &&
            Genre !== 'N/A' &&
            Year !== 'N/A' &&
            Director !== 'N/A').
          map(({ Title, Runtime, Genre, Year, Director, Poster }) => (<MovieModel>{
            Runtime, Genre, Year, Director, Poster,
            Title: MoviesState.treatTitle(Title),
            Id: generate()
          }))
      }),
      error: e => environment.OMDB_API_KEYS[++apikeyIndex] ? fetchData(apikeyIndex) : this.logService.error(e)
    }))
  }

}