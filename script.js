// Create app namespace to hold all methods
const app = {};

// When user clicks the start button, make AJAX request to get questions/answers

app.url = `https://opentdb.com/api.php?amount=3&category=11&difficulty=easy&type=multiple`

app.getQuestions = () => {
    $.ajax({
        url: app.url,
        method: 'GET',
        dataType: 'json',
        data: {
            format: 'json',
        }
    }).then((result) => {

				let questionsArray = result.results;
				console.log(result)
				
			app.displayQuestions(questionsArray);

    })
}

// Display questions to user
// Randomly display options of correct and incorrect answers to user
app.displayQuestions = (questionsArray) => {
	questionsArray.forEach((quest) => {
        const question = quest.question;

        const answer = quest.correct_answer;

        const wAnswers = quest.incorrect_answers;

        const options = [ answer, ...wAnswers];

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

        console.log(question, options);

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
    }





// When user clicks submit, check user answers against correct answers
// Verify all questions have been answered

app.submit = () => {

$('#submit').click(
  function (e) {
    e.preventDefault();
    const checked = $('form input[type=radio]:checked').val();
    console.log(checked);
  }
)

}
  
  
    

// Display score/results along with button to play again
// Start app
app.init = function () {
  app.startGame = $("#startGame").one('click', function(){
    app.getQuestions();
    $('#intro').hide();
    $('#submit').show();
  })
  app.submit();
};

// Document ready
$(function() {
  app.init();
});