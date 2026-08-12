import * as pdfjsLib from
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs";


document.addEventListener("DOMContentLoaded", () => {

    /*
     * -----------------------------------------------------
     * AUDIO PLAYER
     * -----------------------------------------------------
     */

    const audio =
        document.getElementById("audio-source");

    if (audio) {

        const playButton =
            document.getElementById("audio-play");

        const backButton =
            document.getElementById("audio-back");

        const forwardButton =
            document.getElementById("audio-forward");

        const progress =
            document.getElementById("audio-progress");

        const volume =
            document.getElementById("audio-volume");

        const currentTime =
            document.getElementById("audio-current");

        const duration =
            document.getElementById("audio-duration");


        function formatTime(seconds) {

            if (!Number.isFinite(seconds)) {
                return "0:00";
            }

            const minutes =
                Math.floor(seconds / 60);

            const remaining =
                Math.floor(seconds % 60);

            return `${minutes}:${String(
                remaining
            ).padStart(2, "0")}`;
        }


        function updatePlayButton() {

            playButton.textContent =
                audio.paused
                    ? "▶"
                    : "Ⅱ";
        }


        playButton.addEventListener(
            "click",
            () => {

                if (audio.paused) {
                    audio.play();
                } else {
                    audio.pause();
                }

            }
        );


        backButton.addEventListener(
            "click",
            () => {

                audio.currentTime =
                    Math.max(
                        0,
                        audio.currentTime - 10
                    );

            }
        );


        forwardButton.addEventListener(
            "click",
            () => {

                audio.currentTime =
                    Math.min(
                        audio.duration || 0,
                        audio.currentTime + 10
                    );

            }
        );


        audio.addEventListener(
            "loadedmetadata",
            () => {

                duration.textContent =
                    formatTime(audio.duration);

            }
        );


        audio.addEventListener(
            "timeupdate",
            () => {

                currentTime.textContent =
                    formatTime(audio.currentTime);

                if (audio.duration) {

                    progress.value =
                        (
                            audio.currentTime /
                            audio.duration
                        ) * 100;

                }

            }
        );


        progress.addEventListener(
            "input",
            () => {

                if (!audio.duration) {
                    return;
                }

                audio.currentTime =
                    (
                        Number(progress.value) /
                        100
                    ) * audio.duration;

            }
        );


        volume.addEventListener(
            "input",
            () => {

                audio.volume =
                    Number(volume.value);

            }
        );


        audio.addEventListener(
            "play",
            updatePlayButton
        );

        audio.addEventListener(
            "pause",
            updatePlayButton
        );

        audio.addEventListener(
            "ended",
            updatePlayButton
        );

    }


    /*
     * -----------------------------------------------------
     * PDF READER
     * -----------------------------------------------------
     */

    const canvas =
        document.getElementById("pdf-canvas");

    if (!canvas) {
        return;
    }


    const stage =
        document.getElementById("pdf-stage");

    const loading =
        document.getElementById("pdf-loading");

    const pageNumber =
        document.getElementById("pdf-page-number");

    const pageCount =
        document.getElementById("pdf-page-count");

    const previousButton =
        document.getElementById("pdf-prev");

    const nextButton =
        document.getElementById("pdf-next");

    const zoomIn =
        document.getElementById("pdf-zoom-in");

    const zoomOut =
        document.getElementById("pdf-zoom-out");

    const zoomValue =
        document.getElementById("pdf-zoom-value");


    const pdfSource =
        document.body.dataset.pdf;


    let pdfDocument = null;

    let currentPage = 1;

    let zoom = 1;


    async function renderPage(number) {

        if (!pdfDocument) {
            return;
        }


        const page =
            await pdfDocument.getPage(number);


        const viewport =
            page.getViewport({
                scale: zoom
            });


        const context =
            canvas.getContext("2d");


        canvas.width =
            viewport.width;

        canvas.height =
            viewport.height;


        await page.render({
            canvasContext: context,
            viewport: viewport,
        }).promise;


        pageNumber.textContent =
            number;

        pageCount.textContent =
            pdfDocument.numPages;

        zoomValue.textContent =
            `${Math.round(zoom * 100)}%`;


        previousButton.disabled =
            number <= 1;

        nextButton.disabled =
            number >= pdfDocument.numPages;


        loading.style.display =
            "none";

    }


    async function loadPdf() {

        if (!pdfSource) {

            loading.textContent =
                "No PDF was uploaded for this book.";

            return;
        }


        try {

            pdfDocument =
                await pdfjsLib.getDocument(
                    pdfSource
                ).promise;


            await renderPage(
                currentPage
            );

        } catch (error) {

            console.error(
                "Could not load PDF:",
                error
            );

            loading.textContent =
                "Could not load this book.";

        }

    }


    previousButton.addEventListener(
        "click",
        async () => {

            if (
                !pdfDocument ||
                currentPage <= 1
            ) {
                return;
            }

            currentPage--;

            await renderPage(
                currentPage
            );

            stage.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );


    nextButton.addEventListener(
        "click",
        async () => {

            if (
                !pdfDocument ||
                currentPage >=
                    pdfDocument.numPages
            ) {
                return;
            }

            currentPage++;

            await renderPage(
                currentPage
            );

            stage.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );


    zoomIn.addEventListener(
        "click",
        async () => {

            zoom =
                Math.min(
                    2.5,
                    zoom + 0.1
                );

            await renderPage(
                currentPage
            );

        }
    );


    zoomOut.addEventListener(
        "click",
        async () => {

            zoom =
                Math.max(
                    0.5,
                    zoom - 0.1
                );

            await renderPage(
                currentPage
            );

        }
    );


    document.addEventListener(
        "keydown",
        async (event) => {

            if (!pdfDocument) {
                return;
            }


            if (event.key === "ArrowLeft") {

                if (currentPage > 1) {

                    currentPage--;

                    await renderPage(
                        currentPage
                    );

                }

            }


            if (event.key === "ArrowRight") {

                if (
                    currentPage <
                    pdfDocument.numPages
                ) {

                    currentPage++;

                    await renderPage(
                        currentPage
                    );

                }

            }

        }
    );


    loadPdf();

});