// import data from 'data.json'


window.onload = function () {
  const data = {
    events: [
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
  addEvent("1995-12-17T07:00", "1995-12-17T08:00")
  addEvent("1995-12-17T07:30", "1995-12-17T09:00")
  addEvent("1995-12-17T08:00", "1995-12-17T08:30")
  addEvent("1995-12-17T09:00", "1995-12-17T09:30")
  addEvent("1995-12-17T09:00", "1995-12-17T10:00")
  addEvent("1995-12-17T09:00", "1995-12-17T10:30")
  addEvent("1995-12-17T09:30", "1995-12-17T10:30")
  addEvent("1995-12-17T09:30", "1995-12-17T11:00")
  addEvent("1995-12-17T10:00", "1995-12-17T11:00")
  addEvent("1995-12-17T10:30", "1995-12-17T11:30")
  addEvent("1995-12-17T11:30", "1995-12-17T12:30")

  // addEvent("1995-12-17T09:00", "1995-12-19T10:00")
  // addEvent("1995-12-17T09:00", "1995-12-17T10:00")
  // addEvent("1995-12-17T11:00", "1995-12-17T12:30")
  // addEvent("1995-12-17T13:00", "1995-12-17T14:30")
  // addEvent("1995-12-17T14:00", "1995-12-17T15:00")
  // addEvent("1995-12-17T17:00", "1995-12-17T20:00")
  // addEvent("1995-12-17T17:30", "1995-12-17T19:00")
  // addEvent("1995-12-17T17:00", "1995-12-17T17:30")

  console.log(data)

  renderCalendar();

  function renderCalendar() {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    let canvasOptions = {
      lineHeight: 17.332,
      lineSpacing: 6,
      timeMarkerFontSize: 25,
      gutter: 10,
      hourBlockHeight: 80,
      smallestPossibleEventDurationInMinutes: 30,
      eventAreaOffset: 250,
      hourMarkerOffset: 150,
      timePeriodMarkerOffset: 50,
      totalCanvasWidth: 1200,
      eventBlockStripeWidth: 5,
      getMidHourOffset() {
        return this.hourMarkerOffset + 50
      },
      getSmallestEventBlockHeight() {
        return this.hourBlockHeight / (60 / this.smallestPossibleEventDurationInMinutes);
      }
    }

    let smallestEventTime = findSmallestEventTime(data.events)
    let largestEventTime = findLargestEventTime(data.events)

    let overlappingBuckets = getEventBuckets(data.events, smallestEventTime, largestEventTime)
    var { lastBlockIndex, timeBlockEventStartMap } = createTimeBlockBucketStartMap(canvasOptions, smallestEventTime, largestEventTime, overlappingBuckets);
    paintTimeMarkers(canvasOptions, lastBlockIndex, ctx, timeBlockEventStartMap);
    renderEvents(canvasOptions, ctx, lastBlockIndex, timeBlockEventStartMap, overlappingBuckets)
  }

  function createTimeBlockBucketStartMap(canvasOptions, smallestEventTime, largestEventTime, overlappingBuckets) {
    const timeBlockBucketStartMap = {};
    let smallestPossibleEventDurationInMinutes = canvasOptions.smallestPossibleEventDurationInMinutes;
    let smallestEventStartTime = smallestEventTime;
    let largestEventEndTime = largestEventTime;
    let totalEventDurationMins = getDiffInMins(smallestEventStartTime, largestEventEndTime)

    //splitting into blocks of 30 min each
    let lastBlockIndex = totalEventDurationMins / smallestPossibleEventDurationInMinutes;
    let i = 0;
    let bucketStart = smallestEventStartTime;
    while (i <= lastBlockIndex) {
      if (getDateString(bucketStart) in overlappingBuckets) {
        timeBlockBucketStartMap[i] = { time: getDateString(bucketStart), hasEvents: true };
      }
      else {
        timeBlockBucketStartMap[i] = { time: getDateString(bucketStart), hasEvents: false };
      }
      let hrs = new Date(bucketStart).getMinutes();
      bucketStart = new Date(bucketStart);
      bucketStart.setMinutes(hrs + smallestPossibleEventDurationInMinutes);
      i++;
    }
    console.log("timeblockeventstartmap", timeBlockBucketStartMap);
    return { lastBlockIndex, timeBlockEventStartMap: timeBlockBucketStartMap };
  }

  function renderEvents(canvasOptions, ctx, lastBlockIndex, timeBlockEventStartMap, overlappingBuckets) {
    let totalCanvasWidth = canvasOptions.totalCanvasWidth;
    let eventAreaOffset = canvasOptions.eventAreaOffset;
    let eventAreaWidth = totalCanvasWidth - eventAreaOffset;
    let smallestEventBlockHeight = canvasOptions.getSmallestEventBlockHeight();

    for (let timeBlock = 0; timeBlock <= lastBlockIndex; timeBlock++) {
      let timeOffset = (timeBlock * (smallestEventBlockHeight))
      if (!timeBlockEventStartMap[timeBlock].hasEvents) {
        continue //skip time block if it is not in bucket
      }
      let blockTime = timeBlockEventStartMap[timeBlock].time
      let events = overlappingBuckets[blockTime]
      let overlappingEventCount = events.length
      let width = (eventAreaWidth / overlappingEventCount) - canvasOptions.gutter
      renderEventBucket(ctx, events, timeOffset, blockTime, width, canvasOptions);
    }
  }

  function paintTimeMarkers(canvasOptions, lastBlockIndex, ctx, timeBlockEventStartMap) {
    let totalCanvasWidth = canvasOptions.totalCanvasWidth;
    let timePeriodMarkerOffset = canvasOptions.timePeriodMarkerOffset;
    let hourMarkerOffset = canvasOptions.hourMarkerOffset;
    let midHourMarkerOffset = canvasOptions.getMidHourOffset();
    let eventAreaOffset = canvasOptions.eventAreaOffset;
    let eventAreaWidth = totalCanvasWidth - eventAreaOffset;
    let smallestEventBlockHeight = canvasOptions.getSmallestEventBlockHeight();
    let smallestPossibleEventDurationInMinutes = canvas.smallestPossibleEventDurationInMinutes;

    let gutter = canvasOptions.gutter;
    let lineHeight = canvasOptions.lineHeight;
    let timeMarkerFontSize = canvasOptions.timeMarkerFontSize;

    //paint time markers
    for (let timeBlock = 0; timeBlock <= lastBlockIndex; timeBlock++) {

      let blockTime = timeBlockEventStartMap[timeBlock].time

      let timeOffset = (timeBlock * (smallestEventBlockHeight));
      let timePeriod = getTimePeriod(blockTime)
      ctx.fillStyle = timePeriod === 'AM' ? 'rgb(254, 246, 248)' : 'rgb(238, 254, 254)';
      ctx.fillRect(0, timeOffset, totalCanvasWidth, smallestEventBlockHeight);

      if (isAMStart(blockTime) || isPMStart(blockTime) || timeBlock == 0) {
        ctx.font = `${timeMarkerFontSize}px sans-serif`;
        ctx.fillStyle = timePeriod === 'AM' ? 'rgb(237, 30, 121)' : 'rgb(63, 169, 245)';
        ctx.fillText(getTimePeriod(blockTime), timePeriodMarkerOffset, (timeBlock * (smallestEventBlockHeight)) + timeMarkerFontSize);
      }
      let markerOffset = isHourStart(blockTime) ? hourMarkerOffset : midHourMarkerOffset;
      ctx.beginPath();
      ctx.lineWidth = 0.5;
      ctx.moveTo(markerOffset, timeOffset);
      ctx.lineTo(totalCanvasWidth, timeOffset);
      ctx.strokeStyle = isHourStart(blockTime) ? 'black' : 'gray';
      ctx.stroke();

      ctx.font = isHourStart(blockTime) ? `normal bold ${lineHeight}px sans-serif` : `normal ${lineHeight}px sans-serif`;
      ctx.fillStyle = isHourStart(blockTime) ? 'black' : 'gray';
      ctx.fillText(`${getTimeString(blockTime)}`, markerOffset, timeOffset + lineHeight);
    }
    return { smallestEventBlockHeight, eventAreaWidth, smallestPossibleEventDurationInMinutes, eventAreaOffset, gutter, lineHeight };
  }

  function renderEventBucket(ctx, events, timeOffset, blockTime, width, canvasOptions) {
    let eventCount = events.length
    let eventAreaOffset = canvasOptions.eventAreaOffset;
    let smallestEventBlockHeight = canvasOptions.getSmallestEventBlockHeight();
    let smallestPossibleEventDurationInMinutes = canvasOptions.smallestPossibleEventDurationInMinutes;
    let gutter = canvasOptions.gutter;
    let lineHeight = canvasOptions.lineHeight;
    for (let eventBlock = 0; eventBlock < eventCount; eventBlock++) {
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

      let eventTextOffset = eventOffset + canvasOptions.eventBlockStripeWidth + 2
      ctx.fillStyle = 'gray';
      ctx.font = `${canvasOptions.lineHeight}px sans-serif`;
      ctx.fillText(`${getTimeString(event.startsOn)}${getTimePeriod(event.startsOn)}-`, eventTextOffset, canvasOptions.lineSpacing + timeOffset + eventBlockStart + lineHeight);

      ctx.font = `normal bold ${canvasOptions.lineHeight}px sans-serif`
      ctx.fillStyle = 'black';
      const nameYOffset = timeOffset + eventBlockStart + (eventDuration === smallestPossibleEventDurationInMinutes ? (lineHeight + canvasOptions.lineSpacing) : (lineHeight + canvasOptions.lineSpacing) * 2)
      const nameXOffset = eventDuration === smallestPossibleEventDurationInMinutes ? eventTextOffset + ctx.measureText("00:00AM-").width : eventTextOffset
      const nameText = nameXOffset + ctx.measureText(event.name).width < eventOffset+ width   ? event.name : event.name.slice(0,"00:00AM-".length - 3) + "..."
      console.log(`name x-${nameXOffset+ctx.measureText(event.name).width} width: ${eventOffset+width} diff:${(eventOffset+width)-(nameXOffset+ctx.measureText(event.name).width)}`)
      ctx.fillText(nameText, nameXOffset, nameYOffset);

      const locationYOffset = timeOffset + eventBlockStart + (eventDuration === smallestPossibleEventDurationInMinutes ? (lineHeight + canvasOptions.lineSpacing) : (lineHeight + canvasOptions.lineSpacing) * 3)
      const locationXOffset = eventDuration === smallestPossibleEventDurationInMinutes ? eventTextOffset + ctx.measureText("00:00AM-").width + ctx.measureText(event.name).width : eventTextOffset
      const locationText = locationXOffset + ctx.measureText(event.location).width < eventOffset + width ? event.location :  event.location.slice(0, nameText.length-3)+ "..."
      ctx.font = `normal lighter ${canvasOptions.lineHeight}px sans-serif`
      ctx.fillStyle = '#00bf00';
      ctx.fillText(locationText, locationXOffset, locationYOffset);

      //green stripe
      ctx.beginPath();
      ctx.lineWidth = canvasOptions.eventBlockStripeWidth;
      ctx.moveTo(eventOffset, timeOffset + eventBlockStart);
      ctx.lineTo(eventOffset, timeOffset + eventBlockStart + eventBlockHeight);
      ctx.strokeStyle = '#00bf00';
      ctx.stroke();
    }
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

  function getNonoverlappingBounds(eventIndex, smallestEventTime, largestEventTime) {
    let startDate = smallestEventTime
    let endDate = largestEventTime
    let largestKnownTime = getDateString(startDate)
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
        console.log(`next block not found ${getDateString(nextBlock)}`)
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

  function getEventBuckets(events, smallestEventTime, largestEventTime) {
    let eventIndex = indexEvents(events)
    let bucketBounds = getNonoverlappingBounds(eventIndex, smallestEventTime, largestEventTime)
    let overlappingBuckets = {}
    bucketBounds.forEach((bucketStart, index) => {
      for (let event of events) {
        if (new Date(event.startsOn) >= new Date(bucketStart) && new Date(event.endsOn) <= new Date(bucketBounds[index + 1])) {
          if (bucketStart in overlappingBuckets) {
            overlappingBuckets[bucketStart].push(event)
          }
          else {
            overlappingBuckets[bucketStart] = [event]
          }
        }
        else {
          console.log(`${event.startsOn} ${event.endsOn} ${bucketStart} not in bucket`)
        }
      }
    })
    console.log('overlapping buckets', overlappingBuckets)
    return overlappingBuckets
  }

  function getDiffInMins(dateA, dateB) {
    var diffMs = Math.abs(dateB - dateA);
    let result = Math.floor((diffMs / 1000) / 60);
    console.log(`diff bw ${dateA} & ${dateB} in min ${result}`)
    return result
  }

  function getTimeString(d) {
    var date = new Date(d)
    var hrs = ("0" + date.getHours()).slice(-2)
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

  function findSmallestEventTime(events) {
    let startsOn = [...events].sort(function (a, b) {
      return new Date(b.startsOn) - new Date(a.startsOn);
    }).pop().startsOn;
    return new Date(startsOn)
  }

  function findLargestEventTime(events) {
    let endsOn = [...events].sort(function (a, b) {
      return new Date(b.endsOn) - new Date(a.endsOn);
    }).shift().endsOn;
    return new Date(endsOn)
  }
}
  ;





