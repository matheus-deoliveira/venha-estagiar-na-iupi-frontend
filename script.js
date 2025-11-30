// ESTADO GLOBAL

// Usamos 'transactionsMock' que vem do arquivo mock/transactions.js
// Se o mock não estiver carregando, usamos um array vazio [] para não quebrar.
let currentTransactions = (typeof transactionsMock !== 'undefined') ? [...transactionsMock] : [];


// SELETORES DO DOM

const LIST_ELEMENT = document.getElementById('transactions-list');
const THEME_SWITCHER_BTN = document.getElementById('theme-switcher');
const FORM = document.getElementById('transaction-form');
const SEARCH_INPUT = document.getElementById('search-filter');
const SORT_SELECT = document.getElementById('sort-order');

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
        
        // Adiciona classes para estilo (income/expense)
        li.classList.add('transaction-item', transaction.type);

        li.innerHTML = `
            <div class="transaction-info">
                <h3>${transaction.description}</h3>
                <p>${formatDate(transaction.date)}</p>
            </div>
            <div class="transaction-amount">
                ${transaction.type === 'expense' ? '-' : '+'} 
                ${formatCurrency(transaction.amount)}
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

    FORM.reset();
});

// Filtros e Ordenação
SEARCH_INPUT.addEventListener('input', updateList);
SORT_SELECT.addEventListener('change', updateList);

// Tema Dark/Light
if (THEME_SWITCHER_BTN) {
    THEME_SWITCHER_BTN.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });
}

// INICIALIZAÇÃO

/**
 * Função de inicialização da aplicação. A "main"
 */
function init() {
    updateList();
}

// Inicia a aplicação
init();
