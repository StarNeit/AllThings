# Microapps

## Requirements

- Is only accessible to logged in users
- Is composed of [containers]() and [components]()
- Is located in its own folder
- Usually renders an `App`, a `TitleBar` and a `Content` component<sup>[WHY?](#frame)
- May be connected to the app's store

## Writing a microapp

1. **Define a unique microapp name**
2. **Search for matching components to use in the microapp**
  - If you miss components, [develop them]()
3. **Identify which parts of the store are required**
  - If you need to extend the store, define appropriate [actions]() and [reducers]()
4. **Develop the containers**
5. **Write actions and reducers**
  - Create a new file named after the microapp in both the `actions` and `reducers` folder
  - Export those files in the corresponding `index.js` files
  - Look into the [store]() documentation for more detailed explainations
6. **Plug everything together**
7. **Write an `index.js`**
8. **Write E2E-tests**

## Code skeletons

### `index.js`

```javascript
export Component1 from './Component1'
export Component2 from './Component2'
export Container1 from './Container1'

export const MICROAPP_NAME = 'project'
```

- **Lines 1-4** Export all components and containers the microapp defines for itself
- **Line 6** Export the microapp's name

### The microapp itself

```javascript
import React from 'react'
import { connect } from 'react-redux'
import { AppTitle } from 'containers/App'
import {
  TitleBarLabel
} from 'components/TitleBar'
import {
  App,
  Content,
  TitleBar
} from 'components/DOM/Layout/Full'

class MyMicroapp extends React.Component {
  static propTypes = {
    config: React.PropTypes.object.isRequired
  }

  render () {
    const { config } = this.props
    const { name } = config._embedded.type

    return (
      <Microapp>
        <TitleBar color={config.color}>
          <TitleBarLabel microAppType={name}>
            <Localized messages={config.label}/>
          </TitleBarLabel>
        </TitleBar>
        <AppTitle>{name}</AppTitle>
        <SimpleLayout></SimpleLayout>
      </Microapp>
    )
  }
}

export default connect()(MyMicroapp)
```

---

<sup id="frame">WHY?</sup>
Usually a microapp integrates itself into the look and feel of the rest of the app. That is, it provides the typical UI elements such as a titlebar that either holds the name of the microapp or some buttons. It also respects the typical styling, including paddings and margins of the content to the app's frame. Many of these conventions can be implemented simply by building the microapp with the provided components `App`, `TitleBar` and `Content`.
