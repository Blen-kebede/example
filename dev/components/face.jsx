import React from "react"
import ReactDOM from "react-dom"
import config from "../config.json"

export default class Face extends React.Component {

  getRotation(){
    return (360 / config.FACES_PER_RING) * this.props.index
  }

  render() {
    let { value, won } = this.props
    
    let transform = 'rotateX(' + this.getRotation() + 'deg) translateZ(' + 20 + 'vh)'// config.RING_RADIUS + 'px)'
    
    return <div className={"face " + (won ? "won" : "") + " bg" + value}
             style={{ transform }} />
  }
}