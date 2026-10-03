/* =========================
   GALLERY
========================= */

const grid = document.getElementById("galleryGrid");
const more = document.getElementById("galleryMore");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");
const lightboxCounter = document.getElementById("lightboxCounter");
const toast = document.getElementById("toast");

const galleryPhotoCount = 31;
let currentPhotoIndex = 1;
let touchStartX = 0;
let touchEndX = 0;


/* =========================
   갤러리 실제 사진 31장 생성
========================= */

for (let i = 1; i <= 31; i++) {

    const slot = document.createElement("div");

    /*
       1번 = 메인사진
       2~7번 = 처음 보이는 1:1 사진 2줄
    */

    slot.className =
        "photo-slot" + (i <= 7 ? " visible" : "");

    slot.dataset.index = i;


    /* 이미지 생성 */

    const img = document.createElement("img");

    img.src = `images/${i}.jpg`;
    img.alt = `웨딩사진 ${i}`;
    img.loading = i === 1 ? "eager" : "lazy";


    /* =========================
       사진 클릭 → 크게 보기
    ========================= */

    img.addEventListener("click", () => {

        currentPhotoIndex = i;
        openLightbox();

    });


    slot.appendChild(img);
    grid.appendChild(slot);

}


/* =========================
   사진 더보기
========================= */

let expanded = false;

more.addEventListener("click", () => {

    expanded = !expanded;

    document
        .querySelectorAll(".photo-slot")
        .forEach((el, index) => {

            /*
               처음 상태
               1번 메인 + 2~7번까지 표시

               더보기
               31장 전부 표시
            */

            el.classList.toggle(
                "visible",
                expanded || index < 7
            );

        });


    more.textContent =
        expanded ? "사진 접기" : "사진 더보기";

});


/* =========================
   ACCOUNT COPY
========================= */

document
    .querySelectorAll(".copy-btn")
    .forEach(btn => {

        btn.addEventListener("click", async () => {

            try {

                await navigator.clipboard.writeText(
                    btn.dataset.account
                );

                toast.textContent =
                    "계좌번호가 복사되었습니다.";

            } catch {

                const ta =
                    document.createElement("textarea");

                ta.value =
                    btn.dataset.account;

                document.body.appendChild(ta);

                ta.select();

                document.execCommand("copy");

                ta.remove();

                toast.textContent =
                    "계좌번호가 복사되었습니다.";

            }

            toast.classList.add("show");

            setTimeout(() => {

                toast.classList.remove("show");

            }, 1600);

        });

    });


/* =========================
   LIGHTBOX
========================= */

function updateLightboxImage() {

    lightboxImage.src =
        `images/${currentPhotoIndex}.jpg`;

    lightboxImage.alt =
        `웨딩사진 ${currentPhotoIndex}`;


    /* 현재 사진 번호 */

    if (lightboxCounter) {

        lightboxCounter.textContent =
            `${currentPhotoIndex} / ${galleryPhotoCount}`;

    }

}


/* 확대창 열기 */

function openLightbox() {

    updateLightboxImage();

    lightbox.classList.add("open");

    lightbox.setAttribute(
        "aria-hidden",
        "false"
    );

    /* 뒤쪽 페이지 스크롤 잠금 */

    document.body.style.overflow =
        "hidden";

}


/* 이전 사진 */

function showPreviousPhoto() {

    currentPhotoIndex =
        currentPhotoIndex <= 1
            ? galleryPhotoCount
            : currentPhotoIndex - 1;

    updateLightboxImage();

}


/* 다음 사진 */

function showNextPhoto() {

    currentPhotoIndex =
        currentPhotoIndex >= galleryPhotoCount
            ? 1
            : currentPhotoIndex + 1;

    updateLightboxImage();

}


/* 확대창 닫기 */

function closeLightbox() {

    lightbox.classList.remove("open");

    lightbox.setAttribute(
        "aria-hidden",
        "true"
    );

    /*
       확대창 닫은 뒤
       페이지 스크롤 다시 활성화
    */

    document.body.style.overflow =
        "";

}


/* =========================
   확대창 버튼
========================= */


/* X 버튼 */

lightboxClose.addEventListener(
    "click",
    closeLightbox
);


/* 왼쪽 버튼 */

lightboxPrev.addEventListener(
    "click",
    e => {

        e.stopPropagation();

        showPreviousPhoto();

    }
);


/* 오른쪽 버튼 */

lightboxNext.addEventListener(
    "click",
    e => {

        e.stopPropagation();

        showNextPhoto();

    }
);


/* 검은 배경 누르면 닫기 */

lightbox.addEventListener(
    "click",
    e => {

        if (e.target === lightbox) {

            closeLightbox();

        }

    }
);


/* =========================
   PC 키보드
========================= */

