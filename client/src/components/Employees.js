import React from "react";
import axios from "axios";
import Employee from "./Employee"

function Employees(){
    const [employees, setEmployees] = React.useState([]);
    const [popUp, setPopUp] = React.useState({
            msg:'',
            isShown: false
    });
    const [filters, setFilters] = React.useState({
        type:'Trenér'
    })
    const [submittedFilters, setSubmittedFilters] = React.useState(filters)
    console.log(filters)

    const handlePopUp = React.useCallback((message)=>{
        setPopUp({
            msg: message,
            isShown:true
        });
        setTimeout(()=>{
            setPopUp({
                msg:'',
                isShown:false
            });
        }, 5000);
    },[]);

    const handleFilter = (event)=>{
        const {name, value} = event.target
        setFilters((prevFilters)=>{
            return {
                ...prevFilters,
                [name]:value
            };
        });
    }
    const handleSubmit = () => {
        setSubmittedFilters(filters);
    };
   
    React.useEffect(()=>{
        const fetchData = async ()=>{
            try {
                let res = await axios.get(`/api/v1/employees?type=${submittedFilters.type}`);
                setEmployees(res.data);
            } catch (error) {
                console.log(error);
                handlePopUp(error.response.data.msg);
            }
        };
        fetchData()
    },[handlePopUp, submittedFilters]);
    // RESULT ELEMENTS
    const employeeElements = employees.map((employee)=><Employee key={employee.ppmId} data={employee} />);
    return (
        <div>
            <div className="settings">
                <h2>Historie prodejů</h2>
            {popUp.isShown && <p className="popUp">{popUp.msg}</p>}
            <button className="button" onClick={handleSubmit}>Odeslat</button>
            <select name="type" onChange={handleFilter}>
                <option value='Trenér'>Trenér</option>
                <option value='Fyzioterapeut'>Fyzioterapeut</option>
                <option value='Manažer'>Manažer</option>
                <option value='Správce stadionu'>Správce stadionu</option>
                <option value='Lektor'>Lektor</option>
                <option value='Sportovní ředitel'>Sportovní ředitel</option>
                <option value='Lékař'>Lékař</option>
            </select>
            
            </div>
            {/* {employeeElements.length > 0 && <h3>Vhodní hráči - {playersElements.length}</h3>} */}
            
             <table>
                <thead>
                    <tr>
                        <th>Jméno</th>
                        <th>Cena</th>
                        <th>Věk</th>
                        <th>Typ</th>
                        <th>Prk</th>
                        <th>Atribut 1</th>
                        <th>Atribut 2</th>
                        <th>CZ</th>
                    </tr>
                </thead>
                <tbody>
                    {employeeElements}
                </tbody>
            </table>
        </div>
    );
};

export default Employees;