"use strict";/* Original client-side demo controls. No fetch, network, cookies, persistent storage or submissions. */
document.addEventListener("DOMContentLoaded",()=>{
 const params=new URLSearchParams(window.location.search);
 const sku=params.get("item")||"wraps";
 const acceptable=new Set(["wraps","cloths","scrubbies","bags"]);
 const chosen=acceptable.has(sku)?sku:"wraps";
 for(const el of document.querySelectorAll("[data-product-view]")) el.hidden=el.dataset.productView!==chosen;
 const names={wraps:"Beeswax Food Wraps",cloths:"Reusable Kitchen Cloths",scrubbies:"Kitchen Scrubbies",bags:"Reusable Snack Bags"};
 if(document.querySelector("[data-product-view]"))document.title=names[chosen]+" | "+document.title;
 const controls=document.querySelector("[data-product-filters]");
 if(controls){
   let category="All",term="";
   const update=()=>{
    let visible=0;
    for(const item of document.querySelectorAll("[data-filter-item]")){
      const match=(category==="All"||item.dataset.category===category)&&item.dataset.productName.includes(term);
      item.hidden=!match;if(match)visible++;
    }
    const count=document.querySelector("[data-result-count]");if(count)count.textContent=visible+" illustrative product concept"+(visible===1?"":"s")+" shown";
   };
   controls.addEventListener("click",event=>{
      const btn=event.target.closest("button[data-filter]");if(!btn)return;
      category=btn.dataset.filter;
      for(const x of controls.querySelectorAll("button[data-filter]"))x.setAttribute("aria-pressed",String(x===btn));
      update();
   });
   const input=controls.querySelector("[data-search]");
   if(input)input.addEventListener("input",()=>{term=input.value.trim().toLowerCase();update()});
   update();
 }
 // Explicitly identify inherited AI concept photos: never imply real merchandise.
 const footerNotice=[...document.querySelectorAll(".f2-footer > span")].find(el=>el.textContent.includes("Original CSS artwork"));
 if(footerNotice)footerNotice.textContent="Existing project AI concept imagery · Unverified products and inventory · Demo only";
 for(const caption of document.querySelectorAll(".f2-product-visual>p"))caption.textContent="AI-GENERATED CONCEPT IMAGE / NOT VERIFIED PRODUCT PHOTOGRAPHY";
 document.addEventListener("click",event=>{
   const mood=event.target.closest("button[data-mood]");
   if(mood){
     const article=mood.closest("[data-product-view]");
     if(!article)return;
     for(const x of article.querySelectorAll("button[data-mood]"))x.setAttribute("aria-pressed",String(x===mood));
     const visual=article.querySelector(".f2-product-visual");
     if(visual){visual.classList.remove("mood-warm","mood-botanical");if(mood.dataset.mood!=="paper")visual.classList.add("mood-"+mood.dataset.mood)}
     const text=article.querySelector(".f2-mood-note");
     if(text)text.textContent=mood.textContent+" illustration selected. No product options are being ordered.";
     return;
   }
   const submit=event.target.closest("button[data-demo-send]");
   if(submit){
     event.preventDefault();
     const group=submit.closest(".f2-demo-inquiry");
     if(!group)return;
     const inputs=[...group.querySelectorAll("input,textarea")];
     const status=group.querySelector(".f2-demo-feedback");
     const invalid=inputs.find(el=>!el.checkValidity());
     if(invalid){status.textContent="Please complete the demonstration fields using a valid email. Nothing has been sent.";invalid.focus();return}
     for(const el of inputs)el.value="";
     status.textContent="Demo confirmation only. Nothing was sent, collected or stored; the demonstration fields were cleared.";
   }
 });
});
