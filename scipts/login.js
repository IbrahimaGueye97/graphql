import { Home } from "../views/home/home.js";
import { body } from "../views/index.js";
import { encodeBase64 } from "./encodeBase64.js";
import { fetchData } from "./fetchData.js";

export const loginHandler = async () => {
  const jwt = localStorage.getItem("jwt");

  const disconnectButtonHandler = () => {
    localStorage.removeItem("jwt");
    window.location.reload(); // Recharger la page après la déconnexion
  };

  if (jwt) {
    // Si le JWT existe déjà, afficher la page d'accueil
    body.innerHTML = new Home().getHtml();
    fetchData(jwt);

    // Attacher l'écouteur d'événements de déconnexion
    const disconnectButton = document.querySelector(".disconnect");
    disconnectButton.addEventListener("click", disconnectButtonHandler);
  } else {
    // Si le JWT n'existe pas, attendez la soumission du formulaire de connexion
    const form = document.querySelector("#submit");

    form.addEventListener("click", async (event) => {
      event.preventDefault(); // Empêcher la soumission par défaut du formulaire

      const userName = document.querySelector("#user_name").value;
      const password = document.querySelector("#password").value;

      if (!userName || !password) {
        let errorMessage = document.querySelector(".links");
        errorMessage.innerHTML = "Please enter a username and password";
        console.log("Please enter a username and password");
        return;
      }

      const infoEncode = encodeBase64(userName, password);

      try {
        const reponse = await fetch(
          "https://learn.zone01dakar.sn/api/auth/signin",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `basic ${infoEncode}`,
            },
          }
        );

        if (!reponse.ok) {
          let errorMessage = document.querySelector(".links");
          errorMessage.innerHTML = "Failed to sign in";
          return;
        }

        const data = await reponse.json();
        const jwt = data;

        localStorage.setItem("jwt", jwt);

        // Afficher la page d'accueil après avoir récupéré le JWT
        body.innerHTML = new Home().getHtml();
        fetchData(jwt);

        // Attacher l'écouteur d'événements de déconnexion
        const disconnectButton = document.querySelector(".disconnect");
        disconnectButton.addEventListener("click", disconnectButtonHandler);
      } catch (error) {
        console.log("Error signing in", error.message);
      }
    });
  }

};
