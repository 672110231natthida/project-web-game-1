document.querySelector

// preloader

const preLoader = document.querySelector('.preloader');
const webPage = document.querySelector('.webpage');
function loadPage() {
    preLoader.classList.add('loaded')
    webPage.classList.remove('hidden')
}

window.addEventListener('load', () => {
    loadPage()
    sliderAction()
})

// hamburger menu 

const menuBtn = document.querySelector('.menu__btn');
const navBar = document.querySelector(".nav__bar");

menuBtn.addEventListener('click', function () {
    menuBtn.classList.toggle('active')
    navBar.classList.toggle('active')
})

document.addEventListener('click', function (event) {

    if (event.target !== menuBtn && event.target.parentNode !== menuBtn) {
        closeMenu()
    }
})

document.querySelectorAll('.header__link').forEach(function (link) {
    link.addEventListener('click', function () {
        closeMenu();
    });
});

function closeMenu() {
    menuBtn.classList.remove('active')
    navBar.classList.remove('active')
}


// navbar scrolled

window.addEventListener('scroll', function () {
    let scorllTop = window.scrollY

    if (scorllTop > 0) {
        navBar.classList.add('scrolled')
    } else {
        navBar.classList.remove('scrolled')
    }


})

// card slider


const sliderAction = () => {
    const wraper = document.querySelector('.category__wraper');
    const carousel = document.querySelector('.category__carousel');
    const arrowBtns = document.querySelectorAll('.category__wraper i');
    const firstCardWidth = document.querySelector('.category__card').offsetWidth;
    const carouselChildren = [...carousel.children];


    let isDragging = false, startX, startScrollLeft, timeoutId

    // infinities loop

    let cardPreView = Math.round(carousel.offsetWidth / firstCardWidth)

    carouselChildren.slice(-cardPreView).reverse().forEach(function (card) {
        carousel.insertAdjacentHTML('afterbegin', card.outerHTML)
    })

    carouselChildren.slice(0, cardPreView).forEach(function (card) {
        carousel.insertAdjacentHTML('beforeend', card.outerHTML)
    })

    // add event for arrow buttons

    arrowBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            if (btn.id === 'left') {
                carousel.scrollLeft += -firstCardWidth
            } else {
                carousel.scrollLeft += firstCardWidth
            }
        })
    })

    function autoPlay() {
        timeoutId = setInterval(function () {
            carousel.scrollLeft += firstCardWidth
        }, 2000)
    }

    autoPlay()

    function dragStart(e) {
        isDragging = true
        carousel.classList.add('dragging')
        startX = e.pageX
        startScrollLeft = carousel.scrollLeft
    }

    function dragging(e) {
        if (!isDragging) return
        // update position for dragging
        carousel.scrollLeft = startScrollLeft - (e.pageX - startX)
    }

    function dragStop() {
        isDragging = false
        carousel.classList.remove('dragging')
    }

    function infinityScroll() {
        if (carousel.scrollLeft === 0) {
            carousel.classList.add('no-transition')
            carousel.scrollLeft = carousel.scrollWidth - (2 * carousel.offsetWidth)
            carousel.classList.remove('no-transition')
        } else if (Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth) {
            carousel.classList.add('no-transition')
            carousel.scrollLeft = carousel.offsetWidth
            carousel.classList.remove('no-transition')
        }

        clearInterval(timeoutId)
        if (!wraper.matches(':hover')) autoPlay();
    }

    carousel.addEventListener('mousedown', dragStart)
    carousel.addEventListener('mousemove', dragging)
    document.addEventListener('mouseup', dragStop)
    carousel.addEventListener('scroll', infinityScroll)
    wraper.addEventListener('mouseenter', () => clearInterval(timeoutId));
    wraper.addEventListener('mouseleave', infinityScroll)
}
// Sample cart setup (for demo)
const sampleCart = [
    { name: "Assassin Creed", price: 20 },
    { name: "Cyberpunk 2077", price: 30 },
    { name: "Elden Ring", price: 40 }
];
if (!localStorage.getItem("cart")) {
    localStorage.setItem("cart", JSON.stringify(sampleCart));
}




