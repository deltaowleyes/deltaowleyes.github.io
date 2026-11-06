/* BAKE EXPRESS MASTER STANDARD 1.0
 * The markup, header art, six-screen gallery and preview modal are shared
 * identically across studios. Only window.BAKE_EXPRESS_STUDIO varies by client.
 */
(function(){
'use strict';
var c=window.BAKE_EXPRESS_STUDIO;
var app=document.getElementById('express-app');
if(!app||!c||!Array.isArray(c.designs)||c.designs.length!==6){if(app)app.textContent='The six-design studio configuration is unavailable.';return;}
var WIDTHS=[320,390,500,768,1024,1440];
var HEADER='/studio-sandbox/header-';
var lastFocus=null,activeDesign=null,activeWidth=390;
function escapeHtml(v){return String(v==null?'':v).replace(/[&<>"']/g,function(k){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[k];});}
function shot(d,w){return c.shotsBase+d.shotSlug+'-'+w+'.'+(c.imageExt||'jpg');}
function destination(d){return c.root+'previews/'+d.slug+'/';}
function header(){return '<header class="site-header" aria-label="BAKE EXPRESS Website Design Studio"><picture>'+
 '<source media="(max-width:354px)" srcset="'+HEADER+'320.webp">'+
 '<source media="(max-width:439px)" srcset="'+HEADER+'390.webp">'+
 '<source media="(max-width:629px)" srcset="'+HEADER+'500.webp">'+
 '<source media="(max-width:895px)" srcset="'+HEADER+'768.webp">'+
 '<source media="(max-width:1279px)" srcset="'+HEADER+'1024.webp">'+
 '<img src="'+HEADER+'1440.webp" width="1536" height="171" alt="Delta Owl Eyes Website Design Studio, 40 Exceptional Website Designs" fetchpriority="high" decoding="async">'+
 '</picture></header>';}
function footer(){return '<footer class="footer">Delta Owl Eyes · BAKE EXPRESS Website Design Studio · Six design directions · Screenshot-only review · <a href="/services/">Website services</a></footer>';}
function landing(){
 var cards=c.designs.map(function(d,i){
  return '<a class="family" href="'+destination(d)+'" aria-label="Explore '+escapeHtml(d.title)+' screenshots">'+
  '<div class="family-art"><img class="desktop" src="'+shot(d,1440)+'" alt="Desktop screenshot of '+escapeHtml(d.title)+'" loading="lazy" decoding="async">'+
  '<img class="mobile" src="'+shot(d,390)+'" alt="" aria-hidden="true" loading="lazy" decoding="async">'+
  '<span class="family-index">'+String(i+1).padStart(2,'0')+' / 06</span></div>'+
  '<div class="family-body"><span class="family-category">'+escapeHtml(d.category)+'</span><h2>'+escapeHtml(d.title)+'</h2>'+
  '<p>'+escapeHtml(d.description)+'</p><span class="family-action">View six screenshots ▶</span></div></a>';
 }).join('');
 app.innerHTML='<div class="shell">'+header()+'<main class="content" id="content">'+
 '<a class="back" href="/">← Delta Owl Eyes</a><p class="eyebrow">BAKE EXPRESS / WEBSITE DESIGN STUDIO</p>'+
 '<div class="studio-heading"><h1>'+escapeHtml(c.project)+'</h1><span class="studio-meta">SIX DESIGNS · SIX VIEWPORTS</span></div>'+
 '<p class="description">'+escapeHtml(c.subtitle)+' — choose a design to inspect six real full-page browser screenshots. The studio frame and header artwork are identical across every BAKE EXPRESS project.</p>'+
 '<section class="families" aria-label="Six website design directions">'+cards+'</section>'+
 '<p class="note">'+escapeHtml(c.disclosure)+'</p></main>'+footer()+'</div>';
}
function detail(d){
 var screenshots=WIDTHS.map(function(w){
  return '<article class="shot"><button type="button" data-width="'+w+'" aria-label="Enlarge complete '+escapeHtml(d.title)+' screenshot at '+w+' pixels">'+
   '<img src="'+shot(d,w)+'" alt="Full-page '+escapeHtml(d.title)+' browser screenshot captured at '+w+' pixel viewport" loading="lazy" decoding="async">'+
   '</button><div class="shot-title">'+w+'px viewport <span>Enlarge screenshot</span></div></article>';
 }).join('');
 app.innerHTML='<div class="shell">'+header()+'<main class="content" id="content"><a class="back" href="'+c.root+'">← Back to six design directions</a>'+
 '<p class="eyebrow">'+escapeHtml(c.project)+' / WEBSITE DESIGN STUDIO</p>'+
 '<h1>'+escapeHtml(d.title)+'</h1><p class="description"><strong>'+escapeHtml(d.category)+'</strong> · '+escapeHtml(d.description)+
 ' · Six full-page Chromium screenshots of a responsive design. These are images, not interactive website demos.</p>'+
 '<div class="actions"><a class="inquire" id="inquire" href="#">Ask about this design ↗</a></div>'+
 '<section class="screens" aria-label="Six viewport screenshots">'+screenshots+'</section>'+
 '<p class="note">'+escapeHtml(c.disclosure)+'</p></main>'+footer()+'</div>'+
 '<dialog id="enlarge" aria-label="Enlarged screenshot preview"><div class="dialogbar"><strong id="dialog-title">Screenshot</strong>'+
 '<button id="close-preview" type="button">Close ✕</button></div><div class="preview-navigation"><button id="previous" type="button" aria-label="Previous viewport">← Previous</button>'+
 '<span id="viewport-label">390px</span><button id="next" type="button" aria-label="Next viewport">Next →</button></div>'+
 '<img id="bigshot" alt="Enlarged full-page design screenshot"></dialog>';
 var subject=c.project+' EXPRESS inquiry — '+d.id+' — '+d.title;
 var body='I would like to discuss design '+d.id+' ('+d.title+') for '+c.project+'. Please contact me about the next steps.';
 document.getElementById('inquire').href='mailto:'+encodeURIComponent(c.inquiryEmail)+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
 var modal=document.getElementById('enlarge'),bigshot=document.getElementById('bigshot');
 function display(w){
  activeWidth=w;
  var src=shot(d,w);
  bigshot.src=src;
  bigshot.alt='Full-page '+d.title+' browser screenshot captured at '+w+' CSS pixels';
  bigshot.style.width=w+'px';
  document.getElementById('dialog-title').textContent=d.title+' — '+w+'px';
  document.getElementById('viewport-label').textContent=w+'px viewport';
  modal.scrollTop=0;
 }
 function shift(dir){display(WIDTHS[(WIDTHS.indexOf(activeWidth)+dir+WIDTHS.length)%WIDTHS.length]);}
 app.querySelectorAll('.shot button').forEach(function(button){
  button.addEventListener('click',function(){lastFocus=button;activeDesign=d;display(Number(button.dataset.width));modal.showModal();});
 });
 document.getElementById('close-preview').addEventListener('click',function(){modal.close();});
 document.getElementById('previous').addEventListener('click',function(){shift(-1);});
 document.getElementById('next').addEventListener('click',function(){shift(1);});
 modal.addEventListener('close',function(){bigshot.removeAttribute('src');if(lastFocus)lastFocus.focus();});
 modal.addEventListener('click',function(e){if(e.target===modal)modal.close();});
 modal.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){e.preventDefault();shift(1);}if(e.key==='ArrowLeft'){e.preventDefault();shift(-1);}});
}
var slug=document.documentElement.getAttribute('data-express-design');
var d=c.designs.find(function(d){return d.slug===slug;});
document.title=(d?d.title+' — ':c.project+' — ')+'BAKE EXPRESS Design Studio';
if(slug&&!d){app.textContent='This website design was not found.';return;}
if(d)detail(d);else landing();
})();
