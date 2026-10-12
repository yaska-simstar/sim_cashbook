/* voucher.js — Cash voucher form: Receipt / Payment
   Plain browser JavaScript, no build step. Files share globals and load in the order listed in index.html. */
/* ---------- voucher form ---------- */
function newVoucher(code,type){return {id:null,box:code,name:'',date:TODAY,type:type||'payment',partner:'',acc:'',amt:0,narr:'',ref:'',state:'draft',log:[]};}
function vForm(){
  var f=S.form,v=f.data,b=box(v.box),locked=v.id&&closed(v.date)&&v.state!='draft',ro=v.state!='draft';
  var accs=S.accounts.filter(function(a){return a.use==v.type||a.use=='both';});
  var bal=balance(v.box),after=r2(bal+(posted(v)?0:(v.type=='receipt'?v.amt:-v.amt)));
  var h='<div class="o_control_panel" style="grid-template-columns:1fr auto"><div class="o_cp_left"><button class="btn btn-secondary" data-act="new" data-box="'+v.box+'" data-type="payment">New</button><div class="o_breadcrumb"><span class="o_bc_parent" data-act="back" style="cursor:pointer">Cash Book</span><span class="o_bc_sep">/</span><span>'+esc(v.name||'New')+'</span></div>'+(f.dirty?'<span class="badge text-bg-warning">Unsaved changes</span>':'')+'</div><div class="o_cp_right">'+b.name+'</div></div>';
  var btn='';
  if(v.state=='draft')btn='<button class="btn btn-primary" data-act="post">Post</button><button class="btn btn-secondary" data-act="save">Save Draft</button>'+(v.id?'<button class="btn btn-secondary" data-act="cancelv">Cancel</button>':'<button class="btn btn-link" data-act="back">Discard</button>');
  else if(v.state=='posted')btn='<button class="btn btn-secondary" data-act="print">Print Voucher</button>'+(!locked&&!v.reversedBy&&!v.reversalOf?'<button class="btn btn-secondary" data-act="reverse">Reverse</button>':'');
  else btn='<button class="btn btn-secondary" data-act="todraft">Reset to Draft</button>';
  h+='<div class="form_wrap"><div class="o_form_view"><div class="o_form_statusbar"><div class="o_statusbar_buttons">'+btn+'</div><div class="o_statusbar_status">'+['draft','posted'].map(function(s){return '<button class="o_arrow_button'+(v.state==s?' o_arrow_button_current':'')+'">'+ST[s][1]+'</button>';}).join('')+'</div></div>';
  h+='<div class="o_form_sheet_bg"><div class="o_form_sheet">'+(v.state=='cancel'?'<div class="o_ribbon"><span class="text-bg-danger">Cancelled</span></div>':'');
  if(f.err)h+='<div class="alert alert-danger" style="margin-bottom:16px">'+esc(f.err)+'</div>';
  if(locked)h+='<div class="alert alert-warning" style="margin-bottom:16px">The day '+d(v.date)+' is closed. This voucher is locked.</div>';
  if(v.reversalOf)h+='<div class="alert alert-info" style="margin-bottom:16px">Reversal of '+esc(v.reversalOf)+'.</div>';
  if(v.reversedBy)h+='<div class="alert alert-info" style="margin-bottom:16px">Reversed by '+esc(v.reversedBy)+'.</div>';
  h+='<div class="oe_title"><div class="o_field_label_top">'+(v.type=='receipt'?'Cash Receipt':'Cash Payment')+'</div><h1>'+esc(v.name||'New')+'</h1></div>';
  var dis=ro?' disabled':'';
  h+='<div class="o_group"><div class="o_inner_group">'+
   '<div class="o_cell_label">Voucher Type</div><div class="o_cell_value o_radio"><label><input type="radio" name="vt" data-field="type" value="receipt"'+(v.type=='receipt'?' checked':'')+dis+'> Receipt</label><label><input type="radio" name="vt" data-field="type" value="payment"'+(v.type=='payment'?' checked':'')+dis+'> Payment</label></div>'+
   '<div class="o_cell_label">Date</div><div class="o_cell_value"><input type="date" id="f_date" class="o_field_widget'+(ro?' o_readonly':'')+'" data-field="date" value="'+v.date+'" max="'+TODAY+'"'+dis+'></div>'+
   '<div class="o_cell_label">Cash Box</div><div class="o_cell_value"><select id="f_box" class="o_field_widget o_many2one'+(ro?' o_readonly':'')+'" data-field="box"'+dis+'>'+S.boxes.map(function(x){return '<option value="'+x.code+'"'+(x.code==v.box?' selected':'')+'>'+x.name+'</option>';}).join('')+'</select></div>'+
   '<div class="o_cell_label">'+(v.type=='receipt'?'Received From':'Paid To')+'</div><div class="o_cell_value o_required_modifier"><input id="f_partner" list="partners" class="o_field_widget o_many2one'+(ro?' o_readonly':'')+'" data-field="partner" value="'+esc(v.partner)+'" placeholder="Search a contact..."'+dis+'></div>'+
   '<div class="o_cell_label">Account</div><div class="o_cell_value o_required_modifier"><select id="f_acc" class="o_field_widget o_many2one'+(ro?' o_readonly':'')+'" data-field="acc"'+dis+'><option value="">Select an account</option>'+accs.map(function(a){return '<option value="'+a.code+'"'+(a.code==v.acc?' selected':'')+'>'+a.code+' '+esc(a.name)+'</option>';}).join('')+(v.acc&&!accs.some(function(a){return a.code==v.acc;})?'<option value="'+v.acc+'" selected>'+v.acc+' '+esc(acc(v.acc).name)+'</option>':'')+'</select></div>'+
   '</div><div class="o_inner_group">'+
   '<div class="o_cell_label">Amount</div><div class="o_cell_value"><div class="cur_row"><span>'+b.cur+'</span><input id="f_amt" inputmode="decimal" class="o_field_widget amt'+(ro?' o_readonly':'')+'" data-field="amt" value="'+(f.amtText!=null?esc(f.amtText):(v.amt?nf.format(v.amt):''))+'" placeholder="0.00"'+dis+'></div></div>'+
   '<div class="o_cell_label">Reference</div><div class="o_cell_value"><input id="f_ref" class="o_field_widget'+(ro?' o_readonly':'')+'" data-field="ref" value="'+esc(v.ref)+'" placeholder="Memo, bill or receipt no."'+dis+'></div>'+
   '<div class="o_cell_label">Box balance</div><div class="o_cell_value" style="padding-top:6px"><span class="o_num">'+m(bal,b.cur)+'</span>'+(v.state=='draft'?'<div class="hint">After posting: <b class="'+(after<0?'o_payment':'')+'">'+m(after,b.cur)+'</b></div>':'')+'</div>'+
   '</div></div>';
  h+='<div class="o_cell_label" style="margin-top:12px">Narration</div><textarea id="f_narr" class="o_field_widget'+(ro?' o_readonly':'')+'" data-field="narr" rows="2" style="resize:vertical"'+dis+'>'+esc(v.narr)+'</textarea>';
  var ca=cashAccName(b),oa=v.acc?v.acc+' '+acc(v.acc).name:'—',L=v.type=='receipt'?[[ca,v.amt,0],[oa,0,v.amt]]:[[oa,v.amt,0],[ca,0,v.amt]];
  h+='<div class="o_notebook"><div class="o_notebook_headers"><span class="active">Ledger Lines</span></div><div class="o_notebook_content"><table class="o_list_table"><thead><tr><th>Account</th><th>Contact</th><th class="o_list_number">Debit</th><th class="o_list_number">Credit</th></tr></thead><tbody>'+
   L.map(function(l){return '<tr><td>'+esc(l[0])+'</td><td>'+esc(v.partner||'—')+'</td><td class="o_list_number">'+(l[1]?m(l[1],b.cur):'')+'</td><td class="o_list_number">'+(l[2]?m(l[2],b.cur):'')+'</td></tr>';}).join('')+
   '</tbody></table><div class="hint" style="margin-top:8px">Recorded in the Cash Management ledger only. Nothing is posted to Odoo Accounting.</div></div></div>';
  h+='</div></div></div>';
  h+='<aside class="o-mail-Chatter"><div class="o-mail-Chatter-topbar"><button class="btn btn-secondary btn-sm">Log note</button></div>'+(v.log.length?'':'<div class="hint" style="padding-top:12px">Changes will be logged here.</div>')+
   v.log.slice().reverse().map(function(l){return '<div class="o-mail-Message"><span class="o_avatar" style="background:var(--action)">FR</span><div><span class="o_author">'+esc(l.who)+'</span><span class="o_date">'+esc(l.when)+'</span><div class="o-mail-Tracking">'+l.what+'</div></div></div>';}).join('')+'</aside></div>';
  h+='<datalist id="partners">'+S.partners.map(function(p){return '<option value="'+esc(p)+'">';}).join('')+'</datalist>';
  return h;
}
function validate(v,toPost){
  if(!v.partner.trim())return 'Enter a contact in '+(v.type=='receipt'?'Received From':'Paid To')+'.';
  if(!v.acc)return 'Select an account.';
  if(!(v.amt>0))return 'Enter an amount greater than zero.';
  if(v.date>TODAY)return 'The date cannot be in the future.';
  if(closed(v.date))return 'The day '+d(v.date)+' is closed. Choose an open date or reopen the day.';
  if(toPost&&v.type=='payment'&&balance(v.box)-v.amt<0)return 'Not enough cash in '+box(v.box).name+'. Balance is '+m(balance(v.box),box(v.box).cur)+'.';
  return null;
}
function nextName(code){S.seq[code]++;var p={MBA:'AED',MBU:'USD'}[code];var n=String(S.seq[code]);while(n.length<4)n='0'+n;return p+'/2026/10/'+n;}
function saveForm(toPost){
  var f=S.form,v=f.data;
  if(f.amtText!=null){v.amt=r2(parseFloat(f.amtText.replace(/[^0-9.]/g,''))||0);f.amtText=null;}
  var err=validate(v,toPost);if(err){f.err=err;render();return;}
  f.err=null;
  if(!v.id){v.id=S.nextId++;v.name=nextName(v.box);v.log.push({who:'Fatima Rahman',when:'Now',what:'Voucher created'});S.vouchers.push(v);}
  else{var i=S.vouchers.findIndex(function(x){return x.id==v.id;});S.vouchers[i]=v;}
  if(toPost){v.state='posted';v.log.push({who:'Fatima Rahman',when:'Now',what:'Status: Draft <span class="o_arrow">→</span> <b>Posted</b>'});toast(v.name+' posted');}
  else toast(v.name+' saved as draft');
  f.data=JSON.parse(JSON.stringify(v));f.dirty=false;render();
}
function openForm(v){S.form={data:JSON.parse(JSON.stringify(v)),dirty:false,err:null,amtText:null};S.view='form';render();}

