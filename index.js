// import data from 'data.json'

window.onload = function () {
  const data = {
    events: [
      {
        name: 'testEvent-allday',
        location: 'india',
        startsOn: "",
        endsOn: "",
        isAllDay: true
      },
      {
        name: 'testEvent-1',
        location: 'india',
        startsOn: "",
        endsOn: "",
        isAllDay: false
      },
      {
        name: 'testEvent-2',
        location: 'india',
        startsOn: "",
        endsOn: "",
        isAllDay: false
      },
      {
        name: 'testEvent-overlap-1',
        location: 'india',
        startsOn: "",
        endsOn: "",
        isAllDay: false
      },
    ]
  };
  console.log(data)
  const currentTime = new Date("June 30, 2021 00:00:00")
  //TODO: form overlapping buckets object 
  const overlappingBuckets = {
    "1995-12-17T09:00": [
      {
        name: 'testEvent-1y',
        location: 'india',
        startsOn: "1995-12-17T09:00",
        endsOn: "1995-12-17T10:00",
        isAllDay: true
      }
    ],
    "1995-12-17T11:00": [
      {
        name: 'testEvent-1y',
        location: 'india',
        startsOn: "1995-12-17T11:00",
        endsOn: "1995-12-17T12:30",
        isAllDay: true
      }],
    "1995-12-17T13:00": [
      {
        name: 'testEvent-1y',
        location: 'india',
        startsOn: "1995-12-17T13:00",
        endsOn: "1995-12-17T14:30",
        isAllDay: true
      },
      {
        name: 'testEvent-1y',
        location: 'india',
        startsOn: "1995-12-17T14:00",
        endsOn: "1995-12-17T15:00",
        isAllDay: true
      }],
    "1995-12-17T17:00": [
      {
        name: 'testEvent-1y',
        location: 'india',
        startsOn: "1995-12-17T17:00",
        endsOn: "1995-12-17T20:00",
        isAllDay: true
      },
      {
        name: 'testEvent-1y',
        location: 'india',
        startsOn: "1995-12-17T17:30",
        endsOn: "1995-12-17T19:00",
        isAllDay: true
      },
      {
        name: 'testEvent-1y',
        location: 'india',
        startsOn: "1995-12-17T17:00",
        endsOn: "1995-12-17T17:30",
        isAllDay: true
      }
    ]
  }

  const timeBlockEventStartMap = {}
  //TODO: get largest event end time
  let smallestEventStartTime = new Date("1995-12-17T09:00")
  let largestEventEndTime = new Date("1995-12-17T20:00")
  let lastTimeBlock = largestEventEndTime.getHours() - smallestEventStartTime.getHours()
  console.log('lasttimeblock', (lastTimeBlock * 60) / 30) //splitting into blocks of 30 min each
  let lastBlockIndex = (lastTimeBlock * 60) / 30
  let i = 0;
  let bucketStart = smallestEventStartTime
  while (i < lastBlockIndex) {
    if (getDateString(bucketStart) in overlappingBuckets) {
      timeBlockEventStartMap[i] = { time: getDateString(bucketStart), hasEvents: true }
    }
    else {
      timeBlockEventStartMap[i] = { time: getDateString(bucketStart), hasEvents: false }
    }
    let hrs = new Date(bucketStart).getMinutes()
    bucketStart = new Date(bucketStart)
    bucketStart.setMinutes(hrs + 30)
    i++;
  }
  console.log("timeblockeventstartmap", timeBlockEventStartMap)

  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");

  let totalCanvasWidth = 1200
  let timePeriodMarkerOffset = 50;
  let hourMarkerOffset = 150;
  let midHourMarkerOffset = 250
  let eventAreaOffset = 350;
  let eventAreaWidth = totalCanvasWidth - eventAreaOffset;

  let hourBlockHeight = 80
  let smallestEventBlockHeight = hourBlockHeight / 2
  let smallestPossibleEventDurationInMinutes = 30

  let gutter = 10
  let lineHeight = 10
  let timeMarkerFontSize = 25

  //paint time markers
  for (timeBlock = 0; timeBlock < lastBlockIndex; timeBlock++) {
    if (timeBlock % 12 == 0) {
      ctx.font = `${timeMarkerFontSize}px Arial`;
      ctx.fillStyle = 'black';
      ctx.fillText(`PM`, timePeriodMarkerOffset, (timeBlock * (hourBlockHeight)) + timeMarkerFontSize);
    }
    let timeOffset = (timeBlock * (smallestEventBlockHeight))
    //hour marker
    if (!isHalfHour(timeBlockEventStartMap[timeBlock].time)) {
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.moveTo(hourMarkerOffset, timeOffset);
      ctx.lineTo(totalCanvasWidth, timeOffset);
      ctx.strokeStyle = 'gray';
      ctx.stroke();

      ctx.font = "10px Arial";
      ctx.fillStyle = 'black';
      ctx.fillText(`${timeBlockEventStartMap[timeBlock].time} PM`, hourMarkerOffset, timeOffset + lineHeight);
    }
    else {
      //mid hour marker
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.moveTo(midHourMarkerOffset, timeOffset);
      ctx.lineTo(totalCanvasWidth, timeOffset);
      ctx.strokeStyle = 'gray';
      ctx.stroke();

      ctx.font = "10px Arial";
      ctx.fillStyle = 'black';
      ctx.fillText(`${timeBlockEventStartMap[timeBlock].time} PM`, midHourMarkerOffset, timeOffset + lineHeight);
    }
  }

  for (timeBlock = 0; timeBlock < lastBlockIndex; timeBlock++) {
    let timeOffset = (timeBlock * (smallestEventBlockHeight)) // (timeBlock*(timeBlockSize + gutter))
    if (!timeBlockEventStartMap[timeBlock].hasEvents) {
      continue
    }
    let blockTime = timeBlockEventStartMap[timeBlock].time
    let events = overlappingBuckets[blockTime]
    let overlappingEventCount = events.length
    let width = (eventAreaWidth / overlappingEventCount)
    for (eventBlock = 0; eventBlock < overlappingEventCount; eventBlock++) {
      ctx.fillStyle = "white";

      let event = events[eventBlock]
      let eventStart = new Date(event.startsOn)
      let eventEnd = new Date(event.endsOn)
      let eventDuration = getDiffInMins(eventStart, eventEnd);
      
      let eventOffsetMin = getDiffInMins(new Date(blockTime), eventStart)
      // console.log(`ev offset ${eventOffset} for ev  for ${events[eventBlock]}`);

      let eventBlockStart = eventOffsetMin == 0 ? 0 : (eventOffsetMin / smallestPossibleEventDurationInMinutes) * smallestEventBlockHeight //eventDurationStartMin == 0 ? 0 : smallestEventBlockHeight
      let eventBlockHeight = smallestEventBlockHeight * (eventDuration / smallestPossibleEventDurationInMinutes)
      let eventOffset = eventAreaOffset + eventBlock * (width + gutter)

      ctx.fillRect(eventOffset, timeOffset + eventBlockStart, width, eventBlockHeight);

      ctx.fillStyle = 'black';
      ctx.fillText(`Event time: ${event.startsOn} duration ${eventDuration} offset ${eventOffsetMin}`, eventOffset, timeOffset + eventBlockStart + lineHeight);
      ctx.fillText(`Event name: ${eventBlock}`, eventOffset, timeOffset + eventBlockStart + lineHeight + lineHeight);
      ctx.fillText(`Event Location: ${eventBlock}`, eventOffset, timeOffset + eventBlockStart + lineHeight + lineHeight + lineHeight);

      //green stripe
      ctx.beginPath();
      ctx.lineWidth = 5;
      ctx.moveTo(eventOffset, timeOffset + eventBlockStart);
      ctx.lineTo(eventOffset, timeOffset + eventBlockStart + eventBlockHeight);
      ctx.strokeStyle = '#00bf00';
      ctx.stroke();
    }
  }

  function isHalfHour(time) {
    return new Date(time).getMinutes() === 30
  }

  let graph = {}
  function addEdge(from, to) {
    if (from in graph) {
      graph[from].push(to)
    }
    else {
      graph[from] = [to]
    }
  }

  //disconnected graph doesnt work
  // addEdge("1995-12-17T07:00", "1995-12-17T08:00")
  // addEdge("1995-12-17T07:30", "1995-12-17T09:00")
  // addEdge("1995-12-17T08:00", "1995-12-17T08:30")
  // addEdge("1995-12-17T09:00", "1995-12-17T09:30")
  // addEdge("1995-12-17T09:00", "1995-12-17T10:00")
  // addEdge("1995-12-17T09:00", "1995-12-17T10:30")
  // addEdge("1995-12-17T09:30", "1995-12-17T10:30")
  // addEdge("1995-12-17T09:30", "1995-12-17T11:00")
  // addEdge("1995-12-17T10:00", "1995-12-17T11:00")
  // addEdge("1995-12-17T10:30", "1995-12-17T11:30")
  // addEdge("1995-12-17T11:30", "1995-12-17T12:30")

  addEdge("1995-12-17T09:00", "1995-12-17T10:00")
  addEdge("1995-12-17T11:00", "1995-12-17T12:30")
  addEdge("1995-12-17T13:00", "1995-12-17T14:30")
  addEdge("1995-12-17T14:00", "1995-12-17T15:00")
  addEdge("1995-12-17T17:00", "1995-12-17T20:00")
  addEdge("1995-12-17T17:30", "1995-12-17T19:00")
  addEdge("1995-12-17T17:00", "1995-12-17T17:30")

  console.log('graph', graph)

  function getNonoverlappingEvents() {

    let startDate = new Date("1995-12-17T07:00")
    let endDate = new Date("1995-12-17T17:30")
    let largestKnownTime = "1995-12-17T07:00"
    let nextBlock = startDate
    let timeBlocks = []
    while (nextBlock < endDate) {
      if (getDateString(nextBlock) in graph) {
        // console.log(`next block  found ${getDateString(nextBlock)}`)
        let eventStart = getDateString(nextBlock)
        if (new Date(eventStart) >= new Date(largestKnownTime)) {
          console.log("non overlapping event", eventStart)
        }
        graph[eventStart].forEach((eventEnd) => {
          if (new Date(eventEnd) > new Date(largestKnownTime)) {
            largestKnownTime = eventEnd
            // console.log('------new largestKnownTime', largestKnownTime)
          }
          else {
            // console.log(`${eventEnd} is less than largestKnownTime ${largestKnownTime}`)
          }
        })
      }
      else {
        // console.log(`next block not found ${getDateString(nextBlock)}`)
      }

      let hrs = new Date(nextBlock).getMinutes()
      nextBlock = new Date(nextBlock)
      nextBlock.setMinutes(hrs + 30)
      // console.log(`next block is ${getDateString(nextBlock)}`)
    }
  }

  function getDiffInMins(dateA, dateB) {
    var diffMs = Math.abs(dateB - dateA); // milliseconds between now & Christmas
    let result =  Math.floor((diffMs/1000)/60);
    console.log(`diff bw ${dateA} & ${dateB} in min ${result}`)
    return result
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
  getNonoverlappingEvents()
}
  ;