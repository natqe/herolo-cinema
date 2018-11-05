import { Injectable, isDevMode } from '@angular/core'
import { cloneDeep, keys, lowerFirst, castArray } from 'lodash'
import { ensureUnique, prefix } from 'utilizes'
import * as moment from 'moment'
import invert from 'invert-color'

@Injectable({
  providedIn: 'root'
})
export class LogService {

  private static readonly instances = new class application { }

  constructor() {

    this.debugClass(this)

    if (isDevMode()) {

      this.onTime('Init', '#e7c5ad')

      console.dir(window['application'] = LogService.instances)

      window['moment'] = moment

    }

  }

  private readonly intervals = {}

  interval(handler: (...args: any[]) => boolean, timeout?: number, ...args: any[]) {

    const handle = window.setInterval(
      (...args: any[]) => {
        try {
          if (handler(...args)) this.clearInterval(handle)
        } catch (e) {

          this.error(e)

          this.clearInterval(handle)

        }
      },
      timeout,
      ...args
    )

    this.intervals[handle] = true

    return handle

  }

  clearInterval(handle?: number) {

    clearInterval(handle)

    this.intervals[handle] = false

  }

  onTime(message: string, backgroundColor = '#fff') {

    console.debug(`%c ${message} on ${moment().format('h:mm:ss.SSS a')} :`, `background-color:${backgroundColor};color:${invert(backgroundColor)}`)

    return this

  }

  debugClass(that) {

    if (isDevMode()) LogService.instances[ensureUnique(lowerFirst(that.constructor.name), keys(LogService.instances))] = that

    return this

  }

  now(...args) {

    if (isDevMode()) {

      this.onTime('Cloned', '#00BFFF')

      args.length ? console.trace(...args.map(cloneDeep)) : console.dir(cloneDeep(LogService.instances))

    }

    return this

  }

  error(...args) {

    console[isDevMode() ? 'error' : 'trace'](`${prefix(!isDevMode() && 'Error in ', moment().format('h:mm:ss.SSS'))} :`, ...args)

    return this

  }

  debug(...args) {

    if (isDevMode()) console.trace(...args)

    return this

  }

  invoke(fn: Function, now = false) {

    if (isDevMode()) this[!now ? 'debug' : 'now'](...castArray(fn()))

    return this

  }

}