const words = ['cat', 'spend', 'house', 'cousin'];

const indiceAleatorio = Math.floor(Math.random() * words.length);

// Obtener la palabra en la posición aleatoria
const palabraAleatoria = words[indiceAleatorio];

console.log(`Palabra aleatoria: ${palabraAleatoria}`);

const word = document.getElementById('word');

word.innerHTML = `
<p class='text-3xl font-bold text-white underline'>${palabraAleatoria}</p>`

// microfono

let isRecording = false;

const startButton = document.getElementById('startButton');
const micIcon = document.getElementById('micIcon');
// const stopButton = document.getElementById('stopButton');
const transcriptionDiv = document.getElementById('transcription');
const audioElement = document.getElementById('audioElement'); // Declarar audioElement aquí
const textButton = document.getElementById('buttonText');
const verify = document.getElementById('verify');
let mediaRecorder;
let audioChunks = [];

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function (stream) {
            mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.ondataavailable = function (event) {
                if (event.data.size > 0) {
                    audioChunks.push(event.data);
                }
            };

            mediaRecorder.onstop = function () {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);

                startButton.disabled = false;

                audioElement.src = audioUrl;
                audioElement.play(); // Reproducir el audio

                // Mostrar el texto reconocido en el elemento "transcription"
                try {
                    const recognition = new webkitSpeechRecognition();
                    recognition.onresult = function (event) {
                        const result = event.results[0][0].transcript;
                        transcriptionDiv.textContent = result;
                        if(result.split('.')[0].toLowerCase() === palabraAleatoria) {
                            console.log('Entre aqui')
                            verify.classList.remove('bg-red-500');
                            verify.classList.add('bg-green-500');
                            verify.innerHTML = `
                            <i class="fas fa-check"></i>`
                        } else {
                            console.log('Entre aqui en el malo')
                            verify.classList.remove('bg-green-500');
                            verify.classList.add('bg-red-500');
                            verify.innerHTML = `
                            <i class="fa-solid fa-xmark"></i>`
                        }
                        console.log(result.split('.')[0]);
                    };

                    recognition.start();
                } catch (e) {
                    console.log('Ha habido algun error: ' + e);
                }
            };

            startButton.addEventListener('click', function () {

                isRecording = !isRecording;
                if (isRecording) {
                    audioChunks = [];
                    // Si está grabando, cambia el ícono y el texto
                    micIcon.classList.remove('fa-microphone');
                    micIcon.classList.add('fa-microphone-alt');
                    textButton.textContent = 'Detener Captura de Audio';
                    console.log('Llegue aqui cuando prendo micro')
                    mediaRecorder.start();
                    
                  } else {
                    // Si no está grabando, vuelve al ícono y texto originales
                    micIcon.classList.remove('fa-microphone-alt');
                    micIcon.classList.add('fa-microphone');
                    textButton.textContent = 'Iniciar Captura de Audio';
                    console.log('Llegue aqui cuando apago micro')
                    mediaRecorder.stop();
                  }
                
            });
        })
        .catch(function (error) {
            console.error('Error al acceder al micrófono:', error);
        });
} else {
    console.error('El navegador no admite la API MediaStream');
}