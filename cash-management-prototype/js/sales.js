/* sales.js — Sales Orders, Stones, Sale Order form, Register Payment
   Plain browser JavaScript, no build step. Files share globals and load in the order listed in index.html. */
/* ---------- sales ---------- */
function vSales(){
  var tab=S.saleTab||'orders',f=S.saleFilter||'all';
  var h='<div class="o_control_panel"><div class="o_cp_left"><button class="btn btn-primary" data-act="snew">New</button><div class="o_breadcrumb"><span>'+(tab=='orders'?'Sales Orders':'Stones')+'</span></div></div>'+
   '<div class="chips"><span class="chip'+(tab=='orders'?' on':'')+'" data-act="stab" data-t="orders">Sales Orders</span><span class="chip'+(tab=='stones'?' on':'')+'" data-act="stab" data-t="stones">Stones</span></div>'+
   '<div class="o_cp_right">'+(tab=='orders'?'<div class="chips">'+[['all','All'],['draft','Quotations'],['sold','To Collect'],['paid','Paid'],['cancel','Cancelled']].map(function(c){return '<span class="chip'+(f==c[0]?' on':'')+'" data-act="sfilter" data-f="'+c[0]+'">'+c[1]+'</span>';}).join('')+'</div>':'')+'</div></div>';
  h+='<div class="summary"><div>To collect · AED<b class="o_receipt">'+m(toCollect('AED'),'AED')+'</b></div><div>To collect · USD<b class="o_receipt">'+m(toCollect('USD'),'USD')+'</b></div><div style="margin-left:auto">Sales here are recorded in Cash Management only. No Odoo invoice, journal entry or stock move is created.</div></div>';
  if(tab=='stones'){
    h+='<div class="o_list_renderer"><table class="o_list_table"><thead><tr><th>Stone</th><th>Shape</th><th class="o_list_number">Carat</th><th>Color</th><th>Clarity</th><th>Certificate</th><th>Status</th><th>Customer</th><th>Sale Order</th></tr></thead><tbody>'+
     S.stones.map(function(st){return '<tr><td><b>'+st.id+'</b></td><td>'+st.shape+'</td><td class="o_list_number">'+st.ct.toFixed(2)+'</td><td>'+st.color+'</td><td>'+st.clarity+'</td><td class="text-muted">'+st.cert+'</td><td>'+(st.status=='Sold'?'<span class="badge text-bg-success">Sold</span>':'<span class="badge text-bg-secondary">Available</span>')+'</td><td>'+(st.customer?'<span class="o_link">'+esc(st.customer)+'</span>':'<span class="text-muted">—</span>')+'</td><td>'+(st.sale?'<span class="o_link" data-act="sopen" data-name="'+st.sale+'">'+st.sale+'</span>':'')+'</td></tr>';}).join('')+
     '</tbody></table><div class="hint" style="padding:8px 16px">Status and Customer are the stone\'s own Odoo fields; Mark as Sold updates them. The filter for which stones appear here will be added later.</div></div>';
    return h;
  }
  var rows=S.sales.filter(function(so){return f=='all'||so.state==f;}).slice().reverse();
  h+='<div class="o_list_renderer"><table class="o_list_table"><thead><tr><th>Order</th><th>Date</th><th>Customer</th><th>Stones</th><th>Currency</th><th class="o_list_number">Total</th><th>Status</th><th>Payment</th></tr></thead><tbody>';
  if(!rows.length)h+='<tr><td colspan="8" class="empty">No sales orders here.</td></tr>';
  rows.forEach(function(so){h+='<tr class="clickable" data-act="sopen" data-id="'+so.id+'"><td><b>'+esc(so.name||'New')+'</b></td><td>'+d(so.date)+'</td><td><span class="o_link">'+esc(so.partner||'—')+'</span></td><td class="o_wrap">'+so.lines.map(function(l){return l.stone;}).join(', ')+'</td><td>'+so.cur+'</td><td class="o_list_number"><b>'+m(saleTotal(so),so.cur)+'</b></td><td><span class="badge '+SST[so.state][0]+'">'+SST[so.state][1]+'</span></td><td>'+(so.payment?'<span class="o_link">'+so.payment+'</span>':'<span class="text-muted">—</span>')+'</td></tr>';});
  h+='</tbody></table></div>';
  return h;
}
function newSale(){return {id:null,name:'',date:TODAY,partner:'',cur:'USD',lines:[{stone:'',price:0,disc:0}],state:'draft',payment:null,log:[]};}
function openSale(so){S.sform={data:JSON.parse(JSON.stringify(so)),err:null,dirty:false,ptext:{}};S.view='sform';render();}
function freeStones(so){var used={};S.sales.forEach(function(x){if(x.id!=so.id&&x.state=='draft')x.lines.forEach(function(l){used[l.stone]=1;});});so.lines.forEach(function(l){if(l.stone)used[l.stone]=1;});return S.stones.filter(function(st){return st.status=='Available'&&!used[st.id];});}
function vSaleForm(){
  var F=S.sform,so=F.data,ro=so.state!='draft',b=boxOf(so.cur),tot=saleTotal(so);
  var h='<div class="o_control_panel" style="grid-template-columns:1fr auto"><div class="o_cp_left"><button class="btn btn-secondary" data-act="snew">New</button><div class="o_breadcrumb"><span class="o_bc_parent" data-act="sback" style="cursor:pointer">Sales Orders</span><span class="o_bc_sep">/</span><span>'+esc(so.name||'New')+'</span></div>'+(F.dirty?'<span class="badge text-bg-warning">Unsaved changes</span>':'')+'</div><div class="o_cp_right"></div></div>';
  var btn=so.state=='draft'?'<button class="btn btn-primary" data-act="ssold">Mark as Sold</button><button class="btn btn-secondary" data-act="ssave">Save</button>'+(so.id?'<button class="btn btn-secondary" data-act="scancel">Cancel</button>':'<button class="btn btn-link" data-act="sback">Discard</button>')
    :so.state=='sold'?'<button class="btn btn-primary" data-act="spay">Register Payment</button><button class="btn btn-secondary" data-act="print">Print Sale Order</button><button class="btn btn-secondary" data-act="scancel">Cancel Sale</button>'
    :so.state=='paid'?'<button class="btn btn-secondary" data-act="print">Print Sale Order</button>':'<button class="btn btn-secondary" data-act="sdraft">Reset to Quotation</button>';
  h+='<div class="sale_wrap"><div class="o_form_view"><div class="o_form_statusbar"><div class="o_statusbar_buttons">'+btn+'</div><div class="o_statusbar_status">'+[['draft','Quotation'],['sold','Sold'],['paid','Paid']].map(function(x){return '<button class="o_arrow_button'+(so.state==x[0]?' o_arrow_button_current':'')+'">'+x[1]+'</button>';}).join('')+'</div></div>';
  h+='<div class="o_form_sheet_bg"><div class="o_form_sheet sale_sheet">'+(so.state=='cancel'?'<div class="o_ribbon"><span class="text-bg-danger">Cancelled</span></div>':so.state=='paid'?'<div class="o_ribbon"><span class="text-bg-success">Paid</span></div>':'');
  if(F.err)h+='<div class="alert alert-danger" style="margin-bottom:16px">'+esc(F.err)+'</div>';
  if(so.state=='sold')h+='<div class="alert alert-warning" style="margin-bottom:16px"><span>'+m(tot,so.cur)+' to collect from <b>'+esc(so.partner)+'</b>. Register Payment records the full amount as a cash receipt in '+b.name+'.</span></div>';
  if(so.state=='paid')h+='<div class="alert alert-success" style="margin-bottom:16px"><span>Paid in full by cash receipt <a class="o_link" data-act="openv" data-name="'+so.payment+'">'+so.payment+'</a> in '+b.name+'.</span></div>';
  h+='<div class="oe_title"><h1 class="sale_h1">'+(so.state=='draft'&&!so.id?'<span class="req">*</span>':'')+esc(so.name||'New')+'</h1></div>';
  var dis=ro?' disabled':'',rc=ro?' o_readonly':'';
  h+='<div class="o_group" style="margin-bottom:8px"><div class="o_inner_group">'+
   '<div class="o_cell_label">Customer'+(ro?'':'<span class="req">*</span>')+'</div><div class="o_cell_value o_required_modifier"><input id="s_partner" list="partners" class="o_field_widget o_many2one'+rc+'" data-sfield="partner" value="'+esc(so.partner)+'" placeholder="Type to find a customer..."'+dis+'></div>'+
   '</div><div class="o_inner_group">'+
   '<div class="o_cell_label">Currency'+(ro?'':'<span class="req">*</span>')+'</div><div class="o_cell_value"><select id="s_cur" class="o_field_widget o_many2one'+rc+'" data-sfield="cur"'+dis+'><option value="AED"'+(so.cur=='AED'?' selected':'')+'>AED</option><option value="USD"'+(so.cur=='USD'?' selected':'')+'>USD</option></select><div class="hint">Paid in full, in cash, into '+b.name+'</div></div>'+
   '</div></div>';
  var free=freeStones(so);
  h+='<div class="o_notebook"><div class="o_notebook_headers"><span class="'+(S.stab!='ledger'?'active':'')+'" data-act="snb" data-t="lines">Order Lines</span><span class="'+(S.stab=='ledger'?'active':'')+'" data-act="snb" data-t="ledger">Ledger</span></div><div class="o_notebook_content" style="overflow-x:auto">';
  if(S.stab!='ledger'){
    h+='<table class="o_list_table sale_lines"><thead><tr><th style="min-width:130px">Serial No</th><th>Product</th><th>Cut</th><th>Color</th><th>Clarity</th><th class="o_list_number">Carat</th><th class="o_list_number">Pieces</th><th>Lab</th><th>Certificate Number</th><th class="o_list_number">Rap Price</th><th class="o_list_number">Unit Price</th><th class="o_list_number">Disc.%</th><th class="o_list_number">Amount</th><th style="width:24px"></th></tr></thead><tbody>';
    so.lines.forEach(function(l,i){var st=l.stone?stone(l.stone):null;
      var opts=free.slice();if(st)opts.unshift(st);
      var amt=lineAmount(l);
      h+='<tr><td>'+(ro?'<b>'+(st?st.id:'—')+'</b>':'<select id="sl_st_'+i+'" class="o_field_widget o_many2one" data-sstone="'+i+'"><option value="">Select…</option>'+opts.map(function(x){return '<option value="'+x.id+'"'+(x.id==l.stone?' selected':'')+'>'+x.id+'</option>';}).join('')+'</select>')+'</td>'+
      (st?'<td>'+esc(productName(st))+'</td><td>'+st.cut+'</td><td>'+st.color+'</td><td>'+st.clarity+'</td><td class="o_list_number">'+st.ct.toFixed(2)+'</td><td class="o_list_number">1</td><td>'+st.lab+'</td><td>'+st.certNo+'</td><td class="o_list_number text-muted">'+nf.format(st.rap)+'</td>':'<td colspan="9" class="text-muted">Pick a serial number to fill in the stone details</td>')+
      '<td class="o_list_number">'+(ro?nf.format(+l.price||0):'<input id="sl_pr_'+i+'" inputmode="decimal" class="o_field_widget num_in" data-sprice="'+i+'" value="'+(F.ptext[i]!=null?esc(F.ptext[i]):(l.price?nf.format(l.price):''))+'" placeholder="0.00">')+'</td>'+
      '<td class="o_list_number">'+(ro?(+l.disc||0).toFixed(2):'<input id="sl_dc_'+i+'" inputmode="decimal" class="o_field_widget num_in" style="width:56px" data-sdisc="'+i+'" value="'+(F.ptext['d'+i]!=null?esc(F.ptext['d'+i]):(l.disc?l.disc:''))+'" placeholder="0.00">')+'</td>'+
      '<td class="o_list_number"><b>'+(st?m(amt,so.cur):'')+'</b></td>'+
      '<td>'+(ro?'':'<span class="o_cog" data-act="sdel" data-i="'+i+'" title="Remove">×</span>')+'</td></tr>';});
    if(!ro)h+='<tr><td colspan="14"><a class="o_link" data-act="sadd">Add a product</a></td></tr>';
    h+='</tbody></table>';
    var sub=r2(so.lines.reduce(function(t,l){return t+(l.stone?(+l.price||0):0);},0)),disc=r2(sub-tot);
    h+='<div class="sale_totals"><div><span>Untaxed Amount</span><span>'+m(sub,so.cur)+'</span></div>'+(disc?'<div><span>Discount</span><span>− '+m(disc,so.cur)+'</span></div>':'')+'<div class="grand"><span>Total</span><span>'+m(tot,so.cur)+'</span></div></div>';
    h+='<div class="hint" style="margin-top:4px">Rap Price is the stone\'s list price in US$ per carat, shown for reference. Unit Price is in '+so.cur+'.</div>';
    if(so.state=='draft')h+='<div class="alert alert-info" style="margin-top:16px"><span><b>Mark as Sold</b> sets each stone\'s Status to Sold and Customer to '+(so.partner?'<b>'+esc(so.partner)+'</b>':'the customer')+' in Odoo, and books '+m(tot,so.cur)+' as receivable in Cash Management. No Odoo invoice or stock move is created.</span></div>';
  } else {
    var L=[];var ra=acc(S.cfg.receivable),sa=acc(S.cfg.sales),ca=acc(b.acc);
    if(so.state=='sold'||so.state=='paid'){L.push([d(so.soldDate||so.date),'Sale',ra.code+' '+ra.name,tot,0]);L.push([d(so.soldDate||so.date),'Sale',sa.code+' '+sa.name,0,tot]);}
    if(so.state=='paid'){L.push([d(so.paidDate||TODAY),'Payment '+so.payment,ca.code+' '+ca.name,tot,0]);L.push([d(so.paidDate||TODAY),'Payment '+so.payment,ra.code+' '+ra.name,0,tot]);}
    h+=L.length?'<table class="o_list_table"><thead><tr><th>Date</th><th>Entry</th><th>Account</th><th class="o_list_number">Debit</th><th class="o_list_number">Credit</th></tr></thead><tbody>'+L.map(function(l){return '<tr><td>'+l[0]+'</td><td>'+esc(l[1])+'</td><td>'+esc(l[2])+'</td><td class="o_list_number">'+(l[3]?m(l[3],so.cur):'')+'</td><td class="o_list_number">'+(l[4]?m(l[4],so.cur):'')+'</td></tr>';}).join('')+'</tbody></table><div class="hint" style="margin-top:8px">Cash Management ledger only. Nothing is posted to Odoo Accounting.</div>':'<div class="hint" style="padding:12px 0">Nothing is booked until the order is marked as sold.</div>';
  }
  h+='</div></div></div></div></div>';
  h+='<aside class="o-mail-Chatter sale_chatter"><div class="o-mail-Chatter-topbar"><button class="btn btn-secondary btn-sm">Log note</button></div>'+(so.log.length?'':'<div class="hint" style="padding-top:12px">Changes will be logged here.</div>')+
   so.log.slice().reverse().map(function(l){return '<div class="o-mail-Message"><span class="o_avatar" style="background:var(--action)">FR</span><div><span class="o_author">'+esc(l.who)+'</span><span class="o_date">'+esc(l.when)+'</span><div class="o-mail-Tracking">'+l.what+'</div></div></div>';}).join('')+'</aside></div>';
  h+='<datalist id="partners">'+S.partners.map(function(p){return '<option value="'+esc(p)+'">';}).join('')+'</datalist>';
  return h;
}
function storeSale(so){if(!so.id){so.id=S.nextId++;so.name=nextSaleName();so.log.push({who:'Fatima Rahman',when:'Now',what:'Sale order created'});S.sales.push(so);}else{var i=S.sales.findIndex(function(x){return x.id==so.id;});S.sales[i]=so;}}
function saleCheck(so){
  if(!so.partner.trim())return 'Enter a customer.';
  var ls=so.lines.filter(function(l){return l.stone;});if(!ls.length)return 'Add at least one stone.';
  for(var i=0;i<ls.length;i++){if(!(+ls[i].price>0))return 'Enter a price for '+ls[i].stone+'.';if(stone(ls[i].stone).status!='Available')return ls[i].stone+' is already sold.';}
  if(so.date>TODAY)return 'The order date cannot be in the future.';
  return null;
}
function vPayModal(){
  var so=S.sform.data,b=boxOf(so.cur),err=S.modal.err;
  return '<div class="modal_bg"><div class="modal"><header>Register Payment<span data-act="closemodal">×</span></header><div class="body">'+(err?'<div class="alert alert-danger" style="margin-bottom:12px">'+esc(err)+'</div>':'')+
   '<div class="o_inner_group"><div class="o_cell_label">Customer</div><div class="o_cell_value" style="padding-top:6px">'+esc(so.partner)+'</div>'+
   '<div class="o_cell_label">Amount</div><div class="o_cell_value" style="padding-top:6px"><b>'+m(saleTotal(so),so.cur)+'</b><div class="hint">Full payment only</div></div>'+
   '<div class="o_cell_label">Cash Box</div><div class="o_cell_value" style="padding-top:6px">'+b.name+'</div>'+
   '<div class="o_cell_label">Payment Date</div><div class="o_cell_value" style="padding-top:6px">'+d(TODAY)+'</div>'+
   '<div class="o_cell_label">Memo</div><div class="o_cell_value" style="padding-top:6px">Payment for '+esc(so.name)+'</div></div>'+
   '<p class="hint" style="margin:12px 0 0">Creates a posted cash receipt in '+b.name+' against '+acc(S.cfg.receivable).code+' '+acc(S.cfg.receivable).name+'.</p></div><footer><button class="btn btn-primary" data-act="sconfirmpay">Create Payment</button><button class="btn btn-secondary" data-act="closemodal">Discard</button></footer></div></div>';
}
function saleAct(a,t){
  var F=S.sform;
  if(a=='snew'){S.stab='lines';S.sform={data:newSale(),err:null,dirty:false,ptext:{}};S.view='sform';render();return true;}
  if(a=='sopen'){var so1=t.dataset.id?S.sales.filter(function(x){return x.id==t.dataset.id;})[0]:S.sales.filter(function(x){return x.name==t.dataset.name;})[0];S.stab='lines';openSale(so1);return true;}
  if(a=='sback'){S.view='sales';render();return true;}
  if(a=='stab'){S.saleTab=t.dataset.t;render();return true;}
  if(a=='sfilter'){S.saleFilter=t.dataset.f;render();return true;}
  if(a=='opensales'){S.saleTab='orders';S.saleFilter=t.dataset.f;S.view='sales';render();return true;}
  if(a=='snb'){S.stab=t.dataset.t;render();return true;}
  if(a=='openv'){var vv=S.vouchers.filter(function(x){return x.name==t.dataset.name;})[0];if(vv)openForm(vv);return true;}
  if(!F||S.view!='sform')return false;
  var so=F.data;
  if(a=='sadd'){so.lines.push({stone:'',price:0,disc:0});F.dirty=true;render();return true;}
  if(a=='sdel'){so.lines.splice(+t.dataset.i,1);if(!so.lines.length)so.lines=[{stone:'',price:0,disc:0}];F.ptext={};F.dirty=true;render();return true;}
  if(a=='ssave'){if(!so.partner.trim()){F.err='Enter a customer.';render();return true;}F.err=null;so.lines=so.lines.filter(function(l){return l.stone;});if(!so.lines.length)so.lines=[{stone:'',price:0,disc:0}];storeSale(so);F.data=JSON.parse(JSON.stringify(so));F.dirty=false;F.ptext={};toast(so.name+' saved');render();return true;}
  if(a=='ssold'){var keep=so.lines;so.lines=so.lines.filter(function(l){return l.stone;});var err=saleCheck(so);if(err){so.lines=keep;F.err=err;render();return true;}
    F.err=null;storeSale(so);so.state='sold';so.soldDate=TODAY;
    so.lines.forEach(function(l){var st=stone(l.stone);st.status='Sold';st.customer=so.partner;st.sale=so.name;});
    so.log.push({who:'Fatima Rahman',when:'Now',what:'Marked as Sold. '+so.lines.map(function(l){return l.stone;}).join(', ')+' → Status <b>Sold</b>, Customer <b>'+esc(so.partner)+'</b>. Receivable '+m(saleTotal(so),so.cur)+'.'});
    storeSale(so);F.data=JSON.parse(JSON.stringify(so));F.dirty=false;F.ptext={};toast(so.name+' marked as sold');render();return true;}
  if(a=='scancel'){
    if(so.state=='sold'){so.lines.forEach(function(l){var st=stone(l.stone);st.status='Available';st.customer='';st.sale='';});so.log.push({who:'Fatima Rahman',when:'Now',what:'Sale cancelled. Stones back to <b>Available</b>, customer cleared, receivable removed.'});}
    else so.log.push({who:'Fatima Rahman',when:'Now',what:'Quotation cancelled'});
    so.state='cancel';storeSale(so);F.data=JSON.parse(JSON.stringify(so));toast(so.name+' cancelled');render();return true;}
  if(a=='sdraft'){so.state='draft';so.log.push({who:'Fatima Rahman',when:'Now',what:'Reset to Quotation'});storeSale(so);F.data=JSON.parse(JSON.stringify(so));render();return true;}
  if(a=='spay'){S.modal={kind:'pay',err:null};render();return true;}
  if(a=='sconfirmpay'){
    if(closed(TODAY)){S.modal.err='Today ('+d(TODAY)+') is closed. Reopen the day to record a payment.';render();return true;}
    var b=boxOf(so.cur),tot=saleTotal(so);
    var v={id:S.nextId++,box:b.code,name:nextName(b.code),date:TODAY,type:'receipt',partner:so.partner,acc:S.cfg.receivable,amt:tot,narr:'Payment for '+so.name,ref:so.name,state:'posted',saleId:so.id,log:[{who:'Fatima Rahman',when:'Now',what:'Posted from '+so.name+' (Register Payment)'}]};
    S.vouchers.push(v);so.state='paid';so.payment=v.name;so.paidDate=TODAY;so.log.push({who:'Fatima Rahman',when:'Now',what:'Payment '+v.name+' of '+m(tot,so.cur)+' received in '+b.name+'. Status <b>Paid</b>.'});
    storeSale(so);F.data=JSON.parse(JSON.stringify(so));S.modal=null;toast('Payment '+v.name+' posted');render();return true;}
  return false;
}

