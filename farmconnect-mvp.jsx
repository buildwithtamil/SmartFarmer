import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── DESIGN TOKENS ────────────────────────────────────────────────
const C = {
  primary: "#1B5E20",
  primaryMid: "#2E7D32",
  primaryLight: "#4CAF50",
  primaryPale: "#E8F5E9",
  accent: "#FF6F00",
  accentLight: "#FFF8E1",
  white: "#FFFFFF",
  offWhite: "#F9FBF7",
  text: "#1A2E1A",
  textMid: "#3D5A3D",
  textLight: "#7A9E7A",
  border: "#D4E6D4",
  card: "#FFFFFF",
  shadow: "rgba(27,94,32,0.10)",
  red: "#E53935",
  gold: "#F9A825",
};

// ─── MOCK DATA ─────────────────────────────────────────────────────
const PRODUCTS = [
  { id: 1, name: "Fresh Tomato", nameTA: "தக்காளி", price: 25, unit: "kg", farmer: "Ramu Farm", farmerDist: "Coimbatore, Tamil Nadu", rating: 4.8, reviews: 120, stock: 50, category: "Vegetables", badge: "Organic", img: "🍅", organic: true, desc: "Naturally grown, chemical free and 100% fresh farm produce." },
  { id: 2, name: "Onion", nameTA: "வெங்காயம்", price: 28, unit: "kg", farmer: "Green Fields", farmerDist: "Salem, Tamil Nadu", rating: 4.6, reviews: 89, stock: 80, category: "Vegetables", badge: "", img: "🧅", organic: false, desc: "Premium quality onions directly from farm." },
  { id: 3, name: "Potato", nameTA: "உருளைக்கிழங்கு", price: 20, unit: "kg", farmer: "Siva Farm", farmerDist: "Ooty, Tamil Nadu", rating: 4.7, reviews: 64, stock: 60, category: "Vegetables", badge: "", img: "🥔", organic: false, desc: "Fresh potatoes harvested this week from Nilgiris." },
  { id: 4, name: "Carrot", nameTA: "கேரட்", price: 30, unit: "kg", farmer: "Organic Land", farmerDist: "Madurai, Tamil Nadu", rating: 4.9, reviews: 44, stock: 40, category: "Vegetables", badge: "Organic", img: "🥕", organic: true, desc: "Organic carrots, no pesticides used." },
  { id: 5, name: "Mango", nameTA: "மாம்பழம்", price: 60, unit: "kg", farmer: "Ramu Farm", farmerDist: "Coimbatore, Tamil Nadu", rating: 4.9, reviews: 210, stock: 30, category: "Fruits", badge: "Seasonal", img: "🥭", organic: true, desc: "Alphonso mangoes, sweet and juicy." },
  { id: 6, name: "Banana", nameTA: "வாழைப்பழம்", price: 40, unit: "dozen", farmer: "Green Fields", farmerDist: "Salem, Tamil Nadu", rating: 4.5, reviews: 55, stock: 100, category: "Fruits", badge: "", img: "🍌", organic: false, desc: "Fresh bananas, nendran variety." },
  { id: 7, name: "Rice", nameTA: "அரிசி", price: 55, unit: "kg", farmer: "Kaveri Agro", farmerDist: "Thanjavur, Tamil Nadu", rating: 4.8, reviews: 312, stock: 200, category: "Millets", badge: "Premium", img: "🌾", organic: false, desc: "Ponni raw rice, freshly milled." },
  { id: 8, name: "Milk", nameTA: "பால்", price: 52, unit: "litre", farmer: "Dairy Fresh", farmerDist: "Erode, Tamil Nadu", rating: 4.7, reviews: 98, stock: 25, category: "Dairy", badge: "", img: "🥛", organic: false, desc: "Fresh cow milk, tested and safe." },
];

const FARMERS = [
  { id: 1, name: "Ramu Farm", rating: 4.8, products: 12, dist: "Coimbatore", emoji: "👨‍🌾", verified: true },
  { id: 2, name: "Green Fields", rating: 4.6, products: 8, dist: "Salem", emoji: "🌿", verified: true },
  { id: 3, name: "Siva Farm", rating: 4.7, products: 15, dist: "Ooty", emoji: "🚜", verified: true },
  { id: 4, name: "Organic Land", rating: 4.5, products: 6, dist: "Madurai", emoji: "🌱", verified: false },
];

const ORDERS_DATA = [
  { id: "ORD123456", product: "Fresh Tomato 🍅", qty: 2, amount: 50, status: "Delivered", date: "20 May, 2024", farmer: "Ramu Farm" },
  { id: "ORD123457", product: "Onion 🧅", qty: 3, amount: 84, status: "Shipped", date: "21 May, 2024", farmer: "Green Fields" },
  { id: "ORD123458", product: "Mango 🥭", qty: 1, amount: 60, status: "Packed", date: "22 May, 2024", farmer: "Ramu Farm" },
  { id: "ORD123459", product: "Rice 🌾", qty: 5, amount: 275, status: "Confirmed", date: "23 May, 2024", farmer: "Kaveri Agro" },
];

const FARMER_PRODUCTS = [
  { id: 1, name: "Tomato 🍅", stock: "120 kg", revenue: "₹2,400", status: "active" },
  { id: 2, name: "Onion 🧅", stock: "80 kg", revenue: "₹1,600", status: "active" },
  { id: 3, name: "Potato 🥔", stock: "60 kg", revenue: "₹1,200", status: "low" },
];

const SCHEMES = [
  { id: 1, name: "PM-KISAN", type: "Central", benefit: "₹6,000/year income support", eligibility: "All small & marginal farmers", deadline: "Ongoing", color: "#1B5E20" },
  { id: 2, name: "Fasal Bima Yojana", type: "Central", benefit: "Crop insurance at low premium", eligibility: "All farmers with crop loan", deadline: "30 June 2024", color: "#0277BD" },
  { id: 3, name: "TN Uzhavar Pasali", type: "State", benefit: "Direct market access + price support", eligibility: "Tamil Nadu farmers", deadline: "Ongoing", color: "#6A1B9A" },
  { id: 4, name: "Soil Health Card", type: "Central", benefit: "Free soil testing + fertilizer advice", eligibility: "All farmers", deadline: "Ongoing", color: "#E65100" },
];

const CHAT_HISTORY = [
  { from: "customer", text: "Hi! I want to buy 10 kg tomato. Is it available?", time: "10:30 AM" },
  { from: "farmer", text: "Yes, it is available. Freshly harvested today morning.", time: "10:31 AM" },
  { from: "customer", text: "Great! Please confirm the price.", time: "10:32 AM" },
  { from: "farmer", text: "₹25/kg. Total ₹250 for 10 kg. Shall I confirm your order?", time: "10:33 AM" },
];

const CATEGORIES = ["All", "Vegetables", "Fruits", "Millets", "Dairy"];

const WEEKLY_DATA = [
  { day: "Mon", val: 3200 }, { day: "Tue", val: 5800 }, { day: "Wed", val: 4100 },
  { day: "Thu", val: 7500 }, { day: "Fri", val: 6200 }, { day: "Sat", val: 9800 }, { day: "Sun", val: 8900 },
];

const MONTHLY_DATA = [
  { day: "1", val: 1200 }, { day: "5", val: 3400 }, { day: "10", val: 5600 },
  { day: "15", val: 4200 }, { day: "20", val: 7800 }, { day: "25", val: 6100 }, { day: "30", val: 9200 },
];

// ─── UTILITY COMPONENTS ───────────────────────────────────────────
const Star = ({ filled }) => (
  <span style={{ color: filled ? C.gold : "#DDD", fontSize: 12 }}>★</span>
);

const Stars = ({ rating }) => (
  <span>
    {[1, 2, 3, 4, 5].map(i => <Star key={i} filled={i <= Math.round(rating)} />)}
  </span>
);

const Badge = ({ text, color = C.primaryLight, bg = C.primaryPale }) => (
  <span style={{ background: bg, color, fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 20, letterSpacing: 0.5 }}>{text}</span>
);

const Card = ({ children, style = {}, onClick }) => (
  <div onClick={onClick} style={{
    background: C.card, borderRadius: 16, boxShadow: `0 2px 12px ${C.shadow}`,
    border: `1px solid ${C.border}`, ...style, cursor: onClick ? "pointer" : "default"
  }}>{children}</div>
);

const GreenBtn = ({ children, onClick, style = {}, outline = false }) => (
  <button onClick={onClick} style={{
    background: outline ? "transparent" : `linear-gradient(135deg, ${C.primaryMid}, ${C.primaryLight})`,
    color: outline ? C.primaryMid : C.white,
    border: outline ? `2px solid ${C.primaryMid}` : "none",
    borderRadius: 14, fontWeight: 700, fontSize: 15, padding: "14px 0",
    width: "100%", cursor: "pointer", letterSpacing: 0.3,
    boxShadow: outline ? "none" : `0 4px 16px rgba(46,125,50,0.25)`,
    fontFamily: "inherit", transition: "all 0.2s", ...style
  }}>{children}</button>
);

