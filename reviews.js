// 1. Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD_anNibl8GqKce80LV0HyhkwYQoEtLzA0",
  authDomain: "sds-climatisation.firebaseapp.com",
  projectId: "sds-climatisation",
  storageBucket: "sds-climatisation.firebasestorage.app",
  messagingSenderId: "22619008323",
  appId: "1:22619008323:web:a950070f43e7e7291653f6"
};

// 2. Initialiser Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("reviewsContainer");
    const starTotalContainer = document.getElementById("googleStars");

    // Affichage des étoiles globales
    if (starTotalContainer) {
        starTotalContainer.innerHTML = '<i class="fa-solid fa-star"></i>'.repeat(5);
    }

    // ==========================================
    // PARTIE 1 : AFFICHAGE DIRECT DES AVIS
    // ==========================================
    if (container) {
        // On récupère TOUS les avis triés par date du plus récent au plus ancien
        db.collection("reviews")
          .orderBy("createdAt", "desc")
          .onSnapshot((snapshot) => {
            container.innerHTML = "";

            if (snapshot.empty) {
                container.innerHTML = "<p class='no-reviews'>Aucun avis pour le moment. Soyez le premier !</p>";
                return;
            }

            snapshot.forEach((doc) => {
                const rev = doc.data();
                
                const card = document.createElement("div");
                card.className = "review-card";
                card.innerHTML = `
                    <div class="review-user">
                        <div class="user-info">
                            <h5>${rev.name}</h5>
                            <span class="review-date">${rev.date}</span>
                        </div>
                        <i class="fa-solid fa-user-check user-avatar-icon"></i>
                    </div>
                    <div class="review-stars">
                        ${'<i class="fa-solid fa-star"></i>'.repeat(rev.rating || 5)}
                    </div>
                    <p class="review-text">"${rev.comment}"</p>
                    <div class="verified-badge"><i class="fa-solid fa-circle-check"></i> Avis vérifié</div>
                `;
                container.appendChild(card);
            });
        }, (error) => {
            console.error("Erreur d'affichage :", error);
            container.innerHTML = "<p>Impossible de charger les avis.</p>";
        });
    }

    // ==========================================
    // PARTIE 2 : ENVOI INSTANTANÉ DE L'AVIS
    // ==========================================
    const openBtn = document.getElementById("openReviewBtn");
    const cancelBtn = document.getElementById("cancelReviewBtn");
    const formContainer = document.getElementById("reviewFormContainer");
    const addReviewForm = document.getElementById("addReviewForm");
    const formMessage = document.getElementById("formMessage");

    if (openBtn && formContainer) {
        openBtn.addEventListener("click", () => {
            formContainer.classList.remove("hidden");
            openBtn.classList.add("hidden");
        });
    }

    if (cancelBtn && formContainer) {
        cancelBtn.addEventListener("click", () => {
            formContainer.classList.add("hidden");
            openBtn.classList.remove("hidden");
            addReviewForm.reset();
        });
    }

    if (addReviewForm) {
        addReviewForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const name = document.getElementById("revName").value.trim();
            const comment = document.getElementById("revComment").value.trim();
            const ratingSelected = document.querySelector('input[name="revRating"]:checked');
            const rating = ratingSelected ? parseInt(ratingSelected.value) : 5;

            const today = new Date();
            const dateStr = today.toLocaleDateString("fr-FR");

            // Objet simplifié : plus de champ status !
            const newReview = {
                name: name,
                rating: rating,
                comment: comment,
                date: dateStr,
                createdAt: firebase.firestore.FieldValue.serverTimestamp() // Permet le tri automatique instantané
            };

            db.collection("reviews").add(newReview)
            .then(() => {
                addReviewForm.reset();
                formMessage.innerText = "Merci ! Votre avis a été publié avec succès.";
                formMessage.className = "form-message success";
                
                setTimeout(() => {
                    formContainer.classList.add("hidden");
                    openBtn.classList.remove("hidden");
                    formMessage.className = "form-message hidden";
                }, 3000);
            })
            .catch((error) => {
                console.error("Erreur d'envoi :", error);
                formMessage.innerText = "Une erreur est survenue.";
                formMessage.className = "form-message error";
            });
        });
    }
});