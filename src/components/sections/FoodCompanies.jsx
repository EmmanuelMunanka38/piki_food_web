import { foodCompanies, getLogoUrl } from "../../data/menuItems";

export default function FoodCompanies() {
  return (
    <section className="bg-gray-50 py-12 md:py-16 overflow-hidden border-b border-gray-100">
      <div className="max-w-[1440px] mx-auto px-5 md:px-8 lg:px-12 mb-8">
        <p className="text-center text-sm font-semibold text-gray-400 uppercase tracking-wider">
          Trusted by top food brands
        </p>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 w-24 md:w-40 z-10 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 md:w-40 z-10 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none" />

        <div className="overflow-hidden">
          <div
            className="flex items-center gap-10 md:gap-16 animate-marquee"
            style={{ width: "max-content" }}
          >
            {[...foodCompanies, ...foodCompanies].map((company, i) => (
              <div
                key={`${company.id}-${i}`}
                className="flex items-center gap-3 flex-shrink-0 opacity-80 hover:opacity-100 transition-all duration-300"
              >
                <img
                  src={getLogoUrl(company.domain)}
                  alt={`${company.name} logo`}
                  className="h-8 md:h-10 w-auto object-contain"
                  loading="lazy"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
