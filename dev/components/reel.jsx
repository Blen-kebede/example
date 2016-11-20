import React from "react"
import ReactDOM from "react-dom"
import Face from "./face"
import config from "../config.json"

const defaultAnimationStuff = { animationDuration: '5.5s', animationIterationCount: '1', animationFillMode: 'forwards', animationTimingFunction: 'cubic-bezier(.32,.19,0,1)' }


export default class Reels extends React.Component {
  componentDidMount(){
    this.setState({ lastRoll: 0, timeRun: 0, style: {}, rotationStyle: '' })
  }
  
  componentDidUpdate(prevProps, prevState){
    if (this.props.spinNum  != prevProps.spinNum)
      this.makeRoll()
  }
  
  getRotation(num){
    return (360 / config.FACES_PER_RING) * num
  }
  
  makeRoll(){
    let { timeRun, lastRoll } = this.state
    let { roll, id } = this.props
    let self = this

    var cssStr = []

    var num = Number(roll) || 0
    let newRoll = num = (0 - this.getRotation(num))
    num -= (5 * 360)

    cssStr.push('@keyframes ringAnimation' + id + '_' + timeRun + ' { 0% { transform: rotateX(' + lastRoll + 'deg); } 100% { transform: rotateX(' + num + 'deg) }}')
    
    window.setTimeout(() => {
      self.setState({ style: { ...defaultAnimationStuff, animationName: ('ringAnimation' + id + '_' + (timeRun - 1)), animationDuration: (5 + (Math.random() * 0.9)) +'s'} })
    }, (Math.random() * 100))
    
    timeRun++
    
    this.setState({ timeRun, lastRoll: newRoll, rotationStyle: cssStr.join(''), style: { transform: 'rotateX(' + lastRoll + 'deg)' } })
  }
  
  render(){
    if(!this.state)
      return <div/>
      
    let { id, won } = this.props
    
    var faces = [];
    for (var i = 0; i < config.FACES_PER_RING; i++) {
        faces.push(<Face index={i} key={i} value={config.REEL_SETUP[id][i]} won={won[i]}/>);
    }
    
    return <div className="ring" style={ this.state.style }>
      <style dangerouslySetInnerHTML={{ __html: this.state.rotationStyle }}/>
      { faces }
    </div>
  }
}