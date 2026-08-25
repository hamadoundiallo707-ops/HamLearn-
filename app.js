/* =========================================================
   HAMLEARN — APPLICATION JAVASCRIPT
   Version MVP corrigée
   ========================================================= */

const SUPABASE_URL = "https://bgzlxnptulngevjfvyli.supabase.co";
const SUPABASE_KEY = "sb_publishable_DBPHAwZELYm5HtA5UQNrsQ_Xddre-SB";

let supabaseClient = null;

/* =========================================================
   INITIALISATION SUPABASE
   ========================================================= */

if (window.supabase) {
  const { createClient } = window.supabase;

  supabaseClient = createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );
} else {
  console.error(
    "Supabase n'est pas chargé. Vérifie index.html."
  );
}


/* =========================================================
   CATALOGUE DES COURS
   ========================================================= */

const courses = [
  {
    id: 1,
    category: "science",
    categoryName: "Sciences",
    title: "Physique-Chimie — Les forces",
    level: "Lycée",
    duration: "12 leçons",
    price: "5 000 FCFA"
  },
  {
    id: 2,
    category: "science",
    categoryName: "Sciences",
    title: "Sciences Naturelles — Corps humain",
    level: "Collège",
    duration: "10 leçons",
    price: "Inclus Pro"
  },
  {
    id: 3,
    category: "math",
    categoryName: "Maths",
    title: "Mathématiques — Fonctions",
    level: "Lycée",
    duration: "14 leçons",
    price: "5 000 FCFA"
  },
  {
    id: 4,
    category: "math",
    categoryName: "Maths",
    title: "Maths — Méthodes fondamentales",
    level: "Collège",
    duration: "12 leçons",
    price: "Inclus Pro"
  },
  {
    id: 5,
    category: "exam",
    categoryName: "Examens",
    title: "Objectif DEF — Parcours intensif",
    level: "9e année",
    duration: "8 semaines",
    price: "10 000 FCFA"
  },
  {
    id: 6,
    category: "exam",
    categoryName: "Examens",
    title: "Objectif BAC — Révisions guidées",
    level: "Terminale",
    duration: "8 semaines",
    price: "15 000 FCFA"
  },
  {
    id: 7,
    category: "skill",
    categoryName: "Méthodologie",
    title: "Méthodologie de travail",
    level: "Tous niveaux",
    duration: "6 modules",
    price: "Inclus Pro"
  },
  {
    id: 8,
    category: "skill",
    categoryName: "Méthodologie",
    title: "Prise de parole & confiance",
    level: "Jeunes",
    duration: "5 modules",
    price: "5 000 FCFA"
  },
  {
    id: 9,
    category: "science",
    categoryName: "Sciences",
    title: "Sciences Naturelles — Bases",
    level: "Collège",
    duration: "11 leçons",
    price: "Inclus Pro"
  }
];


/* =========================================================
   UTILITAIRES
   ========================================================= */

