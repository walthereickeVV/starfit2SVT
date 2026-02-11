// 📸 STAR FIT — РАСШИРЕННОЕ УПРАВЛЕНИЕ ФОТОГРАФИЯМИ
// Версия 2.0 — Элегантная загрузка и хранение

class TrainerPhotoManager {
    constructor() {
        this.trainers = ['vladimir', 'yana', 'tatiana'];
        this.init();
    }
    
    init() {
        this.loadAllPhotos();
        this.setupKeyboardShortcut();
        this.setupMobileSupport();
    }
    
    // Загрузка всех сохраненных фото
    loadAllPhotos() {
        this.trainers.forEach(trainerId => {
            const savedPhoto = localStorage.getItem(`trainer_photo_${trainerId}`);
            if (savedPhoto) {
                this.displayPhoto(trainerId, savedPhoto);
            }
        });
    }
    
    // Отображение фото
    displayPhoto(trainerId, imageData) {
        const imgElement = document.getElementById(`trainer-img-${trainerId}`);
        const placeholder = document.getElementById(`trainer-placeholder-${trainerId}`);
        
        if (imgElement && placeholder) {
            imgElement.src = imageData;
            imgElement.style.display = 'block';
            placeholder.style.display = 'none';
        }
    }
    
    // Секретная комбинация для админки
    setupKeyboardShortcut() {
        let keySequence = '';
        const secretCode = 'starfitadmin';
        
        document.addEventListener('keydown', (e) => {
            keySequence += e.key.toLowerCase();
            
            if (keySequence.includes(secretCode)) {
                this.openAdminPanel();
                keySequence = '';
            }
            
            // Очищаем последовательность через 3 секунды
            clearTimeout(this.keyTimer);
            this.keyTimer = setTimeout(() => {
                keySequence = '';
            }, 3000);
        });
    }
    
    // Админ-панель
    openAdminPanel() {
        const modal = document.createElement('div');
        modal.className = 'admin-modal';
        modal.innerHTML = `
            <div class="admin-modal-content">
                <div class="admin-modal-header">
                    <h3>⭐ Управление фотографиями</h3>
                    <button class="admin-modal-close">&times;</button>
                </div>
                <div class="admin-modal-body">
                    <div class="admin-section">
                        <h4>Экспорт фотографий</h4>
                        <p>Сохранить все фото тренеров в файл</p>
                        <button class="admin-btn export-btn">
                            <i class="fas fa-download"></i> Экспорт
                        </button>
                    </div>
                    <div class="admin-section">
                        <h4>Импорт фотографий</h4>
                        <p>Загрузить фото из файла резервной копии</p>
                        <button class="admin-btn import-btn">
                            <i class="fas fa-upload"></i> Импорт
                        </button>
                    </div>
                    <div class="admin-section">
                        <h4>Сброс</h4>
                        <p>Удалить все загруженные фотографии</p>
                        <button class="admin-btn reset-btn">
                            <i class="fas fa-trash"></i> Сбросить все фото
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Анимация появления
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
        
        // Закрытие
        const closeBtn = modal.querySelector('.admin-modal-close');
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.remove();
            }, 300);
        });
        
        // Экспорт
        const exportBtn = modal.querySelector('.export-btn');
        exportBtn.addEventListener('click', () => {
            this.exportAllPhotos();
            window.showNotification('Фото экспортированы', 'success');
        });
        
        // Импорт
        const importBtn = modal.querySelector('.import-btn');
        importBtn.addEventListener('click', () => {
            this.importPhotos();
        });
        
        // Сброс
        const resetBtn = modal.querySelector('.reset-btn');
        resetBtn.addEventListener('click', () => {
            if (confirm('Вы уверены, что хотите удалить все фотографии тренеров?')) {
                this.resetAllPhotos();
                window.showNotification('Все фото сброшены', 'warning');
                modal.classList.remove('active');
                setTimeout(() => {
                    modal.remove();
                }, 300);
            }
        });
        
        // Закрытие по клику вне
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                setTimeout(() => {
                    modal.remove();
                }, 300);
            }
        });
    }
    
    // Экспорт всех фото
    exportAllPhotos() {
        const photos = {};
        
        this.trainers.forEach(trainerId => {
            const photo = localStorage.getItem(`trainer_photo_${trainerId}`);
            if (photo) {
                photos[trainerId] = photo;
            }
        });
        
        const dataStr = JSON.stringify(photos, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        
        const exportFileName = `starfit_trainers_${new Date().toISOString().slice(0, 10)}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileName);
        linkElement.click();
    }
    
    // Импорт фото
    importPhotos() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json,application/json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = (event) => {
                try {
                    const photos = JSON.parse(event.target.result);
                    
                    Object.entries(photos).forEach(([trainerId, imageData]) => {
                        if (this.trainers.includes(trainerId)) {
                            localStorage.setItem(`trainer_photo_${trainerId}`, imageData);
                            this.displayPhoto(trainerId, imageData);
                        }
                    });
                    
                    window.showNotification(`Импортировано ${Object.keys(photos).length} фото`, 'success');
                } catch (error) {
                    window.showNotification('Ошибка при импорте файла', 'error');
                }
            };
            
            reader.readAsText(file);
        };
        
        input.click();
    }
    
    // Сброс всех фото
    resetAllPhotos() {
        this.trainers.forEach(trainerId => {
            localStorage.removeItem(`trainer_photo_${trainerId}`);
            
            const imgElement = document.getElementById(`trainer-img-${trainerId}`);
            const placeholder = document.getElementById(`trainer-placeholder-${trainerId}`);
            
            if (imgElement && placeholder) {
                imgElement.style.display = 'none';
                imgElement.src = '';
                placeholder.style.display = 'flex';
            }
        });
    }
    
    // Поддержка мобильных устройств
    setupMobileSupport() {
        // Определяем мобильное устройство
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        
        if (isMobile) {
            // Добавляем долгое нажатие для загрузки фото
            document.querySelectorAll('.image-frame').forEach(frame => {
                let pressTimer;
                
                frame.addEventListener('touchstart', (e) => {
                    pressTimer = setTimeout(() => {
                        const uploadOverlay = frame.querySelector('.upload-overlay');
                        if (uploadOverlay) {
                            const input = uploadOverlay.querySelector('input[type="file"]');
                            if (input) {
                                input.click();
                            }
                        }
                    }, 500);
                });
                
                frame.addEventListener('touchend', () => {
                    clearTimeout(pressTimer);
                });
                
                frame.addEventListener('touchmove', () => {
                    clearTimeout(pressTimer);
                });
            });
        }
    }
}

