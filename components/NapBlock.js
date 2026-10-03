import { DG97_URL, DG97_BUSINESS } from '../config/site';

export default function NapBlock({ className = '', showSocial = true }) {
  return (
    <address className={`not-italic ${className}`}>
      <p className="font-semibold">{DG97_BUSINESS.name}</p>
      <p>{DG97_BUSINESS.streetAddress}</p>
      <p>{DG97_BUSINESS.postalCode} {DG97_BUSINESS.addressLocality}</p>
      <p>
        <a href={DG97_BUSINESS.telephoneHref} className="underline underline-offset-4">
          {DG97_BUSINESS.telephoneDisplay}
        </a>
        <span> ({DG97_BUSINESS.telephoneIntl})</span>
      </p>
      <p>
        <a href={`mailto:${DG97_BUSINESS.email}`} className="underline underline-offset-4">
          {DG97_BUSINESS.email}
        </a>
      </p>
      <p className="mt-3">
        <a href={DG97_URL} className="underline underline-offset-4">www.dg97.se</a>
      </p>
      {showSocial && (
        <p className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
          <a href={DG97_BUSINESS.sameAs[0]} className="underline underline-offset-4">LinkedIn</a>
          <a href={DG97_BUSINESS.sameAs[1]} className="underline underline-offset-4">Facebook</a>
        </p>
      )}
    </address>
  );
}
