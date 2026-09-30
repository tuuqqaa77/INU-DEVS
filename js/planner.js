document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.querySelector('.btn-generate-trip');
    const budgetBtns = document.querySelectorAll('.budget-btn');
    const citySelect = document.querySelector('.detail-select-pill');
    let selectedBudget = 'Medium';

    // اختيار الميزانية
    budgetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            budgetBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedBudget = btn.textContent.trim();
        });
    });

    // عند الضغط على زر إنشاء الرحلة
    if (generateBtn) {
        generateBtn.addEventListener('click', (e) => {
            e.preventDefault();

            // حفظ الاختيارات
            const tripData = {
                budget: selectedBudget,
                city: citySelect ? citySelect.value : 'Amman'
            };

            localStorage.setItem('joviaTripPlan', JSON.stringify(tripData));

            // التوجيه لصفحة الخريطة
            window.location.href = 'map.html';
        });
    }
});