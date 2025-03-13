document.addEventListener('DOMContentLoaded', (event) => {
  const USER_STUDY = 25;
  const USER_BREAK_1 = 5;
  const USER_BREAK_2 = 20;
  const STEPS = ['USER_STUDY', 'USER_BREAK_1', 'USER_STUDY', 'USER_BREAK_1', 'USER_STUDY', 'USER_BREAK_1', 'USER_STUDY', 'USER_BREAK_2'];
  
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

  // Set the step
  function setStep({reload, autoStart}) {
    if (!reload) {
      if(STEPS[step] === 'USER_STUDY') {
        updateTotalPomodoros(totalPomodoros + 1);
      }
      step = ++step;
    }
    step = step >= STEPS.length ? 0 : step;
    time = eval(STEPS[step]) * 60;
    document.getElementById('step').innerHTML = STEPS[step] === 'USER_STUDY' ? 'Fase de concentración' : 'Descanso';
    updateTimer();
    if (autoStart && !reload) {
      startTimer();
    }
  }

  // Function that starts a countdown timer from X minutes to 0
  function startTimer() {
    console.log('starting timer at step: ', step);
    document.getElementById('pause-resume-btn').removeEventListener('click', handleStartTimer);
    document.getElementById('pause-resume-btn').innerHTML = 'Pause';
    document.getElementById('pause-resume-btn').addEventListener('click', handlePauseTimer);
    timer = setInterval(() => {
      updateTimer();
      time--;
      totalTime++;
      if (time < 0) {
        reloadTimer(false, auto_start);
      }
    }, 1000);
  }

  // Update the timer
  function updateTimer() {
    // Update main timer
    updateTimerValues({htmlId: 'timer', value: time});
    // Update the global timer
    updateTimerValues({htmlId: 'total-time', value: totalTime});
  }

  // Pause the timer that can be resumed
  function pauseTimer() {
    clearInterval(timer);
    document.getElementById('pause-resume-btn').removeEventListener('click', handlePauseTimer);
    document.getElementById('pause-resume-btn').innerHTML = 'Resume';
    document.getElementById('pause-resume-btn').addEventListener('click', handleStartTimer);
  }

  // Reload the timer
  function reloadTimer(reload, autoStart) {
    clearInterval(timer);
    document.getElementById('pause-resume-btn').removeEventListener('click', handlePauseTimer);
    document.getElementById('pause-resume-btn').innerHTML = 'Start';
    document.getElementById('pause-resume-btn').addEventListener('click', handleStartTimer);
    setStep({reload: reload, autoStart: autoStart});
  }

  //Update total pomodoros
  function updateTotalPomodoros(numPomodoros) {
    totalPomodoros = numPomodoros;
    document.getElementById('num-pomodoros').innerHTML = totalPomodoros;
  }

  // Update timer values
  function updateTimerValues({htmlId, value}) {
    let minutes = Math.floor(value / 60);
    let seconds = value % 60;
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    document.getElementById(htmlId).innerHTML = `${minutes}:${seconds}`;
  }

  function handleRestartTimer() {
    reloadTimer(true);
  }

  function handleStartTimer() {
    startTimer();
  }

  function handlePauseTimer() {
    pauseTimer();
  }

  function handleNextStep() {
    reloadTimer(false, false);
  }

  function handleRestartValues() {
    totalTime = 0;
    updateTotalPomodoros(0);
    step = 0;
    reloadTimer(true, false);
  }

  // Initialize the html elements and handlers
  document.getElementById('num-pomodoros').innerHTML = totalPomodoros;
  document.getElementById('restart-btn').addEventListener('click', handleRestartTimer);
  document.getElementById('forward-btn').addEventListener('click', handleNextStep);
  document.getElementById('pause-resume-btn').addEventListener('click', handleStartTimer);
  document.getElementById('restart-values').addEventListener('click', handleRestartValues)
  document.getElementById('auto-start').addEventListener('change', (event) => {
    auto_start = event.target.checked;
  });

  setStep({reload: true, autoStart: false});
});