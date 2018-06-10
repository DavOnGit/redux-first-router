export default (state = 'HOME', action = {}) => {
  if (action.components) {
    Object.assign(components, {[action.type]: action.components})
    // return action.components[action.params.page]
  }
  console.log(components);
  return components[action.type] || state
}

const components = {
  HOME: 'Home',
  LIST: 'List',
  NOT_FOUND: 'NotFound'
}

// NOTES: this is the primary reducer demonstrating how RFR replaces the need
// for React Router's <Route /> component.
//
// ALSO:  Forget a switch, use a hash table for perf.
