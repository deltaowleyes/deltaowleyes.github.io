(()=>{'use strict';
const concepts=[
{name:"The Heritage Wrap",ref:"Bee’s Wrap",url:"https://www.beeswrap.com/",style:"heritage",line:"Better food storage, beautifully made.",note:"Editorial split hero · print selector · filterable collection",color:"#486045",paper:"#f8f2e8",ink:"#283729"},
{name:"Happy Hive",ref:"Beewise Reusables",url:"https://beewisereusables.com/",style:"happy",line:"Handmade little wins for every day.",note:"Playful poster hero · colour chips · illustrated category tiles",color:"#e67c31",paper:"#fff3d3",ink:"#54341d"},
{name:"Quiet Earth",ref:"Earthology",url:"https://earthologywraps.com/",style:"quiet",line:"The gentle art of reusing.",note:"Minimal studio typography · art-book spreads · airy product rails",color:"#737e61",paper:"#efeee7",ink:"#3e4337"},
{name:"Everyday Supply",ref:"Package Free",url:"https://packagefreeshop.com/",style:"supply",line:"The kitchen edit.",note:"Department-store category grid · filters · dense merchandising",color:"#202f2f",paper:"#fffdf7",ink:"#202f2f"},
{name:"Wrap Lab",ref:"SuperBee",url:"https://superbee.me/",style:"lab",line:"Find your everyday swap.",note:"Interactive needs-based product finder · guide-led shopping",color:"#f4bf37",paper:"#fff9e9",ink:"#24382e"},
{name:"Maker’s Table",ref:"Bees Louise",url:"https://beeslouise.ca/",style:"maker",line:"Good things begin by hand.",note:"Founder journal · handcrafted process story · tactile catalogue",color:"#935640",paper:"#fbefe4",ink:"#513d32"},
{name:"Pattern Parade",ref:"Mind Your Bees Wraps",url:"https://mindyourbeeswraps.com/",style:"pattern",line:"A little more joy in every lunch.",note:"Graphic pattern collage · oversized colour-block merchandising",color:"#ae3770",paper:"#fff3ef",ink:"#492747"},
{name:"The Slow Sunday",ref:"Hearterra",url:"https://hearterra.ca/",style:"slow",line:"For the moments that make a home.",note:"Warm lifestyle lookbook · curated routines · spacious features",color:"#9b6f60",paper:"#f8ede6",ink:"#493d36"},
{name:"Made to Work",ref:"BeeBAGZ",url:"https://beebagz.com/",style:"utility",line:"Reusable, useful, ready to go.",note:"Functional spec sheets · comparison table · product-first hero",color:"#166d69",paper:"#e9f4f2",ink:"#183b3a"},
{name:"The Good Goods Co.",ref:"Ethikli",url:"https://ethikli.com/",style:"market",line:"Shop small. Choose thoughtfully.",note:"Values-led marketplace · category shelves · how-it-works journey",color:"#a24c36",paper:"#fff7ea",ink:"#44362e"}];
const products=[
{name:"Beeswax Food Wraps",slug:"beeswax-wraps",short:"Patterned food covers",blurb:"Sample patterned wraps for bowls, sandwiches and produce. Sizes, fabrics and prices will be confirmed by the maker.",care:"Use cool water and mild soap; air-dry. Avoid heat, microwaves and raw meat.",spec:"Sample sizes and prints • to be confirmed"},
{name:"Reusable Paper Towels",slug:"reusable-towels",short:"Washable kitchen cloths",blurb:"A colourful washable cloth set imagined for daily spills, drying and kitchen cleanup.",care:"Wash and dry according to the finished fabric and care label.",spec:"Sample fabric and pack count • to be confirmed"},
{name:"Kitchen Scrubbies",slug:"kitchen-scrubbies",short:"Handmade everyday scrubbers",blurb:"Textured handmade scrubbers, imagined for everyday kitchen jobs. Material and suitable surfaces must be verified.",care:"Rinse after use and dry completely. Follow fibre-specific cleaning directions.",spec:"Sample fibre and colours • to be confirmed"},
{name:"Reusable Snack Bags",slug:"snack-bags",short:"Fabric lunch companions",blurb:"Reusable pouches with cheerful patterns for carrying dry snacks and small lunch essentials.",care:"Wash according to fabric and lining, then dry thoroughly before storage.",spec:"Sample sizes and lining • to be confirmed"}
];
const q=new URLSearchParams(location.search),id=Number(q.get("template"))-1,app=document.getElementById("app");
if(window.self!==window.top && q.get('preview')==='1') document.documentElement.classList.add('embedded-preview');
const route=(name,i=id)=>'?template='+(i+1)+'#'+name;
const pRoute=(n)=>route('product-'+n);
const titleLink=(c)=>'<a class="brand" href="'+route('home')+'">Momma <em>Made</em><span> handmade essentials</span></a>';
function svgImage(index,seed=0){let p=index%4;const bg=['#e8eadc','#f5e2cb','#d2e6df','#f3dfe4'][(p+seed)%4],a=['#c25d4f','#e6ae4a','#5c9b79','#b2679a'][(p+seed)%4],b=['#e0bba6','#7bb0a2','#b3a6d0','#eec67f'][(p+seed+1)%4];let shape='';
if(p===0)shape='<ellipse cx="380" cy="366" rx="155" ry="86" fill="#b9a891" opacity=".38"/><ellipse cx="380" cy="325" rx="149" ry="76" fill="#f6f3e6" stroke="#aa957e" stroke-width="12"/><ellipse cx="380" cy="331" rx="123" ry="53" fill="#cd9072"/><g transform="rotate(-17 270 255)"><rect x="104" y="125" width="290" height="270" rx="20" fill="'+a+'" stroke="#fff7e9" stroke-width="9"/><path d="M105 318 Q210 272 392 342 L395 399 105 397Z" fill="'+b+'" opacity=".74"/><rect x="104" y="125" width="290" height="270" rx="20" fill="url(#dots)" opacity=".8"/></g><g transform="rotate(16 448 247)"><rect x="344" y="120" width="200" height="250" rx="14" fill="'+b+'" stroke="#fff7e9" stroke-width="8"/><rect x="344" y="120" width="200" height="250" rx="14" fill="url(#stripes)" opacity=".8"/></g>';
if(p===1)shape='<ellipse cx="334" cy="465" rx="226" ry="45" fill="#b6a99a" opacity=".3"/><g transform="rotate(-13 330 290)"><rect x="143" y="180" width="350" height="225" rx="18" fill="#e3d2b6" stroke="#fffaf0" stroke-width="11"/><rect x="159" y="161" width="350" height="225" rx="18" fill="'+b+'" stroke="#fff7ea" stroke-width="9"/><rect x="177" y="141" width="350" height="225" rx="18" fill="'+a+'" stroke="#fff7ea" stroke-width="9"/><path d="M207 169 H490 M207 339 H490" stroke="#fff4dc" stroke-dasharray="5 9" stroke-width="5"/><rect x="185" y="150" width="335" height="200" fill="url(#dots)" opacity=".7"/></g>';
if(p===2){shape='<ellipse cx="325" cy="434" rx="213" ry="45" fill="#b4a99a" opacity=".35"/>';[ [266,290,132,a],[405,325,114,b],[339,392,92,'#eac48f']].forEach(([cx,cy,r,col],j)=>{shape+='<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="'+col+'" stroke="#fff4e1" stroke-width="12"/>';for(let k=0;k<28;k++){let t=2*Math.PI*k/28,x=cx+Math.cos(t)*(r-30),y=cy+Math.sin(t)*(r-30);shape+='<path d="M'+x.toFixed(1)+' '+y.toFixed(1)+' q 9 -8 17 2" stroke="#f8ebd8" stroke-width="5" fill="none" stroke-linecap="round"/>'}shape+='<circle cx="'+cx+'" cy="'+cy+'" r="36" fill="none" stroke="#fff2d8" stroke-width="9" stroke-dasharray="5 7"/>'})}
if(p===3)shape='<ellipse cx="338" cy="460" rx="224" ry="39" fill="#b3a393" opacity=".4"/><g transform="rotate(-13 242 272)"><path d="M129 161 L352 161 370 406 Q245 444 110 399Z" fill="'+a+'" stroke="#fff0e1" stroke-width="10"/><path d="M130 183 Q241 205 351 183" fill="none" stroke="#fff8e9" stroke-width="9"/><path d="M130 195 L352 195 358 224 125 224Z" fill="'+b+'"/><path d="M166 254 H316 M166 284 H316 M166 314 H316" stroke="#fff5e7" opacity=".65" stroke-width="8"/></g><g transform="rotate(10 445 290)"><path d="M350 185 L547 185 562 396 Q457 431 340 395Z" fill="'+b+'" stroke="#fff3e1" stroke-width="10"/><path d="M359 207 L539 207 541 235 355 235Z" fill="'+a+'"/><rect x="358" y="235" width="182" height="140" fill="url(#dots)" opacity=".75"/></g>';
let raw='<svg xmlns="http://www.w3.org/2000/svg" width="660" height="560" viewBox="0 0 660 560" role="img" aria-label="'+products[p].name+' conceptual illustration"><defs><pattern id="dots" width="39" height="39" patternUnits="userSpaceOnUse"><circle cx="12" cy="13" r="7" fill="#fff9de" opacity=".65"/><circle cx="29" cy="31" r="4" fill="#334f42" opacity=".24"/></pattern><pattern id="stripes" width="26" height="26" patternUnits="userSpaceOnUse"><path d="M0 0 L26 26" stroke="#fff2e1" stroke-width="6" opacity=".7"/></pattern><radialGradient id="light"><stop stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs><rect width="660" height="560" fill="'+bg+'"/><circle cx="340" cy="180" r="250" fill="url(#light)"/>'+shape+'</svg>';return 'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(raw)}
function art(i,cls=''){return '<img class="art '+cls+'" src="'+svgImage(i,Math.max(0,id))+'" alt="Original illustrated concept of '+products[i].name+'" loading="lazy" width="660" height="560">'}
function badge(){return '<div class="sample"><b>DESIGN PREVIEW</b> · Illustrative products · No purchases or payments</div>'}
function productLink(i,label='See details'){return '<a class="action" href="'+pRoute(i)+'">'+label+' <span aria-hidden="true">↗</span></a>'}
function card(i,variant=''){let p=products[i];return '<article class="item '+variant+'" data-index="'+i+'"><a class="image" href="'+pRoute(i+1)+'">'+art(i)+'</a><div class="item-text"><small>0'+(i+1)+' / MOMMA MADE</small><h3><a href="'+pRoute(i+1)+'">'+p.name+'</a></h3><p>'+p.short+'</p><span class="price">Price to be confirmed</span>'+productLink(i+1,'View product')+'</div></article>'}
function cards(order=[0,1,2,3],cls=''){return '<div class="items '+cls+'">'+order.map(i=>card(i)).join('')+'</div>'}
function features(){return '<div class="feature"><div><b>4</b><span>everyday essentials</span></div><div><b>100%</b><span>demo-only storefront</span></div><div><b>1</b><span>handmade Momma Made vision</span></div></div>'}
function strip(){return '<div class="strip">HANDMADE WITH PURPOSE <span>✳</span> REUSABLE BY DESIGN <span>✳</span> MADE FOR EVERYDAY LIFE <span>✳</span></div>'}
const refs=concepts.map((c,i)=>'<a href="?template='+(i+1)+'#home">'+String(i+1).padStart(2,'0')+' '+c.name+'</a>').join('');
function gallery(){document.title='Momma Made | Ten genuinely different website layouts';app.innerHTML='<div class="directory"><div class="dir-top">MOMMA MADE <span>DESIGN STUDIOS · TEN WAYS TO TELL A STORY</span></div><header class="dir-hero"><small>WEBSITE CONCEPT COLLECTION / 2026</small><h1>Not ten colours.<br><i>Ten different shops.</i></h1><p>Each live preview below is rendered directly from its own storefront layout, with distinct homepage composition, collections and product storytelling. Open any concept to explore its four demo products, story and care guide.</p><div class="dir-notice">Original vector illustrations are used as product-image placeholders. These are concept visuals, not photographs of finished Momma Made goods. Checkout is disabled in every design.</div></header><div class="dir-grid">'+concepts.map((c,i)=>'<article class="dir-card"><div class="dir-frame"><iframe title="'+c.name+' live storefront preview" src="?template='+(i+1)+'&preview=1#home" loading="lazy" tabindex="-1"></iframe></div><div class="dir-info"><span>DESIGN '+String(i+1).padStart(2,'0')+' / INSPIRED BY <a href="'+c.url+'" target="_blank" rel="noopener">'+c.ref+' ↗</a></span><h2>'+c.name+'</h2><p>'+c.note+'</p><a class="dir-action" href="?template='+(i+1)+'#home">Open full storefront ↗</a></div></article>').join('')+'</div><div class="dir-foot"><b>Momma Made</b><p>Ten original concepts • No live checkout • All products simulated</p></div></div>'}
function nav(c){
 const base=[['home','Home'],['shop','Shop'],['about','Our story'],['care','Use & care']];
 const navLinks=base.map(([url,label])=>`<a href="${route(url)}">${label}</a>`).join('');
 const cats=products.map((p,i)=>`<a href="${pRoute(i+1)}">${p.name}</a>`).join('');
 const utility=`<div class="nav-utils"><span class="demo-bag" aria-label="Checkout unavailable">Bag 0 · Demo</span><a href="./" aria-label="View all Momma Made designs">Designs ↗</a></div>`;
 const search=['supply','slow','market'].includes(c.style)?`<form class="nav-search" data-search-form role="search"><label class="sr-only" for="mm-search">Search products</label><input id="mm-search" type="search" placeholder="Search Momma Made..." aria-label="Search product concepts"><button type="submit">Search</button></form>`:'';
 let links='';
 if(['supply','slow','market'].includes(c.style)){
   links=`<nav aria-label="Store categories"><a href="${route('shop')}">Shop all</a>${cats}</nav>`;
 }else if(c.style==='heritage'){
   links=`<nav aria-label="Main navigation"><a href="${route('shop')}">SHOP</a><a href="${route('about')}">ABOUT</a><a href="${route('care')}">USE & CARE</a></nav>`;
 }else if(c.style==='maker'){
   links=`<nav aria-label="Main navigation"><a href="${route('shop')}">Catalogue</a><a href="${route('about')}">Maker story</a><a href="${route('care')}">Care</a></nav>`;
 }else{
   links=`<nav aria-label="Main navigation">${navLinks}</nav>`;
 }
 const bar=['happy','quiet','pattern','slow','market'].includes(c.style)?
   `<div class="nav-secondary" aria-label="Additional navigation"><a href="${route('home')}">Home</a>${cats}<a href="${route('care')}">Care guide</a></div>`:'';
 const header=`<header class="site-nav"><div class="nav-row"><button type="button" class="mobile-toggle" aria-controls="momma-mobile-menu" aria-expanded="false">☰ <span>Menu</span></button>${titleLink(c)}${search}${links}${utility}</div>${bar}</header>`;
 const mobile=`<div id="momma-mobile-menu" class="mobile-drawer" hidden><div class="drawer-label">EXPLORE MOMMA MADE</div>${navLinks}<div class="drawer-label">SHOP BY PRODUCT</div>${cats}<a href="./" class="drawer-small">← See all 10 designs</a></div>`;
 return header+mobile;
}
function foot(c){return '<footer class="site-foot"><div><strong>Momma <i>Made</i></strong><span>Handmade essentials, imagined with care.</span></div><div><a href="'+route('shop')+'">Collection</a><a href="'+route('about')+'">Story</a><a href="'+route('care')+'">Care</a><a href="./">Explore all ten designs ↗</a></div><p>Concept showroom only. Original illustrations are not actual inventory photographs. No prices, orders, reviews or claims are verified.</p></footer>'}
function home(c){
 const tiles=(order=[0,1,2,3])=>`<div class="fit-tiles">${order.map(i=>`<a href="${pRoute(i+1)}" class="fit-tile">${art(i)}<span>${products[i].name} <b>↗</b></span></a>`).join('')}</div>`;
 switch(c.style){
 case 'heritage':
 return `<section class="fit-heritage-hero"><div class="fit-heritage-copy"><small>THOUGHTFUL FOOD STORAGE · MOMMA MADE</small><h1>Keep the good stuff <em>fresh.</em></h1><p>Original handmade reusable kitchen concepts for the food and everyday moments you love.</p><a class="action" href="${route('shop')}">SHOP THE COLLECTION ↗</a></div><div class="fit-heritage-image">${art(0)}</div></section><section class="fit-section fit-choose"><small>MADE FOR ALL THE WAYS YOU USE IT</small><h2>Find the right reusable for your kitchen.</h2><div class="fit-nav-pills"><a href="${pRoute(1)}">Food wraps</a><a href="${pRoute(4)}">Lunch & snacks</a><a href="${pRoute(2)}">Kitchen cloths</a><a href="${pRoute(3)}">Cleaning</a></div>${tiles([0,3,1,2])}</section><section class="fit-section fit-how"><h2>A simple routine to use again.</h2><div class="fit-step-grid"><article>${art(0)}<h3>Cover</h3><p>Choose a suitable wrap for bowls or food storage.</p></article><article>${art(1)}<h3>Clean</h3><p>Care for each item according to its materials.</p></article><article>${art(3)}<h3>Reuse</h3><p>Reach for your everyday favourites again.</p></article></div><a href="${route('care')}">Explore the care guide ↗</a></section>`;
 case 'happy':
 return `<section class="fit-beewise-hero"><div class="fit-beewise-photo">${art(0)}</div><div class="fit-beewise-overlay"><small>THE MOMMA MADE COLLECTION</small><h1>Everyday reusables, <em>made with heart.</em></h1><p>Wraps, kitchen cloths, scrubbies and bags.</p><a class="fit-light-button" href="${route('shop')}">Shop the collection</a></div></section><section class="fit-beewise-statement"><p>Beeswax wraps · Reusable towels · Handmade kitchen helpers · More</p><h2>Useful little changes for everyday living.</h2></section><section class="fit-section fit-beewise-products"><h2>Customer favourites — concept collection</h2>${cards([0,1,3,2])}<a class="fit-underlink" href="${route('shop')}">See all four categories ↗</a></section><section class="fit-beewise-banner"><div>${art(1)}</div><div><small>EVERYDAY IN THE KITCHEN</small><h2>Make room for reusable routines.</h2><a class="action" href="${route('care')}">Learn how to care ↗</a></div></section>`;
 case 'quiet':
 return `<section class="fit-earthology-hero">${art(0)}<div><h1>Preserve what matters, <em>naturally.</em></h1></div></section><section class="fit-earthology-statement"><p>Thoughtfully imagined kitchen essentials for the reusable home.</p><h2>Beautifully useful, day after day.</h2><p>Explore four handmade Momma Made product concepts. Final materials, production and product details are still to be confirmed.</p></section><section class="fit-section fit-earthology-products"><h2>Explore the collection</h2>${cards([0,3,1,2])}</section><section class="fit-earthology-benefits"><div><b>✳</b><h3>Everyday</h3><p>Useful choices for daily life.</p></div><div><b>❋</b><h3>Reusable</h3><p>Designed around repeat use.</p></div><div><b>✺</b><h3>Thoughtful</h3><p>Considered shapes and colours.</p></div><div><b>✿</b><h3>Handmade vision</h3><p>A story we'll tell with the maker.</p></div></section>`;
 case 'supply':
 return `<section class="fit-package-hero">${art(1)}<div class="fit-package-text"><small>WELCOME TO MOMMA MADE</small><h1>Everyday essentials, reimagined.</h1><p>Well-loved kitchen helpers for real-life routines.</p><div class="fit-dual-buttons"><a class="action" href="${route('shop')}">Shop all essentials</a><a class="fit-outlined" href="${route('care')}">How to use them</a></div></div></section><section class="fit-package-intro"><h2>A simpler kitchen starts with a little swap.</h2><p>Small, useful things for the home. All products are demo concepts.</p></section><section class="fit-section fit-package-cat"><div class="fit-package-pair"><a href="${pRoute(2)}">${art(1)}<b>Shop kitchen cloths ↗</b></a><a href="${pRoute(4)}">${art(3)}<b>Shop snack bags ↗</b></a></div><h2>Explore the everyday collection</h2>${cards([1,2,0,3])}</section><section class="fit-package-values"><span>SIMPLER ROUTINES</span><span>REUSABLE GOODS</span><span>MAKER-LED DESIGN</span></section>`;
 case 'lab':
 return `<section class="fit-superbee-hero"><div class="fit-superbee-copy"><small>THE MOMMA MADE COLLECTION · EXPLORE THE EVERYDAY</small><h1>Reusable essentials for real homes.</h1><p>Thoughtfully imagined tools for packing, cleaning and storing.</p><a class="action" href="${route('shop')}">Explore the essentials</a><div class="fit-quiet-badges"><span>✳ 4 product concepts</span><span>✳ Designed for everyday routines</span><span>✳ No checkout</span></div></div><div class="fit-superbee-photo">${art(3)}</div></section><div class="fit-superbee-links"><a href="${pRoute(1)}">Wraps & bowl covers ↗</a><a href="${pRoute(4)}">Snack bags ↗</a><a href="${pRoute(2)}">Kitchen towels ↗</a></div><section id="finder" class="fit-superbee-finder"><header><small>DISCOVER YOUR NEXT REUSABLE</small><h2>Three routines, four simple helpers.</h2><p>Choose what you want to do; we'll show a matching Momma Made product concept.</p></header><div class="lab-options">${['Cover leftovers','Wipe a spill','Scrub dishes','Pack a snack'].map((x,i)=>`<button type="button" data-find="${i}" aria-pressed="${i===0}">${x}</button>`).join('')}</div><div id="lab-result" class="lab-result">${art(0)}<div><small>YOUR CONCEPT MATCH</small><h3>${products[0].name}</h3><p>${products[0].short}</p>${productLink(1,'Explore this product')}</div></div></section><section class="fit-section fit-superbee-collection"><h2>The essentials, all together.</h2>${cards([0,3,1,2])}</section>`;
 case 'maker':
 return `<section class="fit-louise-hero"><div class="fit-louise-image">${art(0)}</div><div class="fit-louise-copy"><h1>Beautiful,<br>reusable<br>everyday goods<br>made for home.</h1><a href="${route('shop')}" class="fit-light-button">Shop Momma Made</a></div></section><section class="fit-louise-story"><h2>The Momma Made story</h2><div class="fit-louise-columns"><article>${art(2)}<h3>A handmade beginning</h3><p>Explore the maker's real story when it's ready to share.</p></article><article>${art(0)}<h3>Everyday reusables</h3><p>Small, useful ideas designed around regular kitchen routines.</p></article><article>${art(3)}<h3>Made for sharing</h3><p>Browse four concept goods for lunch, storage and cleaning.</p></article></div></section><section class="fit-section fit-louise-favourites"><h2>Our favourites</h2>${cards([0,3,1,2])}<a class="fit-underlink" href="${route('shop')}">Full catalogue ↗</a></section>`;
 case 'pattern':
 return `<section class="fit-mind-hero"><div>${art(2)}</div><div>${art(0)}</div></section><section class="fit-mind-intro"><small>THE MOMMA MADE KITCHEN / EVERYDAY COLLECTION</small><h1>Make everyday moments a little more colourful.</h1><p>Four useful, reusable product ideas for the kitchen and the lunchbox.</p><a href="${route('shop')}" class="fit-outlined">Shop bestsellers</a></section><section class="fit-section fit-mind-products"><h2>Shop Momma Made favourites</h2>${cards([0,3,1,2])}</section><section class="fit-mind-categories"><h2>Shop for your home</h2>${tiles([3,0,2,1])}</section><section class="fit-mind-story">${art(1)}<div><small>ABOUT MOMMA MADE</small><h2>Colourful, useful, everyday.</h2><p>The maker's actual story, process and materials will be featured here.</p><a href="${route('about')}">Learn about Momma Made ↗</a></div></section>`;
 case 'slow':
 return `<section class="fit-hearterra-hero" data-slider="hearterra">${art(1)}<div class="fit-hearterra-overlay"><small>MOMMA MADE · HOME & KITCHEN ESSENTIALS</small><h1>Thoughtful reusables for a life well lived.</h1><a class="fit-soft-pill" href="${route('shop')}">Shop essentials</a></div><div class="fit-slide-controls"><button type="button" data-slide-prev aria-label="Previous slide">‹</button><span data-slide-count>1 / 2</span><button type="button" data-slide-next aria-label="Next slide">›</button></div></section><section class="fit-section fit-hearterra-lifestyle"><h2>Shop by everyday routine</h2><p>Pick the part of your day you'd like to make a little more reusable.</p><div class="fit-lifestyle-grid">${['For lunches','For the kitchen','For cleaning','For leftovers'].map((t,i)=>`<a href="${pRoute([4,2,3,1][i])}">${art([3,1,2,0][i])}<h3>${t}</h3><span>Explore ↗</span></a>`).join('')}</div></section><section class="fit-hearterra-feature"><div>${art(3)}</div><div><small>START WITH THE ESSENTIALS</small><h2>Simple swaps, useful every day.</h2><a class="fit-soft-pill" href="${route('shop')}">Explore the collection</a></div></section>`;
 case 'utility':
 return `<section class="fit-beebagz-banner">${art(3)}<div><h1>Keep the things you love close.</h1></div></section><section class="fit-beebagz-main"><div><h2>Pack, clean and carry with reusables.</h2><p>See the four Momma Made concept products for food storage and kitchen routines.</p><a class="action" href="${route('shop')}">Explore products</a></div>${art(0)}</section><section class="fit-beebagz-benefits"><article><b>⌁</b><h3>For food storage</h3><p>Explore wraps and sample bags.</p></article><article><b>◎</b><h3>For repeat use</h3><p>Ideas for everyday routines.</p></article><article><b>✦</b><h3>Easy-to-find care</h3><p>Provisional tips, pending material verification.</p></article><article><b>✳</b><h3>Four choices</h3><p>Compare the whole collection.</p></article></section><section class="fit-section fit-beebagz-products"><h2>Get to know the range</h2>${cards([3,0,1,2])}</section><section class="fit-beebagz-compare"><h2>Find the right product for your task</h2>${products.map((p,i)=>`<a href="${pRoute(i+1)}"><b>${p.name}</b><span>${p.short}</span><em>View ↗</em></a>`).join('')}</section>`;
 case 'market':
 return `<section class="fit-ethikli-hero" data-slider="ethikli">${art(0)}<div class="fit-ethikli-shade"><small>HANDMADE / REUSABLE / EVERYDAY</small><h1>Useful goods for a more thoughtful kitchen.</h1><a class="fit-light-button" href="${route('shop')}">Shop thoughtfully</a></div><div class="fit-slide-controls"><button type="button" data-slide-prev aria-label="Previous slide">‹</button><span data-slide-count>1 / 3</span><button type="button" data-slide-next aria-label="Next slide">›</button></div></section><section class="fit-ethikli-intro"><h2>Shop the values you live by.</h2><p>Momma Made is developing reusable everyday essentials with an emphasis on practical kitchen routines. Product specifications and claims await verification.</p></section><section class="fit-section fit-ethikli-best"><div class="fit-section-heading"><h2>Our everyday favourites</h2><a href="${route('shop')}">View all products ↗</a></div>${cards([1,0,3,2])}</section><section class="fit-ethikli-cats"><h2>Shop by category</h2>${tiles([0,1,2,3])}</section><section class="fit-ethikli-how"><h2>How to explore</h2><div><article><b>01</b><h3>Discover</h3><p>See the four product categories.</p></article><article><b>02</b><h3>Compare</h3><p>Explore their intended uses and provisional care.</p></article><article><b>03</b><h3>Meet the maker</h3><p>Learn the actual story behind Momma Made when it's ready.</p></article></div></section>`;
 }
}
function collection(c){
 const categories=[['All','all'],['Food storage','food'],['Lunch & snacks','lunch'],['Kitchen cleaning','cleaning']];
 const toolbar=`<div class="fit-catalog-toolbar"><div class="fit-filter-tabs">${categories.map(([label,key])=>`<button type="button" data-filter="${key}" aria-pressed="${key==='all'}">${label}</button>`).join('')}</div><label>Sort <select data-sort-products><option value="featured">Featured</option><option value="alphabetic">A–Z</option><option value="reverse">Z–A</option></select></label></div><p class="fit-filter-message" data-filter-message role="status">Showing four concept products</p>`;
 const aside=`<aside class="fit-filter-sidebar"><b>FILTER PRODUCTS</b><span>Product type</span>${categories.map(([label,key])=>`<button type="button" data-filter="${key}" aria-pressed="${key==='all'}">${label}</button>`).join('')}<small>Concept catalogue · no real inventory</small></aside>`;
 const grid=(order=[0,1,2,3],cls='')=>cards(order,cls+' fit-collection-cards');
 switch(c.style){
 case'heritage':return `<section class="fit-heritage-cat-hero"><div><small>MOMMA MADE / SHOP ALL</small><h1>Shop the collection.</h1></div>${art(3)}</section><div class="fit-shop-width"><div class="fit-shop-shell">${aside}<section><h2>Everyday reusable essentials</h2>${toolbar}${grid([0,3,1,2])}</section></div></div>`;
 case'happy':return `<section class="fit-beewise-cat"><small>MOMMA MADE REUSABLES</small><h1>Meet the useful little things.</h1><p>Browse food wraps, washable towels, kitchen scrubbers and snack bags.</p>${toolbar}${grid([0,1,3,2])}</section>`;
 case'quiet':return `<section class="fit-earthology-cat"><small>OUR SHOP / 01—04</small><h1>The whole collection</h1>${toolbar}${grid([0,3,1,2])}</section>`;
 case'supply':return `<section class="fit-package-cat-head"><small>MOMMA MADE / SHOP ALL</small><h1>All products</h1><p>A small selection of reusable kitchen concepts, imagined for everyday routines.</p></section><div class="fit-shop-width"><div class="fit-shop-shell">${aside}<section>${toolbar}${grid([1,2,0,3])}</section></div></div>`;
 case'lab':return `<section class="fit-superbee-cat"><small>START HERE / THE MOMMA MADE COLLECTION</small><div class="fit-superbee-cat-strip">${products.map((p,i)=>`<a href="${pRoute(i+1)}">${art(i)}<span>${p.name}</span></a>`).join('')}</div><h1>Four ways to make everyday reusable.</h1><p>Explore concept goods to cover, carry, clean and reuse.</p>${toolbar}${grid([0,3,1,2])}<a class="fit-underlink" href="${route('home')}">Try the interactive swap guide ↗</a></section>`;
 case'maker':return `<section class="fit-maker-cat-hero">${art(0)}<div><h1>The handmade collection.</h1><p>Everyday goods, thoughtfully imagined for Momma Made.</p></div></section><section class="fit-maker-cat"><h2>Shop now</h2><p>Explore the complete concept catalogue.</p>${toolbar}${grid([0,1,2,3])}</section>`;
 case'pattern':return `<section class="fit-mind-cat-hero"><div><small>EVERYDAY / MADE REUSABLE</small><h1>All the cheerful essentials.</h1><p>Explore the full Momma Made sample collection.</p></div>${art(0)}</section><section class="fit-mind-cat">${toolbar}${grid([0,3,1,2])}</section>`;
 case'slow':return `<section class="fit-hearterra-cat"><small>THE MOMMA MADE MARKETPLACE</small><h1>All essentials</h1><p>Browse useful kitchen goods by everyday routine.</p>${toolbar}${grid([1,3,0,2])}</section>`;
 case'utility':return `<section class="fit-beebagz-cat-hero"><div><h1>All Momma Made products</h1><p>Browse food storage and reusable kitchen essentials.</p></div>${art(3)}</section><section class="fit-beebagz-cat">${toolbar}${grid([3,0,2,1])}</section>`;
 case'market':return `<div class="fit-market-breadcrumb">Home / Shop / All products</div><section class="fit-market-cat"><h1>All Products</h1><div class="fit-shop-shell">${aside}<section>${toolbar}${grid([0,1,2,3])}</section></div></section>`;
 }
}
function detail(c,n){
 const p=products[n-1],cls=c.style;
 const gallery=`<div class="fit-product-gallery" data-gallery><div class="fit-product-main"><img class="art fit-primary-img" src="${svgImage(n-1,id)}" alt="Original illustration of ${p.name} – concept pattern one" width="660" height="560"><span class="fit-gallery-note">ORIGINAL PRODUCT CONCEPT ART · NOT ACTUAL INVENTORY</span></div><div class="fit-gallery-thumbs" role="group" aria-label="Choose an illustrative pattern">${[0,1,2].map((j)=>`<button type="button" data-gallery-thumb="${j}" aria-pressed="${j===0}" aria-label="View illustrative pattern ${j+1}"><img src="${svgImage(n-1,id+j)}" width="120" height="102" alt="Pattern ${j+1}"></button>`).join('')}</div></div>`;
 const select=`<div class="fit-print-selection"><b>Choose a concept pattern</b><div class="fit-pattern-options">${['Pattern A','Pattern B','Pattern C'].map((x,j)=>`<button type="button" data-pattern-choice="${j}" aria-pressed="${j===0}">${x}</button>`).join('')}</div><small>These are illustrative choices, not available inventory.</small></div>`;
 const info=`<div class="product-info fit-product-info"><small>HOME / MOMMA MADE / CONCEPT PRODUCT 0${n}</small><h1>${p.name}</h1><p class="fit-product-availability">Sample product · No orders being accepted</p><div class="price">PRICE TO BE CONFIRMED</div><p class="lead">${p.blurb}</p>${select}<button class="disabled" type="button" disabled aria-disabled="true">Checkout disabled · Design preview</button><div class="fit-product-accordions"><details open><summary>Description</summary><p>${p.short}. ${p.spec}</p></details><details><summary>Use & care</summary><p>${p.care}</p><a href="${route('care')}">View the full care guide ↗</a></details><details><summary>Ordering and availability</summary><p>There are no prices, inventory quantities, delivery rates or checkout functionality in this demonstration.</p></details></div><a class="back-link" href="${route('shop')}">← Back to shop</a></div>`;
 let extra='';
 if(['heritage','happy','pattern'].includes(cls))extra=`<section class="fit-product-recommendations"><h2>Explore the other essentials</h2>${cards([0,1,2,3].filter(i=>i!==n-1).slice(0,3))}</section>`;
 if(['quiet','maker','slow'].includes(cls))extra=`<div class="fit-editorial-product-note">Useful objects, carefully considered. <a href="${route('about')}">Discover the maker story ↗</a></div>`;
 if(['supply','lab','utility','market'].includes(cls))extra=`<section class="fit-technical-product-note"><b>THE PRODUCT AT A GLANCE</b><div><span>Purpose</span><p>${p.short}</p></div><div><span>Care</span><p>${p.care}</p></div><div><span>Availability</span><p>Concept demonstration only</p></div></section>`;
 return `<div class="fit-product-breadcrumb"><a href="${route('home')}">Home</a> / <a href="${route('shop')}">All products</a> / ${p.name}</div><section class="product-detail fit-product ${cls}-detail">${gallery}${info}</section>${extra}`;
}
function story(c){const sections={
heritage:['The hands behind the essentials.','The Momma Made story begins with the things we reach for every day. This space is reserved for the maker’s real story and photographs.'],
happy:['Hi, we’re Momma Made!','A happy little corner for handmade kitchen helpers. The maker’s personal story will be added here when approved.'],
quiet:['A story, gently told.','We believe the objects around us tell a story. This page is a draft awaiting real words and photographs from the maker.'],
supply:['Made for everyday life.','Learn about the person making the useful goods on these shelves. Maker biography and specifications are awaiting confirmation.'],
lab:['Meet the person behind the swaps.','A maker’s experience is as important as a product’s purpose. This future feature will tell that story with verified details.'],
maker:['A note from the maker.','This is the beginning of a personal workshop journal. Actual maker background, location and techniques will be added with permission.'],
pattern:['Behind the cheerful prints.','Every handmade piece starts with an idea. This is a concept draft, awaiting the real story behind Momma Made.'],
slow:['The story of making.','The care and time behind everyday objects matter. The actual maker story and imagery will be added here.'],
utility:['How Momma Made works.','Product construction and maker processes remain to be verified; this presentation is a non-commercial concept.'],
market:['Meet our little handmade brand.','This marketplace mockup will eventually include verified maker information and a real product catalogue.']
};let t=sections[c.style];return '<section class="content story-page"><div><small>MOMMA MADE / THE MAKER</small><h1>'+t[0]+'</h1><p>'+t[1]+'</p><a class="action" href="'+route('shop')+'">Browse the collection →</a></div>'+art(2)+'</section><div class="story-note">A real story deserves real details. No invented biography, testimonials or claims.</div>'}
function care(c){return '<section class="content care-page"><small>PRODUCT CARE / AN EVERYDAY GUIDE</small><h1>Care for the things you use.</h1><p>These are provisional suggestions only. Final care instructions depend on the actual materials and construction.</p><div class="care-grid">'+products.map((p,i)=>'<article>'+art(i)+'<div><b>0'+(i+1)+'</b><h2>'+p.name+'</h2><p>'+p.care+'</p>'+productLink(i+1,'See product')+'</div></article>').join('')+'</div><div class="care-note"><b>IMPORTANT</b><p>Verify product materials, allergies, food-contact suitability and manufacturer instructions before publishing these details for actual sales.</p></div></section>'}
let searchTerm='';
function render(){
 if(id<0||id>9){gallery();return}
 const c=concepts[id],r=decodeURIComponent(location.hash.slice(1).split('#')[0])||'home';
 document.body.className='store theme-'+c.style;
 document.documentElement.style.setProperty('--accent',c.color);document.documentElement.style.setProperty('--paper',c.paper);document.documentElement.style.setProperty('--ink',c.ink);
 document.title='Momma Made · '+c.name+' · '+r;
 const content=r==='home'?home(c):r==='shop'?collection(c):r==='about'?story(c):r==='care'?care(c):r.startsWith('product-')&&/^product-[1-4]$/.test(r)?detail(c,Number(r.split('-')[1])):home(c);
 app.innerHTML=badge()+nav(c)+'<main id="content">'+content+'</main>'+foot(c);
 const toggle=document.querySelector('.mobile-toggle'),drawer=document.querySelector('#momma-mobile-menu');
 toggle?.addEventListener('click',()=>{const open=drawer.hidden;drawer.hidden=!open;toggle.setAttribute('aria-expanded',String(open));toggle.textContent=open?'× Close':'☰ Menu';});
 document.querySelectorAll('#momma-mobile-menu a').forEach(a=>a.addEventListener('click',()=>{drawer.hidden=true;toggle?.setAttribute('aria-expanded','false');}));
 document.querySelectorAll('[data-find]').forEach(btn=>btn.addEventListener('click',()=>{
  let k=Number(btn.dataset.find);
  document.querySelectorAll('[data-find]').forEach(x=>x.setAttribute('aria-pressed',String(x===btn)));
  const e=document.querySelector('#lab-result');
  e.innerHTML=art(k)+'<div><small>YOUR CONCEPT MATCH</small><h3>'+products[k].name+'</h3><p>'+products[k].short+'</p>'+productLink(k+1,'Explore this product')+'</div>';
 }));
 document.querySelector('[data-scroll-finder]')?.addEventListener('click',()=>document.getElementById('finder')?.scrollIntoView({behavior:'smooth'}));
 document.querySelector('[data-search-form]')?.addEventListener('submit',e=>{
  e.preventDefault();searchTerm=e.currentTarget.querySelector('input')?.value.trim().toLowerCase()||'';
  if(r!=='shop')location.hash='shop';else render();
 });
 if(r==='shop'&&searchTerm){
  const items=[...document.querySelectorAll('.item')];
  for(const item of items)item.hidden=!item.textContent.toLowerCase().includes(searchTerm);
  const count=items.filter(x=>!x.hidden).length;
  let status=document.createElement('p');status.className='search-status';status.setAttribute('role','status');
  status.textContent=count?count+' matching demo product'+(count===1?'':'s')+' for “'+searchTerm+'”':'No demo products match “'+searchTerm+'”.';
  document.querySelector('.items')?.before(status);
 }
 const filters=[...document.querySelectorAll('[data-filter]')];
 if(filters.length){
  let category='all',sort='featured';
  const list=document.querySelector('.fit-collection-cards'),items=[...list.querySelectorAll('.item')];
  const original=new Map(items.map((el,i)=>[el.dataset.index,i]));
  const kinds=['food','cleaning','cleaning','lunch'];
  const refresh=()=>{
    filters.forEach(btn=>btn.setAttribute('aria-pressed',String(btn.dataset.filter===category)));
    let count=0;
    items.forEach(item=>{
      const index=Number(item.dataset.index);
      const show=(category==='all'||kinds[index]===category)&&(!searchTerm||item.textContent.toLowerCase().includes(searchTerm));
      item.hidden=!show;if(show)count++;
    });
    const sorted=[...items].sort((a,b)=>{
      if(sort==='featured')return original.get(a.dataset.index)-original.get(b.dataset.index);
      const x=products[Number(a.dataset.index)].name,y=products[Number(b.dataset.index)].name;
      return sort==='alphabetic'?x.localeCompare(y):y.localeCompare(x);
    });
    sorted.forEach(el=>list.appendChild(el));
    const message=document.querySelector('[data-filter-message]');
    if(message)message.textContent=count+' matching concept product'+(count===1?'':'s');
  };
  filters.forEach(btn=>btn.addEventListener('click',()=>{category=btn.dataset.filter;refresh()}));
  document.querySelector('[data-sort-products]')?.addEventListener('change',e=>{sort=e.target.value;refresh()});
  refresh();
 }
 const gallery=document.querySelector('[data-gallery]');
 if(gallery){
  const currentProduct=Number(r.split('-')[1])-1;
  const choose=variant=>{
   const main=gallery.querySelector('.fit-primary-img');
   main.src=svgImage(currentProduct,id+variant);
   main.alt='Original illustration of '+products[currentProduct].name+' – concept pattern '+(variant+1);
   gallery.querySelectorAll('[data-gallery-thumb]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.galleryThumb)===variant)));
   document.querySelectorAll('[data-pattern-choice]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.patternChoice)===variant)));
  };
  gallery.querySelectorAll('[data-gallery-thumb]').forEach(b=>b.addEventListener('click',()=>choose(Number(b.dataset.galleryThumb))));
  document.querySelectorAll('[data-pattern-choice]').forEach(b=>b.addEventListener('click',()=>choose(Number(b.dataset.patternChoice))));
 }
 const slider=document.querySelector('[data-slider]');
 if(slider){
  const type=slider.getAttribute('data-slider');
  const variants=type==='hearterra'?
   [{p:1,txt:'Thoughtful reusables for a life well lived.'},{p:3,txt:'Pack a little more joy into every day.'}]:
   [{p:0,txt:'Useful goods for a more thoughtful kitchen.'},{p:1,txt:'Good everyday choices begin at home.'},{p:3,txt:'Discover what fits your routine.'}];
  let position=0;const update=()=>{
   const current=variants[position],photo=slider.querySelector('img.art');
   if(photo){photo.src=svgImage(current.p,id);photo.alt='Original Momma Made illustration of '+products[current.p].name;}
   slider.querySelector('h1').textContent=current.txt;
   slider.querySelector('[data-slide-count]').textContent=(position+1)+' / '+variants.length;
  };
  slider.querySelector('[data-slide-prev]')?.addEventListener('click',()=>{position=(position-1+variants.length)%variants.length;update()});
  slider.querySelector('[data-slide-next]')?.addEventListener('click',()=>{position=(position+1)%variants.length;update()});
 }
 window.scrollTo(0,0);
}
window.addEventListener('hashchange',render);render();
})();