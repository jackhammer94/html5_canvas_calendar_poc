// import data from 'data.json'

window.onload = function () {
  const data = {
    events: [
      {
        name: 'testEvent-1y',
        location: 'india',
        startsOn: "1995-12-17T09:00",
        endsOn: "1995-12-17T10:00",
        isAllDay: true
      },
      {
        name: 'testEvent-2',
        location: 'india',
        startsOn: "1995-12-17T11:00",
        endsOn: "1995-12-17T12:30",
        isAllDay: true
      },
      {
        name: 'testEvent-3',
        location: 'india',
        startsOn: "1995-12-17T13:00",
        endsOn: "1995-12-17T14:30",
        isAllDay: true
      },
      {
        name: 'testEvent-4',
        location: 'india',
        startsOn: "1995-12-17T14:00",
        endsOn: "1995-12-17T15:00",
        isAllDay: true
      },
      {
        name: 'testEvent-5',
        location: 'india',
        startsOn: "1995-12-17T17:00",
        endsOn: "1995-12-17T20:00",
        isAllDay: true
      },
      {
        name: 'testEvent-6',
        location: 'india',
        startsOn: "1995-12-17T17:30",
        endsOn: "1995-12-17T19:00",
        isAllDay: true
      },
      {
        name: 'testEvent-7',
        location: 'india',
        startsOn: "1995-12-17T17:00",
        endsOn: "1995-12-17T17:30",
        isAllDay: true
      }
    ]
  };
  console.log(data)

// const overlappingBuckets = {
//     "1995-12-17T09:00": [
//       {
//         name: 'testEvent-1y',
//         location: 'india',
//         startsOn: "1995-12-17T09:00",
//         endsOn: "1995-12-17T10:00",
//         isAllDay: true
//       }
//     ],
//     "1995-12-17T11:00": [
//       {
//         name: 'testEvent-1y',
//         location: 'india',
//         startsOn: "1995-12-17T11:00",
//         endsOn: "1995-12-17T12:30",
//         isAllDay: true
//       }],
//     "1995-12-17T13:00": [
//       {
//         name: 'testEvent-1y',
//         location: 'india',
//         startsOn: "1995-12-17T13:00",
//         endsOn: "1995-12-17T14:30",
//         isAllDay: true
//       },
//       {
//         name: 'testEvent-1y',
//         location: 'india',
//         startsOn: "1995-12-17T14:00",
//         endsOn: "1995-12-17T15:00",
//         isAllDay: true
//       }],
//     "1995-12-17T17:00": [
//       {
//         name: 'testEvent-1y',
//         location: 'india',
//         startsOn: "1995-12-17T17:00",
//         endsOn: "1995-12-17T20:00",
//         isAllDay: true
//       },
//       {
//         name: 'testEvent-1y',
//         location: 'india',
//         startsOn: "1995-12-17T17:30",
//         endsOn: "1995-12-17T19:00",
//         isAllDay: true
//       },
//       {
//         name: 'testEvent-1y',
//         location: 'india',
//         startsOn: "1995-12-17T17:00",
//         endsOn: "1995-12-17T17:30",
//         isAllDay: true
//       }
//     ]
//   }

  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");

  let canvasOptions = {
    lineHeight: 10,
    timeMarkerFontSize: 25,
    gutter: 10,
    hourBlockHeight: 80,
    smallestPossibleEventDurationInMinutes: 30,
    eventAreaOffset: 350,
    midHourMarkerOffset: 250,
    hourMarkerOffset: 150,
    timePeriodMarkerOffset: 50,
    totalCanvasWidth: 1200
  }

  let overlappingBuckets = getOverlappingBuckets(data.events)
  var { lastBlockIndex, timeBlockEventStartMap } = createTimeBlockBucketStartMap(overlappingBuckets);
  paintTimeMarkers(canvasOptions, lastBlockIndex, ctx, timeBlockEventStartMap);
  renderEvents(lastBlockIndex, timeBlockEventStartMap, overlappingBuckets)

  function createTimeBlockBucketStartMap(overlappingBuckets) {
    const timeBlockEventStartMap = {};
    //TODO: get largest event end time
    let smallestEventStartTime = new Date("1995-12-17T09:00");
    let largestEventEndTime = new Date("1995-12-17T20:00");
    let lastTimeBlock = largestEventEndTime.getHours() - smallestEventStartTime.getHours();

    //splitting into blocks of 30 min each
    console.log('lasttimeblock', (lastTimeBlock * 60) / 30); 
    let lastBlockIndex = (lastTimeBlock * 60) / 30;
    let i = 0;
    let bucketStart = smallestEventStartTime;
    while (i < lastBlockIndex) {
      if (getDateString(bucketStart) in overlappingBuckets) {
        timeBlockEventStartMap[i] = { time: getDateString(bucketStart), hasEvents: true };
      }
      else {
        timeBlockEventStartMap[i] = { time: getDateString(bucketStart), hasEvents: false };
      }
      let hrs = new Date(bucketStart).getMinutes();
      bucketStart = new Date(bucketStart);
      bucketStart.setMinutes(hrs + 30);
      i++;
    }
    console.log("timeblockeventstartmap", timeBlockEventStartMap);
    return { lastBlockIndex, timeBlockEventStartMap };
  }

  function renderEvents(lastBlockIndex,timeBlockEventStartMap,overlappingBuckets){
  let totalCanvasWidth = canvasOptions.totalCanvasWidth;
  let eventAreaOffset = canvasOptions.eventAreaOffset;
  let eventAreaWidth = totalCanvasWidth - eventAreaOffset;

  let hourBlockHeight = canvasOptions.hourBlockHeight;
  let smallestEventBlockHeight = hourBlockHeight / 2;
  
  for (let timeBlock = 0; timeBlock < lastBlockIndex; timeBlock++) {
    let timeOffset = (timeBlock * (smallestEventBlockHeight)) // (timeBlock*(timeBlockSize + gutter))
    if (!timeBlockEventStartMap[timeBlock].hasEvents) {
      continue //skip time block if it is not in bucket
    }
    let blockTime = timeBlockEventStartMap[timeBlock].time
    let events = overlappingBuckets[blockTime]
    let overlappingEventCount = events.length
    let width = (eventAreaWidth / overlappingEventCount)
    renderEventBucket(overlappingEventCount, ctx, events, timeOffset, blockTime, width, canvasOptions);
  }
}

  function paintTimeMarkers(canvasOptions, lastBlockIndex, ctx, timeBlockEventStartMap) {
    let totalCanvasWidth = canvasOptions.totalCanvasWidth;
    let timePeriodMarkerOffset = canvasOptions.timePeriodMarkerOffset;
    let hourMarkerOffset = canvasOptions.hourMarkerOffset;
    let midHourMarkerOffset = canvasOptions.midHourMarkerOffset;
    let eventAreaOffset = canvasOptions.eventAreaOffset;
    let eventAreaWidth = totalCanvasWidth - eventAreaOffset;
  
    let hourBlockHeight = canvasOptions.hourBlockHeight;
    let smallestEventBlockHeight = hourBlockHeight / 2;
    let smallestPossibleEventDurationInMinutes = canvas.smallestPossibleEventDurationInMinutes;
  
    let gutter = canvasOptions.gutter;
    let lineHeight = canvasOptions.lineHeight;
    let timeMarkerFontSize = canvasOptions.timeMarkerFontSize;
  
    //paint time markers
    for (timeBlock = 0; timeBlock < lastBlockIndex; timeBlock++) {
      if (timeBlock % 12 == 0) {
        ctx.font = `${timeMarkerFontSize}px Arial`;
        ctx.fillStyle = 'black';
        ctx.fillText(`PM`, timePeriodMarkerOffset, (timeBlock * (hourBlockHeight)) + timeMarkerFontSize);
      }
      let timeOffset = (timeBlock * (smallestEventBlockHeight));
      let markerOffset = isHalfHour(timeBlockEventStartMap[timeBlock].time) ? midHourMarkerOffset : hourMarkerOffset;
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.moveTo(markerOffset, timeOffset);
      ctx.lineTo(totalCanvasWidth, timeOffset);
      ctx.strokeStyle = 'gray';
      ctx.stroke();
  
      ctx.font = "10px Arial";
      ctx.fillStyle = 'black';
      ctx.fillText(`${timeBlockEventStartMap[timeBlock].time} PM`, markerOffset, timeOffset + lineHeight);
    }
    return { smallestEventBlockHeight, eventAreaWidth, smallestPossibleEventDurationInMinutes, eventAreaOffset, gutter, lineHeight };
  }

  function renderEventBucket(overlappingEventCount, ctx, events, timeOffset, blockTime, width, canvasOptions) {
    let eventAreaOffset = canvasOptions.eventAreaOffset;
    let hourBlockHeight = canvasOptions.hourBlockHeight;
    let smallestEventBlockHeight = hourBlockHeight / 2;
    let smallestPossibleEventDurationInMinutes = canvasOptions.smallestPossibleEventDurationInMinutes;
    let gutter = canvasOptions.gutter;
    let lineHeight = canvasOptions.lineHeight;
    for (let eventBlock = 0; eventBlock < overlappingEventCount; eventBlock++) {
      ctx.fillStyle = "white";
  
      let event = events[eventBlock];
      let eventStart = new Date(event.startsOn);
      let eventEnd = new Date(event.endsOn);
      let eventDuration = getDiffInMins(eventStart, eventEnd);
  
      let eventOffsetMin = getDiffInMins(new Date(blockTime), eventStart);
      // console.log(`ev offset ${eventOffset} for ev  for ${events[eventBlock]}`);
      let eventBlockStart = eventOffsetMin == 0 ? 0 : (eventOffsetMin / smallestPossibleEventDurationInMinutes) * smallestEventBlockHeight; //eventDurationStartMin == 0 ? 0 : smallestEventBlockHeight
      let eventBlockHeight = smallestEventBlockHeight * (eventDuration / smallestPossibleEventDurationInMinutes);
      let eventOffset = eventAreaOffset + eventBlock * (width + gutter);
  
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

  function indexEvents(events) {
    let eventIndex = {}
    events.forEach(event => {
      if (event.startsOn in eventIndex) {
        eventIndex[event.startsOn].push(event)
      }
      else {
        eventIndex[event.startsOn] = [event]
      }
    });
    console.log('event index', eventIndex)
    return eventIndex
  }

  function getNonoverlappingBounds(events) {
    let eventIndex = indexEvents(events)
    let startDate = new Date("1995-12-17T07:00")
    let endDate = new Date("1995-12-17T20:00")
    let largestKnownTime = "1995-12-17T07:00"
    let nextBlock = startDate
    let bucketBounds = []

    while (nextBlock < endDate) {

      if (getDateString(nextBlock) in eventIndex) {
        // console.log(`next block  found ${getDateString(nextBlock)}`)
        let eventStart = getDateString(nextBlock)
        if (new Date(eventStart) >= new Date(largestKnownTime)) {
          console.log("non overlapping event", eventStart)
          bucketBounds.push(eventStart)
        }

        eventIndex[eventStart].forEach((event) => {
          if (new Date(event.endsOn) > new Date(largestKnownTime)) {
            largestKnownTime = event.endsOn
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
    bucketBounds.push(getDateString(endDate)) //adding boundary to makesure index+1 works
    console.log('event buckets', bucketBounds)
    return bucketBounds
  }

  function getOverlappingBuckets(events){
    let bucketBounds = getNonoverlappingBounds(events)
    let overlappingBuckets = {}
    bucketBounds.forEach((bucketStart, index) => {
      for (let event of events) {
        if (new Date(event.startsOn) >= new Date(bucketStart) && new Date(event.endsOn) <= new Date(bucketBounds[index + 1])) {
          if (bucketStart in overlappingBuckets) {
            overlappingBuckets[bucketStart].push(event)
          }
          else{
            overlappingBuckets[bucketStart] = [event]
          }
        }
      }
    })
    console.log('overlapping buckets', overlappingBuckets)
    return overlappingBuckets
  }

  function getDiffInMins(dateA, dateB) {
    var diffMs = Math.abs(dateB - dateA); // milliseconds between now & Christmas
    let result = Math.floor((diffMs / 1000) / 60);
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
}
  ;





