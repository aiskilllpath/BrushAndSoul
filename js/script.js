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
      // Only remove 'scrolled' on the home page (has .hero section)
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
    
    // Animate hamburger to X
    const spans = navToggle.querySelectorAll('span');
    if (navToggle.classList.contains('active')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });

  // Close mobile menu when a link is clicked
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      navToggle.classList.remove('active');
      const spans = navToggle.querySelectorAll('span');
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    });
  });
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  if (navLinks && navLinks.classList.contains('active')) {
    if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
      navLinks.classList.remove('active');
      navToggle.classList.remove('active');
      const spans = navToggle.querySelectorAll('span');
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  }
});


// ==========================================
// 2. SCROLL ANIMATIONS (Fade In on Scroll)
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
// 3. GALLERY & SHOP FILTERS
// ==========================================

const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');
const productCards = document.querySelectorAll('.product-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove active class from all buttons
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    // Filter gallery items
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

    // Filter product cards (shop page)
    productCards.forEach(item => {
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

    // Update result count on shop page
    updateResultCount();
  });
});

function updateResultCount() {
  const resultCountEl = document.getElementById('resultCount');
  if (resultCountEl) {
    let count = 0;
    productCards.forEach(item => {
      if (item.style.display !== 'none') count++;
    });
    resultCountEl.textContent = count;
  }
}


// ==========================================
// 4. SORT FUNCTIONALITY (Shop Page)
// ==========================================

const sortSelect = document.getElementById('sortSelect');
const shopGrid = document.getElementById('shopGrid');

if (sortSelect && shopGrid) {
  sortSelect.addEventListener('change', () => {
    const sortValue = sortSelect.value;
    const cards = Array.from(shopGrid.querySelectorAll('.product-card'));

    cards.sort((a, b) => {
      const priceA = parseFloat(a.getAttribute('data-price')) || 0;
      const priceB = parseFloat(b.getAttribute('data-price')) || 0;
      const nameA = (a.getAttribute('data-name') || '').toLowerCase();
      const nameB = (b.getAttribute('data-name') || '').toLowerCase();

      switch (sortValue) {
        case 'price-low':
          return priceA - priceB;
        case 'price-high':
          return priceB - priceA;
        case 'name':
          return nameA.localeCompare(nameB);
        case 'newest':
          return -1; // Keep original order (newest first)
        default:
          return 0;
      }
    });

    // Re-append sorted cards
    cards.forEach(card => shopGrid.appendChild(card));
  });
}


// ==========================================
// 5. LIGHTBOX (Gallery Page)
// ==========================================

let currentLightboxIndex = 0;
let lightboxImages = [];

