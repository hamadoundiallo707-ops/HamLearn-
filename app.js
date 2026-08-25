const SUPABASE_URL = "https://bgzlxnptulngevjfvyli.supabase.co";
const SUPABASE_KEY = "sb_publishable_DBPHAwZELYm5HtA5UQNrsQ_Xddre-SB";

const { createClient } = window.supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

const courses = [
  ["science","Sciences","Physique-Chimie — Les forces","Lycée","12 leçons","5 000 FCFA"],
  ["science","Sciences","Sciences Naturelles — Corps humain","Collège","10 leçons","Inclus Pro"],
  ["math","Maths","Mathématiques — Fonctions","Lycée","14 leçons","5 000 FCFA"],
  ["math","Maths","Maths — Méthodes fondamentales","Collège","12 leçons","Inclus Pro"],
  ["exam","Examens","Objectif DEF — Parcours intensif","9e année","8 semaines","10 000 FCFA"],
  ["exam","Examens","Objectif BAC — Révisions guidées","Terminale","8 semaines","15 000 FCFA"],
  ["skill","Méthodologie","Méthodologie de travail","Tous niveaux","6 modules","Inclus Pro"],
  ["skill","Méthodologie","Prise de parole & confiance","Jeunes","5 modules","5 000 FCFA"],
  ["science","Sciences","Sciences Naturelles — Bases","Collège","11 leçons","Inclus Pro"]
];

function render(list) {
  document.querySelector("#courseGrid").innerHTML = list.map((c, i) => `
    <article class="course">
      <span class="tag">${c[1]}</span>
      <h3>${c[2]}</h3>
      <p>Vidéo + fiche + exercices corrigés + quiz + suivi de progression.</p>
      <div class="meta">${c[3]} · ${c[4]} · <b>${c[5]}</b></div>
      <br>
      <button class="btn soft" onclick="course(${i})">
        Voir le parcours
      </button>
    </article>
  `).join("");
}

function filter(cat, el) {
  document.querySelectorAll(".filters button")
    .forEach(b => b.classList.remove("active"));

  el.classList.add("active");

  render(
    cat === "all"
      ? courses
      : courses.filter(c => c[0] === cat)
  );
}

function course(i) {
  const c = courses[i];

  document.querySelector("#modalContent").innerHTML = `
    <span class="eyebrow">${c[1]}</span>
    <h2>${c[2]}</h2>

    <p>
      <b>Niveau :</b> ${c[3]}<br>
      <b>Format :</b> ${c[4]}<br>
      <b>Tarif :</b> ${c[5]}
    </p>

    <p>
      Le parcours comprend des contenus pédagogiques structurés,
      des exercices, des quiz et un suivi de progression.
    </p>

    <button class="btn primary" onclick="buy('${c[2]}')">
      Accéder au parcours
    </button>
  `;

  document.querySelector("#modal").style.display = "grid";
}

/* =========================
   AUTHENTIFICATION SUPABASE
   ========================= */

async function signUp() {
  const name = document.querySelector("#signupName").value.trim();
  const phone = document.querySelector("#signupPhone").value.trim();
  const email = document.querySelector("#signupEmail").value.trim();
  const password = document.querySelector("#signupPassword").value;

  if (!name || !email || !password) {
    alert("Veuillez remplir le nom, l'e-mail et le mot de passe.");
    return;
  }

  if (password.length < 6) {
    alert("Le mot de passe doit contenir au moins 6 caractères.");
    return;
  }

  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: window.location.origin + window.location.pathname,
      data: {
        full_name: name,
        phone: phone
      }
    }
  });

  if (error) {
    alert("Erreur : " + error.message);
    return;
  }

  if (data.user) {
    alert(
      "Inscription réussie ! " +
      "Si une confirmation e-mail est demandée, consultez votre boîte mail."
    );

    closeModal();
  }
}

async function login() {
  const email = document.querySelector("#loginEmail").value.trim();
  const password = document.querySelector("#loginPassword").value;

  if (!email || !password) {
    alert("Veuillez saisir votre e-mail et votre mot de passe.");
    return;
  }

  const { data, error } =
    await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

  if (error) {
    alert("Connexion impossible : " + error.message);
    return;
  }

  alert("Connexion réussie ! Bienvenue sur HamLearn 👋");

  closeModal();

  updateAuthButton(data.user);
}

