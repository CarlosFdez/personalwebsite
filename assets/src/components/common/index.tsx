import * as React from "react";

const ensureDate = (date) => {
    return (date instanceof Date) ? date : new Date(date)   
}

/**
 * A date display component that displays when an item was published
 * @param props 
 */
export const DateLine = (props : {date:Date|string}) => (
    <div className="date">
        <i className="fa fa-calendar" aria-hidden="true"></i>
        { (props.date) ? ensureDate(props.date).toDateString() : "N/A" }
    </div>
)
