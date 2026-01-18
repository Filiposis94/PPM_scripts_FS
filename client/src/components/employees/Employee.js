function Employee(props){
    const employee = props.data;
    
    function numberWithSpaces(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
    const displayPrice = numberWithSpaces(employee.price)
    
    return (
        <tr>
            <td><a href={employee.link} target="blank">{employee.name}</a></td>
            <td>{displayPrice}</td>
            <td>{employee.age}</td>
            <td>{employee.type}</td>
            <td>{employee.prk}</td>
            <td>{employee.att1}</td>
            <td>{employee.att2}</td>
            <td>{employee.cz}</td>
        </tr>
    );
};

export default Employee;