import { useState, useEffect } from "react";
import { CrimeReport, Suspect } from "../api/entities";
import { useLanguage } from "../i18n/LanguageContext";

const CRIME_COLORS = {
  assault: "#ef4444", theft: "#f97316", homicide: "#7f1d1d",
  fraud: "#eab308", cybercrime: "#3b82f6", trafficking: "#7c3aed",
  terrorism: "#dc2626", drug_offense: "#16a34a", vandalism: "#6b7280",
  kidnapping: "#ec4899", other: "#475569"
};

const WORLD_REGIONS = [
  { name: "North America", countries: ["United States","USA","Canada","Mexico"], x: 15, y: 30 },
  { name: "South America", countries: ["Brazil","Colombia","Argentina","Venezuela","Peru","Chile"], x: 25, y: 60 },
  { name: "Western Europe", countries: ["UK","France","Germany","Spain","Italy","Netherlands","Belgium","Portugal"], x: 46, y: 25 },
  { name: "Eastern Europe", countries: ["Russia","Ukraine","Poland","Romania","Czech","Hungary"], x: 54, y: 22 },
  { name: "Middle East", countries: ["Saudi Arabia","Iran","Iraq","Syria","Turkey","Israel","UAE","Lebanon"], x: 58, y: 38 },
  { name: "Africa", countries: ["Nigeria","South Africa","Egypt","Kenya","Ethiopia","Ghana","Morocco"], x: 50, y: 55 },
  { name: "South Asia", countries: ["India","Pakistan","Bangladesh","Afghanistan","Sri Lanka"], x: 67, y: 42 },
  { name: "East Asia", countries: ["China","Japan","Korea","Taiwan","Hong Kong"], x: 78, y: 32 },
  { name: "Southeast Asia", countries: ["Indonesia","Thailand","Vietnam","Philippines","Malaysia","Myanmar"], x: 78, y: 50 },
  { name: "Oceania", countries: ["Australia","New Zealand"], x: 82, y: 70 },
];

