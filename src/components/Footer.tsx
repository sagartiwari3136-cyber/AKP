import {
  Globe,
  Mail,
  ShieldCheck,
  Radio,
  ChevronRight,
  LayoutDashboard,
  Award,
} from 'lucide-react';
import { Category } from '../types';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  onSelectCategory: (category: Category | 'All') => void;
  onOpenNewsletterModal: () => void;
  onOpenCms: () => void;
  onOpenLiveFeed: () => void;
}

export function Footer({
  onSelectCategory,
  onOpenNewsletterModal,
  onOpenCms,
  onOpenLiveFeed,
}: FooterProps) {
  const categories: Category[] = [
    'देश',
    'शहर',
    'क्रिकेट',
    'विदेश',
    'कारोबार',
    'तकनीक',
    'मनोरंजन',
    'लाइफस्टाइल',
    'संपादकीय',
  ];

  return (
    <footer className="bg-[#0B1E1D] text-zinc-400 pt-16 pb-12 border-t-4 border-red-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-zinc-800">
          {/* Col 1: Brand & Credo (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center">
              <BrandLogo variant="badge" className="max-w-xs" />
            </div>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-hindi-brand">
              <strong>आज का प्रहरी (Aaj Ka Prahari - AKP News)</strong> निष्पक्ष, निर्भीक और सटीक पत्रकारिता के प्रति समर्पित एक अग्रणी राष्ट्रीय समाचार संस्थान है। राष्ट्रीय, अंतर्राष्ट्रीय, राजनीतिक, आर्थिक और सामाजिक सरोकारों पर बेबाक रिपोर्टिंग।
            </p>

            {/* National & Global Bureaus */}
            <div className="pt-2">
              <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-hindi-brand">
                <Globe className="w-3.5 h-3.5 text-red-500" />
                <span>प्रमुख संपादकीय ब्यूरो (Editorial Bureaus)</span>
              </div>
              <div className="text-xs text-zinc-300 grid grid-cols-2 gap-1 font-hindi-brand">
                <span>• नई दिल्ली (New Delhi Bureau)</span>
                <span>• लखनऊ (Lucknow Bureau)</span>
                <span>• मुंबई (Mumbai Bureau)</span>
                <span>• चंडीगढ़ / मोहाली (Punjab)</span>
                <span>• पटना (Patna Central)</span>
                <span>• भोपाल (Bhopal Desk)</span>
                <span>• जयपुर (Rajasthan)</span>
                <span>• लंदन / वाशिंगटन (Global)</span>
              </div>
            </div>
          </div>

          {/* Col 2: Desks & Sections (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 border-b border-zinc-800 pb-2 font-hindi-brand">
              संपादकीय डेस्क (News Desks)
            </h4>
            <ul className="space-y-1.5 text-xs font-hindi-brand">
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => onSelectCategory(cat)}
                    className="hover:text-amber-200 hover:translate-x-0.5 transition-all text-zinc-300 flex items-center gap-1.5 cursor-pointer"
                  >
                    <ChevronRight className="w-3 h-3 text-red-500" />
                    <span>{cat} डेस्क</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Live Wire & Features (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 border-b border-zinc-800 pb-2 font-hindi-brand">
              त्वरित सेवाएं (Services)
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenLiveFeed}
                  className="hover:text-amber-300 text-zinc-300 flex items-center gap-1.5 cursor-pointer text-left font-hindi-brand"
                >
                  <Radio className="w-3.5 h-3.5 text-red-500" />
                  <span>24x7 लाइव टीवी व बुलेटिन</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenNewsletterModal}
                  className="hover:text-amber-300 text-zinc-300 flex items-center gap-1.5 cursor-pointer text-left font-hindi-brand"
                >
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>दैनिक ई-न्यूज़लेटर सदस्यता</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenCms}
                  className="hover:text-amber-300 text-zinc-300 flex items-center gap-1.5 cursor-pointer text-left font-hindi-brand"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-amber-400" />
                  <span>संपादकीय सीएमएस (CMS Desk)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Editorial Standards & Trust (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 border-b border-zinc-800 pb-2 font-hindi-brand">
              विश्वसनीयता और मानक (Trust & Ethics)
            </h4>
            <div className="space-y-2 text-xs text-zinc-300 font-hindi-brand">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>प्रेस काउंसिल ऑफ इंडिया के पत्रकारिता आचार संहिता का पूर्ण अनुपालन।</span>
              </div>
              <div className="flex items-start gap-2">
                <Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>स्वतंत्र एवं निष्पक्ष फैक्ट-चेकिंग सेल द्वारा सत्यापित तथ्य।</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400 font-hindi-brand">
          <p>© 2026 आज का प्रहरी (AKP News Network Pvt. Ltd.) • सर्वाधिकार सुरक्षित।</p>
          <div className="flex items-center gap-4 text-[11px]">
            <a href="#" className="hover:text-white">गोपनीयता नीति</a>
            <span>•</span>
            <a href="#" className="hover:text-white">नियम एवं शर्तें</a>
            <span>•</span>
            <a href="#" className="hover:text-white">विज्ञापन नीति</a>
            <span>•</span>
            <a href="#" className="hover:text-white">हमसे संपर्क करें</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
