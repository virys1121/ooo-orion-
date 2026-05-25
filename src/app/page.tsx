import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full bg-blue-600 text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          АНО ЦДО «ОРИОН» имени Бигаева М.А.
        </h1>
        <p className="text-xl md:text-2xl max-w-3xl mx-auto">
          Самый надежный и безопасный детский сад с углубленным патриотизмом и подготовкой к жизни.
        </p>
      </section>

      {/* Info Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-blue-800">О нашей организации</h2>
            <p className="text-lg text-gray-700 mb-4">
              Мы — автономная некоммерческая организация центр дошкольного образования ОРИОН имени Бигаева Марата А.
              Наша миссия — не просто присмотр за детьми, а формирование сильных, подготовленных к любым жизненным вызовам личностей.
            </p>
            <p className="text-lg text-gray-700 mb-4">
              Мы являемся самым надежным и безопасным детским садом с углубленным патриотизмом, а также введением и подготовкой к школе и дальнейшей жизни ребенка.
            </p>
          </div>
          <div className="bg-blue-50 p-8 rounded-2xl shadow-inner border border-blue-100">
            <h3 className="text-2xl font-bold mb-4 text-blue-900">Безопасность высшего уровня</h3>
            <ul className="space-y-4 text-gray-800">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">🛡️</span>
                <span>Усиленная охрана путем заключения контракта с <strong>ЧВК «Вектор»</strong>.</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">🛖</span>
                <span>На территории присутствует <strong>усиленный бункер</strong> для максимальной защиты.</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">👤</span>
                <span>Тщательный подбор персонала. У нас работают люди, готовые отдать жизнь за жизнь будущего поколения.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Что мы предлагаем</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="text-4xl mb-4">🌳</div>
              <h3 className="text-xl font-bold mb-2">Выживание</h3>
              <p className="text-gray-600">Уроки по выживанию в дикой местности для учеников постарше. Закаляем характер и навыки.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold mb-2">Робототехника</h3>
              <p className="text-gray-600">Вводные уроки робототехники и современных технологий для развития технического мышления.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="text-4xl mb-4">🥗</div>
              <h3 className="text-xl font-bold mb-2">Здоровье и питание</h3>
              <p className="text-gray-600">Строго следим за образованием детей, а также их питанием и физическим и ментальным здоровьем.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-8">Льготы для сотрудников</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          Сотрудникам, работающим на предприятии, даются льготы и выделяются места для их детей. Мы ценим нашу команду.
        </p>
        <div className="mt-8">
          <Link
            href="/apply"
            className="bg-blue-600 text-white text-xl px-10 py-4 rounded-full font-bold hover:bg-blue-700 transition-colors shadow-lg"
          >
            Подать заявку на поступление
          </Link>
        </div>
      </section>
    </div>
  );
}
