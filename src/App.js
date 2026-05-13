import { useState, useMemo } from "react";

const CATEGORIES = [
  { id: "food", label: "Food & Dining", icon: "🍽️", color: "#FF6B6B" },
  { id: "transport", label: "Transport", icon: "🚗", color: "#4ECDC4" },
  { id: "shopping", label: "Shopping", icon: "🛍️", color: "#45B7D1" },
  { id: "health", label: "Health", icon: "💊", color: "#96CEB4" },
  { id: "entertainment", label: "Entertainment", icon: "🎬", color: "#FFEAA7" },
  { id: "utilities", label: "Utilities", icon: "⚡", color: "#DDA0DD" },
  { id: "education", label: "Education", icon: "📚", color: "#98D8C8" },
  { id: "other", label: "Other", icon: "📦", color: "#F0A500" },
];

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const fmt = n => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const initTx = [
  { id: 1, desc: "Grocery Store", amount: 85.50, category: "food", date: "2026-05-01" },
  { id: 2, desc: "Uber Ride", amount: 18.00, category: "transport", date: "2026-05-02" },
  { id: 3, desc: "Netflix", amount: 15.99, category: "entertainment", date: "2026-05-03" },
  { id: 4, desc: "Pharmacy", amount: 42.30, category: "health", date: "2026-05-03" },
  { id: 5, desc: "Online Course", amount: 29.00, category: "education", date: "2026-05-04" },
  { id: 6, desc: "Electric Bill", amount: 110.00, category: "utilities", date: "2026-05-04" },
  { id: 7, desc: "Coffee Shop", amount: 12.50, category: "food", date: "2026-05-05" },
  { id: 8, desc: "Clothes", amount: 67.00, category: "shopping", date: "2026-05-05" },
];

