import React from "react";

function Loading(props){
    let styles = {width: `${props.progress}%`};
    return (
        <div>
            <h3>{props.task}</h3>
            <div className="loading-container">
                <div className="loading-bar" style={styles}></div>
            </div>
        </div>
    );
};

export default Loading;