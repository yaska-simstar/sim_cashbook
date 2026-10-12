/* dashboard.js — Dashboard: one card per cash box
   Plain browser JavaScript, no build step. Files share globals and load in the order listed in index.html. */
/* ---------- dashboard ---------- */
function vDash(){
  var lc=lastClose(),open=!closed(TODAY);
  var h='<div class="o_control_panel" style="grid-template-columns:1fr auto"><div class="o_cp_left"><div class="o_breadcrumb"><span>Cash Boxes</span></div></div><div class="o_cp_right"></div></div>';
  h+='<div class="dash_top">'+(open?'<div class="alert alert-info"><span>Today (08/10/2026) is <b>open</b>. Last day closed: '+(lc?d(lc):'—')+'. <a class="o_link" data-nav="close">Go to Day Close</a></span></div>':'<div class="alert alert-success"><span>Today (08/10/2026) is <b>closed</b>. Vouchers dated today are locked.</span></div>')+'</div>';
  h+='<div class="o_kanban_renderer">'+S.boxes.map(function(b){
    var bal=balance(b.code),t=dayTotals(b.code,TODAY),dr=drafts(b.code);
    var ds=r2(dr.reduce(function(s,v){return s+v.amt;},0));
    return '<div class="o_kanban_record"><div class="o_kanban_card_header"><div><div class="o_kanban_card_title"><a class="o_link" style="color:var(--gray-900)" data-act="openbook" data-box="'+b.code+'">'+b.name+'</a><span class="cd_cur">'+b.cur+'</span></div><div class="o_kanban_card_sub">Cash box · '+b.code+'</div></div></div>'+
    '<div class="o_kanban_primary"><div class="o_kanban_primary_left"><button class="btn btn-primary" data-act="new" data-box="'+b.code+'" data-type="payment">New Payment</button><button class="btn btn-secondary" data-act="new" data-box="'+b.code+'" data-type="receipt">New Receipt</button><button class="btn btn-link" style="padding-left:0" data-act="openbook" data-box="'+b.code+'">Cash Book</button></div>'+
    '<div class="o_kanban_lines"><span class="text-muted">Balance</span><span class="o_kanban_kpi">'+m(bal,b.cur)+'</span>'+
    '<span class="text-muted">Today in</span><span class="o_num o_receipt">'+m(t[0],b.cur)+'</span>'+
    '<span class="text-muted">Today out</span><span class="o_num o_payment">'+m(t[1],b.cur)+'</span>'+
    (dr.length?'<a class="o_link" data-act="openbook" data-box="'+b.code+'" data-filter="draft">'+dr.length+' to post</a><span class="o_num">'+m(ds,b.cur)+'</span>':'<span class="text-muted">Drafts</span><span class="o_num text-muted">None</span>')+
    '<a class="o_link" data-act="opensales" data-f="sold">To collect (sales)</a><span class="o_num">'+m(toCollect(b.cur),b.cur)+'</span>'+
    '</div></div></div>';
  }).join('')+'</div>';
  return h;
}

