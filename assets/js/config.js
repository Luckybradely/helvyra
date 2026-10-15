/* Configuration du site HELVYRA.
   formEndpoint : URL d'un service d'envoi de formulaire (ex. Formspree ou Netlify Forms).
   web3formsKey : clé d'accès Web3Forms (clé publique par conception, liée à l'adresse de réception). Si elle est remplie, le formulaire envoie via Web3Forms.
   Tant que les deux sont vides, le formulaire valide les champs mais N'ENVOIE RIEN et le dit au visiteur.
   Ne jamais mettre de clé secrète ici : ce fichier est public. */
window.HELVYRA_CONFIG = {
  formEndpoint: "",
  web3formsKey: "7ded4f64-f88d-4923-a8e0-ef2fcde03d5c",
  contactEmail: "contact@helvyra.fr"
};