export default function HeatMap() {
  const { t } = useLanguage();
  const [cases, setCases] = useState([]);
  const [suspects, setSuspects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [regionStats, setRegionStats] = useState({});

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const [c, s] = await Promise.all([CrimeReport.list(), Suspect.list()]);
      setCases(c); setSuspects(s);
      buildRegionStats(c, s);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const buildRegionStats = (c, s) => {
    const stats = {};
    WORLD_REGIONS.forEach(r => {
      const regionCases = c.filter(x => r.countries.some(country =>
        x.location_country?.toLowerCase().includes(country.toLowerCase()) ||
        x.location_city?.toLowerCase().includes(country.toLowerCase())
      ));
      const regionSuspects = s.filter(x => r.countries.some(country =>
        x.nationality?.toLowerCase().includes(country.toLowerCase()) ||
        x.last_known_location?.toLowerCase().includes(country.toLowerCase())
      ));
      stats[r.name] = {
        cases: regionCases.length,
        suspects: regionSuspects.length,
        critical: regionCases.filter(x => x.priority === "critical").length,
        wanted: regionSuspects.filter(x => x.status === "wanted" || x.status === "at_large").length,
        crimeTypes: {}
      };
      regionCases.forEach(x => {
        stats[r.name].crimeTypes[x.crime_type] = (stats[r.name].crimeTypes[x.crime_type] || 0) + 1;
      });
    });
    setRegionStats(stats);
  };

  const getHeatIntensity = (region) => {
    const s = regionStats[region.name];
    if (!s) return 0;
    return Math.min(s.cases + s.suspects * 0.5 + s.critical * 2, 20);
  };

  const getHeatColor = (intensity) => {
    if (intensity === 0) return "rgba(100,116,139,0.3)";
    if (intensity < 2) return "rgba(34,197,94,0.6)";
    if (intensity < 5) return "rgba(234,179,8,0.7)";
    if (intensity < 10) return "rgba(249,115,22,0.8)";
    return "rgba(239,68,68,0.9)";
  };

  // Crime breakdown globally
  const crimeBreakdown = {};
  cases.forEach(c => { crimeBreakdown[c.crime_type] = (crimeBreakdown[c.crime_type] || 0) + 1; });

  const countryBreakdown = {};
  cases.forEach(c => {
    const key = c.location_country || "Unknown";
    if (!countryBreakdown[key]) countryBreakdown[key] = { count: 0, types: {} };
    countryBreakdown[key].count++;
    countryBreakdown[key].types[c.crime_type] = (countryBreakdown[key].types[c.crime_type] || 0) + 1;
  });
  const topCountries = Object.entries(countryBreakdown).sort((a,b) => b[1].count - a[1].count).slice(0,10);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">🗺️ Global Crime Heat Map</h1>
        <p className="text-slate-400 text-sm mt-0.5">Visual intelligence overview — crime density by region worldwide</p>
      </div>

      {/* Global stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Cases", val: cases.length, icon: "📁", color: "from-blue-700 to-blue-800" },
          { label: "Active Suspects", val: suspects.filter(s => s.status === "at_large" || s.status === "wanted").length, icon: "🚨", color: "from-red-700 to-red-800" },
          { label: "Countries Affected", val: Object.keys(countryBreakdown).filter(k => k !== "Unknown").length, icon: "🌍", color: "from-purple-700 to-purple-800" },
          { label: "Critical Cases", val: cases.filter(c => c.priority === "critical").length, icon: "⚠️", color: "from-orange-600 to-orange-700" },
        ].map((s, i) => (
          <div key={i} className={`bg-gradient-to-br ${s.color} rounded-2xl p-4`}>
            <div className="text-2xl mb-1">{s.icon}</div>
            <p className="text-2xl font-bold text-white">{s.val}</p>
            <p className="text-white/70 text-xs">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Heat Map Visual */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 mb-6">
        <h2 className="text-white font-bold mb-4">🌐 Global Crime Density Map</h2>
        <div className="relative bg-slate-900 rounded-xl overflow-hidden" style={{paddingTop: "50%"}}>
          {/* World map SVG background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <svg viewBox="0 0 100 50" className="w-full h-full text-slate-400">
              <text x="50" y="30" textAnchor="middle" fontSize="8" fill="currentColor">WORLD MAP</text>
            </svg>
          </div>

          {/* Grid lines */}
          <div className="absolute inset-0" style={{
            backgroundImage: "linear-gradient(rgba(51,65,85,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(51,65,85,0.3) 1px, transparent 1px)",
            backgroundSize: "10% 10%"
          }} />

          {/* Region heat blobs */}
          {WORLD_REGIONS.map(region => {
            const intensity = getHeatIntensity(region);
            const color = getHeatColor(intensity);
            const size = Math.max(6, Math.min(16, 6 + intensity * 0.8));
            const stats = regionStats[region.name];

            return (
              <div key={region.name}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all hover:scale-125"
                style={{ left: `${region.x}%`, top: `${region.y}%` }}
                onMouseEnter={() => setHoveredRegion(region.name)}
                onMouseLeave={() => setHoveredRegion(null)}>
                {/* Pulse ring for active regions */}
                {intensity > 3 && (
                  <div className="absolute inset-0 rounded-full animate-ping opacity-40"
                    style={{ backgroundColor: color, width: `${size * 1.5}px`, height: `${size * 1.5}px`, left: `-${size * 0.25}px`, top: `-${size * 0.25}px` }} />
                )}
                <div className="rounded-full flex items-center justify-center text-white font-bold text-xs border border-white/20"
                  style={{ width: `${size * 4}px`, height: `${size * 4}px`, backgroundColor: color, fontSize: `${Math.max(8, size * 0.7)}px` }}>
                  {intensity > 0 ? (stats?.cases || 0) : "•"}
                </div>

                {/* Tooltip */}
                {hoveredRegion === region.name && stats && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-700 border border-slate-600 rounded-xl p-3 text-xs whitespace-nowrap z-10 shadow-xl">
                    <p className="text-white font-bold mb-1">{region.name}</p>
                    <p className="text-slate-300">📁 {stats.cases} cases</p>
                    <p className="text-slate-300">👤 {stats.suspects} suspects</p>
                    {stats.critical > 0 && <p className="text-red-400">🚨 {stats.critical} critical</p>}
                    {stats.wanted > 0 && <p className="text-orange-400">⚠️ {stats.wanted} wanted</p>}
                  </div>
                )}
              </div>
            );
          })}

          {/* Legend */}
          <div className="absolute bottom-3 right-3 bg-slate-800/90 border border-slate-700 rounded-xl p-3 text-xs">
            <p className="text-slate-400 font-bold mb-1.5">Crime Density</p>
            {[
              { color: "rgba(100,116,139,0.5)", label: "No data" },
              { color: "rgba(34,197,94,0.7)", label: "Low" },
              { color: "rgba(234,179,8,0.8)", label: "Medium" },
              { color: "rgba(249,115,22,0.9)", label: "High" },
              { color: "rgba(239,68,68,1)", label: "Critical" },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full" style={{backgroundColor: l.color}} />
                <span className="text-slate-300">{l.label}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-slate-500 text-xs mt-3 text-center">Hover over regions to see detailed crime statistics. Data updates in real-time as cases are filed.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top countries */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
          <h2 className="text-white font-bold mb-4">🌍 Top 10 Countries by Case Volume</h2>
          {topCountries.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-6">No location data yet. File cases with country info to see rankings.</p>
          ) : (
            <div className="space-y-2">
              {topCountries.map(([country, data], i) => {
                const maxCount = topCountries[0][1].count;
                return (
                  <div key={country} className="flex items-center gap-3">
                    <span className="text-slate-400 text-xs w-5 text-right">{i + 1}.</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-white text-sm font-medium">{country}</span>
                        <span className="text-slate-400 text-xs">{data.count} cases</span>
                      </div>
                      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-red-500"
                          style={{width: `${(data.count / maxCount) * 100}%`}} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Crime type breakdown */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
          <h2 className="text-white font-bold mb-4">🔍 Crime Type Distribution</h2>
          {Object.keys(crimeBreakdown).length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-6">No crime data yet. File cases to see distribution.</p>
          ) : (
            <div className="space-y-2">
              {Object.entries(crimeBreakdown).sort((a,b) => b[1]-a[1]).map(([type, count]) => {
                const maxCount = Math.max(...Object.values(crimeBreakdown));
                return (
                  <div key={type} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{backgroundColor: CRIME_COLORS[type] || "#64748b"}} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-white text-sm capitalize">{type.replace("_"," ")}</span>
                        <span className="text-slate-400 text-xs">{count}</span>
                      </div>
                      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{width: `${(count/maxCount)*100}%`, backgroundColor: CRIME_COLORS[type] || "#64748b"}} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
