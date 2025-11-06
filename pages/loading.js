import LogoLoader from '../components/animations/LogoLoader';

/**
 * Global loading component for Next.js
 * This will be shown during page transitions and data fetching
 */
export default function Loading() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#1f2b73] via-[#2a3985] to-[#1f2b73]">
      <div className="text-center">
        <LogoLoader 
          size={220} 
          variant="breathe" 
          speed={4}
          showText={true}
          className="mb-4"
        />
        <p className="text-white text-sm tracking-wide opacity-70 animate-pulse">
          DG97 Kontorshotell
        </p>
      </div>
    </div>
  );
}

