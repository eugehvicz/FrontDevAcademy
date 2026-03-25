const ApiUrl = 'http://localhost:5228/api';
const TOKEN_KEY = 'app_auth_token';

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

//LOGIN
const loginForm = document.getElementById('login-form');
if(loginForm){
    const loginEmail = document.getElementById('login-email');
    const loginPassword = document.getElementById('login-password');
    const loginBtn = document.getElementById('login-btn');

    const loginSection = document.getElementById('login-section');
    const dashboardSection = document.getElementById('dashboard-section');
    const fetchDataBtn = document.getElementById('fecth-data-btn');
    const apiDataBox = document.getElementById('api-data');
    const logoutBtn = document.getElementById('logout-btn');

    function initIndex(){
        const token = localStorage.getItem(TOKEN_KEY);
        if(token){ 
            loginSection.classList.add('hidden');
            dashboardSection.classList.remove('hidden');
        } else {
            dashboardSection.classList.add('hidden');
            loginSection.classList.remove('hidden');
        }
    }


loginForm.addEventListener('submit', async(event) => {
    event.preventDefault();
    const email = loginEmail.value;
    const senha = loginPassword.value;

     try{
        loginBtn.disabled = true
        loginBtn.textContent = 'Aguarde...'

        const response = await fetch(`${ApiUrl}/Auth/login`, {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({email, senha})
        });
        const dados = await response.json();
        if(!response.ok) throw new Error(data.mensagem || 'Credenciais inválidos');
        if(dados.token){
            localStorage.setItem(TOKEN_KEY, dados.token);
            initIndex();
        }
     }catch (error){
        mostrarMenssagem(error, "error");
     } finally{
        loginBtn.disabled = false;
        loginBtn.textContent= 'Entrar';
     }
    
});

function logout(){
localStorage.removeItem(TOKEN_KEY);
initIndex();
apiDataBox.style.display='none';
}
logoutBtn.addEventListener('click', logout);
initIndex();
}

//REGISTER
const registroForm = document.getElementById('register-form');
if(registroForm){
    //P
   if(localStorage.getItem(TOKEN_KEY)){
    window.location.href= 'login.html'
   }
   const nomeRegis = document.getElementById('regis-nome');
   const emailRegis = document.getElementById('regis-email');
   const senhaRegis = document.getElementById('regis-senha');
   const confirmarSenha = document.getElementById('confirmar-senha');
   const perfil = document.getElementById('role');
   const registrarBtn = document.getElementById('btn-submit');
   const formRegistro = document.getElementById('register-form');


   formRegistro.addEventListener('submit', async (event) =>{
    event.preventDefault();
    const nome = nomeRegis.value;
    const email = emailRegis.value;
    const senha = senhaRegis.value;
    const confirmSenha = confirmarSenha.value;
     const role = perfil.value;

    if(senha !== confirmSenha){
        return mostrarMenssagem('As senhas não coincidem.', 'erro');
    }
    try{
       registrarBtn.disabled = true;
       registrarBtn.textContent = 'Aguarde...';
       const resposta = await fetch(`${ApiUrl}/auth/register`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({nome, email, senha, role})
       });

       const dados = await resposta.json();
       if(!resposta.ok) throw new Error(dados.mensagem || 'Erro ao criar sua conta.');
       alert('Conta criada com sucesso! Faça seu login.');
       window.location.href= 'login.html';
    } catch(error){
        mostrarMenssagem(error, 'error');
    }finally{
        registrarBtn.disabled= false;
        registrarBtn.textContent = 'Registrar';
    }


   })

}