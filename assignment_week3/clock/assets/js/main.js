import {Clock} from "./clock.js";
import {alarmManager} from "./alarm.js";
//import {Timer} from "./timer.js";

const clock = new Clock();
//const Timer = new Timer();


/* clock 상태 관리 */
const clockInfo = {
    battery: 100,
    currentMode: 'clock',
    timerActive: false,
    isDead: false
}

window.addEventListener("DOMContentLoaded", () => {initClock();});


async function initClock(){
    await renderContents("clock");
    updateClockUI();
    startClockTic();
    setupEventListeners();
}

async function setupEventListeners(){
    document.body.addEventListener("click", (event) =>{
        if(clockInfo.isDead) return;

        const target = event.target;

        /*tab btn 클릭 시, 해당 html 페이지 렌더링 */
        if (target.classList.contains("tab-btn")){
            renderContents(target.dataset.mode);
        }

        const action = target.dataset.action;
        switch(action){
            case "save-alarm": 
                handleAlarmEvents(action, target);
                break;
            case "delete-alarm":
                handleAlarmEvents(action, target);
                break;
        }
    })
}

function handleAlarmEvents(action, target){
    if(action === "save-alarm"){
        const noon = document.querySelector("#edit-noon").value;
        const hour = document.querySelector("#edit-hour").value;
        const minute = document.querySelector("#edit-minute").value;

        if(!noon || !hour || !minute) return alert("시간을 모두 선택해주세요.");

        const formattedHour = String(Number(noon) + Number(hour)).padStart(2,"0");
        const formattedMinute = minute.padStart(2,"0");
        const timeString = `${formattedHour}:${formattedMinute}`;

        if(alarmManager.addAlarm(timeString)){
            renderAlarmUI();
        }
    }

    if(action === "delete-alarm"){
        const section = target.closest(".alarm-section");
        const alarmId = Number(section.dataset.id);

        alarmManager.deleteAlarm(alarmId);
        console.log(alarmManager.alarmSlot);
        renderAlarmUI(action);
    }
}

function renderAlarmUI(){
    if(clockInfo.currentMode !== "alarm") return;

    const alarmSection = document.querySelectorAll(".alarm-section");
    alarmSection.forEach((section, index) => {
        alarmSection[index].style.display = "none";
    }); 
    const alarms = alarmManager.getAllAlarms();

    alarms.forEach((alarm, index) => {
        const section = alarmSection[index];
        section.style.display = "block";
        section.dataset.id = alarm.id;
        section.querySelector(".alarm-container-main__time").innerText = alarm.time;
    });
}

async function renderContents(pageMode){

    clockInfo.currentMode = pageMode;
    const contentArea = document.querySelector(".contents-area");
    const srcPage = `./${pageMode}.html`;
    try{
        const response = await fetch(srcPage);
        if(!response.ok) throw new Error('파일을 찾을 수 없습니다.');
        const html = await response.text();
        contentArea.innerHTML = html;

        if(pageMode === "alarm") renderAlarmUI();
    }
    catch(error){
        console:error('rendering error: ', error);
    }
}

function startClockTic(){
    const intervalId = setInterval(() =>{
        if(clockInfo.battery > 0){
            clockInfo.battery -= 1;
            updateBatteryUI();
            if(clockInfo.currentMode === "clock"){
                updateClockUI();
            }
            checkTimeWithAlarm();
        }
        else{
            drainedBattery(intervalId);
        }
    }, 1000);
}

function checkTimeWithAlarm(){
    const now = clock.getCurrentTime().substring(0,5);
    const ringingAlarm = alarmManager.checkAlarms(now);

    if(ringingAlarm){
        ringingAlarm.isRinging = true;
        alert(`[알람] ${ringingAlarm.time} 입니다!`);
    }
    console.log(now);
    console.log(ringingAlarm);
}

function updateBatteryUI(){
    const batteryElement = document.querySelector(".battery-box__remaining");
    batteryElement.innerText = `${clockInfo.battery}%`;

    batteryElement.style.setProperty("--battery-width", `${clockInfo.battery*(8/10)}%`);
    if(clockInfo.battery < 20){
        batteryElement.classList.add("low");
    }
}

function updateClockUI(){
    const currentDate = clock.getCurrentDate();
    const currentTime = clock.getCurrentTime();

    const dateContents = document.querySelector(".clock-screen__date");
    const timeContents = document.querySelector(".clock-screen__time");

    dateContents.innerText = currentDate;
    timeContents.innerText = currentTime;
}

function drainedBattery(intervalId){
    clockInfo.isDead = true;
    clearInterval(intervalId);
    blackoutScreen();
    // alert("Battery is dead. please reload the page.");


}
function blackoutScreen(){
    const screen = document.querySelector(".inner");
    screen.classList.add("dead");
}
