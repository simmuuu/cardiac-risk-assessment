document.addEventListener("DOMContentLoaded", function () {
    const faqBoxes = document.querySelectorAll('.faqbox');

    faqBoxes.forEach(faqBox => {
        const faqQ = faqBox.querySelector('.faq-q');
        const faqA = faqBox.querySelector('.faqa');
        const faqIcon = faqBox.querySelector('.faq-icon');

        faqQ.addEventListener('click', function () {
            // Close all other open answers and reset icons
            faqBoxes.forEach(otherBox => {
                if (otherBox !== faqBox) {
                    const otherAnswer = otherBox.querySelector('.faqa');
                    const otherIcon = otherBox.querySelector('.faq-icon');
                    otherAnswer.classList.remove('active');
                    otherIcon.classList.remove('expand');
                }
            });

            // Toggle the 'active' class to show/hide the answer
            faqA.classList.toggle('active');

            // Toggle the 'expand' class to rotate the icon
            faqIcon.classList.toggle('expand');
        });
    });

    const top = document.querySelector('#toPageTop');
    const menu = document.querySelector('.float-menu');

    document.addEventListener("scroll", () => {
        const scrollPosi = window.scrollY;
        console.log(scrollPosi);

        if (scrollPosi > 200) {
            top.style.display = "block";
        } else {
            top.style.display = "none";
        }

        if (scrollPosi > 500 && scrollPosi < 2000) {
            menu.style.display = "block";
        } else {
            menu.style.display = "none";
        }
    });

    top.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });





});

