"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Award, Users, Target } from "lucide-react";

export default function AboutPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center text-white">
        <Image
          src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2040&auto=format&fit=crop"
          alt="Modern kindergarten building"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-blue-900/70" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl font-black mb-4">О нас</h1>
          <p className="text-xl max-w-2xl mx-auto font-medium">
            Центр дошкольного обучения «ОРИОН» — это место, где безопасность встречается с передовым образованием.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-black text-blue-900 mb-8 border-l-8 border-yellow-400 pl-6 uppercase">Наша история</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Центр дошкольного образования «ОРИОН» был основан с целью создания максимально защищенной и стимулирующей среды для развития детей. Мы носим имя Бигаева Марата А., человека, чьи принципы чести и преданности делу лежат в основе нашей философии.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              За годы работы мы превратились из экспериментальной площадки в эталонный образовательный центр, где каждый ребенок получает не только знания, но и важные жизненные навыки, необходимые в 21 веке.
            </p>
          </motion.div>
          <div className="relative h-[450px] rounded-[3rem] overflow-hidden shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1491333078588-55b6733c7de6?q=80&w=2070&auto=format&fit=crop"
              alt="Professional staff"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Achievements */}
        <div className="mb-32">
          <h2 className="text-4xl font-black text-center text-blue-900 mb-16 uppercase">Наши достижения</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { isLogo: true, title: "100% Безопасность", desc: "Ни одного инцидента за всю историю работы центра." },
              { icon: Award, title: "Лучшие методики", desc: "Авторские программы, одобренные ведущими экспертами." },
              { icon: Users, title: "500+ Выпускников", desc: "Наши дети успешно поступают в лучшие школы страны." },
              { icon: Target, title: "Высшая категория", desc: "Все сотрудники имеют высшую квалификационную категорию." }
            ].map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="bg-white p-8 rounded-3xl shadow-xl text-center border-b-8 border-yellow-400"
              >
                {stat.isLogo ? (
                  <div className="w-16 h-16 mx-auto mb-6 bg-white rounded-xl shadow-sm p-1 border border-gray-100 flex items-center justify-center">
                    <Image src="/logo.png" alt="ОРИОН" width={48} height={48} className="object-contain" />
                  </div>
                ) : stat.icon && (
                  <stat.icon className="w-12 h-12 text-blue-600 mx-auto mb-6" />
                )}
                <h3 className="text-xl font-bold mb-4">{stat.title}</h3>
                <p className="text-gray-600 text-sm">{stat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Staff Section */}
        <div>
          <h2 className="text-4xl font-black text-center text-blue-900 mb-16 uppercase">Наша команда</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                name: "Кортиева Лела Л.",
                role: "Главный секретарь",
                img: "/images/lela_kortieva.jpg",
                bio: "Обеспечивает безупречную координацию и административную поддержку центра."
              },
              {
                name: "Елена Бигаева",
                role: "Директор по образованию",
                img: "/images/bigaeva.png",
                bio: "Кандидат педагогических наук, автор методик раннего развития."
              },
              {
                name: "Алексей Романович Баграмов",
                role: "Главный инструктор по робототехнике",
                img: "/images/bagramov.png",
                bio: "Инженер-исследователь, победитель международных конкурсов."
              }
            ].map((person, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={itemVariants}
                className="group relative"
              >
                <div className="relative h-[400px] rounded-3xl overflow-hidden mb-6">
                  <Image src={person.img} alt={person.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8 text-white">
                    <p className="text-sm italic">{person.bio}</p>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-blue-900">{person.name}</h3>
                <p className="text-blue-600 font-semibold">{person.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-blue-900 py-24 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-black mb-8">Нам доверяют самое ценное</h2>
          <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all">
            {/* Placeholder for partner logos */}
            <span className="text-2xl font-black italic">ЧВК ВЕКТОР</span>
            <span className="text-2xl font-black italic">ТЕХНО-МИР</span>
            <span className="text-2xl font-black italic">ИНФО-ГАРД</span>
            <span className="text-2xl font-black italic">БЕЗОПАСНЫЙ ГОРОД</span>
          </div>
        </div>
      </section>
    </div>
  );
}
