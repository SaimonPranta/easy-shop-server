const parseDate = (dateString, from) => {

    // Parse the date (assumes UTC)
    const date = new Date(dateString);

    // Adjust to one second before midnight
    if (from = "Expire Date") {
        date.setUTCHours( 17, 59, 59, 59);
    }else if(from = "Start Date"){
        date.setUTCHours( -6, 0, 0, 0);
    }
    // date.setUTCHours(
    // -6, 0, 0, 0);
    // date.setUTCHours(
    // 18, 0, 0, 0);


    // Format the date to ISO 8601 format 

    console.log("date -->>", date);
    return date
}

module.exports = { parseDate }