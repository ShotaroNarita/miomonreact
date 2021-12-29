import React from 'react'
import './App.css'
import Chess from './Chess'

class App extends React.Component {

  constructor(prop: {}) {
    super(prop)
    // this.move = this.move.bind(this)
  }


  render() {
    return (
      <div>
        <Chess></Chess>
      </div>
    )
  }
}

export default App
