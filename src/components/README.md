# Components

## Requirements

- Must not be not connected to the store
- Must not be localized
- Is reusable independently from the app's infrastructure <sup>[WHAT?](#independence)</sup>
- Renders UI elements (other components and raw HTML)
- May render containers<sup>[WHY?](#rendercontainers)</sup>
- Has a story
- Has minimum dependencies
- May be stateful

## Writing a component

1. **Check for existing components with the same or a similar purpose**
	- First check the `components` folder
	- Also look into the `microapps` folder (there may lie  
	- If they exist, choose one of these actions:
		- Reuse them instead of creating one (*recommended* - that's why we have them!)
		- Build upon them (Compose them into a new component if they don't fit your needs)
		- Create a new one (if there's no intuitive way to fit them to your use-case)
2. **Identify different use-cases in the app**
	- Which parts of the app could also use your new component?
3. **Define the component API**
	- Think about what information has to be passed into the component to make it work
	- Consider allowing `restProps` to allow things like `data-e2e` tags (do not specify those explicitly!)
	- Decide which internal properties must not be overridden by `restProps`
	- *Remember the component will NOT have access to the store!*
4. **Create one or more [stories](#stories)**
	- Begin with one basic story that simply contains your component
	- You will use it as a sandbox in which you develop your component
	- Describe each use-case of your component in a separate story
	- *Don't throw it into the app until you have fully developed it sandboxed!*
5. **Develop the component**
	- If possible, make it a functional component
	- Keep the dependencies at a minimum
6. **Throw it into the app** *(optional)*
	- Write a [container](#containers) if necessary
	- Write tests if necessary

## Code skeletons

### Functional component *(recommended)*

```javascript
import React, { PropTypes } from 'react'

function handleClick (e) {}

export default function MyComponent ({ prop1, ...restProps }) {
  return (
    <div onClick={handleClick} {...restProps}>Hello, World</div>
  )
}

MyComponent.propTypes = {
  prop1: React.PropTypes.any,
  prop2: React.PropTypes.any
}

MyComponent.defaultProps = {
  prop1: undefined,
  prop2: undefined
}
```

### Class component

```javascript
import React, { PropTypes } from 'react'

export default class MyComponent extends React.Component {
  static propTypes = {
    prop1: PropTypes.any,
    onClick: PropTypes.func
  }

  static defaultProps = {
    prop1: undefined
  }

  handleClick = (e) => {
    const { onClick } = this.props
    onClick && onClick()
  }

  render () {
    const { prop1, ...restProps } = this.props

    return (
      <div {...restProps} onClick={this.handleClick}>Hello, World</div>
    )
  }
}
```

---

<sup id="independence">WHAT?</sup>
*A component must not rely on any aspect of the containing app. This means it must not access the app's store, it must not provide localization and it must not depend or assume any other architecture*

<sup id="rendercontainers">WHY?</sup>
*A component may render a container if the container is controlled by its props. Please refer to the [container docs]() for an example.*
