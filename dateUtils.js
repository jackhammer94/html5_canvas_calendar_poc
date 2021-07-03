function getDiffInMins(dateA, dateB) {
  var diffMs = Math.abs(dateB - dateA);
  let result = Math.floor((diffMs / 1000) / 60);
  return result
}

function getTimeString(d) {
  var date = new Date(d)
  var convertedHrs = date.getHours() == 12 ? 12 : date.getHours()%12
  var hrs = ("0" + convertedHrs).slice(-2)
  var min = ("0" + date.getMinutes()).slice(-2)
  return `${hrs}:${min}`;
}

function getDateString(d) {
  var date = ("0" + d.getDate()).slice(-2)
  var month = ("0" + (d.getMonth() + 1)).slice(-2)
  var year = d.getFullYear()
  var hrs = ("0" + d.getHours()).slice(-2)
  var min = ("0" + d.getMinutes()).slice(-2)
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
