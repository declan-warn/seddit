export default (model, update) => {
    const header = document.createElement("header");

    const btnLogin = document.createElement("button");
    btnLogin.setAttribute("data-id-login", "");
    btnLogin.textContent = "Log In";
    btnLogin.addEventListener("click", () => update("LOGIN_SHOW"));

    const signUp = document.createElement("button");
    signUp.setAttribute("data-id-signup", "");
    signUp.textContent = "Sign Up";
    signUp.addEventListener("click", () => update("SIGNUP_SHOW"));

    header.append(btnLogin, signUp);

    return header;
};