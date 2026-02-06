const totalRecibos = 5;

// Inicializa o sistema ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    initInterface();
    registerServiceWorker();
});

function initInterface() {
    const formContainer = document.getElementById('formContainer');
    const folhaA4 = document.getElementById('folhaA4');

    for (let i = 1; i <= totalRecibos; i++) {
        // 1. Gera o HTML dos Inputs
        const inputHtml = `
            <div class="card-input">
                <div class="card-title">Recibo #${i}</div>
                <div class="input-row">
                    <div style="flex:3">
                        <label>DESTINATÁRIO</label>
                        <input type="text" oninput="updateRecibo(${i}, 'dest', this.value)" placeholder="Nome do destinatário...">
                    </div>
                    <div style="flex:1">
                        <label>Nº / VALOR</label>
                        <input type="text" oninput="updateRecibo(${i}, 'num', this.value)" placeholder="00${i}">
                    </div>
                </div>
                <div>
                    <label>DISCRIMINAÇÃO</label>
                    <textarea oninput="updateRecibo(${i}, 'disc', this.value)" placeholder="Descrição..."></textarea>
                </div>
            </div>`;
        
        formContainer.insertAdjacentHTML('beforeend', inputHtml);

        // 2. Gera o HTML do Preview (Papel)
        const previewHtml = `
            <div class="recibo">
                <div class="recibo-header">
                    <div style="width: 75%;">
                        <span class="label-print">Destinatário</span>
                        <div class="dados-print" id="v-dest-${i}"></div>
                    </div>
                    <div style="width: 20%;">
                        <span class="label-print">Nº</span>
                        <div class="dados-print" id="v-num-${i}"></div>
                    </div>
                </div>
                <span class="label-print" style="margin-top:5px; border-bottom:1px solid #000; display:block;">Discriminação</span>
                <div class="disc-area">
                    <div class="linhas-bg"></div>
                    <div class="texto-print" id="v-disc-${i}"></div>
                </div>
            </div>`;
        
        folhaA4.insertAdjacentHTML('beforeend', previewHtml);
    }
}

// Função chamada a cada digitação
window.updateRecibo = function(id, type, val) {
    const el = document.getElementById(`v-${type}-${id}`);
    if(el) el.innerText = val;
};

// --- LÓGICA PWA ---

// Registrar Service Worker
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('SW registrado', reg))
            .catch(err => console.log('Erro SW', err));
    }
}

// Botão de Instalação
let deferredPrompt;
const btnInstall = document.getElementById('btnInstall');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    btnInstall.hidden = false; // Mostra o botão
    
    btnInstall.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                btnInstall.hidden = true;
            }
            deferredPrompt = null;
        }
    });
});