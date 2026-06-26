import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function TicketPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const ticket = state?.ticket;
  const route = state?.route;
  const [time, setTime] = useState('');

  useEffect(() => {
    if (!ticket) {
      navigate('/');
      return;
    }
    const issued = new Date(ticket.issued_at);
    setTime(
      issued.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );
  }, [ticket, navigate]);

  if (!ticket) return null;

  return (
    <div className="min-h-screen bg-paper flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-transit/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✓</span>
          </div>
          <h1 className="font-display text-3xl text-ink">You're on board</h1>
          <p className="font-body text-ink/55 text-sm mt-1">Keep this ticket until you arrive</p>
        </div>

        <div className="bg-card border border-line rounded-2xl overflow-hidden">
          <div className="px-6 py-5 bg-transit text-paper">
            <div className="flex items-center justify-between">
              <span className="font-display text-3xl leading-none">
                {route?.route_number ?? ''}
              </span>
              <span className="font-body text-xs uppercase tracking-[0.15em] opacity-80">
                {ticket.direction}
              </span>
            </div>
            <p className="font-body text-sm opacity-85 mt-1">
              Boarded at {ticket.boarded_stop_name}
            </p>
          </div>

          <div className="px-6 py-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-body text-sm text-ink/55">Fare</span>
              <span className="font-display text-2xl text-signal">
                {Number(ticket.amount_paid).toFixed(2)} birr
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-body text-sm text-ink/55">Issued</span>
              <span className="font-body text-sm text-ink">{time}</span>
            </div>
            <div className="pt-3 border-t border-line">
              <span className="font-body text-xs text-ink/40 uppercase tracking-[0.1em]">
                Ticket ID
              </span>
              <p className="font-body text-xs text-ink/60 mt-1 break-all">
                {ticket.qr_token}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate('/')}
          className="w-full py-4 rounded-xl bg-ink text-paper font-body font-medium mt-6"
        >
          Search another trip
        </button>
      </div>
    </div>
  );
}