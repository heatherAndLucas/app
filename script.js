// Namespace to hold code
const app = {};

// Cache repetitive selectors
app.$questionsForm = $("#questionsForm"),
app.$modal = $(".modal"),
app.$modalOverlay = $(".modalOverlay"),
app.$playAgain = $("#playAgain"),
app.$answers = $("#answers");

// Start app, run background animation
app.init = function () {
  app.startGame();
  $('#intro').append(`
  <ul class="backgroundAnimation">
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    </ul>`)
};

// User selects difficulty level which is then stored into variable which is then put into API, run in app.startGame
app.difficulty = [];

app.chooseDifficulty = () => {
  let userDifficulty = $("#difficultyForm input[type=radio]:checked").val();
  app.difficulty.push(userDifficulty);
};

// When user clicks Start Game does check to make sure difficulty level is selected. Then displays categories. Run in app.init.
app.startGame = () => {
  $("#startGame").on("click", function () {
    if ($("#difficultyForm input[type=radio]").is(":checked")) {
      $("#categories").show();
      app.displayCategory();
      app.chooseDifficulty();
      $("#intro").hide();
    } else {
      alert('Please choose a difficulty level!')
    }
  });
};

// When a category is clicked by the user, displays category clicked by pushing category value into variable which is then put into API, run in app.StartGame
app.catNumber = [];

app.displayCategory = () => {
  $(".catChoice").on( 'click', function() {
    newNum = this.id;
    app.catNumber.push(newNum);
    app.getQuestions();
    $(this).attr("disabled", true);
    $('#categories').hide();
    $(window).scrollTop(0);
  });
};

// Gets data by running AJAX request with selected category and difficulty, stores results in questionsArray run in app.displayCategory
app.getQuestions = () => {
  $.ajax({
    url: `https://opentdb.com/api.php?amount=3&category=${app.catNumber}&difficulty=${app.difficulty}&type=multiple`,
    method: "GET",
    dataType: "json",
    data: {
      format: "json",
    },
  }).then((result) => {
    let questionsArray = result.results;

    app.displayQuestions(questionsArray);
    app.submit();
  });
};

// For each of the 3 questions takes data stored in questionsArray and stores needed data in variables in order to put question on the page with the 4 answer options randomly displayed. Run in app.getQuestions
app.answer = [];

// Shuffle function using Durstenfeld's algorithm 
app.shuffle = function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

app.displayQuestions = (questionsArray) => {
  questionsArray.forEach((quest, index) => {
    const qNum = index + 'q';

    const question = quest.question;

    const answer = quest.correct_answer;
    app.answer.unshift(answer);

    const wAnswers = quest.incorrect_answers;

    const options = [answer, ...wAnswers];
    
    // Randomly display options of correct and incorrect answers to user
    const shuffArray = app.shuffle(options);
    
    // Post question saved in question and shuffled answer options onto page in formatted fieldset with radio input for answer options. qNum is used to eliminate error that occured if option happened twice on the page (no longer unique) and if answer matched a category id. 
    const oneQuestion = `
	          <fieldset>
              <legend>${question}</legend>
              <input type="radio" name="${question}" value="${shuffArray[0]}" id="${qNum}${shuffArray[0]}">
              <label for="${qNum}${shuffArray[0]}">${shuffArray[0]}</label>
              <input type="radio" name="${question}" value="${shuffArray[1]}" id="${qNum}${shuffArray[1]}">
              <label for="${qNum}${shuffArray[1]}">${shuffArray[1]}</label>
              <input type="radio" name="${question}" value="${shuffArray[2]}" id="${qNum}${shuffArray[2]}">
              <label for="${qNum}${shuffArray[2]}">${shuffArray[2]}</label>
              <input type="radio" name="${question}" value="${shuffArray[3]}" id="${qNum}${shuffArray[3]}">
              <label for="${qNum}${shuffArray[3]}">${shuffArray[3]}</label>
            </fieldset>
        `;
    app.$questionsForm.prepend(oneQuestion);
  });
  app.$questionsForm.append('<button id="submit" class="submit">Submit!</button>');
};


// When user clicks submit button, run in app.getQuestions
app.userAns = [];

