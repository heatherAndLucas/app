// Namespace to hold code
const app = {};

// Start app
app.init = function () {
  app.startGame();
};

// User selects difficulty level which is then stored into variable which is then put into API, run in app.startGame
let difficulty = [];

app.chooseDifficulty = () => {
  let userDifficulty = $("#difficultyForm input[type=radio]:checked").val();
  difficulty.push(userDifficulty);
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
let catNumber = [];

app.displayCategory = () => {
  $(".catChoice").on( 'click', function() {
    newNum = this.id;
    catNumber.push(newNum);
    app.getQuestions();
    $(this).attr("disabled", true);
  });
};

// Gets data by running AJAX request with selected category and difficulty, stores results in questionsArray run in app.displayCategory
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

// For each of the 3 questions takes data stored in questionsArray and stores needed data in variables in order to put question on the page with the 4 answer options randomly displayed. Run in app.getQuestions
app.answer = [];

app.displayQuestions = (questionsArray) => {
  questionsArray.forEach((quest) => {
    const question = quest.question;

    const answer = quest.correct_answer;
    app.answer.unshift(answer);

    const wAnswers = quest.incorrect_answers;

    const options = [answer, ...wAnswers];

    // Randomly display options of correct and incorrect answers to user, using Durstenfeld's algorithm 
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

    // Post question saved in question and shuffled answer options onto page in formatted fieldset with radio input for answer options. 
    const oneQuestion = `
	          <fieldset>
              <legend>${question}</legend>
              <label for="${shuffArray[0]}">${shuffArray[0]}</label>
              <input type="radio" name="${question}" value="${shuffArray[0]}" id="${shuffArray[0]}">
              <label for="${shuffArray[1]}">${shuffArray[1]}</label>
              <input type="radio" name="${question}" value="${shuffArray[1]}" id="${shuffArray[1]}">
              <label for="${shuffArray[2]}">${shuffArray[2]}</label>
              <input type="radio" name="${question}" value="${shuffArray[2]}" id="${shuffArray[2]}">
              <label for="${shuffArray[3]}">${shuffArray[3]}</label>
              <input type="radio" name="${question}" value="${shuffArray[3]}" id="${shuffArray[3]}">
            </fieldset>
        `;
    $("#questionsForm").prepend(oneQuestion);
  });
  $("#questionsForm").append('<button id="submit" class="submit">Submit!</button>');
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
    } else {

      // If all questions have been answered show category results modal
      $(".modal").addClass("active");
      $(".modalOverlay").addClass("active");

      // If this is the last category show final results button in modal instead of playagain
      if ($(".catChoice:disabled").length === 6) {
        $("#finalResult").show();
        $("#playAgain").hide();
        app.finalResults();
      } else {
        $("#playAgain").show();
      }

      // Compare array of correct answers to array of user answers, display either correct or inccorrect statement in modal for each question.
      let correctAns = 0;
      for (var i = 0; i < app.userAns.length; i++) {
        // Use regex to fix bug on answers with symbols in them not being recognized as correct. 
        if (app.userAns[i].replace(/[^a-zA-Z0-9]+/g, "") === app.answer[i].replace(/&.*?;/gi, '').replace(/[^a-zA-Z0-9]+/g, "")) {
          $("#answers").append(`<p>${app.userAns[i]} is correct!</p>`);
          correctAns = correctAns + 1;
        } else if (app.userAns[i] != app.answer[i]) {
          $("#answers").append(
            `<p>${app.userAns[i]} is incorrect. The correct answer was ${app.answer[i]}.</p>`
          );
        }
      }

      // If user gets most questions right, they pass. If not they fail. Displays message in modal, appends classes and icons to category depending on pass or fail.
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

// When user clicks Play Again, remove modal, clear question and empty variables indicated, run in app.submit
app.playAgain = () => {
  $("#playAgain").click(function() {
    $(".modal").removeClass("active");
    $(".modalOverlay").removeClass("active");

    $("#questionsForm").html("");
    $("#answers").html("");

    catNumber = [];
    app.userAns = [];
    app.answer = [];
  });
};

// When user click final results button, modal is removed, questions and categories is cleared and message is displayed depending on how many categories are correct, executed in app.submit.
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
