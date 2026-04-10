import { useRef, useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import gsap from "gsap";

const SERIF = "'Playfair Display',serif";
const BODY = "'Cormorant Garamond',serif";
const MONO = "'IBM Plex Mono','SFMono-Regular',monospace";

const GOLD = "hsl(40 46% 56%)";
const GOLD_BRIGHT = "hsl(40 50% 65%)";
const GOLD_HIGHLIGHT = "hsl(40 58% 72%)";

type FormType = "buy" | "sell";

interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "select" | "textarea";
  placeholder: string;
  options?: string[];
}

const buyFields: FormField[] = [
  { name: "fullName", label: "Full Name", type: "text", placeholder: "Your full name" },
  { name: "email", label: "Email", type: "email", placeholder: "your@email.com" },
  { name: "phone", label: "Phone", type: "tel", placeholder: "+971 ..." },
  { name: "budget", label: "Budget Range", type: "select", placeholder: "Select range",
    options: ["Under AED 1M", "AED 1M – 3M", "AED 3M – 5M", "AED 5M – 10M", "AED 10M – 25M", "AED 25M+"] },
  { name: "propertyType", label: "Property Type", type: "select", placeholder: "Select type",
    options: ["Apartment", "Villa", "Penthouse", "Townhouse", "Commercial", "Land"] },
  { name: "preferredAreas", label: "Preferred Areas", type: "text", placeholder: "e.g. Downtown, Marina, Palm Jumeirah" },
  { name: "message", label: "Additional Details", type: "textarea", placeholder: "Tell us about your ideal property..." },
];

const sellFields: FormField[] = [
  { name: "fullName", label: "Full Name", type: "text", placeholder: "Your full name" },
  { name: "email", label: "Email", type: "email", placeholder: "your@email.com" },
  { name: "phone", label: "Phone", type: "tel", placeholder: "+971 ..." },
  { name: "propertyType", label: "Property Type", type: "select", placeholder: "Select type",
    options: ["Apartment", "Villa", "Penthouse", "Townhouse", "Commercial", "Land"] },
  { name: "location", label: "Property Location", type: "text", placeholder: "e.g. Palm Jumeirah, Tower A, Unit 1204" },
  { name: "askingPrice", label: "Asking Price (AED)", type: "text", placeholder: "e.g. 5,000,000" },
  { name: "bedrooms", label: "Bedrooms", type: "select", placeholder: "Select",
    options: ["Studio", "1 Bedroom", "2 Bedrooms", "3 Bedrooms", "4 Bedrooms", "5+ Bedrooms"] },
  { name: "message", label: "Property Details", type: "textarea", placeholder: "Describe your property, unique features, views..." },
];

/* ── Shared input style ── */
const inputStyle: React.CSSProperties = {
  fontFamily: BODY,
  fontSize: "0.95rem",
  letterSpacing: "0.02em",
  color: "hsl(0 0% 88%)",
  background: "hsl(0 0% 5% / 0.6)",
  border: "1px solid hsl(40 46% 56% / 0.15)",
  borderRadius: "2px",
  padding: "14px 18px",
  width: "100%",
  outline: "none",
  transition: "border-color 0.4s, box-shadow 0.4s",
};

const inputFocusHandler = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  e.currentTarget.style.borderColor = "hsl(40 46% 56% / 0.4)";
  e.currentTarget.style.boxShadow = "0 0 0 3px hsl(40 46% 56% / 0.06)";
};
const inputBlurHandler = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  e.currentTarget.style.borderColor = "hsl(40 46% 56% / 0.15)";
  e.currentTarget.style.boxShadow = "none";
};

