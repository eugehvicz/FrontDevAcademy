//configurações globais
const ApiUrl = 'http://localhost:5228/api';
const TOKEN_KEY = 'app_auth_token';

//Mostrar mensagem de ERRO ou SUCESSO
const messageBox = document.getElementById('message-box');
function mostrarMenssagem(texto, type="error")
{
    //mostrar mensagem de ERRO ou SUCESSO no login e no registro
if(!messageBox)return;
messageBox.textContent = texto;
messageBox.className = type === 'error' ? 'msg-error' : 'msg-sucess';
messageBox.style.display ='block';
setTimeout(() => {messageBox.style.display = 'none';}, 4000);
}
//Decodificar o payload do jwt
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
       
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g,'/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c){
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
      return JSON.parse(jsonPayload);
        
    } catch (e) {
        console.error("Erro ao decodificar JWT:", e);
        return null;
        
    }
    
}

//Cadastro de Cursos

const cursoForm = document.getElementById('curso-form');
const token= localStorage.getItem(TOKEN_KEY);
let userRole = null;

//Extrai a role diretamente do token
if (token) {
    const payload = parseJwt(token);
    if (payload) {
        userRole = payload.role;       
    }
}
const rolesArray =  userRole? (Array.isArray(userRole)? userRole: [userRole]): [];

//bloqueio da interface
if (!token) {
    mostrarMenssagem("usuário não autorizado", "error");
    cursoForm.style.display = "none";
    setTimeout(()=>{
        console.log("Esperando um tempinho...")
    }, 5000);
    window.location.href="login.html";
    
}

const tituloCurso = document.getElementById('curso-titulo');
const descricaoCurso = document.getElementById('curso-descricao');
const cargaCurso = document.getElementById('curso-carga');
const submitCurso = document.getElementById('curso-btn');

cursoForm.addEventListener("submit", async (event)=>{
    event.preventDefault();

    const titulo = tituloCurso.value;
    const descricao = descricaoCurso.value;
    const cargaHoraria = cargaCurso.value;

    try {
        submitCurso.disabled= true;
        submitCurso.textContent= "Aguarde..."

        const resposta = await fetch(`${ApiUrl}/cursos`,{
            method: "POST", headers :{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({titulo, descricao, cargaHoraria}),
        });

        let dados= {};
        if (resposta.status !==204) {
            dados= await resposta.json();
        }
        if(!resposta.ok) throw new Error(dados.menssagem || "Erro ao cadastrar o curso.");
        mostrarMenssagem("Curso cadastrado com sucesso!", "sucess");
        cursoForm.reset();

    } catch (error) {
        mostrarMenssagem(error.message, "error");
        //voltar aqui
    } finally{
        submitCurso.disabled = false;
        submitCurso.textContent= "Salvar curso";
    }
});