export default function NewsletterSignup({ variant = 'dark' }) {
  return (
    <div className={`text-center ${variant === 'dark' ? 'text-white' : 'text-gray-900'}`}>
      <h3 className="text-2xl font-bold mb-3">Nyheter från DG97</h3>
      <p>Nyhetsbrevet är pausat. Läs våra senaste artiklar i bloggen.</p>
      <Link href="/blogg" className="inline-block mt-4 underline">Till bloggen</Link>
    </div>
  );
}
import Link from 'next/link';

