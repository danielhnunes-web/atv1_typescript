// =========================================
// SELEÇÃO DOS ELEMENTOS DO DOM
// =========================================

const form = document.querySelector("#formulario");

const listaClientes = document.querySelector("#listaClientes");

const inputPesquisa = document.querySelector("#inputPesquisa");

const btnSalvar = document.querySelector("#btnSalvar");

const btnCancelar = document.querySelector("#btnCancelar");

const inputNome = document.querySelector("#nome");

const inputEmail = document.querySelector("#email");

const inputTelefone = document.querySelector("#telefone");


// =========================================
// ESTADO DA APLICAÇÃO
// =========================================

// Array principal de clientes
let clientes = [];


// Guarda o ID do cliente que está sendo editado
// null significa que nenhum cliente está sendo editado
let clienteEmEdicao = null;


// =========================================
// MÁSCARA DO TELEFONE
// =========================================

// Formata automaticamente o telefone
//
// Exemplo:
//
// 79912345678
//
// vira:
//
// (79) 91234-5678

inputTelefone.addEventListener("input", (evento) => {

    let telefone = evento.target.value;

    // Remove tudo que não for número
    telefone = telefone.replace(/\D/g, "");

    // Limita o telefone a 11 números
    telefone = telefone.substring(0, 11);

    // Adiciona o DDD entre parênteses
    if (telefone.length > 2) {

        telefone = `(${telefone.substring(0, 2)}) ${telefone.substring(2)}`;

    }

    // Adiciona o hífen antes dos quatro últimos números
    if (telefone.length > 10) {

        telefone = telefone.replace(
            /(\(\d{2}\) \d{5})(\d{1,4})/,
            "$1-$2"
        );

    }

    // Atualiza o valor do input
    evento.target.value = telefone;

});


// =========================================
// SUBMIT DO FORMULÁRIO
// =========================================

form.addEventListener("submit", (evento) => {

    // Impede o recarregamento da página
    evento.preventDefault();


    // Verifica se todos os campos são válidos
    if (!form.checkValidity()) {

        form.reportValidity();

        return;

    }


    // Coleta os dados do formulário
    const dadosFormulario = new FormData(form);


    const nome = dadosFormulario.get("nome");

    const email = dadosFormulario.get("email");

    const telefone = dadosFormulario.get("telefone");


    // Se houver um cliente em edição,
    // atualiza os dados desse cliente
    if (clienteEmEdicao !== null) {

        editarCliente(
            clienteEmEdicao,
            nome,
            email,
            telefone
        );

    }

    // Caso contrário,
    // cria um novo cliente
    else {

        adicionarCliente(
            nome,
            email,
            telefone
        );

    }


    // Limpa o formulário
    limparFormulario();


    // Atualiza a tabela
    renderizarClientes();

});


// =========================================
// ADICIONAR CLIENTE
// =========================================

function adicionarCliente(nome, email, telefone) {

    // Cria um novo objeto de cliente
    const novoCliente = {

        id: clientes.length + 1,

        nome: nome,

        email: email,

        telefone: telefone

    };


    // Adiciona o cliente ao array
    clientes.push(novoCliente);

}


// =========================================
// EDITAR CLIENTE
// =========================================

function editarCliente(id, nome, email, telefone) {

    // Procura o cliente pelo ID
    const cliente = clientes.find(
        cliente => cliente.id === id
    );


    // Se o cliente for encontrado,
    // atualiza apenas os dados editáveis
    if (cliente) {

        cliente.nome = nome;

        cliente.email = email;

        cliente.telefone = telefone;

    }

}


// =========================================
// RENDERIZAR CLIENTES
// =========================================

