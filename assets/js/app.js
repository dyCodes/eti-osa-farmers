// 
const myEvents = [
  {
    start: '2022-08-04T06:00:00',
    end: '2022-08-04T20:30:00',
    name: 'Event 1',
    url: 'https://www.cssscript.com',
    desc: 'Description 1',
    // more key value pairs here
  }, {
    start: '2022-08-22T06:00:00',
    end: '2022-08-22T20:30:00',
    name: 'Event 2',
    url: 'https://www.cssscript.com',
  }, {
    start: '2022-08-19T06:00:00',
    end: '2022-08-19T20:30:00',
    name: 'Event 2',
    url: 'https://www.cssscript.com',
  },
];

$(function () {
  new Calendar({
    id: '#color-calendar',
    eventsData: myEvents,
    dateChanged: (currentDate, DateEvents) => {
      // do something
      console.log(currentDate, DateEvents);
    },
  })

  // $('.calendar-container').calendar({
  //   date: new Date(),
  //   weekDayLength: 3,
  //   showTodayButton: false,
  //   highlightSelectedWeek: false,
  //   onClickDate: function (date) {
  //     console.log(date);
  //   },
  // });
});