const TopBar = ({ title, onBack, rightIcon, onRight }) => (
  <div style={{ background: C.primary, padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
    {onBack ? (
      <button onClick={onBack} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 10, width: 36, height: 36, color: C.white, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
    ) : <div style={{ width: 36 }} />}
    <span style={{ color: C.white, fontWeight: 700, fontSize: 16, letterSpacing: 0.3 }}>{title}</span>
    {rightIcon ? (
      <button onClick={onRight} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 10, width: 36, height: 36, color: C.white, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>{rightIcon}</button>
    ) : <div style={{ width: 36 }} />}
  </div>
);

const BottomNav = ({ active, setScreen, role = "customer" }) => {
  const items = role === "farmer"
    ? [{ icon: "🏠", label: "Dashboard", screen: "farmer-dashboard" }, { icon: "📦", label: "Products", screen: "farmer-products" }, { icon: "➕", label: "Add", screen: "add-product" }, { icon: "📋", label: "Orders", screen: "farmer-orders" }, { icon: "👤", label: "Profile", screen: "farmer-profile" }]
    : [{ icon: "🏠", label: "Home", screen: "home" }, { icon: "🛍️", label: "Categories", screen: "marketplace" }, { icon: "📋", label: "Orders", screen: "orders" }, { icon: "💬", label: "Chat", screen: "chat" }, { icon: "👤", label: "Profile", screen: "profile" }];
  return (
    <div style={{ display: "flex", background: C.white, borderTop: `1px solid ${C.border}`, padding: "8px 0 4px" }}>
      {items.map(it => (
        <button key={it.screen} onClick={() => setScreen(it.screen)} style={{
          flex: 1, background: "none", border: "none", cursor: "pointer",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "4px 0"
        }}>
          <span style={{ fontSize: it.screen === "add-product" ? 22 : 18, background: it.screen === "add-product" ? `linear-gradient(135deg,${C.primaryMid},${C.primaryLight})` : "transparent", borderRadius: it.screen === "add-product" ? 14 : 0, padding: it.screen === "add-product" ? "8px 10px" : 0, color: it.screen === "add-product" ? C.white : "inherit" }}>{it.icon}</span>
          <span style={{ fontSize: 10, color: active === it.screen ? C.primary : C.textLight, fontWeight: active === it.screen ? 700 : 400 }}>{it.label}</span>
          {active === it.screen && <div style={{ width: 20, height: 3, background: C.primaryLight, borderRadius: 2 }} />}
        </button>
      ))}
    </div>
  );
};

// ─── MINI CHART ───────────────────────────────────────────────────
const MiniChart = ({ data, color = C.primaryLight, height = 70 }) => {
  const max = Math.max(...data.map(d => d.val));
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 280;
    const y = height - (d.val / max) * (height - 10);
    return `${x},${y}`;
  }).join(" ");
  const area = `0,${height} ` + pts + ` 280,${height}`;
  return (
    <svg width="100%" viewBox={`0 0 280 ${height}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#chartGrad)" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {data.map((d, i) => {
        const x = (i / (data.length - 1)) * 280;
        const y = height - (d.val / max) * (height - 10);
        return <circle key={i} cx={x} cy={y} r="3.5" fill={color} />;
      })}
    </svg>
  );
};

const BarChart = ({ data, color = C.primaryMid }) => {
  const max = Math.max(...data.map(d => d.val));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80, padding: "0 4px" }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{ width: "100%", background: `linear-gradient(180deg, ${color}, ${C.primaryLight})`, borderRadius: "4px 4px 0 0", height: `${(d.val / max) * 70}px`, transition: "height 0.5s" }} />
          <span style={{ fontSize: 9, color: C.textLight }}>{d.day}</span>
        </div>
      ))}
    </div>
  );
};

// ─── SCREENS ──────────────────────────────────────────────────────

// 1. SPLASH
const SplashScreen = ({ onDone }) => {
  useEffect(() => { const t = setTimeout(onDone, 2200); return () => clearTimeout(t); }, []);
  return (
    <div style={{ flex: 1, background: `linear-gradient(160deg, ${C.primary} 0%, ${C.primaryMid} 60%, ${C.primaryLight} 100%)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.7, type: "spring" }}>
        <div style={{ width: 100, height: 100, background: "rgba(255,255,255,0.15)", borderRadius: 30, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52, boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>🌿</div>
      </motion.div>
      <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.6 }} style={{ textAlign: "center" }}>
        <div style={{ color: C.white, fontWeight: 900, fontSize: 34, letterSpacing: 1 }}>FARM CONNECT</div>
        <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, marginTop: 6, fontWeight: 400 }}>Direct Farmer to Customer Market Place</div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.6 }}>
        <div style={{ display: "flex", gap: 8 }}>
          {[0, 1, 2].map(i => <div key={i} style={{ width: i === 0 ? 24 : 8, height: 8, borderRadius: 4, background: i === 0 ? C.white : "rgba(255,255,255,0.4)" }} />)}
        </div>
      </motion.div>
      <div style={{ position: "absolute", bottom: 40, color: "rgba(255,255,255,0.6)", fontSize: 13 }}>Connecting Farmers · Building a Better Tomorrow</div>
    </div>
  );
};

// 2. ONBOARDING
const OnboardingScreen = ({ onDone }) => {
  const [page, setPage] = useState(0);
  const slides = [
    { emoji: "👨‍🌾", title: "For Farmers", sub: "Sell your fresh products directly to customers & earn more.", bg: "#E8F5E9" },
    { emoji: "🛒", title: "For Customers", sub: "Buy fresh, healthy & organic products directly from trusted farmers.", bg: "#FFF8E1" },
    { emoji: "🤖", title: "AI Assistance", sub: "Get AI powered crop advice, price prediction, weather updates & more.", bg: "#E3F2FD" },
  ];
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: slides[page].bg }}>
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "16px 20px" }}>
        <button onClick={onDone} style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 20, padding: "4px 16px", fontSize: 13, color: C.textLight, cursor: "pointer" }}>Skip</button>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={page} initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -60, opacity: 0 }} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 32px", textAlign: "center", gap: 20 }}>
          <div style={{ fontSize: 90 }}>{slides[page].emoji}</div>
          <div style={{ fontWeight: 800, fontSize: 26, color: C.text }}>{slides[page].title}</div>
          <div style={{ color: C.textLight, fontSize: 15, lineHeight: 1.6 }}>{slides[page].sub}</div>
        </motion.div>
      </AnimatePresence>
      <div style={{ padding: "0 24px 40px" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 24 }}>
          {slides.map((_, i) => <div key={i} style={{ width: i === page ? 24 : 8, height: 8, borderRadius: 4, background: i === page ? C.primary : C.border, transition: "all 0.3s" }} />)}
        </div>
        <GreenBtn onClick={() => page < 2 ? setPage(p => p + 1) : onDone()}>{page < 2 ? "Next →" : "Get Started"}</GreenBtn>
      </div>
    </div>
  );
};

// 3. ROLE SELECT
const RoleSelect = ({ onSelect }) => (
  <div style={{ flex: 1, background: C.offWhite, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 28, gap: 20 }}>
    <div style={{ fontSize: 44 }}>🌿</div>
    <div style={{ fontWeight: 900, fontSize: 26, color: C.text, textAlign: "center" }}>Welcome to<br />Farm Connect</div>
    <div style={{ color: C.textLight, fontSize: 14, textAlign: "center" }}>Choose how you want to join</div>
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 14, marginTop: 12 }}>
      {[{ role: "farmer", emoji: "👨‍🌾", title: "I'm a Farmer", sub: "Sell your products directly" }, { role: "customer", emoji: "🛒", title: "I'm a Customer", sub: "Buy fresh farm products" }, { role: "admin", emoji: "⚙️", title: "Admin Panel", sub: "Manage the platform" }].map(r => (
        <Card key={r.role} onClick={() => onSelect(r.role)} style={{ padding: "18px 20px", display: "flex", alignItems: "center", gap: 16, cursor: "pointer" }}>
          <div style={{ fontSize: 36 }}>{r.emoji}</div>
          <div>
            <div style={{ fontWeight: 700, color: C.text, fontSize: 16 }}>{r.title}</div>
            <div style={{ color: C.textLight, fontSize: 13 }}>{r.sub}</div>
          </div>
          <div style={{ marginLeft: "auto", color: C.primaryLight, fontSize: 20 }}>→</div>
        </Card>
      ))}
    </div>
  </div>
);

