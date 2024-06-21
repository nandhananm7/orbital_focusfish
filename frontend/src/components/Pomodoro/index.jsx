import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';
import{ Link } from 'react-router-dom';
import Confetti from 'react-confetti';

const Pomodoro = () => {
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        window.location.reload();
        window.location.href = "/login";
    }

  const [mode, setMode] = useState('pomodoro');
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [newDurations, setNewDurations] = useState({
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15
  });
  const [ showMessage, setShowMessage] = useState(false);
  
  const [ congratsMessage, setCongratsMessage] = useState('');
  const messages = {
    pomodoro: "Well Done! You have completed the Pomodoro session!",
    shortBreak: "You have completed your short break!",
    longBreak: "Long break has ended!"
  };

  const modeDurations = {
    pomodoro: newDurations.pomodoro *60,
    shortBreak: newDurations.shortBreak*60,
    longBreak: newDurations.longBreak*60
  };

  const [totalWorkMinutes, setTotalWorkMinutes] = useState(0);

  useEffect(() => {
    const username = localStorage.getItem('username');
    const currentDate = new Date().toDateString();
    const todayData = JSON.parse(localStorage.getItem(`${username}_studyTime`)) || {};
    const savedMinutes = todayData[currentDate] || 0;

    setTotalWorkMinutes(savedMinutes);
  }, []);
  
  useEffect(() => {
    let interval = null;
    const totalDuration= modeDurations[mode];

    if (isActive) {
      interval = setInterval(() => {
        
        // when timer completes
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(interval);
            setIsActive(false);
            handleMessage();
            handleTimerEnd();
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
        const elapsedTime = totalDuration - (minutes*60 + seconds);
        setProgress((elapsedTime / totalDuration) * 100);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, minutes, seconds]);

  const handleModeChange = (newMode) => {
    setMode(newMode);
    switch (newMode) {
      case 'pomodoro':
        setMinutes(newDurations.pomodoro);
        break;
      case 'shortBreak':
        setMinutes(newDurations.shortBreak);
        break;
      case 'longBreak':
        setMinutes(newDurations.longBreak);
        break;
      default:
        break;
    }
    setSeconds(0);
    setIsActive(false);
    setProgress(0);
  };

  const toggleStartStop = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    switch (mode) {
      case 'pomodoro':
        setMinutes(newDurations.pomodoro);
        break;
      case 'shortBreak':
        setMinutes(newDurations.shortBreak);
        break;
      case 'longBreak':
        setMinutes(newDurations.longBreak);
        break;
      default:
        break;
    }
    setSeconds(0);
    setIsActive(false);
    setProgress(0);
  };

  const handleChangeDurations = () => {
    setShowPopup(true);
  }

  const handleClosePopup = () => {
    setShowPopup(false);
  }

  const handleDurationChange = (e) => {
    const { name, value } = e.target;
    const newValue = Math.max(5, Number(value));
    setNewDurations({
        ...newDurations,
        [name]: newValue
    });
  };

  const handleSaveDurations = () => {
    handleModeChange(mode);
    setShowPopup(false);
  };

  const handleMessage = () => {
    setCongratsMessage(messages[mode]);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 10000); //shows message only for 5 seconds
  };

  const handleTimerEnd = () => {
    if (mode === 'pomodoro'){
        const workMinutes = newDurations.pomodoro;
        setTotalWorkMinutes(prevMinutes => prevMinutes + workMinutes);
        const username = localStorage.getItem('username');
        const todayData = JSON.parse(localStorage.getItem(`${username}_studyTime`)) || {};
        const currentDate = new Date().toDateString();
        todayData[currentDate] = (todayData[currentDate] || 0) + workMinutes;
        localStorage.setItem(`${username}_studyTime`, JSON.stringify(todayData));
        
    }
  };

  const displayStudyTime = () => {
    const hours = Math.floor(totalWorkMinutes / 60);
    const minutes = totalWorkMinutes % 60;
    return `${hours} hours and ${minutes} minutes`;
};

  return (
    <main className={styles.app}>
        <header>
            <h1>FocusFish <button className={styles.logout_btn} onClick={handleLogout}>Log out</button></h1> 
            <Link to="/main"><button className={styles.backButton}>Back to Dashboard</button></Link>
        </header> 
        {showMessage && (
                <div className={styles.congratsMessage}>
                    {congratsMessage}
                    <Confetti />
                </div>
        )}
      <progress id="js-progress" value={progress} max="100"></progress>
      <div className={styles.progressBar}></div>
      <div className={styles.timer}>
        <div className={styles.buttonGroup} id="js-mode-buttons">
          <button
            data-mode="pomodoro"
            className={`${styles.button} ${styles.modeButton} ${mode === 'pomodoro' ? styles.active : ''}`}
            onClick={() => handleModeChange('pomodoro')}
            id="js-pomodoro"
          >
            Pomodoro
          </button>
          <button
            data-mode="shortBreak"
            className={`${styles.button} ${styles.modeButton} ${mode === 'shortBreak' ? styles.active : ''}`}
            onClick={() => handleModeChange('shortBreak')}
            id="js-short-break"
          >
            Short break
          </button>
          <button
            data-mode="longBreak"
            className={`${styles.button} ${styles.modeButton} ${mode === 'longBreak' ? styles.active : ''}`}
            onClick={() => handleModeChange('longBreak')}
            id="js-long-break"
          >
            Long break
          </button>
        </div>
        <div className={styles.clock} id="js-clock">
          <span id="js-minutes">{String(minutes).padStart(2, '0')}</span>
          <span className={styles.separator}>:</span>
          <span id="js-seconds">{String(seconds).padStart(2, '0')}</span>
        </div>
        <div className={styles.buttonGroup}>
          <button className={styles.mainButton} data-action="start" id="js-btn" onClick={toggleStartStop}>
            {isActive ? 'Stop' : 'Start'}
          </button>
          <button className={styles.resetButton} data-action="reset" onClick={resetTimer}>
          Reset
          </button>
        </div>
        <button className = {styles.editButton} data-action="edit" onClick={handleChangeDurations}>
            Edit
          </button>
      </div>
      {showPopup && (
      <div className={styles.popupContainer}>
        <div className={styles.popup}>
            <button className={styles.closeButton} onClick={handleClosePopup}>X</button>
            <h1 className={styles.popupHeading}>Edit Durations</h1>
            
                <h3 className={styles.popupHeading}>Pomodoro Duration (minutes):</h3>
            <div >
                <input className={styles.inputs} type="number" name="pomodoro" value={newDurations.pomodoro} onChange={handleDurationChange} min="5" />
            </div>
                <h3 className={styles.popupHeading}>Short Break Duration (minutes):</h3>
            <div >
                <input className={styles.inputs} type="number" name="shortBreak" value={newDurations.shortBreak} onChange={handleDurationChange} min="5" />
            </div>
                <h3 className={styles.popupHeading}>Long Break Duration (minutes):</h3>
            <div >
                <input className={styles.inputs} type="number" name="longBreak" value={newDurations.longBreak} onChange={handleDurationChange} min="5" />
            </div>
            <button className={styles.saveButton} onClick={handleSaveDurations}>Save</button>
        </div>
      </div>
      )}
      <div className={styles.dailySummary}>
        <p>Today's total Pomodoro time: {displayStudyTime()}</p>
      </div>
    </main>
  );
};

export default Pomodoro;
