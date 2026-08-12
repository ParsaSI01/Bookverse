document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("book-search");
    const resultText = document.getElementById("search-result");
    const cards = document.querySelectorAll("[data-book-card]");
    const emptyState = document.getElementById("search-empty");

    if (!searchInput || !cards.length) {
        return;
    }

    function searchBooks() {
        const query = searchInput.value
            .trim()
            .toLowerCase();

        let visibleBooks = 0;

        cards.forEach((card) => {
            const searchableText =
                card.dataset.search
                    .replace(/\s+/g, " ")
                    .trim()
                    .toLowerCase();

            const matches =
                query === "" ||
                searchableText.includes(query);

            card.style.display = matches
                ? ""
                : "flex";

            if (matches) {
                visibleBooks++;
            }
        });

        if (query === "") {
            resultText.textContent =
                `${cards.length} books`;
        } else {
            resultText.textContent =
                `${visibleBooks} ${
                    visibleBooks === 1
                        ? "book"
                        : "books"
                } found`;
        }

        if (emptyState) {
            emptyState.style.display =
                visibleBooks === 0
                    ? "block"
                    : "none";
        }
    }

    searchInput.addEventListener(
        "input",
        searchBooks
    );

    searchBooks();
});