// 4. LOGIN
const LoginScreen = ({ onLogin }) => {
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState("phone");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const refs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  const handleOtp = (val, idx) => {
    const updated = [...otp];
    updated[idx] = val.slice(-1);
    setOtp(updated);
    if (val && idx < 5) refs[idx + 1].current?.focus();
    if (updated.every(d => d !== "")) setTimeout(onLogin, 500);
  };

  return (
    <div style={{ flex: 1, background: C.offWhite, display: "flex", flexDirection: "column" }}>
      <div style={{ background: `linear-gradient(160deg, ${C.primary}, ${C.primaryMid})`, padding: "50px 28px 40px", borderRadius: "0 0 40px 40px" }}>
        <div style={{ fontSize: 40 }}>🌿</div>
        <div style={{ color: C.white, fontWeight: 900, fontSize: 26, marginTop: 12 }}>Farm Connect</div>
        <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, marginTop: 4 }}>{step === "phone" ? "Enter your mobile number to continue" : "Enter the OTP sent to your number"}</div>
      </div>
      <div style={{ padding: 28, flex: 1 }}>
        <AnimatePresence mode="wait">
          {step === "phone" ? (
            <motion.div key="phone" initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -40, opacity: 0 }} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <label style={{ fontSize: 13, color: C.textLight, fontWeight: 600 }}>Mobile Number</label>
                <div style={{ display: "flex", marginTop: 8, border: `1.5px solid ${C.border}`, borderRadius: 12, overflow: "hidden", background: C.white }}>
                  <div style={{ padding: "14px 14px", background: C.primaryPale, color: C.primary, fontWeight: 700, fontSize: 14, borderRight: `1px solid ${C.border}` }}>🇮🇳 +91</div>
                  <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="9876543210" maxLength={10} style={{ flex: 1, border: "none", outline: "none", padding: "14px", fontSize: 16, fontFamily: "inherit", background: "transparent" }} />
                </div>
              </div>
              <GreenBtn onClick={() => phone.length === 10 && setStep("otp")}>Send OTP</GreenBtn>
              <div style={{ textAlign: "center", color: C.textLight, fontSize: 13 }}>By continuing, you agree to our <span style={{ color: C.primary, fontWeight: 600 }}>Terms & Privacy</span></div>
            </motion.div>
          ) : (
            <motion.div key="otp" initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -40, opacity: 0 }} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 18, color: C.text }}>Verify OTP</div>
                <div style={{ color: C.textLight, fontSize: 13, marginTop: 4 }}>Sent to +91 {phone}</div>
              </div>
              <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                {otp.map((d, i) => (
                  <input key={i} ref={refs[i]} value={d} onChange={e => handleOtp(e.target.value, i)} maxLength={1} style={{ width: 44, height: 52, textAlign: "center", fontSize: 22, fontWeight: 700, border: `2px solid ${d ? C.primary : C.border}`, borderRadius: 12, outline: "none", fontFamily: "inherit", color: C.text, background: d ? C.primaryPale : C.white, transition: "all 0.2s" }} />
                ))}
              </div>
              <GreenBtn onClick={onLogin}>Verify & Continue</GreenBtn>
              <div style={{ textAlign: "center" }}>
                <span style={{ color: C.textLight, fontSize: 13 }}>Didn't receive? </span>
                <button onClick={() => setOtp(["", "", "", "", "", ""])} style={{ background: "none", border: "none", color: C.primary, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Resend OTP</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// 5. CUSTOMER HOME
const HomeScreen = ({ setScreen, setSelectedProduct, addToCart, cart }) => {
  const [search, setSearch] = useState("");
  const [lang, setLang] = useState("EN");

  const featured = PRODUCTS.filter(p => p.organic).slice(0, 3);
  const trending = PRODUCTS.slice(0, 4);

  return (
    <div style={{ flex: 1, overflowY: "auto", background: C.offWhite }}>
      <div style={{ background: `linear-gradient(160deg, ${C.primary}, ${C.primaryMid})`, padding: "20px 18px 30px", borderRadius: "0 0 28px 28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 13 }}>Good Morning 👋</div>
            <div style={{ color: C.white, fontWeight: 800, fontSize: 20 }}>Hello, Karthik</div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button onClick={() => setLang(l => l === "EN" ? "TA" : "EN")} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 20, padding: "4px 12px", color: C.white, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{lang}</button>
            <button onClick={() => setScreen("cart")} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 10, width: 36, height: 36, fontSize: 18, cursor: "pointer", position: "relative" }}>🛒
              {cart.length > 0 && <span style={{ position: "absolute", top: -4, right: -4, background: C.accent, color: C.white, borderRadius: 10, fontSize: 10, fontWeight: 700, padding: "1px 5px" }}>{cart.length}</span>}
            </button>
          </div>
        </div>
        <div style={{ background: C.white, borderRadius: 14, display: "flex", alignItems: "center", padding: "10px 14px", gap: 10 }}>
          <span style={{ fontSize: 18 }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={lang === "EN" ? "Search products, farmers..." : "பொருட்களை தேடு..."} style={{ flex: 1, border: "none", outline: "none", fontSize: 14, fontFamily: "inherit", color: C.text }} />
        </div>
      </div>

      <div style={{ padding: "20px 18px 0" }}>
        <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }}>
          {["🥦 Vegetables", "🍎 Fruits", "🌾 Millets", "🥛 Dairy"].map(c => (
            <button key={c} onClick={() => setScreen("marketplace")} style={{ background: C.white, border: `1.5px solid ${C.border}`, borderRadius: 20, padding: "8px 16px", fontSize: 13, fontWeight: 600, color: C.textMid, cursor: "pointer", whiteSpace: "nowrap", boxShadow: `0 2px 8px ${C.shadow}` }}>{c}</button>
          ))}
        </div>
      </div>

      <div style={{ margin: "20px 18px 0" }}>
        <Card style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})`, padding: "20px", cursor: "pointer", overflow: "hidden", position: "relative" }} onClick={() => setScreen("marketplace")}>
          <div style={{ color: C.white, fontWeight: 800, fontSize: 18 }}>Fresh From Farms</div>
          <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 13 }}>Straight to Your Home</div>
          <button style={{ marginTop: 12, background: C.white, border: "none", borderRadius: 20, padding: "6px 18px", color: C.primary, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Shop Now →</button>
          <div style={{ position: "absolute", right: -10, top: -10, fontSize: 80, opacity: 0.15 }}>🌿</div>
        </Card>
      </div>

      <div style={{ padding: "20px 18px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontWeight: 800, fontSize: 16, color: C.text }}>Nearby Farmers</div>
          <button onClick={() => setScreen("marketplace")} style={{ background: "none", border: "none", color: C.primaryLight, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>View All →</button>
        </div>
        <div style={{ display: "flex", gap: 12, overflowX: "auto" }}>
          {FARMERS.map(f => (
            <div key={f.id} style={{ background: C.white, borderRadius: 14, padding: "14px", minWidth: 100, textAlign: "center", boxShadow: `0 2px 10px ${C.shadow}`, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 32 }}>{f.emoji}</div>
              <div style={{ fontWeight: 700, fontSize: 12, color: C.text, marginTop: 6 }}>{f.name}</div>
              <div style={{ color: C.gold, fontSize: 11 }}>★ {f.rating}</div>
              {f.verified && <div style={{ background: C.primaryPale, color: C.primary, fontSize: 9, fontWeight: 700, borderRadius: 20, padding: "2px 8px", marginTop: 4 }}>✓ Verified</div>}
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "20px 18px 20px" }}>
        <div style={{ fontWeight: 800, fontSize: 16, color: C.text, marginBottom: 14 }}>Today's Best Offers 🔥</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {trending.map(p => (
            <Card key={p.id} onClick={() => { setSelectedProduct(p); setScreen("product-detail"); }} style={{ padding: "14px", cursor: "pointer" }}>
              <div style={{ fontSize: 48, textAlign: "center", marginBottom: 8 }}>{p.img}</div>
              <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{p.name}</div>
              <div style={{ color: C.primary, fontWeight: 800, fontSize: 15, marginTop: 2 }}>₹{p.price}/{p.unit}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
                <span style={{ fontSize: 11, color: C.textLight }}>{p.farmer}</span>
                <span style={{ color: C.gold, fontSize: 12 }}>★ {p.rating}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

// 6. MARKETPLACE
const MarketplaceScreen = ({ setScreen, setSelectedProduct }) => {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const filtered = PRODUCTS.filter(p => (category === "All" || p.category === category) && p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.offWhite }}>
      <TopBar title="All Products" rightIcon="🛒" />
      <div style={{ padding: "14px 18px 0", background: C.white, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", background: C.offWhite, borderRadius: 12, padding: "10px 14px", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <span>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 14, fontFamily: "inherit" }} />
        </div>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 12 }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)} style={{ background: category === c ? C.primary : C.white, color: category === c ? C.white : C.textMid, border: `1.5px solid ${category === c ? C.primary : C.border}`, borderRadius: 20, padding: "6px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>{c}</button>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {filtered.map(p => (
            <Card key={p.id} onClick={() => { setSelectedProduct(p); setScreen("product-detail"); }} style={{ padding: "14px", cursor: "pointer" }}>
              <div style={{ fontSize: 54, textAlign: "center", marginBottom: 10, background: C.offWhite, borderRadius: 12, padding: "10px 0" }}>{p.img}</div>
              {p.badge && <Badge text={p.badge} />}
              <div style={{ fontWeight: 700, fontSize: 15, color: C.text, marginTop: 6 }}>{p.name}</div>
              <div style={{ color: C.primary, fontWeight: 800, fontSize: 16 }}>₹{p.price}/{p.unit}</div>
              <div style={{ fontSize: 11, color: C.textLight, marginTop: 2 }}>{p.farmer}</div>
              <div style={{ color: C.gold, fontSize: 11, marginTop: 2 }}>★ {p.rating} <span style={{ color: C.textLight }}>({p.reviews})</span></div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

// 7. PRODUCT DETAIL
const ProductDetail = ({ product, onBack, addToCart, setScreen }) => {
  const [qty, setQty] = useState(1);
  const [wishlist, setWishlist] = useState(false);
  if (!product) return null;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.offWhite }}>
      <div style={{ position: "relative" }}>
        <button onClick={onBack} style={{ position: "absolute", top: 16, left: 16, zIndex: 10, background: C.white, border: "none", borderRadius: 12, width: 38, height: 38, fontSize: 18, cursor: "pointer", boxShadow: `0 2px 8px ${C.shadow}` }}>←</button>
        <button onClick={() => setWishlist(w => !w)} style={{ position: "absolute", top: 16, right: 16, zIndex: 10, background: C.white, border: "none", borderRadius: 12, width: 38, height: 38, fontSize: 20, cursor: "pointer", boxShadow: `0 2px 8px ${C.shadow}` }}>{wishlist ? "❤️" : "🤍"}</button>
        <div style={{ background: `linear-gradient(160deg, ${C.primaryPale}, ${C.white})`, height: 220, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 110 }}>{product.img}</div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "20px 18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontWeight: 900, fontSize: 22, color: C.text }}>{product.name}</div>
            <div style={{ color: C.primary, fontWeight: 800, fontSize: 24, marginTop: 2 }}>₹{product.price}<span style={{ fontWeight: 400, fontSize: 15, color: C.textLight }}>/{product.unit}</span></div>
          </div>
          {product.badge && <Badge text={product.badge} color={C.white} bg={C.primaryMid} />}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 14, padding: "14px", background: C.white, borderRadius: 14, border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 36 }}>👨‍🌾</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{product.farmer}</div>
            <div style={{ fontSize: 12, color: C.textLight }}>{product.farmerDist}</div>
            <div style={{ display: "flex", gap: 4, alignItems: "center", marginTop: 2 }}>
              <Stars rating={product.rating} />
              <span style={{ fontSize: 12, color: C.textLight }}>{product.rating} ({product.reviews} reviews)</span>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 14, color: C.textMid, fontSize: 14, lineHeight: 1.7 }}>{product.desc}</div>

        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          {["✅ 100% Organic", "🚫 Pesticide Free", "🌾 Freshly Harvested"].map(t => (
            <div key={t} style={{ flex: 1, background: C.primaryPale, borderRadius: 10, padding: "10px 8px", textAlign: "center", fontSize: 10, color: C.primary, fontWeight: 600 }}>{t}</div>
          ))}
        </div>

        <div style={{ marginTop: 16, display: "flex", alignItems: "center", justifyContent: "space-between", background: C.white, borderRadius: 14, padding: "12px 16px", border: `1px solid ${C.border}` }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Quantity</span>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ background: C.primaryPale, border: "none", borderRadius: 10, width: 32, height: 32, fontSize: 18, cursor: "pointer", color: C.primary, fontWeight: 700 }}>−</button>
            <span style={{ fontWeight: 800, fontSize: 18, color: C.text, minWidth: 24, textAlign: "center" }}>{qty}</span>
            <button onClick={() => setQty(q => q + 1)} style={{ background: C.primary, border: "none", borderRadius: 10, width: 32, height: 32, fontSize: 18, cursor: "pointer", color: C.white, fontWeight: 700 }}>+</button>
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.primary }}>₹{product.price * qty}</span>
        </div>
      </div>

      <div style={{ padding: "16px 18px", background: C.white, borderTop: `1px solid ${C.border}`, display: "flex", gap: 12 }}>
        <GreenBtn outline onClick={() => addToCart({ ...product, qty })} style={{ flex: 1 }}>Add to Cart</GreenBtn>
        <GreenBtn onClick={() => { addToCart({ ...product, qty }); setScreen("checkout"); }} style={{ flex: 1 }}>Buy Now</GreenBtn>
      </div>
    </div>
  );
};

// 8. CART
const CartScreen = ({ cart, setCart, setScreen, onBack }) => {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.offWhite }}>
      <TopBar title="My Cart 🛒" onBack={onBack} />
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px" }}>
        {cart.length === 0 ? (
          <div style={{ textAlign: "center", marginTop: 80, color: C.textLight }}>
            <div style={{ fontSize: 64 }}>🛒</div>
            <div style={{ fontWeight: 700, fontSize: 18, marginTop: 16 }}>Your cart is empty</div>
            <div style={{ fontSize: 14, marginTop: 8 }}>Add fresh products from the marketplace</div>
            <button onClick={() => setScreen("marketplace")} style={{ marginTop: 20, background: C.primary, color: C.white, border: "none", borderRadius: 14, padding: "12px 28px", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>Browse Products</button>
          </div>
        ) : cart.map((item, idx) => (
          <Card key={idx} style={{ padding: "14px 16px", marginBottom: 12, display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ fontSize: 40 }}>{item.img}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{item.name}</div>
              <div style={{ fontSize: 12, color: C.textLight }}>{item.farmer}</div>
              <div style={{ color: C.primary, fontWeight: 800, fontSize: 15, marginTop: 2 }}>₹{item.price}/{item.unit}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button onClick={() => setCart(c => c.map((it, i) => i === idx ? { ...it, qty: Math.max(1, it.qty - 1) } : it))} style={{ background: C.primaryPale, border: "none", borderRadius: 8, width: 28, height: 28, fontSize: 16, cursor: "pointer", color: C.primary }}>−</button>
                <span style={{ fontWeight: 700, minWidth: 20, textAlign: "center" }}>{item.qty}</span>
                <button onClick={() => setCart(c => c.map((it, i) => i === idx ? { ...it, qty: it.qty + 1 } : it))} style={{ background: C.primary, border: "none", borderRadius: 8, width: 28, height: 28, fontSize: 16, cursor: "pointer", color: C.white }}>+</button>
              </div>
              <div style={{ fontWeight: 800, color: C.primary }}>₹{item.price * item.qty}</div>
              <button onClick={() => setCart(c => c.filter((_, i) => i !== idx))} style={{ background: "none", border: "none", color: C.red, fontSize: 11, cursor: "pointer" }}>Remove</button>
            </div>
          </Card>
        ))}
      </div>
      {cart.length > 0 && (
        <div style={{ padding: "16px 18px", background: C.white, borderTop: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <div style={{ color: C.textLight, fontSize: 13 }}>Total ({cart.length} items)</div>
              <div style={{ fontWeight: 900, fontSize: 22, color: C.text }}>₹{total}</div>
            </div>
            <div style={{ textAlign: "right", color: C.primaryLight, fontSize: 13, fontWeight: 600 }}>+ Free Delivery 🚚</div>
          </div>
          <GreenBtn onClick={() => setScreen("checkout")}>Proceed to Checkout →</GreenBtn>
        </div>
      )}
    </div>
  );
};

// 9. CHECKOUT
const CheckoutScreen = ({ cart, onBack, setScreen }) => {
  const [address, setAddress] = useState("14, Anna Nagar, Chennai - 600 040");
  const [payment, setPayment] = useState("upi");
  const [placing, setPlacing] = useState(false);
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const placeOrder = () => {
    setPlacing(true);
    setTimeout(() => { setPlacing(false); setScreen("order-tracking"); }, 1800);
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.offWhite }}>
      <TopBar title="Checkout" onBack={onBack} />
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px" }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: C.textLight, marginBottom: 10 }}>DELIVERY ADDRESS</div>
        <Card style={{ padding: "16px" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <span style={{ fontSize: 24 }}>📍</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: C.text }}>Home</div>
              <textarea value={address} onChange={e => setAddress(e.target.value)} rows={2} style={{ width: "100%", border: "none", outline: "none", resize: "none", fontFamily: "inherit", fontSize: 13, color: C.textMid, marginTop: 4 }} />
            </div>
          </div>
        </Card>

        <div style={{ fontWeight: 700, fontSize: 14, color: C.textLight, margin: "18px 0 10px" }}>PAYMENT METHOD</div>
        {[{ id: "upi", label: "UPI / Google Pay / PhonePe", icon: "📱" }, { id: "razorpay", label: "Card / Net Banking (Razorpay)", icon: "💳" }, { id: "cod", label: "Cash on Delivery", icon: "💵" }].map(pm => (
          <Card key={pm.id} onClick={() => setPayment(pm.id)} style={{ padding: "16px", marginBottom: 10, display: "flex", alignItems: "center", gap: 12, border: `2px solid ${payment === pm.id ? C.primary : C.border}`, cursor: "pointer" }}>
            <span style={{ fontSize: 24 }}>{pm.icon}</span>
            <div style={{ flex: 1, fontWeight: 600, color: C.text, fontSize: 14 }}>{pm.label}</div>
            <div style={{ width: 20, height: 20, borderRadius: 10, border: `2px solid ${payment === pm.id ? C.primary : C.border}`, background: payment === pm.id ? C.primary : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {payment === pm.id && <div style={{ width: 8, height: 8, borderRadius: 4, background: C.white }} />}
            </div>
          </Card>
        ))}

        <div style={{ fontWeight: 700, fontSize: 14, color: C.textLight, margin: "18px 0 10px" }}>ORDER SUMMARY</div>
        <Card style={{ padding: "16px" }}>
          {cart.map((item, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14 }}>
              <span style={{ color: C.text }}>{item.img} {item.name} × {item.qty}</span>
              <span style={{ fontWeight: 600, color: C.text }}>₹{item.price * item.qty}</span>
            </div>
          ))}
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 10, marginTop: 4, display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: C.textLight }}>Delivery</span><span style={{ color: C.primaryLight, fontWeight: 600 }}>FREE</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 17, marginTop: 8 }}>
            <span style={{ color: C.text }}>Total</span><span style={{ color: C.primary }}>₹{total}</span>
          </div>
        </Card>
      </div>

      <div style={{ padding: "16px 18px", background: C.white, borderTop: `1px solid ${C.border}` }}>
        <GreenBtn onClick={placeOrder} style={{ opacity: placing ? 0.7 : 1 }}>
          {placing ? "Placing Order..." : `Place Order · ₹${total}`}
        </GreenBtn>
      </div>
    </div>
  );
};

// 10. ORDER TRACKING
const OrderTrackingScreen = ({ onBack }) => {
  const steps = [
    { label: "Order Confirmed", time: "20 May, 10:30 AM", done: true },
    { label: "Packed", time: "20 May, 11:15 AM", done: true },
    { label: "Shipped", time: "20 May, 02:30 PM", done: true },
    { label: "Out for Delivery", time: "21 May, 09:20 AM", done: true },
    { label: "Delivered", time: "21 May, 12:40 PM", done: false },
  ];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.offWhite }}>
      <TopBar title="Order Tracking" onBack={onBack} rightIcon="↗" />
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 18px" }}>
        <Card style={{ padding: "16px", marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>Order #ORD123456</div>
          <div style={{ fontSize: 12, color: C.textLight, marginTop: 2 }}>20 May, 2024 · 10:30 AM</div>
          <div style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 20 }}>🍅</span>
            <span style={{ fontSize: 14, color: C.text }}>Fresh Tomato × 2 kg</span>
            <span style={{ marginLeft: "auto", fontWeight: 700, color: C.primary }}>₹50</span>
          </div>
        </Card>

        <Card style={{ padding: "20px 16px" }}>
          {steps.map((step, i) => (
            <div key={i} style={{ display: "flex", gap: 16, paddingBottom: i < steps.length - 1 ? 24 : 0, position: "relative" }}>
              {i < steps.length - 1 && <div style={{ position: "absolute", left: 11, top: 24, width: 2, height: "calc(100% - 0px)", background: step.done ? C.primaryLight : C.border }} />}
              <div style={{ width: 24, height: 24, borderRadius: 12, background: step.done ? C.primary : C.border, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, zIndex: 1 }}>
                {step.done && <span style={{ color: C.white, fontSize: 13 }}>✓</span>}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: step.done ? C.text : C.textLight }}>{step.label}</div>
                <div style={{ fontSize: 12, color: C.textLight, marginTop: 2 }}>{step.time}</div>
              </div>
            </div>
          ))}
        </Card>

        <div style={{ marginTop: 16, background: `linear-gradient(135deg, ${C.primaryPale}, #FFF)`, borderRadius: 16, padding: "20px", textAlign: "center", border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 40 }}>🗺️</div>
          <div style={{ fontWeight: 700, color: C.text, marginTop: 8 }}>Live Map Tracking</div>
          <div style={{ color: C.textLight, fontSize: 13, marginTop: 4 }}>Estimated Delivery: Today by 1:00 PM</div>
        </div>
      </div>
      <div style={{ padding: "16px 18px", background: C.white, borderTop: `1px solid ${C.border}` }}>
        <GreenBtn>View Order Details</GreenBtn>
      </div>
    </div>
  );
};

