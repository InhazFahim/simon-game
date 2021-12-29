const buttonColours = ["red" , "blue" , "green" , "yellow"];
let gamePattern = [];
let userClickedPattern = [];
let randomChosenColour = [];
let randomNumber;

let started = false;
let level = 0;
let initializer = true;

let current_path = window.location.pathname.split('/').pop();

if($(window).width() < 480){
    $('#level-title').text("Tap On The Screen To Play");
} else {
    $('#level-title').text("Click To Start");   
}

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

$(document).on('click' , function(){
    if(current_path === "game.html"){    
        if(!started && initializer == true){
            started = true; 
            initializer = false;      
            nextSequence();
        }
    }
});

$(".btn").on('click', clickFunction);

function clickFunction(){
    if(started == true){
        let userChosenColour = $(this).attr("id");
        userClickedPattern.push(userChosenColour);
        checkAnswers(userClickedPattern.length - 1);
        playSound(userChosenColour);
        animatePress(userChosenColour);
    }
}

function nextSequence(){
    level++
    $("#level-title-two").text('')
    userClickedPattern = [];
    $("#level-title").text("Level " + level);
    randomNumber = Math.floor(Math.random() * 4);
    randomChosenColour = buttonColours[randomNumber];
    gamePattern.push(randomChosenColour);
    $("#" + randomChosenColour).fadeIn(200).fadeOut(200).fadeIn(200);
    playSound(randomChosenColour);
}

function playSound(name){
    let audio = new Audio("sounds/" + name + ".mp3");
    audio.play();
}

function animatePress(currentColour){
    $("#" + currentColour).addClass("pressed");
    setTimeout(function(){
        $("#" + currentColour).removeClass("pressed");
    },100)
}

function checkAnswers(gameLevel){
    if(gamePattern[gameLevel] === userClickedPattern[gameLevel]){
        if(gamePattern.length === userClickedPattern.length){
            setTimeout(function(){
                nextSequence();
            },1000);
        }
    }else{
        $(".btn").off('click');
        $("#level-title").text("GAME OVER");
        playSound("wrong");
        $("body").addClass("game-over");
        setTimeout(function(){
            $("body").removeClass("game-over");
        },200);
        HighScore(level)
        gameOver();
    }
}

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

