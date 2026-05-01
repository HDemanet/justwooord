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
      setError(err.response?.data?.error || "Erreur lors de l'import.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <style>{`
        input[type="file"]::file-selector-button {
          background: #1B2A4A;
          color: white;
          border: none;
          padding: 7px 14px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          margin-right: 12px;
          transition: opacity 0.2s;
        }
        input[type="file"]::file-selector-button:hover {
          opacity: 0.85;
        }
      `}</style>

      <div className="mb-6">
        <h1 className="text-xl font-semibold mb-1" style={{ color: '#1B2A4A' }}>Import Excel</h1>
        <p className="text-sm" style={{ color: '#9BA3AF' }}>Importe ton fichier vocabulaire_neerlandais.xlsx</p>
      </div>

      <div className="rounded-xl p-4 md:p-6 w-full" style={{ background: 'white', border: '1px solid #E2E8F4' }}>
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-xs uppercase tracking-wide mb-2" style={{ color: '#9BA3AF' }}>
              Fichier Excel (.xlsx)
            </label>
            <input
              type="file"
              accept=".xlsx"
              onChange={e => setFile(e.target.files[0])}
              className="w-full text-sm"
              style={{ color: '#4A5568' }}
            />
          </div>

          {error && (
            <p className="text-xs px-3 py-2 rounded-lg" style={{ color: '#92400E', background: '#FEF3C7' }}>
              {error}
            </p>
          )}

          {result && (
            <div className="rounded-lg p-4 space-y-1" style={{ background: '#EEF2FA', border: '1px solid #D0DCF0' }}>
              <p className="font-medium text-sm" style={{ color: '#1B2A4A' }}>{result.message}</p>
              <p className="text-sm" style={{ color: '#4A7FCB' }}>{result.imported} mots importés</p>
              {result.skipped > 0 && (
                <p className="text-sm" style={{ color: '#9BA3AF' }}>{result.skipped} ignorés</p>
              )}
              {result.errors?.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs mb-1" style={{ color: '#92400E' }}>Erreurs :</p>
                  {result.errors.map((e, i) => (
                    <p key={i} className="text-xs" style={{ color: '#B45309' }}>{e}</p>
                  ))}
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={!file || loading}
            className="w-full text-sm font-medium py-2.5 rounded-lg transition-opacity hover:opacity-90 disabled:opacity-40"
            style={{ background: '#1B2A4A', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            {loading ? 'Import en cours...' : 'Importer'}
          </button>
        </form>
      </div>
    </Layout>
  )
}
