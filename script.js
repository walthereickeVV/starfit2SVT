// 🌸 STAR FIT — ЭЛЕГАНТНАЯ ЛОГИКА
// Версия 2.0 — Нежная, уютная, вдохновляющая

document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initEventListeners();
    initTrainerUploads();
    initScrollTop();
    initFormHandler();
    initSmoothScroll();
    initPhoneMask();
    loadSavedTrainerPhotos();
});

// ✨ ПРЕЛОАДЕР
function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 2000);
    }
}

// 🎛️ ИНИЦИАЛИЗАЦИЯ СОБЫТИЙ
function initEventListeners() {
    // Меню
    const menuBtn = document.getElementById('menuBtn');
    const sidebar = document.getElementById('sidebar');
    const sidebarClose = document.getElementById('sidebarClose');

    if (menuBtn && sidebar) {
        menuBtn.addEventListener('click', () => {
            sidebar.classList.add('active');
        });
    }

    if (sidebarClose && sidebar) {
        sidebarClose.addEventListener('click', () => {
            sidebar.classList.remove('active');
        });
    }

    // Закрытие сайдбара по клику вне
    document.addEventListener('click', (e) => {
        if (sidebar && !e.target.closest('.elegant-sidebar') && !e.target.closest('.menu-button')) {
            sidebar.classList.remove('active');
        }
    });

    // Кнопки записи к тренерам
    document.querySelectorAll('.btn-trainer').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const trainer = e.currentTarget.dataset.trainer;
            const bookingSection = document.getElementById('booking');
            const trainerSelect = document.getElementById('trainer-select');
            
            if (bookingSection) {
                bookingSection.scrollIntoView({ behavior: 'smooth' });
            }
            
            if (trainerSelect && trainer) {
                trainerSelect.value = trainer;
                // Подсветка выбора
                trainerSelect.style.borderColor = 'var(--sage)';
                trainerSelect.style.boxShadow = '0 0 0 3px rgba(183, 201, 183, 0.2)';
                
                setTimeout(() => {
                    trainerSelect.style.borderColor = '';
                    trainerSelect.style.boxShadow = '';
                }, 2000);
            }
        });
    });

    // Навигация по прайсу
    document.querySelectorAll('.price-nav-item').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
                
                // Подсветка секции
                targetSection.style.transition = 'all 0.3s ease';
                targetSection.style.backgroundColor = 'var(--sage-light)';
                
                setTimeout(() => {
                    targetSection.style.backgroundColor = '';
                }, 1000);
            }
        });
    });
}

// 📸 ЗАГРУЗКА ФОТО ТРЕНЕРОВ
function initTrainerUploads() {
    const uploadZones = document.querySelectorAll('.upload-overlay');
    
    uploadZones.forEach(zone => {
        const input = zone.querySelector('input[type="file"]');
        const trainerId = zone.dataset.trainer;
        
        if (input && trainerId) {
            // Клик по зоне загрузки
            zone.addEventListener('click', () => {
                input.click();
            });
            
            // Выбор файла
            input.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    handleTrainerPhoto(file, trainerId);
                }
            });
            
            // Drag & Drop
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                zone.style.background = 'rgba(183, 201, 183, 0.2)';
            });
            
            zone.addEventListener('dragleave', () => {
                zone.style.background = '';
            });
            
            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.style.background = '';
                
                const file = e.dataTransfer.files[0];
                if (file && file.type.startsWith('image/')) {
                    handleTrainerPhoto(file, trainerId);
                }
            });
        }
    });
}

// 🖼️ ОБРАБОТКА ФОТО ТРЕНЕРА
function handleTrainerPhoto(file, trainerId) {
    if (!file.type.startsWith('image/')) {
        showNotification('Пожалуйста, выберите изображение', 'error');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
        showNotification('Размер файла не должен превышать 5 МБ', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const imageData = e.target.result;
        
        // Сохраняем в localStorage
        localStorage.setItem(`trainer_photo_${trainerId}`, imageData);
        
        // Отображаем фото
        displayTrainerPhoto(trainerId, imageData);
        
        // Показываем уведомление
        const trainerName = getTrainerName(trainerId);
        showNotification(`Фото ${trainerName} успешно загружено!`, 'success');
    };
    reader.readAsDataURL(file);
}

// 🖼️ ОТОБРАЖЕНИЕ ФОТО ТРЕНЕРА
function displayTrainerPhoto(trainerId, imageData) {
    const imgElement = document.getElementById(`trainer-img-${trainerId}`);
    const placeholder = document.getElementById(`trainer-placeholder-${trainerId}`);
    
    if (imgElement && placeholder) {
        imgElement.src = imageData;
        imgElement.style.display = 'block';
        placeholder.style.display = 'none';
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

// 💾 ЗАГРУЗКА СОХРАНЕННЫХ ФОТО
function loadSavedTrainerPhotos() {
    const trainers = ['vladimir', 'yana', 'tatiana'];
    
    trainers.forEach(trainerId => {
        const savedPhoto = localStorage.getItem(`trainer_photo_${trainerId}`);
        if (savedPhoto) {
            displayTrainerPhoto(trainerId, savedPhoto);
        }
    });
}

// 📝 ОБРАБОТКА ФОРМЫ ЗАПИСИ
function initFormHandler() {
    const form = document.getElementById('bookingForm');
    const successDiv = document.getElementById('bookingSuccess');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Получаем данные формы
            const formData = new FormData(form);
            const bookingData = {
                id: Date.now(),
                name: formData.get('name'),
                phone: formData.get('phone'),
                trainer: formData.get('trainer'),
                comment: formData.get('comment'),
                date: new Date().toISOString(),
                status: 'new'
            };
            
            // Сохраняем в localStorage
            saveBooking(bookingData);
            
            // Отправляем уведомление (можно подключить Telegram)
            // sendToTelegram(bookingData);
            
            // Показываем успех
            form.style.display = 'none';
            if (successDiv) {
                successDiv.style.display = 'block';
            }
            
            // Показываем уведомление
            showNotification('Спасибо! Мы свяжемся с вами в ближайшее время', 'success');
            
            // Сбрасываем форму через 3 секунды
            setTimeout(() => {
                form.reset();
                form.style.display = 'block';
                if (successDiv) {
                    successDiv.style.display = 'none';
                }
            }, 3000);
        });
    }
}

