import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, saveToken } from '../api/client.js'

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { token } = await login(username, password);
      saveToken(token);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sidebar flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <p className="font-body text-xs uppercase tracking-[0.2em] text-transit mb-2">
          City Transit
        </p>
        <h1 className="font-display text-3xl text-paper mb-8">Admin Console</h1>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            autoComplete="username"
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-paper placeholder:text-paper/40 font-body focus:outline-none focus:ring-2 focus:ring-transit"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-paper placeholder:text-paper/40 font-body focus:outline-none focus:ring-2 focus:ring-transit"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-transit text-paper font-body font-medium disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        {error && (
          <p className="mt-4 text-sm font-body text-signal">{error}</p>
        )}
      </div>
    </div>
  );
}