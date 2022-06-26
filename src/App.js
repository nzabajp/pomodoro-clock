import React from 'react'
import sound from './audio/alarm.mp3'

export default function App() {

  const initialSetter = {
    session: 25,
    breakTime: 5,
    wasPaused: false,
    onBreak: false,
    display: "25:00",
    intervalId : 0,
    fromPauseTimer: 25
  }

  const [setter, setSetter] = React.useState(initialSetter)
  
  //func that displays the timer in mm:ss
  function toDisplay(mins) {

    const minutes = Math.floor((mins * 60) / 60)
    const seconds = (mins * 60) - minutes * 60

    function convertToTime(digit,pad,length) {
      return (new Array(length+1).join(pad)+digit).slice(-length);
    }
  
    const finalTime = convertToTime(minutes,'0',2)+':'+convertToTime(seconds,'0',2);
    setSetter(prevSetter => ({...prevSetter, display: finalTime}))
  }
  
  //takes care of initial launch display
  React.useEffect(() => toDisplay(setter.session), [setter.session])

  //start/pause button func
  function startStop() {
    let intId
    
    //if statement to pause the timer
    if(setter.intervalId) {
      clearInterval(setter.intervalId)
      const fromDisplay = setter.display.split(":")
      const toMin  = (Number(fromDisplay[0])) + (fromDisplay[1] / 60)
      setSetter(prevSetter => ({
        ...prevSetter, 
        intervalId: 0, 
        wasPaused: true, 
        fromPauseTimer: toMin}))
      return;
    }

    if(setter.wasPaused === false && setter.onBreak === false) {
      return sessionTimer(setter.session)
    } else if(setter.wasPaused === true && setter.onBreak === false) {
      return sessionTimer(setter.fromPauseTimer)
    } else if(setter.wasPaused === false && setter.onBreak === true) {
      return breakTimer(setter.breakTime)
    } else if(setter.wasPaused === true && setter.onBreak === true) {
      return breakTimer(setter.fromPauseTimer)
    }

    function sessionTimer(prop){
      let time = prop * 60 //turn minutes to seconds
      setSetter(prevSetter => ({...prevSetter, onBreak: false}))
      
      intId = setInterval(() => {
        if(time === 0) {
            clearInterval(intId)
            playSound()
            breakTimer(setter.breakTime)
        } else if(time > 0) { 
            time -= 1
            const toMin = time / 60
            toDisplay(toMin)
        }
      }, 1000)
      setSetter(prevSetter => ({...prevSetter, intervalId: intId}))
    }

    function breakTimer(prop) {
      let time2 = prop * 60
      setSetter(prevSetter => ({...prevSetter, onBreak: true}))

      intId = setInterval(() => {
        if(time2 === 0) {
            clearInterval(intId)
            playSound()
            sessionTimer(setter.session)
        } else if (time2 > 0) {
            time2 -= 1
            const toMin = time2 / 60
            toDisplay(toMin)
        }
      }, 1000)
      setSetter(prevSetter => ({...prevSetter, intervalId: intId}))
    }
  }

  //handles the playing of the beeping sound
  function playSound() {
    const sound = document.getElementById("beep")
    sound.play()
  }

  //handles the reset button
  function resetTimer() {
    setSetter(initialSetter)
    clearInterval(setter.intervalId)
  }

  //handles session decrement
  function minusSession() {
    setSetter(prevTimer => {
      return prevTimer.session === 1 ? 
      prevTimer : 
      {
        ...prevTimer, 
        session: prevTimer.session - 1
      }
    })
  }

  //handles session increment
  function addSession() {
      setSetter (prevTimer => {
        return prevTimer.session === 60 ?
        prevTimer :
         {
          ...prevTimer, 
          session: prevTimer.session + 1
        }
      })
  }

  //handles break decrement
  function minusBreak() {
    setSetter(prevTimer => {
      return prevTimer.breakTime === 1 ? 
      prevTimer : 
      {
        ...prevTimer, 
        breakTime: prevTimer.breakTime - 1
      }
    })
  }

  //handles break increment
  function addBreak() {
    setSetter (prevTimer => {
      return prevTimer.breakTime === 60 ?
      prevTimer :
       {
        ...prevTimer, 
        breakTime: prevTimer.breakTime + 1
      }
    })
  }

  return (
    <div className='App'>
      <div className="clock">
        <h2 className='clock-heading'>Pomodoro Clock</h2>
        <div className='timer-container'>
          <h3 id="timer-label">{setter.onBreak ? "Break" : "Session"}</h3>
          <h1  id="time-left">{setter.display}</h1>
          <audio id="beep" src={sound} />
        </div>
        <div className='play-buttons'>
          <button id="start_stop" onClick={startStop}><i className="fa-solid fa-play" /><i className="fa-solid fa-pause" /></button>
          <button id="reset" onClick={resetTimer}><i className="fa-solid fa-arrows-rotate" /></button>
        </div>
        <div className='session-container'>
          <p id="session-label">Session Length</p>
          <button id="session-decrement" onClick={minusSession}>-</button>
          <span id="session-length">{setter.session}</span>
          <button id="session-increment" onClick={addSession}>+</button>
        </div>
        <div className='break-container'>
          <p id="break-label">Break Length</p>
          <button id="break-decrement" onClick={minusBreak}>-</button>
          <span id="break-length">{setter.breakTime}</span>
          <button id="break-increment" onClick={addBreak}>+</button>
        </div>
      </div>
      <p className='footer'>made with <i class="fa-solid fa-heart" /> by <a href='https://github.com/nzabajp' target="_blank" rel="noreferrer">/nzabajp</a></p>
    </div>
  );
}