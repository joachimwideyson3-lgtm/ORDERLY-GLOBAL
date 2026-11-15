const $=s=>document.querySelector(s);
const translations={
fr:{eyebrow:"VOTRE SERVICE DE COMMANDE EN LIGNE",headline:'Vous choisissez.<br><span>Nous nous occupons du reste.</span>',intro:"Envoyez-nous les détails de votre achat. Notre équipe vous accompagne à chaque étape.",start:"Faire une demande",f1title:"Envoyez votre demande",f1:"Partagez le lien du produit et les détails souhaités.",f2title:"Recevez une confirmation",f2:"Nous étudions votre demande et vous recontactons.",f3title:"Suivez votre commande",f3:"Consultez le statut de votre demande.",formeyebrow:"COMMENÇONS",formtitle:"Nouvelle demande",formdesc:"Remplissez les informations ci-dessous.",name:"Nom complet",contact:"Téléphone ou WhatsApp",product:"Lien du produit / site web",quantity:"Quantité",budget:"Budget estimé (facultatif)",details:"Détails supplémentaires",send:"Envoyer la demande",localnote:"Prototype : les demandes sont enregistrées sur cet appareil uniquement.",trackingeyebrow:"ESPACE CLIENT",tracking:"Mes demandes",empty:"Aucune demande pour le moment.",admin:"Administration",adminhint:"Zone de démonstration locale — pas encore protégée par un compte.",export:"Exporter CSV",clear:"Effacer les données locales",sent:"Votre demande a été enregistrée sur cet appareil.",pending:"Reçue",approved:"Acceptée",shipping:"En cours",delivered:"Livrée",cancelled:"Annulée",change:"Statut",confirmClear:"Effacer toutes les demandes enregistrées sur cet appareil ?",deleted:"Données locales effacées."},
en:{eyebrow:"YOUR ONLINE ORDERING SERVICE",headline:'You choose.<br><span>We take care of the rest.</span>',intro:"Send us the details of your purchase. Our team will guide you at every step.",start:"Place a request",f1title:"Send your request",f1:"Share the product link and the details you need.",f2title:"Get confirmation",f2:"We review your request and get back to you.",f3title:"Track your order",f3:"Check the status of your request.",formeyebrow:"LET'S START",formtitle:"New request",formdesc:"Fill in the information below.",name:"Full name",contact:"Phone or WhatsApp",product:"Product / website link",quantity:"Quantity",budget:"Estimated budget (optional)",details:"Additional details",send:"Send request",localnote:"Prototype: requests are stored on this device only.",trackingeyebrow:"CUSTOMER AREA",tracking:"My requests",empty:"No requests yet.",admin:"Administration",adminhint:"Local demo area — not yet protected by an account.",export:"Export CSV",clear:"Clear local data",sent:"Your request has been saved on this device.",pending:"Received",approved:"Accepted",shipping:"In progress",delivered:"Delivered",cancelled:"Cancelled",change:"Status",confirmClear:"Delete all requests saved on this device?",deleted:"Local data cleared."}
};
let lang="fr", orders=JSON.parse(localStorage.getItem("og-orders")||"[]");
const t=k=>translations[lang][k]||k;
function render(){
  const empty=t("empty");
  $("#customerOrders").innerHTML=orders.length?orders.map(o=>`<div class="order"><div class="order-top"><b>${escapeHtml(o.name)}</b><span class="status">${t(o.status)}</span></div><small>#${o.id} · ${new Date(o.date).toLocaleDateString()}</small><p><a href="${escapeAttr(o.product)}" target="_blank" rel="noopener"> ${escapeHtml(o.product)}</a></p></div>`).join(""):empty;
  $("#adminOrders").innerHTML=orders.length?orders.map(o=>`<div class="order"><div class="order-top"><b>${escapeHtml(o.name)} · #${o.id}</b><small>${escapeHtml(o.contact)}</small></div><p>${escapeHtml(o.product)}</p><label>${t("change")}<select data-id="${o.id}" class="statusSelect">${["pending","approved","shipping","delivered","cancelled"].map(s=>`<option value="${s}" ${o.status===s?"selected":""}>${t(s)}</option>`).join("")}</select></label></div>`).join(""):empty;
  document.querySelectorAll(".statusSelect").forEach(el=>el.addEventListener("change",e=>{const o=orders.find(x=>x.id===Number(e.target.dataset.id));if(o){o.status=e.target.value;save();render();}}));
}
function save(){localStorage.setItem("og-orders",JSON.stringify(orders));}
function escapeHtml(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function escapeAttr(s){return escapeHtml(s);}
function setLang(v){lang=v;document.documentElement.lang=v;document.querySelectorAll("[data-i18n]").forEach(el=>{const key=el.dataset.i18n;if(translations[v][key])el.innerHTML=translations[v][key];});$("#installBtn").textContent=v==="fr"?"Installer":"Install";render();}
$("#language").addEventListener("change",e=>setLang(e.target.value));
$("#orderForm").addEventListener("submit", e => {
  e.preventDefault();

  const d = Object.fromEntries(new FormData(e.target));

  const message = 
`🛒 NOUVELLE COMMANDE - ORDERLY GLOBAL

👤 Nom: ${d.name || ""}
📞 Contact: ${d.contact || ""}
📦 Produit: ${d.product || ""}
🔢 Quantité: ${d.quantity || ""}
💰 Budget: ${d.budget || ""}
📝 Détails: ${d.details || ""}

Merci d'avoir choisi ORDERLY GLOBAL.`;

  const whatsappURL =
    "https://wa.me/50955468020?text=" +
    encodeURIComponent(message);

  window.open(whatsappURL, "_blank");

  e.target.reset();
});
$("#clearBtn").addEventListener("click",()=>{if(confirm(t("confirmClear"))){orders=[];save();render();$("#formMessage").textContent=t("deleted");}});
$("#exportBtn").addEventListener("click",()=>{const rows=[["ID","Name","Contact","Product","Quantity","Budget","Details","Status","Date"],...orders.map(o=>[o.id,o.name,o.contact,o.product,o.quantity,o.budget,o.details,o.status,o.date])];const csv=rows.map(r=>r.map(v=>'"'+String(v??"").replace(/"/g,'""')+'"').join(",")).join("\n");const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));a.download="orderly-global-orders.csv";a.click();URL.revokeObjectURL(a.href);});
let deferredPrompt;window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;$("#installBtn").hidden=false;});
$("#installBtn").addEventListener("click",async()=>{if(deferredPrompt){deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;$("#installBtn").hidden=true;}else alert(lang==="fr"?"Dans Chrome : menu ⋮ > Installer l'application ou Ajouter à l'écran d'accueil.":"In Chrome: menu ⋮ > Install app or Add to Home screen.");});
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(console.error));
setLang("fr");