const Contact = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<FormType>(
    (searchParams.get("type") as FormType) === "sell" ? "sell" : "buy"
  );
  const [submitted, setSubmitted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Scroll to top on page load / tab change from URL
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Entrance animation
  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.fromTo(headingRef.current, { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", delay: 0.2 });
      }
      if (formRef.current) {
        gsap.fromTo(formRef.current, { y: 80, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.4, ease: "power3.out", delay: 0.5 });
      }
    }, containerRef.current);
    return () => ctx.revert();
  }, []);

  // Animate form swap
  useEffect(() => {
    if (!formRef.current) return;
    gsap.fromTo(formRef.current, { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" });
  }, [activeTab]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    gsap.fromTo(".success-msg", { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.5)" });
  }, []);

  const fields = activeTab === "buy" ? buyFields : sellFields;

  return (
    <div
      ref={containerRef}
      className="min-h-screen relative"
      style={{
        background: `
          radial-gradient(ellipse at 50% 0%, hsl(40 46% 15% / 0.08) 0%, transparent 50%),
          linear-gradient(180deg, hsl(0 0% 3%), hsl(0 0% 4%) 50%, hsl(0 0% 3%))
        `,
      }}
    >
      {/* Gold glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, hsl(40 46% 56% / 0.05) 0%, transparent 70%)", filter: "blur(100px)" }} />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-16 max-w-[720px] pt-24 sm:pt-32 pb-16 sm:pb-24">

        {/* Back to home */}
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 mb-12 group cursor-pointer"
          style={{ color: "hsl(0 0% 50%)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round"
            className="transition-transform duration-300 group-hover:-translate-x-1">
            <path d="M19 12H5" /><path d="m12 19-7-7 7-7" />
          </svg>
          <span className="text-xs tracking-[0.3em] uppercase transition-colors duration-300 group-hover:text-[hsl(40_50%_65%)]"
            style={{ fontFamily: MONO }}>
            Return Home
          </span>
        </button>

        {/* Heading */}
        <div ref={headingRef} className="mb-10 sm:mb-14">
          <p className="text-[10px] sm:text-xs tracking-[0.5em] uppercase mb-3 sm:mb-4"
            style={{ fontFamily: MONO, color: GOLD_BRIGHT }}>
            Private Consultation
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-5xl mb-4 sm:mb-5" style={{
            fontFamily: SERIF, fontWeight: 200, color: "hsl(0 0% 95%)",
            lineHeight: 1.15, letterSpacing: "0.03em",
          }}>
            Begin Your <span style={{
              background: `linear-gradient(135deg, ${GOLD_HIGHLIGHT}, ${GOLD})`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>Journey</span>
          </h1>
          <p className="text-base md:text-lg leading-relaxed" style={{ fontFamily: BODY, color: "hsl(0 0% 55%)" }}>
            Whether you&rsquo;re acquiring a premium asset or positioning your property in Dubai&rsquo;s elite market, our private office is at your service.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex gap-0 mb-8 sm:mb-10 relative">
          {(["buy", "sell"] as FormType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setSubmitted(false); }}
              className="flex-1 py-3 sm:py-4 relative z-10 transition-colors duration-500 cursor-pointer"
              style={{
                fontFamily: MONO,
                fontSize: "clamp(0.55rem, 1.8vw, 0.7rem)",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: activeTab === tab ? "hsl(0 0% 95%)" : "hsl(0 0% 40%)",
                borderBottom: activeTab === tab
                  ? `2px solid ${GOLD}`
                  : "2px solid hsl(0 0% 10%)",
              }}
            >
              {tab === "buy" ? "Looking to Buy" : "Looking to Sell"}
            </button>
          ))}
        </div>

        {/* Form or Success */}
        {submitted ? (
          <div className="success-msg text-center py-20">
            <svg className="mx-auto mb-6" width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="23" stroke={GOLD} strokeWidth="1" />
              <path d="M14 24l7 7 13-13" stroke={GOLD_BRIGHT} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h2 className="text-2xl mb-3" style={{ fontFamily: SERIF, fontWeight: 200, color: "hsl(0 0% 92%)" }}>
              Inquiry Received
            </h2>
            <p className="text-sm" style={{ fontFamily: BODY, color: "hsl(0 0% 50%)" }}>
              Our private office will be in touch within 24 hours.
            </p>
          </div>
        ) : (
          <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-5 sm:gap-7">
            {fields.map((field) => (
              <div key={field.name}>
                <label className="block text-[10px] tracking-[0.35em] uppercase mb-2"
                  style={{ fontFamily: MONO, color: GOLD_BRIGHT }}>
                  {field.label}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    placeholder={field.placeholder}
                    rows={4}
                    required
                    style={{ ...inputStyle, resize: "vertical", minHeight: "120px" }}
                    onFocus={inputFocusHandler as unknown as React.FocusEventHandler<HTMLTextAreaElement>}
                    onBlur={inputBlurHandler as unknown as React.FocusEventHandler<HTMLTextAreaElement>}
                  />
                ) : field.type === "select" ? (
                  <select
                    name={field.name}
                    required
                    defaultValue=""
                    style={{ ...inputStyle, cursor: "pointer", appearance: "none",
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23a0956a' stroke-width='1.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat", backgroundPosition: "right 16px center",
                    }}
                    onFocus={inputFocusHandler as unknown as React.FocusEventHandler<HTMLSelectElement>}
                    onBlur={inputBlurHandler as unknown as React.FocusEventHandler<HTMLSelectElement>}
                  >
                    <option value="" disabled style={{ color: "hsl(0 0% 40%)" }}>
                      {field.placeholder}
                    </option>
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt} style={{ background: "hsl(0 0% 6%)", color: "hsl(0 0% 80%)" }}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    required
                    style={inputStyle}
                    onFocus={inputFocusHandler}
                    onBlur={inputBlurHandler}
                  />
                )}
              </div>
            ))}

            {/* Submit */}
            <button
              type="submit"
              className="group relative mt-4 py-4 overflow-hidden cursor-pointer"
              style={{
                fontFamily: MONO,
                fontSize: "0.7rem",
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                color: "hsl(0 0% 5%)",
                background: `linear-gradient(135deg, ${GOLD_HIGHLIGHT}, ${GOLD})`,
                border: "none",
                borderRadius: "2px",
              }}
            >
              <span className="relative z-10">Submit Inquiry</span>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(135deg, ${GOLD_BRIGHT}, ${GOLD_HIGHLIGHT})` }} />
            </button>

            <p className="text-center text-[10px] tracking-[0.15em] mt-1"
              style={{ fontFamily: MONO, color: "hsl(0 0% 35%)" }}>
              All inquiries are handled with the utmost discretion
            </p>
          </form>
        )}
      </div>

      {/* Bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, hsl(40 46% 56% / 0.1), transparent)" }} />
    </div>
  );
};

export default Contact;
