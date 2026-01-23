/*알람*/

export class Alarm{

    constructor(timeString){
        this.id = Date.now();
        this.time = timeString;
        this.isRinging = false;
    }
}

class AlarmManager{
    constructor(){
        this.alarmSlot = [];
        this.MAX_SLOT = 3;
    }

    addAlarm(timeString){
        if(this.alarmSlot.length >= this.MAX_SLOT){
            alert("알람은 3개 까지 저장할 수 있습니다. 이전 알람을 지운 뒤 새 알람을 추가해주세요.");
            return false;
        }

        const newAlarm = new Alarm(timeString);
        this.alarmSlot.push(newAlarm);
        return true;
    }

    deleteAlarm(id){
        this.alarmSlot = this.alarmSlot.filter(alarm => alarm.id != id);
    }

    checkAlarms(currentTime){
        return this.alarmSlot.find(alarm => alarm.time === currentTime && !isRinging);
    }

    getAllAlarms(){
        return this.alarmSlot;
    }
}

export const alarmManager = new AlarmManager();