app.submit = () => {
  // On click answer options that were selected by user saved to array 
  $("#submit").click(function(e) {
    e.preventDefault();
    const checked = $("#questionsForm input[type=radio]:checked").each(function(index, element) {
      ans = $(element).val();
      app.userAns.push(ans);
    });

    // Verify all questions have been answered
    if ($(app.userAns).length < 3) {
      alert("Please answer all the questions!");
      app.userAns = [];
    } else {

      // If all questions have been answered show category results modal
      app.$modal.addClass("active");
      app.$modalOverlay.addClass("active");

      // Elements to remove from tab order when modal is open
      app.backgroundElements = $("header, footer, form, label, input, p, a, .submit")

      // Trap focus inside modal when open
      $("header, footer, form, label, input").attr("aria-hidden", "true");
      app.backgroundElements.attr("tabindex", "-1");

      // If this is the last category show final results button in modal instead of playAgain
      if ($(".catChoice:disabled").length === 6) {
        $("#finalResult").show();
        $("#finalResult").focus();
        app.$playAgain.hide();
        app.finalResults();
      } else {
        app.$playAgain.show();
        app.$playAgain.focus();
      }

      // Compare array of correct answers to array of user answers, display either correct or inccorrect statement in modal for each question.
      let correctAns = 0;
      for (var i = 0; i < app.userAns.length; i++) {
        // Use regex to fix bug on answers with symbols in them not being recognized as correct. 
        if (app.userAns[i].replace(/[^a-zA-Z0-9]+/g, "") === app.answer[i].replace(/&.*?;/gi, '').replace(/[^a-zA-Z0-9]+/g, "")) {
          app.$answers.append(`<p>${app.userAns[i]} is correct!</p>`);
          correctAns = correctAns + 1;
        } else if (app.userAns[i] != app.answer[i]) {
          app.$answers.append(
            `<p>${app.userAns[i]} is incorrect. The correct answer was ${app.answer[i]}.</p>`
          );
        }
      }

      // If user gets most questions right, they pass. If not they fail. Displays message in modal, appends classes and icons to category depending on pass or fail.
      if (correctAns >= 2) {
        $("#win").html("<h2>You win this category!</h2>");
        $(`#${app.catNumber}`).css("background", "green");
        $(`#${app.catNumber}`).addClass("correct");
        $(`#${app.catNumber}`).append(`<i class="fas fa-check" aria-label="pass"></i>`);
      } else {
        $("#win").html("<h2>You lose this category.</h2>");
        $(`#${app.catNumber}`).css("background", "#c63f22");
        $(`#${app.catNumber}`).append(`<i class="fas fa-times" aria-label="fail"></i>`);
      }
    }
  });
  app.playAgain();
};

// When user clicks Play Again, remove modal, clear question and empty variables indicated, run in app.submit
app.playAgain = () => {
  app.$playAgain.click(function() {
    app.$modal.removeClass("active");
    app.$modalOverlay.removeClass("active");

    $("#categories").show();

    $(window).scrollTop(0);

    app.$questionsForm.html("");
    app.$answers.html("");

    app.catNumber = [];
    app.userAns = [];
    app.answer = [];

    // Return focus to page elements
    $("header, footer, form, label, input").attr("aria-hidden", "false");
    app.backgroundElements.attr("tabindex", "0");

  });
};

// HTML for game piece that shows up on results page 
app.gamePiece = `
      <ul class="circle" aria-label="Trivial Pursuit game piece">
        <li>
          <div class="text artP" id="artP"></div>
        </li>
        <li>
          <div class="text sciP" id="sciP"></div>
        </li>
        <li>
          <div class="text sportsP" id="sportsP"></div>
        </li>
        <li>
          <div class="text geoP" id="geoP"></div>
        </li>
        <li>
          <div class="text entertainP" id="entertainP"></div>
        </li>
        <li>
          <div class="text histP" id="histP"></div>
        </li>
      <ul>`

// Function that fills in relevant category color if correct 
app.colorPieces = () => {
  if ($('.art').hasClass('correct')) {
    $('#artP').css("background-color", "#996B4D")
  }
  if ($('.science').hasClass('correct')) {
    $('#sciP').css("background-color", "#1D8B65")
  }
  if ($('.sports').hasClass('correct')) {
    $('#sportsP').css("background", "#DC6428")
  }
  if ($('.entertainment').hasClass('correct')) {
    $('#entertainP').css('background', '#DA67B2')
  }
  if ($('.geography').hasClass('correct')) {
    $('#geoP').css('background', '#349DD7')
  }
  if ($('.history').hasClass('correct')) {
    $('#histP').css('background', '#E7CC41')
  }
}

// When user click final results button, modal is removed, questions and categories is cleared and message is displayed depending on how many categories are correct, executed in app.submit.
app.finalResults = () => {
  $("#finalResult").click(function() {
    app.$modal.removeClass("active");
    app.$modalOverlay.removeClass("active");
    app.$questionsForm.html("");
    $(".categories").hide();

    let numCorrect = $(".correct").length;
    if (numCorrect > 3) {
      $("#resultsContainer").html(
        `<h2>You Win!</h2>
        <p> You got ${numCorrect}/6 categories correct!</p>
        <div>${app.gamePiece}</div>
        <button id="newGame">New Game</button>
      `
      );
    } else {
      $("#resultsContainer").html(
        `<h2>You Lose!</h2>
        <p> You only got ${numCorrect}/6 categories correct.</p>
        <div>${app.gamePiece}</div>
        <button id="newGame">New Game</button>
      `
      );
    }
    app.colorPieces();
    // Refreshes page when new game button is clicked.
    $("#newGame").click(function() {
      location.reload();
    });
  });
};

// Document ready
$(function() {
  app.init();
});