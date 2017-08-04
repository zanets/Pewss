import React from 'react'
import Timeline from './Timeline.jsx'

class RTimeline extends React.Component {
  constructor (props) {
    super(props)
    this.state = props
  }

  componentDidMount () {
    this.graph = new Timeline(this.refs.container)
    this.graph.render(this.state.data)
  }

  render () {
    return (
      <div style={{'width': '100%', 'margin': '10px'}} ref='container' />
    )
  }
}
export default RTimeline
