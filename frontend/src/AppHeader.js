export default (model, update) => {
    const header = document.createElement("header");

    const btnLogin = document.createElement("button");
    btnLogin.setAttribute("data-id-login", "");
    btnLogin.textContent = "Log In";
    btnLogin.addEventListener("click", () => update("LOGIN_SHOW"));

    header.appendChild(btnLogin);

    return header;
};