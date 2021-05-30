console.log("connexion à quiz.js");

var trialCount = 0;
var correctAnswersCount = 0;

class Proposition {
    constructor(nb, code, text){
        this.propId = "P"+nb;
        this.propValue = code;
        this.propText = text;
    }
}

class Question {
    constructor(nb, title, propositions, rightAnswer, correction, clue) {
        this.questId = "QN"+nb;
        this.questTitle = title;
        this.questPropArray = propositions;
        this.questRightAnswerValue = rightAnswer.propValue; // A DECLINER : Réponses multiples
        this.questCorrectionText = correction;
        this.questClue = clue;
    }
}

class Quiz {
    constructor(nb,title,questions){
        this.quizId = "QZ"+nb;
        this.quizTitle = title;
        this.quizCount = questions.length;
        this.quizQuestArray = questions;
    }
}

// Désactiver un élément
function disableElement(element) {
	element.disabled = true;
}

// Activer un élément
function activateElement(element) {
	element.removeAttribute("disabled");
}

// Montrer un élément 
function showElement(element) {
    element.style.display = "block";
}

// Cacher un élément 
function hideElement(element) {
    element.style.display = "none";
}

function printOneQuestion(nb, question) {
    let questHTML = "<div id=\"question"+nb+"\" class=\"question-card\"> <p class=\"question-title\">"+question.questTitle+"</p> <input type=\"radio\" name=\"q"+nb+"\" id=\"q"+nb+"p1\" value=\""+question.questPropArray[0].propValue+"\"> <label for=\"q"+nb+"p1\"> "+question.questPropArray[0].propText+" </label><br> <input type=\"radio\" name=\"q"+nb+"\" id=\"q"+nb+"p2\" value=\""+question.questPropArray[1].propValue+"\"> <label for=\"q"+nb+"p2\"> "+question.questPropArray[1].propText+"  </label><br> <input type=\"radio\" name=\"q"+nb+"\" id=\"q"+nb+"p3\" value=\""+question.questPropArray[2].propValue+"\"> <label for=\"q"+nb+"p3\"> "+question.questPropArray[2].propText+"  </label><br><p id=\"question"+nb+"Indice\" class=\"hidden-default\"><strong>Indice</strong><br>"+question.questClue+"<br><p id=\"question"+nb+"Correction\" class=\"hidden-default\"><strong>Correction</strong><br>"+question.questCorrectionText+"</p> </div>";

    document.getElementById("finalValidZone").insertAdjacentHTML("beforebegin", questHTML);
}

function printQuiz(quiz) {
    document.getElementById("quizTitle").innerHTML = quiz.quizTitle;

    for(let i=0; i < quiz.quizCount; i++) {
        let j = i+1;
        //console.log(j);
        printOneQuestion(j, quiz.quizQuestArray[i]);
    }
}

function getSelectedAnswer(name) {
    let answersPossible = document.getElementsByName(name);
    //console.log(answersPossible);
    let i = 0
    
    while (i<3) {
        if (answersPossible[i].checked) {
            //console.log(answersPossible[i].value);
            return answersPossible[i].value;
        }
        else {
            i++;
        }
    }
    //console.log("NO_ANSW");
    return "NO_ANSW";
}

function allQuestionsAnswered(quizCount) {
    let i = 0;

    while (i< quizCount) {
        let questionName = "q"+(i+1);
        let selectedValue = getSelectedAnswer(questionName);
       // console.log(selectedValue+" "+typeof(selectedValue));
        if (selectedValue.localeCompare("NO_ANSW") == 0) return false;
        i++;
    }

    return true;
}

function checkAnswer(value, quizQuestion) {
    // console.log(value+" - "+quizQuestion.questRightAnswerValue.toString());
    // console.log(typeof(value)+" - "+typeof(quizQuestion.questRightAnswerValue.toString()));
    let test = (value.localeCompare(quizQuestion.questRightAnswerValue) == 0) ? true : false;
    // console.log(test);
    return test;
}

function disableAllForm() {
    var form = document.getElementById("questionForm");
    var elements = form.elements;
    for (let i = 0; i < elements.length; ++i) {
        disableElement(elements[i]);
    }
}

