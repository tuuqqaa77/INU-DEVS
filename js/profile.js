document.addEventListener('DOMContentLoaded', () => {
    // 1. القائمة المنسدلة للغات
    const langDropdownBtn = document.getElementById('langDropdownBtn');
    const langMenu = document.getElementById('langMenu');
    const currentLang = document.getElementById('currentLang');

    if (langDropdownBtn) {
        langDropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langMenu.classList.toggle('show');
        });
    }

    document.querySelectorAll('.lang-option').forEach(option => {
        option.addEventListener('click', (e) => {
            currentLang.textContent = e.target.getAttribute('data-lang');
            langMenu.classList.remove('show');
        });
    });

    document.addEventListener('click', () => {
        if (langMenu) langMenu.classList.remove('show');
    });

    // 2. زر الإشعارات (إزالة النقطة الحمراء وعرض التنبيهات)
    const notifBtn = document.querySelector('.action-circle-btn.has-unread');
    if (notifBtn) {
        notifBtn.addEventListener('click', () => {
            notifBtn.classList.remove('has-unread');
            alert('Notifications:\n1. Your Amman trip is confirmed!\n2. Check out new places in Petra.');
        });
    }

    // 3. توجيه عناصر سجل الرحلات السابقة لصفحة know-jordan.html
    const pastTripItems = document.querySelectorAll('.past-trip-item');
    pastTripItems.forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', () => {
            window.location.href = 'know-jordan.html';
        });
    });

    // 4. زر Show More وإضافة الرحلات الديناميكية الموجهة أيضاً لـ know-jordan.html
    const showMoreBtn = document.querySelector('.show-more-dark-btn');
    const pastTripList = document.querySelector('.past-trip-list');

    if (showMoreBtn && pastTripList) {
        showMoreBtn.addEventListener('click', () => {
            const extraTrips = [
                { title: 'Aqaba Red Sea Diving', date: 'Completed • November 2025' },
                { title: 'Wadi Rum Stargazing', date: 'Completed • September 2025' }
            ];

            extraTrips.forEach(trip => {
                const article = document.createElement('article');
                article.className = 'past-trip-item';
                article.style.cursor = 'pointer';
                article.innerHTML = `
                    <div class="past-trip-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                            <path d="M12 2a10 10 0 0 1 0 20"></path>
                        </svg>
                    </div>
                    <div class="past-trip-info">
                        <h3>${trip.title}</h3>
                        <p>${trip.date}</p>
                    </div>
                    <span class="arrow-right">›</span>
                `;

                article.addEventListener('click', () => {
                    window.location.href = 'know-jordan.html';
                });

                pastTripList.appendChild(article);
            });

            showMoreBtn.textContent = 'No More Trips';
            showMoreBtn.disabled = true;
            showMoreBtn.style.opacity = '0.6';
            showMoreBtn.style.cursor = 'default';
        });
    }
});