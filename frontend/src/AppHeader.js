export function withHeader(model, update, component) {
    component.prepend(AppHeader(model, update));
    return component;
};

export default function AppHeader(model, update) {
    const header = document.createElement("header");

    if (model.token === null) {
        const btnLogin = document.createElement("button");
        btnLogin.setAttribute("data-id-login", "");
        btnLogin.textContent = "Log In";
        btnLogin.addEventListener("click", () => update("LOGIN_SHOW"));

        const signUp = document.createElement("button");
        signUp.setAttribute("data-id-signup", "");
        signUp.textContent = "Sign Up";
        signUp.addEventListener("click", () => update("SIGNUP_SHOW"));

        header.append(btnLogin, signUp);
    } else {
        const signout = document.createElement("button");
        signout.textContent = "Sign Out";
        signout.addEventListener("click", () => update("SIGNOUT"));

        const submit = document.createElement("button");
        submit.textContent = "Submit";
        submit.addEventListener("click", () => update("SUBMIT_SHOW"));

        const profile = document.createElement("button");
        profile.textContent = "Profile";
        profile.addEventListener("click", () => update("PROFILE_SHOW"));

        header.append(signout, submit, profile);
    }

    return header;
};