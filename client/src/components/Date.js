import React from "react";

function Date(props){
    let classes = props.data.isSelected === true ? 'button green' : 'button';
    return <button className={classes} onClick={()=>{props.handleSelect(props.data.value)}}>{props.data.value}</button>
};

export default Date;