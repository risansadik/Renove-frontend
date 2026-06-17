export const TherapistLoginPanel = () => (
  <div>
    <p className="text-brand-400 text-sm font-mono mb-4 tracking-widest uppercase">Therapist portal</p>
    <h2 className="font-display text-4xl font-bold text-white leading-tight mb-6">
      Your dashboard<br />
      <span className="text-brand-400">awaits you.</span>
    </h2>
    <p className="text-white/50 text-base leading-relaxed">
      Access your consultation schedule, manage sessions, and connect with users on their recovery journey.
    </p>
    <div className="mt-10 p-4 bg-brand-500/5 border border-brand-500/15 rounded-xl">
      <p className="text-white/35 text-xs leading-relaxed">
        <span className="text-brand-400 font-medium">Note:</span> Only admin-approved therapists can log in.
        If your application is still under review, you'll receive an email once approved.
      </p>
    </div>
  </div>
);