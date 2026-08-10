// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Smooth scrolling
document.querySelectorAll('a[href^=\"#\"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.query.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        if (navLinks) navLinks.classList.remove('active');
    });
});

// Service cards - Each opens dedicated page
document.querySelectorAll('.service-card').forEach((card, index) => {
    card.style.cursor = 'pointer';
    card.addEventListener('mouseenter', () => card.style.transform = 'translateY(-15px)');
    card.addEventListener('mouseleave', () => card.style.transform = 'translateY(0)');
    
    card.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const h3Text = card.querySelector('h3')?.textContent?.toLowerCase() || '';
        
        if (h3Text.includes('flight') || h3Text.includes('jet') || h3Text.includes('charter') || h3Text.includes('फ्लाइट')) window.location.href = 'flights.html';
        else if (h3Text.includes('hotel') || h3Text.includes('propert') || h3Text.includes('होटल')) window.location.href = 'hotels.html';
        else if (h3Text.includes('itinerar') || h3Text.includes('plan') || h3Text.includes('योजना')) window.location.href = 'travel-plan.html';
        else if (h3Text.includes('support') || h3Text.includes('butler') || h3Text.includes('service') || h3Text.includes('सपोर्ट')) window.location.href = 'support.html';
    });
});

// Destination cards - Each opens dedicated destination page
document.querySelectorAll('.dest-card').forEach((card, index) => {
    card.style.cursor = 'pointer';
    card.addEventListener('mouseenter', () => card.style.transform = 'scale(1.05)');
    card.addEventListener('mouseleave', () => card.style.transform = 'scale(1)');
    
    card.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const info = card.querySelector('.dest-info h3')?.textContent?.toLowerCase() || '';
        
        if (info.includes('europe') || info.includes('यूरोप')) window.location.href = 'europe.html';
        else if (info.includes('asia') || info.includes('एशिया')) window.location.href = 'asia.html';
        else if (info.includes('america') || info.includes('अमेरिका')) window.location.href = 'america.html';
        else if (info.includes('africa') || info.includes('अफ्रीका')) window.location.href = 'africa.html';
    });
});

// Hero parallax
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    document.querySelector('.hero')?.style.setProperty('transform', `translateY(${scrolled * 0.5}px)`);
});

// Form submission — sends data to backend API
document.querySelector('.contact-form')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const button = this.querySelector('button[type="submit"]');
    const original = button.innerHTML;
    button.textContent = 'भेज रहे हैं...';
    button.disabled = true;

    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    try {
        const res = await fetch('/api/customers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await res.json();
        if (res.ok) {
            alert('✅ Request भेज दिया! 24 घंटे में call करेंगे।');
            this.reset();
        } else {
            alert('❌ Error: ' + (result.error || 'Kuch galat ho gaya'));
        }
    } catch (err) {
        alert('❌ Server se connect nahi ho paaya. Kya aapne `node server.js` run kiya hai?');
        console.error(err);
    } finally {
        button.innerHTML = original;
        button.disabled = false;
    }
});

console.log('✅ International Travel - All services + destinations clicks working perfectly!');

