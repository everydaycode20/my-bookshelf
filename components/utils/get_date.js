export const getWeek = (date) => { //https://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php
        
    date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));

    date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));

    const yearStart = new Date(Date.UTC(date.getUTCFullYear(),0,1));

    const week = Math.ceil(( ( (date - yearStart) / 86400000) + 1)/7);
    
    return week;
}

export const getDay = () => {
    
    const days = [0, 1, 2, 3, 4, 5, 6];

    return days[new Date(Date.now()).getDay()];
}