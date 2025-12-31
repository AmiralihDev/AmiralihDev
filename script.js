// افکت نور زیر موس
const cursorLight = document.querySelector('.cursor-light');

let mouseX = 0;
let mouseY = 0;
let lightX = 0;
let lightY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateLight() {
    const speed = 0.15;
    lightX += (mouseX - lightX) * speed;
    lightY += (mouseY - lightY) * speed;
    cursorLight.style.left = lightX + 'px';
    cursorLight.style.top = lightY + 'px';
    requestAnimationFrame(animateLight);
}
animateLight();

document.addEventListener('mouseleave', () => {
    cursorLight.style.opacity = '0';
});

document.addEventListener('mouseenter', () => {
    cursorLight.style.opacity = '1';
});

// ======= انیمیشن کارگر حمل حروف =======
const worker = document.querySelector('.worker');
const carriedLetter = document.querySelector('.carried-letter');
const pileLetters = document.querySelectorAll('.pile-letter');
const letterSlots = document.querySelectorAll('.letter-slot');
const titleWrapper = document.querySelector('.title-wrapper');
const workerContainer = document.querySelector('.worker-container');

let currentIndex = 0;
const letters = ['H', 'a', 's', 'h', 'e', 'm', 'i', 'D', 'e', 'v', '.', 'i', 'r'];

// موقعیت مخزن (سمت چپ)
const pilePosition = 0;

function processNextLetter() {
    if (currentIndex >= letters.length) {
        // تموم شد - کارگر محو شه
        setTimeout(() => {
            worker.classList.add('hidden');
        }, 500);
        return;
    }
    
    const pileLetter = pileLetters[currentIndex];
    const slot = letterSlots[currentIndex];
    const letter = letters[currentIndex];
    
    // 1. کارگر بره پیش مخزن (راه رفتن)
    worker.classList.add('walking');
    worker.style.left = pilePosition + 'px';
    
    setTimeout(() => {
        // 2. رسید - بایسته و حرف رو برداره
        worker.classList.remove('walking');
        worker.classList.add('picking');
        
        setTimeout(() => {
            // حرف از مخزن برداشته شد
            pileLetter.classList.add('taken');
            carriedLetter.textContent = letter;
            carriedLetter.classList.add('visible');
            
            worker.classList.remove('picking');
            worker.classList.add('carrying');
            carriedLetter.classList.add('lifting');
            
            // 3. کارگر بره سر جای حرف (راه رفتن)
            const slotRect = slot.getBoundingClientRect();
            const containerRect = workerContainer.getBoundingClientRect();
            const targetLeft = slotRect.left - containerRect.left + (slotRect.width / 2) - 15;
            
            setTimeout(() => {
                worker.classList.add('walking');
                worker.style.left = targetLeft + 'px';
                
                // 4. کارگر رسید - بایسته و حرف رو بذاره
                setTimeout(() => {
                    worker.classList.remove('walking', 'carrying');
                    worker.classList.add('placing');
                    
                    // حرف گذاشته شد
                    setTimeout(() => {
                        slot.textContent = letter;
                        slot.classList.add('filled');
                        
                        carriedLetter.classList.remove('visible', 'lifting');
                        worker.classList.remove('placing');
                        
                        // 5. محکم کردن
                        setTimeout(() => {
                            slot.classList.add('fixed');
                            currentIndex++;
                            
                            // حرف بعدی
                            setTimeout(processNextLetter, 300);
                        }, 200);
                        
                    }, 300);
                    
                }, 800); // زمان رسیدن به جای حرف
                
            }, 200);
            
        }, 400);
        
    }, 600); // زمان رسیدن به مخزن
}

// شروع
document.addEventListener('DOMContentLoaded', () => {
    worker.style.left = pilePosition + 'px';
    setTimeout(processNextLetter, 1000);
});
