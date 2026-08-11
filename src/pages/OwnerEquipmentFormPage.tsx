import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Wrench,
  ArrowLeft,
  Upload,
  Plus,
  Trash2,
  DollarSign,
  MapPin,
  Camera,
  Layers,
  CheckCircle,
  Info,
} from 'lucide-react';
import { Equipment, User, EquipmentCategory } from '../types';
import { ROUTES } from '../lib/routes';

interface OwnerEquipmentFormPageProps {
  currentUser: User | null;
  equipmentList: Equipment[];
  onCreateEquipment?: (equipment: Equipment) => void;
  onUpdateEquipment?: (id: string, updates: Partial<Equipment>) => void;
}

export const OwnerEquipmentFormPage: React.FC<OwnerEquipmentFormPageProps> = ({
  currentUser,
  equipmentList,
  onCreateEquipment,
  onUpdateEquipment,
}) => {
  const { equipmentId } = useParams<{ equipmentId: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(equipmentId);

  const existingItem = isEditing ? equipmentList.find((e) => e.id === equipmentId) : null;

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<string>('Heavy Machinery');
  const [industry, setIndustry] = useState('Construction');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [description, setDescription] = useState('');

  // Pricing
  const [dailyRate, setDailyRate] = useState<number>(350);
  const [weeklyRate, setWeeklyRate] = useState<number>(1400);
  const [securityDeposit, setSecurityDeposit] = useState<number>(800);

  // Location & Fulfillment
  const [location, setLocation] = useState('Austin, TX Yard Depot #2');
  const [deliveryAvailable, setDeliveryAvailable] = useState(true);
  const [deliveryRadiusMiles, setDeliveryRadiusMiles] = useState(50);

  // Images
  const [coverImage, setCoverImage] = useState(
    'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=1000'
  );
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [newImageInput, setNewImageInput] = useState('');

  // Dynamic Category Specifications
  const [spec1, setSpec1] = useState('');
  const [spec2, setSpec2] = useState('');
  const [spec3, setSpec3] = useState('');

  useEffect(() => {
    if (existingItem) {
      setTitle(existingItem.title);
      setCategory(existingItem.category);
      setIndustry(existingItem.industry || 'General');
      setDescription(existingItem.description);
      setDailyRate(existingItem.dailyRate);
      setWeeklyRate(existingItem.weeklyRate || existingItem.dailyRate * 5);
      setSecurityDeposit(existingItem.securityDeposit || 500);
      setLocation(existingItem.location);
      if (existingItem.images && existingItem.images.length > 0) {
        setCoverImage(existingItem.images[0]);
        setGalleryImages(existingItem.images.slice(1));
      }
      if (existingItem.specs) {
        const keys = Object.keys(existingItem.specs);
        if (keys[0]) setSpec1(existingItem.specs[keys[0]]);
        if (keys[1]) setSpec2(existingItem.specs[keys[1]]);
        if (keys[2]) setSpec3(existingItem.specs[keys[2]]);
      }
    }
  }, [existingItem]);

  const handleAddGalleryImage = () => {
    if (newImageInput.trim()) {
      setGalleryImages([...galleryImages, newImageInput.trim()]);
      setNewImageInput('');
    }
  };

  const handleRemoveGalleryImage = (idx: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const specs: Record<string, string> = {};
    if (category === 'Photography & Drones') {
      if (spec1) specs['Sensor'] = spec1;
      if (spec2) specs['Resolution'] = spec2;
      if (spec3) specs['Lens Mount'] = spec3;
    } else if (category === 'Heavy Machinery') {
      if (spec1) specs['Operating Weight'] = spec1;
      if (spec2) specs['Bucket Capacity'] = spec2;
      if (spec3) specs['Engine Power'] = spec3;
    } else if (category === 'Generators') {
      if (spec1) specs['Power Output'] = spec1;
      if (spec2) specs['Fuel Type'] = spec2;
      if (spec3) specs['Runtime'] = spec3;
    } else {
      if (spec1) specs['Spec 1'] = spec1;
      if (spec2) specs['Spec 2'] = spec2;
      if (spec3) specs['Spec 3'] = spec3;
    }

    const allImages = [coverImage, ...galleryImages].filter(Boolean);

    if (isEditing && equipmentId && onUpdateEquipment) {
      onUpdateEquipment(equipmentId, {
        title,
        category,
        industry,
        description,
        dailyRate: Number(dailyRate),
        weeklyRate: Number(weeklyRate),
        securityDeposit: Number(securityDeposit),
        location,
        images: allImages,
        specs,
      });
    } else if (onCreateEquipment && currentUser) {
      const newEq: Equipment = {
        id: `eq_${Date.now()}`,
        ownerId: currentUser.id,
        ownerName: currentUser.name,
        ownerAvatar: currentUser.avatar,
        ownerTrustScore: currentUser.trustScore,
        ownerKyVerified: Boolean(currentUser.kycVerified),
        title: title || 'New Fleet Equipment',
        category,
        industry,
        description: description || 'Verified operating equipment in prime rental condition.',
        dailyRate: Number(dailyRate),
        weeklyRate: Number(weeklyRate),
        securityDeposit: Number(securityDeposit),
        location,
        lat: 30.2672,
        lng: -97.7431,
        images: allImages.length ? allImages : ['https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=1000'],
        specs,
        status: 'active',
        rating: 5.0,
        reviewCount: 0,
        co2SavedPerDayKg: Math.round((dailyRate / 20) * 10) / 10,
        createdAt: new Date().toISOString(),
      };
      onCreateEquipment(newEq);
    }

    navigate(ROUTES.ownerEquipment);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-mono text-white">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-[#1F1F1F] pb-4">
        <Link
          to={ROUTES.ownerEquipment}
          className="flex items-center gap-2 text-xs text-[#888888] hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Fleet Equipment</span>
        </Link>
        <span className="text-xs text-[#F27D26] font-bold uppercase tracking-wider">
          {isEditing ? 'Edit Asset Listing' : 'New Equipment Onboarding'}
        </span>
      </div>

      <div className="bg-[#111111] rounded-3xl p-6 sm:p-8 border border-[#1F1F1F] shadow-2xl space-y-6">
        <div>
          <h1 className="font-serif italic text-2xl sm:text-3xl text-white">
            {isEditing ? `Edit Listing: ${title}` : 'Add New Asset to Marketplace'}
          </h1>
          <p className="text-xs text-[#888888] mt-1">
            Specify technical properties, daily/weekly rates, security deposit, pickup location, and industry attributes.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-xs font-mono">
          {/* Section 1: Basic Information */}
          <div className="p-5 bg-[#1A1A1A] rounded-2xl border border-[#222222] space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#F27D26] flex items-center gap-2 border-b border-[#2A2A2A] pb-2">
              <Layers className="w-4 h-4" />
              <span>1. Basic Asset Information</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-[#888888] font-bold uppercase block mb-1">Equipment Title / Model Name</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Caterpillar 320 Hydraulic Excavator (2024)"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#111111] border border-[#333333] text-white focus:outline-none focus:ring-2 focus:ring-[#F27D26]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[#888888] font-bold uppercase block mb-1">Marketplace Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#111111] border border-[#333333] text-white focus:outline-none focus:ring-2 focus:ring-[#F27D26]"
                  >
                    <option value="Heavy Machinery">Heavy Machinery</option>
                    <option value="Power Tools">Power Tools</option>
                    <option value="Event & Audio">Event & Audio</option>
                    <option value="Photography & Drones">Photography & Drones</option>
                    <option value="Agriculture & Farming">Agriculture & Farming</option>
                    <option value="Generators">Generators</option>
                    <option value="Logistics & Cargo">Logistics & Cargo</option>
                    <option value="Science & Lab">Science & Lab</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#888888] font-bold uppercase block mb-1">Primary Industry Focus</label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g. Earthmoving, Film Production, Civil Eng"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#111111] border border-[#333333] text-white focus:outline-none focus:ring-2 focus:ring-[#F27D26]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#888888] font-bold uppercase block mb-1">Description & Operational Notes</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe technical specs, fuel type, maintenance record, safety requirements, and included accessories..."
                  className="w-full p-3 rounded-xl bg-[#111111] border border-[#333333] text-white focus:outline-none focus:ring-2 focus:ring-[#F27D26]"
                  required
                ></textarea>
              </div>
            </div>
          </div>

          {/* Section 2: Rates & Deposit */}
          <div className="p-5 bg-[#1A1A1A] rounded-2xl border border-[#222222] space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#F27D26] flex items-center gap-2 border-b border-[#2A2A2A] pb-2">
              <DollarSign className="w-4 h-4" />
              <span>2. Rental Pricing & Deposit Structure</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[#888888] font-bold uppercase block mb-1">Daily Rate ($/day)</label>
                <input
                  type="number"
                  value={dailyRate}
                  onChange={(e) => setDailyRate(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#111111] border border-[#333333] text-white focus:outline-none focus:ring-2 focus:ring-[#F27D26]"
                  required
                />
              </div>

              <div>
                <label className="text-[#888888] font-bold uppercase block mb-1">Weekly Discount Rate ($/wk)</label>
                <input
                  type="number"
                  value={weeklyRate}
                  onChange={(e) => setWeeklyRate(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#111111] border border-[#333333] text-white focus:outline-none focus:ring-2 focus:ring-[#F27D26]"
                  required
                />
              </div>

              <div>
                <label className="text-[#888888] font-bold uppercase block mb-1">Security Deposit Hold ($)</label>
                <input
                  type="number"
                  value={securityDeposit}
                  onChange={(e) => setSecurityDeposit(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#111111] border border-[#333333] text-white focus:outline-none focus:ring-2 focus:ring-[#F27D26]"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 3: Dynamic Category Specifications */}
          <div className="p-5 bg-[#1A1A1A] rounded-2xl border border-[#222222] space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#F27D26] flex items-center gap-2 border-b border-[#2A2A2A] pb-2">
              <Wrench className="w-4 h-4" />
              <span>3. Dynamic Category Specifications ({category})</span>
            </h3>

            {category === 'Photography & Drones' ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[#888888] font-bold uppercase block mb-1">Sensor Type</label>
                  <input
                    type="text"
                    value={spec1}
                    onChange={(e) => setSpec1(e.target.value)}
                    placeholder="e.g. Full-Frame CMOS, V-RAPTOR 8K"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#111111] border border-[#333333] text-white focus:outline-none focus:ring-2 focus:ring-[#F27D26]"
                  />
                </div>
                <div>
                  <label className="text-[#888888] font-bold uppercase block mb-1">Resolution / FPS</label>
                  <input
                    type="text"
                    value={spec2}
                    onChange={(e) => setSpec2(e.target.value)}
                    placeholder="e.g. 8K @ 120fps ProRes"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#111111] border border-[#333333] text-white focus:outline-none focus:ring-2 focus:ring-[#F27D26]"
                  />
                </div>
                <div>
                  <label className="text-[#888888] font-bold uppercase block mb-1">Lens Mount</label>
                  <input
                    type="text"
                    value={spec3}
                    onChange={(e) => setSpec3(e.target.value)}
                    placeholder="e.g. ARRI LPL / Canon EF"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#111111] border border-[#333333] text-white focus:outline-none focus:ring-2 focus:ring-[#F27D26]"
                  />
                </div>
              </div>
            ) : category === 'Heavy Machinery' ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[#888888] font-bold uppercase block mb-1">Operating Weight</label>
                  <input
                    type="text"
                    value={spec1}
                    onChange={(e) => setSpec1(e.target.value)}
                    placeholder="e.g. 22,500 kg (50,000 lbs)"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#111111] border border-[#333333] text-white focus:outline-none focus:ring-2 focus:ring-[#F27D26]"
                  />
                </div>
                <div>
                  <label className="text-[#888888] font-bold uppercase block mb-1">Bucket Capacity</label>
                  <input
                    type="text"
                    value={spec2}
                    onChange={(e) => setSpec2(e.target.value)}
                    placeholder="e.g. 1.2 cu yds Heavy Duty"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#111111] border border-[#333333] text-white focus:outline-none focus:ring-2 focus:ring-[#F27D26]"
                  />
                </div>
                <div>
                  <label className="text-[#888888] font-bold uppercase block mb-1">Engine Horsepower</label>
                  <input
                    type="text"
                    value={spec3}
                    onChange={(e) => setSpec3(e.target.value)}
                    placeholder="e.g. 172 HP Turbo Diesel"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#111111] border border-[#333333] text-white focus:outline-none focus:ring-2 focus:ring-[#F27D26]"
                  />
                </div>
              </div>
            ) : category === 'Generators' ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[#888888] font-bold uppercase block mb-1">Power Output (kW/kVA)</label>
                  <input
                    type="text"
                    value={spec1}
                    onChange={(e) => setSpec1(e.target.value)}
                    placeholder="e.g. 100 kW Continuous"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#111111] border border-[#333333] text-white focus:outline-none focus:ring-2 focus:ring-[#F27D26]"
                  />
                </div>
                <div>
                  <label className="text-[#888888] font-bold uppercase block mb-1">Fuel Type & Tank</label>
                  <input
                    type="text"
                    value={spec2}
                    onChange={(e) => setSpec2(e.target.value)}
                    placeholder="e.g. Diesel / 110 Gal"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#111111] border border-[#333333] text-white focus:outline-none focus:ring-2 focus:ring-[#F27D26]"
                  />
                </div>
                <div>
                  <label className="text-[#888888] font-bold uppercase block mb-1">Continuous Runtime</label>
                  <input
                    type="text"
                    value={spec3}
                    onChange={(e) => setSpec3(e.target.value)}
                    placeholder="e.g. 24 Hours @ 75% Load"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#111111] border border-[#333333] text-white focus:outline-none focus:ring-2 focus:ring-[#F27D26]"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[#888888] font-bold uppercase block mb-1">Primary Specification</label>
                  <input
                    type="text"
                    value={spec1}
                    onChange={(e) => setSpec1(e.target.value)}
                    placeholder="Key feature or rating..."
                    className="w-full px-3 py-2.5 rounded-xl bg-[#111111] border border-[#333333] text-white focus:outline-none focus:ring-2 focus:ring-[#F27D26]"
                  />
                </div>
                <div>
                  <label className="text-[#888888] font-bold uppercase block mb-1">Power / Capacity</label>
                  <input
                    type="text"
                    value={spec2}
                    onChange={(e) => setSpec2(e.target.value)}
                    placeholder="Operating capacity..."
                    className="w-full px-3 py-2.5 rounded-xl bg-[#111111] border border-[#333333] text-white focus:outline-none focus:ring-2 focus:ring-[#F27D26]"
                  />
                </div>
                <div>
                  <label className="text-[#888888] font-bold uppercase block mb-1">Condition Rating</label>
                  <input
                    type="text"
                    value={spec3}
                    onChange={(e) => setSpec3(e.target.value)}
                    placeholder="Tier 1 Certified..."
                    className="w-full px-3 py-2.5 rounded-xl bg-[#111111] border border-[#333333] text-white focus:outline-none focus:ring-2 focus:ring-[#F27D26]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Images */}
          <div className="p-5 bg-[#1A1A1A] rounded-2xl border border-[#222222] space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#F27D26] flex items-center gap-2 border-b border-[#2A2A2A] pb-2">
              <Camera className="w-4 h-4" />
              <span>4. High-Resolution Asset Photos</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-[#888888] font-bold uppercase block mb-1">Cover Image Photo URL</label>
                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#111111] border border-[#333333] text-white focus:outline-none focus:ring-2 focus:ring-[#F27D26]"
                  required
                />
              </div>

              {coverImage && (
                <div className="w-32 h-20 rounded-xl overflow-hidden border border-[#333]">
                  <img src={coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl bg-[#F27D26] hover:bg-[#d96a1a] text-black font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-xl flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            <span>{isEditing ? 'Save Equipment Changes' : 'Publish Asset to Marketplace'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
