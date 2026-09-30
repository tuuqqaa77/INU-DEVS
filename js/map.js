/**
 * JOVIA - Smart Map Controller
 * Matches user's trip plan (city, budget, activity, days) with predefined routes
 * Renders points, names, polylines, fitBounds, and handles saving to localStorage.
 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. قاعدة المسارات المحددة مسبقاً (5 مسارات لتغطية تركيبات مختلفة)
    const predefinedRoutes = [
        {
            id: "route-amman-food-4",
            name: "Amman Culinary & Downtown Heritage Trail",
            city: "Amman",
            budget: 100,
            activity: "Food", // Matches "Food" or "Local Food"
            days: 4,
            description: "4-day gastronomic and cultural trail through historic Downtown Amman and traditional eateries.",
            points: [
                { name: "Hashem Restaurant (Downtown)", lat: 31.9516, lng: 35.9394 },
                { name: "Habibah Sweets (Knafeh)", lat: 31.9508, lng: 35.9333 },
                { name: "Rainbow Street Traditional Cafes", lat: 31.9510, lng: 35.9255 },
                { name: "Amman Citadel Panoramic View", lat: 31.9539, lng: 35.9351 }
            ]
        },
        {
            id: "route-petra-history-3",
            name: "Wonders of Ancient Nabataean Petra",
            city: "Petra",
            budget: 250,
            activity: "History",
            days: 3,
            description: "3-day immersive historical exploration through the ancient Siq, Treasury, and the Monastery.",
            points: [
                { name: "Petra Main Gate & Bab Al-Siq", lat: 30.3256, lng: 35.4844 },
                { name: "The Siq & Treasury (Al-Khazneh)", lat: 30.3222, lng: 35.4516 },
                { name: "The Colonnaded Street & Great Temple", lat: 30.3285, lng: 35.4444 },
                { name: "Ad-Deir (The Monastery)", lat: 30.3378, lng: 35.4339 }
            ]
        },
        {
            id: "route-aqaba-adventure-2",
            name: "Red Sea Marine & Coral Reef Adventure",
            city: "Aqaba",
            budget: 100,
            activity: "Adventure",
            days: 2,
            description: "2-day coastal discovery with coral reef snorkeling, diving bays, and seaside promenades.",
            points: [
                { name: "Aqaba Port & Marine Reserve", lat: 29.4312, lng: 34.9754 },
                { name: "Japanese Garden Snorkeling Reef", lat: 29.4055, lng: 34.9772 },
                { name: "Ayla Marina Lagoon Promenade", lat: 29.5448, lng: 34.9820 }
            ]
        },
        {
            id: "route-jerash-history-1",
            name: "Jerash Greco-Roman Imperial Highlights",
            city: "Jerash",
            budget: 50,
            activity: "History",
            days: 1,
            description: "Full-day historical tour through Hadrian's Arch, the Oval Plaza, and Roman Theaters.",
            points: [
                { name: "Hadrian's Arch", lat: 32.2723, lng: 35.8911 },
                { name: "The Oval Plaza & Cardo Maximus", lat: 32.2781, lng: 35.8911 },
                { name: "South Roman Theater & Artemis Temple", lat: 32.2818, lng: 35.8909 }
            ]
        },
        {
            id: "route-amman-adventure-3",
            name: "Amman & Dead Sea Valley Canyon Trek",
            city: "Amman",
            budget: 250,
            activity: "Adventure",
            days: 3,
            description: "3-day nature adventure starting from Amman down to the trails of Wadi Mujib and the Dead Sea.",
            points: [
                { name: "King Hussein Park Trail (Amman)", lat: 31.9865, lng: 35.8288 },
                { name: "Wadi Mujib Siq Adventure Trail", lat: 31.4667, lng: 35.5667 },
                { name: "Dead Sea Panoramic Viewpoint", lat: 31.5794, lng: 35.5786 }
            ]
        }
    ];

    // 2. قراءة خيارات المستخدم المخزنة في localStorage
    let savedPlan = null;
    try {
        savedPlan = JSON.parse(localStorage.getItem('joviaTripPlan'));
    } catch (_) {
        savedPlan = null;
    }

    // قيم افتراضية مطابقة في حال عدم وجود خطة محفوظة
    if (!savedPlan || typeof savedPlan !== 'object') {
        savedPlan = {
            city: "Amman",
            budget: "250 JOD",
            days: "3",
            interests: ["Adventure"]
        };
    }

    // 3. تحديث شريط الخيارات في الواجهة (Selection Chips)
    const summaryCity = document.getElementById('summaryCity');
    const summaryBudget = document.getElementById('summaryBudget');
    const summaryDays = document.getElementById('summaryDays');
    const summaryInterests = document.getElementById('summaryInterests');

    const displayCity = savedPlan.city || "Amman";
    const displayBudget = savedPlan.budget ? (String(savedPlan.budget).includes('JOD') ? savedPlan.budget : `${savedPlan.budget} JOD`) : "250 JOD";
    const displayDays = savedPlan.days ? (String(savedPlan.days).includes('Day') ? savedPlan.days : `${savedPlan.days} Days`) : "3 Days";
    
    let displayInterest = "Adventure";
    if (savedPlan.interests && Array.isArray(savedPlan.interests) && savedPlan.interests.length > 0) {
        displayInterest = savedPlan.interests[0];
    } else if (savedPlan.activity) {
        displayInterest = savedPlan.activity;
    }

    if (summaryCity) summaryCity.textContent = displayCity;
    if (summaryBudget) summaryBudget.textContent = displayBudget;
    if (summaryDays) summaryDays.textContent = displayDays;
    if (summaryInterests) summaryInterests.textContent = displayInterest;

    // 4. استخلاص قيم المقارنة وتوحيد الصيغ
    const planCity = (savedPlan.city || "").trim().toLowerCase();
    
    // استخراج الرقم من الميزانية (مثال: "100 JOD" أو 100 يصبح 100)
    const rawBudgetNumber = String(savedPlan.budget || "").replace(/[^\d]/g, '');
    const planBudget = rawBudgetNumber ? parseInt(rawBudgetNumber, 10) : 0;
    
    // استخراج عدد الأيام
    const planDays = savedPlan.days ? parseInt(savedPlan.days, 10) : 0;

    // استخراج الأنشطة والاهتمامات
    const userActivities = [];
    if (Array.isArray(savedPlan.interests)) {
        userActivities.push(...savedPlan.interests);
    }
    if (savedPlan.activity) {
        userActivities.push(savedPlan.activity);
    }
    if (savedPlan.interest) {
        userActivities.push(savedPlan.interest);
    }

    // دالة فحص تطابق النشاط
    function isActivityMatch(routeActivity, userActs) {
        if (!routeActivity || userActs.length === 0) return false;
        const target = routeActivity.toLowerCase();
        return userActs.some(act => {
            const current = String(act).toLowerCase();
            return current === target || current.includes(target) || target.includes(current);
        });
    }

    // 5. البحث عن مسار يطابق كل الشروط بدقة: City + Budget + Activity + Days
    const matchedRoute = predefinedRoutes.find(route => {
        const cityMatch = route.city.toLowerCase() === planCity;
        const budgetMatch = route.budget === planBudget;
        const daysMatch = route.days === planDays;
        const activityMatch = isActivityMatch(route.activity, userActivities);
        return cityMatch && budgetMatch && daysMatch && activityMatch;
    });

    // 6. تهيئة خريطة Leaflet
    const mapContainer = document.getElementById('map');
    let map = null;
    if (mapContainer) {
        map = L.map('map', { zoomControl: false }).setView([31.9522, 35.9332], 8);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(map);
    }

    // عناصر تفاصيل المسار والتنبيهات
    const routeInfoCard = document.getElementById('routeInfoCard');
    const noRouteAlert = document.getElementById('noRouteAlert');
    const routeName = document.getElementById('routeName');
    const routeMeta = document.getElementById('routeMeta');
    const routeStopsList = document.getElementById('routeStopsList');
    const saveRouteBtn = document.getElementById('saveRouteBtn');
    const saveRouteText = document.getElementById('saveRouteText');
    const saveRouteIcon = document.getElementById('saveRouteIcon');

    // 7. معالجة حالة وجود مسار مطابق أو عدم وجوده
    if (matchedRoute && map) {
        // إخفاء رسالة عدم وجود مسار وإظهار كرت المسار
        if (noRouteAlert) noRouteAlert.style.display = 'none';
        if (routeInfoCard) routeInfoCard.style.display = 'flex';

        // عرض تفاصيل المسار
        if (routeName) routeName.textContent = matchedRoute.name;
        if (routeMeta) {
            routeMeta.textContent = `${matchedRoute.days} Days • ${matchedRoute.budget} JOD • ${matchedRoute.activity} • ${matchedRoute.points.length} Locations`;
        }

        // إظهار المحطات
        if (routeStopsList) {
            routeStopsList.innerHTML = matchedRoute.points.map((pt, idx) => `
                <span class="stop-pill">
                    <i class="fa-solid fa-location-dot" style="color: #B24C38;"></i>
                    ${idx + 1}. ${pt.name}
                </span>
            `).join('');
        }

        // إضافة العلامات (Markers) وعرض أسماء الأماكن
        const latLngs = [];
        matchedRoute.points.forEach((point, index) => {
            const latLng = [point.lat, point.lng];
            latLngs.push(latLng);

            const marker = L.marker(latLng).addTo(map);
            
            // ربط النافذة المنبثقة
            marker.bindPopup(`<b>${index + 1}. ${point.name}</b><br><small>${matchedRoute.city}</small>`);
            
            // إظهار اسم المكان دائماً كـ Tooltip دائم فوق العلامة
            marker.bindTooltip(`${index + 1}. ${point.name}`, {
                permanent: true,
                direction: 'top',
                offset: [0, -12],
                className: 'map-point-label'
            });
        });

        // رسم الـ Polyline بين النقاط
        const polyline = L.polyline(latLngs, {
            color: '#B24C38',
            weight: 5,
            opacity: 0.85,
            lineJoin: 'round'
        }).addTo(map);

        // عمل fitBounds ليظهر المسار بالكامل داخل الخريطة
        map.fitBounds(polyline.getBounds(), {
            padding: [45, 45],
            maxZoom: 15
        });

        // 8. زر حفظ المسار (Save Route) وتخزينه في localStorage
        if (saveRouteBtn) {
            // التحقق إن كان المسار محفوظاً مسبقاً
            const savedRoute = localStorage.getItem('joviaSavedRoute');
            if (savedRoute) {
                try {
                    const parsed = JSON.parse(savedRoute);
                    if (parsed && parsed.id === matchedRoute.id) {
                        setButtonSavedUI();
                    }
                } catch (_) {}
            }

            saveRouteBtn.addEventListener('click', () => {
                // حفظ المسار في localStorage
                localStorage.setItem('joviaSavedRoute', JSON.stringify(matchedRoute));

                // حفظه أيضاً داخل قائمة المسارات المحفوظة
                try {
                    const savedList = JSON.parse(localStorage.getItem('joviaSavedRoutesList') || '[]');
                    const exists = savedList.some(r => r.id === matchedRoute.id);
                    if (!exists) {
                        savedList.push(matchedRoute);
                        localStorage.setItem('joviaSavedRoutesList', JSON.stringify(savedList));
                    }
                } catch (_) {}

                setButtonSavedUI();
                alert(`Route "${matchedRoute.name}" has been saved successfully!`);
            });
        }

    } else {
        // في حال عدم وجود مسار مطابق: عدم استخدام مسار عشوائي وإظهار الرسالة المطلوبة بدقة
        if (noRouteAlert) {
            noRouteAlert.style.display = 'flex';
            const alertText = document.getElementById('noRouteText');
            if (alertText) {
                alertText.textContent = "No predefined route available for this combination.";
            }
        }
        if (routeInfoCard) routeInfoCard.style.display = 'none';

        // ضبط الخريطة على المشهد العام للأردن
        if (map) {
            map.setView([31.9522, 35.9332], 7);
        }
    }

    function setButtonSavedUI() {
        if (!saveRouteBtn) return;
        saveRouteBtn.classList.add('saved');
        if (saveRouteText) saveRouteText.textContent = "Saved!";
        if (saveRouteIcon) saveRouteIcon.className = "fa-solid fa-check";
    }

    // 9. نافذة نشمي المنبثقة (Nashmy Modal)
    const modal = document.getElementById('nashmyModalOverlay');
    const openBtn = document.getElementById('openNashmyModalBtn');
    const closeBtn = document.getElementById('closeNashmyModalBtn');

    if (openBtn && modal) {
        openBtn.addEventListener('click', () => modal.classList.add('active'));
    }
    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    }

    // 10. تبديل اللغة (Language Switch)
    const langBtn = document.getElementById('langSwitchBtn');
    const currentLangText = langBtn ? langBtn.querySelector('span') : document.getElementById('langText');
    let currentLang = localStorage.getItem('joviaLang') || 'en';

    function updateLanguageUI(lang) {
        if (currentLangText) {
            currentLangText.textContent = lang === 'ar' ? 'العربية' : 'English';
        }
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
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