async function logout() {
  const { error } = await supabaseClient.auth.signOut();

  if (error) {
    alert("Erreur lors de la déconnexion : " + error.message);
    return;
  }

  alert("Vous êtes déconnecté.");
  updateAuthButton(null);
}

function updateAuthButton(user) {
  const buttons = document.querySelectorAll("button");

  buttons.forEach(button => {
    if (
      button.textContent.trim() === "Se connecter" ||
      button.textContent.trim() === "Déconnexion"
    ) {
      if (user) {
        button.textContent = "Déconnexion";
        button.onclick = logout;
      } else {
        button.textContent = "Se connecter";
        button.onclick = () => openModal("login");
      }
    }
  });
}

async function checkUser() {
  const {
    data: { user }
  } = await supabaseClient.auth.getUser();

  updateAuthButton(user);
}

/* =========================
   FENÊTRES HAMLEARN
   ========================= */

function openModal(type) {

  let html = "";

  if (type === "parent") {

    html = `
      <h2>Espace Parent</h2>
      <p>
        Suivez les résultats et la progression de votre enfant.
      </p>

      <input placeholder="Téléphone">

      <button class="btn primary"
        onclick="alert('Espace Parent — prochaine étape')">
        Continuer
      </button>
    `;

  } else if (type === "teacher") {

    html = `
      <h2>Enseignant partenaire</h2>

      <p>
        Déposez votre candidature pour créer et enseigner sur HamLearn.
      </p>

      <input placeholder="Nom complet">
      <input placeholder="Matière enseignée">
      <input placeholder="Téléphone">

      <button class="btn primary"
        onclick="alert('Candidature enregistrée')">
        Candidater
      </button>
    `;

  } else if (type === "login") {

    html = `
      <h2>Connexion à HamLearn</h2>

      <p>
        Connectez-vous à votre espace élève.
      </p>

      <input
        id="loginEmail"
        type="email"
        placeholder="Adresse e-mail"
      >

      <input
        id="loginPassword"
        type="password"
        placeholder="Mot de passe"
      >

      <button class="btn primary" onclick="login()">
        Se connecter
      </button>

      <p style="margin-top:15px;">
        Pas encore de compte ?
        <button class="btn soft" onclick="openModal('signup')">
          Créer un compte
        </button>
      </p>
    `;

  } else {

    html = `
      <h2>Rejoindre HamLearn</h2>

      <p>
        Créez votre compte élève gratuitement.
      </p>

      <input
        id="signupName"
        placeholder="Nom complet"
      >

      <input
        id="signupPhone"
        placeholder="Téléphone / WhatsApp"
      >

      <input
        id="signupEmail"
        type="email"
        placeholder="Adresse e-mail"
      >

      <input
        id="signupPassword"
        type="password"
        placeholder="Mot de passe"
      >

      <button class="btn primary" onclick="signUp()">
        Créer mon compte
      </button>
    `;
  }

  document.querySelector("#modalContent").innerHTML = html;
  document.querySelector("#modal").style.display = "grid";
}

function buy(plan) {

  document.querySelector("#modalContent").innerHTML = `
    <h2>${plan}</h2>

    <p>
      Le prototype prépare le parcours de paiement.
      En production, nous connecterons une solution
      compatible avec les moyens de paiement ciblés au Mali.
    </p>

    <input placeholder="Nom complet">
    <input placeholder="Téléphone">

    <button class="btn primary"
      onclick="alert('Commande enregistrée — démonstration')">
      Continuer vers le paiement
    </button>
  `;

  document.querySelector("#modal").style.display = "grid";
}

function closeModal() {
  document.querySelector("#modal").style.display = "none";
}

/* =========================
   INITIALISATION
   ========================= */

render(courses);
checkUser();

supabaseClient.auth.onAuthStateChange(
  (_event, session) => {
    updateAuthButton(session?.user || null);
  }
);
