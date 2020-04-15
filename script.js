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

<<<<<<< HEAD
    let questionsArray = result.results;
=======
				let questionsArray = result.results;
				
			app.displayQuestions(questionsArray);
>>>>>>> master

    app.displayQuestions(questionsArray);

  })
}

app.answer = []

// Display questions to user
// Randomly display options of correct and incorrect answers to user
app.displayQuestions = (questionsArray) => {
<<<<<<< HEAD
  questionsArray.forEach((quest) => {
    const question = quest.question;
=======
	questionsArray.forEach((quest) => {
        const question = quest.question;

        const answer = quest.correct_answer;
        app.answer.unshift(answer);
>>>>>>> master

    const answer = quest.correct_answer;
    app.answer.unshift(answer);

    const wAnswers = quest.incorrect_answers;

    const options = [answer, ...wAnswers];

<<<<<<< HEAD
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

    const oneQuestion = `
=======
        const oneQuestion = `
>>>>>>> master
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

app.userAns = [];

app.submit = () => {

<<<<<<< HEAD
  $('#submit').click(
    function (e) {
      e.preventDefault();
      const checked = $('form input[type=radio]:checked').each(function (index, element) {
        ans = $(element).val();
        app.userAns.push(ans);
      });

      if ($(app.userAns).length < 3) {
        alert('Please answer all the questions!')
      } else {

        let correctAns = 0;
        for (var i = 0; i < app.userAns.length; i++) {

          if (app.userAns[i] === app.answer[i]) {
            console.log(`${app.userAns[i]} is correct!`);
            correctAns = correctAns + 1;
          }
          else if (app.userAns[i] != app.answer[i]) {
            console.log(`${app.userAns[i]} is incorrect. The correct answer was ${app.answer[i]}`)
          }

        }

        if (correctAns >= 2) {
          console.log('You win!')
        }
      }




      // console.log(app.userAns);
      // console.log(app.answer);
    }
  )

}




=======
$('#submit').click(
  function (e) {  
    e.preventDefault();
       const checked = $('form input[type=radio]:checked').each(function(index, element){ 
   ans = $(element).val();
   app.userAns.push(ans);
	   });
		
		if ($(app.userAns).length < 3) {
		alert('Please answer all the questions!')
		} else {
		
			let correctAns = 0;
    for (var i = 0; i < app.userAns.length; i++) {
      
        if (app.userAns[i] === app.answer[i]) {
          console.log(`${app.userAns[i]} is correct!`);
          correctAns = correctAns + 1;
        }
      else if (app.userAns[i] != app.answer[i]){
          console.log(`${app.userAns[i]} is incorrect. The correct answer was ${app.answer[i]}`)
      }

	}
		
		if (correctAns >= 2) {
			console.log('You win!')
		}
	}
     
    
    	
		
		// console.log(app.userAns);
		// console.log(app.answer);
  }
  )

}
  


    
>>>>>>> master

// Display score/results along with button to play again
// Start app
app.init = function () {
  app.startGame = $("#startGame").one('click', function () {
    app.getQuestions();
    $('#intro').hide();
    $('#submit').show();
  })
  app.submit();
};

// Document ready
$(function () {
  app.init();
});