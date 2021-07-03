function getDiffInMins(dateA, dateB) {
  var diffMs = Math.abs(dateB - dateA);
  let result = Math.floor((diffMs / 1000) / 60);
  return result
}

function getTimeString(dateString) {
  var date = new Date(dateString)
  var convertedHrs = date.getHours() == 12 ? 12 : date.getHours()%12
  var hrs = ("0" + convertedHrs).slice(-2)
  var min = ("0" + date.getMinutes()).slice(-2)
  return `${hrs}:${min}`;
}

function getDateString(dateString) {
  var date = ("0" + dateString.getDate()).slice(-2)
  var month = ("0" + (dateString.getMonth() + 1)).slice(-2)
  var year = dateString.getFullYear()
  var hrs = ("0" + dateString.getHours()).slice(-2)
  var min = ("0" + dateString.getMinutes()).slice(-2)
  var datestring = year + "-" + month + "-" + date + "T" + hrs + ":" + min;
  return datestring;
}

function getTimePeriod(time) {
  return new Date(time).getHours() >= 0 && new Date(time).getHours() < 12 ? 'AM' : 'PM';
}

function isAMStart(time) {
  return new Date(time).getHours() == 0 && new Date(time).getMinutes() === 0;
}

function isPMStart(time) {
  return new Date(time).getHours() == 12 && new Date(time).getMinutes() === 0;
}

function isHourStart(time) {
  return new Date(time).getMinutes() === 0
}

function isSameDay(dateA, dateB) {
  return dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate();
}