export default function App() {
  const [tx, setTx] = useState(initTx);
  const [view, setView] = useState("dashboard");
  const [form, setForm] = useState({ desc: "", amount: "", category: "food", date: new Date().toISOString().split("T")[0] });
  const [budget, setBudget] = useState(1500);
  const [editBudget, setEditBudget] = useState(false);
  const [tmpBudget, setTmpBudget] = useState(1500);
  const [filterCat, setFilterCat] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [notif, setNotif] = useState(null);

  const toast = (msg, type = "success") => { setNotif({ msg, type }); setTimeout(() => setNotif(null), 2800); };

  const total = useMemo(() => tx.reduce((s, t) => s + t.amount, 0), [tx]);
  const remaining = budget - total;
  const pct = Math.min((total / budget) * 100, 100);
  const budgetColor = pct >= 90 ? "#FF6B6B" : pct >= 70 ? "#F0A500" : "#4ECDC4";

  const catTotals = useMemo(() => {
    const m = {}; CATEGORIES.forEach(c => m[c.id] = 0);
    tx.forEach(t => { m[t.category] = (m[t.category] || 0) + t.amount; }); return m;
  }, [tx]);

  const topCat = useMemo(() => CATEGORIES.map(c => ({ ...c, total: catTotals[c.id] || 0 })).sort((a, b) => b.total - a.total), [catTotals]);

  const monthlyData = useMemo(() => {
    const m = {}; tx.forEach(t => { const mo = new Date(t.date).getMonth(); m[mo] = (m[mo] || 0) + t.amount; });
    return MONTHS.map((label, i) => ({ label, val: m[i] || 0 }));
  }, [tx]);
  const maxM = Math.max(...monthlyData.map(m => m.val), 1);

  const filtered = useMemo(() => {
    let list = [...tx];
    if (filterCat !== "all") list = list.filter(t => t.category === filterCat);
    if (search) list = list.filter(t => t.desc.toLowerCase().includes(search.toLowerCase()));
    if (sortBy === "date") list.sort((a, b) => new Date(b.date) - new Date(a.date));
    else if (sortBy === "amount") list.sort((a, b) => b.amount - a.amount);
    else list.sort((a, b) => a.desc.localeCompare(b.desc));
    return list;
  }, [tx, filterCat, search, sortBy]);

  const addTx = () => {
    if (!form.desc.trim() || !form.amount || isNaN(+form.amount) || +form.amount <= 0) { toast("Fill all fields correctly.", "error"); return; }
    setTx(p => [{ id: Date.now(), desc: form.desc.trim(), amount: parseFloat(form.amount), category: form.category, date: form.date }, ...p]);
    setForm({ desc: "", amount: "", category: "food", date: new Date().toISOString().split("T")[0] });
    toast("Transaction added!");
  };

  const delTx = id => { setTx(p => p.filter(t => t.id !== id)); toast("Deleted.", "info"); };
  const getCat = id => CATEGORIES.find(c => c.id === id) || CATEGORIES[7];

  const s = `
    @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
    @keyframes slideIn{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}
    .card{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:20px;backdrop-filter:blur(12px);animation:fadeUp .4s ease}
    .nb{background:none;border:none;cursor:pointer;padding:10px 18px;border-radius:12px;font-size:13px;font-weight:600;transition:all .2s}
    .nb.a{background:linear-gradient(135deg,#4ECDC4,#45B7D1);color:#0f0f1a}
    .nb:not(.a){color:rgba(232,234,246,.6)}.nb:not(.a):hover{background:rgba(255,255,255,.08);color:#e8eaf6}
    .inp{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);border-radius:12px;color:#e8eaf6;padding:12px 16px;font-size:14px;width:100%;box-sizing:border-box;outline:none;transition:border .2s}
    .inp:focus{border-color:#4ECDC4}.inp option{background:#1a1a2e}
    .pbtn{background:linear-gradient(135deg,#4ECDC4,#45B7D1);color:#0f0f1a;border:none;border-radius:12px;padding:13px 28px;font-size:15px;font-weight:700;cursor:pointer;transition:all .2s}
    .pbtn:hover{opacity:.9;transform:translateY(-1px)}
    .dbtn{background:none;border:none;color:#FF6B6B;cursor:pointer;font-size:16px;opacity:.5;transition:opacity .2s;padding:4px 8px;border-radius:8px}
    .dbtn:hover{opacity:1;background:rgba(255,107,107,.1)}
    .txrow:hover{background:rgba(255,255,255,.04);border-radius:12px}
    ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:rgba(255,255,255,.2);border-radius:4px}
  `;

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#0f0f1a 0%,#1a1a2e 50%,#16213e 100%)", fontFamily:"'Inter',-apple-system,sans-serif", color:"#e8eaf6" }}>
      <style>{s}</style>

      {notif && <div style={{ position:"fixed", top:20, right:20, zIndex:999, padding:"12px 20px", borderRadius:12, background:notif.type==="error"?"#FF6B6B":notif.type==="info"?"#45B7D1":"#4ECDC4", color:"#0f0f1a", fontWeight:700, fontSize:14, boxShadow:"0 8px 32px rgba(0,0,0,.4)", animation:"slideIn .3s ease" }}>
        {notif.type==="success"?"✅":notif.type==="error"?"❌":"ℹ️"} {notif.msg}
      </div>}

      <div style={{ background:"rgba(0,0,0,.3)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(255,255,255,.08)", padding:"0 16px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", height:60 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:32, height:32, borderRadius:9, background:"linear-gradient(135deg,#4ECDC4,#45B7D1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>💰</div>
            <div style={{ fontWeight:800, fontSize:16 }}>SpendTrack <span style={{ color:"#4ECDC4" }}>Pro</span></div>
          </div>
          <nav style={{ display:"flex", gap:2, background:"rgba(255,255,255,.05)", padding:3, borderRadius:12, border:"1px solid rgba(255,255,255,.08)" }}>
            {[["dashboard","📊"],["add","➕"],["transactions","📋"],["analytics","📈"]].map(([v,l]) => (
              <button key={v} className={`nb${view===v?" a":""}`} onClick={() => setView(v)} style={{ padding:"8px 12px", fontSize:16 }}>{l}</button>
            ))}
          </nav>
        </div>
      </div>

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"20px 16px" }}>

        {view==="dashboard" && <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            {[
              { label:"Total Spent", value:`$${fmt(total)}`, icon:"💸", color:"#FF6B6B", sub:`${tx.length} transactions` },
              { label:"Budget", value:`$${fmt(budget)}`, icon:"🎯", color:"#4ECDC4", sub:"Monthly limit", action:true },
              { label:"Remaining", value:`$${fmt(Math.abs(remaining))}`, icon:remaining>=0?"✅":"⚠️", color:remaining>=0?"#96CEB4":"#FF6B6B", sub:remaining>=0?"Available":"Over budget" },
              { label:"Daily Avg", value:`$${fmt(total/Math.max(new Date().getDate(),1))}`, icon:"📅", color:"#DDA0DD", sub:"This month" },
            ].map((k,i) => (
              <div key={i} className="card" style={{ padding:"16px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  <div>
                    <div style={{ fontSize:10, color:"rgba(232,234,246,.5)", fontWeight:600, textTransform:"uppercase" }}>{k.label}</div>
                    <div style={{ fontSize:20, fontWeight:800, color:k.color, marginTop:4 }}>{k.value}</div>
                    <div style={{ fontSize:11, color:"rgba(232,234,246,.4)", marginTop:2 }}>{k.sub}</div>
                  </div>
                  <div style={{ fontSize:22 }}>{k.icon}</div>
                </div>
                {k.action && <button onClick={() => { setTmpBudget(budget); setEditBudget(true); }} style={{ marginTop:8, fontSize:10, background:"rgba(78,205,196,.1)", border:"1px solid rgba(78,205,196,.3)", color:"#4ECDC4", borderRadius:6, padding:"3px 8px", cursor:"pointer" }}>Edit</button>}
              </div>
            ))}
          </div>

          {editBudget && <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.7)", zIndex:100, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
            <div className="card" style={{ padding:28, width:"100%", maxWidth:320, textAlign:"center" }}>
              <div style={{ fontSize:24 }}>🎯</div>
              <div style={{ fontWeight:700, fontSize:18, margin:"8px 0 16px" }}>Set Monthly Budget</div>
              <input className="inp" type="number" value={tmpBudget} onChange={e => setTmpBudget(e.target.value)} style={{ textAlign:"center", fontSize:20, fontWeight:700 }} />
              <div style={{ display:"flex", gap:10, marginTop:16 }}>
                <button onClick={() => setEditBudget(false)} style={{ flex:1, padding:12, borderRadius:12, background:"rgba(255,255,255,.08)", border:"1px solid rgba(255,255,255,.1)", color:"#e8eaf6", cursor:"pointer", fontWeight:600 }}>Cancel</button>
                <button className="pbtn" style={{ flex:1, padding:12, fontSize:14 }} onClick={() => { setBudget(parseFloat(tmpBudget)||budget); setEditBudget(false); toast("Budget updated!"); }}>Save</button>
              </div>
            </div>
          </div>}

          <div className="card" style={{ padding:"18px 20px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
              <div style={{ fontWeight:700, fontSize:14 }}>Budget Usage</div>
              <div style={{ fontWeight:700, color:budgetColor }}>{pct.toFixed(1)}%</div>
            </div>
            <div style={{ height:10, background:"rgba(255,255,255,.08)", borderRadius:5, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${pct}%`, background:`linear-gradient(90deg,${budgetColor}88,${budgetColor})`, borderRadius:5, transition:"width .8s ease" }} />
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:6, fontSize:11, color:"rgba(232,234,246,.5)" }}>
              <span>$0</span><span style={{ color:budgetColor }}>${fmt(total)} spent</span><span>${fmt(budget)}</span>
            </div>
          </div>

          <div className="card" style={{ padding:"18px 20px" }}>
            <div style={{ fontWeight:700, fontSize:14, marginBottom:14 }}>Category Breakdown</div>
            {topCat.filter(c=>c.total>0).map(c => (
              <div key={c.id} style={{ marginBottom:10 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4, fontSize:13 }}>
                  <span>{c.icon} {c.label}</span>
                  <span style={{ fontWeight:700, color:c.color }}>${fmt(c.total)}</span>
                </div>
                <div style={{ height:5, background:"rgba(255,255,255,.06)", borderRadius:3 }}>
                  <div style={{ height:"100%", width:`${(c.total/total)*100}%`, background:c.color, borderRadius:3 }} />
                </div>
              </div>
            ))}
          </div>
        </div>}

        {view==="add" && <div>
          <div className="card" style={{ padding:28 }}>
            <div style={{ textAlign:"center", marginBottom:24 }}>
              <div style={{ fontSize:36 }}>➕</div>
              <div style={{ fontWeight:800, fontSize:20, marginTop:8 }}>Add Transaction</div>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div>
                <label style={{ fontSize:11, fontWeight:600, color:"rgba(232,234,246,.5)", textTransform:"uppercase", display:"block", marginBottom:7 }}>Description</label>
                <input className="inp" placeholder="e.g. Morning coffee..." value={form.desc} onChange={e => setForm(f=>({...f,desc:e.target.value}))} />
              </div>
              <div>
                <label style={{ fontSize:11, fontWeight:600, color:"rgba(232,234,246,.5)", textTransform:"uppercase", display:"block", marginBottom:7 }}>Amount ($)</label>
                <input className="inp" type="number" placeholder="0.00" value={form.amount} onChange={e => setForm(f=>({...f,amount:e.target.value}))} style={{ fontSize:20, fontWeight:700 }} />
              </div>
              <div>
                <label style={{ fontSize:11, fontWeight:600, color:"rgba(232,234,246,.5)", textTransform:"uppercase", display:"block", marginBottom:7 }}>Category</label>
                <select className="inp" value={form.category} onChange={e => setForm(f=>({...f,category:e.target.value}))}>
                  {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize:11, fontWeight:600, color:"rgba(232,234,246,.5)", textTransform:"uppercase", display:"block", marginBottom:7 }}>Date</label>
                <input className="inp" type="date" value={form.date} onChange={e => setForm(f=>({...f,date:e.target.value}))} />
              </div>
              <button className="pbtn" style={{ width:"100%" }} onClick={addTx}>Add Transaction</button>
            </div>
          </div>
        </div>}

        {view==="transactions" && <div>
          <div className="card" style={{ padding:"16px", marginBottom:12 }}>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              <input className="inp" placeholder="🔍 Search..." value={search} onChange={e => setSearch(e.target.value)} />
              <div style={{ display:"flex", gap:10 }}>
                <select className="inp" value={filterCat} onChange={e => setFilterCat(e.target.value)}>
                  <option value="all">All Categories</option>
                  {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
                </select>
                <select className="inp" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                  <option value="date">Date</option>
                  <option value="amount">Amount</option>
                  <option value="name">Name</option>
                </select>
              </div>
            </div>
            <div style={{ marginTop:10, fontSize:12, color:"rgba(232,234,246,.4)" }}>
              {filtered.length} results • <span style={{ color:"#FF6B6B", fontWeight:700 }}>${fmt(filtered.reduce((s,t)=>s+t.amount,0))}</span>
            </div>
          </div>
          <div className="card" style={{ padding:"6px 12px" }}>
            {filtered.length===0
              ? <div style={{ textAlign:"center", padding:40, color:"rgba(232,234,246,.3)" }}><div style={{ fontSize:40 }}>📭</div><div style={{ marginTop:10 }}>No transactions</div></div>
              : filtered.map((t,i) => {
                const c = getCat(t.category);
                return <div key={t.id} className="txrow" style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 8px", borderBottom:i<filtered.length-1?"1px solid rgba(255,255,255,.05)":"none" }}>
                  <div style={{ width:38, height:38, borderRadius:11, background:`${c.color}20`, border:`1px solid ${c.color}40`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{c.icon}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:700, fontSize:14 }}>{t.desc}</div>
                    <div style={{ display:"flex", gap:6, marginTop:2 }}>
                      <span style={{ fontSize:11, fontWeight:600, padding:"1px 7px", borderRadius:6, background:`${c.color}20`, color:c.color }}>{c.label}</span>
                      <span style={{ fontSize:11, color:"rgba(232,234,246,.35)" }}>{t.date}</span>
                    </div>
                  </div>
                  <div style={{ fontWeight:800, fontSize:14, color:"#FF6B6B" }}>-${fmt(t.amount)}</div>
                  <button className="dbtn" onClick={() => delTx(t.id)}>🗑</button>
                </div>;
              })}
          </div>
        </div>}

        {view==="analytics" && <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div className="card" style={{ padding:"20px" }}>
            <div style={{ fontWeight:700, fontSize:14, marginBottom:16 }}>📊 Monthly Spending</div>
            <div style={{ display:"flex", alignItems:"flex-end", gap:4, height:140 }}>
              {monthlyData.map((m,i) => (
                <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
                  <div style={{ width:"100%", height:118, display:"flex", alignItems:"flex-end" }}>
                    <div style={{ width:"100%", height:`${(m.val/maxM)*100}%`, background:i===4?"linear-gradient(180deg,#4ECDC4,#45B7D1)":"rgba(255,255,255,.12)", borderRadius:"4px 4px 0 0", minHeight:m.val>0?3:0 }} />
                  </div>
                  <div style={{ fontSize:9, color:"rgba(232,234,246,.4)", fontWeight:600 }}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="card" style={{ padding:"20px" }}>
            <div style={{ fontWeight:700, fontSize:14, marginBottom:16 }}>🍩 Distribution</div>
            {topCat.filter(c=>c.total>0).map(c => (
              <div key={c.id} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                <div style={{ width:9, height:9, borderRadius:"50%", background:c.color }} />
                <div style={{ fontSize:13, flex:1 }}>{c.icon} {c.label}</div>
                <div style={{ fontSize:13, color:c.color, fontWeight:700 }}>{total?((c.total/total)*100).toFixed(1):0}%</div>
                <div style={{ fontSize:12, color:"rgba(232,234,246,.5)", width:65, textAlign:"right" }}>${fmt(c.total)}</div>
              </div>
            ))}
          </div>
          <div className="card" style={{ padding:"20px" }}>
            <div style={{ fontWeight:700, fontSize:14, marginBottom:14 }}>💡 Insights</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {[
                { icon:"🏆", label:"Top Category", value:topCat[0]?.label||"N/A", color:topCat[0]?.color||"#4ECDC4" },
                { icon:"📈", label:"Avg/Transaction", value:`$${fmt(total/(tx.length||1))}`, color:"#45B7D1" },
                { icon:"📅", label:"Status", value:pct>=90?"Critical":pct>=70?"Caution":"Healthy", color:budgetColor },
                { icon:"💰", label:"Total Spent", value:`$${fmt(total)}`, color:"#FF6B6B" },
              ].map((ins,i) => (
                <div key={i} style={{ padding:"14px", borderRadius:14, background:"rgba(255,255,255,.04)", border:`1px solid ${ins.color}30` }}>
                  <div style={{ fontSize:22 }}>{ins.icon}</div>
                  <div style={{ fontSize:10, color:"rgba(232,234,246,.4)", marginTop:6, fontWeight:600, textTransform:"uppercase" }}>{ins.label}</div>
                  <div style={{ fontWeight:800, fontSize:15, color:ins.color, marginTop:3 }}>{ins.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>}
      </div>
    </div>
  );
}
