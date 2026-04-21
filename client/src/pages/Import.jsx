import { useState } from 'react'
import Layout from '../components/Layout'
import axios from 'axios'

export default function Import() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) return
    setLoading(true)
    setError(null)
    setResult(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const token = localStorage.getItem('jwt_token')
      const res = await axios.post('/api/v1/import', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      setResult(res.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de l\'import.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-xl font-medium text-gray-900">Import Excel</h1>
        <p className="text-sm text-gray-400 mt-1">Importe ton fichier vocabulaire_neerlandais.xlsx</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl p-6 max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1.5">
              Fichier Excel (.xlsx)
            </label>
            <input
              type="file"
              accept=".xlsx"
              onChange={e => setFile(e.target.files[0])}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 transition-colors"
            />
          </div>

          <div className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3 space-y-1">
            <p>Le fichier doit contenir les onglets de ton tableau existant.</p>
            <p>Les mots déjà présents seront ignorés automatiquement.</p>
          </div>

          {error && <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">{error}</p>}

          {result && (
            <div className="text-sm bg-teal-50 rounded-lg p-4 space-y-1">
              <p className="font-medium text-teal-700">{result.message}</p>
              <p className="text-teal-600">{result.imported} mots importés</p>
              {result.skipped > 0 && <p className="text-gray-500">{result.skipped} ignorés</p>}
              {result.errors?.length > 0 && (
                <div className="mt-2">
                  <p className="text-amber-600 text-xs">Erreurs :</p>
                  {result.errors.map((e, i) => <p key={i} className="text-xs text-amber-500">{e}</p>)}
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={!file || loading}
            className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            {loading ? 'Import en cours...' : 'Importer'}
          </button>
        </form>
      </div>
    </Layout>
  )
}
