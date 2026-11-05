(function(){
"use strict";
const app=document.getElementById("app");
const concepts=[
 {title:"Sunroom Journal",strap:"The everyday, beautifully considered.",note:"Editorial two-column cover, story chapters and art-directed collection",ref:"Togetherness Design",refUrl:"https://togethernessdesign.com/",lead:0},
 {title:"Kitchen Parade",strap:"Small swaps. Big happy energy.",note:"Bright poster composition, statement bands and playful collection tiles",ref:"Papier",refUrl:"https://www.papier.com/",lead:3},
 {title:"The Linen Edit",strap:"Beautifully useful things.",note:"Minimal gallery composition, asymmetrical hero and slow product reveal",ref:"Grovemade",refUrl:"https://grovemade.com/",lead:1},
 {title:"Sunday Picnic",strap:"The good days come naturally.",note:"Picnic-minded cinematic feature and curated everyday moments",ref:"Loeffler Randall",refUrl:"https://loefflerrandall.com/",lead:3},
 {title:"Fresh Start Supply",strap:"Useful goods. Less fuss.",note:"Functional department-store grid and needs-based shopping",ref:"Package Free",refUrl:"https://packagefreeshop.com/",lead:1},
 {title:"The Maker Notebook",strap:"A little care in every detail.",note:"Tactile notebook story, maker chapters and crafted catalogue",ref:"Schoolhouse",refUrl:"https://schoolhouse.com/",lead:2},
 {title:"Bloom & Fold",strap:"Bring the garden into the everyday.",note:"Botanical arch, soft portrait layout and calm story sections",ref:"Block Shop Textiles",refUrl:"https://www.blockshoptextiles.com/",lead:0},
 {title:"No-Waste Studio",strap:"USE. CARE. REPEAT.",note:"Dark technical studio with product facts and disciplined typography",ref:"Ocean Bottle",refUrl:"https://oceanbottle.co/",lead:2},
 {title:"Market Morning",strap:"Fresh ideas from the kitchen table.",note:"Market-stall geometry, striped wayfinding and category stalls",ref:"Abode New York",refUrl:"https://abode-newyork.com/",lead:0},
 {title:"The Little Things",strap:"Made for those little everyday moments.",note:"Family-routine storytelling, arch composition and editorial timeline",ref:"Homesick",refUrl:"https://homesick.com/",lead:3}
];
const products=[
 {name:"Beeswax Food Wraps",cat:"Storage",short:"Patterned food storage",desc:"Reusable food-wrap concept for bowls and produce. Final materials, dimensions and product specifications require maker confirmation.",care:"General beeswax-wrap guidance recommends cool water and mild soap. Avoid heat. Follow the finished product care label."},
 {name:"Reusable Paper Towels",cat:"Cleaning",short:"Washable kitchen cloths",desc:"A washable cloth concept for daily kitchen routines. Final fabric composition, dimensions and pack quantities remain unconfirmed.",care:"Wash and dry according to the final materials and care label."},
 {name:"Kitchen Scrubbies",cat:"Cleaning",short:"Handmade everyday scrubbers",desc:"A textured kitchen scrubber concept. Fibre composition, surface compatibility and construction must be confirmed.",care:"Rinse after use and dry fully. Follow the maker-supplied fibre care instructions."},
 {name:"Reusable Snack Bags",cat:"Lunch",short:"Patterned lunch companions",desc:"A concept for patterned bags used with dry snacks and lunch essentials. Actual lining, closure and food suitability require confirmation.",care:"Clean according to actual fabric and lining, and dry thoroughly between uses."}
];
const query=new URLSearchParams(location.search);
const selected=Number(query.get("template"))-1;
const isDesign=Number.isInteger(selected)&&selected>=0&&selected<10;
let filter="All",term="",visual="Soft botanical";
function escapeHtml(s){return String(s).replace(/[&<>"']/g,x=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[x]));}
function link(dest,n=selected){return "?template="+(n+1)+"#"+dest;}
function pic(i){return "<div class='photo photo-"+i+"' role='img' aria-label='AI-generated concept photograph of "+escapeHtml(products[i].name)+"'><span>CONCEPT IMAGE</span></div>";}
function button(label,href,cls=""){return "<a class='cta "+cls+"' href='"+href+"'>"+label+" <span aria-hidden='true'>↗</span></a>";}
function productCard(i){const p=products[i];return "<article class='product-card'><a href='"+link("product-"+(i+1))+"'>"+pic(i)+"</a><small>0"+(i+1)+" / MOMMA MADE</small><h3><a href='"+link("product-"+(i+1))+"'>"+escapeHtml(p.name)+"</a></h3><p>"+escapeHtml(p.short)+"</p>"+button("View details",link("product-"+(i+1)),"subtle")+"</article>";}
function productGrid(order=[0,1,2,3]){return "<div class='product-grid'>"+order.map(productCard).join("")+"</div>";}
function heading(eyebrow,title,desc=""){return "<div class='section-head'><div><small>"+eyebrow+"</small><h2>"+title+"</h2></div>"+(desc?"<p>"+desc+"</p>":"")+"</div>";}
function shopBlock(order=[0,1,2,3]){return "<section class='section products'>"+heading("THE MOMMA MADE COLLECTION","Four useful everyday ideas.","Every product is an illustrative preview. Availability, prices and final materials have not been supplied.")+productGrid(order)+"</section>";}
function categories(){
 const items=[["Food storage","Cover, fold, repeat",1],["Daily cleanups","Washable helpers",2],["Lunch moments","Pack and go",4]];
 return "<section class='section categories'>"+heading("BROWSE YOUR WAY","What is your daily routine?")+"<div class='category-grid'>"+items.map((x,i)=>"<a class='category' href='"+link("product-"+x[2])+"'><small>0"+(i+1)+" / CATEGORY</small><h3>"+x[0]+"</h3><p>"+x[1]+"</p><b>Explore ↗</b></a>").join("")+"</div></section>";
}
function noteBlock(n){const captions=["A little less throwaway thinking, a little more beauty in the routine.","Bring on the colour, keep the useful bits.","Thoughtful things can be simple things.","All the good moments start with what we bring along.","Made for doing, made for daily life.","Real maker stories belong at the centre.","A garden of ideas for the kitchen.","No fabricated metrics. Just a clear product concept.","Come on in and take a look.","There is care in the smallest routines."];
return "<section class='note-block'><small>THE IDEA BEHIND THIS COLLECTION</small><p>"+captions[n]+"</p></section>";
}
function storyBlock(n){return "<section class='story'><div class='story-photo'>"+pic((n+2)%4)+"</div><div class='story-copy'><small>THE MOMMA MADE STORY</small><h2>Useful objects, made with intention.</h2><p>This is a presentation concept, not an invented founder biography. The finished website can tell the actual maker story using verified process details and genuine product photographs.</p>"+button("Read the concept story",link("about"),"light")+"</div></section>";}
function editorial(n){return "<section class='editorial'><span class='index'>0"+(n+1)+"</span><div><small>A DIFFERENT WAY TO LIVE WITH LESS</small><h2>Small moments are worth making.</h2><p>From weekday lunches to a kitchen clean-up, the simplest routines can feel considered.</p>"+button("Explore use & care",link("care"),"outline")+"</div>"+pic((n+1)%4)+"</section>";}
function hero(n){const c=concepts[n];return "<section class='hero hero-"+n+"'><div class='hero-text'><small>MOMMA MADE / ORIGINAL COLLECTION CONCEPT</small><h1>"+escapeHtml(c.strap)+"</h1><p>Handmade reusable kitchen essentials, imagined for everyday living.</p>"+button("Explore the collection",link("shop"))+"</div><div class='hero-image'>"+pic(c.lead)+"</div></section>";}
function home(n){
 const orders=[[0,1,3,2],[3,0,1,2],[1,0,2,3],[3,1,0,2],[1,2,0,3],[2,0,3,1],[0,3,1,2],[2,1,0,3],[0,1,3,2],[3,0,2,1]];
 const arr=[
  [hero(n),noteBlock(n),shopBlock(orders[n]),editorial(n),storyBlock(n),categories()],
  [hero(n),categories(),noteBlock(n),shopBlock(orders[n]),storyBlock(n)],
  [hero(n),editorial(n),shopBlock(orders[n]),storyBlock(n)],
  [hero(n),noteBlock(n),storyBlock(n),categories(),shopBlock(orders[n])],
  [hero(n),categories(),shopBlock(orders[n]),editorial(n)],
  [hero(n),storyBlock(n),editorial(n),shopBlock(orders[n]),categories()],
  [hero(n),noteBlock(n),storyBlock(n),shopBlock(orders[n])],
  [hero(n),"<div class='utility-band'>01 / STORE <span>02 / CLEAN</span><span>03 / PACK</span><span>04 / CARE</span></div>",shopBlock(orders[n]),categories(),storyBlock(n)],
  [hero(n),categories(),shopBlock(orders[n]),noteBlock(n),storyBlock(n)],
  [hero(n),noteBlock(n),editorial(n),storyBlock(n),shopBlock(orders[n])]
 ];return arr[n].join("");
}
function head(){
 const items=[["home","Home"],["shop","Shop"],["about","Our story"],["care","Use & care"],["contact","Contact"]];
 const nav=items.map(x=>"<a href='"+link(x[0])+"'>"+x[1]+"</a>").join("");
 const categoryNav=[1,6].includes(selected)?"<div class='inspired-category-nav'><a href='"+link("shop")+"'>Shop all</a><a href='"+link("product-1")+"'>Food wraps</a><a href='"+link("product-2")+"'>Kitchen towels</a><a href='"+link("product-3")+"'>Scrubbies</a><a href='"+link("product-4")+"'>Snack bags</a><a href='"+link("about")+"'>Our story</a></div>":"";
 return "<div class='demo'>MOMMA MADE 2.0 · LIVE DESIGN PREVIEW · NO PURCHASES OR SUBMISSIONS</div><header class='site-header'><a class='logo' href='"+link("home")+"'>Momma <i>Made</i></a><nav aria-label='Main navigation'>"+nav+"</nav><div class='header-right'><a href='./'>Latest gallery ↗</a><a href='../revisions/'>Revision history ↗</a></div><button type='button' class='menu-button' data-menu aria-controls='mobile-menu' aria-expanded='false'>☰ Menu</button></header>"+categoryNav+"<div class='mobile-menu' id='mobile-menu' hidden>"+nav+"<a href='./'>Latest gallery</a><a href='../revisions/'>All revisions</a><a href='../revisions/v1/'>Archived Revision 1</a></div>";
}
function foot(){return "<footer class='footer'><div><strong>Momma <i>Made</i></strong><p>Everyday reusable essentials. Concept collection.</p></div><div><a href='"+link("shop")+"'>Collection</a><a href='"+link("about")+"'>Our story</a><a href='"+link("care")+"'>Use & care</a><a href='"+link("contact")+"'>Inquire</a><a href='../revisions/v1/'>Original ten designs</a></div><small>AI-generated concept photographs, not verified Momma Made inventory. No real orders, prices, testimonials, shipping promises or message submissions.</small></footer>";}
function shopPage(){const visible=products.map((p,i)=>({p,i})).filter(x=>(filter==="All"||x.p.cat===filter)&&(!term||(x.p.name+" "+x.p.short).toLowerCase().includes(term.toLowerCase())));
 return "<section class='page-lead'><small>ALL FOUR PRODUCT CONCEPTS</small><h1>Shop the ideas.</h1><p>Browse sample products. Checkout is deliberately disabled.</p></section><section class='section'><div class='filters'><label for='product-search'>Find an essential</label><input id='product-search' data-search type='search' value='"+escapeHtml(term)+"' placeholder='Search the collection'><div role='group' aria-label='Product filters'>"+["All","Storage","Cleaning","Lunch"].map(x=>"<button type='button' data-filter='"+x+"' aria-pressed='"+(filter===x)+"'>"+x+"</button>").join("")+"</div></div><p aria-live='polite'>"+visible.length+" matching product concepts</p><div class='product-grid'>"+visible.map(x=>productCard(x.i)).join("")+"</div>"+(visible.length?"":"<p>No products match. Clear the search or change the filter.</p>")+"</section>";
}
function productPage(i){const p=products[i];return "<div class='crumb'><a href='"+link("shop")+"'>← Collection</a><span>PRODUCT 0"+(i+1)+" / DEMO</span></div><section class='product-layout'><div class='detail-photo mood-"+(visual==="Warm floral"?"warm":visual==="Neutral linen"?"neutral":"botanical")+"'>"+pic(i)+"</div><div class='detail'><small>MOMMA MADE / PROPOSED PRODUCT</small><h1>"+escapeHtml(p.name)+"</h1><p>"+escapeHtml(p.desc)+"</p><b>Price and availability to be confirmed</b><p class='swatch-label'>CHOOSE A VISUAL MOOD · DEMO ONLY</p><div class='swatches'>"+["Soft botanical","Warm floral","Neutral linen"].map(x=>"<button data-visual='"+x+"' aria-pressed='"+(visual===x)+"'>"+x+"</button>").join("")+"</div><p id='visual-note' aria-live='polite'>Selected visual mood: "+visual+"</p><button class='checkout' disabled aria-label='Checkout unavailable in concept showroom'>CHECKOUT UNAVAILABLE · DEMO ONLY</button><details open><summary>Concept description</summary><p>"+escapeHtml(p.desc)+"</p></details><details><summary>Provisional care guidance</summary><p>"+escapeHtml(p.care)+"</p></details><details><summary>Specifications, shipping and returns</summary><p>Final product specifications and policies have not yet been provided by the maker.</p></details></div></section><section class='section products'>"+heading("YOU MAY ALSO LIKE","Other everyday essentials")+productGrid([0,1,2,3].filter(x=>x!==i))+"</section>";}
function aboutPage(){return "<section class='page-lead'><small>SPACE FOR THE MAKER STORY</small><h1>The story begins by hand.</h1><p>This website concept does not invent a founder, certification, workshop or business history. The final story should be written with the maker and supported by their original photographs.</p></section>"+storyBlock(selected)+categories();}
function carePage(){return "<section class='page-lead'><small>INSTRUCTIONS TO CONFIRM WITH THE MAKER</small><h1>Love it. Care for it. Repeat.</h1><p>These are provisional care examples only. Use the label or confirmed maker guidance for the finished product.</p></section><section class='section care-grid'>"+products.map((p,i)=>"<article><small>0"+(i+1)+" / CARE</small><h2>"+escapeHtml(p.name)+"</h2><p>"+escapeHtml(p.care)+"</p>"+button("See concept",link("product-"+(i+1)),"outline")+"</article>").join("")+"</section>";}
function contactPage(){return "<section class='page-lead'><small>CONTACT FLOW · SIMULATION</small><h1>Ask us a question.</h1><p>This form is a preview only. It will not transmit, store or email your details. Do not enter sensitive information.</p></section><form id='demo-form' class='contact-form'><label for='visitor-name'>Name</label><input id='visitor-name' required autocomplete='name' placeholder='Your name'><label for='visitor-email'>Email</label><input id='visitor-email' type='email' required autocomplete='email' placeholder='you@example.com'><label for='visitor-message'>Message</label><textarea id='visitor-message' required placeholder='Your question'></textarea><button type='submit' class='cta'>Preview confirmation →</button><p role='status' id='form-message'></p></form>";}
function gallery(){
 document.title="Momma Made 2.0 | Ten new templates";
 app.className="gallery";
 app.innerHTML="<header class='gallery-nav'><strong>MOMMA MADE / LATEST WEBSITE COLLECTION · REVISION 2</strong><a href='../revisions/v1/'>Archived Revision 1 ↗</a></header><div class='gallery-hero'><div><small>ROUND TWO / TEN DISTINCT STOREFRONTS</small><h1>One maker.<br><i>Ten new stories.</i></h1></div><div><p>Open any design to explore its homepage, catalogue, product detail routes, maker-story page, care guide and simulated inquiry flow.</p><p class='gallery-notice'>Original design work · AI-generated concept photography · No fabricated prices, checkout, testimonials or submissions. These complement the original ten.</p></div></div><section class='gallery-grid'>"+concepts.map((c,i)=>"<article class='preview-card'><div class='preview-viewport'><iframe loading='lazy' tabindex='-1' title='"+escapeHtml(c.title)+" live concept preview' src='?template="+(i+1)+"&preview=1#home'></iframe></div><div class='preview-info'><small>DESIGN "+String(i+11).padStart(2,"0")+"</small><h2>"+escapeHtml(c.title)+"</h2><p>"+escapeHtml(c.note)+"</p>"+button("Open full storefront","?template="+(i+1)+"#home")+"<p class='ref'>General layout inspiration: <a href='"+c.refUrl+"' target='_blank' rel='noopener noreferrer'>"+escapeHtml(c.ref)+" ↗</a></p></div></article>").join("")+"</section><footer class='gallery-footer'><strong>Momma Made · Revision 2 of 2</strong><a href='../revisions/v1/'>Open archived Revision 1 ↗</a></footer>";
}
function render(){
 if(!isDesign){gallery();return;}
 const route=location.hash.replace(/^#/,"")||"home";
 let content=route==="shop"?shopPage():route==="about"?aboutPage():route==="care"?carePage():route==="contact"?contactPage():/^product-[1-4]$/.test(route)?productPage(Number(route.slice(-1))-1):home(selected);
 app.className="shell theme-"+selected;
 app.innerHTML=head()+content+foot();
 document.title=concepts[selected].title+" | Momma Made 2.0";
}
document.addEventListener("click",e=>{
 let el=e.target.closest("[data-menu]");
 if(el){const m=document.getElementById("mobile-menu");if(m){m.hidden=!m.hidden;el.setAttribute("aria-expanded",String(!m.hidden));}return;}
 el=e.target.closest("[data-filter]");if(el){filter=el.dataset.filter;render();return;}
 el=e.target.closest("[data-visual]");if(el){visual=el.dataset.visual;document.querySelectorAll("[data-visual]").forEach(x=>x.setAttribute("aria-pressed",String(x===el)));document.getElementById("visual-note").textContent="Selected visual mood: "+visual;const detailPhoto=document.querySelector(".detail-photo");if(detailPhoto){detailPhoto.classList.remove("mood-warm","mood-neutral","mood-botanical");detailPhoto.classList.add(visual==="Warm floral"?"mood-warm":visual==="Neutral linen"?"mood-neutral":"mood-botanical");}}
});
document.addEventListener("input",e=>{if(e.target.matches("[data-search]")){term=e.target.value;const pos=e.target.selectionStart;render();const input=document.getElementById("product-search");input.focus();try{input.setSelectionRange(pos,pos);}catch(_){};}});
document.addEventListener("submit",e=>{if(e.target.id==="demo-form"){e.preventDefault();document.getElementById("form-message").textContent="This is a demonstration confirmation. No message was sent or stored.";}});
window.addEventListener("hashchange",()=>{filter="All";term="";render();window.scrollTo(0,0);});
render();
})();