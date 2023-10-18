const question = [
    {
        question: 'Where did the family vacation last year?',
        srcAudio: 'listening/audio1.mp3',
        answers: ['A. Italy', 'B. France', 'C. Florida', 'D. California'],
        correctAnswer: 'Florida',
    },
]

if (!localStorage.getItem("user")) {
    window.location.href = '/index.html';
}

const source = document.querySelector('source');

const indiceAleatorio = Math.floor(Math.random() * question.length);
const questionAleatoria = question[indiceAleatorio];


source.src = questionAleatoria.srcAudio;

const questionSelected = document.getElementById('question');

questionSelected.textContent = questionAleatoria.question;
const list = document.getElementById('list-answer');
const validated = document.getElementById('validated');
let selectedAnswer;

questionAleatoria.answers.forEach((item, index) => {
    let [optionNumber, optionValue] = item.split('.')
    optionValue = optionValue.trim()

    const listItem = document.createElement('li');
    const spanNumber = document.createElement('span')
    spanNumber.classList.add('pr-10', 'text-3xl', 'text-white')
    listItem.classList.add('list-none', 'cursor-pointer', 'w-[100%]', 'list-validated', 'flex', 'gap-5');
    const button = document.createElement('button');
    button.classList.add('w-[50%]', 'text-start', 'rounded-xl', 'pl-10', 'bg-gray-100', 'button-validated')
    spanNumber.textContent = optionNumber + '.';
    button.textContent = optionValue;

    button.addEventListener('click', () => {
        // Limpiar la selección anterior
        console.log(selectedAnswer);
        if (selectedAnswer !== undefined) {
            return;
        }
        validated.removeAttribute('disabled');
        const selectedButton = document.querySelector('.bg-purple-300');
        if (selectedButton) {
            selectedButton.classList.remove('bg-purple-300');
        }

        // Marcar como seleccionado
        button.classList.add('bg-purple-300');

        // Imprimir en la consola el texto seleccionado
        selectedAnswer = index;

    });
    listItem.appendChild(spanNumber)
    listItem.appendChild(button);
    list.appendChild(listItem);
});

validated.addEventListener('click', (e) => {
    const botones = document.querySelectorAll('.list-validated');
    const buttonSelected = botones[selectedAnswer];
    if (buttonSelected.children[1].textContent === questionAleatoria.correctAnswer) {

        const jsonString = localStorage.getItem("user");
        console.log(jsonString)
        const miObjeto = JSON.parse(jsonString);
        console.log('no paso aqui')
        miObjeto.score += 10;
        localStorage.setItem('user', JSON.stringify(miObjeto));
        console.log(miObjeto);

        const verifyIcon = document.createElement('div');
        verifyIcon.classList.add('flex', 'justify-center', 'items-center', 'rounded-full', 'text-white', 'h-[25px]', 'w-[25px]', 'bg-green-500');
        verifyIcon.innerHTML = `
                        <i class="fas fa-check"></i>`
        buttonSelected.appendChild(verifyIcon);
    } else {
        const verifyIcon = document.createElement('div');
        verifyIcon.classList.add('flex', 'justify-center', 'items-center', 'rounded-full', 'text-white', 'h-[25px]', 'w-[25px]', 'bg-red-500');
        verifyIcon.innerHTML = `
    <i class="fa-solid fa-xmark"></i>`
        buttonSelected.appendChild(verifyIcon);
    }
    console.log(e);
    validated.disabled = true;
})

const showValidatedAnswer = (isCorrect, node, score = 10) => {
    console.log(parseFloat(score));
    if (isCorrect) {
        const jsonString = localStorage.getItem("user");
        const miObjeto = JSON.parse(jsonString);
        if (score !== 10) {
            miObjeto.score = parseFloat(miObjeto.score + score).toFixed(2);
        } else miObjeto.score += 10;
        localStorage.setItem('user', JSON.stringify(miObjeto));
        const verifyIcon = document.createElement('div');
        verifyIcon.classList.add('flex', 'justify-center', 'items-center', 'rounded-full', 'text-white', 'h-[25px]', 'w-[25px]', 'bg-green-500');
        verifyIcon.innerHTML = `
                                <i class="fas fa-check"></i>`
        node.appendChild(verifyIcon);
    } else {
        const verifyIcon = document.createElement('div');
        verifyIcon.classList.add('flex', 'justify-center', 'items-center', 'rounded-full', 'text-white', 'h-[25px]', 'w-[25px]', 'bg-red-500');
        verifyIcon.innerHTML = `
            <i class="fa-solid fa-xmark"></i>`
        node.appendChild(verifyIcon);
    }
    validated.disabled = true;
}   