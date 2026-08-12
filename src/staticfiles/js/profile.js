document.addEventListener("DOMContentLoaded", () => {

    const profilePage =
        document.querySelector(".profile-page");


    if (!profilePage) {
        return;
    }


    const editForm =
        profilePage.querySelector("form");


    if (!editForm) {
        return;
    }


    const submitButton =
        editForm.querySelector(
            'button[type="submit"]'
        );


    if (!submitButton) {
        return;
    }


    const originalText =
        submitButton.textContent.trim();


    editForm.addEventListener("submit", () => {

        submitButton.disabled = true;

        submitButton.textContent =
            "Saving...";

    });


    // Warn the user if they try to leave
    // after changing something.
    let hasChanges = false;


    const fields =
        editForm.querySelectorAll(
            "input, textarea, select"
        );


    fields.forEach((field) => {

        const originalValue =
            field.value;


        field.addEventListener("input", () => {

            hasChanges =
                field.value !== originalValue;

        });

    });


    window.addEventListener(
        "beforeunload",
        (event) => {

            if (!hasChanges) {
                return;
            }


            event.preventDefault();

            event.returnValue = "";

        }
    );


    // Don't show the warning when submitting.
    editForm.addEventListener("submit", () => {

        hasChanges = false;

        submitButton.textContent =
            originalText;

    });


    // Don't show the warning when cancelling.
    const cancelButton =
        profilePage.querySelector(
            'a[href*="profile"]'
        );


    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            () => {
                hasChanges = false;
            }
        );

    }

});