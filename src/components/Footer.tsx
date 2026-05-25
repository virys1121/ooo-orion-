export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4 text-center">
        <p className="mb-2">&copy; {new Date().getFullYear()} АНО ЦДО «ОРИОН» имени Бигаева М.А.</p>
        <p className="text-gray-400 text-sm">Самый надежный и безопасный детский сад</p>
      </div>
    </footer>
  );
}
