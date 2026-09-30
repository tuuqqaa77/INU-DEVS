document.addEventListener('DOMContentLoaded', () => {
    // 1. إدارة خيارات الميزانية
    const budgetBtns = document.querySelectorAll('.budget-btn');
    const customBudgetBtn = document.getElementById('customBudgetBtn');
    const customBudgetContainer = document.getElementById('customBudgetContainer');
    const customBudgetInput = document.getElementById('customBudgetInput');
    const saveCustomBudgetBtn = document.getElementById('saveCustomBudget');

    let selectedBudget = '250';

    budgetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn === customBudgetBtn) {
                const isVisible = customBudgetContainer.style.display === 'flex';
                customBudgetContainer.style.display = isVisible ? 'none' : 'flex';
                if (!isVisible) customBudgetInput.focus();
                return;
            }

            customBudgetContainer.style.display = 'none';
            budgetBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedBudget = btn.getAttribute('data-value');
        });
    });

    if (saveCustomBudgetBtn) {
        saveCustomBudgetBtn.addEventListener('click', () => {
            const val = Number(customBudgetInput.value.trim());

            if (!isNaN(val) && val > 0) {
                if (val > 1500) {
                    alert("The maximum budget limit for a trip is 1500 JOD.");
                    return;
                }

                if (val < 300) {
                    const confirmLow = confirm(`The average smart trip in Jordan usually starts around 300 JOD. Do you want to proceed with ${val} JOD?`);
                    if (!confirmLow) return;
                }

                customBudgetBtn.innerText = `${val} JOD`;
                customBudgetBtn.setAttribute('data-value', val);
                selectedBudget = String(val);

                budgetBtns.forEach(b => b.classList.remove('active'));
                customBudgetBtn.classList.add('active');
                customBudgetContainer.style.display = 'none';
                customBudgetInput.value = "";
            } else {
                alert("Please enter a valid budget amount.");
            }
        });
    }

    // 2. إدارة اختيار الاهتمامات (Interests Chips)
    const interestChips = document.querySelectorAll('.interest-chip');
    interestChips.forEach(chip => {
        chip.addEventListener('click', () => {
            chip.classList.toggle('active');
        });
    });

    // 3. قائمة اللغات
    const langBtn = document.getElementById('langSwitchBtn');
    const langMenu = document.getElementById('langMenu');
    const currentLangText = document.getElementById('currentLangText');

    if (langBtn && langMenu) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langMenu.classList.toggle('hidden-menu');
        });

        langMenu.querySelectorAll('div').forEach(item => {
            item.addEventListener('click', () => {
                const lang = item.getAttribute('data-lang');
                if (currentLangText) currentLangText.textContent = lang;
                langMenu.classList.add('hidden-menu');
            });
        });

        document.addEventListener('click', (e) => {
            if (!langBtn.contains(e.target) && !langMenu.contains(e.target)) {
                langMenu.classList.add('hidden-menu');
            }
        });
    }

    // 4. تجميع البيانات وحفظها والانتقال إلى smart-map.html
    const generateTripBtn = document.getElementById('generateTripBtn');
    if (generateTripBtn) {
        generateTripBtn.addEventListener('click', () => {
            const days = document.getElementById('daysSelect').value;
            const startingPoint = document.getElementById('startingPointSelect').value;
            
            const selectedInterests = [];
            document.querySelectorAll('.interest-chip.active').forEach(chip => {
                selectedInterests.push(chip.getAttribute('data-interest') || chip.querySelector('span').textContent.trim());
            });

            // حفظ الخيارات ليتمكن ملف map.js من قراءتها
            const tripPlan = {
                city: startingPoint,
                budget: `${selectedBudget} JOD`,
                days: days,
                interests: selectedInterests.length > 0 ? selectedInterests : ['General']
            };

            localStorage.setItem('joviaTripPlan', JSON.stringify(tripPlan));
            window.location.href = 'smart-map.html';
        });
    }
});