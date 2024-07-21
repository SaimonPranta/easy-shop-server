const testDate = (dateString) => {
    // Input ISO 8601 date string 

// Parse the ISO 8601 date
const date = new Date(dateString);

// Convert to local time
const localDate = date.toLocaleString();

// Format to "DD-mm-yyyy and hh:mm am/pm"
const formattedDate = localDate.replace(
  /(\d{2})-(\d{2})-(\d{4}), (\d{2}):(\d{2}):(\d{2})/,
  "$1-$2-$3 and $4:$5"
);

console.log("formattedDate form test: ->", formattedDate); // Outputs: "17-07-2024 and 11:59 PM"

}

module.exports = testDate