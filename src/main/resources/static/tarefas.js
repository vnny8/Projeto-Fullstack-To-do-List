
// Cadastro de tarefas
const formulario = document.querySelector(".tarefaSubmit");
const formularioEdicao = document.querySelector(".formularioEdicao");
const tituloTarefa = document.getElementById("titulo");
const descricaoTarefa = document.getElementById("descricao");
const dataTarefa = document.getElementById("data");
const horaTarefa = document.getElementById("hora");
var result = document.getElementById("resultado");
var result2 = document.getElementById("resultado2");

function cadastrar(){
    
    return fetch("http://localhost:8080/api/Task",
    {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({
            titulo: tituloTarefa.value,
            descricao: descricaoTarefa.value,
            prazoFinal: dataTarefa.value + "T" + horaTarefa.value
        })
    })
    .then(function (res) {
        if (res.ok) {
            console.log("Cadastro bem-sucedido! Atualizando a página..."); // Status 200-299
            setTimeout(function() {
                        location.reload();
            }, 2500);
            return 1;
        } else {
            console.error("Erro ao cadastrar tarefa:", res.status, res.statusText);
            return 0;
        }
    })
    .catch(function (error) {
        console.error("Erro ao realizar a solicitação:", error);
        return 0;
    });
};

formulario.addEventListener('submit', function (event) {
    event.preventDefault();
    if (tituloTarefa.value !== "" && descricaoTarefa.value !== "" && dataTarefa.value !== ""){
        cadastrar()
        .then(function (resultado) {
            if (resultado === 1){
                result.className="alert alert-success";
                result.textContent="Tarefa adicionada com sucesso! Atualizando a página...";
            } else{
                result.className="alert alert-danger";
                result.textContent="Falha ao adicionar tarefa";
            }
        })
        .catch(function (resultado) {
            result.className="alert alert-danger";
            result.textContent="Falha ao adicionar tarefa";
        });
    } else{
        result.className="alert alert-warning";
        result.textContent="Você deve preencher todos os campos"
    }
});

//============================ LISTAGEM DE TAREFAS ===================================================================

// Função para obter tarefas
function obterTarefas() {
    return fetch("http://localhost:8080/api/Task")
        .then(response => response.json())
        .catch(error => console.error("Erro ao obter tarefas:", error));
}

