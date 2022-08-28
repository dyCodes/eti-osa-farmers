//

function showNextModal(nextEL) {
  // hide all
  $("#findCollateralModal .modal-content").addClass("d-none");
  $(nextEL).removeClass("d-none");
}

function calculateLoan() {
  let interestRate = $("#calculateLoan #interestRate").val();

  var settings = {
    url: "https://grainreceipt.herokuapp.com/api/loan",
    method: "POST",
    timeout: 0,
    data: {
      collateralId: $(".searchCollateral input").val(),
      interestRate: interestRate.replace("%", ""),
      tenure: $("#calculateLoan #tenure").val(),
      requestingBank: $("#calculateLoan #requestingBank").val(),
    },
  };
  console.log(settings);

  $.ajax(settings).done(function (response) {
    console.log(settings, response);
    showNextModal("#confirmLoan");
  });
}

function findCollateral() {
  var myModal = new bootstrap.Modal(
    document.getElementById("findCollateralModal")
  );
  // Add loading state
  $(".searchCollateral button").html(
    '<div class="spinner-border spinner-border-sm text-light" role="status"><span class="visually-hidden">Loading...</span></div>'
  );

  // Get collateral ID
  let cID = $(".searchCollateral input").val();
  let config = {
    url: "https://grainreceipt.herokuapp.com/api/collateral/" + cID,
    method: "GET",
    timeout: 0,
  };
  // API call
  $.ajax(config).done(function (res) {
    console.log(config, "-----", res);

    myModal.show();
    $(".searchCollateral button").html("Find");
    // Update fields
    // $(".modal #cropType").val(settings.data.cropType);
  });
}

function createCollateral() {
  // Add loading state
  $(".collateralForm button").html(
    '<div class="spinner-border spinner-border-sm text-light" role="status"><span class="visually-hidden">Loading...</span></div>'
  );

  var settings = {
    url: "https://grainreceipt.herokuapp.com/api/collateral",
    method: "POST",
    timeout: 0,
    data: {
      quantity: $(".collateralForm #quantity").val(),
      cropType: $(".collateralForm #cropType").val(),
      condition: $(".collateralForm #condition").val(),
      farmerPhoneNumber: $(".collateralForm #phone").val(),
      farmerName: $(".collateralForm #farmer_name").val(),
      businessName: $(".collateralForm #business_name").val(),
      bankCode: $(".collateralForm #bank").val(),
      accountNumber: $(".collateralForm #account_no").val(),
    },
  };
  // API call
  $.ajax(settings).done(function (res) {
    var myModal = new bootstrap.Modal(
      document.getElementById("CreateCollateral")
    );
    console.log(res);
    // Show modal
    myModal.show();
    // Update fields
    let issuanceDate = res.issuanceDate.replace(
      "(Coordinated Universal Time)",
      ""
    );
    $(".modal #quantity").val(settings.data.quantity);
    $(".modal #cropType").val(settings.data.cropType);
    $(".modal #condition").val(settings.data.condition);
    $(".modal #phone").val(settings.data.farmerPhoneNumber);
    $(".modal #farmer_name").val(settings.data.farmerName);
    $(".modal #collateral_id").val(res.collateralId);
    $(".modal #issuance_d").val(issuanceDate);

    $(".collateralForm button").html("Create");
  });
}

$(function () {
  $(".collateralForm form").submit(function (e) {
    e.preventDefault();
    createCollateral();
  });

  $("form.searchCollateral").submit(function (e) {
    e.preventDefault();
    findCollateral();
  });

  // Modal step 1
  $("#transferCollateral .collateralBtn").click(function (e) {
    showNextModal("#calculateLoan");
  });

  // Modal step 2
  $("#calculateLoanBtn").click(function (e) {
    calculateLoan();
  });

  // Modal step 3
  $("#confirmLoanBtn").click(function (e) {
    let loanID = $(".searchCollateral input").val();
    var settings = {
      url: "https://grainreceipt.herokuapp.com/api/loan/" + loanID + "/confirm",
      method: "POST",
      timeout: 0,
    };

    $.ajax(settings).done(function (response) {
      console.log(response);
      showNextModal("#otp");
    });
  });

  $(".modal-footer .modalBtn").click(function (e) {
    // e.preventDefault();
    let nextEl = "#" + $(this).data("next");
    console.log(nextEl);
    $("#collateralModal .modal-content").addClass("d-none");
    $(nextEl).removeClass("d-none");
  });

  // Reset modal to step 1
  $(".modal-footer .successModalBtn").click(function (e) {
    setTimeout(() => {
      let nextEl = "#" + $(this).data("next");
      $("#collateralModal .modal-content").addClass("d-none");
      $(nextEl).removeClass("d-none");
    }, 1000);
  });

  // OTP
  $(".digit-group")
    .find("input")
    .each(function () {
      $(this).attr("maxlength", 1);
      $(this).on("keyup", function (e) {
        var parent = $($(this).parent());

        if (e.keyCode === 8 || e.keyCode === 37) {
          var prev = parent.find("input#" + $(this).data("previous"));

          if (prev.length) {
            $(prev).select();
          }
        } else if (
          (e.keyCode >= 48 && e.keyCode <= 57) ||
          (e.keyCode >= 65 && e.keyCode <= 90) ||
          (e.keyCode >= 96 && e.keyCode <= 105) ||
          e.keyCode === 39
        ) {
          var next = parent.find("input#" + $(this).data("next"));

          if (next.length) {
            $(next).select();
          } else {
            if (parent.data("autosubmit")) {
              parent.submit();
            }
          }
        }
      });
    });
});
