import React from 'react'
import network from './Network.jsx'

class RDag extends React.Component {
  constructor (props) {
    super(props)
    this.state = props
  }
  componentDidMount () {
    this.graph = new network(this.refs.container)
    this.graph.render(this.state.data)
  }
  render () {
    return (
      <div style={{'width': '100%', 'height': '600px', 'margin': '10px'}} ref='container' />
    )
  }
}

export default RDag
