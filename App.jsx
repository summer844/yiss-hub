import { useState, useEffect, useRef } from "react";

const NAVY = "#002366";
const LIGHT_BLUE = "#4A90D9";
const SKY = "#E8F4FF";

// ── DATA ─────────────────────────────────────────────────────────────────────

const NOTICES = [
  { date: "Mar 27 – Apr 9", title: "Dormitory Application Period Open", urgent: true },
  { date: "Apr 22 – 23",    title: "Course Registration I (Early Bird)", urgent: true },
  { date: "May 7",          title: "Regular Application Deadline — 4:00 PM KST", urgent: false },
  { date: "Jun 25",         title: "Dormitory Check-In from 2:00 PM", urgent: false },
  { date: "Jun 26",         title: "Student Orientation — Baekyang Hall 10:00 AM", urgent: false },
];

const TOP_TILES = [
  { id: "courses",  icon: "📋", label: "Course List" },
  { id: "academic", icon: "🎓", label: "Academic"    },
  { id: "map",      icon: "🗺️", label: "Campus Map"  },
  { id: "hospital", icon: "🏥", label: "Hospital"    },
];

const BIG_TILES = [
  { id: "food",    icon: "🍜", label: "Food & Cafes", bg: "#1C3A6B" },
  { id: "shuttle", icon: "🚌", label: "Shuttle Bus",  bg: NAVY      },
  { id: "faq",     icon: "❓", label: "FAQ",           bg: "#2A4A80" },
];

const BOTTOM_NAV = [
  { id: "menu",    icon: "☰",  label: "All Menus" },
  { id: "dates",  icon: "📅", label: "Key Dates" },
  { id: "arrival",icon: "✈️", label: "Arrival"   },
];

// ── SHEET CONTENT ─────────────────────────────────────────────────────────────

const DATES = [
  { date:"Apr 7–9",   label:"Dormitory Application",     detail:"Early Bird students only",             status:"upcoming" },
  { date:"Apr 16",    label:"Dorm Selection / Intern R1", detail:"Results announced",                    status:"upcoming" },
  { date:"Apr 22–23", label:"Course Registration I",      detail:"Early Bird students only",             status:"upcoming" },
  { date:"Apr 30",    label:"Dorm Payment / Intern R2",   detail:"Both deadlines",                       status:"upcoming" },
  { date:"May 7",     label:"Regular App Deadline",       detail:"4:00 PM KST",                         status:"future"   },
  { date:"May 14",    label:"Regular Payment Deadline",   detail:"4:00 PM KST",                         status:"future"   },
  { date:"Jun 4–5",   label:"Course Registration II",     detail:"All enrolled students",               status:"future"   },
  { date:"Jun 25",    label:"Dorm Check-In",              detail:"From 2:00 PM",                        status:"future"   },
  { date:"Jun 26",    label:"Student Orientation",        detail:"10:00 AM · Baekyang Hall",            status:"future"   },
  { date:"Jun 29",    label:"First Day of Classes",       detail:"4-week & 6-week begin",               status:"future"   },
  { date:"Jul 22",    label:"4-Week Program Ends",        detail:"Checkout by Jul 23, 11:00 AM",        status:"future"   },
  { date:"Aug 5",     label:"6-Week Program Ends",        detail:"Graduation Ceremony 4:00 PM",         status:"future"   },
];

const ACADEMIC_LINKS = [
  { icon:"📊", label:"Grade Check",         sub:"Yonsei Student Portal", url:"https://portal.yonsei.ac.kr" },
  { icon:"📝", label:"Course Evaluation",   sub:"Submit before program ends", url:"https://portal.yonsei.ac.kr" },
  { icon:"📋", label:"Program Survey",      sub:"YISS Office survey", url:"https://summer.yonsei.ac.kr" },
  { icon:"🎓", label:"Certificate (COC)",   sub:"Request after completion", url:"https://summer.yonsei.ac.kr" },
  { icon:"📚", label:"Course Registration", sub:"Apr 22–23 / Jun 4–5", url:"https://portal.yonsei.ac.kr" },
  { icon:"📄", label:"Transcript Request",  sub:"summer.yonsei.ac.kr", url:"https://summer.yonsei.ac.kr" },
];

const MAP_LINKS = [
  { icon:"🏢", label:"Baekyang Hall (YISS Office)", url:"https://maps.app.goo.gl/" },
  { icon:"🏠", label:"Dormitory Area",              url:"https://maps.app.goo.gl/" },
  { icon:"🏥", label:"Severance Hospital",          url:"https://maps.app.goo.gl/" },
  { icon:"🚇", label:"Sinchon Station (Exit 1)",    url:"https://maps.app.goo.gl/" },
  { icon:"🗺️", label:"Full Campus Map",             url:"https://maps.app.goo.gl/" },
];

const FOOD_PLACES = [
  { category:"🏫 The Commons (Baekyang Nuri · Bldg 130)", places:[
    { icon:"☕", name:"Starbucks", desc:"Weekdays 7:30–21:30 · Sat 8:00–20:00 · Sun 9:00–20:00", url:"https://maps.app.goo.gl/" },
    { icon:"🥤", name:"Jamba Juice", desc:"Smoothies, bowls, juices · Weekdays only 9:00–18:00", url:"https://maps.app.goo.gl/" },
    { icon:"🥗", name:"Salady", desc:"Salads, grain bowls, wraps · Weekdays 9:00–19:00 · Weekends 10:00–19:00", url:"https://maps.app.goo.gl/" },
    { icon:"🍽️", name:"The Lounge", desc:"Brunch café · Weekdays only 9:30–18:00", url:"https://maps.app.goo.gl/" },
  ]},
  { category:"🏢 Student Union Building (Bldg 207)", places:[
    { icon:"🍱", name:"Mat-na-saem (맛나샘)", desc:"Korean rice meals + snack bar · Weekdays 8:30–19:00 · Sat 8:30–14:30", url:"https://maps.app.goo.gl/" },
    { icon:"🍛", name:"Booreul-saem (부를샘)", desc:"Buffet — Korean, Chinese, Western · Weekdays 11:00–19:00 only", url:"https://maps.app.goo.gl/" },
    { icon:"🍝", name:"Goreul-saem (고를샘)", desc:"Pasta, salads, Korean food, poke · Weekdays 9:00–18:00", url:"https://maps.app.goo.gl/" },
  ]},
  { category:"🏠 Near SK Global House (Bldg 604)", places:[
    { icon:"☕", name:"Paik's Coffee (빽다방)", desc:"Coffee & drinks · Weekdays 8:00–18:00", url:"https://maps.app.goo.gl/" },
    { icon:"🍔", name:"No Brand Burger", desc:"Burgers & salads · Weekdays only 8:00–20:00", url:"https://maps.app.goo.gl/" },
    { icon:"🥣", name:"Jesoon Restaurant", desc:"Korean food — Jeyukbokkeum, Seolleongtang · Weekdays 8:00–18:00", url:"https://maps.app.goo.gl/" },
  ]},
  { category:"🚶 Sinchon (5 min walk)", places:[
    { icon:"🌶️", name:"Sinchon Food Alley", desc:"Street food — tteokbokki, fried food, kimbap", url:"https://maps.app.goo.gl/" },
    { icon:"🍞", name:"Isaac Toast (Sinchon)", desc:"Korean-style toast sandwiches, great breakfast", url:"https://maps.app.goo.gl/" },
  ]},
];

