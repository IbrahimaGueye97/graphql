import { loginHandler } from "../scipts/login.js";
import { Login } from "./login/login.js";

export const body = document.querySelector("body");
const jwt = localStorage.getItem("jwt");
console.log(jwt);
const contente = new Login().getHtml();
body.innerHTML = contente;
loginHandler();
