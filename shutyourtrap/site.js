(function shutYourTrapSite(){
'use strict';
const concepts=[
{title:"Service-First Sharp Edge",style:"edge",inspiration:"Stone & Strop",ref:"https://www.stoneandstrop.ca/",note:"Minimal sharpening-service navigation, clean split hero, prominent inquiry",headline:"A sharper edge for the work ahead.",sub:"Practical trapping, snaring and blade-sharpening service concepts, presented with a straightforward service-first experience.",accent:"#b36b3d",bg:"#f0eee8",fg:"#172226"},
{title:"Trapline Family Business",style:"family",inspiration:"Dam Beaver Trapping Supplies",ref:"https://www.dambeaver.ca/",note:"Warm family-business information structure, traditional banner and three service categories",headline:"Built around the work of the trapline.",sub:"An approachable rural service presentation centred on clear options, local conversations and the people behind the work.",accent:"#b58152",bg:"#f2ead9",fg:"#283229"},
{title:"Utility Supply Board",style:"utility",inspiration:"Volkers Trapping Supplies",ref:"https://www.vwcsupplies.com/",note:"Dense service catalogue, practical category navigation and field-gear visuals",headline:"Everything starts with the right service.",sub:"Organized trapping, snaring and sharpening information presented in a practical catalogue-style interface.",accent:"#d49755",bg:"#f2f0e7",fg:"#222a2a"},
{title:"Expedition Heritage",style:"expedition",inspiration:"Shackleton",ref:"https://shackleton.com/en-ca",note:"Full-bleed cinematic wilderness hero, editorial service sections and adventure-like composition",headline:"Prepared for the wild.",sub:"A cinematic outdoor concept built around landscape, experience and the work behind a reliable tool.",accent:"#c3a274",bg:"#15242b",fg:"#eee9dd"},
{title:"Sharpening Intake Flow",style:"intake",inspiration:"Leatherman Sharpening",ref:"https://ca.leatherman.com/pages/sharpening",note:"Large sharpening hero, simple service process and form-first enquiry journey",headline:"Keep your tools ready for the next job.",sub:"A direct inquiry workflow with clear steps and accessible sharpening-service information.",accent:"#cb784b",bg:"#f8f5ed",fg:"#252627"},
{title:"Knowledge + Workshop",style:"knowledge",inspiration:"Tormek",ref:"https://tormek.com/en",note:"Workshop learning, use-case navigation, educational service columns",headline:"Know the tool. Respect the edge.",sub:"A workshop-led layout combining sharpening information with outdoor service discovery.",accent:"#d3a064",bg:"#ebe8dd",fg:"#26302e"},
{title:"Trapline Journal",style:"journal",inspiration:"Wolf Trapping Supply",ref:"https://www.wolftrapping.com/",note:"Outdoor field-note editorial cards and forest panorama",headline:"Notes from the line.",sub:"A field-journal experience for service information, seasonal questions and workshop stories.",accent:"#d5b078",bg:"#eae7df",fg:"#27332e"},
{title:"Modern Rustic Tradesman",style:"rustic",inspiration:"Helle Knives",ref:"https://us.helle.com/",note:"Craftsmanship-led split presentation, tools and timber with generous negative space",headline:"Handwork. Fieldwork. Sharp work.",sub:"A modern workshop and craftsman concept with a warm, restrained material palette.",accent:"#ce9661",bg:"#eee4d3",fg:"#312c24"},
{title:"Bold Utility Operator",style:"operator",inspiration:"Work Sharp",ref:"https://www.worksharptools.com/",note:"Black/high-contrast utility panels, oversized statements and striking sharpening imagery",headline:"TRAPPING. SNARING. SHARPENING.",sub:"A bold, high-contrast service presentation with direct access to each service.",accent:"#f07a3b",bg:"#151a1c",fg:"#f8f5ed"},
{title:"Heritage Outfitter Lite",style:"outfitter",inspiration:"Benchmade LifeSharp",ref:"https://www.benchmade.com/pages/lifesharp",note:"Heritage-style outdoor storytelling and clear maintenance journey",headline:"Ready for every season.",sub:"A timeless outdoor-services concept balancing natural scenery with practical sharpening information.",accent:"#c4a26e",bg:"#f3eee2",fg:"#28302a"}
];
const serv=[
{slug:"trapping",title:"Trapping Services",k:"trapping",intro:"Discuss trapping-related service needs and the requirements that may apply to your situation.",scope:"Service availability, licensed activities, locations, species and land permissions must be confirmed directly with the business before anything is arranged.",guide:"Start a conversation about your situation; the owner can clarify whether the requested work falls within available, lawful services.",label:"FIELD SERVICES"},
{slug:"snaring",title:"Snaring Services",k:"snaring",intro:"Explore whether snaring-related services or advice may be appropriate for your circumstances.",scope:"Any snaring work is subject to relevant laws, humane requirements, land authorization and local restrictions. This demonstration does not confirm that specific services are available.",guide:"Use the demonstration inquiry page to see how a service request might be described without submitting real information.",label:"TRAPLINE SERVICES"},
{slug:"sharpening",title:"Sharpening Services",k:"sharpening",intro:"Ask about blade and tool sharpening needs for workshop, kitchen or outdoor equipment.",scope:"Supported tool types, handling methods, turnaround, rates and drop-off arrangements are all to be confirmed.",guide:"Identify the type of tool and describe the condition; the owner can confirm whether it can be serviced.",label:"WORKSHOP SERVICES"}
];
const $=s=>document.querySelector(s),app=$("#app");
const qs=new URLSearchParams(location.search),index=Number(qs.get("template"))-1,valid=index>=0&&index<10,preview=qs.get("preview")==="1";
function num(n){return String(n+1).padStart(2,"0")}
function to(route,at=index){return '?template='+(at+1)+'#'+route}
// Original AI-generated images: 17 verified unique sources curated for 40 image placements.
// This feature remains dormant until the photo-import workflow verifies every binary
// and atomically enables assets/photos/status.json. All SVGs remain working fallbacks.
const photoMap=[
 {
  "hero": "rustic_sunlit_sharpening_workshop.webp",
  "trapping": "misty_morning_forest_camp_gear.webp",
  "snaring": "rustic_wire_rope_workshop_still_life.webp",
  "sharpening": "macro_razor_blade_on_wet_whetstone.webp"
 },
 {
  "hero": "golden_dawn_at_the_lakeside_cabin.webp",
  "trapping": "rugged_outdoor_gear_flat_lay.webp",
  "snaring": "rustic_wire_rope_workshop_still_life.webp",
  "sharpening": "vintage_workshop_grinding_wheel_still_life.webp"
 },
 {
  "hero": "rugged_expedition_gear_flat_lay.webp",
  "trapping": "misty_morning_forest_camp_gear.webp",
  "snaring": "rustic_wire_rope_workshop_still_life.webp",
  "sharpening": "woodworking_sharpening_station_flat_lay.webp"
 },
 {
  "hero": "golden_sunrise_in_a_misty_pine_forest.webp",
  "trapping": "sunrise_backpack_over_misty_mountains.webp",
  "snaring": "rugged_expedition_gear_flat_lay.webp",
  "sharpening": "droplets_on_a_sharpened_blade.webp"
 },
 {
  "hero": "water_kissed_blade_on_whetstone.webp",
  "trapping": "rugged_outdoor_gear_flat_lay.webp",
  "snaring": "rustic_wire_rope_workshop_still_life.webp",
  "sharpening": "rustic_sunlit_sharpening_workshop.webp"
 },
 {
  "hero": "woodworking_sharpening_station_flat_lay.webp",
  "trapping": "misty_morning_forest_camp_gear.webp",
  "snaring": "rugged_outdoor_gear_flat_lay.webp",
  "sharpening": "macro_razor_blade_on_wet_whetstone.webp"
 },
 {
  "hero": "misty_morning_forest_camp_gear.webp",
  "trapping": "sunrise_backpack_over_misty_mountains.webp",
  "snaring": "rustic_wire_rope_workshop_still_life.webp",
  "sharpening": "lantern_lit_rustic_sharpening_workshop.webp"
 },
 {
  "hero": "lantern_lit_rustic_sharpening_workshop.webp",
  "trapping": "golden_dawn_lakeside_cabin.webp",
  "snaring": "rustic_wire_rope_workshop_still_life.webp",
  "sharpening": "woodworking_sharpening_station_flat_lay.webp"
 },
 {
  "hero": "vintage_workshop_grinding_wheel_still_life.webp",
  "trapping": "rugged_expedition_gear_flat_lay.webp",
  "snaring": "rustic_wire_rope_workshop_still_life.webp",
  "sharpening": "droplets_on_a_sharpened_blade.webp"
 },
 {
  "hero": "rustic_cabin_at_sunrise_lake.webp",
  "trapping": "golden_sunrise_at_the_lakeside_cabin.webp",
  "snaring": "rugged_outdoor_gear_flat_lay.webp",
  "sharpening": "water_kissed_blade_on_whetstone.webp"
 }
];
let photoReady=false;
function image(kind='hero',cls='',i=index,load='lazy'){
 const svg='./assets/'+num(i)+'-'+kind+'.svg';
 const filename=(photoMap[i]||{})[kind];
 const photo=filename?'./assets/photos/'+filename:'';
 const src=photoReady&&photo?photo:svg;
 return `<img src="${src}" data-syt-photo="${photo}" data-syt-fallback="${svg}" class="${cls}" alt="Original AI-generated concept ${kind} scene for Shut Your Trap; not a photo of the actual business" width="1600" height="900" loading="${load}" decoding="async">`;
}
function attachPhotoFallbacks(){
 app.querySelectorAll('img[data-syt-fallback]').forEach(img=>{
   img.addEventListener('error',()=>{
    const fallback=img.dataset.sytFallback;
    if(fallback&&!img.getAttribute('src').endsWith('.svg'))img.src=fallback;
   },{once:true});
 });
}
async function discoverPhotographs(){
 try{
   const response=await fetch('./assets/photos/status.json',{cache:'no-cache'});
   if(!response.ok)return;
   const status=await response.json();
   if(status.enabled!==true||status.image_count!==17)return;
   photoReady=true;
   document.querySelectorAll('img[data-syt-photo]').forEach(img=>{
     const photo=img.dataset.sytPhoto;
     if(photo)img.src=photo;
   });
 }catch(_error){/* Keep verified SVG fallback without interrupting the design. */}
}

function btn(route,label,klass='btn'){return `<a href="${to(route)}" class="${klass}">${label} <span aria-hidden="true">↗</span></a>`}
function serviceLinks(cls='service-grid'){return `<div class="${cls}">${serv.map((s,n)=>`<a class="service-card" href="${to(s.slug)}">${image(s.k,'')}<span><small>0${n+1} / ${s.label}</small><b>${s.title}</b><em>Explore service ↗</em></span></a>`).join('')}</div>`}
function line(){return `<div class="assurance">TRAPPING <span>✳</span> SNARING <span>✳</span> SHARPENING <span>✳</span> SERVICES SUBJECT TO CONFIRMATION</div>`}
function nav(c){
let group=[['home','Home'],['services','Services'],['trapping','Trapping'],['snaring','Snaring'],['sharpening','Sharpening'],['about','About'],['contact','Contact']];
let main=group.map(([r,t])=>`<a href="${to(r)}">${t}</a>`).join('');
let special=['utility','journal'].includes(c.style)?`<div class="category-nav"><b>EXPLORE SERVICES</b>${serv.map(s=>`<a href="${to(s.slug)}">${s.title}</a>`).join('')}</div>`:'';
let announcement=['family','outfitter','intake'].includes(c.style)?'<div class="notice">SHUT YOUR TRAP · ERMATINGER’S OUTDOOR & SHARPENING SERVICE CONCEPT</div>':'';
return `${announcement}<header class="site-header"><div class="head-row"><button id="menu-toggle" type="button" aria-controls="mobile-menu" aria-expanded="false" class="menu-toggle">☰ <span>Menu</span></button><a class="logo" href="${to('home')}"><span class="logo-mark" aria-hidden="true">✦</span><span>SHUT YOUR TRAP<small>ERMATINGER’S TRAPPING, SNARING & SHARPENING</small></span></a><nav class="desktop-nav" aria-label="Main">${main}</nav><a class="header-cta" href="${to('contact')}">Inquire ↗</a></div>${special}</header><div id="mobile-menu" class="mobile-menu" hidden>${main}<a href="./">View latest concepts</a><a href='./revisions/'>Revision history</a></div>`}
function footer(){return `<footer class="site-footer"><div><b>SHUT YOUR TRAP</b><p>Ermatinger’s Trapping, Snaring and Sharpening Services</p></div><div><a href="${to('services')}">Services</a><a href="${to('about')}">The story</a><a href="${to('contact')}">Inquiry</a><a href="./">Latest concepts</a><a href='./revisions/'>Revision history</a></div><small>Website design demonstration only. No real booking, pricing or guaranteed service availability.</small></footer>`}
function home(c){
switch(c.style){
case'edge':return `<section class="edge-hero"><div><small>FIELD & WORKSHOP SERVICES</small><h1>${c.headline}</h1><p>${c.sub}</p>${btn('services','Explore services')}${btn('contact','Ask a question','link-plain')}</div>${image('sharpening','hero-img',index,'eager')}</section><div class="mini-steps"><span>01 / DISCUSS</span><span>02 / CONFIRM</span><span>03 / ARRANGE</span></div><section class="section"><div class="section-head"><small>WHAT WE CAN DISCUSS</small><h2>Three practical service areas.</h2></div>${serviceLinks('edge-cards')}</section><section class="story-split">${image('hero')}<div><small>THE SHUT YOUR TRAP CONCEPT</small><h2>Clear answers. Practical work.</h2><p>Speak with the owner to confirm what services, schedules and locations may be available.</p>${btn('about','Meet the business')}</div></section>`;
case'family':return `<section class="family-hero">${image('hero','',index,'eager')}<div><small>WELCOME TO SHUT YOUR TRAP</small><h1>${c.headline}</h1><p>${c.sub}</p>${btn('services','Our services')}</div></section><section class="family-choices">${serviceLinks('wooden-cards')}</section><div class="family-band"><strong>OUTDOOR WORK • WORKSHOP CARE</strong><p>A place to explore services, ask questions and get clear information before making arrangements.</p></div><section class="section family-story"><div>${image('trapping')}</div><div><small>A BUSINESS WITH A PERSONAL STORY</small><h2>The person behind the name.</h2><p>Real maker and trapline history can be added after review with the owner.</p>${btn('about','Read the story')}</div></section>`;
case'utility':return `<section class="utility-hero"><div class="utility-copy"><small>SHUT YOUR TRAP / SERVICE INDEX</small><h1>${c.headline}</h1><p>${c.sub}</p>${btn('services','VIEW ALL SERVICES')}</div>${image('snaring','',index,'eager')}</section><section class="section"><div class="section-head"><small>SERVICE DIRECTORY</small><h2>Choose a service category.</h2></div>${serviceLinks('utility-cards')}</section><section class="utility-overview"><b>01 / TRAPPING</b><b>02 / SNARING</b><b>03 / SHARPENING</b><span>All work and applicable requirements must be confirmed with the owner.</span></section><section class="section"><h2>A straightforward inquiry process.</h2><div class="steps"><p><b>01</b> Explain what you need</p><p><b>02</b> Confirm available services</p><p><b>03</b> Arrange next steps if appropriate</p></div></section>`;
case'expedition':return `<section class="expedition-hero">${image('hero','',index,'eager')}<div><small>OUTDOOR SERVICE CONCEPT / SHUT YOUR TRAP</small><h1>${c.headline}</h1><p>${c.sub}</p>${btn('services','EXPLORE SERVICES','btn light')}</div></section><section class="expedition-intro"><small>THE WORK BEHIND THE LANDSCAPE</small><h2>When the work calls for care, start with a conversation.</h2></section><section class="expedition-features"><a href="${to('trapping')}">${image('trapping')}<h3>Field services</h3><span>Explore trapping ↗</span></a><a href="${to('snaring')}">${image('snaring')}<h3>Trapline questions</h3><span>Explore snaring ↗</span></a><a href="${to('sharpening')}">${image('sharpening')}<h3>Tool care</h3><span>Explore sharpening ↗</span></a></section><section class="expedition-ending"><small>THE NEXT STEP</small><h2>Your requirements. A clear conversation.</h2>${btn('contact','Make an inquiry')}</section>`;
case'intake':return `<section class="intake-hero"><div><small>TOOLS, FIELDWORK & SHARPENING</small><h1>${c.headline}</h1><p>${c.sub}</p>${btn('contact','Preview an inquiry')}</div>${image('sharpening','',index,'eager')}</section><section class="intake-process"><h2>How a service request could work</h2><div class="intake-steps"><article><b>1</b><h3>Describe your need</h3><p>Choose trapping, snaring or sharpening.</p></article><article><b>2</b><h3>Confirm the details</h3><p>Discuss applicable limits, tools and availability.</p></article><article><b>3</b><h3>Arrange next steps</h3><p>The business owner confirms whether work can proceed.</p></article></div></section><section class="section"><h2>Browse service details</h2>${serviceLinks('intake-cards')}</section><section class="intake-call">${image('hero')}<div><h2>Have a specific question?</h2><p>This preview form demonstrates a future inquiry experience. Nothing is sent.</p>${btn('contact','Open demo inquiry')}</div></section>`;
case'knowledge':return `<section class="knowledge-hero"><div><small>FIELD SKILLS & TOOL CARE</small><h1>${c.headline}</h1><p>${c.sub}</p>${btn('services','Browse services')}</div>${image('sharpening','',index,'eager')}</section><section class="knowledge-categories"><a href="${to('sharpening')}">01 / TOOL CARE ↗</a><a href="${to('trapping')}">02 / FIELD SERVICES ↗</a><a href="${to('snaring')}">03 / TRAPLINE QUESTIONS ↗</a></section><section class="section"><div class="section-head"><small>EXPLORE BY TOPIC</small><h2>Learn what each service covers.</h2></div>${serviceLinks('knowledge-cards')}</section><section class="knowledge-article"><div><small>THE WORKSHOP VIEW</small><h2>Knowledge starts with the right questions.</h2><p>Explore the intended use of the service and discuss what can be provided before making plans.</p>${btn('contact','Ask the owner')}</div>${image('hero')}</section>`;
case'journal':return `<section class="journal-hero">${image('hero','',index,'eager')}<div><small>FIELD NOTES / VOL. 01</small><h1>${c.headline}</h1><p>${c.sub}</p>${btn('services','Explore the service notes','btn light')}</div></section><section class="section journal-service-index"><div class="section-head"><small>SERVICE CATEGORY INDEX</small><h2>Trapping, snaring and tool-care information.</h2></div>${serviceLinks("journal-supply-cards")}</section><section class="journal-editorial"><div><small>FROM THE FIELD</small><h2>Three conversations worth having.</h2><p>Service questions, workshop needs and the practical realities of the outdoors.</p></div><div class="journal-articles">${serv.map((s,n)=>`<a href="${to(s.slug)}">${image(s.k)}<small>FIELD NOTE 0${n+1}</small><h3>${s.title}</h3><span>Read the overview ↗</span></a>`).join('')}</div></section><section class="journal-quote">“A good place to begin is knowing what needs to be done.”</section>`;
case'rustic':return `<section class="rustic-hero">${image('hero','',index,'eager')}<div><small>SHUT YOUR TRAP / WORKSHOP & FIELD</small><h1>${c.headline}</h1><p>${c.sub}</p>${btn('services','Explore the work')}</div></section><section class="rustic-lead"><p>TRAPPING</p><span>✦</span><p>SNARING</p><span>✦</span><p>SHARPENING</p></section><section class="section rustic-services"><div class="section-head"><small>THE SERVICE COLLECTION</small><h2>Considered work, straightforward information.</h2></div>${serviceLinks('rustic-cards')}</section><section class="rustic-detail">${image('sharpening')}<div><small>TOOL CARE</small><h2>Built around practical needs.</h2><p>Learn what to discuss before arranging sharpening or field services.</p>${btn('contact','Get in touch')}</div></section>`;
case'operator':return `<section class="operator-hero"><div><small>NO GUESSWORK / JUST THE SERVICES</small><h1>TRAPPING.<br>SNARING.<br><em>SHARPENING.</em></h1><p>${c.sub}</p>${btn('services','GET SERVICE DETAILS')}</div>${image('sharpening','',index,'eager')}</section><section class="operator-services"><a href="${to('trapping')}">${image('trapping')}<span>01</span><b>TRAPPING ↗</b></a><a href="${to('snaring')}">${image('snaring')}<span>02</span><b>SNARING ↗</b></a><a href="${to('sharpening')}">${image('sharpening')}<span>03</span><b>SHARPENING ↗</b></a></section><section class="operator-statement"><span>THE NEXT STEP</span><h2>ASK FIRST.<br>GET THE DETAILS.</h2>${btn('contact','PREVIEW INQUIRY')}</section>`;
case'outfitter':return `<section class="outfitter-hero">${image('hero','',index,'eager')}<div><small>SHUT YOUR TRAP · OUTDOOR & WORKSHOP SERVICES</small><h1>${c.headline}</h1><p>${c.sub}</p>${btn('services','Discover the services','btn light')}</div></section><section class="outfitter-choices"><div class="section-head"><small>FIELDWORK & TOOL CARE</small><h2>Find what you need.</h2></div>${serviceLinks('outfitter-cards')}</section><section class="outfitter-process"><div class="section-head"><small>A STRAIGHTFORWARD SERVICE JOURNEY</small><h2>Start with the practical details.</h2></div><div class="outfitter-steps"><article><b>01</b><h3>Describe the request</h3><p>Clarify the type of fieldwork or tool care needed.</p></article><article><b>02</b><h3>Confirm availability</h3><p>Service scope, permissions and timing must be agreed with the owner.</p></article><article><b>03</b><h3>Arrange next steps</h3><p>Discuss arrangements only after details are verified.</p></article></div></section><section class="outfitter-story"><div>${image('trapping')}</div><div><small>FAMILY NAME, PERSONAL SERVICE</small><h2>Ermatinger's Shut Your Trap.</h2><p>Real photographs and personal history can replace this concept text once reviewed by the business owner.</p>${btn('about','About the business')}</div></section><section class="outfitter-end"><small>START HERE</small><h2>Ready for a conversation?</h2>${btn('contact','Preview an inquiry')}</section>`;
}}
function services(c){return `<section class="inner-hero inner-${c.style}">${image('hero')}<div><small>THE SHUT YOUR TRAP SERVICE OVERVIEW</small><h1>Trapping, snaring & sharpening.</h1><p>Explore the service areas and the details to confirm before requesting work.</p></div></section><div class="inner-main"><div class="section-head"><small>THREE SERVICE AREAS</small><h2>Choose your next step.</h2></div>${serviceLinks('service-page-grid')}${line()}<div class="info-panel"><h2>What happens next?</h2><p>Use the demo inquiry to explore how a question might be submitted. Actual rates, service availability, licence requirements, timelines and contact details must be supplied and approved by the business owner.</p>${btn('contact','Preview inquiry')}</div></div>`}
function detail(c,s){let k=serv.find(x=>x.slug===s);return `<div class="detail-crumb"><a href="${to('home')}">Home</a> / <a href="${to('services')}">Services</a> / ${k.title}</div><section class="detail-view detail-${c.style}"><div class="detail-image">${image(k.k,'',index,'eager')}</div><div class="detail-info"><small>${k.label} / ERMATINGER’S</small><h1>${k.title}</h1><p class="lead">${k.intro}</p><div class="detail-rule"><h3>What to confirm</h3><p>${k.scope}</p></div><div class="detail-rule"><h3>Starting point</h3><p>${k.guide}</p></div>${btn('contact','Ask about this service')}<p class="demo-small">Demonstration only: no live appointment booking or payment.</p></div></section><section class="related"><div class="section-head"><h2>Explore other services.</h2></div>${serviceLinks('related-grid')}</section>`}
function about(c){return `<section class="about-page about-${c.style}"><div>${image('hero','',index,'eager')}</div><div><small>ABOUT SHUT YOUR TRAP</small><h1>A name with a story to tell.</h1><p>Shut Your Trap is a proposed website presentation for Ermatinger’s Trapping, Snaring and Sharpening Services.</p><p>We are reserving this space for the owner's authentic story, real photographs, work background and approved service details rather than inventing a biography, years of experience, licences or endorsements.</p><p>Every concept in this gallery is a demonstration for review, not a claim that a particular service is currently available.</p>${btn('services','Explore the services')}</div></section><section class="about-timeline"><small>WHAT WE KNOW</small><div><b>01</b><span>Business name</span><strong>Shut Your Trap</strong></div><div><b>02</b><span>Service categories</span><strong>Trapping · Snaring · Sharpening</strong></div><div><b>03</b><span>To be confirmed</span><strong>Story, experience, location, contact and availability</strong></div></section>`}
function contact(c){return `<section class="contact-top"><small>CONTACT / DEMO INQUIRY</small><h1>Start with a question.</h1><p>No information is sent or stored by this prototype. Please do not enter real personal information.</p></section><section class="contact-layout"><div><h2>What can we discuss?</h2><p>Tell the owner about your trapping, snaring or sharpening needs once real contact details have been confirmed and the website is activated.</p><div class="contact-options">${serv.map(s=>`<a href="${to(s.slug)}">${s.title} ↗</a>`).join('')}</div><div class="contact-caution"><b>Important</b><p>Trapping and snaring requests are subject to applicable regulations, permissions, service boundaries and owner confirmation. This website makes no licensing or availability claim.</p></div></div><form id="demo-inquiry" class="demo-form"><h2>Inquiry preview</h2><label>Service of interest<select name="service"><option value="">Choose a service</option>${serv.map(s=>`<option>${s.title}</option>`).join('')}</select></label><label>Preferred name <span>(sample only)</span><input name="name" placeholder="Example Name" autocomplete="off"></label><label>Email <span>(sample only — not sent)</span><input type="text" name="email" placeholder="example@example.com" autocomplete="off"></label><label>Question<textarea name="message" rows="5" placeholder="Describe a sample service question…"></textarea></label><button type="submit" class="btn">Preview inquiry — do not send ↗</button><p class="form-status" role="status" aria-live="polite">Demo mode. Nothing is submitted, emailed or saved.</p></form></section>`}
function directory(){const links=concepts.map((c,i)=>`<article class="dir-card"><div class="preview-frame"><iframe title="${c.title} site preview" loading="lazy" src="?template=${i+1}&preview=1#home" tabindex="-1"></iframe><a class="preview-overlay" href="?template=${i+1}#home" aria-label="Open ${c.title}"></a></div><div class="dir-desc"><div class="dir-index">DESIGN ${num(i)} <span>INSPIRED BY <a target="_blank" rel="noopener noreferrer" href="${c.ref}">${c.inspiration} ↗</a></span></div><h2>${c.title}</h2><p>${c.note}</p><a class="dir-open" href="?template=${i+1}#home">Explore full design ↗</a></div></article>`).join('');
return `<div class="directory"><header class="dir-head"><a href="/" class="dir-logo">DELTA OWL EYES <span>WEB DESIGN SHOWROOM</span></a><a href="https://www.deltaowleyes.ca/">Back to main website ↗</a></header><div class="dir-mast"><small>WEB DESIGN SERVICES 2.0 · LATEST COLLECTION · VERSION 1</small><h1>Shut Your Trap.<br><em>Ten ways to make an impression.</em></h1><p>Ermatinger’s Trapping, Snaring and Sharpening Services — ten original website concepts built around rugged fieldwork, workshop care and clear service inquiries.</p><div class="dir-terms">This is a design demonstration. The illustrated scenes are original concept art. Real owner details, service eligibility, imagery, rates and contact information await review; no bookings or payments are enabled.</div></div><section class="dir-grid">${links}</section><footer class="dir-footer">SHUT YOUR TRAP / ERMATINGER’S — LATEST TEN WEBSITE DESIGNS · <a href="./revisions/">REVISION HISTORY</a> · <a href="/">DELTA OWL EYES</a></footer></div>`}
function render(){
if(!valid){document.body.className="directory-body";app.innerHTML=directory();document.title="Shut Your Trap | 10 Website Designs";return}
const c=concepts[index],route=location.hash.replace(/^#/,"")||"home";
document.body.className="site theme-"+c.style;
if(preview)document.documentElement.classList.add("embedded-preview");
else document.documentElement.classList.remove("embedded-preview");
document.documentElement.style.setProperty('--accent',c.accent);
document.documentElement.style.setProperty('--paper',c.bg);
document.documentElement.style.setProperty('--ink',c.fg);
document.title=c.title+" | Shut Your Trap";
let page=route==="home"?home(c):route==="services"?services(c):route==="about"?about(c):route==="contact"?contact(c):serv.some(s=>s.slug===route)?detail(c,route):home(c);
app.innerHTML='<div class="demo-ribbon">WEBSITE CONCEPT • NO LIVE BOOKINGS • SERVICE DETAILS TO BE CONFIRMED</div>'+nav(c)+'<main id="content">'+page+'</main>'+footer();
attachPhotoFallbacks();
const toggle=$("#menu-toggle"),drawer=$("#mobile-menu");
toggle?.addEventListener("click",()=>{drawer.hidden=!drawer.hidden;toggle.setAttribute("aria-expanded",String(!drawer.hidden));toggle.innerHTML=drawer.hidden?'☰ <span>Menu</span>':'× <span>Close</span>'});
drawer?.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{drawer.hidden=true;toggle?.setAttribute("aria-expanded","false")}));
const form=$("#demo-inquiry");
form?.addEventListener("submit",event=>{event.preventDefault();form.querySelector(".form-status").textContent="Demonstration only: no inquiry has been sent or stored. The form is intentionally disconnected.";form.reset()});
window.scrollTo(0,0)
}
window.addEventListener("hashchange",render);
render();
discoverPhotographs();
})();