import { useState } from 'react';
import { JAKOB } from '../config/site';

const sizeOptions = [
  { value: '', label: 'Välj ungefärlig storlek' },
  { value: '1-2', label: '1–2 personer' },
  { value: '3-4', label: '3–4 personer' },
  { value: '5-6', label: '5–6 personer' },
  { value: 'osaker', label: 'Osäker / vill diskutera' },
];

const empty = {
  name: '',
  company: '',
  email: '',
  phone: '',
  sizeNeed: '',
  startDate: '',
  message: '',
  website: '',
};

export default function LeadForm() {
  const [values, setValues] = useState(empty);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  function update(event) {
    const { name, value } = event.target;
    setValues(current => ({ ...current, [name]: value }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    setStatus('submitting');
    setError('');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Kunde inte skicka förfrågan.');
      setStatus('success');
      setValues(empty);
    } catch (err) {
      setStatus('error');
      setError(err.message);
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-primary-100 bg-white p-8" role="status">
        <h3 className="heading-3 mb-3">Tack, vi har tagit emot er förfrågan.</h3>
        <p className="text-neutral-700 leading-relaxed">
          Jakob eller någon i teamet återkommer. Ni kan också mejla{' '}
          <a className="underline underline-offset-4" href="mailto:hej@dg97.se">hej@dg97.se</a>
          {' '}eller ringa{' '}
          <a className="underline underline-offset-4" href={JAKOB.telephoneHref}>{JAKOB.telephoneDisplay}</a>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="grid sm:grid-cols-2 gap-5">
        <label className="block">
          <span className="block text-sm font-semibold text-primary-950 mb-2">Namn *</span>
          <input name="name" value={values.name} onChange={update} autoComplete="name" required maxLength={100} className="input-field" />
        </label>
        <label className="block">
          <span className="block text-sm font-semibold text-primary-950 mb-2">Företag</span>
          <input name="company" value={values.company} onChange={update} autoComplete="organization" maxLength={120} className="input-field" />
        </label>
        <label className="block">
          <span className="block text-sm font-semibold text-primary-950 mb-2">E-post *</span>
          <input type="email" name="email" value={values.email} onChange={update} autoComplete="email" required maxLength={254} className="input-field" />
        </label>
        <label className="block">
          <span className="block text-sm font-semibold text-primary-950 mb-2">Telefon</span>
          <input type="tel" name="phone" value={values.phone} onChange={update} autoComplete="tel" maxLength={50} className="input-field" />
        </label>
        <label className="block">
          <span className="block text-sm font-semibold text-primary-950 mb-2">Hur många ska sitta i rummet?</span>
          <select name="sizeNeed" value={values.sizeNeed} onChange={update} className="input-field">
            {sizeOptions.map(option => (
              <option key={option.value || 'empty'} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="block text-sm font-semibold text-primary-950 mb-2">Önskat startdatum</span>
          <input name="startDate" value={values.startDate} onChange={update} placeholder="Till exempel november 2026" maxLength={40} className="input-field" />
        </label>
      </div>
      <label className="block">
        <span className="block text-sm font-semibold text-primary-950 mb-2">Meddelande *</span>
        <textarea name="message" value={values.message} onChange={update} required maxLength={5000} rows={5} className="input-field" placeholder="Berätta kort om teamet och vad ni söker." />
      </label>
      <div className="hidden" aria-hidden="true">
        <label>
          Webbplats
          <input name="website" value={values.website} onChange={update} tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {error ? <p role="alert" className="text-red-700">{error}</p> : null}
      <button type="submit" disabled={status === 'submitting'} className="btn-primary">
        {status === 'submitting' ? 'Skickar…' : 'Skicka förfrågan'}
      </button>
      <p className="text-sm text-neutral-600 leading-relaxed">
        Förfrågan sparas så att DG97 kan återkomma. Ni kan också skriva direkt till{' '}
        <a className="underline underline-offset-4" href="mailto:hej@dg97.se">hej@dg97.se</a>.
      </p>
    </form>
  );
}
