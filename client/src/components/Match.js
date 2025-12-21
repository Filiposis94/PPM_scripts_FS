import React from "react";

function Match(props){
    const match = props.data;
    return (
       <tr>
            <td>{match.date}</td>
            <td><a href={match.url} target="blank">{match.capacity}</a></td>
            <td>{match.tk}</td>
            <td>{match.sP}</td>
            <td>{match.bP}</td>
            {props.settings.moreData && <><td>{match.position}</td><td>{match.npPlacement}</td></>}
       </tr>
    );
};

export default Match;