let etudiants = JSON.parse(localStorage.getItem("etudiants")) || [];
let editingIndex = -1;
let pageCourante = 1;
const PAR_PAGE = 5;

function sauvegarder() {
  localStorage.setItem("etudiants", JSON.stringify(etudiants));
}

function afficher(liste) {
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";

  const debut = (pageCourante - 1) * PAR_PAGE;
  const fin = debut + PAR_PAGE;
  const pagineeListe = liste.slice(debut, fin);

  if (pagineeListe.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center p-6 text-[#DBC5A1]/30">Aucun étudiant trouvé.</td>
      </tr>
    `;
    return;
  }

  pagineeListe.forEach((e, i) => {
    const indexReel = etudiants.indexOf(e);

    tbody.innerHTML += `
      <tr class="hover:bg-white/5 transition border-b border-white/5">
        <td class="p-3">${e.prenom}</td>
        <td class="p-3 font-medium uppercase">${e.nom}</td>
        <td class="p-3">${e.age} ans</td>
        <td class="p-3 font-bold text-[#DBC5A1]">${e.moyenne}/20</td>
        <td class="p-3 flex flex-wrap gap-2">
          <button onclick="ouvrirModalModifier(${indexReel})" class="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg text-xs transition">✏️ Modifier</button>
          <button onclick="voirDetails(${indexReel})" class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-xs transition">👁️ Détails</button>
          <button onclick="supprimer(${indexReel})" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs transition">🗑️ Supprimer</button>
        </td>
      </tr>
    `;
  });

  afficherPagination(liste);
  afficherStats();
}

function afficherPagination(liste) {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  const totalPages = Math.ceil(liste.length / PAR_PAGE);
  if (totalPages <= 1) return;

  for (let i = 1; i <= totalPages; i++) {
    const actif = i === pageCourante ? "bg-[#DBC5A1] text-[#2C0F12] font-bold" : "bg-white/10 text-[#DBC5A1] border border-white/10";
    pagination.innerHTML += `
      <button onclick="changerPage(${i})" class="${actif} px-3 py-1 rounded-lg hover:bg-white/20 transition text-sm">
        ${i}
      </button>
    `;
  }
}

function changerPage(num) {
  pageCourante = num;
  const texte = document.getElementById("recherche").value.toLowerCase();
  const filtre = etudiants.filter(e =>
    e.nom.toLowerCase().includes(texte) || e.prenom.toLowerCase().includes(texte)
  );
  afficher(filtre);
}

function afficherStats() {
  if (etudiants.length === 0) {
    document.getElementById("plusAge").textContent = "—";
    document.getElementById("meilleureAvg").textContent = "—";
    return;
  }

  const plusAge = etudiants.reduce((max, e) => e.age > max.age ? e : max, etudiants[0]);
  const meilleureAvg = etudiants.reduce((max, e) => e.moyenne > max.moyenne ? e : max, etudiants[0]);

  document.getElementById("plusAge").textContent = `${plusAge.prenom} ${plusAge.nom} — ${plusAge.age} ans`;
  document.getElementById("meilleureAvg").textContent = `${meilleureAvg.prenom} ${meilleureAvg.nom} — ${meilleureAvg.moyenne}/20`;
}

document.getElementById("recherche").addEventListener("input", function () {
  const texte = this.value.toLowerCase();
  pageCourante = 1;
  const filtre = etudiants.filter(e =>
    e.nom.toLowerCase().includes(texte) || e.prenom.toLowerCase().includes(texte)
  );
  afficher(filtre);
});

function ouvrirModalAjouter() {
  editingIndex = -1;
  document.getElementById("modalFormTitre").textContent = "Ajouter un étudiant";
  document.getElementById("formEtudiant").reset();
  document.getElementById("modalForm").classList.remove("hidden");
}

function ouvrirModalModifier(index) {
  editingIndex = index;
  const e = etudiants[index];
  document.getElementById("modalFormTitre").textContent = "Modifier l'étudiant";
  document.getElementById("champPrenom").value = e.prenom;
  document.getElementById("champNom").value = e.nom;
  document.getElementById("champAge").value = e.age;
  document.getElementById("champMoyenne").value = e.moyenne;
  document.getElementById("modalForm").classList.remove("hidden");
}

function fermerModalForm() {
  document.getElementById("modalForm").classList.add("hidden");
}

document.getElementById("formEtudiant").addEventListener("submit", function (event) {
  event.preventDefault();
  const prenom = document.getElementById("champPrenom").value.trim();
  const nom = document.getElementById("champNom").value.trim();
  const age = parseInt(document.getElementById("champAge").value);
  const moyenne = parseFloat(document.getElementById("champMoyenne").value);

  if (moyenne < 0 || moyenne > 20) {
    alert("La moyenne doit être comprise entre 0 et 20 !");
    return;
  }

  if (age < 0 || age > 40) {
    alert("La moyenne doit être comprise entre 0 et 20 !");
    return;
  }

  if (editingIndex === -1) {
    etudiants.push({ prenom, nom, age, moyenne });
  } else {
    etudiants[editingIndex] = { prenom, nom, age, moyenne };
    editingIndex = -1;
  }

  sauvegarder();
  fermerModalForm();
  afficher(etudiants);
});

function voirDetails(index) {
  const e = etudiants[index];
  document.getElementById("detailPrenom").textContent = e.prenom;
  document.getElementById("detailNom").textContent = e.nom;
  document.getElementById("detailAge").textContent = e.age + " ans";
  document.getElementById("detailMoyenne").textContent = e.moyenne + "/20";
  document.getElementById("modalDetails").classList.remove("hidden");
}

function fermerModalDetails() {
  document.getElementById("modalDetails").classList.add("hidden");
}

function supprimer(index) {
  if (!confirm("Confirmer la suppression ?")) return;
  etudiants.splice(index, 1);
  sauvegarder();
  const totalPages = Math.ceil(etudiants.length / PAR_PAGE);
  if (pageCourante > totalPages && pageCourante > 1) {
    pageCourante--;
  }
  afficher(etudiants);
}

afficher(etudiants);