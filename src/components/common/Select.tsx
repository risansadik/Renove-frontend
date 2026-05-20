import { useState, useRef, useEffect, forwardRef, Children, isValidElement } from "react";
import { ChevronDown, Check, AlertCircle } from "lucide-react";
import type { SelectHTMLAttributes, ReactElement } from "react";

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
      <div className={`w-full ${className}`} ref={containerRef}>
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
