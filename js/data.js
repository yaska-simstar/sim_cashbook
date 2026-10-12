/* data.js — constants, sample data (seed) and shared state S
   Plain browser JavaScript, no build step. Files share globals and load in the order listed in index.html. */
var TODAY='2026-10-08';
var DEN={AED:[1000,500,200,100,50,20,10,5,1,0.5,0.25],USD:[100,50,20,10,5,2,1,0.25,0.1,0.05,0.01]};
var S;
function seed(){
  S={view:'dashboard',box:'MBA',stateFilter:'all',q:'',form:null,back:'book',dc:{},modal:null,toast:null,
   boxes:[
    {code:'MBA',name:'Main Box – AED',cur:'AED',acc:'101510',opening:45000},
    {code:'MBU',name:'Main Box – USD',cur:'USD',acc:'101520',opening:10000}],
   // Settings › Cash Management (accounts picked from Odoo's Chart of Accounts)
   cfg:{opening:'999999',diffLoss:'642000',diffGain:'442000',receivable:'121000',sales:'400000'},
   // Mirrors account.account (Accounting › Configuration › Chart of Accounts). Sample codes; the real list is the company's chart.
   accounts:[
    ['101401','Bank','asset_cash','both'],
    ['101510','Cash – Main Box AED','asset_cash','system'],['101520','Cash – Main Box USD','asset_cash','system'],
    ['121000','Account Receivable','asset_receivable','receipt'],
    ['141000','Advance to Suppliers','asset_prepayments','payment'],['141100','Staff Advances','asset_current','payment'],
    ['211000','Account Payable','liability_payable','payment'],['251000','Customer Advances','liability_current','receipt'],
    ['999999','Undistributed Profits/Losses','equity_unaffected','system'],
    ['400000','Product Sales','income','receipt'],['442000','Cash Difference Gain','income_other','system'],['450000','Other Income','income_other','receipt'],
    ['600000','Expenses','expense','payment'],['610100','Courier & Freight','expense','payment'],['610200','Pantry & Refreshments','expense','payment'],
    ['610300','Travel & Conveyance','expense','payment'],['610400','Office Supplies','expense','payment'],['610500','Government Fees','expense','payment'],
    ['642000','Cash Difference Loss','expense','system']
   ].map(function(a){return {code:a[0],name:a[1],type:a[2],use:a[3]};}),
   partners:['Al Noor Jewellers','Gem Star Trading LLC','Shah Diamonds','Cash Customer','Aramex','DHL Express','DMCC Authority','Dubai Taxi Corporation','Pantry Plus Trading','Office Hub LLC','Ahmed Khan','Fatima Rahman','Emirates NBD'],
   vouchers:[],seq:{MBA:46,MBU:22},
   closes:{'2026-10-07':{by:'Fatima Rahman',verified:'Rohit Shah',rows:{}}}
  };
  var V=[
   ['MBA','AED/2026/10/0038','2026-10-07','receipt','Al Noor Jewellers','400000',6000,'Cash against memo M-2279','posted'],
   ['MBA','AED/2026/10/0039','2026-10-07','payment','Pantry Plus Trading','610200',2500,'Pantry & refreshments – October','posted'],
   ['MBA','AED/2026/10/0040','2026-10-08','receipt','Al Noor Jewellers','400000',36725,'Cash against memo M-2291','posted'],
   ['MBA','AED/2026/10/0041','2026-10-08','payment','Aramex','610100',1240,'Courier – parcel to Antwerp','posted'],
   ['MBA','AED/2026/10/0042','2026-10-08','payment','Ahmed Khan','141100',3000,'Salary advance – October','posted'],
   ['MBA','AED/2026/10/0043','2026-10-08','payment','DMCC Authority','610500',850,'Govt. fees – trade licence stamp','posted'],
   ['MBA','AED/2026/10/0044','2026-10-08','payment','Dubai Taxi Corporation','610300',145,'Conveyance – office to DMCC','draft'],
   ['MBA','AED/2026/10/0045','2026-10-08','receipt','Cash Customer','400000',9180,'Cash sale – melee parcel','draft'],
   ['MBU','USD/2026/10/0017','2026-10-07','receipt','Gem Star Trading LLC','400000',3000,'Cash against memo M-2275','posted'],
   ['MBU','USD/2026/10/0018','2026-10-07','payment','Office Hub LLC','610400',600,'Office supplies – printer & paper','posted'],
   ['MBU','USD/2026/10/0019','2026-10-08','receipt','Gem Star Trading LLC','400000',8500,'Cash against memo M-2287','posted'],
   ['MBU','USD/2026/10/0020','2026-10-08','payment','Shah Diamonds','141000',6000,'Advance for rough parcel','posted'],
   ['MBU','USD/2026/10/0021','2026-10-08','payment','DHL Express','610100',320,'Courier – Hong Kong','posted']
  ];
  S.vouchers=V.map(function(r,i){return {id:i+1,box:r[0],name:r[1],date:r[2],type:r[3],partner:r[4],acc:r[5],amt:r[6],narr:r[7],ref:'',state:r[8],log:[{who:'Fatima Rahman',when:r[2]==TODAY?'Today':'07/10/2026',what:r[8]=='posted'?'Voucher posted':'Voucher created'}]};});
  S.nextId=100;
  // Stones (product / lot records in Odoo). Which stones appear here will be filtered later.
  S.stones=[ // serial, shape, carat, color, clarity, cut, lab, certificate no, rap price (US$/ct)
   ['SS-10234','Round',1.02,'F','VS1','EX','GIA','2486311507',13000],['SS-10235','Oval',0.75,'G','VS2','VG','GIA','6481920334',6100],
   ['SS-10236','Emerald',1.50,'E','VVS2','EX','GIA','1479302211',20000],['SS-10237','Cushion',2.01,'H','SI1','VG','IGI','602158744',19500],
   ['SS-10238','Pear',0.90,'D','IF','EX','GIA','2201559870',11400],['SS-10239','Round',0.50,'G','VS1','EX','GIA','7390118265',4400],
   ['SS-10240','Princess',1.10,'F','VS2','VG','IGI','598833102',11000],['SS-10241','Round',3.05,'J','SI2','GD','GIA','3318842095',17000]
  ].map(function(r){return {id:r[0],shape:r[1],ct:r[2],color:r[3],clarity:r[4],cut:r[5],lab:r[6],certNo:r[7],cert:r[6]+' '+r[7],rap:r[8],status:'Available',customer:'',sale:''};});
  S.sales=[];S.saleSeq=10;S.sform=null;
  [['2026-10-07','Gem Star Trading LLC','USD',[['SS-10237',8500]],'sold'],
   ['2026-10-08','Al Noor Jewellers','AED',[['SS-10235',15000,5],['SS-10239',6300]],'sold'],
   ['2026-10-08','Shah Diamonds','USD',[['SS-10236',12000]],'draft']].forEach(function(r){
    var so={id:S.nextId++,name:nextSaleName(),date:r[0],partner:r[1],cur:r[2],lines:r[3].map(function(l){return {stone:l[0],price:l[1],disc:l[2]||0};}),state:r[4],payment:null,log:[{who:'Fatima Rahman',when:d(r[0]),what:'Sale order created'}]};
    if(so.state=='sold'){so.soldDate=r[0];so.lines.forEach(function(l){var st=stone(l.stone);st.status='Sold';st.customer=so.partner;st.sale=so.name;});so.log.push({who:'Fatima Rahman',when:d(r[0]),what:'Marked as Sold'});}
    S.sales.push(so);});
}
