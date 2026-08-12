import { Bookmark, Compass } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "../lib/routes";
import { EquipmentCard } from "../components/EquipmentCard";
export const FavoritesPage = ({
  currentUser,
  favoriteItems,
  favorites,
  onToggleFavorite
}) => {
  const userFavoritesList = currentUser?.favorites || favorites;
  const userFavoriteItems = favoriteItems.filter((e) => userFavoritesList.includes(e.id));
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-white font-mono">
      <div className="border-b border-[#1F1F1F] pb-4 flex items-center justify-between">
        <div>
          <h1 className="font-serif italic text-3xl font-normal text-white">Saved Equipment Assets</h1>
          <p className="text-xs text-[#888888] mt-1">
            Bookmarked machinery, tools, audio gear, and cinema equipment saved to your personal account
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#111111] border border-[#222222] text-xs text-[#F27D26]">
          <Bookmark className="w-4 h-4" />
          <span className="font-bold">{userFavoriteItems.length} Saved</span>
        </div>
      </div>

      {userFavoriteItems.length === 0 ? <div className="bg-[#111111] rounded-3xl p-12 text-center border border-[#1F1F1F] max-w-md mx-auto space-y-4">
          <Bookmark className="w-12 h-12 text-[#666666] mx-auto" />
          <h3 className="font-serif italic text-white text-lg">No Saved Listings</h3>
          <p className="text-xs text-[#888888] leading-relaxed">
            Click the bookmark icon on any equipment card to save it here for future project reservations.
          </p>
          <Link
    to={ROUTES.browse}
    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F27D26] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#d96a1a] transition"
  >
            <Compass className="w-4 h-4" />
            <span>Explore Marketplace</span>
          </Link>
        </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userFavoriteItems.map((item) => <EquipmentCard
    key={item.id}
    equipment={item}
    isFavorite={userFavoritesList.includes(item.id)}
    onToggleFavorite={onToggleFavorite}
  />)}
        </div>}
    </div>;
};