function excluirTarefa(id) {
        fetch(`http://localhost:8080/api/Task/${id}`,
        {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao excluir tarefa: ${response.status}`);
            }
            console.log(`Tarefa com ID ${id} excluída com sucesso.`);
        })
        .catch(error => {
            console.error('Erro:', error);
        });
}

function editarTarefa(tarefaTitulo, tarefaDescricao, tarefaPrazoFinal, id, statusTarefa) {
    return fetch(`http://localhost:8080/api/Task/${id}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            titulo: tarefaTitulo,
            descricao: tarefaDescricao,
            prazoFinal: tarefaPrazoFinal,
            status: statusTarefa
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erro ao editar tarefa: ${response.status}`);
        }
        return response.json();  // Processando a resposta para extrair dados, se necessário
    })
    .then(data => {
        console.log(`Tarefa com ID ${id} editada com sucesso.`);
        return 1;  // Retorna 1 para indicar sucesso
    })
    .catch(error => {
        console.error('Erro:', error);
        return 0;  // Retorna 0 em caso de falha
    });
}
function formatarData(dataISO) {
    const data = new Date(dataISO);

    const horas = data.getHours().toString().padStart(2, '0');
    const minutos = data.getMinutes().toString().padStart(2, '0');

    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const ano = data.getFullYear();

    const dataFormatada = `${horas}:${minutos} ${dia}/${mes}/${ano}`;

    return dataFormatada;
}

function verificarPrazoExpirado(tarefa, callback) {
    const prazo = new Date(tarefa.prazoFinal);
    const agora = new Date();

    if (prazo < agora) {
        editarTarefa(tarefa.titulo, tarefa.descricao, tarefa.prazoFinal, tarefa.id, "Expirada");
        location.reload();
    }
}

// Função para exibir tarefas
function exibirTarefas() {
    obterTarefas()
        .then(tarefas => {
            const listaTarefas = document.getElementById("lista-tarefas");

            // Limpar a lista de tarefas antes de exibir novos dados
            listaTarefas.innerHTML = "";

            // Iterar sobre as tarefas e criar elementos HTML para cada uma
            tarefas.forEach(tarefa => {
                if (tarefa.status === "Pendente") {
                    const row = document.createElement("tr");

                    const titulo = document.createElement("td");
                    titulo.textContent = tarefa.titulo;
                    row.appendChild(titulo);

                    const descricao = document.createElement("td");
                    descricao.textContent = tarefa.descricao;
                    row.appendChild(descricao);

                    const prazoFinal = document.createElement("td");
                    prazoFinal.textContent = formatarData(tarefa.prazoFinal);
                    row.appendChild(prazoFinal);

                    const status = document.createElement("td");
                    status.textContent = tarefa.status;
                    status.style.color = "#CC5200";
                    status.style.fontWeight = "bold";
                    row.appendChild(status);

                    const acoes = document.createElement("td");

                    const completadoBtn = document.createElement("button");
                    completadoBtn.className = "btn btn-success";
                    completadoBtn.type = "submit";
                    completadoBtn.style.backgroundColor = "green";
                    completadoBtn.id = "completar";
                    completadoBtn.onclick = function(){
                        editarTarefa(tarefa.titulo, tarefa.descricao, tarefa.prazoFinal, tarefa.id, "Completada");
                        location.reload();
                    }
                    completadoBtn.innerHTML = '<i class="fa-regular fa-square-check"></i>';
                    acoes.appendChild(completadoBtn);

                    const editarBtn = document.createElement("button");
                    editarBtn.className = "btn btn-info";
                    editarBtn.style.marginLeft = "5px";
                    editarBtn.style.backgroundColor = "#1E90FF";
                    editarBtn.type = "submit";
                    editarBtn.id = "editar";
                    editarBtn.setAttribute("data-toggle", "modal");
                    editarBtn.setAttribute("data-target", "#exampleModalCenter");

                    editarBtn.setAttribute("data-id", tarefa.id);
                    editarBtn.setAttribute("data-titulo", tarefa.titulo);
                    editarBtn.setAttribute("data-descricao", tarefa.descricao);
                    editarBtn.setAttribute("data-data", tarefa.prazoFinal.split('T')[0]);
                    editarBtn.setAttribute("data-hora", tarefa.prazoFinal.split('T')[1]);

                    editarBtn.innerHTML = '<i class="fas fa-edit" style="color: white;"></i>';
                    acoes.appendChild(editarBtn);

                    const removerBtn = document.createElement("button");
                    removerBtn.className = "btn btn-danger";
                    removerBtn.innerHTML = '<i class="fas fa-trash"></i>';
                    removerBtn.style.marginLeft = "5px";
                    removerBtn.style.backgroundColor = "#C00000";
                    removerBtn.type = "submit";
                    removerBtn.id = "deletar";
                    removerBtn.onclick = function(){
                        excluirTarefa(tarefa.id);
                        location.reload();
                    };
                    acoes.appendChild(removerBtn);

                    row.appendChild(acoes);

                    listaTarefas.appendChild(row);

                    const intervalId = setInterval(() => {
                        verificarPrazoExpirado(tarefa, (tarefaExpirada) => {
                        clearInterval(intervalId); // Parar a verificação para esta tarefa
                        });
                    }, 1000);
                }
            });
        })
        .catch(error => {
            console.error("Erro ao buscar e exibir tarefas:", error);
        });
}

// Função para exibir completadas
function exibirTarefas2() {
    obterTarefas()
        .then(tarefas => {
            const listaTarefas = document.getElementById("lista-tarefas-completadas");

            // Limpar a lista de tarefas antes de exibir novos dados
            listaTarefas.innerHTML = "";

            // Iterar sobre as tarefas e criar elementos HTML para cada uma
            tarefas.forEach(tarefa => {
                if (tarefa.status !== "Pendente") {
                    const row = document.createElement("tr");

                    const titulo = document.createElement("td");
                    titulo.textContent = tarefa.titulo;
                    row.appendChild(titulo);

                    const descricao = document.createElement("td");
                    descricao.textContent = tarefa.descricao;
                    row.appendChild(descricao);

                    const prazoFinal = document.createElement("td");
                    prazoFinal.textContent = formatarData(tarefa.prazoFinal);
                    row.appendChild(prazoFinal);


                    const status = document.createElement("td");
                    status.textContent = tarefa.status;
                    if (tarefa.status === "Completada"){
                        status.style.color = "#36592c";
                    } else{
                        status.style.color = "#C00000";
                    }
                    status.style.fontWeight = "bold";


                    row.appendChild(status);

                    const acoes = document.createElement("td");

                    const removerBtn = document.createElement("button");
                    removerBtn.className = "btn btn-danger ml-1";
                    removerBtn.innerHTML = '<i class="fas fa-trash"></i>';
                    removerBtn.style.backgroundColor = "#C00000";
                    removerBtn.type = "submit";
                    removerBtn.id = "deletar";
                    removerBtn.onclick = function(){
                        excluirTarefa(tarefa.id);
                        location.reload();
                    };
                    acoes.appendChild(removerBtn);
                    row.appendChild(acoes);


                    listaTarefas.appendChild(row);
                }
            });
        })
        .catch(error => {
            console.error("Erro ao buscar e exibir tarefas:", error);
        });
}

// Chamar a função para exibir as tarefas quando a página for carregada
document.addEventListener("DOMContentLoaded", function() {
    exibirTarefas();
    exibirTarefas2();
});

formularioEdicao.addEventListener('submit', function (event) {
    event.preventDefault();
    const idTarefa = document.getElementById("id");
    const dataTarefa = document.getElementById("data2");
    const horaTarefa = document.getElementById("hora2");
    const tituloTarefa = document.getElementById("titulo2");
    const descricaoTarefa = document.getElementById("descricao2");
    const prazoFinal = dataTarefa.value + "T" + horaTarefa.value;
    console.log(prazoFinal);

    if (tituloTarefa.value !== "" && descricaoTarefa.value !== "" && dataTarefa.value !== "" && horaTarefa.value !== "" && idTarefa.value !== ""){
        editarTarefa(tituloTarefa.value, descricaoTarefa.value, prazoFinal, idTarefa.value, "Pendente")
            .then(function (resultado) {
                if (resultado === 1) {
                    result2.className = "alert alert-success";
                    result2.textContent = "Tarefa editada com sucesso! Atualizando a página...";
                    setTimeout(function() {
                                            location.reload();
                    }, 2000);
                } else {
                    result2.className = "alert alert-danger";
                    result2.textContent = "Falha ao editar tarefa";
                }
            })
            .catch(function (error) {
                result2.className = "alert alert-danger";
                result2.textContent = "Falha ao editar tarefa";
            });
    } else {
        result2.className = "alert alert-warning";
        result2.textContent = "Você deve preencher todos os campos";
    }
});

