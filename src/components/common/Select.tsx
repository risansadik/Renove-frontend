import { useState, useRef, useEffect, forwardRef, Children, isValidElement } from "react";
import { Search, ChevronDown, Check, AlertCircle } from "lucide-react";
import { getCountries } from "libphonenumber-js";
import type { SelectHTMLAttributes, ReactElement } from "react";

const getFlagEmoji = (countryCode: string) => {
  if (!countryCode) return "🏳️";
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  try {
    return String.fromCodePoint(...codePoints);
  } catch {
    return "🏳️";
  }
};

const countryNames: Record<string, string> = {
  IN: "India", US: "United States", GB: "United Kingdom", AU: "Australia",
  CA: "Canada", AE: "United Arab Emirates", SG: "Singapore", MY: "Malaysia",
  NZ: "New Zealand", DE: "Germany", FR: "France", ES: "Spain", IT: "Italy",
  IE: "Ireland", ZA: "South Africa"
};

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  error?: string;
  value?: string;
  placeholder?: string;
  onChange?: (e: { target: { name?: string; value: string } }) => void;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, className = "", id, children, value, onChange, placeholder = "Select option", ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    // Extract options from children
    const options = Children.toArray(children).map((child) => {
      if (isValidElement(child)) {
        const element = child as ReactElement<{ value: string; children: string }>;
        return {
          value: element.props.value,
          label: element.props.children,
        };
      }
      return null;
    }).filter(Boolean) as { value: string; label: string }[];

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
      <div className="w-full" ref={containerRef}>
        {label && (
          <label className="label block mb-2 text-brand-900/40 dark:text-white/40 uppercase tracking-widest text-[10px] font-bold">
            {label}
          </label>
        )}
        <div className="relative">
          {/* Hidden native select for form accessibility/react-hook-form */}
          <select
            ref={ref}
            id={selectId}
            value={value ?? ""}
            className="sr-only"
            onChange={(e) => onChange?.({ target: { name: props.name, value: e.target.value } })}
            {...props}
          >
            {children}
          </select>

          {/* Custom Trigger */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 1.25rem',
              height: '56px',
              borderRadius: '0.75rem',
              border: `1px solid ${error ? 'rgba(239,68,68,0.4)' : isOpen ? 'var(--accent-primary)' : 'var(--border-default)'}`,
              backgroundColor: isOpen ? 'var(--bg-card)' : 'var(--bg-input)',
              color: 'var(--fg-primary)',
              boxShadow: isOpen ? '0 0 0 3px var(--accent-glow)' : 'none',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <span style={{ fontSize: '0.875rem', color: selectedOption ? 'var(--fg-primary)' : 'var(--fg-muted)' }}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <ChevronDown className={`transition-transform duration-300 text-brand-500 ${isOpen ? 'rotate-180' : ''}`} size={18} />
          </button>

          {/* Custom Dropdown Panel */}
          {isOpen && (
            <div style={{
              position: 'absolute',
              zIndex: 100,
              width: '100%',
              marginTop: '8px',
              padding: '8px 0',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-default)',
              borderRadius: '0.75rem',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            }}>
              <div className="max-h-[240px] overflow-y-auto custom-scrollbar">
                {options.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange?.({ target: { name: props.name, value: opt.value } });
                      setIsOpen(false);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1.25rem',
                      fontSize: '0.875rem',
                      backgroundColor: value === opt.value ? 'var(--accent-glow)' : 'transparent',
                      color: value === opt.value ? 'var(--accent-primary)' : 'var(--fg-primary)',
                      fontWeight: value === opt.value ? 600 : 400,
                      cursor: 'pointer',
                      transition: 'background 0.15s ease',
                      border: 'none',
                      textAlign: 'left',
                    }}
                    onMouseEnter={e => { if (value !== opt.value) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--nav-bg-hover)'; }}
                    onMouseLeave={e => { if (value !== opt.value) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; }}
                  >
                    {opt.label}
                    {value === opt.value && <Check size={16} className="animate-in zoom-in duration-300" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {error && (
          <p className="flex items-center gap-1 mt-2 text-[11px] font-medium text-red-500 animate-in fade-in slide-in-from-top-1">
            <AlertCircle size={12} />
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

interface CountrySelectorProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const CountrySelector = ({ label, value, onChange, error }: CountrySelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedCountry = value || "IN";

  const allCountries = getCountries().map(code => ({
    code,
    name: countryNames[code] || code,
    flag: getFlagEmoji(code)
  })).sort((a, b) => a.name.localeCompare(b.name));

  const filtered = allCountries.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full relative" ref={containerRef}>
      {label && <label className="label text-brand-900/40 dark:text-white/40 uppercase tracking-widest text-[10px] font-bold mb-2 block">{label}</label>}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-slate-50 dark:bg-white/5 border-2 border-slate-200 dark:border-white/10 rounded-2xl px-5 h-[56px] flex items-center justify-between text-left transition-all hover:border-brand-500/30 focus:ring-4 focus:ring-brand-500/10 ${isOpen ? 'border-brand-500 shadow-xl' : ''} ${error ? "border-red-500/30" : ""}`}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl leading-none mr-1">{getFlagEmoji(selectedCountry)}</span>
          <span className="text-sm font-bold text-slate-900 dark:text-white">{selectedCountry}</span>
          <span className="text-xs text-slate-500 dark:text-white/40 font-medium italic truncate max-w-[80px]">
            ({countryNames[selectedCountry] || selectedCountry})
          </span>
        </div>
        <ChevronDown size={18} className={`text-brand-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute z-[110] left-0 right-0 top-[calc(100%+8px)] bg-white/95 dark:bg-brand-900/95 backdrop-blur-xl border border-brand-500/20 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-3 border-b border-brand-500/5 bg-brand-500/5 dark:bg-white/5">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-500/40" />
              <input
                type="text"
                placeholder="Search country..."
                className="w-full bg-white dark:bg-brand-900 border border-brand-500/10 rounded-xl pl-9 pr-3 py-2 text-sm text-brand-900 dark:text-white placeholder:text-brand-900/20 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto custom-scrollbar py-2">
            {filtered.map((country) => (
              <button
                key={country.code}
                type="button"
                onClick={() => {
                  onChange(country.code);
                  setIsOpen(false);
                  setSearch("");
                }}
                className={`w-full flex items-center justify-between px-5 py-3 hover:bg-brand-500/5 dark:hover:bg-white/5 transition-colors text-left ${value === country.code ? "bg-brand-500/10 text-brand-500 font-bold" : "text-brand-900 dark:text-white"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl leading-none">{country.flag}</span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold">{country.code}</span>
                    <span className="text-[10px] opacity-60 uppercase tracking-tighter">{country.name}</span>
                  </div>
                </div>
                {value === country.code && <Check size={16} />}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && (
        <p className="flex items-center gap-1 mt-2 text-[11px] font-medium text-red-500">
          <AlertCircle size={12} />
          {error}
        </p>
      )}
    </div>
  );
};
