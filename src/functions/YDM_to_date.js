const dateConverter = (dateString) => {

    // Parse the date (assumes UTC)
    const date = new Date(dateString);

    // Adjust to one second before midnight
    date.setUTCHours(
    5, 1, 0, 0);

    // Format the date to ISO 8601 format 

    return date
}

module.exports = dateConverter