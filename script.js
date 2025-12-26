 // ========== HORLOGE ==========
        function updateClock() {
            const now = new Date();
            // Heure française (UTC+1)
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            
            document.getElementById('clock-display').textContent = `${hours}:${minutes}:${seconds}`;
        }

        setInterval(updateClock, 1000);
        updateClock();

        // ========== MINUTEUR ==========
        let timerInterval = null;
        let timerSeconds = 60;
        let timerRunning = false;

        const timerDisplay = document.getElementById('timer-display');
        const timerStart = document.getElementById('timer-start');
        const timerReset = document.getElementById('timer-reset');
        const timerHours = document.getElementById('timer-hours');
        const timerMinutes = document.getElementById('timer-minutes');
        const timerSecondsInput = document.getElementById('timer-seconds');

        function updateTimerDisplay() {
            const hours = Math.floor(timerSeconds / 3600);
            const minutes = Math.floor((timerSeconds % 3600) / 60);
            const seconds = timerSeconds % 60;
            
            timerDisplay.textContent = 
                `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }

        function updateTimerFromInputs() {
            const h = parseInt(timerHours.value) || 0;
            const m = parseInt(timerMinutes.value) || 0;
            const s = parseInt(timerSecondsInput.value) || 0;
            timerSeconds = h * 3600 + m * 60 + s;
            updateTimerDisplay();
        }

        [timerHours, timerMinutes, timerSecondsInput].forEach(input => {
            input.addEventListener('change', updateTimerFromInputs);
        });

        timerStart.addEventListener('click', () => {
            if (!timerRunning) {
                if (timerSeconds === 0) {
                    updateTimerFromInputs();
                }
                if (timerSeconds > 0) {
                    timerRunning = true;
                    timerStart.textContent = 'Pause';
                    timerStart.classList.remove('btn-primary');
                    timerStart.classList.add('btn-danger');
                    
                    timerInterval = setInterval(() => {
                        timerSeconds--;
                        updateTimerDisplay();
                        
                        if (timerSeconds === 0) {
                            clearInterval(timerInterval);
                            timerRunning = false;
                            timerStart.textContent = 'Démarrer';
                            timerStart.classList.add('btn-primary');
                            timerStart.classList.remove('btn-danger');
                            showAlert('⏱️ Minuteur', 'Le temps est écoulé !');
                        }
                    }, 1000);
                }
            } else {
                clearInterval(timerInterval);
                timerRunning = false;
                timerStart.textContent = 'Démarrer';
                timerStart.classList.add('btn-primary');
                timerStart.classList.remove('btn-danger');
            }
        });

        timerReset.addEventListener('click', () => {
            clearInterval(timerInterval);
            timerRunning = false;
            timerStart.textContent = 'Démarrer';
            timerStart.classList.add('btn-primary');
            timerStart.classList.remove('btn-danger');
            updateTimerFromInputs();
        });

        // ========== CHRONOMÈTRE ==========
        let stopwatchInterval = null;
        let stopwatchMilliseconds = 0;
        let stopwatchRunning = false;
        let lapCounter = 1;

        const stopwatchDisplay = document.getElementById('stopwatch-display');
        const stopwatchStart = document.getElementById('stopwatch-start');
        const stopwatchLap = document.getElementById('stopwatch-lap');
        const stopwatchReset = document.getElementById('stopwatch-reset');
        const lapsList = document.getElementById('laps-list');

        function updateStopwatchDisplay() {
            const totalSeconds = Math.floor(stopwatchMilliseconds / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            const ms = Math.floor((stopwatchMilliseconds % 1000) / 10);
            
            stopwatchDisplay.textContent = 
                `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
        }

        stopwatchStart.addEventListener('click', () => {
            if (!stopwatchRunning) {
                stopwatchRunning = true;
                stopwatchStart.textContent = 'Arrêter';
                stopwatchStart.classList.remove('btn-primary');
                stopwatchStart.classList.add('btn-danger');
                
                stopwatchInterval = setInterval(() => {
                    stopwatchMilliseconds += 10;
                    updateStopwatchDisplay();
                }, 10);
            } else {
                clearInterval(stopwatchInterval);
                stopwatchRunning = false;
                stopwatchStart.textContent = 'Démarrer';
                stopwatchStart.classList.add('btn-primary');
                stopwatchStart.classList.remove('btn-danger');
            }
        });

        stopwatchLap.addEventListener('click', () => {
            if (stopwatchRunning) {
                const lapTime = stopwatchDisplay.textContent;
                const lapItem = document.createElement('div');
                lapItem.className = 'lap-item';
                lapItem.innerHTML = `<strong>Tour ${lapCounter}</strong><span>${lapTime}</span>`;
                lapsList.insertBefore(lapItem, lapsList.firstChild);
                lapCounter++;
            }
        });

        stopwatchReset.addEventListener('click', () => {
            clearInterval(stopwatchInterval);
            stopwatchRunning = false;
            stopwatchMilliseconds = 0;
            lapCounter = 1;
            stopwatchStart.textContent = 'Démarrer';
            stopwatchStart.classList.add('btn-primary');
            stopwatchStart.classList.remove('btn-danger');
            updateStopwatchDisplay();
            lapsList.innerHTML = '';
        });

        // ========== RÉVEIL ==========
        let alarms = [];

        const alarmTime = document.getElementById('alarm-time');
        const alarmMessage = document.getElementById('alarm-message');
        const alarmAdd = document.getElementById('alarm-add');
        const alarmsList = document.getElementById('alarms-list');

        function updateAlarmsDisplay() {
            alarmsList.innerHTML = '';
            const now = new Date();
            
            alarms.forEach((alarm, index) => {
                const alarmDate = new Date();
                const [hours, minutes] = alarm.time.split(':');
                alarmDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
                
                const diff = alarmDate - now;
                const isPassed = diff < 0;
                
                let statusText = '';
                let statusClass = '';
                
                if (isPassed) {
                    statusText = 'Passée';
                    statusClass = 'alarm-passed';
                } else {
                    const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
                    const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                    statusText = `Dans ${hoursLeft}h ${minutesLeft}min`;
                    statusClass = 'alarm-upcoming';
                }
                
                const alarmItem = document.createElement('div');
                alarmItem.className = 'alarm-item';
                alarmItem.innerHTML = `
                    <div>
                        <strong>${alarm.time}</strong> - ${alarm.message}
                    </div>
                    <div style="display: flex; gap: 0.5rem; align-items: center;">
                        <span class="alarm-status ${statusClass}">${statusText}</span>
                        <button class="delete-btn" onclick="deleteAlarm(${index})">✕</button>
                    </div>
                `;
                alarmsList.appendChild(alarmItem);
            });
        }

        function deleteAlarm(index) {
            alarms.splice(index, 1);
            updateAlarmsDisplay();
        }

        window.deleteAlarm = deleteAlarm;

        alarmAdd.addEventListener('click', () => {
            if (alarmTime.value && alarmMessage.value) {
                alarms.push({
                    time: alarmTime.value,
                    message: alarmMessage.value
                });
                alarmTime.value = '';
                alarmMessage.value = '';
                updateAlarmsDisplay();
            }
        });

        // Vérifier les alarmes toutes les secondes
        setInterval(() => {
            const now = new Date();
            const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
            
            alarms.forEach((alarm, index) => {
                if (alarm.time === currentTime && !alarm.triggered) {
                    alarm.triggered = true;
                    showAlert('⏰ Alarme', alarm.message);
                    setTimeout(() => {
                        alarm.triggered = false;
                    }, 61000); // Éviter de déclencher plusieurs fois la même alarme
                }
            });
            
            updateAlarmsDisplay();
        }, 1000);

        // ========== SYSTÈME D'ALERTES ==========
        function showAlert(title, message) {
            document.getElementById('alert-title').textContent = title;
            document.getElementById('alert-message').textContent = message;
            document.getElementById('overlay').classList.add('show');
            document.getElementById('alert-box').classList.add('show');
        }

        document.getElementById('alert-close').addEventListener('click', () => {
            document.getElementById('overlay').classList.remove('show');
            document.getElementById('alert-box').classList.remove('show');
        });

        document.getElementById('overlay').addEventListener('click', () => {
            document.getElementById('overlay').classList.remove('show');
            document.getElementById('alert-box').classList.remove('show');
        });
    
