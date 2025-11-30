// ESTADO GLOBAL

// Tenta pegar do LocalStorage primeiro
const savedTransactions = localStorage.getItem('transactions');

// Se tiver dados salvos, usa eles. Se não, usa o Mock. Se o Mock falhar, usa vazio.
let currentTransactions = savedTransactions 
    ? JSON.parse(savedTransactions) 
    : (typeof transactionsMock !== 'undefined' ? [...transactionsMock] : []);

// SELETORES DO DOM

const LIST_ELEMENT = document.getElementById('transactions-list');
const THEME_SWITCHER_BTN = document.getElementById('theme-switcher');
const FORM = document.getElementById('transaction-form');
const SEARCH_INPUT = document.getElementById('search-filter');
const SORT_SELECT = document.getElementById('sort-order');
const BALANCE_ELEMENT = document.getElementById('total-balance');

// FUNÇÕES AUXILIARES 

/**
 * Formata um valor numérico para o padrão de moeda Real Brasileiro (BRL).
 * @param {number} value - O valor a ser formatado.
 * @returns {string} String formatada (ex: R$ 1.500,00).
 */
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

/**
 * Formata uma string de data (YYYY-MM-DD) para o padrão brasileiro (DD/MM/YYYY).
 * @param {Date} dateString - A data a ser formatada.
 * @returns {Date} A data formata (DD/MM/YYYY)
 */
function formatDate(dateString) {
    if(!dateString) return 'Data Inválida'; 
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}

/**
 * Limpa a lista atual e renderiza os itens recebidos no HTML.
 */
function renderList(transactions) {
    LIST_ELEMENT.innerHTML = '';

    transactions.forEach(transaction => {
        const li = document.createElement('li');
        li.classList.add('transaction-item', transaction.type);

        // Criei uma div 'right-side' para agrupar Valor e Botão
        li.innerHTML = `
            <div class="transaction-info">
                <h3>${transaction.description}</h3>
                <p>${formatDate(transaction.date)}</p>
            </div>
            
            <div class="right-side">
                <div class="transaction-amount">
                    ${transaction.type === 'expense' ? '-' : '+'} 
                    ${formatCurrency(transaction.amount)}
                </div>
                <button class="delete-btn" data-id="${transaction.id}" aria-label="Excluir Transação">
                    &times;
                </button>
            </div>
        `;

        LIST_ELEMENT.appendChild(li);
    });
}

/**
 * Filtra e Ordena antes de renderizar.
 * Deve ser usada sempre que os dados mudarem ou o usuário filtrar.
 */
function updateList() {
    // Pegar os valores dos inputs
    const searchTerm = SEARCH_INPUT.value.toLowerCase();
    const sortType = SORT_SELECT.value;

    // Filtra
    let filteredTransactions = currentTransactions.filter(transaction => {
        const description = transaction.description.toLowerCase();
        return description.includes(searchTerm);
    });

    // Ordena
    filteredTransactions.sort((a, b) => {
        if (sortType === 'date-desc') return new Date(b.date) - new Date(a.date);
        if (sortType === 'date-asc') return new Date(a.date) - new Date(b.date);
        if (sortType === 'amount-desc') return b.amount - a.amount;
        if (sortType === 'amount-asc') return a.amount - b.amount;
    });

    // Renderizar a lista final processada
    renderList(filteredTransactions);
}

function updateBalance() {
    // A função 'reduce' percorre o array acumulando um valor único
    const total = currentTransactions.reduce((acc, transaction) => {
        if (transaction.type === 'income') {
            return acc + transaction.amount;
        } else {
            return acc - transaction.amount;
        }
    }, 0); // O '0' é o valor inicial do acumulador

    // Atualiza o texto na tela
    BALANCE_ELEMENT.innerText = formatCurrency(total);

    // Remove as cores antigas
    BALANCE_ELEMENT.classList.remove('positive', 'negative');

    // Adiciona a cor certa (Verde se >= 0, Vermelho se < 0)
    if (total >= 0) {
        BALANCE_ELEMENT.classList.add('positive');
    } else {
        BALANCE_ELEMENT.classList.add('negative');
    }
}

/**
 * Salva a lista atual no LocalStorage para não perder ao recarregar.
 */
function saveToLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(currentTransactions));
}

// EVENTOS

FORM.addEventListener('submit', (event) => {
    event.preventDefault(); // Impede o reload da página

    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const date = document.getElementById('date').value;
    const type = document.getElementById('type').value;

    if (amount <= 0) {
        alert('O valor deve ser maior que zero!');
        return;
    }

    const newTransaction = {
        id: Date.now(),
        description: description,
        amount: amount,
        date: date,
        type: type
    };

    currentTransactions.push(newTransaction);

    // Chamamos updateList() em vez de renderList() direto.
    // Assim, se houver um filtro ativo, ele é respeitado.
    updateList();
    
    // Depois de cada submissão de Nova transação
    // eu recalculo o extrato
    updateBalance();

    // Salvando dados no localStorage
    saveToLocalStorage();

    FORM.reset();
});

// FUNÇÃO DE EXCLUIR

LIST_ELEMENT.addEventListener('click', (event) => {
    // Verificamos se o elemento clicado (ou o pai dele) tem a classe 'delete-btn'
    const deleteButton = event.target.closest('.delete-btn');

    // Se não clicou no botão, não faz nada
    if (!deleteButton) return;

    // 1. Pegar o ID que escondemos no atributo data-id
    const idToDelete = Number(deleteButton.dataset.id);

    // 2. Perguntar se tem certeza (Opcional, mas boa prática)
    const confirmDelete = confirm('Tem certeza que deseja excluir esta transação?');
    if (!confirmDelete) return;

    // 3. Filtrar a lista GLOBAL removendo o item com esse ID
    currentTransactions = currentTransactions.filter(transaction => {
        return transaction.id !== idToDelete;
    });

    // 4. Atualizar a tela e o saldo
    updateList();    // Redesenha a lista sem o item
    updateBalance(); // Recalcula o total
    saveToLocalStorage(); // Salvando dados no localStorage
});

// Filtros e Ordenação
SEARCH_INPUT.addEventListener('input', updateList);
SORT_SELECT.addEventListener('change', updateList);

// Verificar se já existe um tema salvo
const savedTheme = localStorage.getItem('theme');

// Se o tema salvo for 'dark', ativa ele imediatamente
if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
}

// Tema Dark/Light
if (THEME_SWITCHER_BTN) {
    THEME_SWITCHER_BTN.addEventListener('click', () => {
        // Alterna a classe no body
        document.body.classList.toggle('dark-mode');

        // Verifica se ficou escuro ou claro
        const isDark = document.body.classList.contains('dark-mode');

        // Salva a preferência no navegador
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

// INICIALIZAÇÃO

/**
 * Função de inicialização da aplicação. A "main"
 */
function init() {
    updateList();
    updateBalance();
}

// Inicia a aplicação
init();