// Create lightbox HTML dynamically
function createLightbox() {
  // Check if lightbox already exists
  if (document.getElementById('lightbox')) return;

  const lightboxHTML = `
    <div class="lightbox" id="lightbox">
      <button class="lightbox-close" id="lightboxClose">&times;</button>
      <button class="lightbox-nav lightbox-prev" id="lightboxPrev">&#10094;</button>
      <button class="lightbox-nav lightbox-next" id="lightboxNext">&#10095;</button>
      <div class="lightbox-content">
        <img id="lightboxImg" src="" alt="Painting">
        <div class="lightbox-info">
          <h3 id="lightboxTitle"></h3>
          <div id="lightboxDetails"></div>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', lightboxHTML);
}

// Initialize lightbox
createLightbox();

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxDetails = document.getElementById('lightboxDetails');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

// Collect gallery items for lightbox
function initLightbox() {
  const items = document.querySelectorAll('.gallery-item');
  
  items.forEach((item, index) => {
    item.addEventListener('click', () => {
      // Build lightbox images array from currently visible items
      lightboxImages = [];
      let clickedIndex = 0;
      let counter = 0;

      document.querySelectorAll('.gallery-item').forEach((el) => {
        if (el.style.display !== 'none') {
          const img = el.querySelector('img');
          const overlay = el.querySelector('.gallery-item-overlay');
          
          lightboxImages.push({
            src: img ? img.src : '',
            title: overlay?.querySelector('h3')?.textContent || '',
            medium: overlay?.querySelector('.medium')?.textContent || '',
            dimensions: overlay?.querySelector('.dimensions')?.textContent || ''
          });

          if (el === item) {
            clickedIndex = counter;
          }
          counter++;
        }
      });

      currentLightboxIndex = clickedIndex;
      openLightbox(lightboxImages[currentLightboxIndex]);
    });
  });
}

initLightbox();

function openLightbox(data) {
  if (!lightbox || !data) return;
  
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';

  if (lightboxImg) lightboxImg.src = data.src;
  if (lightboxTitle) lightboxTitle.textContent = data.title;
  if (lightboxDetails) {
    lightboxDetails.innerHTML = `
      <p style="color: var(--accent-color); margin-bottom: 5px;">${data.medium}</p>
      <p style="opacity: 0.8;">${data.dimensions}</p>
    `;
  }
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('active');
  document.body.style.overflow = 'auto';
}

function nextLightbox() {
  if (lightboxImages.length === 0) return;
  currentLightboxIndex = (currentLightboxIndex + 1) % lightboxImages.length;
  openLightbox(lightboxImages[currentLightboxIndex]);
}

function prevLightbox() {
  if (lightboxImages.length === 0) return;
  currentLightboxIndex = (currentLightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
  openLightbox(lightboxImages[currentLightboxIndex]);
}

// Lightbox event listeners
if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightboxNext) lightboxNext.addEventListener('click', nextLightbox);
if (lightboxPrev) lightboxPrev.addEventListener('click', prevLightbox);

// Close on overlay click
if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (lightbox && lightbox.classList.contains('active')) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevLightbox();
    if (e.key === 'ArrowRight') nextLightbox();
  }
});


// ==========================================
// 6. TESTIMONIAL SLIDER
// ==========================================

const testimonialItems = document.querySelectorAll('.testimonial-item');
const testimonialDots = document.querySelectorAll('.testimonial-dots .dot');
let currentTestimonial = 0;
let testimonialInterval;

function showTestimonial(index) {
  if (testimonialItems.length === 0) return;
  
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

// Auto-rotate testimonials every 5 seconds
function startTestimonialInterval() {
  if (testimonialItems.length === 0) return;
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
// 7. SHOPPING CART
// ==========================================

// Load cart from localStorage
let cart = JSON.parse(localStorage.getItem('brushAndSoulCart')) || [];

// Cart DOM elements
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

// Open cart sidebar
function openCart() {
  if (cartSidebar) cartSidebar.classList.add('active');
  if (cartOverlay) cartOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Close cart sidebar
function closeCart() {
  if (cartSidebar) cartSidebar.classList.remove('active');
  if (cartOverlay) cartOverlay.classList.remove('active');
  document.body.style.overflow = 'auto';
}

// Cart event listeners
if (cartBtn) cartBtn.addEventListener('click', openCart);
if (cartClose) cartClose.addEventListener('click', closeCart);
if (cartOverlay) cartOverlay.addEventListener('click', closeCart);
if (continueShoppingBtn) continueShoppingBtn.addEventListener('click', closeCart);

// Checkout button
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) return;
    
    // 🔄 CHANGE: Replace with your payment link or checkout page
    // Option 1: Simple alert (for now)
    alert('Thank you for your interest! Please contact us at hello@brushandsoul.com to complete your purchase.');
    
    // Option 2: Redirect to email
    // const items = cart.map(item => `${item.name} - 
$$
{item.price}`).join('%0A');
    // window.location.href = `mailto:hello@brushandsoul.com?subject=Art Purchase Order&body=I would like to purchase:%0A${items}%0A%0ATotal:
$$
{getCartTotal()}`;
    
    // Option 3: Redirect to PayPal (uncomment when ready)
    // window.location.href = 'https://paypal.me/yourusername/' + getCartTotal();
  });
}

// Add to cart functionality
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

    // Add item to cart
    cart.push({ id, name, price, image, quantity: 1 });
    saveCart();
    updateCartUI();
    openCart();
    showNotification(`"${name}" added to cart!`, 'success');

    // Button animation feedback
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

// Save cart to localStorage
function saveCart() {
  localStorage.setItem('brushAndSoulCart', JSON.stringify(cart));
}

// Get cart total price
function getCartTotal() {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Remove item from cart
function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  updateCartUI();
  showNotification('Item removed from cart', 'info');
}

// Update cart UI
function updateCartUI() {
  const totalItems = cart.length;
  
  // Update count badges
  if (cartCount) cartCount.textContent = totalItems;
  if (cartItemCount) cartItemCount.textContent = totalItems;

  // Update cart items display
  if (cartItemsContainer) {
    // Remove existing cart items
    const existingItems = cartItemsContainer.querySelectorAll('.cart-item');
    existingItems.forEach(item => item.remove());

    if (cart.length === 0) {
      // Show empty cart message
      if (emptyCart) emptyCart.style.display = 'block';
      if (cartFooter) cartFooter.style.display = 'none';
    } else {
      // Hide empty cart message
      if (emptyCart) emptyCart.style.display = 'none';
      if (cartFooter) cartFooter.style.display = 'block';

      // Create cart item elements
      cart.forEach(item => {
        const cartItemHTML = `
          <div class="cart-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
              <h4>${item.name}</h4>
              <p>$${item.price.toLocaleString()}</p>
              <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">
                <i class="fas fa-trash"></i> Remove
              </button>
            </div>
          </div>
        `;
        cartItemsContainer.insertAdjacentHTML('beforeend', cartItemHTML);
      });
    }
  }

  // Update total price
  if (cartTotal) {
    cartTotal.textContent = '$' + getCartTotal().toLocaleString();
  }
}

// Initialize cart UI on page load
updateCartUI();


// ==========================================
// 8. NOTIFICATION SYSTEM
// ==========================================

function showNotification(message, type = 'success') {
  // Remove existing notification
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();

  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  
  // Set icon based on type
  let icon = 'check-circle';
  if (type === 'warning') icon = 'exclamation-circle';
  if (type === 'error') icon = 'times-circle';
  if (type === 'info') icon = 'info-circle';

  notification.innerHTML = `
    <i class="fas fa-${icon}"></i>
    <span>${message}</span>
    <button class="notification-close">&times;</button>
  `;

  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${type === 'success' ? '#27ae60' : type === 'warning' ? '#f39c12' : type === 'error' ? '#e74c3c' : '#3498db'};
    color: white;
    padding: 15px 25px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    gap: 12px;
    z-index: 3000;
    font-family: var(--font-body);
    font-size: 0.95rem;
    box-shadow: 0 5px 20px rgba(0,0,0,0.2);
    animation: slideInRight 0.4s ease;
    max-width: 350px;
  `;

  document.body.appendChild(notification);

  // Close button
  const closeBtn = notification.querySelector('.notification-close');
  closeBtn.style.cssText = `
    background: none;
    border: none;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
    margin-left: 10px;
  `;
  closeBtn.addEventListener('click', () => notification.remove());

  // Auto remove after 4 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = 'slideOutRight 0.4s ease';
      setTimeout(() => notification.remove(), 400);
    }
  }, 4000);
}

