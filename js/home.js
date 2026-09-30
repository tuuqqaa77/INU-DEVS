// فتح صفحة الملف الشخصي عند الضغط على أفاتار نشمي
function goToProfile() {
  window.location.href = "profile.html";
}

// فتح صفحة خريطة المسار
function goToRoadmap() {
  window.location.href = "roadmap.html";
}

// التفاعل عند الضغط على بطاقة أي يوم
function openDayDetail(dayNumber) {
  console.log("تم اختيار اليوم رقم: " + dayNumber);
}
// زر الانتقال للخريطة في نهاية الصفحة
const routeMapBtn = document.querySelector('.btn-generate-trip, #viewMapBtn, .journey-route-btn');

if (routeMapBtn) {
    routeMapBtn.addEventListener('click', () => {
        window.location.href = 'smart-map.html';
    });
}