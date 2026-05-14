import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Check } from "lucide-react";
import { getCountries } from "libphonenumber-js";

// Basic flag emoji helper
const getFlagEmoji = (countryCode: string) => {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

// Simplified country names mapping (standard names for the library codes)
const countryNames: Record<string, string> = {
  IN: "India",
  US: "United States",
  GB: "United Kingdom",
  AU: "Australia",
  CA: "Canada",
  AE: "United Arab Emirates",
  SG: "Singapore",
  MY: "Malaysia",
  NZ: "New Zealand",
  DE: "Germany",
  FR: "France",
  ES: "Spain",
  IT: "Italy",
  IE: "Ireland",
  ZA: "South Africa",
  // Add more as needed or use an external list
};

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

  // Get all country codes from the library and map to our display format
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
      {label && <label className="label text-brand-900/40 uppercase tracking-widest text-[10px] font-bold mb-2 block">{label}</label>}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white dark:bg-brand-900 border-2 border-brand-500/10 rounded-2xl px-4 py-3.5 flex items-center justify-between text-left transition-all hover:border-brand-500/30 focus:ring-2 focus:ring-brand-500/20 ${error ? "border-red-500/30" : ""}`}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl leading-none">{getFlagEmoji(selectedCountry)}</span>
          <span className="text-sm font-bold text-brand-900 dark:text-white">
            {selectedCountry} 
            <span className="text-brand-900/40 dark:text-white/40 ml-1 font-medium italic">
              {countryNames[selectedCountry] || selectedCountry}
            </span>
          </span>
        </div>
        <ChevronDown size={16} className={`text-brand-900/20 dark:text-white/20 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute z-[110] left-0 right-0 top-[calc(100%+8px)] bg-white dark:bg-brand-950 border border-brand-500/20 rounded-2xl shadow-2xl overflow-hidden animate-fade-in ring-1 ring-brand-500/10">
          <div className="p-3 border-b border-brand-500/5 bg-brand-500/5 dark:bg-white/5 backdrop-blur-md">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-900/20 dark:text-white/20" />
              <input
                type="text"
                placeholder="Search countries..."
                className="w-full bg-white dark:bg-brand-900 border border-brand-500/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-brand-900 dark:text-white placeholder:text-brand-900/20 focus:ring-1 focus:ring-brand-500/30 outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto custom-scrollbar py-1">
            {filtered.map((country) => (
              <button
                key={country.code}
                type="button"
                onClick={() => {
                  onChange(country.code);
                  setIsOpen(false);
                  setSearch("");
                }}
                className={`w-full flex items-center justify-between px-4 py-3 hover:bg-brand-500/5 dark:hover:bg-white/5 transition-colors text-left ${value === country.code ? "bg-brand-500/10 dark:bg-white/10" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl leading-none">{country.flag}</span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-brand-900 dark:text-white">{country.code}</span>
                    <span className="text-[10px] text-brand-900/40 dark:text-white/40">{country.name}</span>
                  </div>
                </div>
                {value === country.code && <Check size={14} className="text-brand-500" />}
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="p-8 text-center text-xs text-brand-900/20 dark:text-white/20">No results found</div>
            )}
          </div>
        </div>
      )}

      {error && <p className="error-text mt-1 text-[10px]">{error}</p>}
    </div>
  );
};
