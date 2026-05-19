const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbx4zudjc9-hPxR0Ylrn75_PHFwYZR177SRD4Iggu-i-B2QyyL8YEiw5UDT2ZefYCnzw/exec'; 

document.getElementById('leadForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const hiddenInput = document.getElementById('package');
    if (!hiddenInput.value) {
        const selectTrigger = document.querySelector('.select-trigger');
        selectTrigger.style.borderColor = '#ef4444'; 
        selectTrigger.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
        setTimeout(() => {
            selectTrigger.style.borderColor = '';
            selectTrigger.style.boxShadow = '';
        }, 2000);
        return;
    }

    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerText;

    btn.innerText = 'Sending...';
    btn.disabled = true;

    const formData = {
        fullName: document.getElementById('fullName').value,
        phone: document.getElementById('phone').value,
        city: document.getElementById('city').value,
        package: hiddenInput.value
    };

    fetch(WEBHOOK_URL, {
        method: 'POST',
        
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
        .then(() => {
            
            btn.innerText = 'Redirecting...';
            btn.style.backgroundColor = '#16a34a'; 

            setTimeout(() => {
                window.location.href = 'thank-you.html';
            }, 800);
        })
        .catch(error => {
            console.error('Error submitting form:', error);
            btn.innerText = 'Error. Try Again.';
            btn.style.backgroundColor = '#ef4444';
            setTimeout(() => {
                btn.innerText = originalText;
                btn.disabled = false;
                btn.style.backgroundColor = '';
            }, 3000);
        });
});

document.addEventListener("DOMContentLoaded", () => {
    const marquee = document.querySelector('.marquee');
    if (!marquee) return;

    const SPEED = 0.6;
    let position = 0;
    let isDragging = false;
    let lastX = 0;

    function getHalfWidth() {
        return marquee.scrollWidth / 2;
    }

    function wrap(pos) {
        const isRtl = document.documentElement.dir === 'rtl';
        const hw = getHalfWidth();
        if (isRtl) {
            if (pos >= hw) return pos - hw;
            if (pos < 0) return pos + hw;
        } else {
            if (pos > 0) return pos - hw;
            if (pos <= -hw) return pos + hw;
        }
        return pos;
    }

    function tick() {
        const isRtl = document.documentElement.dir === 'rtl';
        if (!isDragging) {
            position = wrap(position + (isRtl ? SPEED : -SPEED));
        }
        marquee.style.transform = `translateX(${position}px)`;
        requestAnimationFrame(tick);
    }

    marquee.addEventListener('mousedown', (e) => {
        isDragging = true;
        lastX = e.clientX;
        marquee.classList.add('dragging');
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - lastX;
        lastX = e.clientX;
        position = wrap(position + dx);
    });

    document.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        marquee.classList.remove('dragging');
    });

    requestAnimationFrame(tick);
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

const customSelect = document.getElementById('customPackageSelect');
if (customSelect) {
    const selectTrigger = customSelect.querySelector('.select-trigger');
    const customOptions = customSelect.querySelectorAll('.custom-option');
    const hiddenInput = document.getElementById('package');
    const selectText = customSelect.querySelector('.select-text');

    selectTrigger.addEventListener('click', () => {
        customSelect.classList.toggle('open');
    });

    window.addEventListener('click', (e) => {
        if (!customSelect.contains(e.target)) {
            customSelect.classList.remove('open');
        }
    });

    customOptions.forEach(option => {
        option.addEventListener('click', () => {
            const value = option.getAttribute('data-value');
            const text = option.textContent.trim();

            selectText.textContent = text;
            selectTrigger.classList.add('selected');
            customSelect.classList.remove('open');

            hiddenInput.value = value;

            customOptions.forEach(opt => opt.classList.remove('selected-option'));
            option.classList.add('selected-option');
        });
    });

    window.selectPackage = function (packValue) {
        const targetOption = Array.from(customOptions).find(opt => opt.getAttribute('data-value') === packValue);
        if (targetOption) {
            targetOption.click();
        }
    };
}

// --- Language Switching Logic ---
function updateContent(lang) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            if (el.tagName.toLowerCase() === 'input' && el.type === 'text') {
                el.placeholder = translations[lang][key];
            } else if (el.tagName.toLowerCase() === 'input' || el.tagName.toLowerCase() === 'textarea') {
                el.placeholder = translations[lang][key];
            } else {
                el.innerHTML = translations[lang][key];
            }
        }
    });

    // Handle RTL
    if (lang === 'ar') {
        document.documentElement.setAttribute('dir', 'rtl');
        document.documentElement.lang = 'ar';
    } else {
        document.documentElement.setAttribute('dir', 'ltr');
        document.documentElement.lang = lang;
    }
}

// --- Custom Language Switcher Logic ---
const langSelectElem = document.getElementById('langSwitcher');
if (langSelectElem) {
    const trigger = langSelectElem.querySelector('.lang-trigger');
    const options = langSelectElem.querySelectorAll('.lang-option');
    const currentLangText = langSelectElem.querySelector('.current-lang');

    trigger.addEventListener('click', () => {
        langSelectElem.classList.toggle('open');
    });

    window.addEventListener('click', (e) => {
        if (!langSelectElem.contains(e.target)) {
            langSelectElem.classList.remove('open');
        }
    });

    options.forEach(option => {
        option.addEventListener('click', () => {
            const lang = option.getAttribute('data-lang');
            langSelectElem.classList.remove('open');
            window.changeLanguage(lang);
        });
    });

    // Update trigger text function
    window.updateLangTriggerText = function(lang) {
        currentLangText.textContent = lang.toUpperCase();
    };
}

window.changeLanguage = function(lang) {
    localStorage.setItem('selectedLang', lang);
    updateContent(lang);
    if (window.updateLangTriggerText) {
        window.updateLangTriggerText(lang);
    }
};

// Initialize language on load
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('selectedLang') || 'fr'; // Default is French
    updateContent(savedLang);
    if (window.updateLangTriggerText) {
        window.updateLangTriggerText(savedLang);
    }
});

