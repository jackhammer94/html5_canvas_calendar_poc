// import data from 'data.json'

window.onload = function () {
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
  let smallestEventBlockHeight = hourBlockHeight / 2
  let smallestPossibleEventDurationInMinutes = 30

  let overlappingEventCount = 3
  let gutter = 10
  let lineHeight = 10
  let timeMarkerFontSize = 25

  //paint time markers
  for (timeBlock = 0; timeBlock < 24; timeBlock++) {
    if (timeBlock % 12 == 0) {
      ctx.font = `${timeMarkerFontSize}px Arial`;
      ctx.fillStyle = 'black';
      ctx.fillText(`PM`, timePeriodMarkerOffset, (timeBlock * (hourBlockHeight)) + timeMarkerFontSize);
    }
    let timeOffset = (timeBlock * (hourBlockHeight))
    //hour marker
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.moveTo(hourMarkerOffset, timeOffset);
    ctx.lineTo(totalCanvasWidth, timeOffset);
    ctx.strokeStyle = 'gray';
    ctx.stroke();

    ctx.font = "10px Arial";
    ctx.fillStyle = 'black';
    ctx.fillText(`Time: ${timeBlock} PM`, hourMarkerOffset, timeOffset + lineHeight);

    //mid hour marker
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.moveTo(midHourMarkerOffset, timeOffset + (hourBlockHeight / 2));
    ctx.lineTo(totalCanvasWidth, timeOffset + (hourBlockHeight / 2));
    ctx.strokeStyle = 'gray';
    ctx.stroke();

    ctx.font = "10px Arial";
    ctx.fillStyle = 'black';
    ctx.fillText(`Time: ${timeBlock}:30 PM`, midHourMarkerOffset, timeOffset + (hourBlockHeight / 2) + lineHeight);
  }

  for (timeBlock = 0; timeBlock < 10; timeBlock++) {
    let timeOffset = (timeBlock * (hourBlockHeight)) // (timeBlock*(timeBlockSize + gutter))
    let width = (eventAreaWidth / overlappingEventCount)
    for (eventBlock = 0; eventBlock < overlappingEventCount; eventBlock++) {
      ctx.fillStyle = "white";// timeBlock %2 === 0 ? "#FF0000" : "blue"; 

      let eventDurations = [30, 60, 90, 120]
      let eventDuration = eventDurations[Math.floor(Math.random() * eventDurations.length)]
      let eventDurationStartMins = [0, 30]
      let eventDurationStartMin = eventDurationStartMins[Math.floor(Math.random() * eventDurationStartMins.length)]

      let eventBlockStart = eventDurationStartMin == 0 ? 0 : smallestEventBlockHeight
      let eventBlockHeight = smallestEventBlockHeight * (eventDuration / smallestPossibleEventDurationInMinutes)
      let eventOffset = eventAreaOffset + eventBlock * (width + gutter)

      ctx.fillRect(eventOffset, timeOffset + eventBlockStart, width, eventBlockHeight);

      ctx.fillStyle = 'black';
      ctx.fillText(`Event time: ${timeBlock} ${eventDurationStartMin} PM  duration ${eventDuration}`, eventOffset, timeOffset + eventBlockStart + lineHeight);
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
  addEdge("1995-12-17T07:00", "1995-12-17T08:00")
  addEdge("1995-12-17T07:30", "1995-12-17T09:00")
  addEdge("1995-12-17T08:00", "1995-12-17T08:30")
  addEdge("1995-12-17T09:00", "1995-12-17T09:30")
  addEdge("1995-12-17T09:00", "1995-12-17T10:00")
  addEdge("1995-12-17T09:00", "1995-12-17T10:30")
  addEdge("1995-12-17T09:30", "1995-12-17T10:30")
  addEdge("1995-12-17T09:30", "1995-12-17T11:00")
  addEdge("1995-12-17T10:00", "1995-12-17T11:00")
  addEdge("1995-12-17T10:30", "1995-12-17T11:30")
  addEdge("1995-12-17T11:30", "1995-12-17T12:30")

  // addEdge("1995-12-17T09:00", "1995-12-17T10:00")
  // addEdge("1995-12-17T11:00", "1995-12-17T12:30")
  // addEdge("1995-12-17T13:00", "1995-12-17T14:30")
  // addEdge("1995-12-17T14:00", "1995-12-17T15:00")
  // addEdge("1995-12-17T17:00", "1995-12-17T20:00")
  // addEdge("1995-12-17T17:30", "1995-12-17T19:00")
  // addEdge("1995-12-17T17:00", "1995-12-17T17:30")

  console.log('graph', graph)

  // function getNonoverlappingEvents() {
  //   let visited = {}
  //   Object.keys(graph).forEach(node => {
  //     visited[node] = false
  //   })
    
  //   let eventStarts ={}
  //   Object.keys(graph).forEach((eventStart)=>{
  //     eventStarts[eventStart] = true
  //   })

  //   let largestKnownTime =  Object.keys(graph)[0]

  //   Object.keys(graph).forEach((eventStart)=>{
  //     console.log('--------------------event start', eventStart)
  //     let queue = []
  //     queue.push(eventStart)
  //     // queue.push("1995-12-17T09:00")
     
  //     while (queue.length > 0) {
  //       let node = queue.shift()
  //       if (new Date(node) >= new Date(largestKnownTime)) {
  //         console.log('non overlapping item', node)
  //       }
  //       // console.log('visiting', node)

  //       if (node in graph) {

  //         for (var child of graph[node]) {

  //           if (!visited[child]) {
  //             if (new Date(child) > new Date(largestKnownTime)) {
  //               largestKnownTime = child
  //               // console.log('------new largestKnownTime', largestKnownTime)
  //             }
  //             else{
  //               // console.log(`${child} is less than largestKnownTime ${largestKnownTime}`)
  //             }
  //             if(child in eventStarts){
  //               queue.push(child)
  //             }
  //             visited[child] = true
  //           }
  //         }
  //       }
  //     }
  //   })

  // }

  function getNonoverlappingEvents() {
    
    let startDate = new Date("1995-12-17T07:00")
    let endDate = new Date("1995-12-17T17:30")
    let largestKnownTime = "1995-12-17T07:00"
    let nextBlock = startDate
    let timeBlocks = []
    while(nextBlock < endDate){
    

      if(getDateString(nextBlock) in graph){
        // console.log(`next block  found ${getDateString(nextBlock)}`)
        let eventStart = getDateString(nextBlock)
        if(new Date(eventStart) >= new Date(largestKnownTime))
        {
          console.log("non overlapping event", eventStart)
        }
        graph[eventStart].forEach((eventEnd) => {
          if(new Date(eventEnd) > new Date(largestKnownTime)){
            largestKnownTime = eventEnd
            // console.log('------new largestKnownTime', largestKnownTime)
          }
          else{
            // console.log(`${eventEnd} is less than largestKnownTime ${largestKnownTime}`)
          }
        })
      }
      else{
        // console.log(`next block not found ${getDateString(nextBlock)}`)
      }

      let hrs  = new Date(nextBlock).getMinutes()
      nextBlock = new Date(nextBlock)
      nextBlock.setMinutes(hrs+30)
      // console.log(`next block is ${getDateString(nextBlock)}`)
    }
    // Object.keys(graph).forEach((eventStart)=>{
    //   if(eventStart >= largestKnownTime)
    //   {
    //     console.log("non overlapping event", eventStart)
    //   }
    //   graph[eventStart].forEach((eventEnd) => {
    //     if(eventEnd > largestKnownTime){
    //       largestKnownTime = eventEnd
    //     }
    //   })
      
    // })
  }

  function getDateString(d){
    var date = ("0" + d.getDate()).slice(-2)
    var month =  ("0"+(d.getMonth()+1)).slice(-2)
    var year =  d.getFullYear()
    var hrs = ("0" + d.getHours()).slice(-2)
    var min = ("0" + d.getMinutes()).slice(-2)
    var datestring =year + "-" + month + "-" + date + "T" + hrs + ":" + min;
    return datestring;
  }
  getNonoverlappingEvents()
}
  ;