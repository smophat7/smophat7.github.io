var isbn10 = 0,
    isbn10_digits = [9,7,8];


// Functionality of the "Convert" button
$("#isbn10-conversion").submit(function() {
  isbn10 = $("#isbn10-input").val();
  if (isbn10 === "") {
    return false;
  }
  isbn10 = isbn10.replace(/\D/g, "");

  // Error message to user if a problem
  if (isbn10.length != 10) {
    $(".isbn13-result").text("Error: Not a valid 10-digit ISBN");
    $(".btn").removeClass().addClass("btn btn-danger").text("INVALID");
    setTimeout(function() {
      $(".btn").removeClass().addClass("btn btn-dark").text("Convert");
    }, 1500);
    return false;
  }

  // Splits digits into an array and drops the last digit
  for (var i = 0; i < isbn10.length - 1; i++) {
    isbn10_digits.push(isbn10[i]);
  }

  // Add calculated check digit
  isbn10_digits.push(CalculateCheckDigit(isbn10_digits));

  // Change ISBN 13 result text to newly calculated 13-digit ISBN
  let isbn13 = isbn10_digits.join("")
  $(".isbn13-result").text(isbn13);
  $(".btn").removeClass().addClass("btn btn-success");
  $(".isbn13-results-container").removeClass("d-none");

  ResetValues();

  // Prevent page reload on form submission
  return false;
});


// Returns corresponding check digit based on input array
function CalculateCheckDigit(isbn) {
  let checkDigit = 0;
  for (var i = 0; i < isbn.length; i += 2) {
    checkDigit += isbn[i] * 1;
  }
  for (var i = 1; i < isbn.length; i += 2) {
    checkDigit += isbn[i] * 3;
  }
  if (checkDigit % 10 === 0) {
    return 0;
  }
  else {
    return 10 - (checkDigit % 10);
  }
}

// Resets variables
function ResetValues() {
  isbn10 = 0;
  isbn10_digits = [9,7,8];
}
