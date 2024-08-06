import React from "react";
import clipboard from '../img/clipboard.svg';
import hockey from '../img/hockey.svg';
import magGlass from '../img/mag-glass.svg';
import people from '../img/people.svg';

function NavigationHP(props){
    return (
        <nav>   
        <div className="button hp-button" onClick={()=>{props.handlePage('freemarket')}}>Volní hráči<img className="hp-img" src={magGlass} alt="magnifying glass"></img></div>
        <div className="button hp-button" onClick={()=>{props.handlePage('friendlymatch')}}>Přáteláky<img className="hp-img" src={hockey} alt="hockey"></img></div>
        <div className="button hp-button" onClick={()=>{props.handlePage('tactics')}}>Taktiky<img className="hp-img" src={clipboard} alt="clipboard"></img></div>
        <div className="button hp-button" onClick={()=>{props.handlePage('visits')}}>Návštěvnost<img className="hp-img" src={people} alt="people"></img></div>
        </nav>
    );

};

export default NavigationHP;