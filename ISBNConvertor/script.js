var isbn10 = 0,
  isbn10_digits = [9, 7, 8];


// Functionality of the "Convert" button
$("#isbn10-conversion").submit(function(e) {
  e.preventDefault();

  isbn10 = $("#isbn10-input").val();
  if (isbn10 === "") {
    return false;
  }
  isbn10 = isbn10.replace(/\D/g, "");

  $(".api-data").addClass("d-none");
  $(".isbn13-results-container").addClass("d-none");

  // Error message to user if a problem
  if (isbn10.length != 10) {
    $(".btn").removeClass().addClass("btn btn-danger").text("INVALID");
    setTimeout(function() {
      $(".btn").removeClass().addClass("btn btn-dark").text("Convert");
    }, 1500);
    return false;
  }

  // Show loading symbol(s)
  $("#loading-symbol").removeClass("d-none");
  $(".api-data").addClass("d-none");

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


  DisplayAPIData(isbn13);
  // Hide loading spinner
  $("#loading-symbol").addClass("d-none");

  //Show API results
  $(".api-data").removeClass("d-none");

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
  } else {
    return 10 - (checkDigit % 10);
  }
}

// Resets variables
function ResetValues() {
  isbn10 = 0;
  isbn10_digits = [9, 7, 8];
}

//  API for book data
function DisplayAPIData(isbn13) {
  // Open Library API
  const url = "https://openlibrary.org/isbn/" + isbn13 + ".json";
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Book data not found.");
      }
    }).then(json => {
      // console.log(json);

      $("#book-title").html(json.title);

      // Cover image
      try {
        $("#cover-image").html("<img src='" + "http://covers.openlibrary.org/b/id/" + json.covers[0] + "-M.jpg" + "' class='img-fluid'>");
      } catch (err) {
        $("#cover-image").html("<p>Error: Book cover not found.");
      }

      // Publish date
      try {
        if (json.publish_date == undefined) {
          $("#publish-date").html("<p>Published: unknown");
        } else {
          $("#publish-date").html("Published: " + json.publish_date);
        }
      } catch (err) {
        $("#publish-date").html("<p>Error: Publication date not found.");
      }

      // Page count
      try {
        if (json.number_of_pages == undefined) {
          $("#page-count").html("Pages: unknown");
        } else {
          $("#page-count").html("Pages: " + json.number_of_pages);
        }
      } catch (err) {
        $("#page-count").html("<p>Error: Page count not found");
      }
    }).catch(error => {
      $("#book-title").html(error);
      $("#cover-image").html("Successfully converted to ISBN 13, but the book might not exist.");
      $("#publish-date").html("");
      $("#page-count").html("");
    });
}
