var isbn10 = 0,
    isbn10_digits = [9,7,8];


$("#isbn10-conversion").submit(function() {
  isbn10 = $("#isbn10-input").val();
  isbn10 = isbn10.replace(/\D/g, "");
  // Error message to user if a problem
  if (isbn10.length != 10) {
    $(".isbn13-result").text("Error: Not a valid 10-digit ISBN");
  }
  // Splits digits into an array and drops the last digit
  for (var i = 0; i < isbn10.length - 1; i++) {
    isbn10_digits.push(isbn10[i]);
    // console.log(i);
  }
  // Add calculated check digit
  isbn10_digits.push(CheckDigitCalc(isbn10_digits));

  // Change ISBN 13 result text to newly calculated 13-digit ISBN
  let isbn13 = isbn10_digits.join("")
  $(".isbn13-result").text(isbn13);


  // alert(isbn10);
  // alert(isbn10_digits);

  // Prevent page reload on form submission
  return false;
});


// Returns corresponding check digit based on input array
function CheckDigitCalc(isbn) {
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
