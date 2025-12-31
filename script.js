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

const letterPile = document.querySelector('.letter-pile'); // مخزن حروف

// موقعیت مخزن (سمت چپ)
// محاسبه موقعیت دقیق بر اساس المان‌ها انجام میشه

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
    const wrapperRect = titleWrapper.getBoundingClientRect();
    const pileRect = letterPile.getBoundingClientRect();
    const workerWidth = worker.getBoundingClientRect().width;
    
    // محاسبه موقعیت دقیق مخزن نسبت به wrapper (وسط در وسط)
    const pileLeft = pileRect.left - wrapperRect.left + (pileRect.width / 2) - (workerWidth / 2);

    // 1. کارگر بره پیش مخزن (راه رفتن به چپ)
    worker.classList.add('walking', 'flipped'); // چرخش به چپ
    // حرکت به موقعیت مخزن
    workerContainer.style.left = pileLeft + 'px';
    
    setTimeout(() => {
        // 2. رسید - حرف رو برداره
        worker.classList.remove('walking');
        worker.classList.add('picking');
        
        setTimeout(() => {
            // حرف از مخزن برداشته شد
            pileLetter.classList.add('taken');
            carriedLetter.textContent = letter;
            carriedLetter.classList.add('visible');
            
            worker.classList.remove('picking', 'flipped'); // چرخش به راست
            worker.classList.add('carrying');
            carriedLetter.classList.add('lifting');
            
            // 3. کارگر بره سر جای حرف (راه رفتن به راست)
            const slotRect = slot.getBoundingClientRect();
            // محاسبه موقعیت دقیق اسلات نسبت به wrapper
            // از اونجایی که کارگر flip میشه، محورش عوض نمیشه ولی نیازه دقیق سنتر بشه
            // برای حالت راست، اوریجین سمت چپه معمولاً. ولی ما left کانتینر رو ست میکنیم.
            // بیایم وسط اسلات رو بگیریم و نصف کارگر رو کم کنیم
            const targetLeft = slotRect.left - wrapperRect.left + (slotRect.width / 2) - (workerWidth / 2);
            
            setTimeout(() => {
                worker.classList.add('walking'); // راه رفتن بدون flip (به راست)
                workerContainer.style.left = targetLeft + 'px';
                
                // 4. کارگر رسید - حرف رو بذاره
                setTimeout(() => {
                    worker.classList.remove('walking');
                    worker.classList.remove('carrying');
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
                    
                }, 1200); // زمان رسیدن به جای حرف
                
            }, 200);
            
        }, 400);
        
    }, 1200); // زمان رسیدن به مخزن
}

// شروع
document.addEventListener('DOMContentLoaded', () => {
    const wrapperRect = titleWrapper.getBoundingClientRect();
    const pileRect = letterPile.getBoundingClientRect();
    const workerWidth = worker.getBoundingClientRect().width;
    const pileLeft = pileRect.left - wrapperRect.left + (pileRect.width / 2) - (workerWidth / 2);
    
    workerContainer.style.left = pileLeft + 'px';
    setTimeout(processNextLetter, 1000);
});

// آپدیت پوزیشن در صورت تغییر سایز صفحه
window.addEventListener('resize', () => {
    // فقط متفیرهای کمکی رو آپدیت می‌کنیم، خود انیمیشن تو سیکل بعدی درست میشه
    // ولی اگر کارگر بیکار باشه (start) بهتره جاش رو درست کنیم
    if (currentIndex === 0 && !worker.classList.contains('walking')) {
        const wrapperRect = titleWrapper.getBoundingClientRect();
        const pileRect = letterPile.getBoundingClientRect();
        const workerWidth = worker.getBoundingClientRect().width;
        const pileLeft = pileRect.left - wrapperRect.left + (pileRect.width / 2) - (workerWidth / 2);
        workerContainer.style.left = pileLeft + 'px';
    }
});
