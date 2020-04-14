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
      })
    }





// When user clicks submit, check user answers against correct answers
// Verify all questions have been answered

// Display score/results along with button to play again

// Start app
app.init = function () {
	app.getQuestions();
};

// Document ready
$(function() {
	app.init();
});