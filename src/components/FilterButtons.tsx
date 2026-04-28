import type { Category } from "../data/products";
import { categoryLabels } from "../data/products";

type FilterButtonsProps = {
  activeCategory: Category;
  onCategoryChange: (category: Category) => void;
};

const categoryOrder: Category[] = ["all", "exterior", "interior", "electronics", "maintenance", "accessories"];

export default function FilterButtons({ activeCategory, onCategoryChange }: FilterButtonsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {categoryOrder.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onCategoryChange(category)}
          className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
            activeCategory === category
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
              : "border border-gray-200 bg-white text-gray-600 hover:border-emerald-500/30 hover:text-emerald-600"
          }`}
        >
          {categoryLabels[category]}
        </button>
      ))}
    </div>
  );
}
