'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[Milltrack] Dashboard error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4 text-white">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-red-500/10 border border-red-500/30">
        <AlertTriangle className="w-8 h-8 text-red-400" />
      </div>

      <div className="text-center max-w-md">
        <h2 className="text-xl font-bold mb-2">Une erreur est survenue</h2>
        <p className="text-sm text-white/60 leading-relaxed">
          {error.message || 'Impossible de charger cette section. Veuillez réessayer.'}
        </p>
        {error.digest && (
          <p className="text-xs mt-2 font-mono text-white/30">Code: {error.digest}</p>
        )}
      </div>

      <button
        onClick={reset}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-amber-500 text-black hover:bg-amber-400 transition-colors"
      >
        <RefreshCw className="w-4 h-4" />
        Réessayer
      </button>
    </div>
  );
}