// 11. ORDERS LIST
const OrdersScreen = ({ setScreen }) => {
  const statusColor = { Delivered: C.primary, Shipped: "#0288D1", Packed: C.accent, Confirmed: "#7B1FA2" };
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.offWhite }}>
      <TopBar title="My Orders 📋" />
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px" }}>
        {ORDERS_DATA.map(o => (
          <Card key={o.id} onClick={() => setScreen("order-tracking")} style={{ padding: "16px", marginBottom: 12, cursor: "pointer" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{o.product}</div>
                <div style={{ fontSize: 12, color: C.textLight, marginTop: 2 }}>{o.farmer} · {o.date}</div>
                <div style={{ fontSize: 13, color: C.text, marginTop: 6 }}>Qty: {o.qty} · <span style={{ fontWeight: 700, color: C.primary }}>₹{o.amount}</span></div>
              </div>
              <div style={{ background: statusColor[o.status] + "22", color: statusColor[o.status], borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 700 }}>{o.status}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// 12. CHAT
const ChatScreen = ({ onBack }) => {
  const [msgs, setMsgs] = useState(CHAT_HISTORY);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef();

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const sendMsg = async () => {
    if (!input.trim()) return;
    const userMsg = { from: "customer", text: input, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    setMsgs(m => [...m, userMsg]);
    const q = input;
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "You are a helpful farmer assistant for FarmConnect marketplace. You are Ramu, a farmer from Coimbatore, Tamil Nadu. Respond naturally to customer queries about products, pricing, availability, and farming. Keep responses short and conversational. You can speak in both Tamil and English based on the customer's message.",
          messages: [{ role: "user", content: q }]
        })
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Sorry, I couldn't understand that.";
      setMsgs(m => [...m, { from: "farmer", text: reply, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    } catch {
      setMsgs(m => [...m, { from: "farmer", text: "Network error. Please try again.", time: "Now" }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.offWhite }}>
      <div style={{ background: C.primary, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onBack} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 10, width: 36, height: 36, color: C.white, fontSize: 16, cursor: "pointer" }}>←</button>
        <div style={{ fontSize: 32 }}>👨‍🌾</div>
        <div>
          <div style={{ color: C.white, fontWeight: 700, fontSize: 15 }}>Ramu Farm</div>
          <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 12 }}>🟢 Online</div>
        </div>
        <button style={{ marginLeft: "auto", background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 10, width: 36, height: 36, color: C.white, fontSize: 16, cursor: "pointer" }}>📞</button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px", display: "flex", flexDirection: "column", gap: 12 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.from === "customer" ? "flex-end" : "flex-start", gap: 8 }}>
            {m.from === "farmer" && <div style={{ fontSize: 28, alignSelf: "flex-end" }}>👨‍🌾</div>}
            <div>
              <div style={{ background: m.from === "customer" ? C.primary : C.white, color: m.from === "customer" ? C.white : C.text, borderRadius: m.from === "customer" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", padding: "10px 14px", maxWidth: 220, fontSize: 14, lineHeight: 1.5, boxShadow: `0 2px 8px ${C.shadow}`, border: m.from !== "customer" ? `1px solid ${C.border}` : "none" }}>{m.text}</div>
              <div style={{ fontSize: 10, color: C.textLight, marginTop: 3, textAlign: m.from === "customer" ? "right" : "left" }}>{m.time}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ fontSize: 28 }}>👨‍🌾</div>
            <div style={{ background: C.white, borderRadius: "18px 18px 18px 4px", padding: "12px 16px", border: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", gap: 5 }}>
                {[0, 1, 2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: C.primaryLight, animation: `bounce 1s ${i * 0.2}s infinite` }} />)}
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div style={{ padding: "12px 18px", background: C.white, borderTop: `1px solid ${C.border}`, display: "flex", gap: 10, alignItems: "center" }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMsg()} placeholder="Type a message..." style={{ flex: 1, border: `1.5px solid ${C.border}`, borderRadius: 22, padding: "10px 16px", fontSize: 14, outline: "none", fontFamily: "inherit" }} />
        <button onClick={sendMsg} style={{ background: `linear-gradient(135deg, ${C.primaryMid}, ${C.primaryLight})`, border: "none", borderRadius: 20, width: 44, height: 44, color: C.white, fontSize: 18, cursor: "pointer" }}>→</button>
      </div>
    </div>
  );
};

// 13. AI ASSISTANT
const AIAssistantScreen = ({ onBack }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("text");
  const endRef = useRef();

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const suggestions = ["Crop Advice 🌱", "Price Prediction 📊", "Weather Update 🌦️", "Market Trends 📈"];

  const ask = async (q) => {
    if (!q.trim()) return;
    const userMsg = { from: "user", text: q };
    setMessages(m => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "You are AgriBot, an expert AI farming assistant for FarmConnect India. You help Tamil Nadu farmers with crop advice, pest management, fertilizer recommendations, market prices, weather guidance, and government schemes. Respond in a helpful, practical way. When farmers ask in Tamil, respond in Tamil too. Keep answers concise and actionable.",
          messages: [{ role: "user", content: q }]
        })
      });
      const data = await res.json();
      setMessages(m => [...m, { from: "bot", text: data.content?.[0]?.text || "I couldn't process that." }]);
    } catch {
      setMessages(m => [...m, { from: "bot", text: "Connection error. Please try again." }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.offWhite }}>
      <div style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.primaryMid})`, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onBack} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 10, width: 36, height: 36, color: C.white, fontSize: 16, cursor: "pointer" }}>←</button>
        <div style={{ fontSize: 32 }}>🤖</div>
        <div>
          <div style={{ color: C.white, fontWeight: 800, fontSize: 15 }}>AI Assistant – AgriBot</div>
          <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 12 }}>Powered by Claude AI</div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "20px 18px" }}>
        {messages.length === 0 && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 70, marginBottom: 12 }}>🤖</div>
            <div style={{ fontWeight: 800, fontSize: 20, color: C.text }}>How can I help you today?</div>
            <div style={{ color: C.textLight, fontSize: 13, marginTop: 6, marginBottom: 20 }}>Ask me anything about farming, crops, or market prices</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {suggestions.map(s => (
                <button key={s} onClick={() => ask(s.split(" ")[0] + " " + s.split(" ")[1])} style={{ background: C.white, border: `1.5px solid ${C.border}`, borderRadius: 12, padding: "14px 12px", fontSize: 13, fontWeight: 600, color: C.textMid, cursor: "pointer", boxShadow: `0 2px 8px ${C.shadow}` }}>{s}</button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 16, display: "flex", justifyContent: m.from === "user" ? "flex-end" : "flex-start" }}>
            <div style={{ background: m.from === "user" ? C.primary : C.white, color: m.from === "user" ? C.white : C.text, borderRadius: m.from === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", padding: "12px 16px", maxWidth: "85%", fontSize: 14, lineHeight: 1.6, boxShadow: `0 2px 10px ${C.shadow}`, border: m.from !== "user" ? `1px solid ${C.border}` : "none", whiteSpace: "pre-wrap" }}>{m.text}</div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 5, padding: "12px 16px", background: C.white, borderRadius: "18px 18px 18px 4px", maxWidth: 80, border: `1px solid ${C.border}` }}>
            {[0, 1, 2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: C.primaryLight, opacity: 0.7 }} />)}
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div style={{ padding: "12px 18px", background: C.white, borderTop: `1px solid ${C.border}`, display: "flex", gap: 10, alignItems: "center" }}>
        <button style={{ background: C.primaryPale, border: "none", borderRadius: 10, width: 40, height: 40, fontSize: 18, cursor: "pointer" }}>🎤</button>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && ask(input)} placeholder="Ask anything..." style={{ flex: 1, border: `1.5px solid ${C.border}`, borderRadius: 22, padding: "10px 16px", fontSize: 14, outline: "none", fontFamily: "inherit" }} />
        <button onClick={() => ask(input)} style={{ background: `linear-gradient(135deg,${C.primaryMid},${C.primaryLight})`, border: "none", borderRadius: 20, width: 44, height: 44, color: C.white, fontSize: 18, cursor: "pointer" }}>→</button>
      </div>
    </div>
  );
};

// 14. FARMER DASHBOARD
const FarmerDashboard = ({ setScreen }) => {
  const [period, setPeriod] = useState("Week");

  return (
    <div style={{ flex: 1, overflowY: "auto", background: C.offWhite }}>
      <div style={{ background: `linear-gradient(160deg, ${C.primary}, ${C.primaryMid})`, padding: "20px 18px 30px", borderRadius: "0 0 28px 28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>👨‍🌾</div>
            <div>
              <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 12 }}>Welcome back</div>
              <div style={{ color: C.white, fontWeight: 800, fontSize: 16 }}>Ramu Farm 🌿</div>
              <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 20, padding: "2px 10px", marginTop: 2, display: "inline-block" }}>
                <span style={{ color: C.white, fontSize: 11, fontWeight: 600 }}>✓ Verified Farmer</span>
              </div>
            </div>
          </div>
          <button style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 10, width: 36, height: 36, color: C.white, fontSize: 16, cursor: "pointer" }}>🔔</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 14, padding: "14px" }}>
            <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 12 }}>Total Revenue</div>
            <div style={{ color: C.white, fontWeight: 900, fontSize: 22 }}>₹45,620</div>
            <div style={{ color: "#A5D6A7", fontSize: 11, marginTop: 2 }}>↑ +12.5% from last week</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 14, padding: "14px" }}>
            <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 12 }}>Total Orders</div>
            <div style={{ color: C.white, fontWeight: 900, fontSize: 22 }}>128</div>
            <div style={{ color: "#A5D6A7", fontSize: 11, marginTop: 2 }}>↑ +8.4% from last week</div>
          </div>
        </div>
      </div>

      <div style={{ padding: "20px 18px 0" }}>
        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          {[{ icon: "➕", label: "Add Product", screen: "add-product" }, { icon: "📋", label: "Orders", screen: "farmer-orders" }, { icon: "💰", label: "Earnings", screen: "earnings" }, { icon: "💬", label: "Chat", screen: "chat" }].map(a => (
            <button key={a.label} onClick={() => setScreen(a.screen)} style={{ flex: 1, background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: "12px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer", boxShadow: `0 2px 8px ${C.shadow}` }}>
              <span style={{ fontSize: 22 }}>{a.icon}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.textMid }}>{a.label}</span>
            </button>
          ))}
        </div>

        <Card style={{ padding: "16px", marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: C.text }}>Sales Overview</div>
            <select value={period} onChange={e => setPeriod(e.target.value)} style={{ border: `1px solid ${C.border}`, borderRadius: 8, padding: "4px 10px", fontSize: 12, fontFamily: "inherit", color: C.textMid, cursor: "pointer" }}>
              <option>Week</option><option>Month</option>
            </select>
          </div>
          <MiniChart data={period === "Week" ? WEEKLY_DATA : MONTHLY_DATA} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            {(period === "Week" ? WEEKLY_DATA : MONTHLY_DATA).map((d, i) => (
              <span key={i} style={{ fontSize: 9, color: C.textLight }}>{d.day}</span>
            ))}
          </div>
        </Card>

        <div style={{ fontWeight: 700, fontSize: 15, color: C.text, marginBottom: 12 }}>Top Products</div>
        {FARMER_PRODUCTS.map((p, i) => (
          <Card key={i} style={{ padding: "14px 16px", marginBottom: 10, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 28 }}>{p.name.split(" ")[1]}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{p.name.split(" ")[0]}</div>
              <div style={{ fontSize: 12, color: C.textLight }}>Stock: {p.stock}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: 800, color: C.primary, fontSize: 15 }}>{p.revenue}</div>
              <div style={{ background: p.status === "low" ? "#FFEBEE" : C.primaryPale, color: p.status === "low" ? C.red : C.primary, fontSize: 10, fontWeight: 700, borderRadius: 20, padding: "2px 8px", marginTop: 2 }}>{p.status === "low" ? "Low Stock" : "Active"}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// 15. ADD PRODUCT
const AddProductScreen = ({ onBack }) => {
  const [form, setForm] = useState({ name: "", category: "Vegetables", price: "", qty: "", unit: "kg", organic: false, desc: "" });
  const [submitted, setSubmitted] = useState(false);

  const submit = () => {
    if (!form.name || !form.price || !form.qty) return;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.offWhite }}>
      <TopBar title="Add Product" onBack={onBack} />
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px" }}>
        {submitted && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ background: C.primaryPale, border: `1px solid ${C.primaryLight}`, borderRadius: 12, padding: "12px 16px", marginBottom: 16, color: C.primary, fontWeight: 600, textAlign: "center" }}>
            ✅ Product Published Successfully!
          </motion.div>
        )}

        <div style={{ background: C.primaryPale, border: `2px dashed ${C.primaryLight}`, borderRadius: 16, padding: "30px", textAlign: "center", marginBottom: 20, cursor: "pointer" }}>
          <div style={{ fontSize: 40 }}>📷</div>
          <div style={{ fontWeight: 600, color: C.primary, marginTop: 8 }}>Upload Product Images</div>
          <div style={{ fontSize: 12, color: C.textLight, marginTop: 4 }}>JPG, PNG up to 10MB</div>
        </div>

        {[
          { key: "name", label: "Product Name", placeholder: "e.g. Fresh Tomato" },
          { key: "price", label: "Price (₹)", placeholder: "e.g. 25", type: "number" },
          { key: "qty", label: "Available Quantity", placeholder: "e.g. 100", type: "number" },
          { key: "desc", label: "Description", placeholder: "Describe your product..." },
        ].map(f => (
          <div key={f.key} style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: C.text, display: "block", marginBottom: 6 }}>{f.label}</label>
            {f.key === "desc" ? (
              <textarea value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} rows={3} style={{ width: "100%", border: `1.5px solid ${C.border}`, borderRadius: 12, padding: "12px 14px", fontSize: 14, fontFamily: "inherit", outline: "none", resize: "none", boxSizing: "border-box" }} />
            ) : (
              <input value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} type={f.type || "text"} style={{ width: "100%", border: `1.5px solid ${C.border}`, borderRadius: 12, padding: "12px 14px", fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
            )}
          </div>
        ))}

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: C.text, display: "block", marginBottom: 6 }}>Category</label>
          <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} style={{ width: "100%", border: `1.5px solid ${C.border}`, borderRadius: 12, padding: "12px 14px", fontSize: 14, fontFamily: "inherit", outline: "none" }}>
            {CATEGORIES.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: C.text, display: "block", marginBottom: 6 }}>Unit</label>
          <div style={{ display: "flex", gap: 10 }}>
            {["kg", "litre", "dozen", "piece"].map(u => (
              <button key={u} onClick={() => setForm(p => ({ ...p, unit: u }))} style={{ flex: 1, background: form.unit === u ? C.primary : C.white, color: form.unit === u ? C.white : C.textMid, border: `1.5px solid ${form.unit === u ? C.primary : C.border}`, borderRadius: 10, padding: "10px 0", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>{u}</button>
            ))}
          </div>
        </div>

        <div onClick={() => setForm(p => ({ ...p, organic: !p.organic }))} style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", marginBottom: 24 }}>
          <div style={{ width: 44, height: 24, borderRadius: 12, background: form.organic ? C.primary : C.border, position: "relative", transition: "background 0.3s" }}>
            <div style={{ position: "absolute", top: 2, left: form.organic ? 22 : 2, width: 20, height: 20, borderRadius: 10, background: C.white, transition: "left 0.3s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
          </div>
          <span style={{ fontWeight: 600, color: C.text, fontSize: 14 }}>🌿 Organic Product</span>
        </div>
      </div>
      <div style={{ padding: "16px 18px", background: C.white, borderTop: `1px solid ${C.border}` }}>
        <GreenBtn onClick={submit}>Publish Product 🚀</GreenBtn>
      </div>
    </div>
  );
};

// 16. FARMER ORDERS
const FarmerOrdersScreen = ({ onBack }) => {
  const [tab, setTab] = useState("New");
  const tabs = ["New", "Packed", "Shipped", "Delivered"];
  const ordersByTab = { New: ORDERS_DATA.filter(o => o.status === "Confirmed"), Packed: ORDERS_DATA.filter(o => o.status === "Packed"), Shipped: ORDERS_DATA.filter(o => o.status === "Shipped"), Delivered: ORDERS_DATA.filter(o => o.status === "Delivered") };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.offWhite }}>
      <TopBar title="Manage Orders" onBack={onBack} />
      <div style={{ display: "flex", background: C.white, borderBottom: `1px solid ${C.border}` }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ flex: 1, background: "none", border: "none", padding: "12px 0", fontWeight: tab === t ? 700 : 400, color: tab === t ? C.primary : C.textLight, fontSize: 13, cursor: "pointer", borderBottom: `2px solid ${tab === t ? C.primary : "transparent"}` }}>{t}</button>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px" }}>
        {(ordersByTab[tab] || []).length === 0 ? (
          <div style={{ textAlign: "center", marginTop: 60, color: C.textLight }}>
            <div style={{ fontSize: 48 }}>📭</div>
            <div style={{ fontWeight: 600, marginTop: 12 }}>No {tab.toLowerCase()} orders</div>
          </div>
        ) : (ordersByTab[tab] || []).map(o => (
          <Card key={o.id} style={{ padding: "16px", marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ fontWeight: 700, color: C.text }}>#{o.id}</div>
              <div style={{ color: C.textLight, fontSize: 12 }}>{o.date}</div>
            </div>
            <div style={{ fontSize: 14, color: C.text }}>{o.product} · Qty {o.qty}</div>
            <div style={{ fontWeight: 800, color: C.primary, fontSize: 16, marginTop: 4 }}>₹{o.amount}</div>
            {tab === "New" && (
              <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                <GreenBtn outline style={{ flex: 1 }}>Reject</GreenBtn>
                <GreenBtn style={{ flex: 1 }}>Accept Order ✓</GreenBtn>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

// 17. EARNINGS
const EarningsScreen = ({ onBack }) => {
  const [chartType, setChartType] = useState("bar");

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.offWhite }}>
      <TopBar title="Earnings 💰" onBack={onBack} />
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
          {[{ label: "Today", val: "₹3,200", color: C.primary }, { label: "This Week", val: "₹45,620", color: "#0288D1" }, { label: "This Month", val: "₹1,84,300", color: "#6A1B9A" }].map(s => (
            <Card key={s.label} style={{ padding: "14px 10px", textAlign: "center" }}>
              <div style={{ fontSize: 12, color: C.textLight, fontWeight: 600 }}>{s.label}</div>
              <div style={{ fontWeight: 900, fontSize: 15, color: s.color, marginTop: 4 }}>{s.val}</div>
            </Card>
          ))}
        </div>

        <Card style={{ padding: "16px", marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: C.text }}>Revenue Overview</div>
            <div style={{ display: "flex", gap: 6 }}>
              {["bar", "line"].map(t => (
                <button key={t} onClick={() => setChartType(t)} style={{ background: chartType === t ? C.primary : C.offWhite, color: chartType === t ? C.white : C.textLight, border: "none", borderRadius: 8, padding: "4px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{t === "bar" ? "📊" : "📈"}</button>
              ))}
            </div>
          </div>
          {chartType === "bar" ? <BarChart data={MONTHLY_DATA} /> : <MiniChart data={MONTHLY_DATA} height={80} />}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            {MONTHLY_DATA.map((d, i) => <span key={i} style={{ fontSize: 9, color: C.textLight }}>{d.day}</span>)}
          </div>
        </Card>

        <div style={{ fontWeight: 700, fontSize: 15, color: C.text, marginBottom: 12 }}>Top Selling Products</div>
        {FARMER_PRODUCTS.map((p, i) => (
          <Card key={i} style={{ padding: "14px 16px", marginBottom: 10, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: C.primaryPale, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{p.name.split(" ")[1]}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: C.text }}>{p.name.split(" ")[0]}</div>
              <div style={{ fontSize: 12, color: C.textLight }}>{p.stock} sold</div>
            </div>
            <div style={{ fontWeight: 800, color: C.primary, fontSize: 16 }}>{p.revenue}</div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// 18. GOVERNMENT SCHEMES
const SchemesScreen = ({ onBack }) => {
  const [filter, setFilter] = useState("All");

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.offWhite }}>
      <TopBar title="Government Schemes 🏛️" onBack={onBack} />
      <div style={{ padding: "14px 18px", background: C.white, borderBottom: `1px solid ${C.border}`, display: "flex", gap: 10 }}>
        {["All", "Central", "State"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ background: filter === f ? C.primary : C.offWhite, color: filter === f ? C.white : C.textMid, border: "none", borderRadius: 20, padding: "6px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{f}</button>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px" }}>
        {SCHEMES.filter(s => filter === "All" || s.type === filter).map(s => (
          <Card key={s.id} style={{ padding: "18px", marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16, color: C.text }}>{s.name}</div>
                <div style={{ background: s.color + "22", color: s.color, fontSize: 11, fontWeight: 700, borderRadius: 20, padding: "3px 10px", marginTop: 4, display: "inline-block" }}>{s.type} Scheme</div>
              </div>
              <div style={{ textAlign: "right", fontSize: 11, color: C.textLight }}>Deadline: {s.deadline}</div>
            </div>
            <div style={{ fontSize: 14, color: C.textMid, lineHeight: 1.5, marginBottom: 10 }}>💡 {s.benefit}</div>
            <div style={{ fontSize: 12, color: C.textLight, marginBottom: 14 }}>👥 Eligibility: {s.eligibility}</div>
            <div style={{ display: "flex", gap: 10 }}>
              <GreenBtn style={{ flex: 1 }}>Apply Now →</GreenBtn>
              <GreenBtn outline style={{ flex: 1 }}>Official Website</GreenBtn>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// 19. PROFILE
const ProfileScreen = ({ role, setRole, setScreen }) => {
  const isF = role === "farmer";
  return (
    <div style={{ flex: 1, overflowY: "auto", background: C.offWhite }}>
      <div style={{ background: `linear-gradient(160deg, ${C.primary}, ${C.primaryMid})`, padding: "30px 18px 50px", textAlign: "center" }}>
        <div style={{ width: 80, height: 80, borderRadius: 24, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, margin: "0 auto 12px" }}>{isF ? "👨‍🌾" : "👤"}</div>
        <div style={{ color: C.white, fontWeight: 800, fontSize: 20 }}>{isF ? "Ramu Farm" : "Karthik"}</div>
        <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, marginTop: 2 }}>{isF ? "Coimbatore, Tamil Nadu" : "Chennai, Tamil Nadu"}</div>
        {isF && <div style={{ marginTop: 8, display: "inline-block", background: "rgba(255,255,255,0.2)", borderRadius: 20, padding: "4px 14px", color: C.white, fontSize: 12, fontWeight: 600 }}>✓ Verified Farmer</div>}
      </div>

      <div style={{ padding: "16px 18px", marginTop: -20 }}>
        {[
          { icon: "📊", label: isF ? "View Analytics" : "My Orders", screen: isF ? "earnings" : "orders" },
          { icon: "🤖", label: "AI Assistant – AgriBot", screen: "ai-assistant" },
          { icon: "🏛️", label: "Government Schemes", screen: "schemes" },
          { icon: "💬", label: isF ? "Customer Messages" : "Chat with Farmer", screen: "chat" },
          { icon: "🌙", label: "Dark Mode", screen: null },
          { icon: "🌐", label: "Language: Tamil / English", screen: null },
          { icon: "🔒", label: "Privacy & Security", screen: null },
          { icon: "📞", label: "Support", screen: null },
        ].map((item, i) => (
          <Card key={i} onClick={() => item.screen && setScreen(item.screen)} style={{ padding: "16px 18px", marginBottom: 10, display: "flex", alignItems: "center", gap: 14, cursor: item.screen ? "pointer" : "default" }}>
            <span style={{ fontSize: 22 }}>{item.icon}</span>
            <span style={{ flex: 1, fontWeight: 600, color: C.text, fontSize: 14 }}>{item.label}</span>
            {item.screen && <span style={{ color: C.textLight, fontSize: 18 }}>›</span>}
          </Card>
        ))}

        <Card style={{ padding: "16px 18px", marginBottom: 10, background: "#FFF8E1", border: `1px solid #FFE082` }}>
          <div style={{ fontWeight: 700, color: C.accent, fontSize: 15, marginBottom: 4 }}>🚀 Upgrade to Pro</div>
          <div style={{ fontSize: 13, color: "#E65100" }}>Get priority listing, AI analytics & more</div>
        </Card>

        <button onClick={() => { setRole(null); setScreen("role-select"); }} style={{ width: "100%", background: "#FFEBEE", border: "none", borderRadius: 14, padding: "14px", color: C.red, fontWeight: 700, fontSize: 15, cursor: "pointer", marginTop: 6 }}>Sign Out</button>
      </div>
    </div>
  );
};

