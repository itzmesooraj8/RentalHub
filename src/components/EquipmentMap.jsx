import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Star, ArrowRight, X } from "lucide-react";
import L from "leaflet";
const INDIA_CITY_COORDINATES = {
  mumbai: [19.076, 72.8777],
  bengaluru: [12.9716, 77.5946],
  bangalore: [12.9716, 77.5946],
  delhi: [28.6139, 77.209],
  hyderabad: [17.385, 78.4867],
  chennai: [13.0827, 80.2707],
  pune: [18.5204, 73.8567],
  ahmedabad: [23.0225, 72.5714],
  kolkata: [22.5726, 88.3639],
  jaipur: [26.9124, 75.7873]
};
const DEFAULT_INDIA_POSITIONS = [
  [19.076, 72.8777],
  // Mumbai
  [12.9716, 77.5946],
  // Bengaluru
  [28.6139, 77.209],
  // Delhi
  [17.385, 78.4867],
  // Hyderabad
  [13.0827, 80.2707],
  // Chennai
  [18.5204, 73.8567],
  // Pune
  [23.0225, 72.5714],
  // Ahmedabad
  [22.5726, 88.3639],
  // Kolkata
  [26.9124, 75.7873]
  // Jaipur
];
function getEquipmentIndiaCoords(eq, index) {
  if (eq.lat && eq.lng && eq.lat > 5 && eq.lat < 36 && eq.lng > 68 && eq.lng < 98) {
    return [eq.lat, eq.lng];
  }
  const locLower = (eq.location || "").toLowerCase();
  for (const [city, coords] of Object.entries(INDIA_CITY_COORDINATES)) {
    if (locLower.includes(city)) {
      return coords;
    }
  }
  return DEFAULT_INDIA_POSITIONS[index % DEFAULT_INDIA_POSITIONS.length];
}
export const EquipmentMap = ({ items }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [selectedPin, setSelectedPin] = useState(items[0] || null);
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (!mapInstanceRef.current) {
      const map2 = L.map(mapContainerRef.current, {
        center: [20.5937, 78.9629],
        zoom: 5,
        zoomControl: true,
        scrollWheelZoom: false
      });
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 18,
        subdomains: "abcd"
      }).addTo(map2);
      mapInstanceRef.current = map2;
    }
    const map = mapInstanceRef.current;
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
    items.forEach((eq, idx) => {
      const coords = getEquipmentIndiaCoords(eq, idx);
      const isSelected = selectedPin?.id === eq.id;
      const customIcon = L.divIcon({
        className: "custom-leaflet-marker",
        html: `<div style="
          background-color: ${isSelected ? "#F27D26" : "#111111"};
          color: ${isSelected ? "#000000" : "#ffffff"};
          border: 1px solid ${isSelected ? "#ffffff" : "#333333"};
          padding: 4px 10px;
          border-radius: 9999px;
          font-family: monospace;
          font-size: 11px;
          font-weight: 700;
          white-space: nowrap;
          box-shadow: 0 4px 12px rgba(0,0,0,0.6);
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 4px;
        ">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          <span>\u20B9${eq.dailyRate}/d</span>
        </div>`,
        iconSize: [80, 28],
        iconAnchor: [40, 14]
      });
      const marker = L.marker(coords, { icon: customIcon }).addTo(map);
      marker.on("click", () => {
        setSelectedPin(eq);
        map.panTo(coords, { animate: true });
      });
      markersRef.current.push(marker);
    });
    return () => {
    };
  }, [items, selectedPin?.id]);
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);
  return <div className="w-full h-[520px] rounded-2xl bg-[#0A0A0A] border border-[#1F1F1F] relative overflow-hidden flex flex-col justify-between p-4 shadow-2xl">
      {
    /* Map Header Overlay */
  }
      <div className="z-20 bg-[#111111]/90 backdrop-blur-md p-3 rounded-xl border border-[#1F1F1F] flex items-center justify-between text-white pointer-events-auto">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#F27D26] animate-pulse" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#F27D26]">Live OpenStreetMap India Regional Hubs</span>
        </div>
        <span className="text-xs font-mono text-[#888888]">{items.length} verified Indian machinery assets</span>
      </div>

      {
    /* Real OpenStreetMap Container */
  }
      <div ref={mapContainerRef} className="absolute inset-0 z-0 bg-[#0A0A0A]" />

      {
    /* Selected Item Quick View Overlay Card */
  }
      {selectedPin && <div className="z-30 bg-[#111111]/95 backdrop-blur-md border border-[#1F1F1F] rounded-2xl p-4 text-white max-w-sm ml-auto shadow-2xl relative mt-auto font-mono">
          <button
    onClick={() => setSelectedPin(null)}
    className="absolute top-3 right-3 text-[#888888] hover:text-white p-1 rounded-full hover:bg-[#1A1A1A] cursor-pointer"
  >
            <X className="w-4 h-4" />
          </button>
          <div className="flex gap-3 items-center">
            <img
    src={selectedPin.images[0]}
    alt={selectedPin.title}
    className="w-20 h-20 rounded-xl object-cover border border-[#333333]"
    onError={(e) => {
      e.target.src = "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&q=80&w=1000";
    }}
  />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#F27D26]">
                {selectedPin.category}
              </span>
              <h4 className="font-serif italic text-base text-white truncate">{selectedPin.title}</h4>
              <div className="text-xs text-[#888888] mt-0.5 flex items-center gap-1 font-mono">
                <MapPin className="w-3 h-3 text-[#666666]" /> {selectedPin.location}
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-[#F27D26] mt-1 font-mono">
                <Star className="w-3 h-3 fill-current" /> {selectedPin.rating} ({selectedPin.reviewCount} reviews)
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-[#1F1F1F] flex items-center justify-between">
            <div>
              <span className="text-lg font-serif font-bold text-white">₹{selectedPin.dailyRate}</span>
              <span className="text-xs text-[#888888]"> / day</span>
            </div>
            <Link
    to={`/equipment/${selectedPin.id}`}
    className="px-3 py-1.5 rounded-lg bg-[#F27D26] hover:bg-[#d96a1a] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1 transition"
  >
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>}
    </div>;
};
