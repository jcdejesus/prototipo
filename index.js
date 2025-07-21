document.addEventListener('DOMContentLoaded', () => {
    // --- Funcionalidad del Temporizador Visual ---
    const timerElement = document.getElementById('timer');
    const initialTimeInSeconds = 10 * 60; // 10 minutos * 60 segundos/minuto
    let timeLeft = initialTimeInSeconds;
    let timerInterval;

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }

    function updateTimerDisplay() {
        timerElement.textContent = formatTime(timeLeft);
        if (timeLeft <= 60) { // Menos de 1 minuto, cambia a rojo
            timerElement.classList.add('low-time');
        } else {
            timerElement.classList.remove('low-time');
        }

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerElement.textContent = "00:00";
            showBannerNotification("¡Tiempo terminado! El desafío ha finalizado.", "info");
            // Aquí puedes añadir lógica adicional, como deshabilitar botones de envío, etc.
        }
    }

    function startTimer() {
        if (timerElement) {
            updateTimerDisplay(); // Mostrar el tiempo inicial
            timerInterval = setInterval(() => {
                timeLeft--;
                updateTimerDisplay();
            }, 1000); // Actualizar cada segundo
        }
    }

    startTimer(); // Iniciar el temporizador al cargar la página


    // Simulación de ejecución de código para el reto del Factorial
    const runCodeButton = document.getElementById('run-code');
    const codeInput = document.getElementById('code-input');
    const codeOutput = document.getElementById('code-output');

    if (runCodeButton && codeInput && codeOutput) {
        runCodeButton.addEventListener('click', () => {
            const userCode = codeInput.value;
            codeOutput.textContent = 'Ejecutando su código...\n';

            try {
                const testCases = [0, 1, 5, 7];
                let output = '';
                let factorial = null;
                const originalConsoleLog = console.log;
                const logs = [];
                console.log = (...args) => {
                    logs.push(args.map(a => String(a)).join(' '));
                };

                // Intenta evaluar el código del usuario y buscar la función factorial
                // Utiliza una función anónima para evitar polución del scope global
                const codeExecution = new Function(userCode + '; return factorial;');
                factorial = codeExecution();

                if (typeof factorial !== 'function') {
                    // Si no se encuentra la función 'factorial' definida por el usuario, usa la de fallback.
                    // Esto es por si el usuario borra o cambia el nombre de la función.
                    factorial = (n) => {
                        if (n === 0) return 1;
                        let result = 1;
                        for (let i = 1; i <= n; i++) {
                            result *= i;
                        }
                        return result;
                    };
                    showBannerNotification('No se encontró la función "factorial" en su código. Usando la implementación por defecto para la prueba.', 'info');
                }


                testCases.forEach(num => {
                    logs.length = 0; // Limpiar logs para cada caso de prueba
                    const result = factorial(num);
                    output += `factorial(${num}) = ${result}\n`;
                    if (logs.length > 0) {
                        output += `   (console.log: ${logs.join('; ')})\n`;
                    }
                });

                codeOutput.textContent = output;
                console.log = originalConsoleLog; // Restaurar console.log
                showBannerNotification('Código ejecutado exitosamente. Revisa la salida en la consola.', 'success');

            } catch (error) {
                codeOutput.textContent = `Error de Ejecución: ${error.message}\n${error.stack}`;
                console.log = originalConsoleLog; // Restaurar console.log en caso de error
                showBannerNotification('Ha ocurrido un error al ejecutar su código. Por favor, revise la consola.', 'error');
            }
        });
    }

    // Funcionalidad del botón flotante de ayuda y la ventana de chat
    const helpButton = document.getElementById('helpButton');
    const chatWindow = document.getElementById('chatWindow');
    const closeChatBtn = document.getElementById('closeChatBtn');
    const chatBody = chatWindow.querySelector('.chat-body'); // Obtener el cuerpo del chat para actualizar contenido
    const initialChatBodyContent = chatBody.innerHTML; // Guardar el contenido inicial

    if (helpButton && chatWindow && closeChatBtn && chatBody) {
        helpButton.addEventListener('click', () => {
            chatWindow.classList.toggle('hidden'); // Alterna la visibilidad
            // Si la ventana se abre, restaurar el contenido inicial
            if (!chatWindow.classList.contains('hidden')) {
                chatBody.innerHTML = initialChatBodyContent;
                setupChatOptionButtons(); // Re-configurar listeners para los botones de opciones
            }
        });

        closeChatBtn.addEventListener('click', () => {
            chatWindow.classList.add('hidden'); // Esconde la ventana
            chatBody.innerHTML = initialChatBodyContent; // Restaurar contenido al cerrar
            setupChatOptionButtons(); // Re-configurar listeners
        });

        // Configura los listeners de los botones de opción iniciales
        setupChatOptionButtons();
    }

    function setupChatOptionButtons() {
        const chatOptionButtons = document.querySelectorAll('.chat-option-btn');
        chatOptionButtons.forEach(button => {
            button.removeEventListener('click', handleChatOptionClick); // Previene duplicados
            button.addEventListener('click', handleChatOptionClick);
        });
    }

    function handleChatOptionClick(event) {
        const selectedOptionText = event.currentTarget.textContent.trim();

        if (selectedOptionText.includes('Tutor Express')) {
            showFindingTutor();
        } else {
            showBannerNotification(`Has seleccionado: "${selectedOptionText}". En una aplicación real, esto abriría la funcionalidad correspondiente.`, 'info');
        }
    }

    function showFindingTutor() {
        chatBody.innerHTML = `
            <div class="tutor-search-state">
                <i class="fas fa-circle-notch fa-spin tutor-spinner"></i>
                <p>Buscando un tutor...</p>
                <p class="small-text">Esto puede tomar unos segundos.</p>
            </div>
        `;
        setTimeout(displayTutors, 3000); // Esperar 3 segundos antes de mostrar la lista de tutores
    }

    // Datos ficticios de tutores (ahora con más detalles)
    const tutorsData = [
        {
            id: 1,
            name: "Juan Perez",
            photo: "https://via.placeholder.com/60/A435F0/FFFFFF?text=JP",
            profilePic: "https://i.pravatar.cc/150?img=68", // Una URL de avatar más grande
            expertise: "Algoritmos, Estructuras de Datos, Python",
            bio: "Ingeniero de software con más de 10 años de experiencia en desarrollo back-end. Apasionado por la resolución de problemas complejos y la enseñanza de principios de computación.",
            review: "Juan me ayudó a entender conceptos muy difíciles de algoritmos de manera clara y sencilla. ¡Muy recomendado!"
        },
        {
            id: 2,
            name: "Maria Garcia",
            photo: "https://via.placeholder.com/60/A435F0/FFFFFF?text=MG",
            profilePic: "https://i.pravatar.cc/150?img=43",
            expertise: "Lógica Computacional, C++, Desarrollo Web",
            bio: "Desarrolladora full-stack con experiencia en la industria financiera. Experta en lógica computacional y en la creación de soluciones eficientes. Disfruto guiando a los estudiantes en sus primeros pasos.",
            review: "María es una excelente tutora de lógica, sus explicaciones son muy didácticas y su paciencia es increíble. ¡Aprendí muchísimo!"
        },
        {
            id: 3,
            name: "Carlos Sanchez",
            photo: "https://via.placeholder.com/60/A435F0/FFFFFF?text=CS",
            profilePic: "https://i.pravatar.cc/150?img=30",
            expertise: "Bases de Datos, SQL, Arquitectura de Software",
            bio: "Arquitecto de soluciones con un profundo conocimiento en diseño de bases de datos y sistemas distribuidos. Mi objetivo es que comprendas no solo el 'cómo', sino el 'porqué'.",
            review: "Carlos me ayudó a optimizar mis consultas SQL y a entender la arquitectura de mi proyecto. Un gran mentor."
        },
        {
            id: 4,
            name: "Ana Lopez",
            photo: "https://via.placeholder.com/60/A435F0/FFFFFF?text=AL",
            profilePic: "https://i.pravatar.cc/150?img=25",
            expertise: "JavaScript, React, Front-end",
            bio: "Diseñadora y desarrolladora front-end con pasión por crear interfaces de usuario intuitivas y responsivas. Me encanta compartir mi conocimiento sobre las últimas tendencias de la web.",
            review: "Ana es fantástica para Front-end. Sus consejos sobre React fueron muy valiosos y su enfoque práctico hace que todo sea fácil de entender."
        },
        {
            id: 5,
            name: "Pedro Ramirez",
            photo: "https://via.placeholder.com/60/A435F0/FFFFFF?text=PR",
            profilePic: "https://i.pravatar.cc/150?img=19",
            expertise: "Inteligencia Artificial, Machine Learning, Java",
            bio: "Investigador en IA y científico de datos. Con experiencia en algoritmos de aprendizaje automático y su aplicación en problemas reales. Te guiaré a través del fascinante mundo de la IA.",
            review: "Pedro es un experto en Machine Learning. Sus explicaciones son profundas y me ayudó a depurar mi modelo de manera eficiente. Excelente."
        }
    ];

    function displayTutors() {
        // Ordenar tutores alfabéticamente por nombre
        tutorsData.sort((a, b) => a.name.localeCompare(b.name));

        let tutorsHtml = `
            <p>Tutores Disponibles:</p>
            <div class="tutor-list">
        `;
        tutorsData.forEach(tutor => {
            tutorsHtml += `
                <div class="tutor-item">
                    <img src="${tutor.photo}" alt="${tutor.name}" class="tutor-photo">
                    <span class="tutor-name">${tutor.name}</span>
                    <button class="btn btn-primary tutor-contact-btn" data-tutor-id="${tutor.id}">Contactar</button>
                </div>
            `;
        });
        tutorsHtml += `</div>
            <button class="btn btn-secondary back-to-options-btn"><i class="fas fa-arrow-left"></i> Volver a Opciones</button>
        `;

        chatBody.innerHTML = tutorsHtml;

        // Añadir listeners para los botones de contactar tutor
        document.querySelectorAll('.tutor-contact-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const tutorId = parseInt(event.target.dataset.tutorId);
                const selectedTutor = tutorsData.find(t => t.id === tutorId);
                if (selectedTutor) {
                    showTutorProfile(selectedTutor);
                }
            });
        });

        // Añadir listener para el botón de volver
        document.querySelector('.back-to-options-btn').addEventListener('click', () => {
            chatBody.innerHTML = initialChatBodyContent;
            setupChatOptionButtons();
        });
    }

    function showTutorProfile(tutor) {
        const profileHtml = `
            <div class="tutor-profile-view">
                <img src="${tutor.profilePic}" alt="Foto de ${tutor.name}" class="profile-photo">
                <h3>${tutor.name}</h3>
                <p class="tutor-expertise">${tutor.expertise}</p>
                <div class="tutor-bio-review">
                    <p><strong>Bio:</strong> ${tutor.bio}</p>
                    <p><strong>Reseña destacada:</strong> "${tutor.review}"</p>
                </div>
                <p><strong>Opciones para iniciar tutoría:</strong></p>
                <div class="contact-options">
                    <button class="btn chat-option-btn contact-chat-btn" data-tutor-id="${tutor.id}"><i class="fas fa-comments"></i> Chatear Ahora</button>
                    <button class="btn chat-option-btn"><i class="fas fa-video"></i> Videollamada</button>
                    <button class="btn chat-option-btn contact-schedule-btn" data-tutor-id="${tutor.id}"><i class="fas fa-calendar-alt"></i> Agendar Sesión</button>
                </div>
            </div>
            <button class="btn btn-secondary back-to-tutors-btn"><i class="fas fa-arrow-left"></i> Volver a Tutores</button>
        `;
        chatBody.innerHTML = profileHtml;

        // Añadir listeners para los botones de opción de contacto del tutor
        document.querySelectorAll('.contact-options .chat-option-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const actionText = event.currentTarget.textContent.trim();
                const tutorId = parseInt(event.currentTarget.dataset.tutorId);
                const selectedTutor = tutorsData.find(t => t.id === tutorId);

                if (!selectedTutor) return; // Salir si no se encuentra el tutor

                if (actionText.includes('Chatear Ahora')) {
                    startChatWithTutor(selectedTutor);
                } else if (actionText.includes('Agendar Sesión')) {
                    showCalendarForScheduling(selectedTutor);
                } else {
                    showBannerNotification(`Iniciando ${actionText} con ${selectedTutor.name}. (Simulación)`, 'info');
                }
            });
        });

        // Añadir listener para el botón de volver a la lista de tutores
        document.querySelector('.back-to-tutors-btn').addEventListener('click', displayTutors);
    }

    function startChatWithTutor(tutor) {
        chatBody.innerHTML = `
            <div class="chat-main-view">
                <div class="chat-header-tutor">
                    <button class="btn-icon back-to-profile-btn"><i class="fas fa-arrow-left"></i></button>
                    <img src="${tutor.photo}" alt="${tutor.name}" class="tutor-chat-photo">
                    <span>${tutor.name}</span>
                </div>
                <div class="chat-messages" id="chatMessages">
                    <div class="message tutor-message">
                        <p>¡Hola! Soy ${tutor.name}. ¿En qué puedo ayudarte hoy?</p>
                    </div>
                </div>
                <div class="chat-input-area">
                    <input type="text" id="chatMessageInput" placeholder="Escribe tu mensaje...">
                    <button class="btn btn-primary" id="sendMessageBtn">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        `;

        const chatMessages = document.getElementById('chatMessages');
        const chatMessageInput = document.getElementById('chatMessageInput');
        const sendMessageBtn = document.getElementById('sendMessageBtn');
        const backToProfileBtn = document.querySelector('.chat-header-tutor .back-to-profile-btn'); // Especificar para evitar evitar conflictos

        backToProfileBtn.addEventListener('click', () => showTutorProfile(tutor));

        sendMessageBtn.addEventListener('click', () => sendMessage());
        chatMessageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        function sendMessage() {
            const messageText = chatMessageInput.value.trim();
            if (messageText === '') return;

            // Añadir mensaje del usuario
            const userMessageDiv = document.createElement('div');
            userMessageDiv.classList.add('message', 'user-message');
            userMessageDiv.innerHTML = `<p>${messageText}</p>`;
            chatMessages.appendChild(userMessageDiv);

            chatMessageInput.value = ''; // Limpiar input
            chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll al final

            // Simular respuesta del tutor
            setTimeout(() => {
                const tutorResponses = [
                    `Claro, puedo ayudarte con eso, ${tutor.name} por aquí.`,
                    `Entendido. Déjame revisar un momento...`,
                    `Buena pregunta. ¿Podrías darme más detalles?`,
                    `Sí, podemos resolver eso juntos.`,
                    `Gracias por tu mensaje. ¿Qué tal si empezamos con...?`
                ];
                const randomResponse = tutorResponses[Math.floor(Math.random() * tutorResponses.length)];

                const tutorMessageDiv = document.createElement('div');
                tutorMessageDiv.classList.add('message', 'tutor-message');
                tutorMessageDiv.innerHTML = `<p>${randomResponse}</p>`;
                chatMessages.appendChild(tutorMessageDiv);
                chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll al final
            }, 1500); // Responder después de 1.5 segundos
        }
    }

    // --- Funcionalidad de Calendario ---
    let currentCalendarDate = new Date(); // Fecha actual para el calendario
    let selectedSchedulingDate = null; // Para almacenar la fecha seleccionada

    function showCalendarForScheduling(tutor) {
        chatBody.innerHTML = `
            <div class="calendar-view">
                <div class="calendar-header-controls">
                    <button class="btn-icon" id="prevMonthBtn"><i class="fas fa-chevron-left"></i></button>
                    <h3 id="currentMonthYear"></h3>
                    <button class="btn-icon" id="nextMonthBtn"><i class="fas fa-chevron-right"></i></button>
                </div>
                <div class="calendar-weekdays">
                    <span>Dom</span><span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span>
                </div>
                <div class="calendar-days" id="calendarDays">
                    </div>
                <div class="calendar-footer">
                    <p id="selectedDateText">Selecciona una fecha</p>
                    <button class="btn btn-primary" id="confirmSessionBtn" disabled>Confirmar Sesión</button>
                    <button class="btn btn-secondary back-to-profile-btn"><i class="fas fa-arrow-left"></i> Volver a Perfil</button>
                </div>
            </div>
        `;

        const currentMonthYearEl = document.getElementById('currentMonthYear');
        const prevMonthBtn = document.getElementById('prevMonthBtn');
        const nextMonthBtn = document.getElementById('nextMonthBtn');
        const calendarDaysEl = document.getElementById('calendarDays');
        const selectedDateTextEl = document.getElementById('selectedDateText');
        const confirmSessionBtn = document.getElementById('confirmSessionBtn');
        const backToProfileBtn = document.querySelector('.calendar-view .back-to-profile-btn');

        backToProfileBtn.addEventListener('click', () => showTutorProfile(tutor));

        prevMonthBtn.addEventListener('click', () => {
            currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
            renderCalendar(tutor);
        });

        nextMonthBtn.addEventListener('click', () => {
            currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
            renderCalendar(tutor);
        });

        confirmSessionBtn.addEventListener('click', () => {
            if (selectedSchedulingDate) {
                showBannerNotification(`Has agendado una sesión con ${tutor.name} para el ${selectedSchedulingDate.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}. ¡Revisa tu correo para los detalles!`, 'success');
                // Aquí iría la lógica para enviar la sesión agendada a un backend
                showTutorProfile(tutor); // Volver al perfil del tutor después de confirmar
            } else {
                showBannerNotification('Por favor, selecciona una fecha válida para agendar la sesión.', 'error');
            }
        });

        renderCalendar(tutor); // Renderizar el calendario inicial
    }

    function renderCalendar(tutor) {
        const currentMonthYearEl = document.getElementById('currentMonthYear');
        const calendarDaysEl = document.getElementById('calendarDays');
        const selectedDateTextEl = document.getElementById('selectedDateText');
        const confirmSessionBtn = document.getElementById('confirmSessionBtn');

        calendarDaysEl.innerHTML = ''; // Limpiar días anteriores

        const year = currentCalendarDate.getFullYear();
        const month = currentCalendarDate.getMonth(); // 0-indexed

        currentMonthYearEl.textContent = `${currentCalendarDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}`;

        // Obtener el primer día del mes (0 = domingo, 1 = lunes, etc.)
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        // Obtener el último día del mes (número de días en el mes)
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Rellenar días vacíos al principio del mes
        for (let i = 0; i < firstDayOfMonth; i++) {
            const emptyDiv = document.createElement('div');
            emptyDiv.classList.add('day-cell', 'empty');
            calendarDaysEl.appendChild(emptyDiv);
        }

        // Rellenar días del mes
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.classList.add('day-cell');
            dayCell.textContent = day;

            const currentDate = new Date();
            // Normalizar `currentDate` a solo la fecha (sin tiempo) para comparación
            const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
            const fullDate = new Date(year, month, day);

            // Deshabilitar fechas pasadas
            if (fullDate < today) {
                dayCell.classList.add('disabled');
            } else {
                dayCell.addEventListener('click', () => {
                    // Remover selección anterior
                    document.querySelectorAll('.day-cell.selected').forEach(cell => {
                        cell.classList.remove('selected');
                    });
                    dayCell.classList.add('selected');
                    selectedSchedulingDate = fullDate;
                    selectedDateTextEl.textContent = `Fecha seleccionada: ${selectedSchedulingDate.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`;
                    confirmSessionBtn.disabled = false;
                });
            }

            // Resaltar la fecha seleccionada previamente si aplica
            if (selectedSchedulingDate &&
                fullDate.getDate() === selectedSchedulingDate.getDate() &&
                fullDate.getMonth() === selectedSchedulingDate.getMonth() &&
                fullDate.getFullYear() === selectedSchedulingDate.getFullYear()) {
                dayCell.classList.add('selected');
                selectedDateTextEl.textContent = `Fecha seleccionada: ${selectedSchedulingDate.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`;
                confirmSessionBtn.disabled = false;
            }

            calendarDaysEl.appendChild(dayCell);
        }

        // Si se cambia de mes, resetear la selección y el botón
        if (selectedSchedulingDate && (selectedSchedulingDate.getMonth() !== month || selectedSchedulingDate.getFullYear() !== year)) {
            selectedSchedulingDate = null;
            selectedDateTextEl.textContent = 'Selecciona una fecha';
            confirmSessionBtn.disabled = true;
        } else if (!selectedSchedulingDate) {
            confirmSessionBtn.disabled = true;
        }

    }

    // --- Funcionalidad del Banner de Notificación ---
    const notificationBanner = document.getElementById('notificationBanner');
    let bannerTimeout;

    function showBannerNotification(message, type = 'info', duration = 4000) {
        // Limpiar cualquier timeout anterior para que el nuevo banner aparezca inmediatamente
        clearTimeout(bannerTimeout);

        notificationBanner.textContent = message;
        notificationBanner.className = 'notification-banner'; // Resetear clases
        notificationBanner.classList.add(type); // Añadir clase de tipo (success, error, info)
        notificationBanner.classList.remove('hidden'); // Mostrar el banner

        // Ocultar el banner después de la duración especificada
        bannerTimeout = setTimeout(() => {
            notificationBanner.classList.add('hidden');
        }, duration);
    }


    // Simular clics en el menú de navegación para mostrar "activo"
    const navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            navLinks.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            // event.preventDefault(); // Descomentar si quieres evitar que la página se recargue
            showBannerNotification(`Navegando a: "${this.textContent.trim()}". Esta es una simulación.`, 'info');
        });
    });
});