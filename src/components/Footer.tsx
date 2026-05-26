import Link from "next/link";
import { Shield, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-24 pb-12 border-t-8 border-yellow-400">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-16">
          <div className="space-y-6">
            <Link href="/" className="flex items-center space-x-3 group">
              <Shield className="w-10 h-10 text-yellow-400" />
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tighter leading-none">ОРИОН</span>
                <span className="text-[10px] uppercase tracking-widest text-yellow-400 font-bold">имени Бигаева М.А.</span>
              </div>
            </Link>
            <p className="text-gray-400 leading-relaxed font-medium">
              Формируем будущее через безопасность, дисциплину и современные технологии. Самый надежный выбор для вашего ребенка.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Twitter, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="bg-gray-800 p-3 rounded-full hover:bg-yellow-400 hover:text-blue-900 transition-all">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-8 border-b-2 border-yellow-400 pb-2 inline-block">Навигация</h3>
            <ul className="space-y-4 font-medium">
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Главная</Link></li>
              <li><Link href="/events" className="text-gray-400 hover:text-white transition-colors">Островок событий</Link></li>
              <li><Link href="/apply" className="text-gray-400 hover:text-white transition-colors">Поступление</Link></li>
              <li><Link href="/auth/signin" className="text-gray-400 hover:text-white transition-colors">Личный кабинет</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-8 border-b-2 border-yellow-400 pb-2 inline-block">Спец. разделы</h3>
            <ul className="space-y-4 font-medium">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Робототехника</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Курс выживания</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Безопасность (Вектор)</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Для сотрудников</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-8 border-b-2 border-yellow-400 pb-2 inline-block">Контакты</h3>
            <ul className="space-y-6 font-medium">
              <li className="flex items-start space-x-4">
                <MapPin className="w-6 h-6 text-yellow-400 shrink-0" />
                <span className="text-gray-400">ул. Безопасности, д. 1, <br/>сектор «Орион»</span>
              </li>
              <li className="flex items-center space-x-4">
                <Phone className="w-6 h-6 text-yellow-400 shrink-0" />
                <span className="text-gray-400">+7 (999) 000-00-00</span>
              </li>
              <li className="flex items-center space-x-4">
                <Mail className="w-6 h-6 text-yellow-400 shrink-0" />
                <span className="text-gray-400">info@orion-center.ru</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-gray-800 text-center text-gray-500 text-sm font-bold uppercase tracking-widest">
          © {new Date().getFullYear()} АНО ЦДО «ОРИОН» ИМЕНИ БИГАЕВА М.А. ВСЕ ПРАВА ЗАЩИЩЕНЫ.
        </div>
      </div>
    </footer>
  );
}
