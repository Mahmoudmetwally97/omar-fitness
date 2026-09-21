document.getElementById('currentYear').textContent = new Date().getFullYear();

    // Carousel Logic
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide-item');
    const dots = document.querySelectorAll('.indicator-dot');
    let slideInterval = null;

    function showSlide(index) {
      slides.forEach((s, i) => {
        s.classList.toggle('active', i === index);
      });
      dots.forEach((d, i) => {
        d.classList.toggle('active', i === index);
      });
      currentSlide = index;
    }

    function nextSlide() {
      let next = (currentSlide + 1) % slides.length;
      showSlide(next);
    }

    function prevSlide() {
      let prev = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(prev);
    }

    function goToSlide(index) {
      showSlide(index);
      resetSlideTimer();
    }

    function startSlideTimer() {
      slideInterval = setInterval(nextSlide, 4500);
    }

    function resetSlideTimer() {
      clearInterval(slideInterval);
      startSlideTimer();
    }

    startSlideTimer();

    const sliderBox = document.querySelector('.slider-container-card');
    if (sliderBox) {
      sliderBox.addEventListener('mouseenter', () => clearInterval(slideInterval));
      sliderBox.addEventListener('mouseleave', startSlideTimer);
    }

    // FAQ Accordion
    function toggleFaq(elem) {
      const card = elem.closest('.faq-card');
      const body = card.querySelector('.faq-body');
      const isActive = card.classList.contains('active');

      document.querySelectorAll('.faq-card').forEach(c => {
        c.classList.remove('active');
        const b = c.querySelector('.faq-body');
        if (b) b.removeAttribute('style');
      });

      if (!isActive) {
        card.classList.add('active');
        body.style.maxHeight = (body.scrollHeight + 60) + 'px';
      }
    }

    // Calorie & Macro Calculator
    function calculateMacros() {
      const gender = document.getElementById('calcGender').value;
      const age = parseFloat(document.getElementById('calcAge').value) || 25;
      const weight = parseFloat(document.getElementById('calcWeight').value) || 75;
      const height = parseFloat(document.getElementById('calcHeight').value) || 175;
      const activity = parseFloat(document.getElementById('calcActivity').value) || 1.375;
      const goal = document.getElementById('calcGoal').value;

      // BMR (Mifflin-St Jeor)
      let bmr = (10 * weight) + (6.25 * height) - (5 * age);
      if (gender === 'male') {
        bmr += 5;
      } else {
        bmr -= 161;
      }

      const tdee = bmr * activity;
      let targetCalories = tdee;
      let proteinFactor = 1.8;

      if (goal === 'fat_loss') {
        targetCalories = tdee - 500;
        proteinFactor = 2.0;
      } else if (goal === 'muscle_gain') {
        targetCalories = tdee + 350;
        proteinFactor = 2.0;
      } else {
        targetCalories = tdee;
        proteinFactor = 1.6;
      }

      const proteinGrams = Math.round(weight * proteinFactor);
      const waterLiters = (weight * 0.04).toFixed(1);

      document.getElementById('resCalories').textContent = Math.round(targetCalories).toLocaleString();
      document.getElementById('resProtein').textContent = proteinGrams + 'g';
      document.getElementById('resBmr').textContent = Math.round(bmr).toLocaleString();
      document.getElementById('resWater').textContent = waterLiters + 'L';
    }

    function sendPlanToWhatsApp() {
      const weight = document.getElementById('calcWeight').value;
      const height = document.getElementById('calcHeight').value;
      const age = document.getElementById('calcAge').value;
      const goalSelect = document.getElementById('calcGoal');
      const goalText = goalSelect.options[goalSelect.selectedIndex].text;
      const calories = document.getElementById('resCalories').textContent;
      const protein = document.getElementById('resProtein').textContent;

      const message = `مرحباً كابتن عمر وائل 🏋️‍♂️\nحسبت بياناتي على موقعك وأرغب في الاشتراك معك بتدريب الجيم:\n- الوزن: ${weight} كجم\n- الطول: ${height} سم\n- العمر: ${age} سنة\n- الهدف: ${goalText}\n- السعرات: ${calories} ك.سعر\n- البروتين: ${protein}\n\nما هي الباقة الأنسب لي للبدء؟`;

      window.open(`https://wa.me/966545311416?text=${encodeURIComponent(message)}`, '_blank');
    }

    window.addEventListener('DOMContentLoaded', calculateMacros);

    // Mobile Drawer Toggle
    function toggleMobileMenu() {
      const drawer = document.getElementById('mobileNavDrawer');
      const backdrop = document.getElementById('drawerBackdrop');
      if (drawer && backdrop) {
        drawer.classList.toggle('open');
        backdrop.classList.toggle('open');
        document.body.style.overflow = drawer.classList.contains('open') ? 'hidden' : '';
      }
    }

    // Pricing Tabs Switcher
    function switchPricingTab(type) {
      const btnGym = document.getElementById('tabBtnGym');
      const btnOnline = document.getElementById('tabBtnOnline');
      const gridGym = document.getElementById('pricingGridGym');
      const gridOnline = document.getElementById('pricingGridOnline');

      if (type === 'gym') {
        btnGym.classList.add('active');
        btnOnline.classList.remove('active');
        gridGym.classList.add('active');
        gridOnline.classList.remove('active');
      } else {
        btnOnline.classList.add('active');
        btnGym.classList.remove('active');
        gridOnline.classList.add('active');
        gridGym.classList.remove('active');
      }
    }

    // Scroll Reveal Observer
    // Dynamic Custom Packages from Admin
    function loadCustomPackages() {
      try {
        const pkgs = JSON.parse(localStorage.getItem('omar_custom_packages')) || [];
        pkgs.forEach(pkg => {
          const targetGrid = pkg.type === 'online' 
            ? document.getElementById('pricingGridOnline') 
            : document.getElementById('pricingGridGym');

          if (!targetGrid) return;

          const card = document.createElement('div');
          card.className = 'pricing-card featured reveal active';
          card.innerHTML = `
            ${pkg.badge ? `<div class="featured-ribbon">${pkg.badge}</div>` : '<div class="featured-ribbon">عرض جديد ⭐</div>'}
            ${pkg.image ? `<img src="${pkg.image}" style="width: 100%; height: 160px; object-fit: cover; border-radius: var(--radius-sm); margin-bottom: 14px;">` : ''}
            <div class="pricing-header">
              <div class="pricing-tag-duration">
                <i class="fa-regular fa-calendar-check"></i>
                <span>${pkg.title}</span>
              </div>
              <div class="price-value-row">
                <span class="price-main-number" style="color: var(--primary-red);">${Number(pkg.price).toLocaleString()}</span>
                <span class="price-currency">EGP</span>
                ${pkg.oldPrice ? `<span class="old-price-strikethrough">${Number(pkg.oldPrice).toLocaleString()}</span>` : ''}
              </div>
              ${pkg.duration ? `<p class="price-note-sub">${pkg.duration}</p>` : ''}
            </div>
            <ul class="package-features-list">
              ${pkg.features.map(f => `<li><i class="fa-solid fa-check"></i> <span>${f}</span></li>`).join('')}
            </ul>
            <a href="https://wa.me/966545311416?text=${encodeURIComponent('مرحباً كابتن عمر، أرغب في الاشتراك في: ' + pkg.title + ' بسعر ' + pkg.price + ' EGP')}" target="_blank" class="btn btn-red btn-pulse">
              <span>احجز الآن عبر واتساب</span>
              <i class="fa-brands fa-whatsapp"></i>
            </a>
          `;
          targetGrid.prepend(card);
        });
      } catch (e) {}
    }

    document.addEventListener('DOMContentLoaded', () => {
      loadCustomPackages();

      const reveals = document.querySelectorAll('.reveal, .feature-card, .pricing-card, .group-offer-banner-card, .calc-card-container, .faq-card');
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      }, { threshold: 0.12 });

      reveals.forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
      });
    });