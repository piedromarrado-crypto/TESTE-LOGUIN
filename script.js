import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, where, limit } from "firebase/firestore";

// Credenciais do seu projeto copiadas do console do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBt83E41V8ekF0qzfXe7CvSyPoLrZU1M00",
  authDomain: "teste-de-loguin-nuvem.firebaseapp.com",
  projectId: "teste-de-loguin-nuvem",
  storageBucket: "teste-de-loguin-nuvem.firebasestorage.app",
  messagingSenderId: "41809427139",
  appId: "1:41809427139:web:9e9340b4a15a310985c876",
  measurementId: "G-NTMCCZ6Q87"
};

// Inicializa o Firebase e o Banco de Dados (Firestore)
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Altera as abas ocultando as outras (Disponibilizado globalmente por ser um módulo)
window.mostrarAba = function(aba) {
  document.getElementById("cadastro").classList.remove("ativa");
  document.getElementById("login").classList.remove("ativa");
  document.getElementById("bemVindo").classList.remove("ativa");
  document.getElementById("perfil").classList.remove("ativa");
  
  document.getElementById(aba).classList.add("ativa");
}

// Executa o logout limpando campos
window.logout = function() {
  document.getElementById("loginForm").reset();
  document.getElementById("loginCpfForm").reset();
  window.mostrarAba("login");
}

// Preenche os dados nas telas após o login
function logarUsuario(user) {
  document.getElementById("txtMenuBemVindo").innerText = `Bem-vindo, ${user.nome}`;
  document.getElementById("tituloBoasVindas").innerText = `Olá ${user.nome}!`;
  
  document.getElementById("perfNome").innerText = user.nome;
  document.getElementById("perfCpf").innerText = user.cpf;
  document.getElementById("perfEmail").innerText = user.email;
  document.getElementById("perfCelular").innerText = user.celular;
  document.getElementById("perfId").innerText = user.id;

  window.mostrarAba("bemVindo");
}

// Cadastro com checagem de duplicados salvando no Banco na Nuvem
document.getElementById("cadastroForm").addEventListener("submit", async function(e){
  e.preventDefault();
  const nome = document.getElementById("nome").value;
  const cpf = document.getElementById("cpf").value;
  const email = document.getElementById("email").value;
  const celular = document.getElementById("celular").value;
  const senha = document.getElementById("senha").value;
  const id = String(Date.now()); // ID gerado como Texto para facilitar buscas

  try {
    const usuariosRef = collection(db, "users");

    // Verifica se o CPF ou Email já existem lá na nuvem
    const qCpf = query(usuariosRef, where("cpf", "==", cpf));
    const qEmail = query(usuariosRef, where("email", "==", email));
    
    const queryCpfSnap = await getDocs(qCpf);
    const queryEmailSnap = await getDocs(qEmail);

    if (!queryCpfSnap.empty || !queryEmailSnap.empty) {
      alert("Usuário já cadastrado com este CPF ou e-mail!");
      return;
    }

    // Salva o novo usuário na nuvem do Google
    const user = { nome, cpf, email, celular, senha, id };
    await addDoc(usuariosRef, user);

    alert("Cadastro realizado com sucesso!\nSeu ID gerado é: " + id);
    document.getElementById("cadastroForm").reset();
    
    window.mostrarAba("login");
  } catch (error) {
    console.error("Erro ao cadastrar:", error);
    alert("Erro ao conectar com o banco de dados. Tente novamente.");
  }
});

// Login com ID consultando a nuvem
document.getElementById("loginForm").addEventListener("submit", async function(e){
  e.preventDefault();
  const loginId = document.getElementById("loginId").value;
  const loginSenha = document.getElementById("loginSenha").value;

  try {
    const usuariosRef = collection(db, "users");
    const q = query(usuariosRef, where("id", "==", loginId), limit(1));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      alert("Conta não encontrada! É necessário realizar um cadastro.");
      window.mostrarAba("cadastro");
      return;
    }

    let user = null;
    querySnapshot.forEach((doc) => {
      user = doc.data();
    });

    if (user.senha === loginSenha) {
      logarUsuario(user);
    } else {
      alert("Senha incorreta para este ID!");
    }
  } catch (error) {
    console.error("Erro no login por ID:", error);
  }
});

// Login com CPF consultando a nuvem
document.getElementById("loginCpfForm").addEventListener("submit", async function(e){
  e.preventDefault();
  const loginCpf = document.getElementById("loginCpf").value;
  const loginCpfSenha = document.getElementById("loginCpfSenha").value;

  try {
    const usuariosRef = collection(db, "users");
    const q = query(usuariosRef, where("cpf", "==", loginCpf), limit(1));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      alert("CPF não localizado no sistema! Por favor, realize o seu cadastro.");
      window.mostrarAba("cadastro");
      return;
    }

    let user = null;
    querySnapshot.forEach((doc) => {
      user = doc.data();
    });

    if (user.senha === loginCpfSenha) {
      alert("Login realizado com sucesso!");
      logarUsuario(user);
    } else {
      alert("Senha incorreta para este CPF!");
    }
  } catch (error) {
    console.error("Erro no login por CPF:", error);
  }
});
