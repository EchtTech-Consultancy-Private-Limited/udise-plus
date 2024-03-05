import React from 'react'



export default function Breadcrumb() {
    const stateName = localStorage.getItem("state")
    const yearData = localStorage.getItem("year")
   
    return (
        <div className="col-md-12">
            <h4 className="brudcrumb_heading mb-0 mt-2">Showing Result for : <span>&nbsp;{stateName}</span>
                <span className="material-icons-round">chevron_right</span><span>{yearData}</span>
            </h4>
        </div>
    )
}
