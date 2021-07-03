const data = {
  events: [
    {
      name: 'Sample Item1',
      location: 'Sample Location',
      startsOn: "1995-12-17T00:00",
      endsOn: "1995-12-17T07:00",
      isAllDay: true
    }
  ]
};

function addEvent(start, end) {
  data.events.push({
    name: 'Sample Item',
    location: 'Sample Location',
    startsOn: start,
    endsOn: end,
    isAllDay: false
  })
}
// addEvent("1995-12-17T07:00", "1995-12-17T08:00")
// addEvent("1995-12-17T07:30", "1995-12-17T09:00")
// addEvent("1995-12-17T08:00", "1995-12-17T08:30")
// addEvent("1995-12-17T09:00", "1995-12-17T09:30")
// addEvent("1995-12-17T09:00", "1995-12-17T10:00")
// addEvent("1995-12-17T09:00", "1995-12-17T10:30")
// addEvent("1995-12-17T09:30", "1995-12-17T10:30")
// addEvent("1995-12-17T09:30", "1995-12-17T11:00")
// addEvent("1995-12-17T10:00", "1995-12-17T11:00")
// addEvent("1995-12-17T10:30", "1995-12-17T11:30")
// addEvent("1995-12-17T11:30", "1995-12-17T12:30")

// addEvent("1995-12-17T09:00", "1995-12-19T10:00")
addEvent("1995-12-17T09:00", "1995-12-17T10:00")
addEvent("1995-12-17T11:00", "1995-12-17T12:30")
addEvent("1995-12-17T13:00", "1995-12-17T14:30")
addEvent("1995-12-17T14:00", "1995-12-17T15:00")
addEvent("1995-12-17T17:00", "1995-12-17T20:00")
addEvent("1995-12-17T17:30", "1995-12-17T19:00")
addEvent("1995-12-17T17:00", "1995-12-17T17:30")
addEvent("1995-12-17T14:00", "1995-12-17T17:30")
