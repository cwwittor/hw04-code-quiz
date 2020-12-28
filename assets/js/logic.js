// variables to keep track of quiz state
var currentQuestionIndex = 0;
var time = questions.length * 15;
var timerId;

// variables to reference DOM elements
var questionsEl = document.getElementById("questions");
var timerEl = document.getElementById("time");
var choicesEl = document.getElementById("choices");
var submitBtn = document.getElementById("submit");
var startBtn = document.getElementById("start");
var initialsEl = document.getElementById("initials");
var feedbackEl = document.getElementById("feedback");

// sound effects
var sfxRight = new Audio("assets/sfx/correct.wav");
var sfxWrong = new Audio("assets/sfx/incorrect.wav");

function startQuiz() {
  // hide start screen
  var hideStart = document.getElementById("start-screen");
  hideStart.style.display = "none";
  // un-hide questions section
  questionsEl.style.display = "block";

  // start timer
  clockTick();

  // show starting time


  getQuestion();
}

function getQuestion() {
  // get current question object from array
  var currentQuestion = questions[currentQuestionIndex];

  // update title with current question
  questionsEl.textContent = currentQuestion.title;

  // clear out any old question choices
  
  

  // loop over choices
  currentQuestion.choices.forEach(function(choice, i) {
    // create new button for each choice
    var button = document.createElement("button");
    button.innerText = choice;
    questionsEl.appendChild(button);
  
    //var choiceClass = document.getElementById("choices");
    
    

    button.addEventListener("click", function () {
      value = choice;
      questionClick();
    });

    button.style.display = "block";

    // display on the page
    //button.style.display = "block";

  });
}

function questionClick() {
  // check if user guessed wrong
  if (this.value !== questions[currentQuestionIndex].answer) {
    // penalize time
    time -= 15;

    if (time < 0) {
      time = 0;
    }

    // display new time on page
    timerEl.textContent = time;

    // play "wrong" sound effect
    sfxWrong.play();
    feedbackEl.textContent = "Wrong!";
  } else {
    // play "right" sound effect
    sfxRight.play();
    feedbackEl.textContent = "Correct!";
  }

  // flash right/wrong feedback on page for half a second
  feedbackEl.setAttribute("class", "feedback");
  setTimeout(function() {
    feedbackEl.setAttribute("class", "feedback hide");
  }, 1000);

  // move to next question
  currentQuestionIndex ++;

  // check if we've run out of questions
  if (currentQuestionIndex === questions.length) {
    quizEnd();
  } else {
    getQuestion();
  }
}

function quizEnd() {
  // stop timer
  clearInterval(timerId);
  // show end screen
  var endScreen = document.getElementById("end-screen");
  endScreen.style.display = "block";
  // show final score
  var finalScore = document.getElementById("final-score");
  finalScore.textContent = time;
  // hide questions section
  questionsEl.style.display = "none";
}

function clockTick() {
  // update time
  timerId = setInterval(function()  {
  time--;
  timerEl.textContent = time;

  // check if user ran out of time
  if (time <= 0) {
    quizEnd();
  }
}, 1000);
}

function saveHighscore() {
  // get value of input box
  

  var userInitials = document.getElementById("initials").value;
  var highscores;
  // make sure value wasn't empty
  if (userInitials !== "") {
    // get saved scores from localstorage, or if not any, set to empty array
    if (localStorage.getItem("highscores") ==! []) {
      highscores = localStorage.getItem("highscores");
      alert(localStorage);
      alert("hello1"+highscores);
    } else  {
      highscores = [];
    }
    // format new score object for current user
    var newScore = {
      "score": time,
      "initials": userInitials
    };

    // save to localstorage
    //localStorage.push(newScore);
    //alert(JSON.stringify(newScore));
    localStorage.setItem("highscores", JSON.stringify(newScore));
    alert(JSON.parse(localStorage.getItem("highscores")));

    // redirect to next page
    window.location.href = "highscores.html";
  }
}

function checkForEnter(event) {
  // "13" represents the enter key
  if (event.key === "Enter") {
    saveHighscore();
  }
}

// user clicks button to submit initials
submitBtn.addEventListener("click", saveHighscore);

// user clicks button to start quiz
startBtn.addEventListener("click", startQuiz);

initialsEl.addEventListener("onkeyup", checkForEnter);
