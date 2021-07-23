/**
 * Returns current week
 * 
 * @param {Date} date 
 * @returns {Number} week
 * 
 * 
 */
//https://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php

export const getWeek = (date) => { 
        
    date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));

    date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));

    const yearStart = new Date(Date.UTC(date.getUTCFullYear(),0,1));

    const week = Math.ceil(( ( (date - yearStart) / 86400000) + 1)/7);
    
    return week;
}

/**
 * Returns current day
 * 
 * @returns {Number} day
 */

export const getDay = () => {
    
    const days = [0, 1, 2, 3, 4, 5, 6];

    return days[new Date(Date.now()).getDay()];
}

/**
 * 
 * @param Number, Date
 * 
 * @returns Object with each week of year
 * 
 */

export const getTotalDaysOfYear = (year) => {

    function getDaysOfYear() {

        let count = 0;

        for (let i = 1; i <= 12; i++) {
            let days = new Date(year, i, 0).getDate();

            count += days;
        }
        return count;
    }
    
    let totalDays = getDaysOfYear();

    let tempTotalDays = totalDays;

    let arrDays = [];

    let objWeek = {};

    let countNotYear = 0; // keeps tracks on how many days don't belong to current year

    let firstDay = new Date(year, 0, 0).getDay(); // figures out in which day the first day of year falls

    for (let i = 0; i < totalDays; i++) {
        if (i <= firstDay) {
            arrDays.push("x");
            countNotYear++;
            totalDays++;
        }
        else{
            arrDays.push(0);
        }
    }

    if (tempTotalDays === 365) {
        let left = 6 - countNotYear;
        for (let i = 0; i < left; i++) {
            arrDays.push("x");
        }
    }
    else {
        let left = 6 - countNotYear - 1;
        for (let i = 0; i < left; i++) {
            arrDays.push("x");
        }
    }

    let tempCount = 0;

    let newArr = [];

    let weekCount = 0;

    for (let i = 0; i < arrDays.length; i++) {
        
        if (i % 7 === 0) {
            newArr = [];
            tempCount = 0;
            newArr.push(arrDays[i]);
            tempCount++;
        }
        else{
            newArr.push(arrDays[i]);
            tempCount++;

            if (i % 6 === 0) {
                weekCount++;
                objWeek[weekCount] = newArr;
            }
        }
        
    }
    
    return objWeek;
}

/**
 * 
 * @param Array all weeks of year
 * 
 * @returns {Number} pageCount how many pages read in year
 * 
 */

export const getTotalPagesInYear = (weeks) => {

    let a = weeks;
    
    let obj = {};

    for (const key in a) {
        
        let pageCount = 0;
        let tempArr = Object.values(a[key]);
        
        for (let i = 0; i < tempArr.length; i++) {
            
            let temp = tempArr[i];
            for (let j = 0; j < temp.length; j++) {
                
                if (temp[j] !== "x" && temp[j] > 0) {
                    pageCount += temp[j];
                }
            }
        }
        obj[key] = pageCount;
        pageCount = 0;
    }

    return obj;
}

/**
 * 
 * @param Object object 
 * 
 * @returns Array
 */

export const getWeeksArranged = (object, year) => {
    
    const valuesWeeks = Object.values(object);

    valuesWeeks.pop();

    const mergedArray = [];

    for (let j = 0; j < valuesWeeks[0].length; j++) {
        for (let i = 0; i < valuesWeeks.length; i++) {
            mergedArray.push(valuesWeeks[i][j]);
        }
    }


    return {[year]: mergedArray};
}