function escapeHTML(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeJS(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r");
}


/* =========================================================
   AFFICHAGE DES COURS
   ========================================================= */

function render(list = courses) {

  const courseGrid =
    document.querySelector("#courseGrid");

  if (!courseGrid) {
    console.warn("#courseGrid introuvable.");
    return;
  }

  if (!list.length) {

    courseGrid.innerHTML = `
      <div class="empty-state">
        <h3>Aucun cours trouvé</h3>
        <p>De nouveaux parcours arrivent bientôt.</p>
      </div>
    `;

    return;
  }

  courseGrid.innerHTML = list.map(courseData => `

    <article class="course">

      <span class="tag">
        ${escapeHTML(courseData.categoryName)}
      </span>

      <h3>
        ${escapeHTML(courseData.title)}
      </h3>

      <p>
        Vidéo + fiche + exercices corrigés +
        quiz + suivi de progression.
      </p>

      <div class="meta">
        ${escapeHTML(courseData.level)}
        ·
        ${escapeHTML(courseData.duration)}
        ·
        <b>${escapeHTML(courseData.price)}</b>
      </div>

      <br>

      <button
        class="btn soft"
        onclick="course(${courseData.id})"
      >
        Voir le parcours
      </button>

    </article>

  `).join("");
}


/* =========================================================
   FILTRAGE
   ========================================================= */

function filter(category, element) {

  document
    .querySelectorAll(".filters button")
    .forEach(button => {
      button.classList.remove("active");
    });

  if (element) {
    element.classList.add("active");
  }

  if (category === "all") {
    render(courses);
    return;
  }

  const filteredCourses =
    courses.filter(
      courseData =>
        courseData.category === category
    );

  render(filteredCourses);
}


/* =========================================================
   DÉTAIL D'UN COURS
   ========================================================= */

function course(courseId) {

  const selectedCourse =
    courses.find(
      courseData =>
        courseData.id === Number(courseId)
    );

  if (!selectedCourse) {
    alert("Cours introuvable.");
    return;
  }

  const modalContent =
    document.querySelector("#modalContent");

  const modal =
    document.querySelector("#modal");

  if (!modalContent || !modal) {
    return;
  }

  modalContent.innerHTML = `

    <span class="eyebrow">
      ${escapeHTML(selectedCourse.categoryName)}
    </span>

    <h2>
      ${escapeHTML(selectedCourse.title)}
    </h2>

    <p>
      <b>Niveau :</b>
      ${escapeHTML(selectedCourse.level)}
      <br>

      <b>Format :</b>
      ${escapeHTML(selectedCourse.duration)}
      <br>

      <b>Tarif :</b>
      ${escapeHTML(selectedCourse.price)}
    </p>

    <p>
      Ce parcours comprend des contenus
      pédagogiques structurés, des exercices
      corrigés, des quiz et un suivi de progression.
    </p>

    <button
      class="btn primary"
      onclick="buy(${selectedCourse.id})"
    >
      Accéder au parcours
    </button>

  `;

  modal.style.display = "grid";
}


/* =========================================================
   INSCRIPTION
   ========================================================= */

async function signUp() {

  if (!supabaseClient) {
    alert("Supabase n'est pas disponible.");
    return;
  }

  const nameElement =
    document.querySelector("#signupName");

  const phoneElement =
    document.querySelector("#signupPhone");

  const emailElement =
    document.querySelector("#signupEmail");

  const passwordElement =
    document.querySelector("#signupPassword");

  if (
    !nameElement ||
    !emailElement ||
    !passwordElement
  ) {
    alert("Formulaire d'inscription introuvable.");
    return;
  }

  const name =
    nameElement.value.trim();

  const phone =
    phoneElement
      ? phoneElement.value.trim()
      : "";

  const email =
    emailElement.value
      .trim()
      .toLowerCase();

  const password =
    passwordElement.value;

  if (!name || !email || !password) {
    alert(
      "Veuillez remplir le nom, l'e-mail et le mot de passe."
    );
    return;
  }

  if (password.length < 6) {
    alert(
      "Le mot de passe doit contenir au moins 6 caractères."
    );
    return;
  }

  try {

    const { data, error } =
      await supabaseClient.auth.signUp({

        email,
        password,

        options: {
          emailRedirectTo:
            window.location.origin +
            window.location.pathname,

          data: {
            full_name: name,
            phone: phone
          }
        }

      });

    if (error) {
      throw error;
    }

    if (!data.user) {

      alert(
        "Inscription enregistrée. " +
        "Consultez votre e-mail pour confirmer votre compte."
      );

      closeModal();

      return;
    }


    /* Création du profil */

    const {
      error: profileError
    } =
      await supabaseClient
        .from("profiles")
        .upsert({

          id: data.user.id,
          email: email,
          role: "eleve",
          nom: name,
          telephone: phone,
          progression: 0,
          cours_suivis: 0,
          moyenne: 0,
          quiz_reussis: 0

        }, {
          onConflict: "id"
        });


    if (profileError) {

      console.error(
        "Erreur profil :",
        profileError
      );

      alert(
        "Compte créé, mais le profil n'a pas pu être créé. " +
        "Nous vérifierons la configuration Supabase."
      );

      closeModal();

      return;
    }


    alert(
      "Inscription réussie ! " +
      "Bienvenue sur HamLearn 👋"
    );

    closeModal();

    updateAuthButton(data.user);

    await chargerProfil();

  } catch (error) {

    console.error(
      "Erreur inscription :",
      error
    );

    alert(
      "Erreur lors de l'inscription : " +
      error.message
    );
  }
}


/* =========================================================
   CONNEXION
   ========================================================= */

async function login() {

  if (!supabaseClient) {
    alert("Supabase n'est pas disponible.");
    return;
  }

  const emailElement =
    document.querySelector("#loginEmail");

  const passwordElement =
    document.querySelector("#loginPassword");

  if (!emailElement || !passwordElement) {
    alert(
      "Formulaire de connexion introuvable."
    );
    return;
  }

  const email =
    emailElement.value
      .trim()
      .toLowerCase();

  const password =
    passwordElement.value;

  if (!email || !password) {
    alert(
      "Veuillez saisir votre e-mail et votre mot de passe."
    );
    return;
  }

  try {

    const { data, error } =
      await supabaseClient.auth.signInWithPassword({

        email,
        password

      });

    if (error) {
      throw error;
    }

    alert(
      "Connexion réussie ! Bienvenue sur HamLearn 👋"
    );

    closeModal();

    updateAuthButton(data.user);

    await chargerProfil();

  } catch (error) {

    console.error(
      "Erreur connexion :",
      error
    );

    alert(
      "Connexion impossible : " +
      error.message
    );
  }
}


/* =========================================================
   DÉCONNEXION
   ========================================================= */

async function logout() {

  if (!supabaseClient) {
    return;
  }

  try {

    const { error } =
      await supabaseClient.auth.signOut();

    if (error) {
      throw error;
    }

    alert("Vous êtes déconnecté.");

    updateAuthButton(null);

    reinitialiserProfil();

  } catch (error) {

    console.error(
      "Erreur déconnexion :",
      error
    );

    alert(
      "Erreur lors de la déconnexion : " +
      error.message
    );
  }
}


/* =========================================================
   BOUTON AUTHENTIFICATION
   ========================================================= */

function updateAuthButton(user) {

  const buttons =
    document.querySelectorAll("header button");

  buttons.forEach(button => {

    const text =
      button.textContent.trim();

    if (
      text === "Se connecter" ||
      text === "Déconnexion"
    ) {

      if (user) {

        button.textContent =
          "Déconnexion";

        button.onclick = logout;

      } else {

        button.textContent =
          "Se connecter";

        button.onclick =
          () => openModal("login");

      }

    }

  });
}


/* =========================================================
   VÉRIFIER UTILISATEUR
   ========================================================= */

async function checkUser() {

  if (!supabaseClient) {
    return;
  }

  try {

    const {
      data: { user },
      error
    } =
      await supabaseClient.auth.getUser();

    if (error) {
      console.error(error);
      return;
    }

    updateAuthButton(user);

    if (user) {
      await chargerProfil();
    } else {
      reinitialiserProfil();
    }

  } catch (error) {

    console.error(
      "Erreur checkUser :",
      error
    );
  }
}


/* =========================================================
   CHARGER PROFIL
   ========================================================= */

async function chargerProfil() {

  if (!supabaseClient) {
    return;
  }

  try {

    const {
      data: { user }
    } =
      await supabaseClient.auth.getUser();

    if (!user) {
      return;
    }

    const {
      data: profil,
      error
    } =
      await supabaseClient
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

    if (error) {

      console.error(
        "Erreur profil :",
        error
      );

      return;
    }

    if (!profil) {

      reinitialiserProfil();

      return;
    }

    const progression =
      document.querySelector("#valProgression");

    const cours =
      document.querySelector("#valCours");

    const moyenne =
      document.querySelector("#valMoyenne");

    const quiz =
      document.querySelector("#valQuiz");


    if (progression) {
      progression.innerText =
        Number(profil.progression || 0) + "%";
    }

    if (cours) {
      cours.innerText =
        Number(profil.cours_suivis || 0);
    }

    if (moyenne) {
      moyenne.innerText =
        Number(profil.moyenne || 0) + "%";
    }

    if (quiz) {
      quiz.innerText =
        Number(profil.quiz_reussis || 0);
    }

  } catch (error) {

    console.error(
      "Erreur chargement profil :",
      error
    );
  }
}


/* =========================================================
   RÉINITIALISER PROFIL
   ========================================================= */

function reinitialiserProfil() {

  const progression =
    document.querySelector("#valProgression");

  const cours =
    document.querySelector("#valCours");

  const moyenne =
    document.querySelector("#valMoyenne");

  const quiz =
    document.querySelector("#valQuiz");


  if (progression) {
    progression.innerText = "0%";
  }

  if (cours) {
    cours.innerText = "0";
  }

  if (moyenne) {
    moyenne.innerText = "0%";
  }

  if (quiz) {
    quiz.innerText = "0";
  }
}


/* =========================================================
   MODALES
   ========================================================= */

function openModal(type) {

  const modal =
    document.querySelector("#modal");

  const modalContent =
    document.querySelector("#modalContent");

  if (!modal || !modalContent) {
    return;
  }

  let html = "";


  /* PARENT */

  if (type === "parent") {

    html = `

      <h2>Espace Parent</h2>

      <p>
        Suivez les résultats et la progression
        de votre enfant.
      </p>

      <input
        type="tel"
        placeholder="Téléphone"
      >

      <button
        class="btn primary"
        onclick="alert('Espace Parent — prochaine étape')"
      >
        Continuer
      </button>

    `;
  }


  /* ENSEIGNANT */

  else if (type === "teacher") {

    html = `

      <h2>Enseignant partenaire</h2>

      <p>
        Déposez votre candidature pour créer
        et enseigner sur HamLearn.
      </p>

      <input
        type="text"
        placeholder="Nom complet"
      >

      <input
        type="text"
        placeholder="Matière enseignée"
      >

      <input
        type="tel"
        placeholder="Téléphone"
      >

      <button
        class="btn primary"
        onclick="alert('Candidature enregistrée — prochaine étape')"
      >
        Candidater
      </button>

    `;
  }


  /* CONNEXION */

  else if (type === "login") {

    html = `

      <h2>Connexion à HamLearn</h2>

      <p>
        Connectez-vous à votre espace élève.
      </p>

      <input
        id="loginEmail"
        type="email"
        placeholder="Adresse e-mail"
        autocomplete="email"
      >

      <input
        id="loginPassword"
        type="password"
        placeholder="Mot de passe"
        autocomplete="current-password"
      >

      <button
        class="btn primary"
        onclick="login()"
      >
        Se connecter
      </button>

      <p style="margin-top:15px;">

        Pas encore de compte ?

        <button
          class="btn soft"
          onclick="openModal('signup')"
        >
          Créer un compte
        </button>

      </p>

    `;
  }


  /* INSCRIPTION */

  else {

    html = `

      <h2>Rejoindre HamLearn</h2>

      <p>
        Créez votre compte élève gratuitement.
      </p>

      <input
        id="signupName"
        type="text"
        placeholder="Nom complet"
        autocomplete="name"
      >

      <input
        id="signupPhone"
        type="tel"
        placeholder="Téléphone / WhatsApp"
        autocomplete="tel"
      >

      <input
        id="signupEmail"
        type="email"
        placeholder="Adresse e-mail"
        autocomplete="email"
      >

      <input
        id="signupPassword"
        type="password"
        placeholder="Mot de passe — 6 caractères minimum"
        autocomplete="new-password"
      >

      <button
        class="btn primary"
        onclick="signUp()"
      >
        Créer mon compte
      </button>

    `;
  }

  modalContent.innerHTML = html;

  modal.style.display = "grid";
}


/* =========================================================
   ACHAT COURS
   ========================================================= */

function buy(courseId) {

  const selectedCourse =
    courses.find(
      courseData =>
        courseData.id === Number(courseId)
    );

  if (!selectedCourse) {
    alert("Cours introuvable.");
    return;
  }

  const modalContent =
    document.querySelector("#modalContent");

  const modal =
    document.querySelector("#modal");

  if (!modalContent || !modal) {
    return;
  }

  if (
    selectedCourse.price === "Inclus Pro"
  ) {

    modalContent.innerHTML = `

      <h2>
        ${escapeHTML(selectedCourse.title)}
      </h2>

      <p>
        Ce parcours est inclus dans
        l'offre HamLearn Pro.
      </p>

      <button
        class="btn primary"
        onclick="openModal('login')"
      >
        Se connecter
      </button>

    `;

  } else {

    modalContent.innerHTML = `

      <h2>
        ${escapeHTML(selectedCourse.title)}
      </h2>

      <p>
        <b>Niveau :</b>
        ${escapeHTML(selectedCourse.level)}
      </p>

      <p>
        <b>Tarif :</b>
        ${escapeHTML(selectedCourse.price)}
      </p>

      <button
        class="btn primary"
        onclick="payerOrangeMoney(
          '${escapeJS(selectedCourse.title)}',
          '${escapeJS(selectedCourse.price)}'
        )"
      >
        Continuer vers le paiement
      </button>

    `;
  }

  modal.style.display = "grid";
}


/* =========================================================
   FERMER MODALE
   ========================================================= */

function closeModal() {

  const modal =
    document.querySelector("#modal");

  if (modal) {
    modal.style.display = "none";
  }
}


/* =========================================================
   PAIEMENT ORANGE MONEY
   ========================================================= */

function payerOrangeMoney(
  nomOffre,
  prix
) {

  const payModal =
    document.querySelector("#payModal");

  const payPlanInfo =
    document.querySelector("#payPlanInfo");

  if (!payModal || !payPlanInfo) {

    alert(
      "Fenêtre de paiement introuvable."
    );

    return;
  }

  payPlanInfo.innerText =
    nomOffre + " — " + prix;

  payModal.style.display = "block";
}


function closePayModal() {

  const payModal =
    document.querySelector("#payModal");

  if (payModal) {
    payModal.style.display = "none";
  }
}


/* =========================================================
   FERMETURE EN CLIQUANT À L'EXTÉRIEUR
   ========================================================= */

document.addEventListener(
  "click",
  function(event) {

    const modal =
      document.querySelector("#modal");

    const payModal =
      document.querySelector("#payModal");

    if (
      modal &&
      event.target === modal
    ) {
      closeModal();
    }

    if (
      payModal &&
      event.target === payModal
    ) {
      closePayModal();
    }

  }
);


/* =========================================================
   INITIALISATION
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  async function() {

    console.log(
      "🚀 HamLearn — Initialisation..."
    );

    render(courses);

    if (!supabaseClient) {

      console.error(
        "Supabase non disponible."
      );

      return;
    }

    await checkUser();


    /* Écoute des changements d'authentification */

    supabaseClient.auth.onAuthStateChange(
      (_event, session) => {

        const user =
          session?.user || null;

        updateAuthButton(user);

        if (user) {

          setTimeout(
            () => chargerProfil(),
            0
          );

        } else {

          reinitialiserProfil();

        }

      }
    );

    console.log(
      "✅ HamLearn est prêt."
    );

  }
);
