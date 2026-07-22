// =========================================
// TIPAGEM DOS DADOS
// =========================================

// Define o formato de cada cliente
interface Cliente {

    id: number;

    nome: string;

    email: string;

    telefone: string;

}


// =========================================
// SELEÇÃO DOS ELEMENTOS DO DOM
// =========================================

// Seleciona o formulário
const form = document.querySelector<HTMLFormElement>("#formulario");

// Seleciona a lista de clientes
const listaClientes = document.querySelector<HTMLTableSectionElement>(
    "#listaClientes"
);

// Seleciona o campo de pesquisa
const inputPesquisa = document.querySelector<HTMLInputElement>(
    "#inputPesquisa"
);

// Seleciona o botão de salvar
const btnSalvar = document.querySelector<HTMLButtonElement>(
    "#btnSalvar"
);

// Seleciona o botão de cancelar
const btnCancelar = document.querySelector<HTMLButtonElement>(
    "#btnCancelar"
);

// Seleciona o input de nome
const inputNome = document.querySelector<HTMLInputElement>(
    "#nome"
);

// Seleciona o input de email
const inputEmail = document.querySelector<HTMLInputElement>(
    "#email"
);

// Seleciona o input de telefone
const inputTelefone = document.querySelector<HTMLInputElement>(
    "#telefone"
);


// =========================================
// ESTADO DA APLICAÇÃO
// =========================================

// Array principal de clientes
let clientes: Cliente[] = [];


// Guarda o ID do cliente que está sendo editado
//
// null significa que nenhum cliente está sendo editado
let clienteEmEdicao: number | null = null;


// =========================================
// MÁSCARA DO TELEFONE
// =========================================

inputTelefone?.addEventListener("input", (evento: Event) => {

    // Converte o elemento que disparou o evento
    // para um input HTML
    const input = evento.target as HTMLInputElement;


    // Remove tudo que não for número
    let telefone: string = input.value.replace(/\D/g, "");


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
    input.value = telefone;

});


// =========================================
// SUBMIT DO FORMULÁRIO
// =========================================

form?.addEventListener("submit", (evento: SubmitEvent) => {

    // Impede o recarregamento da página
    evento.preventDefault();


    // Verifica se o formulário é válido
    if (!form.checkValidity()) {

        form.reportValidity();

        return;

    }


    // Coleta os dados do formulário
    const dadosFormulario: FormData = new FormData(form);


    // Obtém os valores dos campos
    const nome = dadosFormulario.get("nome") as string;

    const email = dadosFormulario.get("email") as string;

    const telefone = dadosFormulario.get("telefone") as string;


    // Se existir um cliente em edição,
    // atualiza esse cliente
    if (clienteEmEdicao !== null) {

        editarCliente(
            clienteEmEdicao,
            nome,
            email,
            telefone
        );

    }


    // Caso contrário,
    // adiciona um novo cliente
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

function adicionarCliente(
    nome: string,
    email: string,
    telefone: string
): void {

    // Cria um novo cliente
    const novoCliente: Cliente = {

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

function editarCliente(
    id: number,
    nome: string,
    email: string,
    telefone: string
): void {

    // Procura o cliente pelo ID
    const cliente: Cliente | undefined = clientes.find(

        cliente => cliente.id === id

    );


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

function renderizarClientes(): void {

    // Limpa a tabela
    listaClientes!.innerHTML = "";


    // Obtém o texto digitado na pesquisa
    const termoPesquisa: string = inputPesquisa!.value
        .trim()
        .toLowerCase();


    // Filtra os clientes pelo nome
    const clientesFiltrados: Cliente[] = clientes.filter(

        (cliente: Cliente): boolean => {

            return cliente.nome
                .toLowerCase()
                .includes(termoPesquisa);

        }

    );


    // Cria uma linha para cada cliente
    clientesFiltrados.forEach((cliente: Cliente) => {

        // Cria a linha
        const novaLinha: HTMLTableRowElement =
            document.createElement("tr");


        // Cria a célula do ID
        const tdId: HTMLTableCellElement =
            document.createElement("td");

        tdId.textContent = cliente.id.toString();


        // Cria a célula do nome
        const tdNome: HTMLTableCellElement =
            document.createElement("td");

        tdNome.textContent = cliente.nome;


        // Cria a célula do email
        const tdEmail: HTMLTableCellElement =
            document.createElement("td");

        tdEmail.textContent = cliente.email;


        // Cria a célula do telefone
        const tdTelefone: HTMLTableCellElement =
            document.createElement("td");

        tdTelefone.textContent = cliente.telefone;


        // Cria a célula das ações
        const tdAcoes: HTMLTableCellElement =
            document.createElement("td");


        // Cria o botão de editar
        const btnEditar: HTMLButtonElement =
            document.createElement("button");

        btnEditar.textContent = "Editar";

        btnEditar.classList.add("btn-editar");


        // Evento do botão editar
        btnEditar.addEventListener("click", () => {

            iniciarEdicao(cliente.id);

        });


        // Cria o botão de excluir
        const btnExcluir: HTMLButtonElement =
            document.createElement("button");

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
        listaClientes!.appendChild(novaLinha);

    });

}


// =========================================
// INICIAR EDIÇÃO
// =========================================

function iniciarEdicao(id: number): void {

    // Procura o cliente pelo ID
    const cliente: Cliente | undefined = clientes.find(

        cliente => cliente.id === id

    );


    // Se o cliente não existir,
    // interrompe a função
    if (!cliente) {

        return;

    }


    // Guarda o ID do cliente em edição
    clienteEmEdicao = id;


    // Preenche os campos do formulário
    inputNome!.value = cliente.nome;

    inputEmail!.value = cliente.email;

    inputTelefone!.value = cliente.telefone;


    // Altera o texto do botão
    btnSalvar!.textContent = "Salvar Alterações";


    // Mostra o botão cancelar
    btnCancelar!.hidden = false;


    // Leva o usuário ao formulário
    form!.scrollIntoView({

        behavior: "smooth"

    });

}


// =========================================
// EXCLUIR CLIENTE
// =========================================

function excluirCliente(id: number): void {

    // Solicita confirmação
    const confirmou: boolean = confirm(
        "Deseja realmente excluir este cliente?"
    );


    // Se o usuário cancelar,
    // interrompe a função
    if (!confirmou) {

        return;

    }


    // Localiza a posição do cliente
    const indiceCliente: number = clientes.findIndex(

        (cliente: Cliente): boolean => {

            return cliente.id === id;

        }

    );


    // Verifica se o cliente foi encontrado
    if (indiceCliente === -1) {

        return;

    }


    // Remove o cliente
    clientes.splice(indiceCliente, 1);


    // Reorganiza os IDs
    clientes.forEach(

        (cliente: Cliente, indice: number): void => {

            cliente.id = indice + 1;

        }

    );


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

function limparFormulario(): void {

    // Limpa os campos
    form!.reset();


    // Sai do modo de edição
    clienteEmEdicao = null;


    // Volta o texto original do botão
    btnSalvar!.textContent = "Salvar Cliente";


    // Esconde o botão de cancelar
    btnCancelar!.hidden = true;

}


// =========================================
// PESQUISA POR NOME
// =========================================

inputPesquisa?.addEventListener("input", () => {

    // Renderiza a lista novamente
    renderizarClientes();

});