const HOSPITALS = [
  { icon:"🏥", name:"Severance Hospital", desc:"On campus (Bldg 000) · International Clinic · 24hr ER · English available", url:"https://maps.app.goo.gl/", highlight:true,
    detail:"International Health Care Center: 9:30–11:30, 14:00–16:30 weekdays · 9:30–11:30 Sat · Tel: 02-2228-5800" },
  { icon:"🚑", name:"Severance Hospital ER", desc:"Emergency only · 24hr · Tel: 02-2228-8888", url:"https://maps.app.goo.gl/" },
  { icon:"🏢", name:"Campus Health Service Center", desc:"Student Union Bldg 2F · 9:00–12:00, 13:00–15:00 weekdays · Tel: 02-2123-6649", url:"https://maps.app.goo.gl/" },
  { icon:"💊", name:"Pharmacy (on campus)", desc:"Student Union Bldg · Prescription & OTC meds · bring student ID", url:"https://maps.app.goo.gl/" },
];

const SHUTTLE_INFO = {
  route: "The Commons (Baekyang Nuri) ↔ Seongam Hall",
  note: "The Commons stop is right outside the Starbucks. Seongam Hall is the closest stop to the dormitory.",
  schedule: [
    { direction:"Commons → Seongam Hall", times:["08:30","09:00","09:30","10:00","10:30","11:00","11:30","12:00","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00"] },
    { direction:"Seongam Hall → Commons", times:["08:40","09:10","09:40","10:10","10:40","11:10","11:40","12:10","13:10","13:40","14:10","14:30","15:10","15:40","16:10","16:40","17:10","17:40","18:10"] },
  ],
  rules:[
    "Mon–Fri only — not available on weekends or national holidays",
    "Schedules are subject to change — check yonsei.ac.kr for updates",
  ],
};

const FAQS = [
  { q:"Where is the YISS Office?",               a:"Baekyang Hall Room S302 (Building #310). Mon–Fri 9:00–12:00 and 13:30–17:00. Tel: 02-2123-3535." },
  { q:"How do I connect to campus WiFi?",        a:"Connect to 'Yonsei_Info'. Follow the manual for Non-degree users on the login page. Use your student portal ID and password." },
  { q:"How do I get a D-2-8 visa?",              a:"Email summer@yonsei.ac.kr after admission to request a Certificate of Admission (CoA). Obtaining the visa is your own responsibility." },
  { q:"When is my transcript issued?",           a:"About 2–3 weeks after the program ends. Go to Yonsei Portal → Academic Information System → Grades → Exchange student grades. Note: transcripts will NOT be issued if library books are overdue." },
  { q:"What's the refund policy?",               a:"100% refund before the program starts (by June 29 KST). 80% refund on the first day (June 30). No refund from July 1 onward. Submit refund requests through the YISS Application System." },
  { q:"How do I add or drop a course?",          a:"Course add/drop period: June 30, 9:00 – July 1, 17:00. Use the Yonsei Portal only (portal.yonsei.ac.kr). Korean Language courses cannot be added during this period." },
  { q:"What is the attendance policy?",          a:"Missing more than 1/3 of a course results in an automatic F. Korean Language courses are even stricter — no more than 20% absences allowed." },
  { q:"When can I withdraw from a course?",      a:"4-week: July 9 (9:00) – July 10 (17:00). 6-week: July 16 (9:00) – July 17 (17:00). Do this yourself on Yonsei Portal." },
  { q:"How does grading work?",                  a:"Grades are on an A+/A0/A– to F scale (4.3 GPA scale). All courses use absolute evaluation. Internship is graded Pass/Non-Pass only." },
  { q:"When can I check my grades?",             a:"4-week: July 28–30. 6-week: August 11–13. You must complete the course evaluation first before grades become visible." },
  { q:"What is LearnUs?",                        a:"LearnUs (ys.learnus.org) is the online academic platform for lecture notes, assignments, and course materials. Login uses the same ID/PW as Yonsei Portal. Note: it is NOT the official course registration system." },
  { q:"How do I check my classroom?",            a:"Go to Yonsei Portal → Academic Information System → Course Registration Details. Look at the 강의실 (classroom) column. Or use the Y-Attend app (전자출결)." },
  { q:"Can I change courses after arrival?",     a:"Yes — during the add/drop period June 30–July 1. Visit the YISS Office or use the portal. Changes are strongly discouraged due to the short program duration." },
  { q:"Where is the library and how do I use it?", a:"Central Library (Bldg #301) and Yonsei-Samsung Library (Bldg #302). YISS students can borrow up to 15 items for 15 days. Login: Library ID = student number, PW = YYMMDD + ab! (e.g. 990629ab!)" },
  { q:"Is there insurance coverage?",            a:"Yes — all YISS students are automatically enrolled. Coverage period: June 10 – August 10. Outpatient max ₩200,000/day. Inpatient max ₩30,000,000. Contact: 02-776-8500 or KakaoTalk INSCLAIM (NOT the YISS office)." },
  { q:"What is the shuttle bus schedule?",       a:"Mon–Fri only. Route: The Commons (next to Starbucks) ↔ Seongam Hall (near dorms). Not available on weekends or holidays. Check yonsei.ac.kr for current times." },
  { q:"Where can I get a T-money card?",         a:"At the airport or any convenience store (CU, GS25, 7-Eleven). Use it for subway, bus, and most taxis. Saves money with transfer discounts." },
  { q:"What are the emergency numbers?",         a:"Police: 112 · Fire/Ambulance: 119 · Severance Hospital ER: 02-2228-8888 · International Health Clinic: 02-2228-5800 · Campus Health Center: 02-2123-6649" },
  { q:"Where is a bank on campus?",              a:"Woori Bank has two branches: Student Union Building (Bldg #207) and Yonsei Alumni Center (Bldg #016). Open weekdays 9:00–16:00 only." },
  { q:"Is there a dormitory curfew?",            a:"No curfew, but quiet hours after 11 PM. Overnight guests are not allowed in dorm rooms." },
  { q:"What if I have a medical emergency?",     a:"Call 119 (ambulance, free of charge, translation available) or go directly to Severance Hospital ER on campus (open 24hrs). ER tel: 02-2228-8888." },
  { q:"How do I file an insurance claim?",       a:"Pay the hospital first, then submit documents to the insurance company (not YISS office). Download claim form at n.foreignerdb.com/yonsei7. Login: student ID, PW: 111111." },
];

