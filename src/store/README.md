# Store

- Contains the global app state
- Is only modified by [reducers](#reducers), which are in turn triggered by [actions](#actions) that are dispatched by [containers]()
- Is immutable<sup>[WHAT?]()</sup>

## Actions

- Initiate a change of the store
- Are triggered by [containers]()
- Invoke a reducer
- May dispatch other actions
- May query the API
- Must not directly alter the store


### Dispatch an action

- Import the action
- Declare the `dispatch` prop in the container's `propTypes`
- Use the injected `dispatch` prop in a method

```javascript
// container source file
import MyAction from 'actions/myMicroappActions'

// ...
myFunc = () => {
  this.props.dispatch(MyAction('some value'))
}
// ...
```

### Code skeletons

#### Action file

One action file is created per microapp and contains related actions.
The basic code for a new action file looks like the following snippet:

```javascript
import fetch from 'cross-fetch'
import createActions from 'store/createActions'

export default createActions({
  // insert actions here
})
```

#### Simple action

Insert a new function into the object passed to `createActions()`

```javascript
myAction (arg1) {
  if (arg1) {
    return { status: 'ok', payload: { stateField: 'new value' } }
  } else {
    return { status: 'error' }
  }
}
```

- The function's name is the action's name
- The action takes one argument `arg1` (see [dispatcher]())
- It triggers the reducer based on `args1`'s value
- It returns an object that will be passed into the reducer
  - `status`: A string representation of the status (`ok` or `error`)
  - `payload`: An object that will be merged into the store
  - At least one of `status` or `payload` must be given

#### Action with API access

```javascript
myAPIAction (arg1) {
  return async (dispatch, api) {
    try {
      const resourceValue = await fetch('url/to/resource')
      const apiResourceValue = await api({
        path: 'path/to/resource',
        clientID: 'myclientId'
      })
      dispatch({ status: 'ok', payload: { stateField: 'new value' } })
    } catch (e) {
      dispatch({ status: 'error' })
    }
  }
}
```

**TODO: When to use dispatch and when return**

## Reducers

- Update the store by replacing it with a modified copy
- Must not disptach other actions
- Must not trigger other reducers

### Create a reducer



## Internals

###
