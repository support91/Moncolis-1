export default function HomePage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          Welcome to Your Application
        </h2>
        <p className="text-lg text-slate-600 mb-6">
          Your application is now running successfully with Supabase integration.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">React + Vite</h3>
            <p className="text-sm text-blue-700">
              Fast development with hot module replacement
            </p>
          </div>
          <div className="p-6 bg-green-50 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-900 mb-2">Supabase</h3>
            <p className="text-sm text-green-700">
              Database and authentication ready
            </p>
          </div>
          <div className="p-6 bg-purple-50 rounded-lg border border-purple-200">
            <h3 className="font-semibold text-purple-900 mb-2">Tailwind CSS</h3>
            <p className="text-sm text-purple-700">
              Utility-first styling framework
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
