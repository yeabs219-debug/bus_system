import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { payByQR } from '../api/client';

const SCANNER_ID = 'qr-scanner-region';

export default function ScanPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const route = state?.route;

  const scannerRef = useRef(null);
  const isRunningRef = useRef(false);
  const processingRef = useRef(false);
  const [status, setStatus] = useState('starting');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let cancelled = false;
    const scanner = new Html5Qrcode(SCANNER_ID);
    scannerRef.current = scanner;

    const handleDecoded = async (decodedText) => {
      if (processingRef.current) return;
      processingRef.current = true;
      setStatus('charging');

      if (isRunningRef.current) {
        try {
          await scanner.stop();
          isRunningRef.current = false;
        } catch (_) {}
      }

      try {
        const ticket = await payByQR(decodedText);
        navigate('/ticket', { state: { ticket, route } });
      } catch (err) {
        setErrorMsg(err.message || 'Payment failed. Try scanning again.');
        setStatus('error');
        processingRef.current = false;
      }
    };

    scanner
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 230, height: 230 } },
        handleDecoded,
        () => {}
      )
      .then(() => {
        if (cancelled) {
          scanner.stop().catch(() => {});
          return;
        }
        isRunningRef.current = true;
        setStatus('scanning');
      })
      .catch(() => {
        setErrorMsg('Camera access was denied or is unavailable.');
        setStatus('error');
      });

    return () => {
      cancelled = true;
      if (isRunningRef.current) {
        scanner
          .stop()
          .then(() => {
            isRunningRef.current = false;
          })
          .catch(() => {});
      }
    };
  }, [navigate, route]);

  const retryScanning = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-ink flex flex-col">
      <header className="px-6 py-5 flex items-center justify-between">
        <Link
          to={route ? `/route/${route.id}` : '/'}
          state={{ route }}
          className="text-paper/60 hover:text-paper transition-colors font-body text-sm"
        >
          ← Cancel
        </Link>
        <span className="font-body text-xs uppercase tracking-[0.2em] text-paper/40">
          Scan to board
        </span>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div
            id={SCANNER_ID}
            className="w-full aspect-square rounded-2xl overflow-hidden border-2 border-paper/20 bg-black"
          />

          <div className="mt-6 text-center">
            {status === 'starting' && (
              <p className="font-body text-paper/60 text-sm">Opening camera…</p>
            )}
            {status === 'scanning' && (
              <p className="font-body text-paper/70 text-sm">
                Point your camera at the QR code on the bus
              </p>
            )}
            {status === 'charging' && (
              <p className="font-body text-paper text-sm font-medium">
                Calculating your fare…
              </p>
            )}
            {status === 'error' && (
              <div className="space-y-3">
                <p className="font-body text-signal text-sm">{errorMsg}</p>
                <button
                  onClick={retryScanning}
                  className="px-5 py-2.5 rounded-lg bg-signal text-paper font-body text-sm font-medium"
                >
                  Try again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}