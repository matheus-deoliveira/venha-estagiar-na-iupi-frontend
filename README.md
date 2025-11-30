# Controle de Despesas - Desafio Frontend (IUPI)

Este repositório contém a minha solução para o desafio de estágio Frontend. O objetivo foi construir uma aplicação de controle financeiro robusta utilizando apenas HTML, CSS e JavaScript puro, sem a utilização de frameworks, para demonstrar domínio dos fundamentos da web.

## A Abordagem de Desenvolvimento

O desenvolvimento não foi linear; foi um processo iterativo. Minha prioridade foi criar um código legível, manutenível e que proporcionasse uma boa experiência de usuário (UX).

### Renderização e Formatação

Comecei definindo o esqueleto da aplicação. Decidi separar a tela em duas grandes áreas lógicas: o Formulário de Inserção e o Extrato.

* Utilizei tags semânticas (`<header>`, `<main>`, `<section>`) para garantir acessibilidade e boa estrutura.

* Optei por `input type="number"` e `date` para aproveitar as validações nativas do navegador, mas precisei estilizá-los depois para manter a consistência visual.

### Estilização e Tema Dinâmico

Sabendo que o requisito de Dark Mode era obrigatório, tomei a decisão arquitetural de iniciar o CSS baseando-me em Variáveis CSS (`:root`).

* Isso permitiu que alternar entre os temas fosse feita apenas trocando uma classe no body, sem precisar reescrever CSS.

* Percebi que os inputs nativos (como o calendário) ficavam invisíveis no fundo escuro. Então apliquei um `filter: invert(1)` condicional no ícone do calendário para ele se adaptar ao fundo escuro.

* Também removi os "spin buttons" (setas) do input de número para um visual mais limpo.

### Lógica do JavaScript

* Ao invés de manipular o DOM diretamente o tempo todo, criei uma variável de estado `currentTransactions`. Toda alteração (adicionar, remover) ocorre nesse array, e a tela é um reflexo desse estado (`renderList`).

* Inicialmente, tentei usar ES Modules (import/export), mas encontrei dificuldades com o escopo global e o carregamento do Mock. Mas simplifiquei a arquitetura removendo o `type="module"` e tratando o Mock como um script carregado previamente. Isso resolveu os erros de inicialização e garantiu que o script principal tivesse acesso aos dados.

* Para evitar algumas gambiarras com strings, utilizei a API nativa `Intl.NumberFormat` apra formatar a moeda (BRL) e manipulaçao de strings para a data.

### Interatividade e Refino

Durante os testes manuais, notei comportamentos que precisavam de ajustes:

* Ao dar Enviar o formulário, a página recarregava e o tema voltava para o branco. Para solucionar implementei o `event.preventDefault()` no submit do formulário apra transformar a aplicação em uma SPA (Single Page Application) real, mantendo o estado e o tema.

* Criei uma função unificada `updateList()` que aplica o filtro de texte e a ordenação antes de renderizar. Isso evita bugs onde adicionar um item ignorava o filtro ativo.

### Funcionalidades Extras

Para garantir algo além do básico também implementei:

* Cálculo de Saldo: usei o método `.reduce()` do array para calcular o total a cada atualização.

* Exclusão com Event Delegation: ao invés de colocar um listener em cada botão "X", coloquei um único listener na lista `<ul>` que detecta cliques nos botões de excluir.

* LocalStorage: implementei persistência tanto para as transações quanto para o tema escolhido pelo usuário.

## Tecnologias Utilizadas

* HTML5: Semântico e acessível.

* CSS3: Flexbox, Media Queries, Variáveis CSS (Custom Properties) e Transições.

* JavaScript: Arrow functions, filter, map, reduce, localStorage e manipulação de DOM.

## Como Rodar o Projeto

1. Clone o repositório.

2. Abra o arquivo `index.html` no seu naveghador

3. Recomendado: Utilize a extensão "Live Server" do VS Code para uma melhor experiência.