"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="flex flex-col items-center overflow-x-hidden bg-gray-50">
      {/* Hero Section */}
      <section className="relative w-full h-[85vh] flex items-center justify-center text-white overflow-hidden">
        <Image
          src="/hero-v2.png"
          alt="ОРИОН"
          fill
          className="object-cover scale-110"
          priority
        />
        <div className="absolute inset-0 bg-blue-950/60 backdrop-blur-[4px]" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4 max-w-6xl"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <Image src="/logo-orion.png" alt="Logo" width={120} height={120} className="mx-auto bg-white p-4 rounded-[2.5rem] shadow-2xl" />
          </motion.div>
          <h1 className="text-6xl md:text-9xl font-black mb-4 drop-shadow-2xl tracking-tighter uppercase italic leading-none">
            ОРИОН
          </h1>
          <p className="text-2xl md:text-3xl font-black mb-8 drop-shadow-md text-yellow-400 uppercase tracking-[0.2em]">
            имени Бигаева Марата А.
          </p>
          <p className="text-xl md:text-3xl font-bold mb-12 drop-shadow-md max-w-4xl mx-auto leading-relaxed opacity-90">
            Самый надежный и безопасный детский сад с углубленным патриотизмом и профессиональной подготовкой к жизни.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-wrap justify-center gap-6"
          >
            <Link
              href="/apply"
              className="bg-yellow-400 text-blue-950 text-xl px-16 py-6 rounded-2xl font-black hover:bg-white transition-all shadow-2xl uppercase tracking-widest border-b-4 border-yellow-600 active:border-b-0 active:translate-y-1"
            >
              Подать заявку
            </Link>
            <Link
              href="/about"
              className="bg-white/10 backdrop-blur-md text-white text-xl px-16 py-6 rounded-2xl font-black hover:bg-white/20 transition-all shadow-2xl uppercase tracking-widest border border-white/20"
            >
              О центре
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Philosophy & Security */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="container mx-auto px-4 py-32"
      >
        <div className="max-w-5xl mx-auto text-center mb-24">
          <motion.div variants={itemVariants} className="bg-blue-900 text-white inline-block px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6 shadow-xl">
            Наши ценности
          </motion.div>
          <motion.h2 variants={itemVariants} className="text-5xl md:text-7xl font-black mb-10 text-blue-900 uppercase tracking-tighter leading-none">
            Крепость образования <br /> и безопасности
          </motion.h2>
          <motion.p variants={itemVariants} className="text-2xl text-gray-600 leading-relaxed font-medium max-w-4xl mx-auto">
            Мы — автономная некоммерческая организация центр дошкольного образования «ОРИОН». Наша миссия — воспитание сильного и преданного Родине поколения.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div variants={itemVariants} className="bg-white p-12 rounded-[3rem] shadow-2xl shadow-blue-900/10 border border-gray-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-900/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
            <h3 className="text-3xl font-black mb-6 text-blue-900 flex items-center gap-4">
              <span className="bg-blue-100 p-3 rounded-2xl">🛡️</span> Максимальная защита
            </h3>
            <p className="text-gray-600 leading-relaxed text-lg font-medium">
              Безопасность обеспечена усиленной охраной по контракту с <strong className="text-blue-900">ЧВК «Вектор»</strong>. На территории оборудован <strong className="text-blue-900">усиленный бункер</strong> для автономного жизнеобеспечения.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white p-12 rounded-[3rem] shadow-2xl shadow-blue-900/10 border border-gray-100 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
            <h3 className="text-3xl font-black mb-6 text-blue-900 flex items-center gap-4">
              <span className="bg-yellow-100 p-3 rounded-2xl">⭐</span> Кадровый резерв
            </h3>
            <p className="text-gray-600 leading-relaxed text-lg font-medium">
              Тщательный подбор персонала. У нас работают только те, кто <strong className="text-blue-900">готов отдать жизнь за будущее поколения</strong>. Сотрудникам предоставляются особые льготы.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Program Details */}
      <section className="w-full bg-blue-950 py-24 text-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            <motion.div
              whileHover={{ y: -10 }}
              className="space-y-4"
            >
              <div className="text-5xl mb-6">🏕️</div>
              <h3 className="text-2xl font-bold text-yellow-400">Выживание в дикой местности</h3>
              <p className="text-blue-100/80 leading-relaxed">
                Для учеников постарше проводятся регулярные уроки по выживанию в дикой местности, ориентированию и оказанию первой помощи.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -10 }}
              className="space-y-4"
            >
              <div className="text-5xl mb-6">🦾</div>
              <h3 className="text-2xl font-bold text-yellow-400">Робототехника и IT</h3>
              <p className="text-blue-100/80 leading-relaxed">
                Вводные уроки робототехники и программирования формируют аналитический склад ума и готовят к технологическому будущему.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -10 }}
              className="space-y-4"
            >
              <div className="text-5xl mb-6">🧬</div>
              <h3 className="text-2xl font-bold text-yellow-400">Комплексный контроль</h3>
              <p className="text-blue-100/80 leading-relaxed">
                Мы строго следим за образованием, качественным питанием, а также физическим и ментальным здоровьем каждого воспитанника.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="container mx-auto px-4 py-24 text-center">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          className="bg-white border-4 border-blue-900 p-12 md:p-20 rounded-sm shadow-[20px_20px_0px_0px_rgba(30,58,138,1)]"
        >
          <h2 className="text-4xl font-black mb-6 text-blue-950 uppercase tracking-tighter">Набор в группы открыт</h2>
          <p className="text-xl mb-12 text-gray-700 max-w-2xl mx-auto">
            Обеспечьте своему ребенку надежное будущее в самом защищенном образовательном центре страны.
          </p>
          <Link
            href="/apply"
            className="inline-block bg-blue-900 text-white text-xl px-16 py-6 rounded-sm font-black hover:bg-yellow-400 hover:text-blue-900 transition-all shadow-lg uppercase"
          >
            Подать заявление на поступление
          </Link>
        </motion.div>
      </section>

      <style jsx global>{`
        .shadow-glow {
          box-shadow: 0 0 15px rgba(250, 204, 21, 0.5);
        }
      `}</style>
    </div>
  );
}
