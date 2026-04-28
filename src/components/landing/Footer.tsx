import { motion } from "framer-motion";
import { PawPrint, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="bg-primary text-white pt-20 pb-10">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <PawPrint className="h-10 w-10 text-secondary" strokeWidth={2.5} />
              <span className="font-black text-3xl tracking-tight">عالم الفهود</span>
            </div>
            <p className="text-white/70 text-lg leading-relaxed max-w-md mb-8 font-medium">
              حركة شبابية عالمية تهدف إلى تمكين الشباب وبناء قادة المستقبل. نؤمن بأن كل شاب يمتلك القدرة على تغيير العالم.
            </p>
            <div className="flex gap-4">
              {/* Social icons placeholders */}
              {[1, 2, 3, 4].map((i) => (
                <a key={i} href="#" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary transition-colors">
                  <div className="w-5 h-5 bg-white/50 rounded-sm" />
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-xl font-bold mb-6 text-secondary">روابط سريعة</h4>
            <ul className="space-y-4 text-lg font-medium text-white/80">
              <li><a href="#" className="hover:text-white transition-colors">من نحن</a></li>
              <li><a href="#" className="hover:text-white transition-colors">ما نقوم به</a></li>
              <li><a href="#" className="hover:text-white transition-colors">المخيم العالمي</a></li>
              <li><a href="#" className="hover:text-white transition-colors">التطوع</a></li>
              <li><a href="#" className="hover:text-white transition-colors">اتصل بنا</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-xl font-bold mb-6 text-secondary">تواصل معنا</h4>
            <ul className="space-y-4 text-lg font-medium text-white/80">
              <li className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-accent" />
                <span>المركز الكشفي العالمي</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-accent" />
                <span dir="ltr">info@cheetahscity.org</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-accent" />
                <span dir="ltr">+41 22 705 10 10</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-white/60 font-medium">
          <p>© ٢٠٢٤ عالم الفهود الكشفي والإرشادي. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-2 text-sm">
            <span>في إطار حركة عالمية</span>
            <PawPrint className="h-4 w-4 text-white/40" />
          </div>
        </div>
      </div>
    </footer>
  );
}
