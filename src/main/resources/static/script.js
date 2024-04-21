// Registro
const formulario = document.querySelector(".RegistroSubmit");
const Inome = document.querySelector(".nome");
const Ilogin = document.querySelector(".usuario");
const Isenha = document.querySelector(".senha");
var result = document.getElementById("resultado");

function cadastrar(){
    
    return fetch("http://localhost:8080/usuarios",
    {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({
            nome: Inome.value,
            login: Ilogin.value,
            senha: Isenha.value
        })
    })
    .then(function (res) {
        if (res.ok) {
            console.log("Cadastro bem-sucedido!"); // Status 200-299
            return 1;
        } else {
            console.error("Erro ao cadastrar:", res.status, res.statusText);
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
    if (Inome.value !== "" && Ilogin.value !== "" && Isenha.value !== ""){
        cadastrar()
        .then(function (resultado) {
            if (resultado === 1){
                result.className="alert alert-success";
                result.textContent="Registrado com sucesso!";// 1 se deu certo, 0 se não deu certo
            } else{
                result.className="alert alert-danger";
                result.textContent="Falha no cadastro";
            }
        })
        .catch(function (resultado) {
            result.className="alert alert-danger";
            result.textContent="Falha no login";
        });
    } else{
        result.className="alert alert-warning";
        result.textContent="Você deve preencher todos os campos"
    }
});