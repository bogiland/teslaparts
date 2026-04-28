import { Search } from "lucide-react";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-xl">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="Поиск оригинальных запчастей..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="block w-full rounded-full border border-gray-200 bg-gray-50 py-3.5 pl-12 pr-4 leading-5 text-zinc-900 shadow-sm transition-all placeholder:text-gray-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 sm:text-sm"
      />
    </div>
  );
}
