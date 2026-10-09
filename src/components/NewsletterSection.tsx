import React, { useState } from 'react';
import { Mail, CheckCircle2, ShieldCheck, Sparkles, Send } from 'lucide-react';
import confetti from 'canvas-confetti';
import { NewsletterPlan } from '../types';
import { api } from '../services/api';

interface NewsletterSectionProps {
  newsletters: NewsletterPlan[];
  onOpenModal: () => void;
}

export function NewsletterSection({ newsletters, onOpenModal }: NewsletterSectionProps) {
  const [email, setEmail] = useState('');
  const [selectedNewsletter, setSelectedNewsletter] = useState<string>('akp-morning-briefing');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleQuickSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setIsLoading(true);
    try {
      await api.subscribeNewsletter({
        email: email.trim(),
        newsletters: [selectedNewsletter],
        frequency: 'daily',
      });
      setIsSubscribed(true);
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.8 },
        });
      } catch (err) {}
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="my-12 bg-gradient-to-br from-[#1C1D21] via-[#2B1216] to-[#1C1D21] text-white rounded-2xl p-6 sm:p-10 shadow-xl border border-red-950/80 relative overflow-hidden">
      {/* Decorative subtle background elements */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-red-800/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-1.5 bg-red-950/90 text-amber-300 border border-amber-400/40 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 font-hindi-brand">
          <Mail className="w-3.5 h-3.5 text-amber-400" />
          <span>आज का प्रहरी • दैनिक ई-संस्करण व न्यूज़लेटर</span>
        </div>

        <h2 className="font-hindi-brand text-2xl sm:text-4xl font-bold tracking-tight text-white mb-3">
          सटीक, निर्भीक और ताज़ा खबरों से रहें हमेशा अपडेट
        </h2>

        <p className="text-zinc-300 text-sm sm:text-base max-w-2xl mx-auto mb-8 leading-relaxed font-hindi-brand">
          देश और दुनिया की प्रमुख राजनीतिक, आर्थिक, तकनीकी और जन-सरोकारीय खबरों का विशेष विश्लेषण प्रतिदिन सुबह सीधे आपके इनबॉक्स में।
        </p>

        {isSubscribed ? (
          <div className="bg-emerald-950/50 border border-emerald-700/80 rounded-xl p-6 max-w-lg mx-auto flex items-center justify-center gap-3 text-emerald-300 font-hindi-brand">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div className="text-left text-xs sm:text-sm">
              <span className="font-bold text-white block">आपकी सदस्यता सफलतापूर्वक सक्रिय हो गई है!</span>
              <span>पहला संस्करण कल सुबह आपके इनबॉक्स में पहुंच जाएगा।</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleQuickSubscribe} className="max-w-xl mx-auto space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="अपना ईमेल पता दर्ज करें (Enter your email)..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 bg-black/40 border border-zinc-700 text-white placeholder:text-zinc-400 rounded-lg px-4 py-3 text-xs sm:text-sm focus:outline-hidden focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-hindi-brand"
              />

              <button
                type="submit"
                disabled={isLoading || !email}
                className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 font-extrabold text-xs sm:text-sm px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0 shadow-md font-hindi-brand disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isLoading ? 'जोड़ा जा रहा है...' : 'निःशुल्क सदस्यता लें'}</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-400 font-hindi-brand">
              <div className="flex items-center gap-1.5 text-zinc-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>१००% सुरक्षित एवं गोपनीयता संरक्षित</span>
              </div>
              <span>•</span>
              <button
                type="button"
                onClick={onOpenModal}
                className="text-amber-400 hover:text-amber-300 underline font-semibold cursor-pointer"
              >
                सभी ५ न्यूज़लेटर योजनाएं एवं समय सारणी देखें →
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