document.addEventListener(
    "keydown",
    e => {

        /*
           확대창이 열려있지 않으면
           아무것도 하지 않음
        */

        if (
            !lightbox.classList.contains("open")
        ) {

            return;

        }


        /* 왼쪽 방향키 */

        if (e.key === "ArrowLeft") {

            showPreviousPhoto();

        }


        /* 오른쪽 방향키 */

        if (e.key === "ArrowRight") {

            showNextPhoto();

        }


        /* ESC */

        if (e.key === "Escape") {

            closeLightbox();

        }

    }
);


/* =========================
   모바일 스와이프
========================= */


/* 손가락을 처음 댄 위치 */

lightbox.addEventListener(
    "touchstart",
    e => {

        touchStartX =
            e.changedTouches[0].screenX;

    },
    {
        passive: true
    }
);


/* 손가락을 뗀 위치 */

lightbox.addEventListener(
    "touchend",
    e => {

        touchEndX =
            e.changedTouches[0].screenX;


        const swipeDistance =
            touchEndX - touchStartX;


        /*
           50px 이하 움직임은
           스와이프로 처리하지 않음
        */

        if (
            Math.abs(swipeDistance) < 50
        ) {

            return;

        }


        /*
           오른쪽으로 밀기
           → 이전 사진
        */

        if (swipeDistance > 0) {

            showPreviousPhoto();

        }


        /*
           왼쪽으로 밀기
           → 다음 사진
        */

        else {

            showNextPhoto();

        }

    },
    {
        passive: true
    }
);


/* =========================
   WEDDING COUNTDOWN
========================= */

const weddingDate =
    new Date("2027-01-17T13:00:00+09:00");


function updateCountdown() {

    const now = new Date();

    const distance =
        weddingDate - now;


    if (distance <= 0) {

        document.getElementById("days").textContent = "000";
        document.getElementById("hours").textContent = "00";
        document.getElementById("minutes").textContent = "00";
        document.getElementById("seconds").textContent = "00";

        return;

    }


    const days =
        Math.floor(
            distance /
            (1000 * 60 * 60 * 24)
        );


    const hours =
        Math.floor(
            (distance /
            (1000 * 60 * 60)) % 24
        );


    const minutes =
        Math.floor(
            (distance /
            (1000 * 60)) % 60
        );


    const seconds =
        Math.floor(
            (distance / 1000) % 60
        );


    document
        .getElementById("days")
        .textContent =
        String(days).padStart(3, "0");


    document
        .getElementById("hours")
        .textContent =
        String(hours).padStart(2, "0");


    document
        .getElementById("minutes")
        .textContent =
        String(minutes).padStart(2, "0");


    document
        .getElementById("seconds")
        .textContent =
        String(seconds).padStart(2, "0");

}


updateCountdown();

setInterval(
    updateCountdown,
    1000
);


/* =========================
   축하 메시지
========================= */

const guestbookForm =
    document.getElementById(
        "guestbookForm"
    );

const guestName =
    document.getElementById(
        "guestbookName"
    );

const guestMessage =
    document.getElementById(
        "guestbookMessage"
    );

const guestbookList =
    document.getElementById(
        "guestbookList"
    );

const guestbookEmpty =
    document.getElementById(
        "guestbookEmpty"
    );

const guestbookPagination =
    document.getElementById(
        "guestbookPagination"
    );


/* 한 페이지에 보여줄 메시지 수 */

const messagesPerPage = 5;


/* 현재 페이지 */

let currentGuestbookPage = 1;


/* =========================
   저장된 메시지 불러오기
========================= */

let guestbookMessages = [];


try {

    guestbookMessages =
        JSON.parse(
            localStorage.getItem(
                "weddingGuestbook"
            )
        ) || [];

}

catch (error) {

    guestbookMessages = [];

}


/* =========================
   날짜 만들기
========================= */

function getToday() {

    const today =
        new Date();

    const year =
        today.getFullYear();

    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            today.getDate()
        ).padStart(2, "0");

    return `${year}.${month}.${day}`;

}


/* =========================
   페이지네이션 만들기
========================= */