function displayScoreComment(score, total, trials) {
    var scoreHTML = score+"/"+total;
    document.getElementById("resultats").innerHTML = scoreHTML;

    var tryAgainText = "<br>Vous pouvez retenter en utilisant les indices";
    var betterNextTime = "<br>Vous ferez mieux la prochaine fois !"
    var complement = (trials < 2) ? tryAgainText : betterNextTime;

    var scoreComment = "";

    switch(score) {
        case 0:
            scoreComment = "Aucune réponse correcte"+complement;
            break;
        case 1:
        case 2:
            scoreComment = "Il y a plusieurs erreurs"+complement;
            break;
        case 3:
        case 4:
            scoreComment = "Une majorité de bonnes réponses"+complement;
            break;
        case 5:
            if (trials == 1) {
                scoreComment = "C'est un triomphe, Bravo !"
            }
            else {
                scoreComment = "Toutes les réponses sont correctes, Bravo !"
            }
            break;
        default: break;
    }

    document.getElementById("scoreComment").innerHTML = scoreComment;
}

function recordAnswers(quiz) {
    disableAllForm();
    correctAnswersCount = 0;
    if (trialCount < 3) {
        for (let i=0;i < quiz.quizCount;i++) {
            let questionName = "q"+(i+1);
            let questionId = "question"+(i+1);
            let selectedValue = getSelectedAnswer(questionName);
    
            if (selectedValue.localeCompare("NO_ANSW") != 0)  {
    
                if (checkAnswer(selectedValue, quiz.quizQuestArray[i])){
                    document.getElementById(questionId).classList.remove("wrong-answer");
                    document.getElementById(questionId).classList.add("right-answer");
                    showElement(document.getElementById(questionId+"Correction"));
                    if (correctAnswersCount < 5) correctAnswersCount++;
                } else {
                    // document.getElementById(questionId).classList.remove("right-answer");
                    document.getElementById(questionId).classList.add("wrong-answer");
                    if (trialCount == 2) {
                        showElement(document.getElementById(questionId+"Correction"));
                    }
                    else {
                        showElement(document.getElementById(questionId+"Indice"));
                    }
                }
           }
        }
        hideElement(document.getElementById("finalValidZone"));
        hideElement(document.getElementById("btnValid"));
        
        if (correctAnswersCount > 4) {
            hideElement(document.getElementById("tryAgainBtn"));
        }
        displayScoreComment(correctAnswersCount, quiz.quizCount, trialCount);
        if (trialCount == 2)  hideElement(document.getElementById("tryAgainBtn"));
        
        showElement(document.getElementById("score"));

        trialCount++; 
        
        // console.log(correctAnswersCount);
    } 
        
}

function validateQuiz(quizCount) {
    if (document.getElementById("finalValid").checked) {

        if (allQuestionsAnswered(quizCount)){
            activateElement(document.getElementById("btnValid"));
            hideElement(document.getElementById("score"));

        } else {
            document.getElementById("scoreText").innerHTML = "Vous n'avez pas répondu à toutes les questions"
            showElement(document.getElementById("score"));
            document.getElementById("finalValid").checked = false;
        }
    }
    else {
        disableElement(document.getElementById("btnValid"));
       
    }
}

function reopenQuiz(quizCount) {
    if (trialCount < 3) {
        document.getElementById("finalValid").checked = false;
        disableElement(document.getElementById("btnValid"));

        document.getElementById("trialCountZone").innerHTML = ((3 - trialCount) > 1) ? "Il reste "+(3 - trialCount)+" tentatives." : "Il reste "+(3 - trialCount)+" tentative.";

        showElement(document.getElementById("finalValidZone"));
        showElement(document.getElementById("btnValid"));
        hideElement(document.getElementById("score"));

        for (let i=0;i < quizCount;i++){
            let questionId = "question"+(i+1);
            if (document.getElementById(questionId).classList.contains("wrong-answer")) {
                var elements = document.getElementById(questionId).children;
                for (let i = 0; i < elements.length; ++i) {
                    activateElement(elements[i]);
                }
            }
        }
        activateElement(document.getElementById("finalValid"));
    }
    else {
        //hideElement(document.getElementById("tryAgainBtn"));
        alert("Pas plus de 3 tentatives !");
    }
}

/* Question 1 - DEBUT */
var propositions1 = [new Proposition (1,"NY","New York"), new Proposition(2, "MEX", "Mexico"), new Proposition(3, "SP", "Sao Paulo")];

var correctionText1 = "La plus grande agglomération d'Amérique est Sao Paulo, au Brésil, avec 36 315 721 habitants (2018).<br> New York aux Etats-Unis arrive en deuxième position, avec 22 589 036 habitants (2019) et Mexico au Mexique, en troisième position avec 21 634 279 habitants (2020).<br><small>(Source: PopulationData.net, 2021)</small>";

