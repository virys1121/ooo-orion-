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
    <div className="flex flex-col items-center overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative w-full h-[600px] flex items-center justify-center text-white overflow-hidden">
        <Image
          src="/images/hero-bg.png"
          alt="ОРИОН"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-blue-900/40 backdrop-blur-[1px]" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4 max-w-4xl"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-lg tracking-tighter">
            Центр дошкольного обучения «ОРИОН»
          </h1>
          <p className="text-2xl md:text-3xl font-medium mb-8 drop-shadow-md text-yellow-400">
            имени Бигаева Марата А.
          </p>
          <p className="text-xl md:text-2xl font-light mb-10 drop-shadow-md max-w-2xl mx-auto">
            Элитное дошкольное образование с усиленным контуром безопасности и прикладной подготовкой к жизни.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/apply"
              className="bg-yellow-400 text-blue-900 text-xl px-12 py-4 rounded-full font-black hover:bg-yellow-300 transition-all shadow-2xl uppercase tracking-wider"
            >
              Записаться сейчас
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Info Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="container mx-auto px-4 py-24"
      >
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div variants={itemVariants}>
            <h2 className="text-4xl font-black mb-8 text-blue-900 border-l-8 border-yellow-400 pl-6">Наша философия</h2>
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              Мы не просто детский сад. Мы — крепость знаний и безопасности. В <strong>Центре дошкольного обучения «ОРИОН»</strong> мы совмещаем традиционное воспитание с углубленным патриотизмом и практической подготовкой к жизни.
            </p>
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              Наши воспитанники — это будущее поколение, готовое к любым вызовам современного мира. Мы уделяем внимание не только физическому, но и ментальному здоровью.
            </p>
            <p className="text-xl text-gray-700 leading-relaxed">
              Тщательный подбор персонала — наш приоритет. У нас работают люди, готовые отдать жизнь за жизнь будущего поколения.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white"
          >
            <Image
              src="https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=2070&auto=format&fit=crop"
              alt="Security and trust"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent p-8 flex flex-col justify-end">
              <h3 className="text-2xl font-bold text-white mb-2">Безопасность высшего уровня</h3>
              <p className="text-blue-100">Защита ЧВК «Вектор» и собственное убежище на территории.</p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Grid */}
      <section className="w-full bg-blue-900 py-24 text-white">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-4xl font-black text-center mb-16 uppercase tracking-widest"
          >
            Почему выбирают нас
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                title: "Полевая подготовка",
                desc: "Основы полевой подготовки и прикладного ориентирования для формирования стойкого характера.",
                icon: "🧭",
                img: "https://images.unsplash.com/photo-1533224383181-799f923e1e69?q=80&w=1974&auto=format&fit=crop"
              },
              {
                title: "Робототехника",
                desc: "Введение в мир технологий с использованием современных обучающих платформ.",
                icon: "🤖",
                img: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?q=80&w=2048&auto=format&fit=crop"
              },
              {
                title: "Патриотизм",
                desc: "Глубокое изучение истории и ценностей нашей Родины с самого детства.",
                icon: "🇷🇺",
                img: "https://images.unsplash.com/photo-1555169062-013468b47731?q=80&w=1974&auto=format&fit=crop"
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="bg-blue-800/50 rounded-2xl overflow-hidden border border-blue-700 hover:border-yellow-400 transition-all group"
              >
                <div className="relative h-48">
                  <Image src={feature.img} alt={feature.title} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                  <div className="absolute inset-0 bg-blue-900/40 group-hover:bg-transparent transition-all" />
                  <span className="absolute top-4 right-4 text-4xl bg-white/20 backdrop-blur p-2 rounded-lg">{feature.icon}</span>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-blue-100 leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          className="bg-yellow-400 p-16 rounded-[4rem] text-blue-900 shadow-2xl relative overflow-hidden"
        >
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black mb-6 uppercase">Будущее начинается здесь</h2>
            <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto font-medium">
              Сотрудникам предприятия предоставляются особые льготы и гарантированные места для детей.
            </p>
            <Link
              href="/apply"
              className="inline-block bg-blue-900 text-white text-xl px-12 py-5 rounded-full font-black hover:bg-black transition-all shadow-lg hover:shadow-2xl"
            >
              Стать частью ОРИОНА
            </Link>
          </div>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-yellow-300 rounded-full blur-3xl opacity-50" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white rounded-full blur-3xl opacity-30" />
        </motion.div>
      </section>
    </div>
  );
}