function renderizarClientes() {

    // Limpa a tabela antes de renderizar novamente
    listaClientes.innerHTML = "";


    // Obtém o texto digitado na pesquisa
    const termoPesquisa = inputPesquisa.value
        .trim()
        .toLowerCase();


    // Filtra os clientes pelo nome
    const clientesFiltrados = clientes.filter(cliente => {

        return cliente.nome
            .toLowerCase()
            .includes(termoPesquisa);

    });


    // Cria uma linha para cada cliente
    clientesFiltrados.forEach(cliente => {

        const novaLinha = document.createElement("tr");


        // Cria a célula do ID
        const tdId = document.createElement("td");

        tdId.textContent = cliente.id;


        // Cria a célula do nome
        const tdNome = document.createElement("td");

        tdNome.textContent = cliente.nome;


        // Cria a célula do email
        const tdEmail = document.createElement("td");

        tdEmail.textContent = cliente.email;


        // Cria a célula do telefone
        const tdTelefone = document.createElement("td");

        tdTelefone.textContent = cliente.telefone;


        // Cria a célula das ações
        const tdAcoes = document.createElement("td");


        // Cria o botão de editar
        const btnEditar = document.createElement("button");

        btnEditar.textContent = "Editar";

        btnEditar.classList.add("btn-editar");


        // Evento do botão editar
        btnEditar.addEventListener("click", () => {

            iniciarEdicao(cliente.id);

        });


        // Cria o botão de excluir
        const btnExcluir = document.createElement("button");

        btnExcluir.textContent = "Excluir";

        btnExcluir.classList.add("btn-excluir");


        // Evento do botão excluir
        btnExcluir.addEventListener("click", () => {

            excluirCliente(cliente.id);

        });


        // Adiciona os botões à célula de ações
        tdAcoes.appendChild(btnEditar);

        tdAcoes.appendChild(btnExcluir);


        // Adiciona todas as células à linha
        novaLinha.appendChild(tdId);

        novaLinha.appendChild(tdNome);

        novaLinha.appendChild(tdEmail);

        novaLinha.appendChild(tdTelefone);

        novaLinha.appendChild(tdAcoes);


        // Adiciona a linha à tabela
        listaClientes.appendChild(novaLinha);

    });

}


// =========================================
// INICIAR EDIÇÃO
// =========================================

function iniciarEdicao(id) {

    // Procura o cliente pelo ID
    const cliente = clientes.find(
        cliente => cliente.id === id
    );


    // Se o cliente não existir,
    // interrompe a função
    if (!cliente) {

        return;

    }


    // Guarda o ID do cliente que está sendo editado
    clienteEmEdicao = id;


    // Preenche o formulário com os dados atuais
    inputNome.value = cliente.nome;

    inputEmail.value = cliente.email;

    inputTelefone.value = cliente.telefone;


    // Altera o texto do botão principal
    btnSalvar.textContent = "Salvar Alterações";


    // Mostra o botão de cancelar
    btnCancelar.hidden = false;


    // Leva o usuário até o formulário
    form.scrollIntoView({

        behavior: "smooth"

    });

}


// =========================================
// EXCLUIR CLIENTE
// =========================================

function excluirCliente(id) {

    // Solicita confirmação antes da exclusão
    const confirmou = confirm(
        "Deseja realmente excluir este cliente?"
    );


    // Se o usuário cancelar,
    // interrompe a função
    if (!confirmou) {

        return;

    }


    // Localiza a posição do cliente no array
    const indiceCliente = clientes.findIndex(

        cliente => cliente.id === id

    );


    // Remove o cliente do array
    clientes.splice(indiceCliente, 1);


    // Reorganiza os IDs
    clientes.forEach((cliente, indice) => {

        cliente.id = indice + 1;

    });


    // Atualiza a tabela
    renderizarClientes();

}


// =========================================
// CANCELAR EDIÇÃO
// =========================================

btnCancelar.addEventListener("click", () => {

    limparFormulario();

});


// =========================================
// LIMPAR FORMULÁRIO
// =========================================

function limparFormulario() {

    // Limpa os campos do formulário
    form.reset();


    // Sai do modo de edição
    clienteEmEdicao = null;


    // Volta o botão ao estado original
    btnSalvar.textContent = "Salvar Cliente";


    // Esconde o botão de cancelar
    btnCancelar.hidden = true;

}


// =========================================
// PESQUISA POR NOME
// =========================================

inputPesquisa.addEventListener("input", () => {

    // Renderiza novamente a lista
    // conforme o texto digitado
    renderizarClientes();

});