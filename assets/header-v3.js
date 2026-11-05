/* B4-037 accessible dropdown closure; uses native details for no-JS fallback. */
document.addEventListener('DOMContentLoaded',()=>{
 const header=document.querySelector('header.doe-header-v3');
 if(!header)return;
 const menus=[...header.querySelectorAll('details')];
 header.addEventListener('toggle',event=>{
  const target=event.target;
  if(!(target instanceof HTMLDetailsElement)||!target.open)return;
  menus.forEach(item=>{if(item!==target&&item.open)item.open=false});
 },true);
 document.addEventListener('pointerdown',event=>{
  if(header.contains(event.target))return;
  menus.forEach(item=>item.open=false);
 });
 document.addEventListener('keydown',event=>{
  if(event.key!=='Escape')return;
  const opened=menus.filter(item=>item.open);
  if(!opened.length)return;
  opened.forEach(item=>item.open=false);
  if(header.contains(document.activeElement)){
   const summary=opened[0].querySelector('summary');
   if(summary)summary.focus();
  }
 });
});
