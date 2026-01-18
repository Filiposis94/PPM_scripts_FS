function Player(props){
    const player = props.data;
    return (
        <div className="flex player">
            <div className="attribute">
                <p className="attribute-name">Name</p>
                <p><a href={player.link} target="blank">{player.name}</a></p>
            </div>
            <div className="attribute">
                <p className="attribute-name">Age</p>
                <p>{player.age}</p>
            </div>
            <div className="attribute">
                <p className="attribute-name">SV</p>
                <p>{player.sv}</p>
            </div>
            <div className="attribute">
                <p className="attribute-name">Bra</p>
                <p>{player.bra}</p>
            </div>
            <div className="attribute">
                <p className="attribute-name">Obr</p>
                <p>{player.obr}</p>
            </div>
            <div className="attribute">
                <p className="attribute-name">Uto</p>
                <p>{player.uto}</p>
            </div>
            <div className="attribute">
                <p className="attribute-name">Str</p>
                <p>{player.str}</p>
            </div>
            <div className="attribute">
                <p className="attribute-name">Nah</p>
                <p>{player.nah}</p>
            </div>
            <div className="attribute">
                <p className="attribute-name">Tec</p>
                <p>{player.tec}</p>
            </div>
            <div className="attribute">
                <p className="attribute-name">Agr</p>
                <p>{player.agr}</p>
            </div>
            <div className="attribute">
                <p className="attribute-name">Zku</p>
                <p>{player.zku}</p>
            </div>
            <div className="attribute">
                <p className="attribute-name">Last login</p>
                <p>{player.lastLogin}</p>
            </div>
        </div>
    );
};

export default Player;