document.addEventListener('DOMContentLoaded', () => {
  let allPlaces = [];

  // 1. قراءة التصنيفات المحددة من jordan1
  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get('categories');
  const selectedCategories = catParam && catParam !== 'all' 
    ? catParam.split(',').map(c => decodeURIComponent(c).trim().toLowerCase())
    : JSON.parse(localStorage.getItem('selectedJordanCategories') || '["all"]').map(c => c.toLowerCase());

  // 2. تحميل ملف JSON
  fetch('../data/places.json')
    .then(response => {
      if (!response.ok) throw new Error('Failed to load places.json');
      return response.json();
    })
    .then(data => {
      allPlaces = data;
      const filteredPlaces = filterPlacesByCategory(allPlaces, selectedCategories);
      
      if (filteredPlaces.length > 0) {
        displayPlace(filteredPlaces[0]);
        populateCarousel(filteredPlaces);
      }
    })
    .catch(error => {
      console.warn('Error loading JSON:', error);
    });

  // تصفية الأماكن بناءً على التصنيف
  function filterPlacesByCategory(places, cats) {
    if (cats.includes('all')) return places;
    return places.filter(p => cats.some(c => p.category.toLowerCase().includes(c)));
  }

  // عرض تفاصيل المكان وصورة الهيدر
  function displayPlace(place) {
    document.getElementById('placeTitle').textContent = place.name;
    document.getElementById('placeCategory').textContent = place.category;
    document.getElementById('placeLocation').innerHTML = `
      <i class="fa-solid fa-location-dot"></i> <span>${place.location}</span> <span class="rating-text">• ${place.rating}</span>
    `;
    document.getElementById('placeAbout').textContent = place.fullDetails || place.shortText;

    if (place.mainImage) {
      const img = new Image();
      img.src = place.mainImage;
      img.onload = () => {
        document.getElementById('heroHeader').style.backgroundImage = `url('${place.mainImage}')`;
      };
      img.onerror = () => {
        document.getElementById('heroHeader').style.backgroundImage = `url('../assets/JARASH 1.jpeg')`;
      };
    }
  }

  // شريط التمرير الأفقي مع خاصية Lazy Loading
  function populateCarousel(places) {
    const container = document.getElementById('carouselContainer');
    container.innerHTML = '';

    places.forEach(place => {
      const miniCard = document.createElement('div');
      miniCard.className = 'mini-card';
      miniCard.innerHTML = `
        <img src="${place.mainImage}" alt="${place.name}" loading="lazy" onerror="this.onerror=null; this.src='../assets/ammanH.png';">
        <span class="mini-card-title">${place.name}</span>
      `;
      miniCard.addEventListener('click', () => {
        displayPlace(place);
      });
      container.appendChild(miniCard);
    });
  }

  // البحث السريع
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const matched = allPlaces.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.location.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
      if (matched.length > 0) {
        displayPlace(matched[0]);
        populateCarousel(matched);
      }
    });
  }
});