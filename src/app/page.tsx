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
    <div className="flex flex-col items-center overflow-x-hidden bg-slate-50">
      {/* Hero Section */}
      <section className="relative w-full h-[700px] flex items-center justify-center text-white overflow-hidden">
        <Image
          src="/hero-v2.png"
          alt="ОРИОН"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-blue-950/50 backdrop-blur-[2px]" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4 max-w-5xl"
        >
          <h1 className="text-5xl md:text-8xl font-black mb-6 drop-shadow-2xl tracking-tighter uppercase italic">
            ОРИОН
          </h1>
          <p className="text-2xl md:text-3xl font-bold mb-4 drop-shadow-md text-yellow-400">
            АНО ЦДО имени Бигаева Марата А.
          </p>
          <div className="w-24 h-1 bg-yellow-400 mx-auto mb-8 shadow-glow" />
          <p className="text-xl md:text-2xl font-semibold mb-10 drop-shadow-md max-w-3xl mx-auto leading-relaxed">
            Самый надежный и безопасный детский сад с углубленным патриотизмом и профессиональной подготовкой к жизни.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/apply"
              className="bg-yellow-400 text-blue-950 text-xl px-14 py-5 rounded-sm font-black hover:bg-white transition-all shadow-2xl uppercase tracking-widest border-b-4 border-yellow-600 active:border-b-0 active:translate-y-1"
            >
              Подать заявку
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
        className="container mx-auto px-4 py-24"
      >
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.h2 variants={itemVariants} className="text-4xl font-black mb-8 text-blue-950 uppercase tracking-tighter">
            Крепость образования и безопасности
          </motion.h2>
          <motion.p variants={itemVariants} className="text-xl text-gray-800 leading-relaxed font-medium">
            Мы — автономная некоммерческая организация центр дошкольного образования «ОРИОН» имени Бигаева Марата А. Наша миссия — воспитание сильного, образованного и преданного Родине поколения.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div variants={itemVariants} className="bg-white p-10 rounded-xl shadow-xl border-l-8 border-blue-900">
            <h3 className="text-2xl font-bold mb-4 text-blue-900 flex items-center">
              <span className="mr-3">🛡️</span> Максимальная защита
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Безопасность в нашем центре обеспечена усиленной охраной по прямому контракту с <strong>ЧВК «Вектор»</strong>. На территории оборудован <strong>усиленный бункер</strong>, способный обеспечить автономное жизнеобеспечение в любых ситуациях.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white p-10 rounded-xl shadow-xl border-l-8 border-yellow-400">
            <h3 className="text-2xl font-bold mb-4 text-blue-900 flex items-center">
              <span className="mr-3">⭐</span> Кадровый резерв
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Мы проводим тщательный подбор персонала. В «ОРИОНЕ» работают только те люди, которые <strong>готовы отдать жизнь за жизнь будущего поколения</strong>. Сотрудникам предприятия предоставляются льготы и выделяются приоритетные места для их детей.
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
