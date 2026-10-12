/* shell.js — navbar and render()
   Plain browser JavaScript, no build step. Files share globals and load in the order listed in index.html. */
/* ---------- shell ---------- */
function navbar(){
  var it=[['dashboard','Dashboard'],['book','Cash Book'],['sales','Sales'],['close','Day Close'],['coa','Accounts']];
  var cur=S.view=='form'?'book':S.view=='sform'?'sales':S.view;
  return '<nav class="o_main_navbar"><span class="o_navbar_apps">⋮⋮⋮</span><span class="o_menu_brand">Cash Management</span><div class="o_menu_sections">'+
   it.map(function(x){return '<span data-nav="'+x[0]+'" class="'+(cur==x[0]?'active':'')+'">'+x[1]+'</span>';}).join('')+
   '</div><div class="o_menu_systray"><span class="proto_note">Prototype · today is 08/10/2026</span><button class="btn btn-link btn-sm" data-act="reset" title="Restore the sample data">Reset data</button><span class="o_avatar">FR</span></div></nav>';
}
function render(){
  var h=navbar();
  h+='<div class="view">'+({dashboard:vDash,book:vBook,form:vForm,close:vClose,coa:vCoa,sales:vSales,sform:vSaleForm})[S.view]()+'</div>';
  if(S.modal)h+=S.modal.kind=='pay'?vPayModal():vModal();
  if(S.toast)h+='<div class="toast">'+esc(S.toast)+'</div>';
  var app=document.getElementById('app');
  var f=document.activeElement,fid=f&&f.id,pos=f&&f.selectionStart;
  app.innerHTML=h;
  if(fid){var e=document.getElementById(fid);if(e){e.focus();try{if(pos!=null)e.setSelectionRange(pos,pos);}catch(x){}}}
}

