import Layout from '../components/Layout';
import Link from 'next/link';

export default function CompanyPortal() {
  return (
    <Layout title="Företagsportalen är pausad" description="Kontakta DG97 för medlemsservice." path="/foretagsportal">
      <section className="section-container py-24 text-center">
        <h1 className="heading-1 mb-6">Företagsportalen är pausad</h1>
        <p className="text-gray-700 mb-6">Behöver du hjälp med ditt kontor eller kontakt med andra företag? Hör av dig så hjälper vi dig.</p>
        <Link href="/kontakt" className="btn-primary">Kontakta DG97</Link>
      </section>
    </Layout>
  );
}
