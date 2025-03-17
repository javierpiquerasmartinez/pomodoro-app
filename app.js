document.addEventListener('DOMContentLoaded', (event) => {
  const USER_STUDY = 25;
  const USER_BREAK_1 = 5;
  const USER_BREAK_2 = 20;
  const STEPS = ['USER_STUDY', 'USER_BREAK_1', 'USER_STUDY', 'USER_BREAK_1', 'USER_STUDY', 'USER_BREAK_1', 'USER_STUDY', 'USER_BREAK_2'];
  const timerSound = new Audio('./assets/sounds/timer.mp3');
  const clickSound = new Audio('./assets/sounds/click.mp3');
  const reinitializeSound = new Audio('./assets/sounds/trash.mp3');
  const restartSound = new Audio('./assets/sounds/backwards.mp3');
  const nextStepSound = new Audio('./assets/sounds/whistle.mp3');
  
  var auto_start = document.getElementById('auto-start').checked;

  // Total time
  var totalTime = 0;
  // Total pomodoros
  var totalPomodoros = 0;
  // Current time
  var time = 0;
  // Current step
  var step = 0;
  // Current timer
  var timer;
  // Dark Mode boolean variable
  var darkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Set the step
  function setStep({reload, autoStart}) {
    if (!reload) {
      if(STEPS[step] === 'USER_STUDY') {
        updateTotalPomodoros(totalPomodoros + 1);
      }
      step++;
    }
    step = step >= STEPS.length ? 0 : step;
    updateIcons();
    time = eval(STEPS[step]) * 60;
    document.getElementById('step').innerHTML = STEPS[step] === 'USER_STUDY' ? 'Fase de concentración' : 'Descansando';
    updateTimer();
    if (autoStart && !reload) {
      startTimer();
    }
  }

  // Function that starts a countdown timer from X minutes to 0
  function startTimer() {
    console.log('starting timer at step: ', step);
    document.getElementById('pause-resume-btn').removeEventListener('click', handleStartTimer);
    document.getElementById('pause-resume-btn').innerHTML = 'Pausar';
    document.getElementById('pause-resume-btn').addEventListener('click', handlePauseTimer);
    timer = setInterval(() => {
      time--;
      totalTime++;
      updateTimer();
      if(time === 10) {
        playTimerSound();
      }
      if (time < 0) {
        reloadTimer(false, auto_start);
      }
    }, 1000);
  }

  // Update the timer
  function updateTimer() {
    // Update main timer
    updateTimerValues({htmlId: 'timer', value: time});
    // Update the Page Title
    updateTimerValues({htmlId: 'title', value: time, isTitle: true});
    // Update the global timer
    updateTimerValues({htmlId: 'total-time', value: totalTime});
  }

  // Pause the timer that can be resumed
  function pauseTimer() {
    clearInterval(timer);
    document.getElementById('pause-resume-btn').removeEventListener('click', handlePauseTimer);
    document.getElementById('pause-resume-btn').innerHTML = 'Reanudar';
    document.getElementById('pause-resume-btn').addEventListener('click', handleStartTimer);
  }

  // Reload the timer
  function reloadTimer(reload, autoStart) {
    clearInterval(timer);
    document.getElementById('pause-resume-btn').removeEventListener('click', handlePauseTimer);
    document.getElementById('pause-resume-btn').innerHTML = 'Empezar';
    document.getElementById('pause-resume-btn').addEventListener('click', handleStartTimer);
    setStep({reload: reload, autoStart: autoStart});
  }

  //Update total pomodoros
  function updateTotalPomodoros(numPomodoros) {
    totalPomodoros = numPomodoros;
    document.getElementById('num-pomodoros').innerHTML = totalPomodoros;
  }

  // Update timer values
  function updateTimerValues({htmlId, value, isTitle}) {
    let hours = Math.floor(value / 60 / 60);
    let minutes = Math.floor(value / 60) % 60;
    let seconds = value % 60;
    minutes = hours && minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    let displayValue = `${hours ? hours + ':' : ''}${minutes}:${seconds}`;
  
    if (isTitle && document.hidden) {
      document.getElementById(htmlId).innerHTML = `(${displayValue}) 🍅 Pomodoro App`;
    } else if(!isTitle) {
      document.getElementById(htmlId).innerHTML = displayValue;
    }
  }

  function handleRestartTimer() {
    restartSound.play();
    reloadTimer(true);
  }

  function handleStartTimer() {
    clickSound.play();
    startTimer();
  }

  function handlePauseTimer() {
    clickSound.play();
    pauseTimer();
  }

  function handleNextStep() {
    nextStepSound.play();
    reloadTimer(false, false);
  }

  function handleRestartValues() {
    reinitializeSound.play();
    totalTime = 0;
    updateTotalPomodoros(0);
    step = 0;
    reloadTimer(true, false);
    updateIcons();
  }

  function handleChangeMode() {
    darkMode = !darkMode;
    document.body.classList.toggle('dark-mode', darkMode);
  }

  function playTimerSound() {
    timerSound
      .play()
      .then(() => console.log('Sound played'))
      .catch((error) => console.error('Error playing sound', error));
  }

  function updateIcons() {
    document.getElementById('step-icon').innerHTML = STEPS[step] === 'USER_STUDY' ? '🙇🏻‍♂️' : '☕️';
  }

  // Initialize the html elements and handlers
  document.getElementById('dark-light-mode').addEventListener('click', handleChangeMode)
  document.getElementById('num-pomodoros').innerHTML = totalPomodoros;
  document.getElementById('restart-btn').addEventListener('click', handleRestartTimer);
  document.getElementById('forward-btn').addEventListener('click', handleNextStep);
  document.getElementById('pause-resume-btn').addEventListener('click', handleStartTimer);
  document.getElementById('restart-values').addEventListener('click', handleRestartValues)
  document.getElementById('auto-start').addEventListener('change', (event) => {
    auto_start = event.target.checked;
  });

  // Check if the browser tab is active
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      document.getElementById('title').innerHTML = '🍅 Pomodoro App';
    }
  })

  // Initial functions
  handleChangeMode()
  setStep({reload: true, autoStart: false});
});