const ARRIVAL_STEPS = [
  { step:"01", title:"Before You Arrive", items:[
    "Confirm D-2-8 visa — required for in-person attendance",
    "Fly in before June 25 (Dorm Check-In Day)",
    "Download KakaoMap & Naver Map",
    "Prepare some KRW cash for arrival day",
    "Install KakaoTalk for campus group chats",
  ]},
  { step:"02", title:"Getting to Campus", items:[
    "Incheon Airport → AREX train → Hongik Univ. Station (Line 2) → taxi (~10 min)",
    "Or Airport Limousine Bus #6002 → Sinchon directly",
    "Buy a T-money card at the airport (subway + bus + taxi)",
    "Kakao T app = most reliable ride-hailing",
    "Address: 50 Yonsei-ro, Seodaemun-gu, Seoul",
  ]},
  { step:"03", title:"Check-In Day — Jun 25", items:[
    "Dorm check-in from 2:00 PM",
    "Bring: passport, admission letter, reservation confirmation",
    "Bedding provided — bring toiletries and hangers",
    "Connect to YONSEI WiFi with student portal credentials",
  ]},
  { step:"04", title:"Orientation — Jun 26", items:[
    "10:00 AM — Student Orientation · Baekyang Hall Auditorium",
    "2:00 PM — Korean Language Level Test (if taking Korean courses)",
    "Bring your student ID card",
    "Evening social mixer — meet your classmates!",
  ]},
];

const DORM_INFO = [
  { name:"International House (Double)", w4:"₩644,000",   w6:"₩966,000"   },
  { name:"SK Global House (Single)",     w4:"₩1,120,000", w6:"₩1,680,000" },
  { name:"SK Global House (Double)",     w4:"₩728,000",   w6:"₩1,092,000" },
  { name:"Woojungwon (Double)",          w4:"₩728,000",   w6:"₩1,092,000" },
];

// ── BOTTOM SHEET ──────────────────────────────────────────────────────────────

