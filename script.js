// Create app namespace to hold all methods
const app = {};

// when a category button is clicked we want to take the id put it in category number variable then run get questions for that category 
let catNumber = [];


app.displayCategory = () => {
  $('.catChoice').click(function(){
    newNum = this.id;
    catNumber.push(newNum);
    app.getQuestions();
  })  
}



// app.url = `https://opentdb.com/api.php?amount=3&category=${app.catNumber}&difficulty=easy&type=multiple`

// When user clicks the start button, make AJAX request to get questions/answers
app.getQuestions = () => {
  $.ajax({
    url: `https://opentdb.com/api.php?amount=3&category=${catNumber}&difficulty=easy&type=multiple`,
    method: 'GET',
    dataType: 'json',
    data: {
      format: 'json',
    }
  }).then((result) => {

    let questionsArray = result.results;

    app.displayQuestions(questionsArray);

  })
}

app.answer = []

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
              <label for="option1">${shuffArray[0]}</label>
              <input type="radio" name="${question}" value="${shuffArray[0]}" id="option1">
              <label for="option2">${shuffArray[1]}</label>
              <input type="radio" name="${question}" value="${shuffArray[1]}" id="option2">
              <label for="option3">${shuffArray[2]}</label>
              <input type="radio" name="${question}" value="${shuffArray[2]}" id="option3">
              <label for="option4">${shuffArray[3]}</label>
              <input type="radio" name="${question}" value="${shuffArray[3]}" id="option4">
            </fieldset>
        `
    $('form').prepend(oneQuestion);
  })
  $('#submit').show();
}


app.userAns = [];

app.submit = () => {
  
  // Display score/results along with button to play again
  $('#submit').click(
    function (e) {
      e.preventDefault();
      const checked = $('form input[type=radio]:checked').each(function (index, element) {
        ans = $(element).val();
        app.userAns.push(ans);
      });
      
      // Verify all questions have been answered
      if ($(app.userAns).length < 3) {
        alert('Please answer all the questions!')
      } else {

        $('#playAgain').show();
        
        // When user clicks submit, check user answers against correct answers
        let correctAns = 0;
        for (var i = 0; i < app.userAns.length; i++) {

          if (app.userAns[i] === app.answer[i]) {
            $('#answers').append(`<p>${app.userAns[i]} is correct!</p>`);
            correctAns = correctAns + 1;
          }
          else if (app.userAns[i] != app.answer[i]) {
            $('#answers').append(`<p>${app.userAns[i]} is incorrect. The correct answer was ${app.answer[i]}</p>`);
          }

        }

        // If user gets most questions right, they pass. If not they fail.
        if (correctAns >= 2) {
          $('#win').html('<h2>You win!</h2>')
        }
        else {
          $('#win').html('<h2>You Lose!</h2>')
        }
        
      }
    }
  )
  app.playAgain();
}

// When user clicks Play Again, reload the game.
app.playAgain = () => {
  $('#playAgain').click(function () {
    location.reload();
  });
}

// When user clicks Start Game, start the game.
app.startGame = () =>{ $("#startGame").one('click', function () {
  $('#categories').show();
  app.displayCategory();
  $('#intro').hide();
})
}

// Start app
app.init = function () {
  app.startGame();
  app.submit();
  // app.playAgain();
};

// Document ready
$(function () {
  app.init();
});