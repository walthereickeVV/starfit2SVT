// 📸 РАСШИРЕННАЯ ЗАГРУЗКА ФОТО ТРЕНЕРОВ
class TrainerPhotoManager {
    constructor() {
        this.trainers = ['vladimir', 'yana', 'tatiana'];
        this.init();
    }
    
    init() {
        this.loadAllPhotos();
        this.setupKeyboardShortcut();
    }
    
    // Загрузка всех сохранённых фото
    loadAllPhotos() {
        this.trainers.forEach(trainerId => {
            const saved = localStorage.getItem(`trainer_${trainerId}`);
            if (saved) {
                this.displayPhoto(trainerId, saved);
            }
        });
    }
    
    // Отображение фото
    displayPhoto(trainerId, imageData) {
        const container = document.getElementById(`trainer-image-${trainerId}`);
        if (!container) return;
        
        const placeholder = container.querySelector('.image-placeholder');
        const existingImg = container.querySelector('img.trainer-photo');
        
        if (existingImg) {
            existingImg.src = imageData;
        } else {
            const img = document.createElement('img');
            img.src = imageData;
            img.alt = trainerId;
            img.className = 'trainer-photo';
            img.style.cssText = `
                width: 100%;
                height: 100%;
                object-fit: cover;
                position: absolute;
                top: 0;
                left: 0;
                z-index: 2;
            `;
            
            if (placeholder) {
                placeholder.style.display = 'none';
            }
            
            container.appendChild(img);
        }
    }
    
    // Секретная комбинация для админки
    setupKeyboardShortcut() {
        let keySequence = '';
        
        document.addEventListener('keydown', (e) => {
            keySequence += e.key.toLowerCase();
            
            if (keySequence.includes('starfitadmin')) {
                this.resetAllPhotos();
                keySequence = '';
            }
            
            setTimeout(() => {
                keySequence = '';
            }, 3000);
        });
    }
    
    // Сброс всех фото
    resetAllPhotos() {
        this.trainers.forEach(trainerId => {
            localStorage.removeItem(`trainer_${trainerId}`);
            const container = document.getElementById(`trainer-image-${trainerId}`);
            if (container) {
                const img = container.querySelector('img.trainer-photo');
                const placeholder = container.querySelector('.image-placeholder');
                
                if (img) img.remove();
                if (placeholder) placeholder.style.display = 'flex';
            }
        });
        
        showNotification('Все фото сброшены к стандартным', 'warning');
    }
}

// Инициализация
const trainerPhotoManager = new TrainerPhotoManager();

// Экспорт фото
function exportTrainerPhotos() {
    const photos = {};
    
    ['vladimir', 'yana', 'tatiana'].forEach(trainerId => {
        const photo = localStorage.getItem(`trainer_${trainerId}`);
        if (photo) {
            photos[trainerId] = photo;
        }
    });
    
    const dataStr = JSON.stringify(photos);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'starfit_trainers_photos.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

// Импорт фото
function importTrainerPhotos() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = (event) => {
            try {
                const photos = JSON.parse(event.target.result);
                
                Object.entries(photos).forEach(([trainerId, imageData]) => {
                    localStorage.setItem(`trainer_${trainerId}`, imageData);
                    trainerPhotoManager.displayPhoto(trainerId, imageData);
                });
                
                showNotification('Фото успешно импортированы!', 'success');
            } catch (error) {
                showNotification('Ошибка при импорте файла', 'error');
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
}

// Добавляем секретные кнопки в консоль
console.log('%c🚀 STAR FIT PHOTO MANAGER', 'font-size: 20px; color: #00fff9; text-shadow: 0 0 10px cyan;');
console.log('%cДоступные команды:', 'color: #ff44e6;');
console.log('%c  ► exportTrainerPhotos() - экспорт всех фото', 'color: #39ff14;');
console.log('%c  ► importTrainerPhotos() - импорт фото', 'color: #39ff14;');
console.log('%c  ► trainerPhotoManager.resetAllPhotos() - сброс фото', 'color: #ff44e6;');
