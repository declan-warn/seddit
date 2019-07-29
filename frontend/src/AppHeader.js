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

    const submit = document.createElement("button");
    submit.textContent = "Submit";
    submit.addEventListener("click", () => update("SUBMIT_SHOW"));

    header.append(btnLogin, signUp, submit);

    return header;
};