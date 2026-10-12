/* day-close.js — Day Close and the optional count-by-note dialog
   Plain browser JavaScript, no build step. Files share globals and load in the order listed in index.html. */
/* ---------- day close ---------- */
function vClose(){
  var isClosed=closed(TODAY),h='';
  h+='<div class="o_control_panel" style="grid-template-columns:1fr auto"><div class="o_cp_left"><div class="o_breadcrumb"><span class="o_bc_parent">Day Close</span><span class="o_bc_sep">/</span><span>08/10/2026</span></div></div><div class="o_cp_right">Previous close: '+d('2026-10-07')+'</div></div>';
  var nd=0;S.boxes.forEach(function(b){nd+=drafts(b.code,TODAY).length;});
  var rows=S.boxes.map(function(b){
    var op=balance(b.code,TODAY),t=dayTotals(b.code,TODAY),exp=r2(op+t[0]-t[1]);
    if(isClosed){var c=S.closes[TODAY].rows[b.code];return {b:b,op:op,t:t,exp:c.exp,cnt:c.cnt,diff:c.diff,reason:c.reason};}
    var st=S.dc[b.code]||(S.dc[b.code]={text:'',reason:''});
    var cnt=st.text===''?null:r2(parseFloat(st.text.replace(/[^0-9.]/g,''))||0);
    return {b:b,op:op,t:t,exp:exp,cnt:cnt,diff:cnt==null?null:r2(cnt-exp),reason:st.reason};
  });
  var missing=rows.filter(function(r){return r.cnt==null;}).length,noReason=rows.filter(function(r){return r.diff&&!r.reason.trim();}).length;
  var why=nd?'Post or cancel '+nd+' draft voucher'+(nd>1?'s':'')+' first':missing?'Enter counted cash for every box':noReason?'Enter a reason for each difference':'';
  h+='<div class="o_form_view"><div class="o_form_statusbar"><div class="o_statusbar_buttons">'+
   (isClosed?'<button class="btn btn-secondary" data-act="print">Print Day Close</button><button class="btn btn-secondary" data-act="reopen">Reopen Day</button>':'<button class="btn btn-primary" data-act="closeday"'+(why?' disabled':'')+'>Close Day</button>'+(why?'<span class="text-muted" style="font-size:13px;align-self:center">'+why+'</span>':''))+
   '</div><div class="o_statusbar_status"><button class="o_arrow_button'+(isClosed?'':' o_arrow_button_current')+'">Open</button><button class="o_arrow_button'+(isClosed?' o_arrow_button_current':'')+'">Closed</button></div></div>';
  h+='<div class="o_form_sheet_bg"><div class="o_form_sheet" style="max-width:1220px"><div class="oe_title"><div class="o_field_label_top">Day Close</div><h1>08 Oct 2026</h1></div>';
  if(isClosed)h+='<div class="alert alert-success" style="margin-bottom:16px">Day closed by '+esc(S.closes[TODAY].by)+'. Vouchers dated 08/10/2026 are locked. Differences were posted to '+acc(S.cfg.diffLoss).code+' '+acc(S.cfg.diffLoss).name+' / '+acc(S.cfg.diffGain).code+' '+acc(S.cfg.diffGain).name+'.</div>';
  else if(nd)h+='<div class="alert alert-warning" style="margin-bottom:16px"><span><b>'+nd+' draft voucher'+(nd>1?'s':'')+'</b> dated on or before today are not in the expected balance. <a class="o_link" data-act="postdrafts">Post all drafts</a> or open them from the Cash Book.</span></div>';
  else h+='<div class="alert alert-info" style="margin-bottom:16px">Enter the cash you counted in each box. Counting by note and coin is optional.</div>';
  h+='<table class="o_list_table dc_table"><thead><tr><th>Cash Box</th><th class="o_list_number">Opening</th><th class="o_list_number">Receipts</th><th class="o_list_number">Payments</th><th class="o_list_number">Expected</th><th class="o_list_number">Counted Cash</th><th class="o_list_number">Difference</th><th>Reason</th></tr></thead><tbody>';
  rows.forEach(function(r){var b=r.b,cur=b.cur;
    var diffH=r.diff==null?'<span class="text-muted">—</span>':'<span class="dc_diff '+(r.diff==0?'dc_ok':r.diff<0?'dc_bad':'dc_over')+'">'+(r.diff>0?'+ ':r.diff<0?'− ':'')+m(Math.abs(r.diff),cur)+'</span><br>'+(r.diff==0?'<span class="badge text-bg-success">Balanced</span>':r.diff<0?'<span class="badge text-bg-danger">Short</span>':'<span class="badge text-bg-warning">Excess</span>');
    h+='<tr><td><b>'+b.name+'</b><div class="hint">'+cur+'</div></td><td class="o_list_number">'+m(r.op,cur)+'</td><td class="o_list_number o_receipt">'+m(r.t[0],cur)+'</td><td class="o_list_number o_payment">'+m(r.t[1],cur)+'</td><td class="o_list_number"><b>'+m(r.exp,cur)+'</b></td>';
    if(isClosed)h+='<td class="o_list_number">'+m(r.cnt,cur)+'</td><td class="o_list_number">'+diffH+'</td><td>'+esc(r.reason||'—')+'</td></tr>';
    else h+='<td class="o_list_number"><div class="cur_row" style="justify-content:flex-end"><span>'+cur+'</span><input id="cnt_'+b.code+'" inputmode="decimal" class="o_field_widget" data-dc="'+b.code+'" value="'+esc(S.dc[b.code].text)+'" placeholder="0.00"></div><a class="o_link" style="font-size:12px" data-act="den" data-box="'+b.code+'">Count by note (optional)</a></td><td class="o_list_number">'+diffH+'</td><td>'+(r.diff?'<input id="rs_'+b.code+'" class="o_field_widget'+(r.reason.trim()?'':' o_required_modifier')+'" style="'+(r.reason.trim()?'':'border-bottom-color:var(--danger)')+'" data-dcr="'+b.code+'" value="'+esc(r.reason)+'" placeholder="Required">':'<span class="text-muted">—</span>')+'</td></tr>';
  });
  h+='</tbody></table>';
  h+='<div class="o_horizontal_separator">Sign-off</div><div class="o_group"><div class="o_inner_group"><div class="o_cell_label">Counted By</div><div class="o_cell_value" style="padding-top:6px">Fatima Rahman</div><div class="o_cell_label">Verified By</div><div class="o_cell_value" style="padding-top:6px">Rohit Shah</div></div><div class="o_inner_group"><div class="o_cell_label">Next opening</div><div class="o_cell_value" style="padding-top:6px">Counted cash of each box, carried to 09/10/2026</div></div></div>';
  h+='</div></div></div>';
  return h;
}
function vModal(){
  var md=S.modal,b=box(md.box),cur=b.cur,tot=0;
  var rows=DEN[cur].map(function(v,i){var q=md.q[i]||0;tot+=v*q;return '<tr><td>'+(cur=='USD'?'$ ':'AED ')+(v<1?v.toFixed(2):v)+'</td><td class="o_list_number"><input id="den_'+i+'" class="o_qty" data-den="'+i+'" value="'+(md.q[i]||'')+'" inputmode="numeric" placeholder="0"></td><td class="o_list_number">'+(q?m(r2(v*q),cur):'')+'</td></tr>';}).join('');
  return '<div class="modal_bg"><div class="modal"><header>Count by note – '+b.name+'<span data-act="closemodal">×</span></header><div class="body"><p class="hint" style="margin:0 0 8px">Optional. Enter only the notes and coins you want to count; the total fills Counted Cash.</p><table class="o_list_table"><thead><tr><th>Note / coin</th><th class="o_list_number">Quantity</th><th class="o_list_number">Amount</th></tr></thead><tbody>'+rows+'</tbody><tfoot><tr><td>Total</td><td></td><td class="o_list_number">'+m(r2(tot),cur)+'</td></tr></tfoot></table></div><footer><button class="btn btn-primary" data-act="applyden">Use this total</button><button class="btn btn-secondary" data-act="closemodal">Discard</button></footer></div></div>';
}

