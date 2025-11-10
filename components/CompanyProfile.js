import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function CompanyProfile({
  companyId,
  isEditable = false,
  onSave,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    companyName: "",
    description: "",
    logo: null,
    website: "",
    linkedin: "",
    email: "",
    phone: "",
    industry: "",
    targetAudience: "",
    services: "",
    employees: "",
    roomNumber: "",
    isPublic: false,
    lookingForSynergies: false,
    synergyInterests: [],
  });

  // Load saved data from localStorage (in production, this would be from a database)
  useEffect(() => {
    const savedData = localStorage.getItem(`company_${companyId}`);
    if (savedData) {
      try {
        setProfileData(JSON.parse(savedData));
      } catch (parseError) {
        // Only log errors in development
        if (process.env.NODE_ENV === 'development') {
          console.error('Error parsing company profile:', parseError);
        }
        // Keep default profile data on parse error
      }
    }
  }, [companyId]);

  const handleSave = () => {
    localStorage.setItem(`company_${companyId}`, JSON.stringify(profileData));
    setIsEditing(false);
    if (onSave) onSave(profileData);
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({ ...profileData, logo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const industries = [
    "Tech & IT",
    "Marknadsföring",
    "Konsulting",
    "Design",
    "Finans",
    "Juridik",
    "Hälsa & Wellness",
    "E-handel",
    "Utbildning",
    "Annat",
  ];

  const synergyOptions = [
    "Gemensamma kunder",
    "Tekniska samarbeten",
    "Marknadsföringssamarbeten",
    "Events & nätverk",
    "Kunskapsutbyte",
    "Resursdelning",
  ];

  if (!isEditable && !profileData.companyName) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Ingen företagsprofil har skapats ännu.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-gradient p-6 md:p-8"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          {profileData.logo ? (
            <div className="relative w-20 h-20 rounded-lg overflow-hidden">
              <img
                src={profileData.logo}
                alt={profileData.companyName}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-20 h-20 bg-primary-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-10 h-10 text-primary-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}

          <div>
            {isEditing ? (
              <input
                type="text"
                id="company-name"
                name="company-name"
                value={profileData.companyName}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    companyName: e.target.value,
                  })
                }
                placeholder="Företagsnamn"
                autoComplete="organization"
                className="text-2xl font-bold input-field mb-2"
              />
            ) : (
              <h2 className="text-2xl font-bold text-gray-900">
                {profileData.companyName || "Ditt företag"}
              </h2>
            )}

            {profileData.roomNumber && (
              <span className="badge-primary">
                Rum {profileData.roomNumber}
              </span>
            )}
          </div>
        </div>

        {isEditable && (
          <button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className={`btn-${isEditing ? "primary" : "secondary"} text-sm`}
          >
            {isEditing ? "Spara" : "Redigera profil"}
          </button>
        )}
      </div>

      {isEditing && isEditable ? (
        // Edit Mode
        <div className="space-y-6">
          {/* Logo Upload */}
          <div>
            <label htmlFor="company-logo" className="block text-sm font-medium text-gray-700 mb-2">
              Företagslogotyp
            </label>
            <input
              type="file"
              id="company-logo"
              name="company-logo"
              accept="image/*"
              onChange={handleLogoUpload}
              className="input-field"
            />
          </div>

          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="company-room" className="block text-sm font-medium text-gray-700 mb-2">
                Rumsnummer
              </label>
              <input
                type="text"
                id="company-room"
                name="company-room"
                value={profileData.roomNumber}
                onChange={(e) =>
                  setProfileData({ ...profileData, roomNumber: e.target.value })
                }
                placeholder="T.ex. 101"
                autoComplete="off"
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="company-industry" className="block text-sm font-medium text-gray-700 mb-2">
                Bransch
              </label>
              <select
                id="company-industry"
                name="company-industry"
                value={profileData.industry}
                onChange={(e) =>
                  setProfileData({ ...profileData, industry: e.target.value })
                }
                autoComplete="organization-title"
                className="input-field"
              >
                <option value="">Välj bransch</option>
                {industries.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="company-description" className="block text-sm font-medium text-gray-700 mb-2">
              Företagsbeskrivning
            </label>
            <textarea
              id="company-description"
              name="company-description"
              value={profileData.description}
              onChange={(e) =>
                setProfileData({ ...profileData, description: e.target.value })
              }
              placeholder="Berätta om ert företag..."
              rows={4}
              autoComplete="off"
              className="input-field"
            />
          </div>

          {/* Services & Target */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="company-services" className="block text-sm font-medium text-gray-700 mb-2">
                Tjänster/Produkter
              </label>
              <textarea
                id="company-services"
                name="company-services"
                value={profileData.services}
                onChange={(e) =>
                  setProfileData({ ...profileData, services: e.target.value })
                }
                placeholder="Vad erbjuder ni?"
                rows={3}
                autoComplete="off"
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="company-target-audience" className="block text-sm font-medium text-gray-700 mb-2">
                Målgrupp
              </label>
              <textarea
                id="company-target-audience"
                name="company-target-audience"
                value={profileData.targetAudience}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    targetAudience: e.target.value,
                  })
                }
                placeholder="Vilka är era kunder?"
                rows={3}
                autoComplete="off"
                className="input-field"
              />
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="company-website" className="block text-sm font-medium text-gray-700 mb-2">
                Hemsida
              </label>
              <input
                type="url"
                id="company-website"
                name="company-website"
                value={profileData.website}
                onChange={(e) =>
                  setProfileData({ ...profileData, website: e.target.value })
                }
                placeholder="https://exempel.se"
                autoComplete="url"
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="company-linkedin" className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn
              </label>
              <input
                type="url"
                id="company-linkedin"
                name="company-linkedin"
                value={profileData.linkedin}
                onChange={(e) =>
                  setProfileData({ ...profileData, linkedin: e.target.value })
                }
                placeholder="https://linkedin.com/company/..."
                autoComplete="url"
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="company-email" className="block text-sm font-medium text-gray-700 mb-2">
                E-post
              </label>
              <input
                type="email"
                id="company-email"
                name="company-email"
                value={profileData.email}
                onChange={(e) =>
                  setProfileData({ ...profileData, email: e.target.value })
                }
                placeholder="info@exempel.se"
                autoComplete="email"
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="company-phone" className="block text-sm font-medium text-gray-700 mb-2">
                Telefon
              </label>
              <input
                type="tel"
                id="company-phone"
                name="company-phone"
                value={profileData.phone}
                onChange={(e) =>
                  setProfileData({ ...profileData, phone: e.target.value })
                }
                placeholder="070-123 45 67"
                autoComplete="tel"
                className="input-field"
              />
            </div>
          </div>

          {/* Visibility Settings */}
          <div className="bg-primary-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">
              Synlighet & Synergier
            </h3>

            <div className="space-y-3">
              <label htmlFor="company-is-public" className="flex items-center">
                <input
                  type="checkbox"
                  id="company-is-public"
                  name="company-is-public"
                  checked={profileData.isPublic}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      isPublic: e.target.checked,
                    })
                  }
                  className="rounded border-gray-300 text-primary-600 mr-3"
                />
                <span className="text-gray-700">
                  Visa företagsprofil publikt på hemsidan
                </span>
              </label>

              <label htmlFor="company-looking-synergies" className="flex items-center">
                <input
                  type="checkbox"
                  id="company-looking-synergies"
                  name="company-looking-synergies"
                  checked={profileData.lookingForSynergies}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      lookingForSynergies: e.target.checked,
                    })
                  }
                  className="rounded border-gray-300 text-primary-600 mr-3"
                />
                <span className="text-gray-700">
                  Vi söker synergier med andra företag
                </span>
              </label>
            </div>

            {profileData.lookingForSynergies && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Typ av synergier vi söker:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {synergyOptions.map((option) => {
                    const optionId = `synergy-${option.toLowerCase().replace(/\s+/g, '-')}`;
                    return (
                      <label key={option} htmlFor={optionId} className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          id={optionId}
                          name={optionId}
                          checked={profileData.synergyInterests?.includes(option)}
                          onChange={(e) => {
                            const interests = e.target.checked
                              ? [...(profileData.synergyInterests || []), option]
                              : profileData.synergyInterests.filter(
                                  (i) => i !== option
                                );
                            setProfileData({
                              ...profileData,
                              synergyInterests: interests,
                            });
                          }}
                          className="rounded border-gray-300 text-primary-600 mr-2"
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button onClick={handleSave} className="btn-primary">
              Spara ändringar
            </button>
            <button onClick={() => setIsEditing(false)} className="btn-ghost">
              Avbryt
            </button>
          </div>
        </div>
      ) : (
        // View Mode
        <div className="space-y-6">
          {profileData.description && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Om företaget</h3>
              <p className="text-gray-600">{profileData.description}</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {profileData.services && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Tjänster</h3>
                <p className="text-gray-600">{profileData.services}</p>
              </div>
            )}

            {profileData.targetAudience && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Målgrupp</h3>
                <p className="text-gray-600">{profileData.targetAudience}</p>
              </div>
            )}
          </div>

          {/* Contact Links */}
          <div className="flex flex-wrap gap-3">
            {profileData.website && (
              <a
                href={profileData.website}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-sm"
              >
                Hemsida →
              </a>
            )}
            {profileData.linkedin && (
              <a
                href={profileData.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-sm"
              >
                LinkedIn →
              </a>
            )}
            {profileData.email && (
              <a
                href={`mailto:${profileData.email}`}
                className="btn-secondary text-sm"
              >
                E-post →
              </a>
            )}
          </div>

          {/* Status Badges */}
          <div className="flex flex-wrap gap-2">
            {profileData.isPublic && (
              <span className="badge-success">Publikt synlig</span>
            )}
            {profileData.lookingForSynergies && (
              <span className="badge-accent">Söker synergier</span>
            )}
            {profileData.industry && (
              <span className="badge-primary">{profileData.industry}</span>
            )}
          </div>

          {profileData.lookingForSynergies &&
            profileData.synergyInterests?.length > 0 && (
              <div className="bg-accent-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Vi söker synergier inom:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profileData.synergyInterests.map((interest) => (
                    <span key={interest} className="badge-accent text-sm">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
        </div>
      )}
    </motion.div>
  );
}
