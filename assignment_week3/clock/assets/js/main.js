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
    console.log("render success");

    startClockTic();
    console.log("clockTic success");

    setupEventListeners();
    console.log("eventListner setup success")
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
                handleAlarmEvents(action);
                break;
            case "delete-alarm":
                handleAlarmEvents(action);
                break;
            case "start-timer":
                handleTimerEvents(action)
                break;
            case "pause-timer":
                handleTimerEvents(action)
                break;
            case "reset-timer":
                handleTimerEvents(action)
                break;
        }
    })
}

function handleAlarmEvents(action){
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

    if(action === "delete-alarm")[

    ]
}


function handleTimerEvents(action){}

async function renderContents(pageMode){

    clockInfo.currentMode = pageMode;
    const contentArea = document.querySelector(".contents-area");
    const srcPage = `./${pageMode}.html`;
    try{
        const response = await fetch(srcPage);
        if(!response.ok) throw new Error('파일을 찾을 수 없습니다.');
        const html = await response.text();
        contentArea.innerHTML = html;
    }
    catch(error){
        console:error('rendering error: ', error);
    }
}

function startClockTic(){
    const clockTic = setInterval(() =>{
        if(clockInfo.battery > 0){
            clockInfo.battery -= 1;
            updateBatteryUI();
            updateClockUI();
        }
        else{
            drainedBattery();
        }
    }, 1000);
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

function drainedBattery(){
    clockInfo.isDead = true;
    alert("Battery is dead. please reload the page.");
}



/*
    렌더링 이벤트 유형
    - 매초 시간 업데이트 -> 시간(초) / 베터리 감소
    - 버튼 입력 이벤트 시 업데이트
    - 사용자 입력 이벤트 시 업데이트

    이벤트 핸들러 -> 각종 이벤트 및 함수들 연결, 관리

    이벤트 발생 시 처리할 동작들
    - 버튼 입력 시
        -- 페이지 렌더링
        -- 알람 --
        -- 알람 시간 입력
        -- 알람 등록(등록 버튼)
        -- 알람 삭제(삭제 버튼)
        -- 타이머 --
        -- 타이머 시간 입력
        -- 타이머 시작
        -- 타이머 정지
        -- 타이머 재시작
        -- 타이머 초기화

    - 
*/