function renderGuestbookPagination() {

    guestbookPagination.innerHTML =
        "";


    const totalPages =
        Math.ceil(
            guestbookMessages.length /
            messagesPerPage
        );


    /*
       메시지가 5개 이하라면
       페이지 번호 숨김
    */

    if (totalPages <= 1) {

        guestbookPagination.style.display =
            "none";

        return;

    }


    guestbookPagination.style.display =
        "flex";


    /* 이전 버튼 */

    const prevButton =
        document.createElement("button");

    prevButton.type =
        "button";

    prevButton.className =
        "guestbook-page-btn";

    prevButton.textContent =
        "‹";

    prevButton.disabled =
        currentGuestbookPage === 1;


    prevButton.addEventListener(
        "click",
        () => {

            if (
                currentGuestbookPage > 1
            ) {

                currentGuestbookPage--;

                renderGuestbook();

            }

        }
    );


    guestbookPagination.appendChild(
        prevButton
    );


    /* 페이지 숫자 */

    for (
        let page = 1;
        page <= totalPages;
        page++
    ) {

        const pageButton =
            document.createElement(
                "button"
            );

        pageButton.type =
            "button";

        pageButton.className =
            "guestbook-page-btn";


        if (
            page ===
            currentGuestbookPage
        ) {

            pageButton.classList.add(
                "active"
            );

        }


        pageButton.textContent =
            page;


        pageButton.addEventListener(
            "click",
            () => {

                currentGuestbookPage =
                    page;

                renderGuestbook();

            }
        );


        guestbookPagination.appendChild(
            pageButton
        );

    }


    /* 다음 버튼 */

    const nextButton =
        document.createElement("button");

    nextButton.type =
        "button";

    nextButton.className =
        "guestbook-page-btn";

    nextButton.textContent =
        "›";

    nextButton.disabled =
        currentGuestbookPage ===
        totalPages;


    nextButton.addEventListener(
        "click",
        () => {

            if (
                currentGuestbookPage <
                totalPages
            ) {

                currentGuestbookPage++;

                renderGuestbook();

            }

        }
    );


    guestbookPagination.appendChild(
        nextButton
    );

}


/* =========================
   메시지 화면 표시
========================= */

function renderGuestbook() {

    guestbookList.innerHTML =
        "";


    /* 메시지가 없을 때 */

    if (
        guestbookMessages.length === 0
    ) {

        if (guestbookEmpty) {

            guestbookEmpty.style.display =
                "block";

        }


        guestbookPagination.style.display =
            "none";

        return;

    }


    /* 메시지가 있으면 안내문 숨김 */

    if (guestbookEmpty) {

        guestbookEmpty.style.display =
            "none";

    }


    const totalPages =
        Math.ceil(
            guestbookMessages.length /
            messagesPerPage
        );


    if (
        currentGuestbookPage >
        totalPages
    ) {

        currentGuestbookPage =
            totalPages;

    }


    const startIndex =
        (currentGuestbookPage - 1) *
        messagesPerPage;

    const endIndex =
        startIndex +
        messagesPerPage;


    const currentMessages =
        guestbookMessages.slice(
            startIndex,
            endIndex
        );


    currentMessages.forEach(
        item => {

            const messageItem =
                document.createElement(
                    "div"
                );

            messageItem.className =
                "guestbook-item";


            const messageTop =
                document.createElement(
                    "div"
                );

            messageTop.className =
                "guestbook-meta";


            const name =
                document.createElement(
                    "strong"
                );

            name.className =
                "guestbook-name";

            name.textContent =
                item.name;


            const date =
                document.createElement(
                    "span"
                );

            date.className =
                "guestbook-date";

            date.textContent =
                item.date;


            const message =
                document.createElement(
                    "p"
                );

            message.className =
                "guestbook-text";

            message.textContent =
                item.message;


            messageTop.appendChild(
                name
            );

            messageTop.appendChild(
                date
            );

            messageItem.appendChild(
                messageTop
            );

            messageItem.appendChild(
                message
            );

            guestbookList.appendChild(
                messageItem
            );

        }
    );


    renderGuestbookPagination();

}


/* =========================
   메시지 등록
========================= */

if (guestbookForm) {

    guestbookForm.addEventListener(
        "submit",
        function (e) {

            e.preventDefault();


            const name =
                guestName.value.trim();

            const message =
                guestMessage.value.trim();


            if (
                !name ||
                !message
            ) {

                alert(
                    "이름과 축하 메시지를 입력해주세요."
                );

                return;

            }


            const newMessage = {

                name: name,

                message: message,

                date: getToday()

            };


            guestbookMessages.unshift(
                newMessage
            );


            localStorage.setItem(
                "weddingGuestbook",
                JSON.stringify(
                    guestbookMessages
                )
            );


            currentGuestbookPage =
                1;


            guestName.value =
                "";

            guestMessage.value =
                "";


            renderGuestbook();


            toast.textContent =
                "축하 메시지가 등록되었습니다.";

            toast.classList.add(
                "show"
            );


            setTimeout(
                () => {

                    toast.classList.remove(
                        "show"
                    );

                },
                1600
            );

        }
    );

}


/* =========================
   처음 페이지를 열었을 때
========================= */

renderGuestbook();


/* =========================
   SCROLL REVEAL
   스크롤 시 디졸브 효과
========================= */

const revealElements =
    document.querySelectorAll(".reveal");

const revealObserver =
    new IntersectionObserver(
        (entries, observer) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add(
                        "is-visible"
                    );

                    observer.unobserve(
                        entry.target
                    );

                }

            });

        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -40px 0px"
        }
    );

revealElements.forEach(element => {

    revealObserver.observe(element);

});