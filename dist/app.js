"use strict";
// =========================================
// TIPAGEM DOS DADOS
// =========================================
// =========================================
// SELEÇÃO DOS ELEMENTOS DO DOM
// =========================================
// Seleciona o formulário
const form = document.querySelector("#formulario");
// Seleciona a lista de clientes
const listaClientes = document.querySelector("#listaClientes");
// Seleciona o campo de pesquisa
const inputPesquisa = document.querySelector("#inputPesquisa");
// Seleciona o botão de salvar
const btnSalvar = document.querySelector("#btnSalvar");
// Seleciona o botão de cancelar
const btnCancelar = document.querySelector("#btnCancelar");
// Seleciona o input de nome
const inputNome = document.querySelector("#nome");
// Seleciona o input de email
const inputEmail = document.querySelector("#email");
// Seleciona o input de telefone
const inputTelefone = document.querySelector("#telefone");
// =========================================
// ESTADO DA APLICAÇÃO
// =========================================
// Array principal de clientes
let clientes = [];
// Guarda o ID do cliente que está sendo editado
//
// null significa que nenhum cliente está sendo editado
let clienteEmEdicao = null;
// =========================================
// MÁSCARA DO TELEFONE
// =========================================
inputTelefone?.addEventListener("input", (evento) => {
    // Converte o elemento que disparou o evento
    // para um input HTML
    const input = evento.target;
    // Remove tudo que não for número
    let telefone = input.value.replace(/\D/g, "");
    // Limita o telefone a 11 números
    telefone = telefone.substring(0, 11);
    // Adiciona o DDD entre parênteses
    if (telefone.length > 2) {
        telefone = `(${telefone.substring(0, 2)}) ${telefone.substring(2)}`;
    }
    // Adiciona o hífen antes dos quatro últimos números
    if (telefone.length > 10) {
        telefone = telefone.replace(/(\(\d{2}\) \d{5})(\d{1,4})/, "$1-$2");
    }
    // Atualiza o valor do input
    input.value = telefone;
});
// =========================================
// SUBMIT DO FORMULÁRIO
// =========================================
form?.addEventListener("submit", (evento) => {
    // Impede o recarregamento da página
    evento.preventDefault();
    // Verifica se o formulário é válido
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    // Coleta os dados do formulário
    const dadosFormulario = new FormData(form);
    // Obtém os valores dos campos
    const nome = dadosFormulario.get("nome");
    const email = dadosFormulario.get("email");
    const telefone = dadosFormulario.get("telefone");
    // Se existir um cliente em edição,
    // atualiza esse cliente
    if (clienteEmEdicao !== null) {
        editarCliente(clienteEmEdicao, nome, email, telefone);
    }
    // Caso contrário,
    // adiciona um novo cliente
    else {
        adicionarCliente(nome, email, telefone);
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
    // Cria um novo cliente
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
    const cliente = clientes.find(cliente => cliente.id === id);
    // Se o cliente existir,
    // atualiza seus dados
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
    // Limpa a tabela
    listaClientes.innerHTML = "";
    // Obtém o texto digitado na pesquisa
    const termoPesquisa = inputPesquisa.value
        .trim()
        .toLowerCase();
    // Filtra os clientes pelo nome
    const clientesFiltrados = clientes.filter((cliente) => {
        return cliente.nome
            .toLowerCase()
            .includes(termoPesquisa);
    });
    // Cria uma linha para cada cliente
    clientesFiltrados.forEach((cliente) => {
        // Cria a linha
        const novaLinha = document.createElement("tr");
        // Cria a célula do ID
        const tdId = document.createElement("td");
        tdId.textContent = cliente.id.toString();
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
        // Adiciona as células à linha
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
    const cliente = clientes.find(cliente => cliente.id === id);
    // Se o cliente não existir,
    // interrompe a função
    if (!cliente) {
        return;
    }
    // Guarda o ID do cliente em edição
    clienteEmEdicao = id;
    // Preenche os campos do formulário
    inputNome.value = cliente.nome;
    inputEmail.value = cliente.email;
    inputTelefone.value = cliente.telefone;
    // Altera o texto do botão
    btnSalvar.textContent = "Salvar Alterações";
    // Mostra o botão cancelar
    btnCancelar.hidden = false;
    // Leva o usuário ao formulário
    form.scrollIntoView({
        behavior: "smooth"
    });
}
// =========================================
// EXCLUIR CLIENTE
// =========================================
function excluirCliente(id) {
    // Solicita confirmação
    const confirmou = confirm("Deseja realmente excluir este cliente?");
    // Se o usuário cancelar,
    // interrompe a função
    if (!confirmou) {
        return;
    }
    // Localiza a posição do cliente
    const indiceCliente = clientes.findIndex((cliente) => {
        return cliente.id === id;
    });
    // Verifica se o cliente foi encontrado
    if (indiceCliente === -1) {
        return;
    }
    // Remove o cliente
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
btnCancelar?.addEventListener("click", () => {
    limparFormulario();
});
// =========================================
// LIMPAR FORMULÁRIO
// =========================================
function limparFormulario() {
    // Limpa os campos
    form.reset();
    // Sai do modo de edição
    clienteEmEdicao = null;
    // Volta o texto original do botão
    btnSalvar.textContent = "Salvar Cliente";
    // Esconde o botão de cancelar
    btnCancelar.hidden = true;
}
// =========================================
// PESQUISA POR NOME
// =========================================
inputPesquisa?.addEventListener("input", () => {
    // Renderiza a lista novamente
    renderizarClientes();
});
