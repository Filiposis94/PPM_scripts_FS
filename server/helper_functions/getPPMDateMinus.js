const getPPMDateMinus = (datePPM, days)=>{
    let dateObject;
    if(datePPM === 'start'){
        dateObject = new Date();
    } else {
        let splitPPMDate = datePPM.split('-');
        let date = `${splitPPMDate[2]}-${splitPPMDate[1]}-${splitPPMDate[0]}`;
        dateObject = new Date(date);
        dateObject.setDate(dateObject.getDate()-days)
    }
    let day = ('0'+dateObject.getDate()).slice(-2);
    let month = ('0'+(dateObject.getMonth()+1)).slice(-2);
    let year = dateObject.getFullYear()
    result = `${day}-${month}-${year}`
    return result
}

module.exports = getPPMDateMinus;