// 20. ADMIN DASHBOARD
const AdminDashboard = ({ setRole }) => (
  <div style={{ flex: 1, overflowY: "auto", background: C.offWhite }}>
    <div style={{ background: `linear-gradient(160deg, #1A237E, #283593)`, padding: "24px 18px 30px", borderRadius: "0 0 28px 28px" }}>
      <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 13 }}>Admin Panel</div>
      <div style={{ color: C.white, fontWeight: 900, fontSize: 22, marginTop: 4 }}>FarmConnect HQ ⚙️</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 16 }}>
        {[{ label: "Total Users", val: "12,450", delta: "+234 today" }, { label: "Active Farmers", val: "3,821", delta: "+12 verified" }, { label: "Orders Today", val: "1,842", delta: "₹2.4L value" }, { label: "Revenue MTD", val: "₹84L", delta: "+18.2%" }].map(s => (
          <div key={s.label} style={{ background: "rgba(255,255,255,0.12)", borderRadius: 14, padding: "12px" }}>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 11 }}>{s.label}</div>
            <div style={{ color: C.white, fontWeight: 900, fontSize: 18 }}>{s.val}</div>
            <div style={{ color: "#90CAF9", fontSize: 11, marginTop: 2 }}>{s.delta}</div>
          </div>
        ))}
      </div>
    </div>

    <div style={{ padding: "16px 18px" }}>
      {[{ icon: "👨‍🌾", label: "Farmer Approvals", badge: "8 pending", color: C.accent }, { icon: "⚠️", label: "Disputes", badge: "3 open", color: C.red }, { icon: "📦", label: "All Orders", badge: "1,842 today" }, { icon: "📊", label: "Analytics Dashboard" }, { icon: "🏛️", label: "Manage Schemes" }, { icon: "💬", label: "User Reports" }].map((item, i) => (
        <Card key={i} style={{ padding: "16px 18px", marginBottom: 10, display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}>
          <span style={{ fontSize: 22 }}>{item.icon}</span>
          <span style={{ flex: 1, fontWeight: 600, color: C.text, fontSize: 14 }}>{item.label}</span>
          {item.badge && <div style={{ background: item.color ? item.color + "22" : C.primaryPale, color: item.color || C.primary, borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>{item.badge}</div>}
          <span style={{ color: C.textLight, fontSize: 18 }}>›</span>
        </Card>
      ))}
      <button onClick={() => setRole(null)} style={{ width: "100%", background: "#FFEBEE", border: "none", borderRadius: 14, padding: "14px", color: C.red, fontWeight: 700, fontSize: 15, cursor: "pointer", marginTop: 6 }}>Sign Out</button>
    </div>
  </div>
);

// ─── MAIN APP ─────────────────────────────────────────────────────
export default function FarmConnectApp() {
  const [appState, setAppState] = useState("splash"); // splash > onboarding > role-select > login > app
  const [role, setRole] = useState(null);
  const [screen, setScreen] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart(c => {
      const existing = c.find(i => i.id === product.id);
      if (existing) return c.map(i => i.id === product.id ? { ...i, qty: i.qty + product.qty } : i);
      return [...c, product];
    });
  };

  const selectRole = (r) => { setRole(r); setAppState("login"); };
  const handleLogin = () => {
    setAppState("app");
    setScreen(role === "farmer" ? "farmer-dashboard" : role === "admin" ? "admin" : "home");
  };

  const renderScreen = () => {
    if (appState === "splash") return <SplashScreen onDone={() => setAppState("onboarding")} />;
    if (appState === "onboarding") return <OnboardingScreen onDone={() => setAppState("role-select")} />;
    if (appState === "role-select") return <RoleSelect onSelect={selectRole} />;
    if (appState === "login") return <LoginScreen onLogin={handleLogin} />;

    if (appState === "app") {
      if (role === "admin") return <AdminDashboard setRole={r => { setRole(r); setAppState("role-select"); }} />;

      const shared = { setScreen, setSelectedProduct, addToCart, cart };

      const mainContent = () => {
        switch (screen) {
          case "home": return <HomeScreen {...shared} />;
          case "marketplace": return <MarketplaceScreen {...shared} />;
          case "product-detail": return <ProductDetail product={selectedProduct} onBack={() => setScreen("marketplace")} addToCart={addToCart} setScreen={setScreen} />;
          case "cart": return <CartScreen cart={cart} setCart={setCart} setScreen={setScreen} onBack={() => setScreen("home")} />;
          case "checkout": return <CheckoutScreen cart={cart} onBack={() => setScreen("cart")} setScreen={setScreen} />;
          case "order-tracking": return <OrderTrackingScreen onBack={() => setScreen("orders")} />;
          case "orders": return <OrdersScreen setScreen={setScreen} />;
          case "chat": return <ChatScreen onBack={() => setScreen(role === "farmer" ? "farmer-dashboard" : "home")} />;
          case "ai-assistant": return <AIAssistantScreen onBack={() => setScreen(role === "farmer" ? "farmer-dashboard" : "profile")} />;
          case "schemes": return <SchemesScreen onBack={() => setScreen("profile")} />;
          case "profile": return <ProfileScreen role={role} setRole={r => { setRole(r); setAppState("role-select"); }} setScreen={setScreen} />;
          case "farmer-dashboard": return <FarmerDashboard setScreen={setScreen} />;
          case "add-product": return <AddProductScreen onBack={() => setScreen("farmer-dashboard")} />;
          case "farmer-orders": return <FarmerOrdersScreen onBack={() => setScreen("farmer-dashboard")} />;
          case "farmer-products": return <FarmerDashboard setScreen={setScreen} />;
          case "farmer-profile": return <ProfileScreen role="farmer" setRole={r => { setRole(r); setAppState("role-select"); }} setScreen={setScreen} />;
          case "earnings": return <EarningsScreen onBack={() => setScreen("farmer-dashboard")} />;
          default: return <HomeScreen {...shared} />;
        }
      };

      const noNav = ["product-detail", "cart", "checkout", "order-tracking", "chat", "ai-assistant", "schemes", "add-product", "farmer-orders", "earnings"];

      return (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            {mainContent()}
          </div>
          {!noNav.includes(screen) && (
            <BottomNav active={screen} setScreen={setScreen} role={role} />
          )}
        </div>
      );
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#E8F0E8", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, sans-serif", padding: "20px 0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 0; height: 0; }
        input, textarea, select, button { font-family: 'Poppins', inherit; }
        @keyframes bounce { 0%,80%,100%{transform:scale(0.8);opacity:0.6} 40%{transform:scale(1.2);opacity:1} }
      `}</style>
      <div style={{ width: 390, height: 844, background: C.white, borderRadius: 44, overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 32px 80px rgba(0,0,0,0.25), 0 0 0 10px #1A2E1A, 0 0 0 12px #333", position: "relative" }}>
        <div style={{ height: 44, background: appState === "splash" ? C.primary : appState === "app" && (screen === "home" || screen === "farmer-dashboard") ? C.primary : C.white, display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 8 }}>
          <div style={{ width: 120, height: 34, borderRadius: 17, background: "rgba(0,0,0,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 10, height: 10, borderRadius: 5, background: "rgba(0,0,0,0.3)", marginRight: 60 }} />
            <div style={{ width: 60, height: 4, borderRadius: 2, background: "rgba(0,0,0,0.2)", position: "absolute" }} />
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {renderScreen()}
        </div>
        <div style={{ height: 34, background: appState === "app" ? C.white : "transparent", display: "flex", alignItems: "center", justifyContent: "center", paddingBottom: 8 }}>
          <div style={{ width: 120, height: 5, borderRadius: 3, background: "rgba(0,0,0,0.15)" }} />
        </div>
      </div>

      <div style={{ marginLeft: 32, maxWidth: 280 }}>
        <div style={{ fontWeight: 900, fontSize: 28, color: "#1B5E20", letterSpacing: -0.5 }}>FARM CONNECT</div>
        <div style={{ color: "#5D8A5D", fontSize: 14, marginTop: 4, lineHeight: 1.5 }}>Direct Farmer-to-Customer Marketplace</div>
        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { icon: "🤖", text: "Claude AI-Powered AgriBot" },
            { icon: "🌿", text: "Tamil & English Language Support" },
            { icon: "💳", text: "Razorpay + UPI Payments" },
            { icon: "📍", text: "Real-time Order Tracking" },
            { icon: "🏛️", text: "Government Schemes Integration" },
            { icon: "📊", text: "Farmer Revenue Analytics" },
          ].map(f => (
            <div key={f.text} style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(27,94,32,0.08)", borderRadius: 10, padding: "8px 14px" }}>
              <span style={{ fontSize: 18 }}>{f.icon}</span>
              <span style={{ fontSize: 13, color: "#2E5C2E", fontWeight: 600 }}>{f.text}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 20, background: "#1B5E20", borderRadius: 14, padding: "14px 18px" }}>
          <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 11, fontWeight: 600 }}>MVP READY FOR</div>
          <div style={{ color: "#FFFFFF", fontWeight: 800, fontSize: 16, marginTop: 2 }}>Investor Pitch 🚀</div>
          <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, marginTop: 6, lineHeight: 1.5 }}>Flutter + Supabase + Razorpay + Claude AI · Built for Bharat</div>
        </div>
      </div>
    </div>
  );
}