var clue1 = "Cette agglomération ne se situe pas en Amérique du Nord.";

var question1 = new Question(1, "Quelle est l'agglomération la plus peuplée d'Amérique ?", propositions1, propositions1[2], correctionText1, clue1);
/* Question 1 - FIN */

/* Question 2 - DEBUT */
var propositions2 = [new Proposition (1,"CAP","Le Cap"), new Proposition(2, "PRE", "Pretoria"), new Proposition(3, "BL", "Bloemfontein")];

var correctionText2 = "L'Afrique du Sud a trois capitales.<br> <strong>Pretoria/Tshwane</strong> est la capitale <strong>administrative</strong>.<br><strong>Le Cap</strong> est la capitale <strong>parlementaire</strong>.<br><strong>Bloemfontein/Mangaung</strong> est la capitale <strong>judiciaire</strong>.<br><small>(Source: Ministère des affaires étrangères, 2021)</small>";

var clue2 = "Cette ville tire son nom de sa position littorale.";

var question2 = new Question(2, "Quelle ville est la capitale parlementaire de l'Afrique du Sud ?", propositions2, propositions2[0], correctionText2, clue2);
/* Question 2 - FIN */

/* Question 3 - DEBUT */
var propositions3 = [new Proposition (1,"PLT","un mot latin pour désigner une plante, l'anis"), new Proposition(2, "GRE", "un mot grec pour désigner la victoire"), new Proposition(3, "ENG", "un mot anglais pour décrire à quel point la ville est agréable")];

var correctionText3 = "La ville de Nice tire son nom du mot grec pour désigner la victoire.<br>Les Phocéens, qui ont fondé Massalia (Marseille), établissent, vers 350 avant J.-C., un comptoir commercial qu'ils baptisent Nikaïa.<br><small>(Source: Encyclopedia Universalis, 2021)</small>";

var clue3 = "Nice a été fondée par des Phocéens originaires d'une cité située sur la côte de la mer Egée.";

var question3 = new Question(3, "D'où vient le nom de la ville de Nice ?", propositions3, propositions3[1], correctionText3, clue3);
/* Question 3 - FIN */

/* Question 4 - DEBUT */
var propositions4 = [new Proposition (1,"MAN","Manille"), new Proposition(2, "BEI", "Beijing (Pékin)"), new Proposition(3, "JAK", "Jakarta (Jabodetabek)")];


var correctionText4 = "La plus grande de ces trois agglomérations est Jakarta, avec 35 143 473  habitants (2019).<br> Manille compte 28 644 207 habitants (2021), Beijing (Pékin) n'en compte \"que\"  21 893 095 (2021).<br><small>(Source: PopulationData.net, 2021)</small>";

var clue4 = "Cette agglomération ne se trouve pas en Chine.";

var question4 = new Question(4, "Laquelle de ces agglomérations d'Asie est la plus peuplée ?", propositions4, propositions4[2], correctionText4, clue4);
/* Question 4 - FIN */

/* Question 5 - DEBUT */
var propositions5 = [new Proposition (1,"LI","Lille"), new Proposition(2, "PA", "Paris"), new Proposition(3, "LY", "Lyon")];

var correctionText5 = "Lutèce, ou Lutetia en latin, était, à l'époque antique, le nom de la capitale du peuple des Parisii. Cette capitale a évolué pour devenir la ville de Paris.<br><small>(Source: Ministère de la culture, 2021)</small>";

var clue5 = "Cette ville est traversée par la Seine.";

var question5 = new Question(5, "Sous quel nom la ville de Lutèce est-elle connue aujourd'hui ?", propositions5, propositions5[1], correctionText5, clue5);
/* Question 5 - FIN */

var quizVilles = new Quiz(1,"Les villes du monde", [question1, question2, question3, question4, question5])


function pageSetUp() {
    printQuiz(quizVilles);

    document.getElementById("trialCountZone").innerHTML = "Il reste 3 tentatives.";

    document.getElementById("finalValid").checked = false;
    disableElement(document.getElementById("btnValid"));

    document.getElementById("finalValid").addEventListener('change', () => validateQuiz(quizVilles.quizCount));
    
    document.getElementById("btnValid").addEventListener("click", () => recordAnswers(quizVilles));

    document.getElementById("tryAgainBtn").addEventListener("click", () => reopenQuiz(quizVilles.quizCount));
    
}

window.onload = pageSetUp();