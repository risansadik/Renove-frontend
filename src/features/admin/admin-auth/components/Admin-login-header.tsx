import { ShieldCheck, Sparkles } from "lucide-react";

export const AdminLoginHeader = () => {
    return (
        <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-500/15 border border-brand-500/20 mb-4">
                <ShieldCheck size={22} className="text-brand-600" />
            </div>
            <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-lg bg-brand-500 flex items-center justify-center">
                    <Sparkles size={11} className="text-white" />
                </div>
                <span className="font-display font-bold text-lg text-brand-900">reNove</span>
            </div>
            <p className="text-brand-900/60 text-xs tracking-widest uppercase font-mono">Admin Portal</p>
        </div>
    );
};