// Инициализация менеджера фото
const trainerPhotoManager = new TrainerPhotoManager();

// Добавляем стили для админ-панели
const adminStyles = document.createElement('style');
adminStyles.textContent = `
    .admin-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(5px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .admin-modal.active {
        opacity: 1;
    }
    
    .admin-modal-content {
        background: var(--white-soft);
        border-radius: var(--radius-lg);
        width: 90%;
        max-width: 500px;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: var(--shadow-elegant);
        transform: translateY(20px);
        transition: transform 0.3s ease;
    }
    
    .admin-modal.active .admin-modal-content {
        transform: translateY(0);
    }
    
    .admin-modal-header {
        padding: 24px;
        border-bottom: 2px solid var(--sage-light);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .admin-modal-header h3 {
        font-size: 22px;
        font-weight: 600;
        color: var(--charcoal-soft);
        font-family: var(--font-secondary);
        margin: 0;
    }
    
    .admin-modal-close {
        background: none;
        border: none;
        font-size: 28px;
        color: var(--charcoal-light);
        cursor: pointer;
        transition: var(--transition);
        width: 44px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
    }
    
    .admin-modal-close:hover {
        background: var(--sage-light);
        color: var(--charcoal-soft);
    }
    
    .admin-modal-body {
        padding: 24px;
    }
    
    .admin-section {
        margin-bottom: 32px;
        padding-bottom: 32px;
        border-bottom: 1px solid var(--sage-light);
    }
    
    .admin-section:last-child {
        border-bottom: none;
        margin-bottom: 0;
        padding-bottom: 0;
    }
    
    .admin-section h4 {
        font-size: 18px;
        font-weight: 600;
        color: var(--charcoal-soft);
        margin-bottom: 8px;
    }
    
    .admin-section p {
        color: var(--charcoal-light);
        font-size: 14px;
        margin-bottom: 16px;
    }
    
    .admin-btn {
        padding: 12px 24px;
        background: var(--sage);
        border: none;
        border-radius: var(--radius-md);
        color: var(--charcoal-soft);
        font-weight: 600;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        transition: var(--transition);
    }
    
    .admin-btn:hover {
        background: var(--sage-dark);
        color: white;
        transform: translateY(-2px);
    }
    
    .admin-btn.reset-btn {
        background: var(--dusty-rose);
    }
    
    .admin-btn.reset-btn:hover {
        background: var(--accent-rose);
    }
`;

document.head.appendChild(adminStyles);

// Добавляем подсказку в консоль
console.log('%c🌟 STAR FIT — МЕНЕДЖЕР ФОТОГРАФИЙ', 'font-size: 20px; color: var(--sage-dark); font-weight: bold;');
console.log('%cСекретный код: starfitadmin', 'font-size: 14px; color: var(--accent-gold);');
console.log('%cКоманды в консоли:', 'font-size: 14px; color: var(--charcoal-light);');
console.log('  • trainerPhotoManager.exportAllPhotos() — экспорт всех фото');
console.log('  • trainerPhotoManager.importPhotos() — импорт фото');
console.log('  • trainerPhotoManager.resetAllPhotos() — сброс всех фото');
console.log('  • localStorage — просмотр сохраненных данных');

// Экспорт для глобального доступа
window.trainerPhotoManager = trainerPhotoManager;
