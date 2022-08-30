//

function createCollateral() {
  // Add loading state
  $(".collateralForm button").html(
    '<div class="spinner-border spinner-border-sm text-light" role="status"><span class="visually-hidden">Loading...</span></div>'
  );

  let reqData = {
    quantity: $(".collateralForm #quantity").val(),
    cropType: $(".collateralForm #cropType").val(),
    condition: $(".collateralForm #condition").val(),
    farmerPhoneNumber: $(".collateralForm #phone").val(),
    farmerName: $(".collateralForm #farmer_name").val(),
    businessName: $(".collateralForm #business_name").val(),
    bankCode: $(".collateralForm #bank").val(),
    accountNumber: $(".collateralForm #account_no").val(),
  }
  var settings = {
    url: "https://grainreceipt.herokuapp.com/api/collateral",
    method: "POST",
    "headers": {
      "Content-Type": "application/json"
    },
    data: JSON.stringify(reqData)
  };
  // API call
  $.ajax(settings).done(function (res) {
    var myModal = new bootstrap.Modal(document.getElementById("CreateCollateral"));
    myModal.show();
    // Update fields
    let issuanceDate = res.issuanceDate.replace(
      "(Coordinated Universal Time)",
      ""
    );
    $(".modal #cropValue").val('₦' + res.cropValue);
    $(".modal #quantity").val(res.quantity + "Kg");
    $(".modal #cropType").val(res.cropType);
    $(".modal #condition").val(res.condition);
    $(".modal #phone").val(res.farmerPhoneNumber);
    $(".modal #farmer_name").val(res.farmerName);
    $(".modal #collateral_id").val(res.collateralId);
    $(".modal #issuance_d").val(issuanceDate);

    $(".collateralForm button").html("Create");
  });
}

function showNextModal(nextEL) {
  // hide all
  $("#findCollateralModal .modal-content").addClass("d-none");
  $(nextEL).removeClass("d-none");
}

function verifyOTP() {
  let loanID = $(".mainForm #loanId").val();
  let otpCode = $('#otp #OTPcode').val();

  console.log(otpCode);
  var settings = {
    "url": "https://grainreceipt.herokuapp.com/api/loan/" + loanID + "/verify-otp",
    "method": "POST",
    "headers": {
      "Content-Type": "application/json"
    },
    "data": JSON.stringify({ "OTP": Number(otpCode) }),
  };

  if (otpCode) {
    showNextModal("#successModal");
  }

  // $.ajax(settings).done(function (res) {
  //   console.log(settings, res);
  // });
}

function confirmLoan() {
  let loanID = $(".mainForm #loanId").val();
  var settings = {
    url: "https://grainreceipt.herokuapp.com/api/loan/" + loanID + "/confirm",
    method: "POST",
  };

  $.ajax(settings).done(function (response) {
    console.log(response);
    showNextModal("#otp");
  });
}

function calculateLoan() {
  let interestRate = $("#calculateLoan #interestRate").val();
  let reqData = {
    collateralId: Number($(".mainForm #collateral_id").val()),
    interestRate: Number(interestRate.replace("%", "")),
    tenure: Number($("#calculateLoan #tenure").val()),
    requestingBank: $(".mainForm #bankCode").val(),
  };
  var settings = {
    url: "https://grainreceipt.herokuapp.com/api/loan",
    method: "POST",
    "headers": {
      "Content-Type": "application/json"
    },
    data: JSON.stringify(reqData)
  };

  $.ajax(settings).done(function (res) {
    console.log(settings, res);
    $('.mainForm #loanId').val(res.loanId);
    $('#confirmLoan #loanValue').val('₦' + res.loanValue);
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
  };
  // API call
  $.ajax(config).done(function (res) {
    console.log(config, "-----", res);
    myModal.show();
    // Update fields
    $(".mainForm #estValue").val('₦' + res.cropValue);
    $(".mainForm #quantity").val(res.quantity + 'Kg');
    $(".mainForm #cropType").val(res.cropType);
    $(".mainForm #business_name").val(res.businessName);
    $(".mainForm #farmer_name").val(res.farmerName);
    // Hidden fields
    $(".mainForm #collateral_id").val(cID);
    $(".mainForm #bankCode").val(res.bankCode);
    // Reset button
    $(".searchCollateral button").html("Find");
  });
}

// Events
$(function () {
  // Disable all forms
  $('body form').submit(function (e) {
    e.preventDefault();
  });

  // create Collateral
  $(".collateralForm form").submit(function (e) {
    createCollateral();
  });

  // Modal step 1
  $("form.searchCollateral").submit(function (e) {
    findCollateral();
  });

  // Modal step 2
  $("#transferCollateral .collateralBtn").click(function (e) {
    let estValue = $(".mainForm #estValue").val();
    $("#calculateLoan #estValue").val(estValue);
    showNextModal("#calculateLoan");
  });

  // Modal step 3
  $('#calculateLoan form').submit(function (e) {
    calculateLoan();
  });

  // Modal step 4
  $("#confirmLoanBtn").click(function (e) {
    confirmLoan();
  });

  // Modal step 5
  $("#otp button").click(function (e) {
    verifyOTP();
  });

  // Last
  $("#successModal button").click(function (e) {
    // Clear form
    $(".searchCollateral input").val("");
    $('.digit-group input').val("");

    setTimeout(() => {
      showNextModal("#transferCollateral");
    }, 1500);
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
            let formInputs = $('.digit-group').serializeArray();
            let OTPcode = '';
            formInputs.forEach(el => {
              // console.log(el.name, el.value);
              OTPcode += el.value;
            });
            $('#otp #OTPcode').val(OTPcode);
          }
        }
      });
    });
});