// Add notification animation styles
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(100px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  @keyframes slideOutRight {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(100px);
    }
  }
`;
document.head.appendChild(notificationStyles);


// ==========================================
// 9. CONTACT FORM
// ==========================================

const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form data
    const firstName = document.getElementById('firstName')?.value || '';
    const lastName = document.getElementById('lastName')?.value || '';
    const email = document.getElementById('email')?.value || '';
    const phone = document.getElementById('phone')?.value || '';
    const subject = document.getElementById('subject')?.value || '';
    const budget = document.getElementById('budget')?.value || '';
    const message = document.getElementById('message')?.value || '';

    // Basic validation
    if (!firstName || !lastName || !email || !subject || !message) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showNotification('Please enter a valid email address', 'error');
      return;
    }

    // 🔄 CHANGE: Choose ONE of these options for form handling:

    // ────────────────────────────────────────────
    // OPTION 1: Open email client (SIMPLEST - No backend needed)
    // ────────────────────────────────────────────
    const mailtoSubject = encodeURIComponent(`[Brush & Soul] ${subject} - from ${firstName} ${lastName}`);
    const mailtoBody = encodeURIComponent(
      `Name: ${firstName} ${lastName}\n` +
      `Email: ${email}\n` +
      `Phone: ${phone}\n` +
      `Subject: ${subject}\n` +
      `Budget: ${budget}\n\n` +
      `Message:\n${message}`
    );
    
    // 🔄 CHANGE: Replace with artist's real email
    window.location.href = `mailto:hello@brushandsoul.com?subject=${mailtoSubject}&body=${mailtoBody}`;

    // ────────────────────────────────────────────
    // OPTION 2: Use Formspree (FREE - Recommended!)
    // Sign up at https://formspree.io (free for 50 submissions/month)
    // ────────────────────────────────────────────
    // Uncomment below and replace YOUR_FORM_ID:
    /*
    fetch('https://formspree.io/f/YOUR_FORM_ID', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName, lastName, email, phone, subject, budget, message
      })
    })
    .then(response => {
      if (response.ok) {
        showFormSuccess();
      } else {
        showNotification('Something went wrong. Please try again.', 'error');
      }
    })
    .catch(() => {
      showNotification('Something went wrong. Please try again.', 'error');
    });
    */

    // Show success
    showFormSuccess();
  });
}

function showFormSuccess() {
  if (contactForm && formSuccess) {
    contactForm.style.display = 'none';
    formSuccess.style.display = 'block';
    formSuccess.style.textAlign = 'center';
    formSuccess.style.padding = '60px 20px';
    showNotification('Message sent successfully!', 'success');
    
    // Reset form after 5 seconds
    setTimeout(() => {
      contactForm.style.display = 'block';
      formSuccess.style.display = 'none';
      contactForm.reset();
    }, 5000);
  }
}


// ==========================================
// 10. NEWSLETTER FORM
// ==========================================

const newsletterForm = document.getElementById('newsletterForm');

if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const emailInput = newsletterForm.querySelector('input[type="email"]');
    const email = emailInput?.value || '';

    if (!email) {
      showNotification('Please enter your email address', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showNotification('Please enter a valid email address', 'error');
      return;
    }

    // 🔄 CHANGE: Choose your newsletter option:
    
    // Option 1: Simple thank you (no actual subscription - for now)
    showNotification('Thank you for subscribing! 🎨', 'success');
    emailInput.value = '';

    // Option 2: Use Mailchimp (uncomment and add your form action URL)
    /*
    fetch('YOUR_MAILCHIMP_FORM_URL', {
      method: 'POST',
      body: new FormData(newsletterForm)
    });
    */
  });
}


// ==========================================
// 11. FAQ ACCORDION (Contact Page)
// ==========================================

const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');
  const icon = question?.querySelector('i');

  if (question && answer) {
    // Set initial state
    answer.style.maxHeight = '0';
    answer.style.overflow = 'hidden';
    answer.style.transition = 'max-height 0.3s ease, padding 0.3s ease';
    answer.style.padding = '0 20px';

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all other FAQ items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          const otherIcon = otherItem.querySelector('.faq-question i');
          if (otherAnswer) {
            otherAnswer.style.maxHeight = '0';
            otherAnswer.style.padding = '0 20px';
          }
          if (otherIcon) otherIcon.className = 'fas fa-plus';
        }
      });

      // Toggle current FAQ item
      if (isOpen) {
        item.classList.remove('active');
        answer.style.maxHeight = '0';
        answer.style.padding = '0 20px';
        if (icon) icon.className = 'fas fa-plus';
      } else {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 40 + 'px';
        answer.style.padding = '20px';
        if (icon) icon.className = 'fas fa-minus';
      }
    });
  }
});


// ==========================================
// 12. COUNTER ANIMATION (About Page Stats)
// ==========================================

const counters = document.querySelectorAll('.counter');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counter = entry.target;
      const target = parseInt(counter.getAttribute('data-target'));
      const duration = 2000; // 2 seconds
      const step = target / (duration / 16); // 60fps
      let current = 0;

      const updateCounter = () => {
        current += step;
        if (current < target) {
          counter.textContent = Math.floor(current);
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target + '+';
        }
      };

      updateCounter();
      counterObserver.unobserve(counter);
    }
  });
}, {
  threshold: 0.5
});

counters.forEach(counter => counterObserver.observe(counter));


// ==========================================
// 13. WISHLIST FUNCTIONALITY
// ==========================================

let wishlist = JSON.parse(localStorage.getItem('brushAndSoulWishlist')) || [];

document.querySelectorAll('.wishlist-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    
    const card = btn.closest('.product-card');
    const name = card?.getAttribute('data-name') || 'Item';
    const id = card?.querySelector('.add-to-cart-btn')?.getAttribute('data-id') || '';

    // Toggle wishlist
    const index = wishlist.indexOf(id);
    if (index > -1) {
      wishlist.splice(index, 1);
      btn.innerHTML = '<i class="fas fa-heart"></i>';
      btn.style.color = '';
      showNotification(`"${name}" removed from wishlist`, 'info');
    } else {
      wishlist.push(id);
      btn.innerHTML = '<i class="fas fa-heart"></i>';
      btn.style.color = '#e74c3c';
      showNotification(`"${name}" added to wishlist! ❤️`, 'success');
    }

    localStorage.setItem('brushAndSoulWishlist', JSON.stringify(wishlist));
  });
});

// Restore wishlist state on page load
function restoreWishlist() {
  document.querySelectorAll('.product-card').forEach(card => {
    const id = card.querySelector('.add-to-cart-btn')?.getAttribute('data-id') || '';
    const btn = card.querySelector('.wishlist-btn');
    if (wishlist.includes(id) && btn) {
      btn.style.color = '#e74c3c';
    }
  });
}
restoreWishlist();


// ==========================================
// 14. SMOOTH SCROLL FOR ANCHOR LINKS
// ==========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    e.preventDefault();
    const target = document.querySelector(targetId);
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});


// ==========================================
// 15. IMAGE LAZY LOADING
// ==========================================

// Add lazy loading to all images
document.querySelectorAll('img').forEach(img => {
  if (!img.hasAttribute('loading')) {
    img.setAttribute('loading', 'lazy');
  }
});


// ==========================================
// 16. BACK TO TOP BUTTON
// ==========================================

// Create back to top button
const backToTopBtn = document.createElement('button');
backToTopBtn.id = 'backToTop';
backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
backToTopBtn.style.cssText = `
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  background: var(--secondary-color, #b08968);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.1rem;
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 999;
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  transition: all 0.3s ease;
`;
document.body.appendChild(backToTopBtn);

// Show/hide based on scroll position
window.addEventListener('scroll', () => {
  if (window.scrollY > 500) {
    backToTopBtn.style.display = 'flex';
  } else {
    backToTopBtn.style.display = 'none';
  }
});

// Scroll to top on click
backToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// Hover effect
backToTopBtn.addEventListener('mouseenter', () => {
  backToTopBtn.style.background = '#1a1a1a';
  backToTopBtn.style.transform = 'translateY(-3px)';
});
backToTopBtn.addEventListener('mouseleave', () => {
  backToTopBtn.style.background = '#b08968';
  backToTopBtn.style.transform = 'translateY(0)';
});


// ==========================================
// 17. PAGE LOAD ANIMATION
// ==========================================

window.addEventListener('load', () => {
  document.body.classList.add('loaded');
  
  // Trigger hero animations if on home page
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    heroContent.style.opacity = '1';
  }
});


// ==========================================
// 18. QUICK VIEW (Shop Page)
// ==========================================

document.querySelectorAll('.quick-view-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    
    const card = btn.closest('.product-card');
    if (!card) return;

    const img = card.querySelector('.product-image img');
    const name = card.querySelector('.product-info h3')?.textContent || '';
    const medium = card.querySelector('.product-medium')?.textContent || '';
    const price = card.querySelector('.product-price')?.textContent || '';

    // Use lightbox for quick view
    if (lightbox && lightboxImg) {
      lightboxImages = [{
        src: img?.src || '',
        title: name,
        medium: medium,
        dimensions: price
      }];
      currentLightboxIndex = 0;
      openLightbox(lightboxImages[0]);
    }
  });
});


// ==========================================
// 19. CONSOLE WELCOME MESSAGE
// ==========================================

console.log(`
%c🎨 Brush & Soul
%cArtist Portfolio & Shop
%c─────────────────────────
Made with ❤️ for beautiful art
`, 
  'color: #b08968; font-size: 24px; font-weight: bold;',
  'color: #666; font-size: 14px;',
  'color: #ddd;'
);


// ==========================================
// 20. PREVENT RIGHT-CLICK ON IMAGES
//     (Protect artwork from easy downloading)
// ==========================================

// 🔄 CHANGE: Uncomment below if you want to protect images
/*
document.querySelectorAll('.gallery-item img, .work-card img, .product-image img').forEach(img => {
  img.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    showNotification('Images are protected. Please contact us for usage rights.', 'info');
  });
});
*/
