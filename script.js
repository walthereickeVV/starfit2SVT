// 🌌 STAR FIT - КОСМИЧЕСКАЯ ФИТНЕС-ВСЕЛЕННАЯ
document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initEventListeners();
    initTrainerUploads();
    initSpaceJump();
    initFormHandler();
    initGlitchEffect();
});

// 💪 ГАНТЕЛЬ-ПРЕЛОАДЕР
function initPreloader() {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.classList.add('hidden');
    }, 2500);
}

// 🎛️ ИНИЦИАЛИЗАЦИЯ СОБЫТИЙ
function initEventListeners() {
    // Меню
    const menuBtn = document.getElementById('menuBtn');
    const sidebar = document.getElementById('sidebar');
    const sidebarClose = document.getElementById('sidebarClose');

    menuBtn?.addEventListener('click', () => {
        sidebar?.classList.add('active');
    });

    sidebarClose?.addEventListener('click', () => {
        sidebar?.classList.remove('active');
    });

    // Закрытие по клику вне
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.cyber-sidebar') && !e.target.closest('.hologram-btn')) {
            sidebar?.classList.remove('active');
        }
    });

    // Кнопка наверх
    const spaceJump = document.getElementById('spaceJump');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            spaceJump?.classList.add('show');
        } else {
            spaceJump?.classList.remove('show');
        }
    });

    spaceJump?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Кнопки записи к тренерам
    document.querySelectorAll('.cyber-button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const trainer = e.currentTarget.dataset.trainer;
            const bookingSection = document.getElementById('booking');
            const trainerSelect = document.getElementById('trainer-select');
            
            bookingSection?.scrollIntoView({ behavior: 'smooth' });
            
            if (trainerSelect) {
                trainerSelect.value = trainer;
                // Эффект пульсации
                trainerSelect.style.boxShadow = '0 0 30px var(--neon-cyan)';
                setTimeout(() => {
                    trainerSelect.style.boxShadow = 'none';
                }, 1000);
            }
        });
    });
}

// 📸 ЗАГРУЗКА ФОТО ТРЕНЕРОВ
function initTrainerUploads() {
    const uploadZones = document.querySelectorAll('.upload-zone');
    
    uploadZones.forEach(zone => {
        const input = zone.querySelector('input[type="file"]');
        const trainerId = zone.dataset.trainer;
        const placeholder = zone.closest('.hologram-image').querySelector('.image-placeholder');
        
        // Загрузка сохранённого фото
        const savedImage = localStorage.getItem(`trainer_${trainerId}`);
        if (savedImage) {
            displayTrainerImage(trainerId, savedImage);
        }
        
        zone.addEventListener('click', () => {
            input.click();
        });
        
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const imageData = event.target.result;
                    localStorage.setItem(`trainer_${trainerId}`, imageData);
                    displayTrainerImage(trainerId, imageData);
                    
                    // Неоновое уведомление
                    showNotification(`Фото ${getTrainerName(trainerId)} загружено`, 'success');
                };
                reader.readAsDataURL(file);
            }
        });
        
        // Drag & Drop
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.style.borderColor = 'var(--neon-cyan)';
            zone.style.boxShadow = 'var(--glow-cyan)';
        });
        
        zone.addEventListener('dragleave', () => {
            zone.style.borderColor = '';
            zone.style.boxShadow = '';
        });
        
        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.style.borderColor = '';
            zone.style.boxShadow = '';
            
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const imageData = event.target.result;
                    localStorage.setItem(`trainer_${trainerId}`, imageData);
                    displayTrainerImage(trainerId, imageData);
                    showNotification(`Фото ${getTrainerName(trainerId)} загружено`, 'success');
                };
                reader.readAsDataURL(file);
            }
        });
    });
}