// 💾 СОХРАНЕНИЕ ЗАЯВКИ
function saveBooking(bookingData) {
    const bookings = JSON.parse(localStorage.getItem('starfit_bookings') || '[]');
    bookings.push(bookingData);
    localStorage.setItem('starfit_bookings', JSON.stringify(bookings));
    
    // Можно также сохранять в Google Sheets через API
    // saveToGoogleSheets(bookingData);
}

// 📢 УВЕДОМЛЕНИЯ
function showNotification(message, type = 'info') {
    // Создаем уведомление
    const notification = document.createElement('div');
    notification.className = `gentle-notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Стили для уведомления
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: ${type === 'success' ? 'var(--sage)' : 'var(--charcoal-soft)'};
        color: white;
        padding: 16px 24px;
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        gap: 16px;
        box-shadow: var(--shadow-elegant);
        z-index: 9999;
        animation: slideIn 0.3s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Закрытие по кнопке
    const closeBtn = notification.querySelector('.notification-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });
    }
    
    // Автоматическое закрытие
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}

// 🚀 КНОПКА НАВЕРХ
function initScrollTop() {
    const scrollBtn = document.getElementById('scrollTop');
    
    if (scrollBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                scrollBtn.classList.add('show');
            } else {
                scrollBtn.classList.remove('show');
            }
        });
        
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// 🎯 ПЛАВНАЯ ПРОКРУТКА
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#') {
                e.preventDefault();
                
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// 📞 МАСКА ТЕЛЕФОНА
function initPhoneMask() {
    const phoneInput = document.getElementById('phone');
    
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 0) {
                // Белорусский номер
                if (value.startsWith('375')) {
                    value = '+375 ' + value.slice(3);
                } else if (value.startsWith('8')) {
                    value = '8 ' + value.slice(1);
                } else {
                    value = '+375 ' + value;
                }
                
                // Форматирование: +375 XX XXX-XX-XX
                if (value.length > 6) {
                    value = value.slice(0, 6) + ' ' + value.slice(6);
                }
                if (value.length > 10) {
                    value = value.slice(0, 10) + ' ' + value.slice(10);
                }
                if (value.length > 13) {
                    value = value.slice(0, 13) + ' ' + value.slice(13);
                }
                if (value.length > 16) {
                    value = value.slice(0, 16);
                }
            }
            
            e.target.value = value;
        });
    }
}

// 📊 СТАТИСТИКА КЛУБА
function updateClubStats() {
    // Обновление количества клиентов в зале
    const clientCount = document.querySelector('.client-count');
    if (clientCount) {
        const hour = new Date().getHours();
        let baseCount = 0;
        
        if (hour >= 9 && hour < 12) baseCount = Math.floor(Math.random() * 10) + 15;
        else if (hour >= 17 && hour < 21) baseCount = Math.floor(Math.random() * 15) + 20;
        else baseCount = Math.floor(Math.random() * 8) + 5;
        
        clientCount.textContent = baseCount;
    }
}

// Запускаем обновление статистики
setInterval(updateClubStats, 60000);
updateClubStats();

// 💰 КАЛЬКУЛЯТОР ЭКОНОМИИ
function calculateSavings() {
    // Функция для подсчета экономии при покупке абонемента
    console.log('Star Fit — Экономия при покупке абонемента до 200₽');
}

// 📱 ДОЛГОЕ НАЖАТИЕ ДЛЯ ЗАГРУЗКИ ФОТО (МОБИЛЬНОЕ)
let touchTimer;
document.querySelectorAll('.image-frame').forEach(frame => {
    frame.addEventListener('touchstart', (e) => {
        touchTimer = setTimeout(() => {
            const uploadOverlay = frame.querySelector('.upload-overlay');
            if (uploadOverlay) {
                uploadOverlay.style.opacity = '1';
                setTimeout(() => {
                    uploadOverlay.style.opacity = '';
                }, 2000);
            }
        }, 500);
    });
    
    frame.addEventListener('touchend', () => {
        clearTimeout(touchTimer);
    });
});

// Экспорт функций для глобального доступа
window.showNotification = showNotification;
window.handleTrainerPhoto = handleTrainerPhoto;
