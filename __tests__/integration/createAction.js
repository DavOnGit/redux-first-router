import createTest from '../../__helpers__/createTest'

createTest('add routeType_COMPLETE as type to action-like object that is missing type', {
  SECOND: {
    path: '/second',
    thunk: ({ dispatch }) => dispatch({ payload: 'foo' }),
    onComplete: function() {}
  }
})

createTest('when isAction(action) === false set to payload', {
  SECOND: {
    path: '/second',
    thunk: ({ dispatch }) => dispatch({ foo: 'bar' }),
    onComplete: function() {}
  }
})

createTest('non object argument can be payload', {
  SECOND: {
    path: '/second',
    thunk: ({ dispatch }) => dispatch('foo'),
    onComplete: function() {}
  }
})

createTest('null payloads allowed', {
  SECOND: {
    path: '/second',
    thunk: ({ dispatch }) => dispatch(null),
    onComplete: function() {}
  }
})


createTest('arg as type', {
  SECOND: {
    path: '/second',
    thunk: ({ dispatch }) => dispatch('FOO_BAR'),
    onComplete: function() {}
  }
})

createTest('arg as @@library type', {
  SECOND: {
    path: '/second',
    thunk: ({ dispatch }) => dispatch('@@library/FOO_BAR'),
    onComplete: function() {}
  }
})

createTest('arg as type from route', {
  SECOND: {
    path: '/second',
    thunk: ({ dispatch }) => dispatch('FIRST'),
    onComplete: function() {}
  }
})
