// import data from 'data.json'

window.onload =   function () {
    const data = {
      events: [
        {
          name: 'testEvent-allday',
          location: 'india',
          startsOn: {
            date: 'June 30, 2021',
            time: '00:00:00'
          },
          endsOn: {
            date: 'June 30, 2021',
            time: '00:00:00'
          },
          isAllDay: true
        },
        {
          name: 'testEvent-1',
          location: 'india',
          startsOn: {
            date: 'June 30, 2021',
            time: '03:24:00'
          },
          endsOn: {
            date: 'June 30, 2021',
            time: '03:24:00'
          },
          isAllDay: false
        },
        {
          name: 'testEvent-2',
          location: 'india',
          startsOn: {
            date: 'June 30, 2021',
            time: '03:24:00'
          },
          endsOn: {
            date: 'June 30, 2021',
            time: '03:24:00'
          },
          isAllDay: false
        },
        {
          name: 'testEvent-overlap-1',
          location: 'india',
          startsOn: {
            date: 'June 30, 2021',
            time: '03:00:00'
          },
          endsOn: {
            date: 'June 30, 2021',
            time: '04:00:00'
          },
          isAllDay: false
        },
        // {
        //   name: 'testEvent-overlap-2',
        //   location: 'india',
        //   startsOn: {
        //     date: 'June 30, 2021',
        //     time: '03:30:00'
        //   },
        //   endsOn: {
        //     date: 'June 30, 2021',
        //     time: '04:00:00'
        //   },
        //   isAllDay: true
        // },
        // {
        //   name: 'testEvent-overlap-3',
        //   location: 'india',
        //   startsOn: {
        //     date: 'June 30, 2021',
        //     time: '03:45:00'
        //   },
        //   endsOn: {
        //     date: 'June 30, 2021',
        //     time: '04:00:00'
        //   },
        //   isAllDay: true
        // }
      ]
    };
    console.log(data)
    const currentTime = new Date("June 30, 2021 00:00:00")
    const eventMap = {
      "9": [
        {
          name: 'testEvent-1y',
          location: 'india',
          startsOn: {
            date: 'June 30, 2021',
            time: '09:00:00'
          },
          endsOn: {
            date: 'June 30, 2021',
            time: '10:00:00'
          },
          isAllDay: true
        }
      ],
      // "9:30": [

      // ],
      // "10": [

      // ],
      // "10:30": [

      // ],
      "11": [
        {
          name: 'testEvent-2y',
          location: 'india',
          startsOn: {
            date: 'June 30, 2021',
            time: '11:00:00'
          },
          endsOn: {
            date: 'June 30, 2021',
            time: '12:30:00'
          },
          isAllDay: true
        }
      ]
    }
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    let totalCanvasWidth = 1200
    let timePeriodMarkerOffset = 50;
    let hourMarkerOffset = 150;
    let midHourMarkerOffset = 250
    let eventAreaOffset = 350;
    let eventAreaWidth = totalCanvasWidth - eventAreaOffset;

    let hourBlockHeight = 80
    let smallestEventBlockHeight = hourBlockHeight /2
    let smallestPossibleEventDurationInMinutes = 30

    let overlappingEventCount = 3
    let gutter = 10
    let lineHeight = 10
    let timeMarkerFontSize = 25

    //paint time markers
    for(timeBlock=0; timeBlock< 24; timeBlock++){
      if(timeBlock % 12 == 0){
        ctx.font = `${timeMarkerFontSize}px Arial`;
        ctx.fillStyle = 'black'; 
        ctx.fillText(`PM`, timePeriodMarkerOffset, (timeBlock*(hourBlockHeight)) + timeMarkerFontSize); 
      }
      let timeOffset =(timeBlock*(hourBlockHeight)) 
      //hour marker
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.moveTo(hourMarkerOffset,timeOffset);
      ctx.lineTo(totalCanvasWidth,timeOffset);
      ctx.strokeStyle = 'gray'; 
      ctx.stroke();

      ctx.font = "10px Arial";
      ctx.fillStyle = 'black'; 
      ctx.fillText(`Time: ${timeBlock} PM`, hourMarkerOffset, timeOffset + lineHeight ); 

      //mid hour marker
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.moveTo(midHourMarkerOffset,timeOffset + (hourBlockHeight/2));
      ctx.lineTo(totalCanvasWidth,timeOffset +  (hourBlockHeight/2));
      ctx.strokeStyle = 'gray'; 
      ctx.stroke();

      ctx.font = "10px Arial";
      ctx.fillStyle = 'black'; 
      ctx.fillText(`Time: ${timeBlock}:30 PM`, midHourMarkerOffset,timeOffset + (hourBlockHeight/2) + lineHeight ); 
    }

    for(timeBlock=0; timeBlock< 10; timeBlock++){
      let timeOffset =(timeBlock*(hourBlockHeight)) // (timeBlock*(timeBlockSize + gutter))
      let width = (eventAreaWidth / overlappingEventCount)
      for(eventBlock=0; eventBlock<overlappingEventCount; eventBlock++){
        ctx.fillStyle = "white";// timeBlock %2 === 0 ? "#FF0000" : "blue"; 

        let eventDurations = [30,60,90,120]
        let eventDuration = eventDurations[Math.floor(Math.random()*eventDurations.length)]
        let eventDurationStartMins = [0, 30]
        let eventDurationStartMin = eventDurationStartMins[Math.floor(Math.random()*eventDurationStartMins.length)]

        let eventBlockStart =eventDurationStartMin == 0 ? 0 : smallestEventBlockHeight
        let eventBlockHeight = smallestEventBlockHeight * (eventDuration/smallestPossibleEventDurationInMinutes)
        let eventOffset = eventAreaOffset + eventBlock*(width + gutter)
        
        ctx.fillRect(eventOffset, timeOffset + eventBlockStart, width, eventBlockHeight);

        ctx.fillStyle = 'black'; 
        ctx.fillText(`Event time: ${timeBlock} ${eventDurationStartMin} PM  duration ${eventDuration}`, eventOffset, timeOffset + eventBlockStart + lineHeight ); 
        ctx.fillText(`Event name: ${eventBlock}`, eventOffset, timeOffset + eventBlockStart  + lineHeight + lineHeight); 
        ctx.fillText(`Event Location: ${eventBlock}`, eventOffset, timeOffset + eventBlockStart + lineHeight  + lineHeight + lineHeight); 

        //green stripe
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.moveTo(eventOffset,timeOffset + eventBlockStart);
        ctx.lineTo(eventOffset,timeOffset + eventBlockStart + eventBlockHeight);
        ctx.strokeStyle = '#00bf00'; 
        ctx.stroke();
      }
    }
  }
;