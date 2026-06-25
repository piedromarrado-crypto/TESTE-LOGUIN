// Alterna entre TODAS as abas do sistema (Cadastro, Login, Bem-vindo e Perfil)
function mostrarAba(aba) {
  // Oculta todas as abas removendo a classe "ativa"
  document.getElementById("cadastro").classList.remove("ativa");
  document.getElementById("login").classList.remove("ativa");
  document.getElementById("bemVindo").classList.remove("ativa");
  document.getElementById("perfil").classList.remove("ativa");
  
  // Mostra apenas a aba desejada
  document.getElementById(aba).classList.add("ativa");

  // Controla se a barra superior de Cadastro/Login deve aparecer
  const menuNavegacao = document.getElementById("navegacaoAbas");
  if (aba === "cadastro" || aba === "login") {
    menuNavegacao.style.display = "flex"; 
    document.getElementById("btnCadastro").classList.remove("active");
    document.getElementById("btnLogin").classList.remove("active");
    if(aba === "cadastro") document.getElementById("btnCadastro").classList.add("active");
    else document.getElementById("btnLogin").classList.add("active");
  } else {
    menuNavegacao.style.display = "none"; // Esconde o menu de abas iniciais se o usuário estiver logado
  }
}

// Cadastro com checagem de duplicados
document.getElementById("cadastroForm").addEventListener("submit", function(e){
  e.preventDefault();
  const nome = document.getElementById("nome").value;
  const cpf = document.getElementById("cpf").value;
  const email = document.getElementById("email").value;
  const celular = document.getElementById("celular").value;
  const senha = document.getElementById("senha").value;
  const id = Date.now();

  let users = JSON.parse(localStorage.getItem("users")) || [];

  const duplicado = users.find(u => u.cpf === cpf || u.email === email);
  if(duplicado){
    alert("Usuário já cadastrado com este CPF ou e-mail!");
    return;
  }

  const user = {nome, cpf, email, celular, senha, id};
  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));

  alert("Cadastro realizado! Seu ID é: " + id);
  document.getElementById("cadastroForm").reset();
  mostrarAba("login"); // Joga o usuário direto para a tela de login
});

// Preenche a interface com os dados do usuário e troca de tela
function logarUsuario(user) {
  // Injeta os dados nas telas de Bem-vindo e Perfil
  document.getElementById("txtMenuBemVindo").innerText = `Bem-vindo, ${user.nome}`;
  document.getElementById("tituloBoasVindas").innerText = `Olá ${user.nome}!`;
  
  document.getElementById("perfNome").innerText = user.nome;
  document.getElementById("perfCpf").innerText = user.cpf;
  document.getElementById("perfEmail").innerText = user.email;
  document.getElementById("perfCelular").innerText = user.celular;
  document.getElementById("perfId").innerText = user.id;

  // Vai para a tela de Boas-vindas
  mostrarAba("bemVindo");
}

// Realiza o logout limpando os formulários
function logout() {
  document.getElementById("loginForm").reset();
  document.getElementById("loginCpfForm").reset();
  mostrarAba("login");
}

// Login com ID
document.getElementById("loginForm").addEventListener("submit", function(e){
  e.preventDefault();
  const loginId = document.getElementById("loginId").value;
  const loginSenha = document.getElementById("loginSenha").value;
  let users = JSON.parse(localStorage.getItem("users")) || [];

  const user = users.find(u => u.id == loginId && u.senha === loginSenha);

  if(user){
    logarUsuario(user);
  } else {
    alert("ID ou senha incorretos!");
  }
});

// Login com CPF
document.getElementById("loginCpfForm").addEventListener("submit", function(e){
  e.preventDefault();
  const loginCpf = document.getElementById("loginCpf").value;
  const loginCpfSenha = document.getElementById("loginCpfSenha").value;
  let users = JSON.parse(localStorage.getItem("users")) || [];

  const user = users.find(u => u.cpf === loginCpf && u.senha === loginCpfSenha);

  if(user){
    alert("Login realizado! Seu ID é: " + user.id);
    logarUsuario(user);
  } else {
    alert("CPF ou senha incorretos!");
  }
});