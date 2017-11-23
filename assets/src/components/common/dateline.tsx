import * as React from "react";

const ensureDate = (date) => {
    return (date instanceof Date) ? date : new Date(date)   
}

const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
    'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatDate = (date : Date) => {
    // note: use moment.s if we do a lot of date related nonesense
    // javascript only supports 0-23 military hours. We convert it
    // 0 is 12AM, 12 is 12PM, 23 is 11PM
    // if its 12 and above, subtract from 12 and make it PM
    // if it becomes 0, its 12 (the first number of a period)
    let hours = date.getHours();
    let period = "AM";
    if (hours >= 12) {
        period = "PM";
        hours = hours - 12;
    }
    if (hours == 0) {
        hours = 12;
    }

    let month = months[date.getMonth()];
    let day = (date.getDay() >= 10) ? date.getDay() : '0' + date.getDay();
    const dayStr = `${month} ${day}, ${date.getFullYear()}`;
    return `${dayStr} @ ${hours}:${date.getMinutes()} ${period}`;
}

/**
 * A date display component that displays when an item was published
 * @param props 
 */
export const DateLine = (props : {date:Date|string}) => (
    <div className="date-line">
        <i className="fa fa-calendar" aria-hidden="true"></i>
        { (props.date) ? formatDate(ensureDate(props.date)) : "N/A" }
    </div>
)
