let questions = [];
let flipped = [];  // Nouveau tableau pour suivre l'état de chaque flashcard

// Affiche le formulaire de création
function showCreator() {
    document.getElementById('creator').style.display = 'block';
    document.getElementById('edit-section').style.display = 'none';
}

// Affiche la section de modification
function showEdit() {
    document.getElementById('edit-section').style.display = 'block';
    document.getElementById('creator').style.display = 'none';
    generateEditList();
}

// Ajouter une question au QCM
function addQuestion() {
    const question = document.getElementById('question').value;
    const answer1 = document.getElementById('answer1').value;
    const answer2 = document.getElementById('answer2').value;
    const answer3 = document.getElementById('answer3').value;
    const answer4 = document.getElementById('answer4').value;
    const correctAnswer = document.getElementById('correctAnswer').value;

    if (question && answer1 && answer2 && answer3 && answer4 && correctAnswer) {
        const newQuestion = {
            question: question,
            answers: [answer1, answer2, answer3, answer4],
            correct: correctAnswer
        };
        questions.push(newQuestion);
        flipped.push(false); // Ajout d'une nouvelle carte avec un état "non retournée"
        alert('Question ajoutée avec succès !');
        clearForm();
    } else {
        alert('Veuillez remplir tous les champs.');
    }
}

// Efface le formulaire après ajout
function clearForm() {
    document.getElementById('question').value = '';
    document.getElementById('answer1').value = '';
    document.getElementById('answer2').value = '';
    document.getElementById('answer3').value = '';
    document.getElementById('answer4').value = '';
    document.getElementById('correctAnswer').value = '';
}

// Affiche le mode sélectionné (QCM ou Flashcard)
function showMode(mode) {
    if (mode === 'qcm') {
        document.getElementById('qcm').style.display = 'block';
        document.getElementById('flashcard').style.display = 'none';
        generateQCM();
    } else if (mode === 'flashcard') {
        document.getElementById('flashcard').style.display = 'block';
        document.getElementById('qcm').style.display = 'none';
        generateFlashcards();
    }
    document.getElementById('result').innerHTML = '';  // Reset result
}

// Générer les questions du QCM
function generateQCM() {
    const container = document.getElementById('qcm-container');
    container.innerHTML = '';  // Reset
    questions.forEach((q, index) => {
        const qDiv = document.createElement('div');
        qDiv.classList.add('qcm-question');
        qDiv.innerHTML = `<p>${index + 1}. ${q.question}</p>`;
        
        const optionsDiv = document.createElement('div');
        optionsDiv.classList.add('qcm-options');
        
        // Crée un élément pour afficher le résultat sous chaque question
        const resultDiv = document.createElement('div');
        resultDiv.id = `result-${index}`;
        resultDiv.classList.add('qcm-result');
        
        q.answers.forEach((answer, i) => {
            const btn = document.createElement('button');
            btn.innerHTML = answer;
            
            // Chaque bouton vérifie la réponse pour la question correspondante
            btn.onclick = () => checkAnswer(q.correct, i + 1, index);
            optionsDiv.appendChild(btn);
        });

        qDiv.appendChild(optionsDiv);
        qDiv.appendChild(resultDiv);  // Ajoute la zone du résultat après les options
        container.appendChild(qDiv);
    });
}

// Vérifier la réponse au QCM et afficher le résultat sous la question correspondante
function checkAnswer(correct, selected, index) {
    const resultDiv = document.getElementById(`result-${index}`);
    if (correct == selected) {
        resultDiv.innerHTML = "<p style='color:green;'>Bonne réponse !</p>";
    } else {
        resultDiv.innerHTML = "<p style='color:red;'>Mauvaise réponse. Réessaye.</p>";
    }
}


// Générer les flashcards
function generateFlashcards() {
    const container = document.getElementById('flashcard-container');
    container.innerHTML = '';  // Reset
    questions.forEach((q, index) => {
        const flashcard = document.createElement('div');
        flashcard.classList.add('flashcard');
        flashcard.innerHTML = `Carte ${index + 1}: ${q.question}`;
        
        // Ajouter un événement pour retourner la carte
        flashcard.onclick = () => {
            if (!flipped[index]) {
                flashcard.innerHTML = `Réponse : ${q.answers[q.correct - 1]}`;
            } else {
                flashcard.innerHTML = `Carte ${index + 1}: ${q.question}`;
            }
            flipped[index] = !flipped[index];  // Inverser l'état retourné
        };
        container.appendChild(flashcard);
    });
}

// Fonction pour retourner toutes les cartes en même temps
function flipAllFlashcards() {
    const container = document.getElementById('flashcard-container');
    const flashcards = container.getElementsByClassName('flashcard');

    for (let i = 0; i < flashcards.length; i++) {
        const flashcard = flashcards[i];
        if (!flipped[i]) {
            flashcard.innerHTML = `Réponse : ${questions[i].answers[questions[i].correct - 1]}`;
        } else {
            flashcard.innerHTML = `Carte ${i + 1}: ${questions[i].question}`;
        }
        flipped[i] = !flipped[i];  // Inverser l'état retourné pour chaque carte
    }
}

// Générer la liste des questions pour modification
function generateEditList() {
    const container = document.getElementById('edit-container');
    container.innerHTML = '';  // Reset
    questions.forEach((q, index) => {
        const editDiv = document.createElement('div');
        editDiv.classList.add('qcm-question');
        editDiv.innerHTML = `
            <p>Question ${index + 1} : <input type="text" value="${q.question}" id="edit-question-${index}"></p>
            <p>Réponses :</p>
            <input type="text" value="${q.answers[0]}" id="edit-answer1-${index}"> 
            <input type="text" value="${q.answers[1]}" id="edit-answer2-${index}">
            <input type="text" value="${q.answers[2]}" id="edit-answer3-${index}">
            <input type="text" value="${q.answers[3]}" id="edit-answer4-${index}">
            <p>Bonne réponse : <input type="number" value="${q.correct}" id="edit-correct-${index}" min="1" max="4"></p>
            <button class="edit-button" onclick="saveQuestion(${index})">Sauvegarder les modifications</button>
        `;
        container.appendChild(editDiv);
    });
}

// Sauvegarder les modifications apportées à une question
function saveQuestion(index) {
    const newQuestion = document.getElementById(`edit-question-${index}`).value;
    const newAnswer1 = document.getElementById(`edit-answer1-${index}`).value;
    const newAnswer2 = document.getElementById(`edit-answer2-${index}`).value;
    const newAnswer3 = document.getElementById(`edit-answer3-${index}`).value;
    const newAnswer4 = document.getElementById(`edit-answer4-${index}`).value;
    const newCorrect = document.getElementById(`edit-correct-${index}`).value;

    if (newQuestion && newAnswer1 && newAnswer2 && newAnswer3 && newAnswer4 && newCorrect) {
        questions[index].question = newQuestion;
        questions[index].answers = [newAnswer1, newAnswer2, newAnswer3, newAnswer4];
        questions[index].correct = newCorrect;
        alert('Question modifiée avec succès !');
        generateEditList(); // Met à jour l'affichage de la liste des questions modifiées
    } else {
        alert('Veuillez remplir tous les champs.');
    }
}
