const buttonColours = ["red" , "blue" , "green" , "yellow"]; 
let gamePattern = [];       // The random colour blinks will be recorded in this array
let userClickedPattern = []; 
let randomChosenColour;     // Variable to store random colour for the sequence
let randomNumber;
let started = false;        // This Variable is used to enable the user to click only when game is started
let level = 0;              // setting the level to 0  
let current_path = window.location.pathname.split('/').pop(); // setting the file name

/* 01. This click will work only in game.html file
   02. started variable will be set true when the game is initialized */ 
$(document).on('click' , function(){
    if(current_path === "game.html" && !started){   
        started = true;      
        nextSequence();
    }
});

/* 01. User clicked pattern will be empty 
   02. A random colour will be chosen 
   03. Random color pattern will be recorded in game pattern from level 1 */
function nextSequence(){
    level++ ;
    userClickedPattern = [];
    $("#level-title").text("Level " + level);
    randomNumber = Math.floor(Math.random() * 4);
    randomChosenColour = buttonColours[randomNumber];
    gamePattern.push(randomChosenColour);
    $("#" + randomChosenColour).fadeIn(200).fadeOut(200).fadeIn(200);
    playSound(randomChosenColour);
}

/* 01. record the user clicked pattern in the array
   02. click function works only when the game is started*/
function clickFunction(){
    if(started == true){
        let userChosenColour = $(this).attr("id");
        userClickedPattern.push(userChosenColour);
        checkAnswers(userClickedPattern.length - 1);
        playSound(userChosenColour);
        animatePress(userChosenColour);
    }
}

/* 01. play the sound for every click and when the game is over
   02. playSound function accepts an argument of id of the element(colour)
   03. the sound track has the same name as the id*/
function playSound(name){
    let audio = new Audio("sounds/" + name + ".mp3");
    audio.play();
}

/* 01. when the user clicks a button the colour blinks*/
function animatePress(currentColour){
    $("#" + currentColour).addClass("pressed");
    setTimeout(function(){
        $("#" + currentColour).removeClass("pressed");
    },100)
}

/* 01. this function gets the length of user chosen color array as an argument
   02. userClickedPatterns's last element is been checked with the same position of game pattern
   03. if the Colour is correct the next sequence function will be called
   04. If the user clicks wrong button then high score will be updated and call the game over function*/
function checkAnswers(gameLevel){
    if(gamePattern[gameLevel] === userClickedPattern[gameLevel]){
        if(gamePattern.length === userClickedPattern.length){
            setTimeout(function(){
                nextSequence();
            },1000);
        }
    }else{
        $(".btn").off('click');
        playSound("wrong");
        $("body").addClass("game-over");
        setTimeout(function(){
            $("body").removeClass("game-over");
        },500);
        HighScore(level)
        gameOver();
    }
}
 /* 01. there will be a popup which have 2 options menu and replay 
    02. If user click menu then it will navigate to main page
    03. if user clicks replay then the level and gamePattern will be reset then call the nextSequence */
function gameOver(){
    $('body').append('<div id="gameOverPopUp"></div>');
    $('#gameOverPopUp').prepend('<h3 id="popUpHeading">GAME OVER</h3>');
    $('#gameOverPopUp').append('<div id="Opts"></div>');
    $('#Opts').append('<div id="MainMenuOpt">Menu</div>');
    $('#Opts').append('<div id="ReplayOpt">Replay</div>');
    $('#MainMenuOpt').on('click' , (function(){
        location.href = "index.html";
    }))
    
    $('#ReplayOpt').on('click' , (function(){
        $(".btn").on('click' , clickFunction);
        $("#gameOverPopUp").remove();
        level = 0; 
        gamePattern = [];
        started = true;
        nextSequence();
    }));
}

/* 01. This function accepts current level as an argument after the game over 
   02. highScore is scored as local storage
   03. High score will be updated if the user has beaten his previous score else the score will be same */
function HighScore(currentScore){
    var score = currentScore ;
    var high_score = 0
    high_score = localStorage.getItem("highScore");
    if(high_score !== null){
        if(score > high_score){
            high_score = localStorage.setItem("highScore",score);
        }
    }else{
        localStorage.setItem("highScore",score)
    }
}

/* 01. This function generates a popup in the main page when user clicked the highScore in the menu 
   02. The highScore saved in the function will be displayed here*/
$("#HighScoreBtn").on("click", (function(){
    high_score = localStorage.getItem("highScore");
    $('body').append('<div id="highScorePopUp"></div>');
    $('#highScorePopUp').prepend('<h3 id="highScorePopUpHeading">High Score</h3>');
    $('#highScorePopUp').append('<h3 id="highScoreBlock">' + high_score + '</h3>');
    $('#highScorePopUp').append('<div id="highScoreOkBtn">OK</div>');
    $('#highScoreOkBtn').on('click',(function(){
        $('#highScorePopUp').remove();
    }))
}));

// This condition is to display different message to different devices
if($(window).width() < 480){
    $('#level-title').text("Tap On The Screen To Play");
} else {
    $('#level-title').text("Click To Start");   
}

// Calls the function when buttons are clicked
$(".btn").on('click', clickFunction);