function Sheet({ id, label, icon, onClose }) {
  const ref = useRef(null);
  const startY = useRef(null);

  useEffect(() => {
    requestAnimationFrame(() => { if (ref.current) ref.current.style.transform = "translateY(0)"; });
  }, []);

  const close = () => {
    if (ref.current) ref.current.style.transform = "translateY(105%)";
    setTimeout(onClose, 260);
  };

  return (
    <div onClick={e => e.target === e.currentTarget && close()}
      style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", zIndex:200, display:"flex", flexDirection:"column", justifyContent:"flex-end" }}>
      <div ref={ref}
        onTouchStart={e => { startY.current = e.touches[0].clientY; }}
        onTouchEnd={e => { if (e.changedTouches[0].clientY - startY.current > 70) close(); }}
        style={{
          background:"#fff", borderRadius:"20px 20px 0 0", maxHeight:"85vh",
          display:"flex", flexDirection:"column",
          transform:"translateY(105%)", transition:"transform 0.26s cubic-bezier(0.32,0.72,0,1)",
          maxWidth:720, width:"100%", margin:"0 auto",
        }}>
        {/* Drag handle */}
        <div style={{ padding:"10px 0 4px", display:"flex", justifyContent:"center", flexShrink:0 }}>
          <div style={{ width:34, height:4, borderRadius:2, background:"#E0E0E0" }} />
        </div>
        {/* Header */}
        <div style={{ padding:"6px 18px 14px", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:"1px solid #F0F0F0", flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:20 }}>{icon}</span>
            <span style={{ fontSize:16, fontWeight:700, color:"#1a1a1a" }}>{label}</span>
          </div>
          <button onClick={close} style={{ background:"#F2F2F2", border:"none", borderRadius:"50%", width:28, height:28, cursor:"pointer", fontSize:13, color:"#888", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
        </div>
        {/* Body */}
        <div style={{ overflowY:"auto", padding:"16px 18px 40px", flex:1 }}>
          <SheetBody id={id} />
        </div>
      </div>
    </div>
  );
}

function SheetBody({ id }) {
  const [faqOpen, setFaqOpen] = useState(null);
  const [arrivalOpen, setArrivalOpen] = useState(0);

  if (id === "notices") return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      {NOTICES.map((n, i) => (
        <div key={i} style={{ borderRadius:12, border: n.urgent?"1.5px solid #FECACA":"1.5px solid #EFEFEF", overflow:"hidden" }}>
          {n.urgent && <div style={{ background:"#EF4444", padding:"4px 14px", fontSize:10, fontWeight:800, color:"#fff", letterSpacing:"0.1em", textTransform:"uppercase" }}>● Urgent</div>}
          <div style={{ padding:"12px 14px" }}>
            <div style={{ fontSize:11, color:"#aaa", marginBottom:3 }}>{n.date}</div>
            <div style={{ fontSize:14, fontWeight:600, color: n.urgent?"#B91C1C":"#1a1a1a" }}>{n.title}</div>
          </div>
        </div>
      ))}
    </div>
  );

  if (id === "dates") return (
    <div>
      {DATES.map((d, i) => (
        <div key={i} style={{ display:"flex", alignItems:"flex-start", padding:"12px 0", borderBottom: i<DATES.length-1?"1px solid #F5F5F5":"none" }}>
          <div style={{ minWidth:66, fontSize:11, fontWeight:700, color: d.status==="upcoming"?NAVY:"#bbb", paddingTop:2 }}>{d.date}</div>
          <div style={{ width:7, height:7, borderRadius:"50%", background: d.status==="upcoming"?"#C09040":"#DDD", marginTop:4, marginRight:11, flexShrink:0, boxShadow: d.status==="upcoming"?"0 0 0 3px rgba(192,144,64,0.2)":"none" }} />
          <div>
            <div style={{ fontSize:13, fontWeight: d.status==="upcoming"?700:400, color: d.status==="upcoming"?"#1a1a1a":"#999", display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
              {d.label}
              {d.status==="upcoming" && <span style={{ background:"#C09040", color:"#fff", fontSize:9, fontWeight:800, padding:"1px 7px", borderRadius:20 }}>SOON</span>}
            </div>
            <div style={{ fontSize:11, color:"#ccc", marginTop:2 }}>{d.detail}</div>
          </div>
        </div>
      ))}
    </div>
  );

  if (id === "arrival") return (
    <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
      {ARRIVAL_STEPS.map((s, i) => (
        <div key={i} style={{ borderRadius:13, overflow:"hidden", border: arrivalOpen===i?`2px solid ${NAVY}`:"2px solid transparent", background:"#fff", boxShadow:"0 1px 6px rgba(0,0,0,0.06)", transition:"border-color 0.2s" }}>
          <button onClick={() => setArrivalOpen(arrivalOpen===i?-1:i)} style={{ width:"100%", padding:"13px 15px", display:"flex", alignItems:"center", justifyContent:"space-between", background:"none", border:"none", cursor:"pointer", fontFamily:"inherit" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ background:NAVY, color:"#fff", width:30, height:30, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, flexShrink:0 }}>{s.step}</span>
              <span style={{ fontSize:14, fontWeight:700, color:"#1a1a1a" }}>{s.title}</span>
            </div>
            <span style={{ fontSize:16, color:"#ccc", display:"inline-block", transform:arrivalOpen===i?"rotate(180deg)":"rotate(0)", transition:"transform 0.2s" }}>▾</span>
          </button>
          {arrivalOpen===i && (
            <div style={{ padding:"0 15px 14px 55px" }}>
              {s.items.map((item, j) => (
                <div key={j} style={{ padding:"6px 0 6px 12px", borderLeft:"2px solid #C09040", marginBottom:5, fontSize:13, color:"#555", lineHeight:1.5 }}>{item}</div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  if (id === "courses") return (
    <div>
      <a href="https://yiss-courses2026.yonsei.ac.kr" target="_blank" rel="noopener noreferrer"
        style={{ display:"flex", alignItems:"center", gap:12, padding:"16px", background:NAVY, borderRadius:14, textDecoration:"none", marginBottom:16 }}>
        <span style={{ fontSize:26 }}>📋</span>
        <div>
          <div style={{ fontSize:15, fontWeight:700, color:"#fff" }}>2026 Course List</div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.6)", marginTop:2 }}>yiss-courses2026.yonsei.ac.kr</div>
        </div>
        <span style={{ marginLeft:"auto", color:"rgba(255,255,255,0.5)", fontSize:18 }}>›</span>
      </a>
      <div style={{ background:"#F5F7FF", borderRadius:12, padding:"12px 14px", fontSize:13, color:"#555", lineHeight:1.6 }}>
        📅 <strong>Course Registration Periods</strong><br />
        Period I: April 22–23 (Early Bird students)<br />
        Period II: June 4–5 (All students)
      </div>
    </div>
  );

  if (id === "academic") return (
    <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
      {ACADEMIC_LINKS.map((a, i) => (
        <a key={i} href={a.url} target="_blank" rel="noopener noreferrer"
          style={{ display:"flex", alignItems:"center", gap:13, padding:"13px 15px", background:"#F9F9F9", borderRadius:13, textDecoration:"none", border:"1.5px solid #EFEFEF" }}
          onMouseEnter={e => { e.currentTarget.style.background="#F0F4FF"; e.currentTarget.style.borderColor="#C7D7FF"; }}
          onMouseLeave={e => { e.currentTarget.style.background="#F9F9F9"; e.currentTarget.style.borderColor="#EFEFEF"; }}>
          <span style={{ fontSize:22 }}>{a.icon}</span>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:14, fontWeight:600, color:"#1a1a1a" }}>{a.label}</div>
            <div style={{ fontSize:11, color:"#bbb", marginTop:2 }}>{a.sub}</div>
          </div>
          <span style={{ color:"#ccc", fontSize:16 }}>›</span>
        </a>
      ))}
    </div>
  );

  if (id === "map") return (
    <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
      <div style={{ background:"#E8F4FF", borderRadius:12, padding:"11px 14px", fontSize:12, color:"#1a5276", marginBottom:4 }}>
        📍 Campus: 50 Yonsei-ro, Seodaemun-gu, Seoul
      </div>
      {MAP_LINKS.map((m, i) => (
        <a key={i} href={m.url} target="_blank" rel="noopener noreferrer"
          style={{ display:"flex", alignItems:"center", gap:13, padding:"13px 15px", background:"#F9F9F9", borderRadius:13, textDecoration:"none", border:"1.5px solid #EFEFEF" }}
          onMouseEnter={e => { e.currentTarget.style.background="#F0F4FF"; }}
          onMouseLeave={e => { e.currentTarget.style.background="#F9F9F9"; }}>
          <span style={{ fontSize:22 }}>{m.icon}</span>
          <span style={{ fontSize:14, fontWeight:600, color:"#1a1a1a", flex:1 }}>{m.label}</span>
          <span style={{ fontSize:12, color:"#aaa" }}>Google Maps ›</span>
        </a>
      ))}
    </div>
  );

  if (id === "dorm") return (
    <div>
      <div style={{ background:"#F0F4FF", borderRadius:12, padding:"11px 14px", fontSize:12, color:NAVY, marginBottom:14 }}>
        📅 Application: Apr 7–9 (Early Bird) · skghouse@yonsei.ac.kr · 02-2123-7481
      </div>
      <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
        <thead>
          <tr style={{ background:"#F9F9F9" }}>
            <th style={{ padding:"9px 10px", textAlign:"left", fontSize:11, color:"#888", fontWeight:600 }}>Room Type</th>
            <th style={{ padding:"9px 10px", textAlign:"right", fontSize:11, color:"#888", fontWeight:600 }}>4-Week</th>
            <th style={{ padding:"9px 10px", textAlign:"right", fontSize:11, color:"#888", fontWeight:600 }}>6-Week</th>
          </tr>
        </thead>
        <tbody>
          {DORM_INFO.map((r, i) => (
            <tr key={i} style={{ borderTop:"1px solid #F5F5F5" }}>
              <td style={{ padding:"11px 10px", fontWeight:500, fontSize:12 }}>{r.name}</td>
              <td style={{ padding:"11px 10px", textAlign:"right", color:"#555" }}>{r.w4}</td>
              <td style={{ padding:"11px 10px", textAlign:"right", color:"#555" }}>{r.w6}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (id === "food") return (
    <div>
      <div style={{ background:"#FFF8EE", borderRadius:12, padding:"11px 14px", fontSize:12, color:"#92400E", marginBottom:14 }}>
        💡 Most menus are in Korean — use Naver Map or Papago app for translation!
      </div>
      {FOOD_PLACES.map((section, i) => (
        <div key={i} style={{ marginBottom:20 }}>
          <div style={{ fontSize:12, fontWeight:800, color:NAVY, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:10 }}>{section.category}</div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {section.places.map((p, j) => (
              <a key={j} href={p.url} target="_blank" rel="noopener noreferrer"
                style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", background:"#F9F9F9", borderRadius:12, textDecoration:"none", border:"1.5px solid #EFEFEF" }}
                onMouseEnter={e => { e.currentTarget.style.background="#FFF8EE"; }}
                onMouseLeave={e => { e.currentTarget.style.background="#F9F9F9"; }}>
                <span style={{ fontSize:22 }}>{p.icon}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:"#1a1a1a" }}>{p.name}</div>
                  <div style={{ fontSize:11, color:"#bbb", marginTop:2 }}>{p.desc}</div>
                </div>
                <span style={{ fontSize:12, color:"#aaa" }}>Maps ›</span>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  if (id === "hospital") return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      <div style={{ background:"#FFF1F2", border:"1.5px solid #FECACA", borderRadius:12, padding:"11px 14px", fontSize:12, color:"#9F1239", marginBottom:4 }}>
        🚨 <strong>Emergency: Call 119</strong> (free, translation available) or Severance ER · 02-2228-8888
      </div>
      {HOSPITALS.map((h, i) => (
        <div key={i} style={{ borderRadius:13, border: h.highlight?"1.5px solid #FECACA":"1.5px solid #EFEFEF", background: h.highlight?"#FFF8F8":"#F9F9F9", overflow:"hidden" }}>
          <a href={h.url} target="_blank" rel="noopener noreferrer"
            style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 15px", textDecoration:"none" }}
            onMouseEnter={e => { e.currentTarget.style.background="#FFF0F0"; }}
            onMouseLeave={e => { e.currentTarget.style.background=h.highlight?"#FFF8F8":"#F9F9F9"; }}>
            <span style={{ fontSize:22 }}>{h.icon}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:700, color:"#1a1a1a" }}>{h.name}</div>
              <div style={{ fontSize:11, color:"#999", marginTop:2 }}>{h.desc}</div>
            </div>
            <span style={{ fontSize:12, color:"#aaa" }}>Maps ›</span>
          </a>
          {h.detail && <div style={{ padding:"0 15px 12px 49px", fontSize:11, color:"#888", lineHeight:1.5 }}>{h.detail}</div>}
        </div>
      ))}
      <div style={{ background:"#F0F9FF", borderRadius:12, padding:"11px 14px", fontSize:12, color:"#0369A1", marginTop:4 }}>
        📋 <strong>Insurance claims:</strong> Pay first, then submit to insurer (NOT YISS office). KakaoTalk: INSCLAIM · Tel: 02-776-8500. Claim form: n.foreignerdb.com/yonsei7
      </div>
    </div>
  );

  if (id === "shuttle") return (
    <div>
      <div style={{ background:"#F0F4FF", borderRadius:12, padding:"12px 14px", marginBottom:14 }}>
        <div style={{ fontSize:13, fontWeight:700, color:NAVY, marginBottom:4 }}>🚌 {SHUTTLE_INFO.route}</div>
        <div style={{ fontSize:12, color:"#555", lineHeight:1.55 }}>{SHUTTLE_INFO.note}</div>
      </div>
      {SHUTTLE_INFO.schedule.map((s, i) => (
        <div key={i} style={{ marginBottom:16 }}>
          <div style={{ fontSize:11, fontWeight:800, color:NAVY, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:8 }}>{s.direction}</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            {s.times.map((t, j) => (
              <span key={j} style={{ background:"#EEF2FF", color:NAVY, fontSize:12, fontWeight:600, padding:"5px 10px", borderRadius:8 }}>{t}</span>
            ))}
          </div>
        </div>
      ))}
      <div style={{ background:"#FFFBEB", borderRadius:12, padding:"10px 14px", marginTop:4 }}>
        {SHUTTLE_INFO.rules.map((r, i) => (
          <div key={i} style={{ fontSize:12, color:"#92400E", marginBottom: i < SHUTTLE_INFO.rules.length-1 ? 4 : 0 }}>⚠️ {r}</div>
        ))}
      </div>
      <a href="https://yonsei.ac.kr/en_sc/1872/subview.do" target="_blank" rel="noopener noreferrer"
        style={{ display:"block", marginTop:12, textAlign:"center", background:NAVY, color:"#fff", padding:"11px", borderRadius:11, fontSize:13, fontWeight:700, textDecoration:"none" }}>
        Full Schedule on Yonsei Website →
      </a>
    </div>
  );

  if (id === "faq") return (
    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
      {FAQS.map((item, i) => (
        <div key={i} style={{ background:"#F9F9F9", borderRadius:12, overflow:"hidden", border:"1.5px solid #EFEFEF" }}>
          <button onClick={() => setFaqOpen(faqOpen===i?null:i)}
            style={{ width:"100%", padding:"13px 15px", display:"flex", justifyContent:"space-between", alignItems:"flex-start", background:"none", border:"none", cursor:"pointer", textAlign:"left", gap:10, fontFamily:"inherit" }}>
            <span style={{ fontSize:13, fontWeight:600, color:"#1a1a1a", lineHeight:1.4 }}>{item.q}</span>
            <span style={{ fontSize:18, color:"#ccc", flexShrink:0, display:"inline-block", transform:faqOpen===i?"rotate(45deg)":"rotate(0)", transition:"transform 0.2s" }}>+</span>
          </button>
          {faqOpen===i && (
            <div style={{ padding:"0 15px 13px", fontSize:13, color:"#555", lineHeight:1.65, borderTop:"1px solid #EFEFEF", paddingTop:11 }}>{item.a}</div>
          )}
        </div>
      ))}
    </div>
  );

  return null;
}

// ── SEARCH OVERLAY ────────────────────────────────────────────────────────────

const SEARCH_INDEX = [
  // FAQ
  ...FAQS.map(f => ({ label:f.q, detail:f.a, icon:"❓" })),
  // Dates
  ...DATES.map(d => ({ label:`${d.date}: ${d.label}`, detail:d.detail, icon:"📅" })),
  // Academic
  ...ACADEMIC_LINKS.map(a => ({ label:a.label, detail:a.sub, icon:a.icon, url:a.url })),
  // Hospital
  ...HOSPITALS.map(h => ({ label:h.name, detail:h.desc, icon:"🏥", url:h.url })),
  // Map
  ...MAP_LINKS.map(m => ({ label:m.label, detail:"Google Maps", icon:m.icon, url:m.url })),

  // ── HANDBOOK: Academic ────────────────────────────────────────────
  { label:"Course Add/Drop Period",        detail:"June 30 9:00 – July 1 17:00 · Yonsei Portal only · Korean Language courses cannot be added", icon:"📚" },
  { label:"4-Week Course Withdrawal",      detail:"July 9 (9:00) – July 10 (17:00) · Do on Yonsei Portal yourself", icon:"📚" },
  { label:"6-Week Course Withdrawal",      detail:"July 16 (9:00) – July 17 (17:00) · Do on Yonsei Portal yourself", icon:"📚" },
  { label:"Course Evaluation – 4-Week",    detail:"July 23–30 · Must complete before checking grades", icon:"📝" },
  { label:"Course Evaluation – 6-Week",    detail:"August 6–13 · Must complete before checking grades", icon:"📝" },
  { label:"Grade Check – 4-Week",          detail:"July 28–30 · portal.yonsei.ac.kr", icon:"📊" },
  { label:"Grade Check – 6-Week",          detail:"August 11–13 · portal.yonsei.ac.kr", icon:"📊" },
  { label:"Grading Scale",                 detail:"A+ to F on 4.3 scale · Absolute evaluation · Internship is Pass/Non-Pass", icon:"📊" },
  { label:"Attendance Policy",             detail:"Missing more than 1/3 of class = automatic F. Korean Language: no more than 20% absence allowed", icon:"⚠️" },
  { label:"Course Cancellation Policy",    detail:"Cancelled if fewer than 5 students register (10 for video lectures). Contact summer@yonsei.ac.kr for alternatives", icon:"📋" },
  { label:"LearnUs",                       detail:"ys.learnus.org · Same ID/PW as Yonsei Portal · Lecture notes, assignments · NOT official registration system", icon:"💻", url:"https://ys.learnus.org" },
  { label:"Yonsei Portal",                 detail:"portal.yonsei.ac.kr · Course registration, grades, academic info", icon:"🌐", url:"https://portal.yonsei.ac.kr" },
  { label:"How to check classroom",        detail:"Yonsei Portal → Academic Information System → Course Registration Details → look at 강의실 column. Or use Y-Attend app", icon:"🏫" },
  { label:"Y-Attend App",                  detail:"Download '전자출결' from App Store/Google Play · Log in with Yonsei Portal credentials · View timetable and attendance", icon:"📱" },
  { label:"Class periods – 6 Week",        detail:"P1: 9:00–10:40 · P2: 11:00–12:40 · P3: 13:30–15:10 · Video: flexible", icon:"🕐" },
  { label:"Class periods – 4 Week",        detail:"1A: 9:00–11:30 · 2A: 13:00–15:30 · Video: flexible", icon:"🕐" },
  { label:"Transcript request",            detail:"Yonsei Portal → Academic Info → Grades → Exchange student grades. Free of charge. NOT issued if library books are overdue", icon:"📄", url:"https://portal.yonsei.ac.kr" },
  { label:"Transcript delivery service",   detail:"Request via summer.yonsei.ac.kr → PROGRAM → Transcripts. Overseas express mail ₩50,000 · Email ₩2,000", icon:"📬" },
  { label:"Refund request",                detail:"Submit through YISS Application System → Refund menu. 100% before Jun 29 KST · 80% on Jun 30 · 0% from Jul 1", icon:"💰" },

  // ── HANDBOOK: Campus Life ─────────────────────────────────────────
  { label:"Library – Central Library",     detail:"Bldg #301 · Borrow up to 15 items · 15-day loan period · Login: Library ID (not portal) PW: YYMMDD+ab!", icon:"📖", url:"https://library.yonsei.ac.kr" },
  { label:"Library – Yonsei-Samsung",      detail:"Bldg #302 · Same borrowing rules as Central Library · Tel: 02-2123-6300", icon:"📖" },
  { label:"Library login",                 detail:"Select 'Library ID' (not Yonsei Portal ID). ID = student number. PW = YYMMDD + ab! (e.g. 990629ab!)", icon:"🔑" },
  { label:"Copy Center – Gwangbok Hall",   detail:"B111 (Bldg #308) · Weekdays 9:00–17:00 · Tel: 02-2123-8146", icon:"🖨️" },
  { label:"Post Office (on campus)",       detail:"Student Union Bldg basement · Weekdays 9:00–16:00 · Closed weekends · International EMS available", icon:"📮" },
  { label:"Campus Health Service Center",  detail:"Student Union Bldg 2F · Weekdays 9:00–12:00, 13:00–15:00 · Tel: 02-2123-6649 · Bring student ID", icon:"🏥" },
  { label:"Counseling Center",             detail:"Baekyang Hall 4F · Mon–Fri 9:00–17:00 · Tel: 02-2123-6688 · Email: counsel_english@yonsei.ac.kr", icon:"🧠", url:"https://counsel.yonsei.ac.kr" },
  { label:"Gender Equity Center",          detail:"Nonjidang (call ahead) · Mon–Fri 9:00–17:00 · Tel: 02-2123-2118 · Email: helper@yonsei.ac.kr · Confidential", icon:"🤝" },
  { label:"Campus Fitness Center",         detail:"Bldg #304 · Weights, bikes, treadmills · Check Facebook: yonseifitness for hours and fees", icon:"💪" },
  { label:"Global Lounge",                 detail:"Inside The Commons (Bldg #130) · One-stop services for international students", icon:"🌐" },
  { label:"Woori Bank (on campus)",        detail:"Student Union Bldg (#207) and Alumni Center (#016) · Weekdays 9:00–16:00 only · ATMs in most buildings", icon:"🏦" },
  { label:"WiFi – campus",                 detail:"Connect to 'Yonsei_Info' · Login with student portal ID and PW · Follow Non-degree user manual on the page", icon:"📶" },
  { label:"Student ID Card",               detail:"Distributed at Orientation and YISS Info Desk first week. Cannot be reissued if lost. Used for library access and ID verification", icon:"🪪" },
  { label:"Computer Labs – I-House / G-House", detail:"I-House lobby and basement · G-House lobby and each floor · Mon–Sun 6:00–24:00 · Printing available with card", icon:"💻" },

  // ── HANDBOOK: Living in Korea ─────────────────────────────────────
  { label:"Insurance – coverage period",   detail:"June 10 – August 10, 2025. Outpatient max ₩200,000/day. Inpatient max ₩30,000,000. Contact: 02-776-8500 (NOT YISS office)", icon:"🛡️" },
  { label:"Insurance – how to claim",      detail:"Pay hospital first → submit documents to insurer. Claim form: n.foreignerdb.com/yonsei7 · Login: student ID, PW: 111111 · KakaoTalk: INSCLAIM", icon:"🛡️" },
  { label:"Insurance – NOT covered",       detail:"Pre-existing conditions · Mental illness (F04–F99) · Dental/herbal · Pregnancy · Cosmetic treatment", icon:"🛡️" },
  { label:"T-money card",                  detail:"Buy at airport or convenience stores (CU, GS25, 7-Eleven). Works on subway, bus, and most taxis. Save money with transfer discounts", icon:"🚇" },
  { label:"Subway",                        detail:"Basic fare ₩1,550 for first 10km. Hours 5:30am – midnight. Seoul has 11 lines. Use NAVER Maps or Kakao Maps", icon:"🚇" },
  { label:"Bus fares Seoul",               detail:"Blue (main) ₩1,500 · Green (branch) ₩1,500 · Red (metro) ₩3,000 · Yellow (circular) ₩1,400 · Village bus ₩1,200", icon:"🚌" },
  { label:"Taxi – regular fare",           detail:"Base fare ₩4,800 for first 1.6km. 20% surcharge 22:00–23:00 and 2:00–4:00. 40% surcharge 23:00–2:00", icon:"🚕" },
  { label:"Kakao T",                       detail:"Most reliable ride-hailing app in Korea. Download before arrival. Accepts credit cards", icon:"🚕" },
  { label:"SIM card",                      detail:"Buy from SK Telecom, LG Telecom, or KT. Available at airport. Prepaid phones available at phone stores", icon:"📱" },
  { label:"Emergency numbers",             detail:"Police: 112 · Fire/Ambulance: 119 · Yellow Pages: 120 · Immigration: 1345 · Severance ER: 02-2228-8888 · Campus Health: 02-2123-6649", icon:"🚨" },
  { label:"1339 Health hotline",           detail:"KDCA Call Center · 24/7/365 · Infectious disease info (COVID, MERS etc) · Toll free in Korea", icon:"☎️" },
  { label:"1345 Immigration hotline",      detail:"Mon–Fri 9:00–22:00 · Korean, Chinese, English (9:00–18:00), + 16 other languages · Living guidance for foreigners", icon:"☎️" },
  { label:"Severance Hospital",            detail:"On campus · Oldest hospital in Korea · International Health Care Center: 9:30–11:30, 14:00–16:30 weekdays · Tel: 02-2228-5800", icon:"🏥" },
  { label:"Dental care on campus",         detail:"Severance Hospital Dental Clinic · Reg fee ₩15,000 · Scaling ₩100,000 · Fillings ₩80,000–130,000 · Tel: 02-2228-8622 · Weekdays 8:30–11:30, 13:30–16:00", icon:"🦷" },

  // ── HANDBOOK: Orientation & Events ───────────────────────────────
  { label:"Orientation",                   detail:"June 26, 2026 · 10:00 AM · Baekyang Hall Auditorium · Bring student ID · ID card and T-shirt distributed after 14:00 at Info Desk", icon:"🎓" },
  { label:"Korean Language Level Test",    detail:"June 26, 2026 · 2:00 PM · KLI Building · Mandatory for all KLI course students except Level 1", icon:"🇰🇷" },
  { label:"Pop-up Event",                  detail:"July 8–10 · Student Union Bldg 1F · Photo booth, graduation gowns, games · No reservation needed", icon:"🎉" },
  { label:"Commencement Ceremony",         detail:"August 5, 2026 · 4:00 PM · Main Auditorium (#211) · Reservation required · Check summer.yonsei.ac.kr", icon:"🎓" },
  { label:"Shuttle bus",                   detail:"Mon–Fri only · The Commons (by Starbucks) ↔ Seongam Hall · Not on weekends or holidays", icon:"🚌" },
  { label:"YISS Instagram / YouTube",      detail:"@yonseistudyabroad · Photos, event recaps, and YISS Idol performances", icon:"📸", url:"https://instagram.com/yonseistudyabroad" },
];


function SearchOverlay({ onClose }) {
  const [q, setQ] = useState("");
  const inputRef = useRef(null);
  useEffect(() => { inputRef.current?.focus(); }, []);
  const results = q.length < 2 ? [] : SEARCH_INDEX.filter(r =>
    r.label.toLowerCase().includes(q.toLowerCase()) || r.detail.toLowerCase().includes(q.toLowerCase())
  ).slice(0, 10);

  return (
    <div style={{ position:"fixed", inset:0, background:"#fff", zIndex:300, display:"flex", flexDirection:"column", maxWidth:720, margin:"0 auto" }}>
      <div style={{ padding:"14px 16px", display:"flex", alignItems:"center", gap:10, borderBottom:"1px solid #F0F0F0", background:"#fff" }}>
        <span style={{ fontSize:17, color:"#aaa" }}>🔍</span>
        <input ref={inputRef} value={q} onChange={e=>setQ(e.target.value)}
          placeholder="Search anything…"
          style={{ flex:1, fontSize:16, border:"none", outline:"none", fontFamily:"inherit", color:"#1a1a1a", background:"transparent" }} />
        <button onClick={onClose} style={{ background:"none", border:"none", fontSize:14, color:NAVY, cursor:"pointer", fontWeight:700, fontFamily:"inherit" }}>Cancel</button>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"10px 16px" }}>
        {q.length < 2
          ? <div style={{ color:"#ccc", fontSize:13, textAlign:"center", marginTop:60 }}>Type to search dates, FAQ, academic info…</div>
          : results.length === 0
          ? <div style={{ color:"#ccc", fontSize:13, textAlign:"center", marginTop:60 }}>No results for "{q}"</div>
          : results.map((r, i) => (
            <div key={i} style={{ display:"flex", gap:12, padding:"13px 0", borderBottom:"1px solid #F5F5F5" }}>
              <span style={{ fontSize:20, flexShrink:0 }}>{r.icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:600, color:"#1a1a1a", marginBottom:2 }}>{r.label}</div>
                <div style={{ fontSize:12, color:"#aaa", lineHeight:1.5 }}>{r.detail}</div>
              </div>
              {r.url && <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ fontSize:12, color:NAVY, fontWeight:700, textDecoration:"none", flexShrink:0, alignSelf:"center" }}>Open ›</a>}
            </div>
          ))
        }
      </div>
    </div>
  );
}

// ── ALL MENUS SIDEBAR ─────────────────────────────────────────────────────────

function MenuSidebar({ onSelect, onClose }) {
  const ALL = [
    ...TOP_TILES,
    ...BIG_TILES,
    { id:"notices", icon:"📢", label:"Notices" },
    { id:"dates",   icon:"📅", label:"Key Dates" },
    { id:"arrival", icon:"✈️", label:"Arrival Guide" },
  ];
  return (
    <div onClick={e => e.target===e.currentTarget && onClose()}
      style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", zIndex:300, display:"flex", maxWidth:720, margin:"0 auto" }}>
      <div style={{ width:240, background:"#fff", height:"100%", display:"flex", flexDirection:"column" }}>
        {/* header */}
        <div style={{ background:NAVY, padding:"50px 18px 18px", display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
          <div>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.5)", letterSpacing:"0.1em", marginBottom:3 }}>2026 YISS</div>
            <div style={{ fontSize:16, fontWeight:700, color:"#fff" }}>All Menus</div>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.7)", fontSize:20, cursor:"pointer" }}>✕</button>
        </div>
        {/* menu items */}
        <div style={{ flex:1, overflowY:"auto", padding:"8px 0" }}>
          {ALL.map((item, i) => (
            <button key={i} onClick={() => { onSelect(item.id); onClose(); }}
              style={{ width:"100%", padding:"14px 20px", background:"none", border:"none", cursor:"pointer", textAlign:"left", fontFamily:"inherit", display:"flex", alignItems:"center", gap:12, borderBottom:"1px solid #F8F8F8" }}
              onMouseEnter={e => { e.currentTarget.style.background="#F5F7FF"; }}
              onMouseLeave={e => { e.currentTarget.style.background="none"; }}>
              <span style={{ fontSize:20 }}>{item.icon}</span>
              <span style={{ fontSize:15, color:"#1a1a1a", fontWeight:500 }}>{item.label}</span>
            </button>
          ))}
        </div>
        {/* contact */}
        <div style={{ padding:"14px 18px", borderTop:"1px solid #F0F0F0", fontSize:11, color:"#bbb", lineHeight:1.7 }}>
          summer@yonsei.ac.kr<br />02-2123-3535
        </div>
      </div>
    </div>
  );
}

// ── TILE LABELS MAP ───────────────────────────────────────────────────────────
const ALL_TILES = [...TOP_TILES, ...BIG_TILES,
  { id:"notices", icon:"📢", label:"Notices" },
  { id:"dates",   icon:"📅", label:"Key Dates" },
  { id:"arrival", icon:"✈️", label:"Arrival Guide" },
];

// ── APP ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [sheet, setSheet]       = useState(null);
  const [showSearch, setSearch] = useState(false);
  const [showMenu, setMenu]     = useState(false);

  const urgentCount = NOTICES.filter(n => n.urgent).length;
  const currentTile = ALL_TILES.find(t => t.id === sheet);

  useEffect(() => {
    const s = document.createElement("style");
    s.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=DM+Sans:wght@400;500;600;700&display=swap');
      * { box-sizing:border-box; -webkit-tap-highlight-color:transparent; }
      body { margin:0; background:#EEF2F8; font-family:'DM Sans',sans-serif; }
      @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
      button { font-family:'DM Sans',sans-serif; }
    `;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);

  const openSheet = (id) => { setSheet(id); setMenu(false); };

  return (
    <div style={{ maxWidth:720, margin:"0 auto", minHeight:"100vh", background:"#EEF2F8", display:"flex", flexDirection:"column", paddingBottom:70 }}>

      {/* ── HEADER ── */}
      <div style={{ background:`linear-gradient(160deg, #002F7A 0%, #1565C0 60%, #5BA3E0 100%)`, padding:"52px 18px 26px", position:"relative", overflow:"hidden" }}>
        {/* decorative blobs */}
        <div style={{ position:"absolute", top:-40, right:-20, width:160, height:160, borderRadius:"50%", background:"rgba(255,255,255,0.08)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", top:10, right:60, width:80, height:80, borderRadius:"50%", background:"rgba(255,255,255,0.05)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:-30, left:-30, width:120, height:120, borderRadius:"50%", background:"rgba(0,0,0,0.08)", pointerEvents:"none" }} />

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", position:"relative" }}>
          <div style={{ animation:"fadeUp 0.4s ease both" }}>
            {/* logo row */}
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
              <div style={{ width:34, height:34, borderRadius:8, background:"rgba(255,255,255,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🎓</div>
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.7)", letterSpacing:"0.06em" }}>YONSEI UNIVERSITY</div>
              </div>
            </div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.55)", letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:4 }}>Everything for your campus life,</div>
            <h1 style={{ margin:0, color:"#fff", fontFamily:"'Lora',serif", fontSize:28, fontWeight:700, lineHeight:1.1 }}>
              YISS Hub
            </h1>
            <p style={{ margin:"5px 0 0", color:"rgba(255,255,255,0.45)", fontSize:12 }}>Jun 29 – Aug 5, 2026</p>
          </div>

          {/* top-right icons */}
          <div style={{ display:"flex", gap:8, animation:"fadeUp 0.4s ease 0.05s both" }}>
            <button onClick={() => setSearch(true)} style={{ background:"rgba(255,255,255,0.15)", border:"none", borderRadius:10, width:38, height:38, cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(6px)" }}>🔍</button>
          </div>
        </div>

        {/* ── NOTICE CARD (Y-Diary style) ── */}
        <button onClick={() => openSheet("notices")} style={{
          marginTop:20, width:"100%", background:"rgba(255,255,255,0.15)",
          backdropFilter:"blur(12px)", border:"1px solid rgba(255,255,255,0.25)",
          borderRadius:16, padding:"14px 16px",
          display:"flex", alignItems:"center", gap:12,
          cursor:"pointer", textAlign:"left", fontFamily:"inherit",
          animation:"fadeUp 0.4s ease 0.1s both",
        }}>
          <div style={{ background:"rgba(255,255,255,0.2)", borderRadius:10, width:40, height:40, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>📢</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.6)", fontWeight:700, letterSpacing:"0.08em", marginBottom:3 }}>
              NOTICE · {urgentCount > 0 && <span style={{ color:"#FF8A80" }}>● {urgentCount} Urgent</span>}
            </div>
            <div style={{ fontSize:13, fontWeight:600, color:"#fff", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
              {NOTICES[0].title}
            </div>
          </div>
          <div style={{ background:"rgba(255,255,255,0.2)", borderRadius:"50%", width:26, height:26, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:14, flexShrink:0 }}>+</div>
        </button>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ padding:"18px 14px 0" }}>

        {/* 공지사항 list */}
        <div style={{ background:"#fff", borderRadius:16, padding:"14px 16px", marginBottom:14, boxShadow:"0 1px 4px rgba(0,0,0,0.05)" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <span style={{ fontSize:15, fontWeight:700, color:"#1a1a1a" }}>Announcements</span>
            <button onClick={() => openSheet("notices")} style={{ background:"none", border:"none", cursor:"pointer", fontSize:12, color:LIGHT_BLUE, fontWeight:600, fontFamily:"inherit", display:"flex", alignItems:"center", gap:3 }}>+ See All</button>
          </div>
          <div style={{ borderTop:"2px solid #1a1a1a", paddingTop:10 }}>
            {NOTICES.slice(0,4).map((n, i) => (
              <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:8, padding:"6px 0", borderBottom: i<3?"1px solid #F5F5F5":"none" }}>
                <span style={{ color: n.urgent?"#EF4444":"#9CA3AF", fontSize:10, marginTop:4, flexShrink:0 }}>●</span>
                <span style={{ fontSize:13, color:"#333", lineHeight:1.4 }}>{n.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── 4-ICON ROW (like 연세대/LearnUs row) ── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:12, animation:"fadeUp 0.4s ease 0.15s both" }}>
          {TOP_TILES.map((tile, i) => (
            <button key={tile.id} onClick={() => openSheet(tile.id)}
              style={{ background:"#fff", border:"none", borderRadius:14, padding:"16px 8px 12px", display:"flex", flexDirection:"column", alignItems:"center", gap:6, cursor:"pointer", boxShadow:"0 1px 4px rgba(0,0,0,0.06)", transition:"transform 0.12s,box-shadow 0.12s" }}
              onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 6px 16px rgba(0,0,0,0.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,0.06)"; }}>
              <div style={{ background:`linear-gradient(135deg,${NAVY},${LIGHT_BLUE})`, borderRadius:12, width:44, height:44, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{tile.icon}</div>
              <span style={{ fontSize:11, fontWeight:600, color:"#333", textAlign:"center", lineHeight:1.2 }}>{tile.label}</span>
            </button>
          ))}
        </div>

        {/* ── BIG TILES (like 온라인 도우미 / 셔틀버스 / 주간식단) ── */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, animation:"fadeUp 0.4s ease 0.2s both" }}>
          {BIG_TILES.map((tile, i) => (
            <button key={tile.id} onClick={() => openSheet(tile.id)}
              style={{ background:tile.bg, border:"none", borderRadius:16, padding:"20px 10px 16px", display:"flex", flexDirection:"column", alignItems:"center", gap:8, cursor:"pointer", boxShadow:"0 2px 8px rgba(0,0,0,0.12)", transition:"transform 0.12s,box-shadow 0.12s" }}
              onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 8px 20px rgba(0,0,0,0.18)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,0.12)"; }}>
              <span style={{ fontSize:28 }}>{tile.icon}</span>
              <span style={{ fontSize:12, fontWeight:700, color:"#fff", textAlign:"center", lineHeight:1.2 }}>{tile.label}</span>
            </button>
          ))}
        </div>

        {/* footer */}
        <div style={{ textAlign:"center", marginTop:24, color:"#CCC", fontSize:11, paddingBottom:8 }}>
          Yonsei University · Office of International Affairs
        </div>
      </div>

      {/* ── BOTTOM NAV (like 전체메뉴 / 모바일 신분증 / 전자출결) ── */}
      <div style={{
        position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)",
        width:"100%", maxWidth:720,
        background:"#fff", borderTop:"1px solid #EBEBEB",
        display:"grid", gridTemplateColumns:"repeat(3,1fr)",
        zIndex:100, paddingBottom:"env(safe-area-inset-bottom,0px)",
      }}>
        <button onClick={() => setMenu(true)} style={{ padding:"10px 0 8px", background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3, fontFamily:"inherit" }}>
          <span style={{ fontSize:20, color:NAVY }}>☰</span>
          <span style={{ fontSize:10, color:"#555", fontWeight:600 }}>All Menus</span>
        </button>
        <button onClick={() => openSheet("dates")} style={{ padding:"10px 0 8px", background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3, fontFamily:"inherit" }}>
          <span style={{ fontSize:20, color:NAVY }}>📅</span>
          <span style={{ fontSize:10, color:"#555", fontWeight:600 }}>Key Dates</span>
        </button>
        <button onClick={() => openSheet("arrival")} style={{ padding:"10px 0 8px", background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3, fontFamily:"inherit" }}>
          <span style={{ fontSize:20, color:NAVY }}>✈️</span>
          <span style={{ fontSize:10, color:"#555", fontWeight:600 }}>Arrival</span>
        </button>
      </div>

      {/* ── SHEET ── */}
      {sheet && currentTile && (
        <Sheet id={sheet} label={currentTile.label} icon={currentTile.icon} onClose={() => setSheet(null)} />
      )}

      {/* ── SEARCH ── */}
      {showSearch && <SearchOverlay onClose={() => setSearch(false)} />}

      {/* ── MENU SIDEBAR ── */}
      {showMenu && <MenuSidebar onSelect={openSheet} onClose={() => setMenu(false)} />}
    </div>
  );
}