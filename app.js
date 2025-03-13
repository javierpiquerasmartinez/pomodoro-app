document.addEventListener('DOMContentLoaded', (event) => {
  const USER_STUDY = 0.3;
  const USER_BREAK_1 = 0.1;
  const USER_BREAK_2 = 0.2;
  const STEPS = [USER_STUDY, USER_BREAK_1, USER_STUDY, USER_BREAK_1, USER_STUDY, USER_BREAK_1, USER_STUDY, USER_BREAK_2];
  
  // Current time
  var time;
  // Current timer
  var timer;
  // Current step
  var step;

  // Initialize the step
  function setStep(reload) {
    console.log('step1: ', step, reload);
    if (!reload) {
      step = (step === undefined) ? 0 : ++step;
    }
    step = step >= STEPS.length ? 0 : step;
    time = STEPS[step] * 60;
    document.getElementById('step').innerHTML = STEPS[step] === USER_STUDY ? 'Study' : 'Break';
    updateTimer();
  }

  // Function that starts a countdown timer from 25 minutes to 0
  function startTimer() {
    console.log('starting timer at step: ', step);
    document.getElementById('pause-resume-btn').removeEventListener('click', handleStartTimer);
    document.getElementById('pause-resume-btn').innerHTML = 'Pause';
    document.getElementById('pause-resume-btn').addEventListener('click', handlePauseTimer);
    timer = setInterval(() => {
      updateTimer();
      time--;
      if (time < 0) {
        reloadTimer(false);
      }
    }, 1000);
  }

  // Update the timer
  function updateTimer() {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    document.getElementById('timer').innerHTML = `${minutes}:${seconds}`;
  }

  // Pause the timer that can be resumed
  function pauseTimer() {
    console.log('pause');
    clearInterval(timer);
    document.getElementById('pause-resume-btn').removeEventListener('click', handlePauseTimer);
    document.getElementById('pause-resume-btn').innerHTML = 'Resume';
    document.getElementById('pause-resume-btn').addEventListener('click', handleStartTimer);
  }

  // Reload the timer
  function reloadTimer(reload) {
    clearInterval(timer);
    document.getElementById('pause-resume-btn').removeEventListener('click', handlePauseTimer);
    document.getElementById('pause-resume-btn').innerHTML = 'Start';
    document.getElementById('pause-resume-btn').addEventListener('click', handleStartTimer);
    setStep(reload);
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
    reloadTimer(false);
  }

  document.getElementById('restart-btn').addEventListener('click', handleRestartTimer);
  document.getElementById('forward-btn').addEventListener('click', handleNextStep);

  setStep();
  startTimer();
});