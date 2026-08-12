document.addEventListener("DOMContentLoaded", () => {
    const authForms = document.querySelectorAll(".auth-card form");

    authForms.forEach((form) => {
        const passwordInputs = form.querySelectorAll(
            'input[type="password"]'
        );

        if (!passwordInputs.length) {
            return;
        }

        const passwordInput = passwordInputs[0];
        const confirmationInput = passwordInputs[1];

        // Add the show/hide button to every password field.
        passwordInputs.forEach((input) => {
            createPasswordToggle(input);
        });

        /*
         * Signup has two password fields.
         * Login only has one.
         *
         * This means password requirements are only
         * shown on the signup page.
         */
        if (confirmationInput) {
            createPasswordRequirements(passwordInput);

            passwordInput.addEventListener("input", () => {
                updatePasswordRequirements(passwordInput);
            });

            confirmationInput.addEventListener("input", () => {
                updatePasswordMatch(
                    passwordInput,
                    confirmationInput
                );
            });
        }

        form.addEventListener("submit", (event) => {
            let valid = true;

            form.querySelectorAll("input[required]").forEach((input) => {
                clearClientError(input);

                if (!input.value.trim()) {
                    valid = false;

                    showClientError(
                        input,
                        "This field is required."
                    );
                }
            });

            /*
             * Only validate password requirements when this
             * is the signup form.
             */
            if (confirmationInput) {
                const password = passwordInput.value;

                if (!isPasswordValid(password)) {
                    valid = false;
                }

                if (
                    passwordInput.value !==
                    confirmationInput.value
                ) {
                    valid = false;

                    clearClientError(confirmationInput);

                    showClientError(
                        confirmationInput,
                        "Passwords do not match."
                    );
                }
            }

            if (!valid) {
                event.preventDefault();
            }
        });
    });


    /*
     * Creates the password requirement box.
     */
    function createPasswordRequirements(input) {
        const requirements = document.createElement("div");

        requirements.className = "password-requirements";

        requirements.innerHTML = `
            <p>Password must contain:</p>

            <div class="password-requirement" data-rule="length">
                <span class="requirement-icon">×</span>
                <span>At least 8 characters</span>
            </div>

            <div class="password-requirement" data-rule="uppercase">
                <span class="requirement-icon">×</span>
                <span>One uppercase letter</span>
            </div>

            <div class="password-requirement" data-rule="lowercase">
                <span class="requirement-icon">×</span>
                <span>One lowercase letter</span>
            </div>

            <div class="password-requirement" data-rule="number">
                <span class="requirement-icon">×</span>
                <span>One number</span>
            </div>

            <div class="password-requirement" data-rule="special">
                <span class="requirement-icon">×</span>
                <span>One special character</span>
            </div>
        `;

        input.closest(".password-wrapper")
            .insertAdjacentElement(
                "afterend",
                requirements
            );
    }


    /*
     * Updates each password requirement while the
     * user is typing.
     */
    function updatePasswordRequirements(input) {
        const password = input.value;

        const wrapper = input.closest(".password-wrapper");

        if (!wrapper) {
            return;
        }

        const requirements =
            wrapper.parentNode.querySelector(
                ".password-requirements"
            );

        if (!requirements) {
            return;
        }

        const rules = {
            length: password.length >= 8,

            uppercase: /[A-Z]/.test(password),

            lowercase: /[a-z]/.test(password),

            number: /[0-9]/.test(password),

            special: /[^A-Za-z0-9]/.test(password)
        };

        Object.entries(rules).forEach(([rule, passed]) => {
            const element =
                requirements.querySelector(
                    `[data-rule="${rule}"]`
                );

            if (!element) {
                return;
            }

            const icon =
                element.querySelector(
                    ".requirement-icon"
                );

            element.classList.toggle(
                "valid",
                passed
            );

            icon.textContent = passed
                ? "✓"
                : "×";
        });
    }


    /*
     * Checks all signup password requirements.
     */
    function isPasswordValid(password) {
        return (
            password.length >= 8 &&
            /[A-Z]/.test(password) &&
            /[a-z]/.test(password) &&
            /[0-9]/.test(password) &&
            /[^A-Za-z0-9]/.test(password)
        );
    }


    /*
     * Gives instant feedback when the two signup
     * passwords do not match.
     */
    function updatePasswordMatch(
        passwordInput,
        confirmationInput
    ) {
        confirmationInput.classList.remove(
            "password-match",
            "password-mismatch"
        );

        if (!confirmationInput.value) {
            return;
        }

        const matches =
            passwordInput.value ===
            confirmationInput.value;

        confirmationInput.classList.toggle(
            "password-match",
            matches
        );

        confirmationInput.classList.toggle(
            "password-mismatch",
            !matches
        );
    }


    /*
     * Adds the eye button to a password input.
     */
    function createPasswordToggle(input) {
        const wrapper = document.createElement("div");

        wrapper.className = "password-wrapper";

        input.parentNode.insertBefore(
            wrapper,
            input
        );

        wrapper.appendChild(input);

        const button = document.createElement("button");

        button.type = "button";

        button.className = "password-toggle";

        button.setAttribute(
            "aria-label",
            "Show password"
        );

        button.setAttribute(
            "aria-pressed",
            "false"
        );

        button.innerHTML = `
            <svg
                class="eye-icon eye-open"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M2.5 12C2.5 12 6 5.5 12 5.5
                       S21.5 12 21.5 12
                       S18 18.5 12 18.5
                       S2.5 12 2.5 12Z"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />

                <circle
                    cx="12"
                    cy="12"
                    r="3"
                    stroke="currentColor"
                    stroke-width="1.8"
                />
            </svg>

            <svg
                class="eye-icon eye-closed"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M3 3L21 21"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                />

                <path
                    d="M10.6 5.7C11.05 5.57 11.52 5.5 12 5.5
                       C18 5.5 21.5 12 21.5 12
                       C20.75 13.4 19.7 14.65 18.5 15.65"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />

                <path
                    d="M6.1 6.1C4.55 7.4 3.35 9.15 2.5 12
                       C2.5 12 6 18.5 12 18.5
                       C13.45 18.5 14.8 18.15 16 17.55"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />

                <path
                    d="M9.9 9.9C9.35 10.45 9 11.2 9 12
                       C9 13.65 10.35 15 12 15
                       C12.8 15 13.55 14.65 14.1 14.1"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                />
            </svg>
        `;

        wrapper.appendChild(button);

        button.addEventListener("click", () => {
            const isVisible = input.type === "text";

            input.type = isVisible
                ? "password"
                : "text";

            button.classList.toggle(
                "visible",
                !isVisible
            );

            button.setAttribute(
                "aria-label",
                isVisible
                    ? "Show password"
                    : "Hide password"
            );

            button.setAttribute(
                "aria-pressed",
                String(!isVisible)
            );

            input.focus();
        });
    }


    /*
     * Shows a client-side validation error.
     */
    function showClientError(input, message) {
        input.classList.add("input-error");

        const parent = input.parentNode;

        const error = document.createElement("div");

        error.className =
            "client-field-error";

        error.textContent = message;

        parent.appendChild(error);
    }


    /*
     * Removes a client-side validation error.
     */
    function clearClientError(input) {
        input.classList.remove(
            "input-error"
        );

        const oldError =
            input.parentNode.querySelector(
                ".client-field-error"
            );

        if (oldError) {
            oldError.remove();
        }
    }
});