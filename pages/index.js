import Image from 'next/image';
import Link from 'next/link';
import Layout from '../components/Layout';
import OfficialCTA from '../components/OfficialCTA';
import HeroMedia from '../components/HeroMedia';
import LeadForm from '../components/LeadForm';
import BlogCard from '../components/BlogCard';
import { DG97_CONTACT_URL, DG97_BUSINESS, referralUrl } from '../config/site';

const included = [
  ['Kaffe, frukt och läsk', 'Alltid tillgängligt i de gemensamma ytorna.'],
  ['Frukost och AW', 'Gemensam frukost minst en gång i veckan och after work ungefär en gång i månaden.'],
  ['Reception och lounge', 'En bemannad vardag och ytor att slå sig ner i.'],
  ['Konferensrum', 'Två rum på 16 och 20 kvm, utrustade för digitala möten. Ett visst antal timmar ingår.'],
  ['Telefonbås', 'Två bås för ostörda samtal.'],
  ['Copy och print', 'Utskrifter och kopiering på plats.'],
  ['Post och företagsadress', 'Posthantering och möjlighet till virtuell adress.'],
  ['Dusch och innergård', 'Duschrum i huset och en innergård att andas ut på.'],
  ['Möblerat från dag ett', 'Höj- och sänkbara skrivbord, ergonomiska stolar och whiteboards.'],
  ['Internet och städning', 'Uppkoppling, cybersäkerhet och städning ingår.'],
  ['Access dygnet runt', 'Tagg och Bluetooth-lås, så hyresgäster kommer in när arbetet kräver det.'],
  ['Hundar välkomna', 'Ni behöver inte bära dem till rummet.'],
];

const featuredSlugs = [
  'vad-kostar-ett-kontorshotell-i-stockholm-2026',
  'kontorshotell-vs-coworking',
  'hitta-kontor-nara-odenplan',
];