// 🖼️ ОТОБРАЖЕНИЕ ФОТО ТРЕНЕРА
function displayTrainerImage(trainerId, imageData) {
    const container = document.getElementById(`trainer-image-${trainerId}`);
    if (container) {
        const placeholder = container.querySelector('.image-placeholder');
        const existingImg = container.querySelector('img');
        
        if (existingImg) {
            existingImg.src = imageData;
        } else {
            const img = document.createElement('img');
            img.src = imageData;
            img.alt = getTrainerName(trainerId);
            img.className = 'trainer-photo';
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            
            if (placeholder) {
                placeholder.style.display = 'none';
            }
            
            container.appendChild(img);
        }
    }
}

// 📛 ПОЛУЧЕНИЕ ИМЕНИ ТРЕНЕРА
function getTrainerName(trainerId) {
    const names = {
        'vladimir': 'Владимира Лукьянова',
        'yana': 'Яны Лукьяновой',
        'tatiana': 'Татьяны Лукьяновой'
    };
    return names[trainerId] || 'тренера';
}

// 📝 ОБРАБОТКА ФОРМЫ
function initFormHandler() {
    const form = document.getElementById('quantumForm');
    const successDiv = document.getElementById('quantumSuccess');
    
    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const booking = {
            id: Date.now(),
            name: formData.get('name'),
            phone: formData.get('phone'),
            trainer: formData.get('trainer'),
            timestamp: new Date().toISOString()
        };
        
        // Сохраняем в localStorage
        const bookings = JSON.parse(localStorage.getItem('starfit_bookings') || '[]');
        bookings.push(booking);
        localStorage.setItem('starfit_bookings', JSON.stringify(bookings));
        
        // Отправляем в Telegram (раскомментировать с вашими данными)
        // sendToTelegram(booking);
        
        // Показываем успех
        form.style.display = 'none';
        successDiv.style.display = 'block';
        
        // Неоновое уведомление
        showNotification('Сигнал отправлен! Ждите связи.', 'success');
        
        // Сбрасываем через 3 секунды
        setTimeout(() => {
            form.reset();
            form.style.display = 'block';
            successDiv.style.display = 'none';
        }, 3000);
    });
}

// 📢 НЕОНОВОЕ УВЕДОМЛЕНИЕ
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `neon-notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-bolt"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// 🚀 КОСМИЧЕСКИЙ ПРЫЖОК
function initSpaceJump() {
    const jumpBtn = document.getElementById('spaceJump');
    if (jumpBtn) {
        jumpBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Эффект частиц
            createParticles();
        });
    }
}

// ✨ ЭФФЕКТ ЧАСТИЦ
function createParticles() {
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'neon-particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 0.5 + 's';
        particle.style.background = `hsl(${Math.random() * 60 + 180}, 100%, 50%)`;
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
}

// 🎭 ГЛИТЧ-ЭФФЕКТ
function initGlitchEffect() {
    setInterval(() => {
        const glitchElements = document.querySelectorAll('.glitch-layer');
        glitchElements.forEach(el => {
            el.style.animation = 'none';
            el.offsetHeight;
            el.style.animation = 'glitch-skew 4s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite';
        });
    }, 10000);
}

// 📞 МАСКА ТЕЛЕФОНА
document.addEventListener('input', (e) => {
    if (e.target.name === 'phone') {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 0) {
            if (value.startsWith('375')) {
                value = '+375 ' + value.slice(3);
            } else if (value.startsWith('8')) {
                value = '8 ' + value.slice(1);
            }
            
            if (value.length > 5) {
                value = value.slice(0, 5) + ' ' + value.slice(5);
            }
            if (value.length > 9) {
                value = value.slice(0, 9) + ' ' + value.slice(9);
            }
            if (value.length > 12) {
                value = value.slice(0, 12) + ' ' + value.slice(12);
            }
            if (value.length > 15) {
                value = value.slice(0, 15);
            }
            
            e.target.value = value;
        }
    }
});

// 📱 ССЫЛКИ НА INSTAGRAM
function initInstagramLinks() {
    const instagramUrl = 'https://www.instagram.com/starfit_svt';
    const instagramLinks = document.querySelectorAll('a[href*="instagram.com"]');
    
    instagramLinks.forEach(link => {
        link.href = instagramUrl;
    });
}
