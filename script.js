document.addEventListener('DOMContentLoaded', () => {
    
    // --- State Management ---
    const state = {
        user: null,
        vault: [],
        proofsCount: 0
    };

    // --- DOM Elements ---
    const views = {
        auth: document.getElementById('auth-interface'),
        dash: document.getElementById('dashboard-interface')
    };

    const inputs = {
        username: document.getElementById('username'),
        password: document.getElementById('password'),
        file: document.getElementById('data-file'),
        passphrase: document.getElementById('passphrase'),
        anon: document.getElementById('policy-anon')
    };

    const display = {
        totalPods: document.getElementById('total-pods'),
        ledgerBody: document.querySelector('#ledger-table tbody'),
        authStatus: document.getElementById('auth-status')
    };

    // --- Utility Functions ---

    // Simulate SHA-256 Hashing for visual effect
    async function mockHash(str) {
        const msgBuffer = new TextEncoder().encode(str + Date.now());
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    function switchView(viewName) {
        Object.values(views).forEach(el => el.style.display = 'none');
        views[viewName].style.display = 'block';
        if(viewName === 'dash') {
            views[viewName].style.animation = 'fadeIn 0.5s ease';
        }
    }

    // --- Event Listeners ---

    // 1. Authentication
    document.getElementById('login-btn').addEventListener('click', () => {
        if(inputs.username.value && inputs.password.value) {
            state.user = inputs.username.value;
            display.authStatus.innerText = "> AUTHENTICATING...";
            display.authStatus.style.color = "var(--secondary)";
            
            setTimeout(() => {
                switchView('dash');
            }, 800);
        } else {
            display.authStatus.innerText = "> ERROR: CREDENTIALS MISSING";
            display.authStatus.style.color = "#FF5F56";
        }
    });

    document.getElementById('logout-btn').addEventListener('click', () => {
        state.user = null;
        inputs.password.value = '';
        switchView('auth');
    });

    // 2. Deposit Logic
    document.getElementById('deposit-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const file = inputs.file.files[0];
        const pass = inputs.passphrase.value;

        if(!file) {
            alert("Please select a file to deposit.");
            return;
        }

        // Simulate Processing
        const submitBtn = e.target.querySelector('button');
        const originalText = submitBtn.innerText;
        submitBtn.innerText = "ENCRYPTING...";
        submitBtn.disabled = true;

        // Generate Hash
        const hash = await mockHash(file.name);
        
        // Add to State
        const entry = {
            id: `FILE_${Math.floor(Math.random() * 10000)}`,
            name: file.name,
            timestamp: new Date().toISOString().split('T')[0],
            hash: hash.substring(0, 20) + '...',
            policy: inputs.anon.value.toUpperCase()
        };

        state.vault.unshift(entry);
        state.proofsCount++;

        // Update UI
        setTimeout(() => {
            renderLedger();
            display.totalPods.innerText = state.proofsCount;
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
            inputs.file.value = ''; // Reset file input
            inputs.passphrase.value = '';
        }, 1500);
    });

    // --- Rendering ---
    function renderLedger() {
        display.ledgerBody.innerHTML = '';
        state.vault.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.id}</td>
                <td>${row.timestamp}</td>
                <td style="font-family: monospace; color: var(--secondary)">${row.hash}</td>
                <td><span class="badge">${row.policy}</span></td>
            `;
            display.ledgerBody.appendChild(tr);
        });
    }
});
