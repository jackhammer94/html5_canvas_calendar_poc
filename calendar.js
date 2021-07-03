
window.onload = function () {
   console.log(data)

  renderCalendar();

  function renderCalendar() {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    let canvasOptions = {
      headerHeight: 80,
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
      getEventAreaWidth() {
        return this.totalCanvasWidth - this.eventAreaOffset
      },
      getMidHourOffset() {
        return this.hourMarkerOffset + 50
      },
      getSmallestEventBlockHeight() {
        return this.hourBlockHeight / (60 / this.smallestPossibleEventDurationInMinutes);
      },
      getEventAreaYOffset() {
        return this.headerHeight + (this.allDayEventsCount * this.getSmallestEventBlockHeight()) + 20
      }
    }

    let normalEvents = data.events.filter(event => !event.isAllDay)
    let allDayEvents = data.events.filter(event => event.isAllDay)
    canvasOptions.allDayEventsCount = allDayEvents.length
    let smallestEventTime = findSmallestEventTime(normalEvents)
    let largestEventTime = findLargestEventTime(normalEvents)

    let overlappingBuckets = getEventBuckets(normalEvents, smallestEventTime, largestEventTime)
    var { timeBlockEventStartMap } = createTimeBlockBucketStartMap(canvasOptions, smallestEventTime, largestEventTime, overlappingBuckets);
    renderHeader(canvasOptions, ctx, smallestEventTime)
    renderAllDayEvents(allDayEvents, canvasOptions, ctx)
    paintTimeMarkers(canvasOptions, ctx, timeBlockEventStartMap);
    renderEvents(canvasOptions, ctx, timeBlockEventStartMap, overlappingBuckets)
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

  function paintTimeMarkers(canvasOptions, ctx, timeBlockEventStartMap) {
    let lastBlockIndex = Object.keys(timeBlockEventStartMap).length
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

    for (let timeBlock = 0; timeBlock < lastBlockIndex; timeBlock++) {

      let blockTime = timeBlockEventStartMap[timeBlock].time

      let timeOffset = canvasOptions.getEventAreaYOffset() + (timeBlock * (smallestEventBlockHeight));
      let timePeriod = getTimePeriod(blockTime)
      ctx.fillStyle = timePeriod === 'AM' ? 'rgb(254, 246, 248)' : 'rgb(238, 254, 254)';
      ctx.fillRect(0, timeOffset, totalCanvasWidth, smallestEventBlockHeight);
      let markerOffset = isHourStart(blockTime) ? hourMarkerOffset : midHourMarkerOffset;

      //Print AM/PM
      if (isAMStart(blockTime) || isPMStart(blockTime) || timeBlock == 0) {
        ctx.font = `${timeMarkerFontSize}px sans-serif`;
        let periodColor = timePeriod === 'AM' ? 'rgb(237, 30, 121)' : 'rgb(63, 169, 245)'
        ctx.fillStyle = periodColor;
        ctx.fillText(getTimePeriod(blockTime), timePeriodMarkerOffset, timeOffset + timeMarkerFontSize);
        drawLine(ctx, 0, timeOffset, totalCanvasWidth, timeOffset, periodColor)
      }
      else {
        let color = isHourStart(blockTime) ? 'black' : 'gray'
        drawLine(ctx, markerOffset, timeOffset, totalCanvasWidth, timeOffset, color)
      }
      //Print Time
      ctx.font = isHourStart(blockTime) ? `normal bold ${lineHeight}px sans-serif` : `normal ${lineHeight}px sans-serif`;
      ctx.fillStyle = isHourStart(blockTime) ? 'black' : 'gray';
      ctx.fillText(`${getTimeString(blockTime)}`, markerOffset, timeOffset + lineHeight);
    }
    return { smallestEventBlockHeight, eventAreaWidth, smallestPossibleEventDurationInMinutes, eventAreaOffset, gutter, lineHeight };
  }

  function drawLine(ctx, xStart, yStart, xEnd, yEnd, color) {
    ctx.beginPath();
    ctx.lineWidth = 0.5;
    ctx.moveTo(xStart, yStart);
    ctx.lineTo(xEnd, yEnd);
    ctx.strokeStyle = color;
    ctx.stroke();
  }

  function renderHeader(canvasOptions, ctx, smallestEventTime) {
    const totalCanvasWidth = canvasOptions.totalCanvasWidth
    const headerHeight = canvasOptions.headerHeight
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, totalCanvasWidth, canvasOptions.headerHeight);
    ctx.fillStyle = "black";
    ctx.font = `normal 16px sans-serif`
    const date = smallestEventTime.toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase()
    ctx.fillText(date, totalCanvasWidth - 250, 50);
    drawLine(ctx, 0, headerHeight, totalCanvasWidth, headerHeight, "black")
  }

  function renderAllDayEvents(events, canvasOptions, ctx) {
    events.forEach((event, index) => {
      const eventYOffset = canvasOptions.headerHeight + canvasOptions.gutter + index * canvasOptions.getSmallestEventBlockHeight()
      const eventXOffset = canvasOptions.eventAreaOffset
      const width = canvasOptions.getEventAreaWidth()
      const height = canvasOptions.getSmallestEventBlockHeight()
      ctx.fillStyle = "white";
      ctx.fillRect(eventXOffset, eventYOffset, width, height);

      renderEventTime(ctx, canvasOptions, eventYOffset, eventXOffset, event);
      renderEventName(ctx, canvasOptions, eventYOffset, eventXOffset, event, width);
      renderEventLocation(ctx, canvasOptions, eventYOffset, eventXOffset, event, width);
      drawStripe(ctx, canvasOptions, eventYOffset, eventXOffset, height);
    })
  }

  function renderEvents(canvasOptions, ctx, timeBlockEventStartMap, overlappingBuckets) {
    let lastBlockIndex = Object.keys(timeBlockEventStartMap).length
    let eventAreaWidth = canvasOptions.getEventAreaWidth();
    let smallestEventBlockHeight = canvasOptions.getSmallestEventBlockHeight();

    for (let timeBlock = 0; timeBlock < lastBlockIndex; timeBlock++) {
      let timeOffset = canvasOptions.getEventAreaYOffset() + (timeBlock * (smallestEventBlockHeight))
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

  function renderEventBucket(ctx, events, timeOffset, blockTime, width, canvasOptions) {
    let eventCount = events.length
    let eventAreaOffset = canvasOptions.eventAreaOffset;
    let smallestEventBlockHeight = canvasOptions.getSmallestEventBlockHeight();
    let smallestPossibleEventDurationInMinutes = canvasOptions.smallestPossibleEventDurationInMinutes;
    let gutter = canvasOptions.gutter;
    for (let eventBlock = 0; eventBlock < eventCount; eventBlock++) {
      let event = events[eventBlock];
      let eventDuration = getEventDuration(event);
      let eventOffsetMin = getDiffInMins(new Date(blockTime), new Date(event.startsOn));
      let eventBlockStart = eventOffsetMin == 0 ? 0 : (eventOffsetMin / smallestPossibleEventDurationInMinutes) * smallestEventBlockHeight; //eventDurationStartMin == 0 ? 0 : smallestEventBlockHeight
      let eventYOffset = timeOffset + eventBlockStart
      let eventBlockHeight = smallestEventBlockHeight * (eventDuration / smallestPossibleEventDurationInMinutes);
      let eventXOffset = eventAreaOffset + eventBlock * (width + gutter);

      ctx.fillStyle = "white";
      ctx.fillRect(eventXOffset, eventYOffset, width, eventBlockHeight);

      //event info
      renderEventTime(ctx, canvasOptions, eventYOffset, eventXOffset, event);
      renderEventName(ctx, canvasOptions, eventYOffset, eventXOffset, event, width);
      renderEventLocation(ctx, canvasOptions, eventYOffset, eventXOffset, event, width);
      drawStripe(ctx, canvasOptions, eventYOffset, eventXOffset, eventBlockHeight);
    }
  }

  function renderEventTime(ctx, canvasOptions, eventYOffset, eventXOffset, event) {
    let eventTextOffset = eventXOffset + canvasOptions.eventBlockStripeWidth + 2;
    const lineHeight = canvasOptions.lineHeight
    ctx.fillStyle = 'gray';
    ctx.font = `${canvasOptions.lineHeight}px sans-serif`;
    let timeText = event.isAllDay ? "ALL DAY-" : `${getTimeString(event.startsOn)}${getTimePeriod(event.startsOn)}-`
    ctx.fillText(timeText, eventTextOffset, canvasOptions.lineSpacing + eventYOffset + lineHeight);
  }

  function renderEventName(ctx, canvasOptions, eventYOffset, eventXOffset, event, width) {
    const eventDuration = getEventDuration(event)
    const lineHeight = canvasOptions.lineHeight
    let eventTextOffset = eventXOffset + canvasOptions.eventBlockStripeWidth + 2
    ctx.font = `normal bold ${canvasOptions.lineHeight}px sans-serif`;
    ctx.fillStyle = 'black';
    const isUnitEvent = eventDuration === canvasOptions.smallestPossibleEventDurationInMinutes
    const nameYOffset = eventYOffset + (isUnitEvent || event.isAllDay ? (lineHeight + canvasOptions.lineSpacing) : (lineHeight + canvasOptions.lineSpacing) * 2);
    const nameXOffset = isUnitEvent || event.isAllDay ? eventTextOffset + ctx.measureText("00:00AM-").width : eventTextOffset;
    const nameText = nameXOffset + ctx.measureText(event.name).width < eventXOffset + width ? event.name : event.name.slice(0, "00:00AM-".length - 3) + "...";
    ctx.fillText(nameText, nameXOffset, nameYOffset);
  }

  function getEventDuration(event) {
    let eventStart = new Date(event.startsOn);
    let eventEnd = new Date(event.endsOn);
    let eventDuration = getDiffInMins(eventStart, eventEnd);
    return eventDuration;
  }

  function renderEventLocation(ctx, canvasOptions, eventYOffset, eventXOffset, event, width) {
    const eventDuration = getEventDuration(event)
    const lineHeight = canvasOptions.lineHeight
    const isUnitEvent = eventDuration === canvasOptions.smallestPossibleEventDurationInMinutes
    const lineHeightOffset = isUnitEvent || event.isAllDay ? (lineHeight + canvasOptions.lineSpacing) : (lineHeight + canvasOptions.lineSpacing) * 3;
    const locationYOffset = eventYOffset + lineHeightOffset

    const lineWidthOffset = isUnitEvent || event.isAllDay ? ctx.measureText("00:00AM-").width + ctx.measureText(event.name).width : 0
    const locationXOffset = eventXOffset + canvasOptions.eventBlockStripeWidth + 2 + lineWidthOffset;

    const locationText = locationXOffset + ctx.measureText(event.location).width < eventXOffset + width ? event.location : event.location.slice(0, event.name.length - 3) + "...";
    ctx.font = `normal lighter ${canvasOptions.lineHeight}px sans-serif`;
    ctx.fillStyle = '#00bf00';
    ctx.fillText(locationText, locationXOffset, locationYOffset);
  }

  function drawStripe(ctx, canvasOptions, eventStartYOffset, eventStartXOffset, eventBlockHeight) {
    ctx.beginPath();
    ctx.lineWidth = canvasOptions.eventBlockStripeWidth;
    ctx.moveTo(eventStartXOffset, eventStartYOffset);
    ctx.lineTo(eventStartXOffset, eventStartYOffset + eventBlockHeight);
    ctx.strokeStyle = '#00bf00';
    ctx.stroke();
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
        let eventStart = getDateString(nextBlock)
        if (new Date(eventStart) >= new Date(largestKnownTime)) {
          console.log("non overlapping event", eventStart)
          bucketBounds.push(eventStart)
        }

        eventIndex[eventStart].forEach((event) => {
          if (new Date(event.endsOn) > new Date(largestKnownTime)) {
            largestKnownTime = event.endsOn
          }
        })
      }

      let hrs = new Date(nextBlock).getMinutes()
      nextBlock = new Date(nextBlock)
      nextBlock.setMinutes(hrs + 30)
    }
    bucketBounds.push(getDateString(endDate)) //adding boundary to makesure index+1 works
    console.log('bucket bounds', bucketBounds)
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
      }
    })
    console.log('buckets', overlappingBuckets)
    return overlappingBuckets
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





