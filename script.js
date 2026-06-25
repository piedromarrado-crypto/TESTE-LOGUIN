// Altera as abas ocultando as outras
function mostrarAba(aba) {
  document.getElementById("cadastro").classList.remove("ativa");
  document.getElementById("login").classList.remove("ativa");
  document.getElementById("bemVindo").classList.remove("ativa");
  document.getElementById("perfil").classList.remove("ativa");
  
  document.getElementById(aba).classList.add("ativa");
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

  alert("Cadastro realizado com sucesso!\nSeu ID gerado é: " + id);
  document.getElementById("cadastroForm").reset();
  
  // Após cadastrar com sucesso, manda ele de volta para o Login fazer o primeiro acesso
  mostrarAba("login");
});

// Preenche os dados nas telas após o login
function logarUsuario(user) {
  document.getElementById("txtMenuBemVindo").innerText = `Bem-vindo, ${user.nome}`;
  document.getElementById("tituloBoasVindas").innerText = `Olá ${user.nome}!`;
  
  document.getElementById("perfNome").innerText = user.nome;
  document.getElementById("perfCpf").innerText = user.cpf;
  document.getElementById("perfEmail").innerText = user.email;
  document.getElementById("perfCelular").innerText = user.celular;
  document.getElementById("perfId").innerText = user.id;

  mostrarAba("bemVindo");
}

// Executa o logout limpando campos
function logout() {
  document.getElementById("loginForm").reset();
  document.getElementById("loginCpfForm").reset();
  mostrarAba("login");
}

// Login com ID + Automação de Cadastro
document.getElementById("loginForm").addEventListener("submit", function(e){
  e.preventDefault();
  const loginId = document.getElementById("loginId").value;
  const loginSenha = document.getElementById("loginSenha").value;
  let users = JSON.parse(localStorage.getItem("users")) || [];

  // 1º passo: Verifica se o ID inserido existe no banco de dados geral
  const idExiste = users.some(u => u.id == loginId);
  
  if (!idExiste) {
    // Se o ID não existe em nenhum lugar do banco, avisa que precisa de cadastro e redireciona
    alert("Conta não encontrada! É necessário realizar um cadastro.");
    mostrarAba("cadastro");
    return;
  }

  // 2º passo: Se o ID existe, confere se bate com a senha correta
  const user = users.find(u => u.id == loginId && u.senha === loginSenha);

  if(user){
    logarUsuario(user);
  } else {
    alert("Senha incorreta para este ID!");
  }
});

// Login com CPF + Automação de Cadastro
document.getElementById("loginCpfForm").addEventListener("submit", function(e){
  e.preventDefault();
  const loginCpf = document.getElementById("loginCpf").value;
  const loginCpfSenha = document.getElementById("loginCpfSenha").value;
  let users = JSON.parse(localStorage.getItem("users")) || [];

  // 1º passo: Verifica se o CPF inserido existe no banco de dados geral
  const cpfExiste = users.some(u => u.cpf === loginCpf);

  if (!cpfExiste) {
    // Se o CPF não existe, avisa que precisa de cadastro e joga para o formulário
    alert("CPF não localizado no sistema! Por favor, realize o seu cadastro.");
    mostrarAba("cadastro");
    return;
  }

  // 2º passo: Se existe, valida a credencial da senha
  const user = users.find(u => u.cpf === loginCpf && u.senha === loginCpfSenha);

  if(user){
    alert("Login realizado com sucesso!");
    logarUsuario(user);
  } else {
    alert("Senha incorreta para este CPF!");
  }
});
