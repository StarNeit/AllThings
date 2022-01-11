import React from 'react'
import ReactDOMServer from 'react-dom/server'

interface IProps {
  details?: object
}

class ServiceMail extends React.PureComponent<IProps> {
  detailToString = (value: any) => {
    if (Array.isArray(value)) {
      return value.join(', ')
    } else {
      return value
    }
  }

  render() {
    const { details } = this.props
    return (
      <div>
        {Object.keys(details).map(name => (
          <div key={name}>
            {name}: {this.detailToString(details[name])}
            <br />
          </div>
        ))}
      </div>
    )
  }
}

export default (details: object) =>
  ReactDOMServer.renderToStaticMarkup(<ServiceMail details={details} />)
