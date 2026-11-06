(() => {
"use strict";
const themeId = document.body.dataset.theme || "cathedral-sunrise";
const themes = {
  "cathedral-sunrise": {name:"Cathedral Sunrise", number:"01", eyebrow:"A quiet place to begin again", headline:"A beautiful journey begins with a little faith.", text:"Devotion, gentle movement, handmade prayer and a daily invitation to grace.", image:"cathedral"},
  "marian-rose-garden": {name:"Marian Rose Garden", number:"02", eyebrow:"In prayer, we bloom", headline:"Find room for grace to grow.", text:"A gentle Catholic lifestyle journal where traditions meet ordinary, beautiful moments.", image:"rose"},
  "woodland-pilgrimage": {name:"Woodland Pilgrimage", number:"03", eyebrow:"A road worth walking", headline:"The path is part of the prayer.", text:"Follow the trail toward a life shaped by reflection, movement and purpose.", image:"woodland"},
  "rosary-atelier": {name:"Rosary Atelier", number:"04", eyebrow:"Objects made with intention", headline:"Small beads. Beautiful meaning.", text:"An artisan approach to Catholic life, inspired by the care behind a handmade rosary.", image:"rosary"},
  "catholic-journal": {name:"Catholic Life Journal", number:"05", eyebrow:"Vol. 01 / A life in faith", headline:"A faith worth thinking about. A life worth living.", text:"A modern journal of devotion, everyday culture and the questions that bring us together.", image:"journal"},
  "coffee-grace": {name:"Coffee & Grace", number:"06", eyebrow:"Good morning, beautiful soul", headline:"Make space for a little grace.", text:"Coffee, prayer, movement and meaningful conversations around everyday Catholic life.", image:"coffee"}
};
const PAGES = [
  {slug:"home",name:"Home"},
  {slug:"faith",name:"Faith & Devotions"},
  {slug:"running",name:"Running with Faith"},
  {slug:"rosaries",name:"Handmade Rosaries"},
  {slug:"coffee",name:"Coffee & Community"},
  {slug:"about",name:"Meet Brandee"}
];
const CONTENT = {
  faith: {eyebrow:"Prayer · reflection · daily life",headline:"A little quiet can change a day.",intro:"A welcoming home for Catholic prayers, personal reflection, meaningful feast days and the traditions Brandee chooses to share.",image:"cathedral",cards:[
    ["Devotions for everyday life","A future collection of reflections and prayer practices, written and reviewed before publication."],
    ["Living the liturgical year","A space to explore celebrations, seasons and family traditions without inventing personal stories."],
    ["Questions, learning & wonder","An accessible journal of Catholic life, with sources and clearly identified personal perspectives."]]},
  running: {eyebrow:"Movement · nature · reflection",headline:"Every mile can have meaning.",intro:"A jogging and walking journal for the places where movement, wellbeing and reflection meet. Brandee's genuine experiences will be added with her permission.",image:"woodland",cards:[
    ["The running journal","Room for future jogging entries, photos and lessons from the trail."],
    ["Morning rituals","Inspiration for bringing intention to simple movement and restorative routines."],
    ["Walk, jog, reflect","A flexible space for readers at different paces, without medical or training claims."]]},
  rosaries: {eyebrow:"Handmade · meaningful · prayerful",headline:"A rosary is more than a beautiful object.",intro:"A future showcase of Brandee's handmade rosaries: materials, stories, care and the intention behind each piece. This prototype does not claim products are available for purchase.",image:"rosary",cards:[
    ["The making process","How Brandee selects beads, materials and finishes—details to be added when confirmed."],
    ["Rosary collections","A future gallery for real photographed pieces, with accurately verified availability."],
    ["Custom inquiries","An outline for future requests; no ordering or contact form is active in this demo."]]},
  coffee: {eyebrow:"Morning rituals · conversation · connection",headline:"Pull up a chair. There's room for you.",intro:"Coffee offers a warm way to bring readers together around honest conversations, reflection and the little rituals that make a day.",image:"coffee",cards:[
    ["Coffee & conversation","A future editorial series about favourite brews and meaningful conversations."],
    ["Community moments","A home for gatherings, reader stories and thoughtfully selected collaborations."],
    ["Partner with the project","Potential coffee sponsorships may be discussed after a real media kit and disclosure policy are approved. No sponsors are claimed."]]},
  about: {eyebrow:"A personal path through Catholic life",headline:"This is Brandee's story to tell.",intro:"Brandee's own words, approved photographs and reasons for starting Rosary Road will appear here when she is ready. No biography, achievements or cultural affiliation are assumed.",image:"rose",cards:[
    ["Why Rosary Road?","A future personal welcome describing the values and purpose behind the project."],
    ["Faith, movement & making","Space for the authentic connections between devotion, jogging and the craft of rosaries."],
    ["Contact & collaboration","Contact channels will only be published with Brandee's approval; this prototype collects no visitor information."]]}
};
const theme = themes[themeId] || themes["cathedral-sunrise"];
const asset = (key) => "../assets/" + key + ".svg";
const pageLink = (slug,label) => '<a href="#' + slug + '" data-route="' + slug + '">' + label + '</a>';
const imageTag = (key,alt,cls) => '<img class="' + (cls || "") + '" loading="eager" src="' + asset(key) + '" alt="' + alt + '">';
function nav(){return PAGES.map(p => pageLink(p.slug,p.name)).join("");}
function header(){
  return '<header class="site-header"><a class="brand" href="#home" aria-label="Brandee’s Rosary Road, Home"><span class="brand-mark" aria-hidden="true">✦</span><span class="brand-title">Brandee’s Rosary Road</span><span class="brand-tag">A Beautiful Journey Through Catholic Life.</span></a><nav class="site-nav" aria-label="Main navigation">' + nav() + '</nav></header>';
}
const artAlts = {cathedral:"Original illustration of a sunlit cathedral",rose:"Original illustration of roses framing a chapel",woodland:"Original illustration of a sunrise woodland trail",rosary:"Original illustration of rosary beads on linen",journal:"Original illustration of an open devotional journal",coffee:"Original illustration of morning coffee and a journal"};
function actionLink(text,slug,extra){
  return '<a class="button ' + (extra||"") + '" href="#' + slug + '">' + text + ' <span aria-hidden="true">↗</span></a>';
}
function commonSections(){
  return '<section class="section-intro"><p class="mini-heading">A ROAD WITH MANY MOMENTS</p><h2>Find a place to begin.</h2><p>Explore the subjects that will shape Brandee’s Rosary Road as her own articles and handmade collections grow.</p></section>' +
  '<section class="story-grid" aria-label="Explore the site">' +
  '<article class="story story-faith"><span class="story-index">01 / DEVOTION</span><h3>Faith & Devotions</h3><p>Prayer, tradition and wonder in everyday life.</p>' + actionLink("Explore reflections","faith") + '</article>' +
  '<article class="story story-run"><span class="story-index">02 / MOVEMENT</span><h3>Running with Faith</h3><p>Walking and jogging with purpose.</p>' + actionLink("Follow the journey","running") + '</article>' +
  '<article class="story story-rosary"><span class="story-index">03 / CRAFT</span><h3>Handmade Rosaries</h3><p>Thoughtful making, meaningful materials.</p>' + actionLink("View the studio","rosaries") + '</article>' +
  '<article class="story story-coffee"><span class="story-index">04 / COMMUNITY</span><h3>Coffee & Community</h3><p>Warm conversations and future partnerships.</p>' + actionLink("Join the conversation","coffee") + '</article></section>';
}
function homepage(){
  let hero = "";
  if(themeId === "cathedral-sunrise"){
    hero = '<section class="hero hero-cathedral"><div class="hero-picture">' + imageTag("cathedral",artAlts.cathedral) + '<p class="art-note">Original illustrated concept</p></div><div class="hero-words"><p class="overline">'+theme.eyebrow+'</p><h1>'+theme.headline+'</h1><p class="hero-lede">'+theme.text+'</p>'+actionLink("Begin the journey","faith")+'<div class="prayer-label">✦ &nbsp; Faith in each ordinary moment</div></div></section>';
  }else if(themeId === "marian-rose-garden"){
    hero = '<section class="hero hero-rose"><p class="overline">'+theme.eyebrow+'</p><h1>'+theme.headline+'</h1><div class="rose-scene"><div class="rose-caption">A moment for reflection</div>'+imageTag("rose",artAlts.rose)+'<div class="rose-caption rose-caption-right">A garden of grace</div></div><p class="hero-lede">'+theme.text+'</p>'+actionLink("Enter the journal","faith")+'</section>';
  }else if(themeId === "woodland-pilgrimage"){
    hero = '<section class="hero hero-woods"><div class="woods-art">'+imageTag("woodland",artAlts.woodland)+'</div><div class="woods-overlay"><p class="overline">'+theme.eyebrow+'</p><h1>'+theme.headline+'</h1><p class="hero-lede">'+theme.text+'</p>'+actionLink("Take the first step","running")+'</div><span class="trail-number">TRAIL NOTES / 01</span></section>';
  }else if(themeId === "rosary-atelier"){
    hero = '<section class="hero hero-atelier"><div class="atelier-copy"><p class="overline">'+theme.eyebrow+'</p><h1>'+theme.headline+'</h1><p class="hero-lede">'+theme.text+'</p>'+actionLink("Explore rosaries","rosaries")+'<p class="product-guard">Design concept · no products for sale</p></div><div class="atelier-image">'+imageTag("rosary",artAlts.rosary)+'<p class="material">A STUDY IN THE ART OF PRAYER</p></div></section>';
  }else if(themeId === "catholic-journal"){
    hero = '<section class="hero hero-journal"><p class="edition">THE ROSARY ROAD JOURNAL — ISSUE NO. 01</p><div class="journal-layout"><div><h1>'+theme.headline+'</h1><p class="hero-lede">'+theme.text+'</p>'+actionLink("Read the journal","faith")+'</div><figure>'+imageTag("journal",artAlts.journal)+'<figcaption>Illustrative journal artwork — draft concept</figcaption></figure></div><div class="journal-rule"><span>THINK</span><span>PRAY</span><span>MOVE</span><span>MAKE</span></div></section>';
  }else{
    hero = '<section class="hero hero-coffee"><div class="coffee-left"><p class="overline">'+theme.eyebrow+'</p><h1>'+theme.headline+'</h1><p class="hero-lede">'+theme.text+'</p>'+actionLink("Take a seat","coffee")+'<p class="coffee-hour">SLOW MORNINGS · MEANINGFUL DAYS</p></div><div class="coffee-image">'+imageTag("coffee",artAlts.coffee)+'</div></section><div class="daily-strip"><span>01 • A little prayer</span><span>02 • A little movement</span><span>03 • A warm conversation</span></div>';
  }
  return hero + commonSections();
}
function innerPage(page){
  const c = CONTENT[page];
  const cards = c.cards.map((x,i)=>'<article class="detail-card"><span class="card-num">0'+(i+1)+'</span><h2>'+x[0]+'</h2><p>'+x[1]+'</p></article>').join("");
  const note = page==="rosaries" ? "No catalogue inventory, prices or sales yet." : page==="coffee" ? "No sponsors or endorsements have been secured or claimed." : "Sample page layout. Brandee will approve all words and media before launch.";
  return '<section class="inner-hero"><div class="inner-copy"><p class="overline">'+c.eyebrow+'</p><h1>'+c.headline+'</h1><p class="hero-lede">'+c.intro+'</p><div class="breadcrumb"><a href="#home">Home</a><span aria-hidden="true">/</span><span>'+PAGES.find(p=>p.slug===page).name+'</span></div></div><div class="inner-image">'+imageTag(c.image,artAlts[c.image])+'</div></section><section class="detail-wrap"><p class="mini-heading">LOOKING AHEAD</p><div class="detail-grid">'+cards+'</div></section><section class="sample-note"><h2>The story will come from Brandee.</h2><p>'+note+'</p>'+actionLink("Return home","home")+'</section>';
}
function footer(){
  return '<footer class="site-footer"><div><strong>Brandee’s Rosary Road</strong><p>A Beautiful Journey Through Catholic Life.</p></div><div class="footer-links">' + pageLink("home","Home") + '<a href="../" class="studio-return">All six concepts</a></div><small>PRELAUNCH DESIGN DEMO · NOT A LIVE SHOP · NO SPONSORS CLAIMED · ART IS ILLUSTRATIVE</small></footer>';
}
function render(){
  const requested = decodeURIComponent((location.hash || "#home").slice(1)).toLowerCase();
  const page = PAGES.some(p=>p.slug===requested) ? requested : "home";
  document.getElementById("app").innerHTML = '<div class="site-shell">' + header() + '<main class="workspace" id="main" tabindex="-1">' + (page==="home"?homepage():innerPage(page)) + '</main>' + footer() + '</div>';
  document.querySelectorAll('[data-route]').forEach(a=>{if(a.dataset.route===page){a.setAttribute("aria-current","page");}else{a.removeAttribute("aria-current");}});
  document.title = (page==="home" ? theme.name : PAGES.find(p=>p.slug===page).name) + " | Brandee’s Rosary Road";
  if(location.hash)window.scrollTo({top:0,behavior:"instant"});
}
window.addEventListener("hashchange",render);
render();
})();