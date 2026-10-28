/* Delta Owl Eyes directory taxonomy. Source category remains unchanged. */
window.DOE_CATEGORIES=["Arts, Culture & Entertainment","Automotive & Transportation","Beauty, Health & Wellness","Construction & Skilled Trades","Education & Training","Food, Restaurants & Catering","Government & Community Services","Hospitality, Tourism & Recreation","Information Technology & Media","Manufacturing & Industrial","Natural Resources & Agriculture","Professional & Financial Services","Retail & Shopping","Property & Home Services","Other & Specialized Services"];
window.DOE_CLASSIFY=function(b){
const source=String(b.original_category||b.category||"").toLowerCase(), details=(String(b.name||"")+" "+String(b.description||"")).toLowerCase();
const match=(re)=>re.test(details);
if(/spa|salon|hair|beauty|wellness|massage|clinic|health|therapy|counsell|fitness|yoga/.test(details))return "Beauty, Health & Wellness";
if(/restaurant|cafe|café|catering|bakery|food truck|snack shack|coffee shop|diner/.test(details))return "Food, Restaurants & Catering";
if(/hotel|motel|rv park|campground|lodging|resort|tour guide|tourism|accommodation|bed and breakfast/.test(details))return "Hospitality, Tourism & Recreation";
if(/roof|plumb|electrician|contractor|construction|concrete|renovation|excavation|paving|carpentry/.test(details))return "Construction & Skilled Trades";
if(/cleaning|janitorial|landscap|property management|real estate|realtor|lawn care/.test(details))return "Property & Home Services";
if(/web design|software|digital marketing|graphic design|photograph|videograph|media production|information technology|computer repair/.test(details))return "Information Technology & Media";
if(/law firm|lawyer|accounting|bookkeep|insurance|financial advisor|consulting|architect/.test(details))return "Professional & Financial Services";
if(/art gallery|artist|handmade|jewelry|jewellery|craft|musician|entertainment/.test(details))return "Arts, Culture & Entertainment";
if(/mechanic|auto repair|car dealership|trucking|transport|freight|logistics|taxi|driving school/.test(details))return "Automotive & Transportation";
if(/school|training|tutor|education|workshop|learning/.test(details))return "Education & Training";
if(/farm|forestry|fishing|agriculture|environmental|mining|oil and gas|renewable energy/.test(details))return "Natural Resources & Agriculture";
if(/manufactur|fabricat|industrial|wholesale|machining/.test(details))return "Manufacturing & Industrial";
if(/first nation government|band office|nonprofit|non-profit|community organization|social service/.test(details))return "Government & Community Services";
if(/store|shop|retail|boutique|market|grocery|convenience|fuel station|gas station/.test(details))return "Retail & Shopping";
const code=source.match(/(?:^|\D)(11|21|22|23|31|32|33|41|44|45|48|49|51|52|53|54|55|56|61|62|71|72|81|91)(?:\D|$)/)?.[1];
const map={"11":10,"21":10,"22":10,"23":3,"31":9,"32":9,"33":9,"41":12,"44":12,"45":12,"48":1,"49":1,"51":8,"52":11,"53":13,"54":11,"55":11,"56":14,"61":4,"62":2,"71":0,"72":7,"81":14,"91":6};
if(code&&map[code]!==undefined)return window.DOE_CATEGORIES[map[code]];
return "Other & Specialized Services";
};
window.DOE_ENRICH=function(b){return {...b,original_category:b.original_category||b.category||"",directory_category:window.DOE_CLASSIFY(b),verification_status:b.owner_confirmed===true?"verified":"unverified"};};
