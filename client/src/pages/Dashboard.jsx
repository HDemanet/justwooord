import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-xl font-medium text-gray-900">Bonjour, {user?.name}</h1>
        <p className="text-sm text-gray-400 mt-1">
          {new Date().toLocaleDateString('fr-BE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { num: '0', label: 'à réviser aujourd\'hui' },
          { num: '0', label: 'mots maîtrisés' },
          { num: '0', label: 'en apprentissage' },
        ].map(({ num, label }) => (
          <div key={label} className="bg-gray-50 rounded-lg p-4">
            <div className="text-2xl font-medium text-teal-600">{num}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wide mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-100 rounded-xl p-5">
        <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4">Session du jour</div>
        <p className="text-sm text-gray-500 mb-4">Aucun mot à réviser pour l'instant. Commence par ajouter du vocabulaire.</p>
        <a href="/ajouter" className="inline-block bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors">
          Ajouter un mot
        </a>
      </div>
    </Layout>
  )
}
