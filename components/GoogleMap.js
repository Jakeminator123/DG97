export default function GoogleMap() {
  return (
    <div className="w-full h-full min-h-[300px] rounded-lg overflow-hidden">
      <iframe
        title="Google Maps – DG97, Drottninggatan 97 i Stockholm"
        src="https://www.google.com/maps?q=Drottninggatan%2097%2C%20Stockholm&output=embed"
        className="w-full h-full min-h-[300px] border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}
