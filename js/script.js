/* ============================================
   js/script.js - Main JavaScript File
   Brush & Soul - Artist Portfolio & Shop
   ============================================ */

// ==========================================
// 1. NAVIGATION
// ==========================================

const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

// Navbar scroll effect (only on homepage)
if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      // Only remove 'scrolled' on the home page
      if (document.querySelector('.hero')) {
        navbar.classList.remove('scrolled');
      }
    }
  });
}

// Mobile menu toggle
if (navToggle) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    navToggle.classList.toggle('active');
  });

  // Close mobile menu when a link is clicked
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      navToggle.classList.remove('active');
    });
  });
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  if (navLinks && navLinks.classList.contains('active')) {
    if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
      navLinks.classList.remove('active');
      navToggle.classList.remove('active');
    }
  }
});


// ==========================================
// 2. SCROLL ANIMATIONS (Fade In)
// ==========================================

const fadeElements = document.querySelectorAll('.fade-in');

const fadeInObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeInObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
});

fadeElements.forEach(el => fadeInObserver.observe(el));


// ==========================================
// 3. GALLERY FILTERS
// ==========================================

const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item, .product-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove active class from all buttons
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    galleryItems.forEach(item => {
      const category = item.getAttribute('data-category');

      if (filter === 'all' || category === filter) {
        item.style.display = 'block';
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }, 50);
      } else {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        setTimeout(() => {
          item.style.display = 'none';
        }, 300);
      }
    });

    // Update result count (shop page)
    updateResultCount();
  });
});

function updateResultCount() {
  const resultCountEl = document.getElementById('resultCount');
  if (resultCountEl) {
    const visibleItems = document.querySelectorAll('.product-card[style*="display: block"], .product-card:not([style*="display: none"])');
    let count = 0;
    document.querySelectorAll('.product-card').forEach(item => {
      if (item.style.display !== 'none') count++;
    });
    resultCountEl.textContent = count;
  }
}


// ==========================================
// 4. LIGHTBOX (Gallery Page)
// ==========================================

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxInfo = document.getElementById('lightboxInfo');

let currentLightboxIndex = 0;
let lightboxImages = [];

// Collect gallery items for lightbox
document.querySelectorAll('.gallery-item').forEach((item, index) => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    const overlay = item.querySelector('.gallery-item-overlay');
    const title = overlay ? overlay.querySelector('h3').textContent : '';
    const medium = overlay ? overlay.querySelector('.medium').textContent : '';
    const dimensions = overlay ? overlay.querySelector('.dimensions').textContent : '';

    lightboxImages = Array.from(document.querySelectorAll('.gallery-item')).map(el => ({
      src: el.querySelector('img').src,
      title: el.querySelector('.gallery-item-overlay h3')?.textContent || '',
      medium: el.querySelector('.gallery-item-overlay .medium')?.textContent || '',
      dimensions: el.querySelector('.gallery-item-overlay .dimensions')?.textContent || ''
    }));

    currentLightboxIndex = index;
    openLightbox(lightboxImages[index]);
  });
});

function openLightbox(data) {
  if (!lightbox) return;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';

  if (lightboxImg) lightboxImg.src = data.src;
  if (lightboxTitle) lightboxTitle.textContent = data.title;
  if (lightboxInfo) lightboxInfo.innerHTML = `<p>${data.medium}</p><p>${data.dimensions}</p>`;
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('active');
  document.body.style.overflow = 'auto';
}

// Lightbox close button
const lightboxClose = document.querySelector('.lightbox-close');
if (lightboxClose) {
  lightboxClose.addEventListener('click', closeLightbox);
}

// Lightbox navigation
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');

if (lightboxPrev) {
  lightboxPrev.addEventListener('click', () => {
    currentLightboxIndex = (currentLightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
    openLightbox(lightboxImages[currentLightboxIndex]);
  });
}

if (lightboxNext) {
  lightboxNext.addEventListener('click', () => {
    currentLightboxIndex = (currentLightboxIndex + 1) % lightboxImages.length;
    openLightbox(lightboxImages[currentLightboxIndex]);
  });
}

// Close lightbox on overlay click
if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}

