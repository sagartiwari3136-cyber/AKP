import React, { useState } from 'react';
import {
  X,
  Mail,
  CheckCircle2,
  Bell,
  Sun,
  Cpu,
  TrendingUp,
  Leaf,
  Zap,
  Sparkles,
  ShieldCheck,
  Send,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { NewsletterPlan } from '../types';
import { api } from '../services/api';

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
  newsletters: NewsletterPlan[];
}

export function NewsletterModal({ isOpen, onClose, newsletters }: NewsletterModalProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([
    'akp-morning-briefing',
    'akp-breaking-flash',
  ]);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'breaking_only'>('daily');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const toggleNewsletter = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length === 1) return; // keep at least 1
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Sun':
        return <Sun className="w-5 h-5 text-amber-500" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-indigo-500" />;
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5 text-emerald-500" />;
      case 'Leaf':
        return <Leaf className="w-5 h-5 text-green-500" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-red-500" />;
      default:
        return <Mail className="w-5 h-5 text-zinc-500" />;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMessage('कृपया एक वैध ईमेल पता दर्ज करें।');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      await api.subscribeNewsletter({
        email: email.trim(),
        name: name.trim() || undefined,
        newsletters: selectedIds,
        frequency,
      });

      setIsSuccess(true);

      // Trigger confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#DC2626', '#F59E0B', '#10B981', '#3B82F6'],
        });
      } catch (err) {}
    } catch (error: any) {
      setErrorMessage(error.message || 'सदस्यता असफल रही। कृपया पुनः प्रयास करें।');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#FAF9F5] border border-zinc-300 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden font-hindi-brand">
        {/* Modal Header */}
        <div className="bg-[#0B1E1D] text-white px-6 py-4 flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/90 flex items-center justify-center border border-amber-400/40">
              <Mail className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                आज का प्रहरी • डिजिटल ई-न्यूज़लेटर सदस्यता
              </h2>
              <p className="text-xs text-zinc-300">
                हर सुबह का पहला विश्वस्त समाचार बुलेटिन सीधे आपके इनबॉक्स में
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {isSuccess ? (
            <div className="text-center py-8 px-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-emerald-300">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 mb-2">
                बधाई! आपकी सदस्यता सक्रिय हो गई है
              </h3>
              <p className="text-zinc-600 text-sm max-w-md mx-auto mb-6">
                हमने <strong className="text-zinc-900">{email}</strong> पर एक पुष्टि ईमेल भेजा है।
                अगला प्रातःकालीन बुलेटिन कल सुबह 6:00 बजे आपके इनबॉक्स में पहुंचेगा।
              </p>
              <div className="bg-white border border-zinc-200 rounded-xl p-4 max-w-sm mx-auto mb-6 text-left text-xs text-zinc-600 space-y-2">
                <div className="font-bold text-zinc-900">चयनित संस्करण:</div>
                <ul className="list-disc pl-4 space-y-1">
                  {selectedIds.map((id) => {
                    const plan = newsletters.find((n) => n.id === id);
                    return <li key={id}>{plan?.name || plan?.title || id}</li>;
                  })}
                </ul>
              </div>
              <button
                onClick={onClose}
                className="bg-red-700 hover:bg-red-800 text-white font-bold px-6 py-2.5 rounded-lg text-sm shadow-md transition-colors cursor-pointer"
              >
                खबरों पर वापस जाएं
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Select Editions */}
              <div>
                <label className="block text-xs font-bold text-zinc-900 uppercase tracking-wider mb-2">
                  1. अपनी पसंद के न्यूज़लेटर चुनें (कम से कम एक चुनें):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {newsletters.map((plan) => {
                    const isSelected = selectedIds.includes(plan.id);
                    return (
                      <div
                        key={plan.id}
                        onClick={() => toggleNewsletter(plan.id)}
                        className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex gap-3 ${
                          isSelected
                            ? 'border-red-600 bg-red-50/50 shadow-xs'
                            : 'border-zinc-200 bg-white hover:border-zinc-300'
                        }`}
                      >
                        <div className="shrink-0 mt-0.5">{getIconComponent(plan.icon)}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-zinc-900">{plan.name || plan.title}</h4>
                            <span className="text-[10px] font-mono-data text-red-700 font-bold bg-red-100 px-1.5 py-0.2 rounded">
                              {plan.schedule || plan.deliveryTime}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-600 line-clamp-2 mt-1">
                            {plan.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Delivery Frequency */}
              <div>
                <label className="block text-xs font-bold text-zinc-900 uppercase tracking-wider mb-2">
                  2. भेजने का अंतराल (Frequency):
                </label>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => setFrequency('daily')}
                    className={`py-2 px-3 rounded-lg border font-bold text-center transition-colors cursor-pointer ${
                      frequency === 'daily'
                        ? 'bg-red-700 text-white border-red-700'
                        : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
                    }`}
                  >
                    दैनिक (Daily)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFrequency('weekly')}
                    className={`py-2 px-3 rounded-lg border font-bold text-center transition-colors cursor-pointer ${
                      frequency === 'weekly'
                        ? 'bg-red-700 text-white border-red-700'
                        : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
                    }`}
                  >
                    साप्ताहिक (Weekly)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFrequency('breaking_only')}
                    className={`py-2 px-3 rounded-lg border font-bold text-center transition-colors cursor-pointer ${
                      frequency === 'breaking_only'
                        ? 'bg-red-700 text-white border-red-700'
                        : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
                    }`}
                  >
                    केवल ब्रेकिंग न्यूज़
                  </button>
                </div>
              </div>

              {/* User Details */}
              <div className="space-y-3 bg-white p-4 rounded-xl border border-zinc-200">
                <label className="block text-xs font-bold text-zinc-900 uppercase tracking-wider">
                  3. अपनी जानकारी दर्ज करें:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      placeholder="आपका नाम (वैकल्पिक)"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-2.5 text-xs text-zinc-900 focus:outline-hidden focus:border-red-600 focus:bg-white"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      required
                      placeholder="ईमेल पता (उदा: reader@gmail.com)"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-2.5 text-xs text-zinc-900 focus:outline-hidden focus:border-red-600 focus:bg-white"
                    />
                  </div>
                </div>

                {errorMessage && (
                  <p className="text-xs text-red-600 font-bold">{errorMessage}</p>
                )}

                <div className="flex items-center gap-2 text-[11px] text-zinc-500 pt-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>हम कभी स्पैम नहीं भेजते। आप किसी भी समय अनसब्सक्राइब कर सकते हैं।</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || selectedIds.length === 0}
                className="w-full bg-gradient-to-r from-red-700 via-red-600 to-red-700 hover:from-red-600 hover:to-red-500 text-white font-bold py-3 px-4 rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span>पंजीकरण हो रहा है...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>मुफ्त न्यूज़लेटर सदस्यता प्राप्त करें</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
