// 
const myEvents = [
  {
    start: '2022-08-10T06:00:00',
    end: '2022-08-10T20:30:00',
    name: 'Event 1',
  },
  // {
  //   start: '2022-08-22T06:00:00',
  //   end: '2022-08-22T20:30:00',
  //   name: 'Event 2',
  // }, {
  //   start: '2022-08-19T06:00:00',
  //   end: '2022-08-19T20:30:00',
  //   name: 'Event 2',
  // },
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