// Keyboard navigation for lightbox
document.addEventListener('keydown', (e) => {
  if (lightbox && lightbox.classList.contains('active')) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft' && lightboxPrev) lightboxPrev.click();
    if (e.key === 'ArrowRight' && lightboxNext) lightboxNext.click();
  }
});


// ==========================================
// 5. TESTIMONIAL SLIDER
// ==========================================

const testimonialItems = document.querySelectorAll('.testimonial-item');
const testimonialDots = document.querySelectorAll('.testimonial-dots .dot');
let currentTestimonial = 0;
let testimonialInterval;

function showTestimonial(index) {
  testimonialItems.forEach(item => item.classList.remove('active'));
  testimonialDots.forEach(dot => dot.classList.remove('active'));

  if (testimonialItems[index]) testimonialItems[index].classList.add('active');
  if (testimonialDots[index]) testimonialDots[index].classList.add('active');

  currentTestimonial = index;
}

// Dot click navigation
testimonialDots.forEach(dot => {
  dot.addEventListener('click', () => {
    const index = parseInt(dot.getAttribute('data-index'));
    showTestimonial(index);
    resetTestimonialInterval();
  });
});

// Auto-rotate testimonials
function startTestimonialInterval() {
  testimonialInterval = setInterval(() => {
    const next = (currentTestimonial + 1) % testimonialItems.length;
    showTestimonial(next);
  }, 5000);
}

function resetTestimonialInterval() {
  clearInterval(testimonialInterval);
  startTestimonialInterval();
}

if (testimonialItems.length > 0) {
  startTestimonialInterval();
}


// ==========================================
// 6. SHOPPING CART
// ==========================================

let cart = JSON.parse(localStorage.getItem('brushAndSoulCart')) || [];

const cartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartClose = document.getElementById('cartClose');
const cartItemsContainer = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartItemCount = document.getElementById('cartItemCount');
const cartTotal = document.getElementById('cartTotal');
const cartFooter = document.getElementById('cartFooter');
const emptyCart = document.getElementById('emptyCart');
const continueShoppingBtn = document.getElementById('continueShoppingBtn');
const checkoutBtn = document.getElementById('checkoutBtn');

// Open cart
if (cartBtn) {
  cartBtn.addEventListener('click', () => {
    openCart();
  });
}

// Close cart
if (cartClose) {
  cartClose.addEventListener('click', closeCart);
}

if (cartOverlay) {
  cartOverlay.addEventListener('click', closeCart);
}

if (continueShoppingBtn) {
  continueShoppingBtn.addEventListener('click', closeCart);
}

function openCart() {
  if (cartSidebar) cartSidebar.classList.add('active');
  if (cartOverlay) cartOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  if (cartSidebar) cartSidebar.classList.remove('active');
  if (cartOverlay) cartOverlay.classList.remove('active');
  document.body.style.overflow = 'auto';
}

// Add to cart
document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();

    const id = btn.getAttribute('data-id');
    const name = btn.getAttribute('data-name');
    const price = parseFloat(btn.getAttribute('data-price'));
    const image = btn.getAttribute('data-image');

    // Check if item already in cart
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
      showNotification('This item is already in your cart!', 'warning');
      return;
    }

    cart.push({ id, name, price, image, quantity: 1 });
    saveCart();
    updateCartUI();
    openCart();
    showNotification(`"${name}" added to cart!`, 'success');

    // Button animation
    btn.innerHTML = '<i class="fas fa-check"></i>';
    btn.style.background = '#27ae60';
    btn.style.color = '#fff';
    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-shopping-bag"></i>';
      btn.style.background = '';
      btn.style.color = '';
    }, 2000);
  });
});

function saveCart() {
  localStorage.setItem('brushAndSoulCart', JSON.stringify(cart));
}

function updateCartUI() {
  // Update count badges
  const totalItems = cart.length;
  if (cartCount) cartCount.textContent = totalItems;
  if (cartItemCount) cartItemCount.textContent = totalItems;

  // Update cart items display
  if (cartItemsContainer) {
    // Remove existing cart items (keep emptyCart div)
    const existingItems = cartItemsContainer.querySelectorAll('.cart-item');
    existingItems.forEach(item => item.remove());

    if (cart.length === 0) {
      if (emptyCart) emptyCart.style.display = 'block';
      