//เข้าระบบ T_T
window.addEventListener("DOMContentLoaded", () => {
    // ตรวจสอบว่าผู้ใช้ล็อกอินหรือยัง
    function getCurrentUser() {
        return localStorage.getItem("loggedInUser");
    }

    // ฟังก์ชันล็อกอินจำลอง (สมัคร = แค่พิมพ์ชื่อแล้วถือว่าเข้าได้เลย)
    window.loginUser = function () {
        const username = prompt("กรุณาใส่ชื่อผู้ใช้:");
        if (username) {
            localStorage.setItem("loggedInUser", username);
            alert("ล็อกอินสำเร็จ! ผู้ใช้: " + username);
        }
    };

    // ฟังก์ชันเพิ่มสินค้า
    window.addToCart = function (name, price) {
        const user = getCurrentUser();
        if (!user) {
            alert("กรุณาล็อกอินก่อนเพิ่มสินค้า!");
            return;
        }

        let cartKey = `cart_${user}`;
        let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
        cart.push({ name, price });
        localStorage.setItem(cartKey, JSON.stringify(cart));
        alert(`เพิ่ม ${name} เข้าตะกร้าเรียบร้อย!`);
    };

    // ฟังก์ชันแสดงตะกร้าเมื่อกดปุ่ม Checkout
    const checkoutBtn = document.getElementById("checkoutBtn");
    const cartItemsContainer = document.getElementById("cartItems");
    const totalPrice = document.getElementById("totalPrice");
    const payBtn = document.getElementById("payBtn");
    const checkoutPage = document.getElementById("checkoutPage");

    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            const user = getCurrentUser();
            if (!user) {
                alert("กรุณาล็อกอินก่อนดูตะกร้า!");
                return;
            }

            const cart = JSON.parse(localStorage.getItem(`cart_${user}`)) || [];
            let total = 0;
            cartItemsContainer.innerHTML = "";

            cart.forEach((item, index) => {
                const itemDiv = document.createElement("div");
                itemDiv.innerHTML = `
          <p>${item.name} - $${item.price}
            <button onclick="removeItem(${index})">ลบ</button>
          </p>`;
                cartItemsContainer.appendChild(itemDiv);
                total += item.price;
            });

            totalPrice.textContent = `Total: $${total}`;
            checkoutPage.style.display = "block";
        });
    }

    window.removeItem = function (index) {
        const user = getCurrentUser();
        let cartKey = `cart_${user}`;
        let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
        cart.splice(index, 1);
        localStorage.setItem(cartKey, JSON.stringify(cart));
        checkoutBtn.click(); // refresh
    };

    if (payBtn) {
        payBtn.addEventListener("click", () => {
            const user = getCurrentUser();
            if (!user) return;

            const confirmPay = confirm("คุณต้องการชำระเงินใช่หรือไม่?");
            if (confirmPay) {
                alert("ชำระเงินสำเร็จ!");
                localStorage.removeItem(`cart_${user}`);
                checkoutBtn.click(); // refresh
            }
        });
    }
    //บราๆๆๆ
    const userDisplay = document.getElementById("userDisplay");
    const currentUser = localStorage.getItem("loggedInUser");

    if (userDisplay) {
        if (currentUser) {
            userDisplay.textContent = "👤 " + currentUser;
        } else {
            userDisplay.innerHTML = `<a href="login.html" class="header__link signin">SIGN IN</a>`;
        }
    }

});


//กร้ดอีเห้ยยยยยย

function getCurrentUser() {
    return localStorage.getItem("loggedInUser");
}

function updateCartBadge() {
    const user = getCurrentUser();
    if (!user) return;
    const cart = JSON.parse(localStorage.getItem(`cart_${user}`)) || [];
    const badge = document.getElementById("total-number");
    if (badge) {
        badge.textContent = cart.length;
    }
}

function showCart() {
    const user = getCurrentUser();
    if (!user) {
        alert("กรุณาล็อกอินก่อนดูตะกร้า!");
        return;
    }

    const cart = JSON.parse(localStorage.getItem(`cart_${user}`)) || [];
    const container = document.getElementById("cartItems");
    const totalPrice = document.getElementById("totalPrice");
    const checkoutPage = document.getElementById("checkoutPage");

    let total = 0;
    container.innerHTML = "";
    cart.forEach((item, index) => {
        total += item.price;
        container.innerHTML += `
      <p>${item.name} - $${item.price}
        <button onclick="removeItem(${index})">ลบ</button>
      </p>`;
    });

    totalPrice.textContent = `Total: $${total}`;
    checkoutPage.style.display = "block";
    updateCartBadge();
}

document.getElementById("checkoutBtn")?.addEventListener("click", (e) => {
    e.preventDefault();
    showCart();
});

document.getElementById("closeCheckoutBtn")?.addEventListener("click", () => {
    document.getElementById("checkoutPage").style.display = "none";
});

document.getElementById("payBtn")?.addEventListener("click", () => {
    const user = getCurrentUser();
    if (!user) return;

    const confirmPay = confirm("คุณต้องการชำระเงินใช่หรือไม่?");
    if (confirmPay) {
        alert("ชำระเงินสำเร็จ!");
        localStorage.removeItem(`cart_${user}`);
        showCart();
    }
});

window.removeItem = function (index) {
    const user = getCurrentUser();
    let cart = JSON.parse(localStorage.getItem(`cart_${user}`)) || [];
    cart.splice(index, 1);
    localStorage.setItem(`cart_${user}`, JSON.stringify(cart));
    showCart();
};

document.addEventListener("DOMContentLoaded", updateCartBadge);






