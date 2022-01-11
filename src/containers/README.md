# Container

## Requirements

- Is connected to the app's store
- Renders only [components](#components), no HTML
- Is deeply integrated into the app's architecture
- Must not have an own visual representation<sup>[WHY?](#novisual)</sup>
- Must not provide styling
- May be stateful

## Writing a container

1. **Identify needed parts of the store**
  - Examine which component props need to be provided
  - Identify the corresponding parts of the store
  - *Keep the extracted parts at a minimum*
2. **Develop the container**
  - Only render components
  - Don't style anything - use components for this!
  - Write tests if necessary

## Code skeletons

### Simple state to props mapping

```javascript
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import MyComponent from 'components/MyComponent'

class MyContainer extends React.Component {
  static propTypes = {
    prop1: PropTypes.any.isRequired
  }

  render () {
    return <MyComponent prop1={this.props.prop1} />
  }
}

export default connect((state, props) => {
	return {
		prop1: state.aFieldINeedInMyComponent
	}
})(MyContainer)
```

### Prop-controlled state mapping

Sometimes you need to dynamically read a part of the state based on a prop in your container.
Imagine the following store:

```json
{
  "posts": {
    "1": {
      "author": "Steve",
      "content": "Hi all!"
    },
    "2": {
      "author": "Luigi",
      "content": "Buon giorno!"
    },
    "3": {
      "author": "Mustafa",
      "content": "Meraba!"
    }
  }
}
```

You want to render one specific post, so you write a container that reads the desired post from the state and passes it into a component that renders it to the screen. The easiest way to control which post should be displayed is by passing a prop with the post's ID into your container.

```javascript
class SinglePostContainer extends React.Component {
  static propTypes = {
    postId: PropTypes.string.isRequired
  }
}
```

Now you can use this prop in the `connect` part to retrieve the post with the given ID from the store:

```javascript
export default connect((state, props) => {
	return {
		post: state.posts[props.postId]
	}
})(SinglePostContainer)
```

That way you map the post from the store onto a prop `post` you can now use in your container:

```javascript
class SinglePostContainer extends React.Component {
  static propTypes = {
    postId: PropTypes.string.isRequired,
    post: PropTypes.string.isRequired
  }

  render () {
    return <SinglePostComponent post={this.props.post} />
  }
}
```

---

<sup id="novisual">WHY?</sup>
*A container is a link between the app and a component. Not more, not less. While the component is app-agnostic, the container is style-agnostic. It does not bother with how the data it retrieves from the store is displayed or styled. It just makes sure the data is available to its children.*
