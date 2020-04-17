// Create app namespace to hold all methods
const app = {};

// when a category button is clicked we want to take the id put it in category number variable then run get questions for that category
let catNumber = [];

app.displayCategory = () => {
  $(".catChoice").click(function() {
    newNum = this.id;
    catNumber.push(newNum);
    app.chooseDifficulty();
    app.getQuestions();
    $(this).attr("disabled", true);
  });
};

let difficulty = [];

app.chooseDifficulty = () => {
  let userDifficulty = $("#difficultyForm input[type=radio]:checked").val();
  difficulty = [];
  difficulty.push(userDifficulty);
};

// When user clicks the start button, make AJAX request to get questions/answers
app.getQuestions = () => {
  $.ajax({
    url: `https://opentdb.com/api.php?amount=3&category=${catNumber}&difficulty=${difficulty}&type=multiple`,
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

app.answer = [];

// Display questions to user
app.displayQuestions = (questionsArray) => {
  questionsArray.forEach((quest) => {
    const question = quest.question;

    const answer = quest.correct_answer;
    app.answer.unshift(answer);

    const wAnswers = quest.incorrect_answers;

    const options = [answer, ...wAnswers];

    // Randomly display options of correct and incorrect answers to user
    function shuffle(a) {
      var j, x, i;
      for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
      }
      return a;
    }
    const shuffArray = shuffle(options);

    // Place question and answer options pulled from api and format for placement on page
    const oneQuestion = `
	          <fieldset>
              <legend>${question}</legend>
              <label for="${shuffArray[0]}">${shuffArray[0]}</label>
              <input type="radio" name="${question}" value="${shuffArray[0]}" id="option1">
              <label for="${shuffArray[1]}">${shuffArray[1]}</label>
              <input type="radio" name="${question}" value="${shuffArray[1]}" id="option2">
              <label for="${shuffArray[2]}">${shuffArray[2]}</label>
              <input type="radio" name="${question}" value="${shuffArray[2]}" id="option3">
              <label for="${shuffArray[3]}">${shuffArray[3]}</label>
              <input type="radio" name="${question}" value="${shuffArray[3]}" id="option4">
            </fieldset>
        `;
    $("#questionsForm").prepend(oneQuestion);
  });
  $("#questionsForm").append('<button id="submit" class="submit">Submit!</button>');
};

app.userAns = [];

app.submit = () => {
  // Display score/results along with button to play again
  $("#submit").click(function(e) {
    e.preventDefault();
    const checked = $("#questionsForm input[type=radio]:checked").each(function(
      index,
      element
    ) {
      ans = $(element).val();
      app.userAns.push(ans);
    });

    // Verify all questions have been answered
    if ($(app.userAns).length < 3) {
      alert("Please answer all the questions!");
    } else {
      $(".modal").addClass("active");
      $(".modalOverlay").addClass("active");

      if ($(".catChoice:disabled").length === 6) {
        $("#finalResult").show();
        $("#playAgain").hide();
        app.finalResults();
      } else {
        $("#playAgain").show();
      }

      // When user clicks submit, check user answers against correct answers
      let correctAns = 0;
      for (var i = 0; i < app.userAns.length; i++) {
        if (app.userAns[i] === app.answer[i]) {
          $("#answers").append(`<p>${app.userAns[i]} is correct!</p>`);
          correctAns = correctAns + 1;
        } else if (app.userAns[i] != app.answer[i]) {
          $("#answers").append(
            `<p>${app.userAns[i]} is incorrect. The correct answer was ${app.answer[i]}</p>`
          );
        }
      }

      // If user gets most questions right, they pass. If not they fail.
      if (correctAns >= 2) {
        $("#win").html("<h2>You win this category!</h2>");
        $(`#${catNumber}`).css("color", "green");
        $(`#${catNumber}`).addClass("correct");
        $(`#${catNumber}`).append(`<i class="fas fa-check"></i>`);
      } else {
        $("#win").html("<h2>You lose this category.</h2>");
        $(`#${catNumber}`).css("color", "red");
        $(`#${catNumber}`).append(`<i class="fas fa-times"></i>`);
      }
    }
  });
  app.playAgain();
};

// When user clicks Play Again, reload the game.
app.playAgain = () => {
  $("#playAgain").click(function() {
    $(".modal").removeClass("active");
    $(".modalOverlay").removeClass("active");

    // clearing questions and catNumber
    $("#questionsForm").html("");
    catNumber = [];

    $("#answers").html("");
    app.userAns = [];
    app.answer = [];
  });
};

app.finalResults = () => {
  $("#finalResult").click(function() {
    $(".modal").removeClass("active");
    $(".modalOverlay").removeClass("active");
    $("#questionsForm").html("");
    $(".categories").hide();

    let numCorrect = $(".correct").length;
    if (numCorrect > 3) {
      $("#resultsContainer").html(
        `<h2>You Win!</h2>
        <p> You got ${numCorrect}/6 categories correct!</p>
        <button id="newGame">New Game</button>
      `
      );
    } else {
      $("#resultsContainer").html(
        `<h2>You Lose!</h2>
        <p> You only got ${numCorrect}/6 categories correct.</p>
        <button id="newGame">New Game</button>
      `
      );
    }
    $("#newGame").click(function() {
      location.reload();
    });
  });
};

// When user clicks Start Game, start the game.
app.startGame = () => {
  $("#startGame").on("click", function () {
    if ($("#difficultyForm input[type=radio]").is(":checked")) {
      $("#categories").show();
      app.displayCategory();
      $("#intro").hide();
    } else {
      alert('Please choose a difficulty level!')
    }
  });
};

// Start app
app.init = function() {
  app.startGame();
  // app.chooseDifficulty();
  // app.submit();
  // app.playAgain();
};

// Document ready
$(function() {
  app.init();
});
