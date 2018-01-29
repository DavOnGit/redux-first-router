// @flow
import { compileUrl } from './index'
import type {
  Route,
  Payload,
  Params,
  RoutesMap,
  ReceivedAction as Action,
  Options
} from '../flow-types'

export default (
  action: Action,
  routes: RoutesMap,
  options: Options
): string => {
  const { type, params: p, query, hash } = action
  const route = routes[type]
  const path = typeof route === 'object' ? route.path : route
  const params = transformParams(route, p)

  if (typeof path !== 'string') throw new Error('[rudy] invalid route path')

  return compileUrl(path, params, query, hash, route) || '/'
}

const transformParams = (route: Route, params: Payload = {}): Params =>
  Object.keys(params).reduce((sluggifedParams, key) => {
    sluggifedParams[key] = transformSegment(params[key], route, key)
    return sluggifedParams
  }, {})

const transformSegment = (segment: string, route: Route, key: string): string => {
  if (typeof route.toPath === 'function') {
    return route.toPath(segment, key)
  }
  else if (typeof segment === 'string') {
    if (segment.indexOf('/') > -1) { // support a parameter that for example is a file path with slashes (like on github)
      return segment.split('/').map(encodeURIComponent) // path-to-regexp supports arrays for this use case
    }

    if (route.capitalizedWords === true) {
      return segment.replace(/ /g, '-').toLowerCase()
    }

    return encodeURIComponent(String(segment))
  }
  else if (typeof segment === 'number') {
    return String(segment)
  }

  return encodeURIComponent(String(segment))
}
