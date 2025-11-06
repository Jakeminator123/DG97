import { useRouter } from "next/router";
import { useEffect } from "react";

/**
 * Redirect gamla medlemmar-sidan till nya företagsportalen
 * Alla funktioner finns nu samlat på ett ställe
 */
export default function MedlemmarPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect direkt till företagsportalen
    router.replace("/foretagsportal");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Omdirigerar till företagsportalen...</p>
      </div>
    </div>
  );
}
