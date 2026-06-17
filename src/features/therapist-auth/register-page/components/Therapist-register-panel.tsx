export const TherapistRegisterPanel = () => (
  <div>
    <p className="text-brand-400 text-sm font-mono mb-4 tracking-widest uppercase">For therapists</p>
    <h2 className="font-display text-4xl font-bold text-white leading-tight mb-6">
      Join our network of <span className="text-brand-400">recovery experts.</span>
    </h2>
    <p className="text-white/50 text-base leading-relaxed mb-10">
      Help users on their journey to freedom. Our admin team reviews every application
      to maintain the quality of our platform.
    </p>
    <div className="flex flex-col gap-3">
      {[
        "Submit your credentials & qualifications",
        "Admin reviews your application",
        "Get approved and go live",
        "Manage sessions from your dashboard",
      ].map((step, i) => (
        <div key={i} className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-brand-400 text-xs font-bold">{i + 1}</span>
          </div>
          <span className="text-white/50 text-sm">{step}</span>
        </div>
      ))}
    </div>
  </div>
);