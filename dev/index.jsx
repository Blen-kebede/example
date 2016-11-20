import React from "react"
import ReactDOM from "react-dom"
import { autobind } from "core-decorators"
import Reel from "./components/reel"
import config from "./config.json"
require("./style.css")
require('file?name=[name].[ext]!./index.html')
let spinFile = require('file?name=[name].[ext]!./assets/spin.mp3')
let wonFile = require('file?name=[name].[ext]!./assets/won.mp3')

var spinSound = new Audio(spinFile)
var wonSound = new Audio(wonFile)

class Main extends React.Component {
  constructor(props) {
    super(props)
  }
  
  componentDidMount(){
    this.setState({ r1:0, r2:0, r3:0, r4:0, spinNum:0, wonReels: {}, credits:1000, bet: 1 })
  }
  
  @autobind
  changeBet(){
    if (this.state.cantSpin)
      return
      
    let { bet } = this.state
    
    bet += 1
    
    if (bet > 5)
      bet = 1
      
    this.setState({ bet })
  }
  
  @autobind
  betMax(){
    if (this.state.cantSpin)
      return
      
    this.setState({ bet: 5 })
  }
  
  checkWinning(newState){
    let i = 5
    let obj = {}
    this.setState({ wonReels: {} })
    
    while (--i) {
      let wonKey = config.REEL_SETUP[i][newState["r" + i]]
      if (!obj[wonKey])
          obj[wonKey] = []
          
      obj[wonKey].push(i)
    }
    let keys = Object.keys(obj)
    
    if (keys.length != 4) {
      let self = this
      setTimeout(() => {
        wonSound.play()
        
        let wonReels = {}
        let { credits } = newState
        
        keys.forEach(k => {
          if (obj[k].length > 1)
            obj[k].forEach(m => {
              credits += newState.bet
              if(!wonReels[m])
                wonReels[m] = {}
                
              wonReels[m][newState["r" + m]] = true 
            })
        })
        
        self.setState({ won: true, wonReels, credits })
        
        setTimeout(() => self.setState({ won: false }), 2000)
      }, 6000)
    }
  }
  
  @autobind
  onSpin(e){
    if (this.state.cantSpin)
      return
      
    spinSound.currentTime = 0
    spinSound.play()
      
    let { spinNum, credits, bet } = this.state
    spinNum++
    credits -= bet
    
    let newState = { 
      r1: this.getRandom(),
      r2: this.getRandom(),
      r3: this.getRandom(),
      r4: this.getRandom(),
      spinNum,
      cantSpin: true,
      credits,
      bet
    }
    
    this.checkWinning(newState)
    
    setTimeout(() => this.setState({ cantSpin: false }), 6000)
    
    this.setState(newState)
  }

  getRandom(){
    return Math.floor(Math.random() * config.FACES_PER_RING)
  }
  
  render() {
    if (!this.state)
      return <div/>
      
    let { wonReels, spinNum } = this.state
    
    return (
      <div>
        { this.state.won && <div className="wonOverlay"/>}
        <div id="outer">
          <div  id="stage">
            <Reel roll={ this.state.r1 } id="1" spinNum={spinNum} won={wonReels[1] || {}} />
            <Reel roll={ this.state.r2 } id="2" spinNum={spinNum} won={wonReels[2] || {}}/>
            <Reel roll={ this.state.r3 } id="3" spinNum={spinNum} won={wonReels[3] || {}}/>
            <Reel roll={ this.state.r4 } id="4" spinNum={spinNum} won={wonReels[4] || {}}/>
          </div>
        </div>
        <div>
          <div className="infoLabels">
            <div className="block">
              <div className="label" >Credits:</div>
              <div className="info">{this.state.credits}</div>
            </div>
            <div className="block">
              <div className="label" >Stake:</div>
              <div className="info">{this.state.bet}</div>
            </div>
          </div>
          <span className={"btnSpin " + (this.state.cantSpin ? "inactive" : "") } onTouchStart={ this.onSpin } onClick={ this.onSpin } >SPIN</span>
          <span className="betButtons">
            <span className={ "btnBet " + (this.state.cantSpin ? "inactive" : "") } onTouchStart={ this.changeBet } onClick={ this.changeBet } >BET</span>
            <br/>
            <span className={ "btnBet " + (this.state.cantSpin ? "inactive" : "") } onTouchStart={ this.betMax } onClick={ this.betMax } >MAX</span>
          </span>
        </div>
      </div>
    )
  }
}

ReactDOM.render(
    <Main />,
    document.getElementById("main")
);