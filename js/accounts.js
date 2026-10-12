/* accounts.js — Accounts screen: Odoo chart of accounts + Cash Management balances
   Plain browser JavaScript, no build step. Files share globals and load in the order listed in index.html. */
/* ---------- chart of accounts ---------- */
function vCoa(){
  var bal={};S.accounts.forEach(function(a){bal[a.code]={AED:0,USD:0};});
  S.boxes.forEach(function(b){bal[b.acc][b.cur]+=b.opening;bal[S.cfg.opening][b.cur]-=b.opening;});
  S.vouchers.forEach(function(v){if(!posted(v))return;var b=box(v.box),s=v.type=='receipt'?1:-1;bal[b.acc][b.cur]+=s*v.amt;bal[v.acc][b.cur]-=s*v.amt;});
  S.sales.forEach(function(so){if(so.state=='sold'||so.state=='paid'){var t=saleTotal(so);bal[S.cfg.receivable][so.cur]+=t;bal[S.cfg.sales][so.cur]-=t;}});
  function f(v,c){v=r2(v);if(!v)return '<span style="color:var(--gray-400)">'+(c=='USD'?'$ ':'AED ')+'0.00</span>';return (c=='USD'?'$ ':'AED ')+nf.format(Math.abs(v))+' <span class="hint" style="display:inline">'+(v>0?'Dr':'Cr')+'</span>';}
  var TYL={asset_cash:'Bank and Cash',asset_receivable:'Receivable',asset_current:'Current Assets',asset_prepayments:'Prepayments',liability_payable:'Payable',liability_current:'Current Liabilities',equity_unaffected:'Current Year Earnings',income:'Income',income_other:'Other Income',expense:'Expenses'};
  var USE={receipt:'Receipts',payment:'Payments',both:'Receipts & Payments',system:'Settings'};
  var tot={AED:[0,0],USD:[0,0]};Object.keys(bal).forEach(function(k){['AED','USD'].forEach(function(c){var v=r2(bal[k][c]);if(v>0)tot[c][0]+=v;else tot[c][1]-=v;});});
  function an(c){var x=acc(c);return '<span class="o_link">'+x.code+' '+esc(x.name)+'</span>';}
  var h='<div class="o_control_panel" style="grid-template-columns:1fr auto"><div class="o_cp_left"><div class="o_breadcrumb"><span>Accounts</span></div></div><div class="o_cp_right">'+['AED','USD'].map(function(c){return r2(tot[c][0])==r2(tot[c][1])?'<span class="badge text-bg-success">'+c+' ledger balanced</span>':'<span class="badge text-bg-danger">'+c+' out of balance</span>';}).join(' ')+'</div></div>';
  h+='<div class="dash_top"><div class="alert alert-info"><span>Accounts come from <b>Accounting › Configuration › Chart of Accounts</b> (<code>account.account</code>), so there is one list to maintain. Balances below are from Cash Management vouchers only; nothing is posted to Odoo Accounting.</span></div></div>';
  h+='<div class="o_form_sheet_bg" style="padding-bottom:0"><div class="o_form_sheet" style="max-width:none"><div class="o_horizontal_separator" style="margin-top:0">Settings</div><div class="o_group"><div class="o_inner_group">'+
    S.boxes.map(function(b){return '<div class="o_cell_label">'+b.name+'</div><div class="o_cell_value" style="padding-top:6px">'+an(b.acc)+'</div>';}).join('')+
    '</div><div class="o_inner_group"><div class="o_cell_label">Opening Balance Account</div><div class="o_cell_value" style="padding-top:6px">'+an(S.cfg.opening)+'</div><div class="o_cell_label">Cash Difference Loss</div><div class="o_cell_value" style="padding-top:6px">'+an(S.cfg.diffLoss)+'</div><div class="o_cell_label">Cash Difference Gain</div><div class="o_cell_value" style="padding-top:6px">'+an(S.cfg.diffGain)+'</div><div class="o_cell_label">Sales Receivable</div><div class="o_cell_value" style="padding-top:6px">'+an(S.cfg.receivable)+'</div><div class="o_cell_label">Sales Income</div><div class="o_cell_value" style="padding-top:6px">'+an(S.cfg.sales)+'</div></div></div>'+
    '<div class="hint" style="margin-top:8px">Receipt and Payment vouchers offer only accounts marked for them, by account type (income and receivables for receipts, expenses, advances and payables for payments).</div></div></div>';
  h+='<div class="o_list_renderer" style="margin-top:16px"><table class="o_list_table"><thead><tr><th>Code</th><th>Account Name</th><th>Type</th><th>Offered On</th><th class="o_list_number">Balance AED</th><th class="o_list_number">Balance USD</th></tr></thead><tbody>';
  S.accounts.slice().sort(function(a,b){return a.code<b.code?-1:1;}).forEach(function(a){h+='<tr><td><b>'+a.code+'</b></td><td>'+esc(a.name)+'</td><td><span class="badge text-bg-secondary">'+TYL[a.type]+'</span></td><td class="text-muted">'+USE[a.use]+'</td><td class="o_list_number">'+f(bal[a.code].AED,'AED')+'</td><td class="o_list_number">'+f(bal[a.code].USD,'USD')+'</td></tr>';});
  h+='</tbody><tfoot><tr><td colspan="4">Total debit = total credit</td><td class="o_list_number">AED '+nf.format(r2(tot.AED[0]))+' = '+nf.format(r2(tot.AED[1]))+'</td><td class="o_list_number">$ '+nf.format(r2(tot.USD[0]))+' = '+nf.format(r2(tot.USD[1]))+'</td></tr></tfoot></table></div>';
  return h;
}

