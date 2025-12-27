let globalData = null;

async function init() {
    try {
        const res = await fetch('content.json');
        globalData = await res.json();
        renderProducts();
        renderServices();
        setTheme('agency');
    } catch (err) {
        console.error("Initialization failed:", err);
    }
}

function renderProducts() {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = globalData.products.map(p => `
        <div class="morph-card">
            <div class="visual-wrap"><img src="${p.img}" alt="${p.title}"></div>
            <h3>${p.title}</h3>
            <div class="price">${p.price}</div>
            <p>${p.desc}</p>
            <a href="${p.stripe_url}" class="btn-buy">PURCHASE</a>
        </div>
    `).join('');
}

function renderServices() {
    const grid = document.getElementById('service-grid');
    grid.innerHTML = globalData.services.map(s => `
        <div class="morph-card">
            <h3>${s.title}</h3>
            <div class="price">${s.price}</div>
            <p>${s.desc}</p>
            <a href="#contact" class="btn-buy" style="background:transparent; border:1px solid var(--accent); color:white;">INQUIRE</a>
        </div>
    `).join('');
}

function setTheme(theme) {
    const t = globalData.themes[theme];
    document.documentElement.setAttribute('data-theme', theme);
    document.getElementById('hero-surface').style.backgroundImage = `url('${t.hero}')`;
    
    // Update active button
    document.querySelectorAll('.dock-buttons button').forEach(b => b.classList.remove('active'));
    const activeBtn = document.getElementById('btn-' + theme);
    if(activeBtn) activeBtn.classList.add('active');
}

window.onload = init;