let siteContent = null;
let inventory = null;
const GAS_URL = 'https://script.google.com/macros/s/AKfycbzxrIZIiwYqpyWYO-4vBiLmtuVfT6KzlHPnqg2D3R6f1LNDwvOdbgwnbD5Ty3NxLB2i/exec'; 

async function init() {
    try {
        const [contentRes, inventoryRes] = await Promise.all([
            fetch('content.json'),
            fetch('inventory.json')
        ]);
        siteContent = await contentRes.json();
        inventory = await inventoryRes.json();

        renderInventory();
        setTheme('agency');
        setupForm();
    } catch (err) {
        console.error("Architect Error:", err);
    }
}

function renderInventory() {
    const productGrid = document.getElementById('product-grid');
    productGrid.innerHTML = inventory.products.map(p => `
        <div class="morph-card">
            <div class="visual-wrap"><img src="${p.img}" alt="${p.title}"></div>
            <div class="category-tag">${p.category}</div>
            <h3>${p.title}</h3>
            <div class="price">${p.price}</div>
            <p>${p.desc}</p>
            <a href="${p.stripe_url}" class="btn-buy">PURCHASE</a>
        </div>
    `).join('');

    const serviceGrid = document.getElementById('service-grid');
    serviceGrid.innerHTML = inventory.services.map(s => `
        <div class="morph-card">
            <h3>${s.title}</h3>
            <div class="price">${s.price}</div>
            <p>${s.desc}</p>
            <a href="#contact" class="btn-buy" style="background:transparent; border:1px solid var(--accent); color:white;">INQUIRE</a>
        </div>
    `).join('');
}

function setTheme(theme) {
    const t = siteContent.themes[theme];
    document.documentElement.setAttribute('data-theme', theme);
    document.getElementById('hero-surface').style.backgroundImage = `url('${t.hero}')`;
    document.getElementById('hero-title').innerHTML = t.title;
    
    document.querySelectorAll('.dock-buttons button').forEach(b => b.classList.remove('active'));
    document.getElementById('btn-' + theme).classList.add('active');
}

function setupForm() {
    document.getElementById('lead-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        btn.innerText = "TRANSMITTING...";

        const payload = {
            name: e.target.querySelectorAll('input')[0].value,
            email: e.target.querySelectorAll('input')[1].value,
            message: e.target.querySelector('textarea').value,
            subject: document.documentElement.getAttribute('data-theme').toUpperCase() + " Inquiry"
        };

        try {
            await fetch(GAS_URL, {
                method: 'POST',
                mode: 'no-cors',
                body: JSON.stringify(payload)
            });
            btn.innerText = "SUCCESSFUL";
            e.target.reset();
        } catch (err) {
            btn.innerText = "RETRY LATER";
        }
    });
}

window.onload = init;