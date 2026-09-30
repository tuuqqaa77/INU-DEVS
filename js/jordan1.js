document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.category-card');
  const nextBtn = document.getElementById('nextBtn');
  let selectedCategories = [];

  // تحديد وإلغاء تحديد بطاقات التصنيفات
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const category = card.getAttribute('data-category');
      if (!category) return;
      
      card.classList.toggle('selected');
      
      if (card.classList.contains('selected')) {
        if (!selectedCategories.includes(category)) {
          selectedCategories.push(category);
        }
      } else {
        selectedCategories = selectedCategories.filter(c => c !== category);
      }
    });
  });

  // فحص أمان لوجود الزر قبل إضافة الحدث
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      // 1. تحديد التصنيفات المختارة أو 'all' كافتراضي
      const catQuery = selectedCategories.length > 0 
        ? encodeURIComponent(selectedCategories.join(',')) 
        : 'all';
      
      // 2. حفظ الاختيارات في localStorage لسهولة استرجاعها في الصفحة التالية
      localStorage.setItem('selectedJordanCategories', JSON.stringify(
        selectedCategories.length > 0 ? selectedCategories : ['all']
      ));
      
      // 3. التوجيه (إذا كان الملف jordan2.html موجوداً معكِ في مجلد pages):
      window.location.href = `jordan2.html?categories=${catQuery}`;

      // ملاحظة: إذا كان فعلياً لديك مجلد اسمه 'know jordan 2' خارج pages، استبدلي السطر أعلاه بـ:
      // window.location.href = `../know%20jordan%202/jordan2.html?categories=${catQuery}`;
    });
  }
});