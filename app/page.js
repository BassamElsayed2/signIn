export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center p-8">
      <h1 className="text-4xl font-bold mb-4 text-blue-700">مرحبًا بك!</h1>
      <p className="text-lg mb-6">نظام تسجيل حضور الموظفين باستخدام الموقع الجغرافي</p>
      <a
        href="/user"
        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
      >
        ابدأ تسجيل الحضور
      </a>
    </main>
  );
}
