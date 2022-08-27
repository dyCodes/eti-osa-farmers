// 

$(function () {
  // Modal steps
  $('.modal-footer .modalBtn').click(function (e) {
    // e.preventDefault();
    let nextEl = '#' + $(this).data('next');
    console.log(nextEl);
    $('#collateralModal .modal-content').addClass('d-none');
    $(nextEl).removeClass('d-none');
  });

  // Reset modal to step 1
  $('.modal-footer .successModalBtn').click(function (e) {
    setTimeout(() => {
      let nextEl = '#' + $(this).data('next');
      $('#collateralModal .modal-content').addClass('d-none');
      $(nextEl).removeClass('d-none');
    }, 1000);
  });

  // OTP
  $('.digit-group').find('input').each(function () {
    $(this).attr('maxlength', 1);
    $(this).on('keyup', function (e) {
      var parent = $($(this).parent());

      if (e.keyCode === 8 || e.keyCode === 37) {
        var prev = parent.find('input#' + $(this).data('previous'));

        if (prev.length) {
          $(prev).select();
        }
      } else if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 65 && e.keyCode <= 90) || (e.keyCode >= 96 && e.keyCode <= 105) || e.keyCode === 39) {
        var next = parent.find('input#' + $(this).data('next'));

        if (next.length) {
          $(next).select();
        } else {
          if (parent.data('autosubmit')) {
            parent.submit();
          }
        }
      }
    });
  });

  // Calendar
  const myEvents = [
    {
      start: '2022-08-10T06:00:00',
      end: '2022-08-10T20:30:00',
      name: 'Event 1',
    },
  ];

  try {
    new Calendar({
      id: '#color-calendar',
      eventsData: myEvents,
      dateChanged: (currentDate, DateEvents) => {
        // do something
        console.log(currentDate, DateEvents);
      },
    })
  } catch (e) {
    console.log(e);
  }

});