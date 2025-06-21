const $ = document

// preloader

const preLoader = $.querySelector('.preloader')
const webPage = $.querySelector('.webpage')

function loadPage () {
    preLoader.classList.add('loaded')
    webPage.classList.remove('hidden')
}

window.addEventListener('load', () => {
    loadPage()
    sliderAction()
})

// hamburger menu 

const menuBtn = $.querySelector('.menu__btn')
const navBar = $.querySelector(".nav__bar ")

menuBtn.addEventListener('click',function(){
    menuBtn.classList.toggle('active')
    navBar.classList.toggle('active')
})

document.addEventListener('click' , function(event) {
    
    if(event.target !== menuBtn && event.target.parentNode !== menuBtn){
        closeMenu()
    }
})

$.querySelectorAll('.header__link').forEach(function(link){
    link.addEventListener('click',function(){
        closeMenu()
    })
})

function closeMenu () {
    menuBtn.classList.remove('active')
    navBar.classList.remove('active')
}


// navbar scrolled

window.addEventListener('scroll',function(){
    let scorllTop = window.scrollY 

    if(scorllTop > 0){
        navBar.classList.add('scrolled')
    } else {
        navBar.classList.remove('scrolled')
    }


})

// card slider


const sliderAction = () => {
    const wraper = $.querySelector('.category__wraper')
    const carousel = $.querySelector('.category__carousel')
    const arrowBtns = $.querySelectorAll('.category__wraper i')
    const firstCardWidth = $.querySelector('.category__card').offsetWidth
    const carouselChildren = [...carousel.children]

    let isDragging = false , startX , startScrollLeft , timeoutId

    // infinities loop

    let cardPreView = Math.round(carousel.offsetWidth / firstCardWidth)

    carouselChildren.slice(-cardPreView).reverse().forEach(function(card){
        carousel.insertAdjacentHTML('afterbegin',card.outerHTML)
    })

    carouselChildren.slice(0,cardPreView).forEach(function(card){
        carousel.insertAdjacentHTML('beforeend',card.outerHTML)
    })

    // add event for arrow buttons

    arrowBtns.forEach(function(btn){
        btn.addEventListener('click',function(){
            if(btn.id === 'left'){
                carousel.scrollLeft += -firstCardWidth
            } else {
                carousel.scrollLeft += firstCardWidth
            }
        })
    })

    function autoPlay () {
        timeoutId = setInterval(function(){
            carousel.scrollLeft += firstCardWidth
        },2000)
    }

    autoPlay()

    function dragStart (e) {
        isDragging = true
        carousel.classList.add('dragging')
        startX = e.pageX
        startScrollLeft = carousel.scrollLeft
    }

    function dragging (e) {
        if(!isDragging) return
        // update position for dragging
        carousel.scrollLeft = startScrollLeft - (e.pageX - startX)
    }

    function dragStop () {
        isDragging = false
        carousel.classList.remove('dragging')
    }

    function infinityScroll () {
        if(carousel.scrollLeft === 0){
            carousel.classList.add('no-transition')
            carousel.scrollLeft = carousel.scrollWidth - (2 * carousel.offsetWidth)
            carousel.classList.remove('no-transition')
        } else if (Math.ceil(carousel.scrollLeft)===carousel.scrollWidth - carousel.offsetWidth){
            carousel.classList.add('no-transition')
            carousel.scrollLeft = carousel.offsetWidth
            carousel.classList.remove('no-transition')
        }

        clearInterval(timeoutId)
        if(!wraper.matches(':hover')) autoPlay() ;
    }

    carousel.addEventListener('mousedown',dragStart)
    carousel.addEventListener('mousemove',dragging)
    document.addEventListener('mouseup',dragStop)
    carousel.addEventListener('scroll',infinityScroll)
    wraper.addEventListener('mouseenter', clearInterval(timeoutId))
    wraper.addEventListener('mouseleave',infinityScroll)
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

        const checkoutBtn = document.getElementById("checkoutBtn");
        const checkoutPage = document.getElementById("checkoutPage");
        const cartItemsContainer = document.getElementById("cartItems");
        const totalPrice = document.getElementById("totalPrice");
        const payBtn = document.getElementById("payBtn");

        checkoutBtn.addEventListener("click", () => {
            checkoutPage.style.display = "block";
            showCart();
        });

        function showCart() {
            const cart = JSON.parse(localStorage.getItem("cart")) || [];
            cartItemsContainer.innerHTML = "";
            let total = 0;
            cart.forEach((item, index) => {
                const itemDiv = document.createElement("div");
                itemDiv.innerHTML = `
      <p>${item.name} - $${item.price} 
        <button onclick="removeItem(${index})">Remove</button>
      </p>
    `;
                cartItemsContainer.appendChild(itemDiv);
                total += item.price;
            });
            totalPrice.innerText = `Total: $${total}`;
        }

        function removeItem(index) {
            const cart = JSON.parse(localStorage.getItem("cart")) || [];
            cart.splice(index, 1);
            localStorage.setItem("cart", JSON.stringify(cart));
            showCart();
        }

        payBtn.addEventListener("click", () => {
            const confirmed = confirm("Do you want to proceed with payment?");
            if (confirmed) {
                alert("Payment Successful!");
                localStorage.removeItem("cart");
                showCart();
            }
        });