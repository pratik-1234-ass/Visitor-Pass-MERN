import React,{useState,useEffect} from "react";
import {createRoot} from "react-dom/client";
import {BrowserRouter,useNavigate} from "react-router-dom";
import axios from "axios";
import {QRCodeCanvas} from "qrcode.react";
import "./styles.css";

const API="https://visitor-pass-backend-7v1t.onrender.com/api";
const api=axios.create({baseURL:API});
api.interceptors.request.use(c=>{const t=localStorage.getItem("token"); if(t)c.headers.Authorization=`Bearer ${t}`; return c;});

function Login(){
 const nav=useNavigate(); const [email,setEmail]=useState("admin@visitorpass.com"); const [password,setPassword]=useState("Password@123"); const [err,setErr]=useState("");
 async function submit(e){e.preventDefault();try{const r=await api.post("/auth/login",{email,password});localStorage.setItem("token",r.data.token);localStorage.setItem("user",JSON.stringify(r.data.user));nav("/");}catch(x){setErr(x.response?.data?.message||"Login failed");}}
 return <div className="login"><div className="card login-card"><h1>Visitor Pass</h1><p>Management System</p><form onSubmit={submit}><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email"/><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password"/><button>Login</button></form><small>Demo: admin@visitorpass.com / Password@123</small>{err&&<div className="error">{err}</div>}</div></div>
}

function App(){
 const nav=useNavigate(); const user=JSON.parse(localStorage.getItem("user")||"null");
 const [stats,setStats]=useState({}); const [visitors,setVisitors]=useState([]); const [passes,setPasses]=useState([]); const [logs,setLogs]=useState([]); const [q,setQ]=useState(""); const [scan,setScan]=useState(""); const [message,setMessage]=useState("");
 const [form,setForm]=useState({name:"",phone:"",email:"",company:"",purpose:""});
 async function load(){try{const [s,v,p,l]=await Promise.all([api.get("/dashboard/stats"),api.get("/visitors?q="+encodeURIComponent(q)),api.get("/passes"),api.get("/checklogs")]);setStats(s.data);setVisitors(v.data);setPasses(p.data);setLogs(l.data)}catch(e){setMessage(e.response?.data?.message||"Could not load data")}}
 useEffect(()=>{if(!user)nav("/login");else load()},[q]);
 if(!user)return null;
 async function addVisitor(e){e.preventDefault();await api.post("/visitors",form);setForm({name:"",phone:"",email:"",company:"",purpose:""});setMessage("Visitor registered");load();}
 async function issue(v){const r=await api.post("/passes",{visitor:v._id});setMessage("Pass issued: "+r.data.passNumber);load();}
 async function scanPass(e){e.preventDefault();try{const r=await api.post("/checklogs/scan",{passNumber:scan});setMessage(r.data.message);setScan("");load()}catch(x){setMessage(x.response?.data?.message||"Scan failed")}}
 function logout(){localStorage.clear();nav("/login")}
 return <div><header><div><b>🪪 Visitor Pass Management</b><span className="role">{user.role}</span></div><button className="logout" onClick={logout}>Logout</button></header>
 <main>
 <div className="hero"><h2>Dashboard</h2><p>Welcome, {user.name}</p></div>
 {message&&<div className="notice">{message}</div>}
 <div className="stats">{Object.entries({Visitors:stats.visitors,Appointments:stats.appointments,Passes:stats.passes,"Check-ins":stats.checkins}).map(([k,v])=><div className="stat" key={k}><strong>{v??0}</strong><span>{k}</span></div>)}</div>
 <section className="grid">
 <div className="card"><h3>Register Visitor</h3><form onSubmit={addVisitor} className="form">{Object.keys(form).map(k=><input key={k} placeholder={k[0].toUpperCase()+k.slice(1)} value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})}/>) }<button>Register Visitor</button></form></div>
 <div className="card"><h3>QR Check-In / Check-Out</h3><form onSubmit={scanPass} className="form"><input value={scan} onChange={e=>setScan(e.target.value)} placeholder="Enter scanned pass number"/><button>Scan Pass</button></form><p className="muted">For demo, type the Pass No. shown below. A real QR scanner can call the same API endpoint.</p></div>
 </section>
 <section className="card"><div className="section-head"><h3>Visitors</h3><input className="search" placeholder="Search visitor..." value={q} onChange={e=>setQ(e.target.value)}/></div>
 <table><thead><tr><th>Name</th><th>Phone</th><th>Email</th><th>Purpose</th><th>Action</th></tr></thead><tbody>{visitors.map(v=><tr key={v._id}><td>{v.name}</td><td>{v.phone||"-"}</td><td>{v.email||"-"}</td><td>{v.purpose||"-"}</td><td><button onClick={()=>issue(v)}>Issue Pass</button></td></tr>)}</tbody></table></section>
 <section className="card"><h3>Issued Passes</h3><div className="pass-grid">{passes.map(p=><div className="pass" key={p._id}><div><b>{p.passNumber}</b><h4>{p.visitor?.name}</h4><p>{p.visitor?.purpose||"Visitor"}</p><button onClick={async()=>{
  try{
    const response = await api.get(`/passes/${p._id}/pdf`, {
      responseType: "blob"
    });

    const url = window.URL.createObjectURL(response.data);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${p.passNumber}.pdf`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
  }catch(error){
    setMessage(error.response?.data?.message || "PDF download failed");
  }
}}>
  Download PDF
</button></div><QRCodeCanvas value={JSON.stringify({passNumber:p.passNumber})} size={110}/></div>)}</div></section>
 <section className="card"><h3>Check Logs</h3><table><thead><tr><th>Visitor</th><th>Action</th><th>Time</th></tr></thead><tbody>{logs.map(l=><tr key={l._id}><td>{l.pass?.visitor?.name||"-"}</td><td>{l.action}</td><td>{new Date(l.timestamp).toLocaleString()}</td></tr>)}</tbody></table></section>
 </main></div>
}

function Root(){return location.pathname==="/login"?<Login/>:<App/>}
createRoot(document.getElementById("root")).render(<BrowserRouter><Root/></BrowserRouter>);
