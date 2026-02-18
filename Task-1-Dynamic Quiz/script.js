const answers = {
    q1: "Paris",
    q2: "12",
    q3: "Pink",
    q4: "7",
    q5: "JavaScript"
};

function checkAnswer(inputId, correctAnswer) {
    const userAnswer = document.getElementById(inputId).value.trim();
    return userAnswer.toLowerCase() === correctAnswer.toLowerCase();
}

function calculateScore() {
    let score = 0;
    for (let key in answers) {
        if (checkAnswer(key, answers[key])) score++;
    }
    return score;
}

function displayResults() {
    const score = calculateScore();
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = `You scored ${score} out of ${Object.keys(answers).length}.`;

    if (score === Object.keys(answers).length) {
        resultsDiv.innerHTML += " Excellent!";
    } else if (score >= 3) {
        resultsDiv.innerHTML += " Good job!";
    } else {
        resultsDiv.innerHTML += " Try again!";
    }
}

function resetQuiz() {
    document.getElementById("quiz").reset?.();
    document.getElementById("results").innerHTML = "";
    document.querySelectorAll("input[type=text]").forEach(input => input.value = "");
}

document.getElementById("submitBtn").addEventListener("click", displayResults);
document.getElementById("resetBtn").addEventListener("click", resetQuiz);

