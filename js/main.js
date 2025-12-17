/* ================= MENU MOBILE ================= */
document.addEventListener("DOMContentLoaded", () => {
  const navMenu  = document.getElementById("nav-menu");
  const navToggle= document.getElementById("nav-toggle");
  const navLinks = document.querySelectorAll(".nav_link");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => navMenu.classList.toggle("show"));
    navLinks.forEach(link =>
      link.addEventListener("click", () => navMenu.classList.remove("show"))
    );
  }

  renderFeaturedProducts();
  renderNewArrivals();

  setupCartDrawer();
  setupFabEmail();
  setupScrollSpy();         // <<< muda cor/ativo por seção
});

/* ================= DADOS (demonstra skill) ================= */
const featuredProducts = [
  { name: "HEADPHONE ONE BLACK", price: "$29",  image: "img/feature1.png" },
  { name: "SPEAKER BEATS PILL",   price: "$199", image: "img/feature2.png" },
  { name: "APPLE AIR PODS",       price: "$122", image: "img/feature3.png" },
  { name: "SMARTWATCH F9 NEGRO",  price: "$99",  image: "img/feature4.png" },
];

const newArrivals = [
  { image: "img/new1.png" },
  { image: "img/new2.png" },
  { image: "img/new3.png" },
  { image: "img/new4.png" },
  { image: "img/new5.png" },
  { image: "img/new6.png" },
];

/* ================= FEATURED ================= */
function renderFeaturedProducts() {
  const container = document.querySelector(".featured_container");
  if (!container) return;
  container.innerHTML = "";

  featuredProducts.forEach(product => {
    const card = document.createElement("div");
    card.className = "featured_card";
    card.innerHTML = `
      <span class="featured_tag">NEW</span>
      <img src="${product.image}" alt="${product.name}" class="featured_img">
      <h3 class="featured_name">${product.name}</h3>
      <span class="featured_price">${product.price}</span>
    `;
    container.appendChild(card);
  });
}

/* ================= NEW ARRIVALS ================= */
function renderNewArrivals() {
  const container = document.querySelector(".new_container");
  if (!container) return;
  container.innerHTML = "";

  newArrivals.forEach(item => {
    const card = document.createElement("div");
    card.className = "new_card";
    card.innerHTML = `
      <img src="${item.image}" alt="New arrival" class="new_img">
      <div class="new_overlay"><a href="#" class="button">VIEW PRODUCT</a></div>
    `;
    container.appendChild(card);
  });
}

/* ================= CART DRAWER ================= */
function setupCartDrawer(){
  const cartBtn  = document.querySelector(".nav_cart");
  const drawer   = document.getElementById("cartDrawer");
  const overlay  = document.getElementById("cartOverlay");
  const closeBtn = drawer ? drawer.querySelector(".cart-close") : null;

  if(!drawer || !overlay || !cartBtn) return;

  function openCart(){
    drawer.setAttribute("aria-hidden","false");
    overlay.setAttribute("aria-hidden","false");
    drawer.classList.add("open");
    overlay.classList.add("show");
  }
  function closeCart(){
    drawer.setAttribute("aria-hidden","true");
    overlay.setAttribute("aria-hidden","true");
    drawer.classList.remove("open");
    overlay.classList.remove("show");
  }

  cartBtn.addEventListener("click", openCart);
  closeBtn && closeBtn.addEventListener("click", closeCart);
  overlay.addEventListener("click", closeCart);

  document.addEventListener("keydown", (e)=>{
    if(e.key === "Escape" && drawer.classList.contains("open")) closeCart();
  });
}

/* ================= FAB E-MAIL (com animação fadeOutUp/Down) ================= */
function setupFabEmail(){
  const fabBtn  = document.getElementById("emailFab");
  const sheet   = document.getElementById("contactFab");
  if(!fabBtn || !sheet) return;

  const xInside  = sheet.querySelector(".fab-close");
  const mailIcon = fabBtn.querySelector(".fab-mail");
  const xIcon    = fabBtn.querySelector(".fab-x");
  let busy = false;

  function openSheet(){
    fabBtn.classList.add("open");
    fabBtn.setAttribute("aria-expanded","true");
    sheet.classList.add("open");
    sheet.setAttribute("aria-hidden","false");

    xIcon.classList.remove("fab-anim-down");
    xIcon.classList.add("fab-anim-in");
    xIcon.addEventListener("animationend", () => {
      xIcon.classList.remove("fab-anim-in");
      busy = false;
    }, { once: true });
  }

  function closeSheet(){
    fabBtn.classList.remove("open");
    fabBtn.setAttribute("aria-expanded","false");
    sheet.classList.remove("open");
    sheet.setAttribute("aria-hidden","true");

    mailIcon.classList.remove("fab-anim-up");
    mailIcon.classList.add("fab-anim-in");
    mailIcon.addEventListener("animationend", () => {
      mailIcon.classList.remove("fab-anim-in");
      busy = false;
    }, { once: true });
  }

  function animateOpen(){
    if(busy || sheet.classList.contains("open")) return;
    busy = true;
    mailIcon.classList.remove("fab-anim-in","fab-anim-down");
    mailIcon.classList.add("fab-anim-up");
    mailIcon.addEventListener("animationend", () => { openSheet(); }, { once: true });
  }

  function animateClose(){
    if(busy || !sheet.classList.contains("open")) return;
    busy = true;
    xIcon.classList.remove("fab-anim-in","fab-anim-up");
    xIcon.classList.add("fab-anim-down");
    xIcon.addEventListener("animationend", () => { closeSheet(); }, { once: true });
  }

  fabBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    e.stopPropagation();
    sheet.classList.contains("open") ? animateClose() : animateOpen();
  });
  xInside && xInside.addEventListener("click", (e)=>{ e.preventDefault(); animateClose(); });

  document.addEventListener("click", (e)=>{
    if(!sheet.classList.contains("open")) return;
    const outside = !sheet.contains(e.target) && e.target !== fabBtn && !fabBtn.contains(e.target);
    if(outside) animateClose();
  });
  document.addEventListener("keydown", (e)=>{
    if(e.key === "Escape" && sheet.classList.contains("open")) animateClose();
  });

  const form = document.getElementById("fabContactForm");
  if(form){
    form.addEventListener("submit", (e)=>{
      e.preventDefault();
      animateClose();
      alert("Mensagem enviada!");
    });
  }
}

/* ================= SCROLL SPY (ativo + cores por seção) ================= */
function setupScrollSpy(){
  const ids = ["home","featured","new","subscribed"];
  const sections = ids
    .map(id => document.getElementById(id))
    .filter(Boolean);

  if(!sections.length) return;

  const links = Array.from(document.querySelectorAll(".nav_link"));
  const linkById = {};
  links.forEach(l => {
    const href = (l.getAttribute("href") || "").replace("#","");
    if(href) linkById[href] = l;
  });

  const body = document.body;

  function setActive(id){
    links.forEach(l => l.classList.remove("active"));
    if(linkById[id]) linkById[id].classList.add("active");

    body.classList.remove("theme-home","theme-featured","theme-new","theme-subscribed");
    const theme = {
      home: "theme-home",
      featured: "theme-featured",
      new: "theme-new",
      subscribed: "theme-subscribed"
    }[id] || "theme-home";
    body.classList.add(theme);
  }

  // inicial
  setActive("home");

  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const id = entry.target.id;
        setActive(id);
      }
    });
  }, {
    root: null,
    threshold: 0.6
  });

  sections.forEach(sec => io.observe(sec));
}
