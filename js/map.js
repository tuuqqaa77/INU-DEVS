document.addEventListener('DOMContentLoaded', () => {
    
    // 1. جلب خيارات المستخدم من localStorage
    const savedPlan = JSON.parse(localStorage.getItem('joviaTripPlan')) || {
        city: 'Amman',
        budget: 'Medium',
        interests: ['Historical Sites', 'Food']
    };

    // 2. إظهار خيارات المستخدم داخل الشريط العالي
    const selectionsBar = document.getElementById('userSelectionsBar');
    if (selectionsBar) {
        let chipsHTML = `
            <div class="selection-chip"><i class="fa-solid fa-location-dot"></i> ${savedPlan.city}</div>
            <div class="selection-chip"><i class="fa-solid fa-wallet"></i> ${savedPlan.budget}</div>
        `;
        
        if (savedPlan.interests && Array.isArray(savedPlan.interests)) {
            savedPlan.interests.forEach(interest => {
                chipsHTML += `<div class="selection-chip"><i class="fa-solid fa-star"></i> ${interest}</div>`;
            });
        }
        selectionsBar.innerHTML = chipsHTML;
    }

    // 3. مسارات المدن
    const cityRoutes = {
        "Amman": [
            L.latLng(31.9539, 35.9106),
            L.latLng(31.9516, 35.9394),
            L.latLng(31.9552, 35.9286)
        ],
        "Jerash": [
            L.latLng(32.2800, 35.8958),
            L.latLng(32.2781, 35.8911),
            L.latLng(32.2818, 35.8909)
        ],
        "Petra": [
            L.latLng(30.3256, 35.4500),
            L.latLng(30.3222, 35.4516),
            L.latLng(30.3285, 35.4444)
        ],
        "Wadi Rum": [
            L.latLng(29.6381, 35.4346),
            L.latLng(29.5855, 35.4182),
            L.latLng(29.5631, 35.4211)
        ]
    };

    const points = cityRoutes[savedPlan.city] || cityRoutes["Amman"];

    // 4. تهيئة الخريطة المجانية (Leaflet)
    const map = L.map('map', { zoomControl: false }).setView(points[0], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);

    // 5. رسم خط الخريطة
    L.Routing.control({
        waypoints: points,
        routeWhileDragging: false,
        addWaypoints: false,
        show: false,
        lineOptions: {
            styles: [{ color: '#B24C38', weight: 5, opacity: 0.8 }]
        }
    }).addTo(map);

    // 6. تشغيل نافذة نشمي عند الكبس على الأفاتار
    const nashmyBtn = document.getElementById('nashmyAvatarBtn');
    const nashmyModal = document.getElementById('nashmyChatModal');
    const closeModal = document.getElementById('closeNashmyBtn');

    if (nashmyBtn && nashmyModal) {
        nashmyBtn.addEventListener('click', () => {
            nashmyModal.classList.add('active');
        });
    }

    if (closeModal && nashmyModal) {
        closeModal.addEventListener('click', () => {
            nashmyModal.classList.remove('active');
        });
    }

    // 7. مفتاح تبديل اللغة (English / العربية)
    const langBtn = document.getElementById('langSwitchBtn');
    const langText = document.getElementById('langText');
    let currentLang = localStorage.getItem('joviaLang') || 'en';

    function updateLanguageUI(lang) {
        if (lang === 'ar') {
            langText.textContent = 'العربية';
            document.documentElement.dir = 'rtl';
        } else {
            langText.textContent = 'English';
            document.documentElement.dir = 'ltr';
        }
    }

    updateLanguageUI(currentLang);

    if (langBtn) {
        langBtn.addEventListener('click', () => {
            currentLang = currentLang === 'en' ? 'ar' : 'en';
            localStorage.setItem('joviaLang', currentLang);
            updateLanguageUI(currentLang);
        });
    }
});