export default function Home({ featured }) {
  return (
    <Layout
      title="Eget kontorsrum i Vasastan"
      description="DG97 är ett kontorshotell med privata, låsbara rum på Drottninggatan 97, mellan Odenplan och Rådmansgatan. Se lediga rum och boka visning via dg97.se."
      path="/"
    >
      <section className="relative min-h-[100svh] text-white -mt-20">
        <HeroMedia />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-950/25 via-primary-950/45 to-primary-950/85" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[100svh] flex flex-col justify-end pb-28 sm:pb-16 pt-32">
          <p className="text-sm font-semibold tracking-[0.28em] uppercase text-blue-100 mb-5">Kontorshotell i Vasastan</p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold leading-[1.05] max-w-4xl mb-6">
            Eget rum vid Observatorielunden
          </h1>
          <p className="text-lg sm:text-xl text-blue-50 leading-relaxed max-w-2xl mb-8">
            Möblerade, låsbara kontorsrum för 2–6 personer på Drottninggatan 97.
            Flexibla avtal, allt ni behöver i huset – och fem minuters promenad från Odenplan.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href={referralUrl(DG97_CONTACT_URL, 'hero')} className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary-800 font-semibold rounded-xl hover:bg-[#F7F4EC]">
              Boka visning på dg97.se
            </a>
            <Link href="/lediga-rum" className="inline-flex items-center justify-center px-6 py-3 border border-white/50 text-white font-semibold rounded-xl hover:bg-white/10">
              Se lediga rum
            </Link>
            <a href={DG97_BUSINESS.telephoneHref} className="inline-flex items-center justify-center px-6 py-3 text-white font-semibold underline underline-offset-4">
              {DG97_BUSINESS.telephoneDisplay}
            </a>
          </div>
        </div>
      </section>

      <section className="bg-primary-50 border-b border-primary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-primary-950 font-semibold">Se vilka rum DG97 just nu publicerar som lediga.</p>
          <Link href="/lediga-rum" className="text-primary-700 font-semibold underline underline-offset-4">
            Se storlek, datum och hur hyran räknas
          </Link>
        </div>
      </section>

      <section className="section-container reveal-on-scroll">
        <p className="text-sm uppercase tracking-widest font-semibold text-primary-700 mb-3">Allt ingår</p>
        <h2 className="heading-2 mb-5">Ett eget rum, med huset bakom er</h2>
        <p className="text-lg text-neutral-700 leading-relaxed max-w-3xl mb-10">
          Ni hyr ett låsbart kontorsrum. Kaffe, möten, post och vardagens detaljer sköter huset.
          Office manager finns på plats dagtid. Hyresgäster kommer in dygnet runt.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {included.map(([title, text]) => (
            <article key={title} className="p-6 rounded-2xl bg-white border border-primary-100">
              <h3 className="text-lg font-semibold text-primary-950 mb-2">{title}</h3>
              <p className="text-neutral-700 leading-relaxed">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-container pt-0">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <figure className="relative aspect-[4/3] rounded-3xl overflow-hidden">
            <Image
              src="/images/ekta_office_room.jpg"
              alt="Ljust privat kontorsrum på DG97"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </figure>
          <div>
            <p className="text-sm uppercase tracking-widest font-semibold text-primary-700 mb-3">Privata rum</p>
            <h2 className="heading-2 mb-5">Låsbart rum för ert team</h2>
            <p className="text-lg text-neutral-700 leading-relaxed mb-5">
              DG97 hyr i dagsläget enbart enskilda, låsbara kontorsrum – inte öppna coworkingplatser.
              Rummen är möblerade för 2–6 personer. Avtal kan tecknas vecka eller månad.
            </p>
            <p className="text-lg text-neutral-700 leading-relaxed mb-8">
              Behöver ni bara en företagsadress och några konferenstimmar finns ett virtuellt upplägg.
              Externa gäster kan hyra konferensrum per timme.
            </p>
            <Link href="/lediga-rum" className="btn-primary">Se plan och lediga rum</Link>
          </div>
        </div>
      </section>

      <section className="section-container bg-white">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-sm uppercase tracking-widest font-semibold text-primary-700 mb-3">Läget</p>
            <h2 className="heading-2 mb-5">Övre Drottninggatan, mellan Odenplan och Rådmansgatan</h2>
            <p className="text-lg text-neutral-700 leading-relaxed mb-5">
              Huset ligger vid Observatorielunden. Odenplan med tunnelbana, pendeltåg och bussar
              är en promenad på ungefär fem minuter. Runt hörnet finns lunchställen och gym.
              Gatuparkering utanför; garageplats via hyresvärden i kö och mot separat avgift.
            </p>
            <Link href="/blogg/hitta-kontor-nara-odenplan" className="text-primary-700 font-semibold underline underline-offset-4">
              Läs mer om läget nära Odenplan
            </Link>
          </div>
          <figure className="relative aspect-[4/3] rounded-3xl overflow-hidden">
            <Image
              src="/images/observatoriet.jpg"
              alt="Observatoriet nära DG97 i Vasastan"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </figure>
        </div>
      </section>

      {featured.length > 0 ? (
        <section className="section-container">
          <div className="flex flex-wrap justify-between items-baseline gap-4 mb-8">
            <h2 className="heading-2">Från bloggen</h2>
            <Link href="/blogg" className="text-primary-700 font-semibold underline underline-offset-4">Alla artiklar</Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {featured.map(post => <BlogCard key={post.slug} post={post} />)}
          </div>
        </section>
      ) : null}

      <section className="section-container pt-0" id="intresseanmalan">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 items-start">
          <div>
            <p className="text-sm uppercase tracking-widest font-semibold text-primary-700 mb-3">Förfrågan</p>
            <h2 className="heading-2 mb-4">Berätta vad ni behöver</h2>
            <p className="text-lg text-neutral-700 leading-relaxed mb-4">
              Skicka en intresseanmälan här, eller gå direkt till kontaktformuläret på dg97.se.
              Mejla <a className="underline underline-offset-4" href="mailto:hej@dg97.se">hej@dg97.se</a> eller ring{' '}
              <a className="underline underline-offset-4" href={DG97_BUSINESS.telephoneHref}>{DG97_BUSINESS.telephoneDisplay}</a>.
            </p>
          </div>
          <LeadForm />
        </div>
      </section>

      <section className="section-container pt-0">
        <OfficialCTA title="Nyfiken på ett eget kontorsrum i Vasastan?" />
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  const { getPosts } = require('../lib/posts');
  const posts = getPosts();
  return {
    props: {
      featured: featuredSlugs.map(slug => posts.find(post => post.slug === slug)).filter(Boolean),
    },
  };
}
