(function () {
'use strict';
var ROOT='/deltaexpress/';
var FAMILIES=[
 {slug:'river-voice',title:'River Voice',tag:'Editorial & News',num:'01',icon:'◉',headline:'Stories that move communities forward.',sub:'A bold, immersive editorial identity for journalism, advocacy, and meaningful stories.',hero:'/deltaexpress/assets/scene-river-voice.svg',support:'/assets/wetlands.png',accent:'#e5ae69',base:'river'},
 {slug:'modern-longhouse',title:'Modern Longhouse',tag:'Community & Gathering',num:'02',icon:'✦',headline:'A place to gather. A place to grow.',sub:'A warm community-first direction with inviting gatherings, education and resources.',hero:'/deltaexpress/assets/scene-modern-longhouse.svg',support:'/assets/hero.png',accent:'#e9b16a',base:'longhouse'},
 {slug:'accountability-ledger',title:'Accountability Ledger',tag:'Investigations & Impact',num:'03',icon:'◆',headline:'Facts first. Change follows.',sub:'A powerful documentary-inspired system for accountability, evidence and action.',hero:'/deltaexpress/assets/scene-accountability-ledger.svg',support:'/assets/wetlands.png',accent:'#cf3e45',base:'ledger'},
 {slug:'northern-horizons',title:'Northern Horizons',tag:'Culture & Landscape',num:'04',icon:'✺',headline:'A deeper connection to land and story.',sub:'An atmospheric, image-rich design for culture, people, and place.',hero:'/deltaexpress/assets/scene-northern-horizons.svg',support:'/assets/hero.png',accent:'#7bd6ca',base:'horizons'},
 {slug:'community-network',title:'Community Network',tag:'Directory & Services',num:'05',icon:'⬡',headline:'Find local. Build community.',sub:'A practical and beautifully organized home for businesses, events and services.',hero:'/deltaexpress/assets/scene-community-network.svg',support:'/assets/hero.png',accent:'#bd7748',base:'network'},
 {slug:'media-hub',title:'Media Hub',tag:'Video & Podcast',num:'06',icon:'▶',headline:'Ideas worth watching. Stories worth sharing.',sub:'A high-contrast, screen-first identity for video, audio, interviews and episodes.',hero:'/deltaexpress/assets/scene-media-hub.svg',support:'/assets/hero.png',accent:'#fa6164',base:'media'}
];
var VARIANTS=[
 {slug:'signature',name:'Signature Cinematic',tag:'Image-led hero',summary:'A dramatic opening with high-impact visuals and direct actions.',layout:'signature'},
 {slug:'split-story',name:'Split Story',tag:'Balanced two-column',summary:'Strong headline and visual storytelling share equal space.',layout:'split'},
 {slug:'story-grid',name:'Story Grid',tag:'Discovery-led',summary:'A curated tile system that puts content and exploration first.',layout:'grid'},
 {slug:'minimal-journal',name:'Minimal Journal',tag:'Quiet and refined',summary:'Spacious typography, restrained color and an editorial rhythm.',layout:'minimal'},
 {slug:'bold-campaign',name:'Bold Campaign',tag:'Statement-first',summary:'Oversized type and confident calls to action for a clear message.',layout:'campaign'},
 {slug:'immersive-feature',name:'Immersive Feature',tag:'Layered and atmospheric',summary:'Full-bleed imagery with a sophisticated feature-card composition.',layout:'feature'}
];
function esc(value){return String(value).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function bySlug(slug){return FAMILIES.find(function(f){return f.slug===slug;});}
function familyPath(f){return ROOT+f.slug+'/';}
function selectId(fi,vi){return 'EX-'+(fi+1)+'0'+(vi+1);}
var page=document.documentElement.getAttribute('data-family')||'home';
var app=document.getElementById('express-app');
var selected=null, hoverTimer=null, lastTrigger=null;
function h(tag,attrs,contents){
 var el=document.createElement(tag);
 Object.keys(attrs||{}).forEach(function(k){if(k==='class')el.className=attrs[k];else if(k==='text')el.textContent=attrs[k];else el.setAttribute(k,attrs[k]);});
 if(contents!==undefined){if(typeof contents==='string')el.innerHTML=contents;else el.appendChild(contents);}
 return el;
}
function frameDoc(f,v){
 var fi=FAMILIES.indexOf(f), vi=VARIANTS.indexOf(v);
 var title=esc(f.headline),sub=esc(f.sub);
 return '<!doctype html><html lang="en" data-theme="'+esc(f.base)+'" data-layout="'+esc(v.layout)+'"><head>'+
 '<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+
 '<link rel="stylesheet" href="'+ROOT+'assets/preview.css"></head><body>'+
 '<div class="demo-wrap"><header class="site-head"><div class="demo-brand"><span class="brand-mark">'+esc(f.icon)+'</span><span>THE '+esc(f.title.toUpperCase())+' <small>DESIGN DEMONSTRATION</small></span></div><nav aria-label="Example navigation"><span>Home</span><span>Stories</span><span>Community</span><span>About</span><span>Contact</span></nav><span class="menu-icon">☰</span></header>'+
 '<main><section class="hero"><div class="hero-image"><img alt="Nature and visual atmosphere" src="'+esc(f.hero)+'"></div>'+
 '<div class="hero-copy"><p class="eyebrow">DESIGN '+selectId(fi,vi)+' / '+esc(v.tag)+'</p>'+
 '<h1>'+title+'</h1><p class="hero-sub">'+sub+'</p><div class="hero-actions"><span class="action-primary">Explore our work <b>↗</b></span><span class="action-secondary">Our story →</span></div></div>'+
 '<div class="hero-side-label">MEANINGFUL DESIGN • YOUR STORY</div></section>'+
 '<section class="features"><div class="feature-intro"><span class="eyebrow">BUILT AROUND YOUR GOALS</span><h2>Make every first impression count.</h2></div>'+
 '<div class="feature-tile"><span>01 / </span><strong>Beautifully considered</strong><p>Focused composition and a clear visual hierarchy.</p></div>'+
 '<div class="feature-tile"><span>02 / </span><strong>Ready for all screens</strong><p>Thoughtful layouts from desktop to phone.</p></div>'+
 '<div class="feature-tile"><span>03 / </span><strong>Made for your content</strong><p>Room for the people, services and stories that matter.</p></div></section>'+
 '<section class="story-band"><img src="'+esc(f.support)+'" alt=""><div><span class="eyebrow">THE NEXT CHAPTER</span><h2>Design with purpose.</h2><p>'+esc(v.summary)+'</p><span class="text-link">Discover the possibilities →</span></div></section></main>'+
 '<footer class="preview-footer"><strong>'+esc(f.title)+'</strong><span>Original demonstration · Content and images are illustrative.</span></footer></div></body></html>';
}
function makeThumb(f,v){
 var panel=h('div',{class:'thumb-art thumb-'+f.base+' thumb-layout-'+v.layout});
 var header=h('div',{class:'thumb-nav'});
 header.appendChild(h('b',{text:f.icon+'  '+f.title}));
 header.appendChild(h('span',{text:'HOME    ABOUT    CONTACT'}));
 panel.appendChild(header);
 var body=h('div',{class:'thumb-hero'});
 var pic=h('div',{class:'thumb-picture'});
 pic.style.backgroundImage='url("'+f.hero+'")';
 body.appendChild(pic);
 var content=h('div',{class:'thumb-copy'});
 content.appendChild(h('span',{class:'thumb-overline',text:v.tag.toUpperCase()}));
 content.appendChild(h('strong',{text:f.headline}));
 content.appendChild(h('small',{text:f.sub}));
 content.appendChild(h('i',{text:'Explore the possibilities ↗'}));
 body.appendChild(content);
 panel.appendChild(body);
 var footer=h('div',{class:'thumb-footer'});
 ['Your story','Our work','Get in touch'].forEach(function(s){footer.appendChild(h('b',{text:s}));});
 panel.appendChild(footer);
 return panel;
}
function makeCard(f,v,index,main){
 var card=h('article',{class:'design-card '+(main?'family-card':'variation-card')});
 var stage=h('div',{class:'thumb-stage','aria-hidden':'true'});
 stage.appendChild(makeThumb(f,v));card.appendChild(stage);
 var body=h('div',{class:'card-body'});
 var label=h('div',{class:'card-overline',text:(main?'FAMILY '+f.num:selectId(FAMILIES.indexOf(f),index))+' · '+(main?f.tag:v.tag)});
 var title=h('h3',{},esc(main?f.title:v.name));
 var summary=h('p',{text:main?f.sub:v.summary});
 var actions=h('div',{class:'card-actions'});
 var preview=h('button',{type:'button',class:'subtle-btn preview-btn','aria-label':'Open desktop and mobile preview of '+f.title+(main?'':' '+v.name),text:'Preview desktop + mobile'});
 preview.addEventListener('click',function(e){e.stopPropagation();openPreview(f,v,main,card);});
 actions.appendChild(preview);
 if(main){
  var explore=h('a',{class:'primary-btn',href:familyPath(f),text:'Explore 6 designs →'});
  actions.appendChild(explore);
 }else{
  var choose=h('button',{type:'button',class:'primary-btn',text:'Choose this design →'});
  choose.addEventListener('click',function(){openInquiry(f,v);});
  actions.appendChild(choose);
 }
 body.appendChild(label);body.appendChild(title);body.appendChild(summary);body.appendChild(actions);card.appendChild(body);
 // Visual hover previews are for devices with genuine hover, never on touch.
 card.addEventListener('pointerenter',function(e){if(e.pointerType==='mouse'&&matchMedia('(hover:hover) and (pointer:fine)').matches){clearTimeout(hoverTimer);hoverTimer=setTimeout(function(){openPreview(f,v,main,card);},750);}});
 card.addEventListener('pointerleave',function(){clearTimeout(hoverTimer);});
 return card;
}
function addHeader(){
 var hdr=h('header',{class:'express-header'});
 var wrap=h('div',{class:'header-inner'});
 var brand=h('a',{class:'express-logo',href:ROOT});
 var logo=h('img',{src:'/assets/owl-logo.png',alt:'',width:'42',height:'42'});
 brand.appendChild(logo);
 var name=h('span',{},'Delta Owl Eyes <small>BAKE EXPRESS <b>1.0</b></small>');brand.appendChild(name);
 wrap.appendChild(brand);
 var nav=h('nav',{'aria-label':'Design studio navigation',class:'nav-links'});
 nav.appendChild(h('a',{href:ROOT,text:'All design families'}));
 nav.appendChild(h('a',{href:'/services/',text:'Web services'}));
 nav.appendChild(h('a',{href:'/',text:'Delta Owl Eyes'}));
 wrap.appendChild(nav);hdr.appendChild(wrap);
 app.before(hdr);
}
function pageHeader(f){
 var section=h('section',{class:'page-hero '+(f?'detail-hero':'main-hero')});
 if(f){section.innerHTML='<div class="breadcrumb"><a href="'+ROOT+'">All six families</a><span aria-hidden="true"> / </span><span>'+esc(f.title)+'</span></div>'+
 '<p class="eyebrow">BAKE EXPRESS · FAMILY '+esc(f.num)+'</p><h1>'+esc(f.title)+' <em>— Six ways to make it yours.</em></h1>'+
 '<p class="lead">'+esc(f.sub)+'</p><div class="hero-metrics"><span>06 tailored layouts</span><span>Desktop + mobile preview</span><span>No obligation to inquire</span></div>';
 }else{section.innerHTML='<p class="eyebrow">WEBSITE DESIGN STUDIO · BAKE EXPRESS 1.0</p>'+
 '<h1>Six visions.<br><em>Endless possibility.</em></h1><p class="lead">Find the direction that feels right, then choose from six distinct enhancements. Explore each design in desktop and mobile before you ask us to build it for you.</p>'+
 '<div class="hero-metrics"><span><b>06</b> design families</span><span><b>36</b> enhancements</span><span><b>42</b> visual previews</span></div>';}
 return section;
}
function renderHome(){
 app.appendChild(pageHeader());
 var sub=h('section',{class:'section-heading'});
 sub.innerHTML='<div><p class="eyebrow">STEP 01 / PICK YOUR DIRECTION</p><h2>Choose a design family</h2><p>Six distinct starting points. Hover for a larger preview, or select a family to see its six enhanced layouts.</p></div>';
 app.appendChild(sub);
 var grid=h('div',{class:'design-grid home-grid'});
 FAMILIES.forEach(function(f){grid.appendChild(makeCard(f,VARIANTS[0],0,true));});
 app.appendChild(grid);
 var how=h('section',{class:'how-section'});
 how.innerHTML='<p class="eyebrow">HOW IT WORKS</p><h2>From inspiration to your own website</h2>'+
 '<ol class="steps"><li><b>01</b><strong>Choose a style</strong><span>Pick from six genuinely different design families.</span></li><li><b>02</b><strong>Compare six layouts</strong><span>Review desktop and mobile compositions for each family.</span></li><li><b>03</b><strong>Request a custom build</strong><span>Tell us what you need; we will confirm scope and a quote before any work begins.</span></li></ol>'+
 '<p class="fine-print">These are visual design concepts, not prebuilt client websites. Every commissioned website is scoped and customized for its owner. No payment is collected here.</p>';
 app.appendChild(how);
}
function renderFamily(f){
 document.title=f.title+' Enhancements | BAKE EXPRESS 1.0';
 app.appendChild(pageHeader(f));
 var section=h('section',{class:'section-heading'});
 section.innerHTML='<div><p class="eyebrow">STEP 02 / REFINE YOUR DIRECTION</p><h2>Six unique enhancements</h2><p>Preview each layout on both screen sizes. Choose one to prepare a project inquiry.</p></div>';
 app.appendChild(section);
 var grid=h('div',{class:'design-grid variation-grid'});
 VARIANTS.forEach(function(v,i){grid.appendChild(makeCard(f,v,i,false));});
 app.appendChild(grid);
 var back=h('div',{class:'backbar'},'<a href="'+ROOT+'">← Explore all six design families</a><p>Need help choosing? <a href="mailto:deltaowleyes@gmail.com?subject=BAKE%20EXPRESS%20design%20question">Ask a question</a>.</p>');
 app.appendChild(back);
}
function addFooter(){
 var foot=h('footer',{class:'express-footer'});
 foot.innerHTML='<div class="footer-inner"><div><strong>Delta Owl Eyes <span>· BAKE EXPRESS 1.0</span></strong><p>Thoughtfully designed. Custom built for your story.</p></div>'+
 '<div><a href="/services/">Services</a><a href="/privacy/">Privacy</a><a href="mailto:deltaowleyes@gmail.com">Contact</a></div></div>'+
 '<p class="footer-note">Visual concepts are illustrative. Images are assets already owned or published on Delta Owl Eyes. No third-party scripts, payments, or form-storage services are used by BAKE EXPRESS.</p>';
 app.after(foot);
}
function modalShell(){
 var dialog=h('dialog',{class:'express-modal',id:'preview-dialog','aria-label':'Design visual preview'});
 dialog.innerHTML='<div class="modal-header"><div><p class="eyebrow">DESKTOP + MOBILE DESIGN PREVIEW</p><h2 id="modal-title">Design preview</h2></div>'+
 '<button class="close-btn" type="button" id="close-preview" aria-label="Close preview">×</button></div>'+
 '<div class="modal-content"><div class="preview-container"><div class="preview-caption">DESKTOP / 1280 × 760</div><div class="preview-desktop" id="modal-desktop"></div></div>'+
 '<div class="preview-container preview-container-mobile"><div class="preview-caption">MOBILE / 390 × 844</div><div class="preview-mobile" id="modal-mobile"></div></div></div>'+
 '<div class="modal-actions"><p>Live HTML/CSS concept preview · illustrative content</p><div id="modal-buttons"></div></div>';
 document.body.appendChild(dialog);
 document.getElementById('close-preview').addEventListener('click',function(){dialog.close();});
 dialog.addEventListener('click',function(e){if(e.target===dialog)dialog.close();});
 var inquiry=h('dialog',{class:'express-modal inquiry-dialog',id:'inquiry-dialog','aria-labelledby':'inquiry-title'});
 inquiry.innerHTML='<div class="modal-header"><div><p class="eyebrow">STEP 03 / START A CONVERSATION</p><h2 id="inquiry-title">Request your custom website</h2></div><button type="button" class="close-btn" id="close-inquiry" aria-label="Close inquiry">×</button></div>'+
 '<div class="inquiry-inner"><p id="chosen-design" class="chosen-design"></p>'+
 '<p>Tell us about your project. This page opens a prefilled email in your mail app; it <strong>does not submit or store your details on a server</strong>.</p>'+
 '<form id="design-inquiry-form"><div class="form-row"><label>Your name <input name="name" maxlength="120" required autocomplete="name"></label><label>Email address <input name="email" type="email" maxlength="200" required autocomplete="email"></label></div>'+
 '<label>Business or project <input name="project" maxlength="150" required></label>'+
 '<label>What would you like us to build? <textarea name="details" rows="5" maxlength="2500" required placeholder="Tell us about the website, pages, features and your timeline."></textarea></label>'+
 '<div class="form-row"><label>Phone (optional) <input name="phone" autocomplete="tel" maxlength="40"></label><label>Budget range (optional) <select name="budget"><option value="">Not sure yet</option><option>Under C$500</option><option>C$500–C$1,000</option><option>C$1,000–C$2,500</option><option>Over C$2,500</option></select></label></div>'+
 '<div class="form-buttons"><button class="primary-btn" type="submit">Open email to send inquiry →</button><button class="subtle-btn" id="copy-inquiry" type="button">Copy inquiry details</button></div>'+
 '<div role="status" aria-live="polite" id="inquiry-status"></div></form></div>';
 document.body.appendChild(inquiry);
 document.getElementById('close-inquiry').addEventListener('click',function(){inquiry.close();});
 inquiry.addEventListener('click',function(e){if(e.target===inquiry)inquiry.close();});
 inquiry.querySelector('form').addEventListener('submit',function(e){
  e.preventDefault(); if(!this.reportValidity())return;
  var packet=getInquiryText();
  document.getElementById('inquiry-status').textContent='Your email app should open with the inquiry prefilled. Please press Send there; nothing has been sent by this page.';
  window.location.href='mailto:deltaowleyes@gmail.com?subject='+encodeURIComponent(packet.subject)+'&body='+encodeURIComponent(packet.body);
 });
 document.getElementById('copy-inquiry').addEventListener('click',function(){
  var form=document.getElementById('design-inquiry-form');if(!form.reportValidity())return;
  var p=getInquiryText();var status=document.getElementById('inquiry-status');
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(p.subject+'\n\n'+p.body).then(function(){status.textContent='Inquiry copied. Paste into an email to deltaowleyes@gmail.com.';}).catch(function(){status.textContent='Clipboard unavailable. Open your email app instead.';});}
  else status.textContent='Clipboard unavailable. Open your email app instead.';
 });
}
function getInquiryText(){
 var form=document.getElementById('design-inquiry-form'),data=new FormData(form);
 return {subject:'BAKE EXPRESS inquiry · '+selectId(FAMILIES.indexOf(selected.f),VARIANTS.indexOf(selected.v))+' · '+selected.f.title+' / '+selected.v.name,
 body:'Selected design: '+selected.f.title+' — '+selected.v.name+'\nDesign ID: '+selectId(FAMILIES.indexOf(selected.f),VARIANTS.indexOf(selected.v))+
 '\nReference: https://deltaowleyes.ca'+familyPath(selected.f)+'\n\nName: '+(data.get('name')||'')+
 '\nEmail: '+(data.get('email')||'')+'\nBusiness/project: '+(data.get('project')||'')+'\nPhone: '+(data.get('phone')||'')+
 '\nBudget: '+(data.get('budget')||'Not specified')+'\n\nProject details:\n'+(data.get('details')||'')+
 '\n\nPlease contact me to discuss scope and a quote. No paid work is authorized by this inquiry.'};
}
function openInquiry(f,v){
 selected={f:f,v:v};clearTimeout(hoverTimer);
 var pd=document.getElementById('preview-dialog');if(pd.open)pd.close();
 document.getElementById('chosen-design').textContent='Selected: '+f.title+' / '+v.name+' ('+selectId(FAMILIES.indexOf(f),VARIANTS.indexOf(v))+')';
 document.getElementById('inquiry-status').textContent='';
 document.getElementById('inquiry-dialog').showModal();
}
function attachModalFrame(holder,f,v,mobile){
 holder.replaceChildren();
 var iframe=h('iframe',{title:(mobile?'Mobile':'Desktop')+' live visual preview for '+f.title+' '+v.name,sandbox:'',tabindex:'-1'});
 iframe.srcdoc=frameDoc(f,v);
 holder.appendChild(iframe);
 var frameW=mobile?390:1280,frameH=mobile?844:760;
 var ro=new ResizeObserver(function(){
  if(!holder.isConnected)return;
  var w=holder.clientWidth;var scale=w/frameW;
  iframe.style.width=frameW+'px';iframe.style.height=frameH+'px';
  iframe.style.transform='scale('+scale+')';holder.style.height=(frameH*scale)+'px';
 });
 ro.observe(holder);
 holder._previewObserver=ro;
}
function openPreview(f,v,main,trigger){
 var dialog=document.getElementById('preview-dialog');
 if(dialog.open)return;
 selected={f:f,v:v};lastTrigger=trigger;
 clearTimeout(hoverTimer);
 document.getElementById('modal-title').textContent=f.title+' / '+v.name;
 attachModalFrame(document.getElementById('modal-desktop'),f,v,false);
 attachModalFrame(document.getElementById('modal-mobile'),f,v,true);
 var actions=document.getElementById('modal-buttons');actions.replaceChildren();
 if(main){actions.appendChild(h('a',{class:'primary-btn',href:familyPath(f),text:'Explore six enhancements →'}));}
 else{var pick=h('button',{type:'button',class:'primary-btn',text:'Choose '+selectId(FAMILIES.indexOf(f),VARIANTS.indexOf(v))+' →'});pick.addEventListener('click',function(){openInquiry(f,v);});actions.appendChild(pick);}
 dialog.showModal();
}
addHeader();
if(page==='home')renderHome();else{var f=bySlug(page);if(f)renderFamily(f);else app.appendChild(h('p',{text:'Design family not found.'}));}
addFooter();modalShell();
})();
