const form = document.querySelector("#formulario");
const listaClientes = document.querySelector("#listaClientes");
const botaoExc = document.querySelector("#btn-excluir");
const botaoEdd = document.querySelector("#btn-editar");
const novasLinhas = document.querySelector("tr");
let idContador = 0;

form.addEventListener('submit',(evt)=>{
    evt.preventDefault()

    
    idContador++

    const objFormDados = new FormData(form);
    
    let nome = objFormDados.get("nome");
    let email = objFormDados.get("email");
    let telefone = objFormDados.get("telefone");

    const novoTr = document.createElement("tr");
    novoTr.setAttribute("class","card");
    listaClientes.appendChild(novoTr);

    const tdId = document.createElement("td");
    tdId.textContent = `${idContador}`
    novoTr.appendChild(tdId);

    const tdNome = document.createElement("td");
    tdNome.textContent = `${nome}`
    novoTr.appendChild(tdNome);

    const tdEmail = document.createElement("td");
    tdEmail.textContent = `${email}`
    novoTr.appendChild(tdEmail);

    const tdTelefone = document.createElement("td");
    tdTelefone.textContent = `${telefone}`
    novoTr.appendChild(tdTelefone);


   

    const botaoEditar = document.createElement("button");
    botaoEditar.textContent = "Editar";
    botaoEditar.setAttribute("class","btn-editar")
    botaoEditar.setAttribute("id","btn-editar")
    novoTr.appendChild(botaoEditar)

    const botaoExcluir = document.createElement("button");
    botaoExcluir.textContent = "Excluir";
    botaoExcluir.setAttribute("class","btn-excluir")
    botaoExcluir.setAttribute("id","btn-excluir")

    novoTr.appendChild(botaoExcluir)
    

    botaoExcluir.addEventListener('click', ()=>{
        novoTr.remove();
    })
    
    form.reset();
    
})


// botaoEdd.addEventListener('click',()=>{
    
// })

//     novasLinhas.setAttribute("class","card")
//     const card = botaoExc.closest('.card');
//     card.remove();
// })