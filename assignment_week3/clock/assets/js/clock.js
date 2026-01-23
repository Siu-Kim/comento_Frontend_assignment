export class Clock{
    
    today = new Date();

    getCurrentTime(){
        const today = new Date();
        const hours = String(today.getHours()).padStart(2,"0");
        const minutes = String(today.getMinutes()).padStart(2,"0");
        const seconds = String(today.getSeconds()).padStart(2,"0");

        let result = `${hours}:${minutes}:${seconds}`;
        console.log(result);
        return result;
    }

    getCurrentDate(){
        const today = new Date();
        const years = String(today.getFullYear());
        const month = String(today.getMonth()+1);
        const date = String(today.getDate());

        let result = `${years}년 ${month}월 ${date}일`;
        console.log(result);

        return result;
    }

}