/* cash-book.js — Cash Book list per cash box
   Plain browser JavaScript, no build step. Files share globals and load in the order listed in index.html. */
/* ---------- cash book ---------- */
function vBook(){
  var b=box(S.box);
  var rows=S.vouchers.filter(function(v){return v.box==b.code;}).sort(sortV);
  var vis=rows.filter(function(v){if(S.stateFilter!='all'&&v.state!=S.stateFilter)return false;if(S.q&&(v.name+v.partner+v.narr+v.ref).toLowerCase().indexOf(S.q.toLowerCase())<0)return false;return true;});
  var h='<div class="o_control_panel"><div class="o_cp_left"><button class="btn btn-primary" data-act="new" data-box="'+b.code+'" data-type="payment">New</button><div class="o_breadcrumb"><span>Cash Book</span></div></div>'+
   '<div class="o_searchview"><span style="color:var(--gray-500)">⌕</span><span class="o_facet"><span class="o_facet_icon">▾</span><span class="o_facet_values">'+b.name+'</span></span><input id="q" data-input="q" value="'+esc(S.q)+'" placeholder="Search voucher, contact, narration..."></div>'+
   '<div class="o_cp_right"><div class="chips">'+[['all','All'],['draft','Draft'],['posted','Posted'],['cancel','Cancelled']].map(function(c){return '<span class="chip'+(S.stateFilter==c[0]?' on':'')+'" data-act="filter" data-f="'+c[0]+'">'+c[1]+'</span>';}).join('')+'</div></div></div>';
  var tin=0,tout=0;rows.forEach(function(v){if(posted(v)){if(v.type=='receipt')tin+=v.amt;else tout+=v.amt;}});
  h+='<div class="summary"><div class="box_tabs">'+S.boxes.map(function(x){return '<button data-act="box" data-box="'+x.code+'" class="'+(x.code==b.code?'active':'')+'">'+x.name+'<small>'+(x.cur=='USD'?'US Dollar':'UAE Dirham')+'</small></button>';}).join('')+'</div>'+
   '<div>Opening<b>'+m(b.opening,b.cur)+'</b></div><div>Receipts<b class="o_receipt">'+m(tin,b.cur)+'</b></div><div>Payments<b class="o_payment">'+m(tout,b.cur)+'</b></div><div class="closing">Closing balance<b>'+m(balance(b.code),b.cur)+'</b></div>'+
   (drafts(b.code).length?'<div style="margin-left:auto"><span class="badge text-bg-warning">'+drafts(b.code).length+' drafts not in balance</span></div>':'')+'</div>';
  h+='<div class="o_list_renderer"><table class="o_list_table"><thead><tr><th>Voucher</th><th>Type</th><th>Contact</th><th>Narration</th><th>Account</th><th class="o_list_number">Receipt</th><th class="o_list_number">Payment</th><th class="o_list_number">Balance</th><th>Status</th></tr></thead><tbody>';
  if(!vis.length)h+='<tr><td colspan="9" class="empty">No cash vouchers match this search.</td></tr>';
  var run={},bb=b.opening;rows.forEach(function(v){if(posted(v))bb+=sgn(v);run[v.id]=r2(bb);});
  var dates=[];vis.forEach(function(v){if(dates.indexOf(v.date)<0)dates.push(v.date);});
  dates.forEach(function(dt){
    var g=vis.filter(function(v){return v.date==dt;}),t=dayTotals(b.code,dt),op=balance(b.code,dt);
    h+='<tr class="o_group_row"><td colspan="5">▾ '+dl(dt)+' <span class="text-muted" style="font-weight:400">('+g.length+')</span>'+(closed(dt)?'<span class="lock">· day closed</span>':'')+'</td><td class="o_list_number">'+(t[0]?m(t[0],b.cur):'')+'</td><td class="o_list_number">'+(t[1]?m(t[1],b.cur):'')+'</td><td class="o_list_number">'+m(r2(op+t[0]-t[1]),b.cur)+'</td><td></td></tr>';
    h+='<tr class="o_opening"><td colspan="7">Opening balance</td><td class="o_list_number">'+m(op,b.cur)+'</td><td></td></tr>';
    g.forEach(function(v){var a=acc(v.acc);
      h+='<tr class="clickable'+(v.state=='cancel'?' cb_cancel':'')+'" data-act="open" data-id="'+v.id+'"><td>'+esc(v.name||'Draft')+'</td><td><span class="badge text-bg-secondary">'+(v.type=='receipt'?'Receipt':'Payment')+'</span></td><td><span class="o_link">'+esc(v.partner)+'</span></td><td class="o_wrap">'+esc(v.narr)+'</td><td class="text-muted">'+(a?a.code+' '+esc(a.name):'')+'</td>'+
      '<td class="o_list_number o_receipt">'+(v.type=='receipt'?m(v.amt,b.cur):'')+'</td><td class="o_list_number o_payment">'+(v.type=='payment'?m(v.amt,b.cur):'')+'</td><td class="o_list_number'+(posted(v)?'':' muted')+'">'+(posted(v)?m(run[v.id],b.cur):v.state=='draft'?'not posted':'')+'</td><td>'+badge(v)+'</td></tr>';});
  });
  h+='</tbody></table></div>';
  return h;
}

