export default (name = 'load') => (api) => async (req, next) => {
  const load = req.route && req.route[name]
console.log('CSAPI',api)
  if (load) { // if `route.load` does not exist short-circuit
    const parts = await load(req)
    addPartsToRuntime(req, parts)
  }

  return next()
}

const addPartsToRuntime = (req, parts) => {
  const { route, action, options, tmp, ctx, commitDispatch } = req
  const { components, reducers, chunk, ...rest } = parts
  console.log('REQ', req);
  if (ctx.chunks.includes(chunk)) return // chunk was already added to runtime, so short-circuit

  if (reducers && window.store) {
  }

  if (components) {
    action.components = components // we need to modify `createReducer` to store `state.location.components` so after load they can be dynamically rendered within existing components!
  }

  if (tmp.committed && (components || reducers)) { // if the route change action has already been dispatched, we need to re-dispatch it again, so the new goodies are received
    action.force = true // we need a flag to force this action through, so component are added to state or new reducers receive action -- the `force` flag doesn't already exist, it's a placeholder for something we can already use to force the action passed the `isDoubleDispatch` check; we may have some other piece of infrastructure that precludes needing to create a new custom flag
    commitDispatch(action)
  }

  Object.assign(route, rest) // rest allows you to tack on additional thunks, sagas, etc, to your route object (optionally) -- i.e. you can build the "plane" (aka route) while flying
  ctx.chunks.push(chunk)
}
