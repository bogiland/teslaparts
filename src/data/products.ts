export type Category = "all" | "exterior" | "interior" | "electronics" | "maintenance" | "accessories";

export type Product = {
  id: number;
  name: string;
  price: number;
  category: Exclude<Category, "all">;
  image: string;
  fallbackImage: string;
};

export const categoryLabels: Record<Category, string> = {
  all: "Все товары",
  exterior: "Экстерьер",
  interior: "Интерьер",
  electronics: "Электроника",
  maintenance: "ТО и механика",
  accessories: "Аксессуары",
};

export const products: Product[] = [
  {
    id: 1,
    name: "Передний бампер Tesla Model 3",
    price: 450,
    category: "exterior",
    image: "/images/bumper.jpg",
    fallbackImage:
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    name: 'Аэродинамические диски 18" Model 3/Y',
    price: 800,
    category: "exterior",
    image: "/images/wheels.jpg",
    fallbackImage:
      "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    name: "Штурвал (Yoke) Tesla Model S/X",
    price: 1200,
    category: "interior",
    image: "/images/yoke.webp",
    fallbackImage:
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    name: "Накладка на центральную консоль",
    price: 45,
    category: "interior",
    image: "/images/console.webp",
    fallbackImage:
      "https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    name: "Зарядная станция Wall Connector",
    price: 425,
    category: "electronics",
    image: "/images/charger.jpg",
    fallbackImage:
      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 6,
    name: "Ключ-карта (Key Card)",
    price: 35,
    category: "electronics",
    image: "/images/keycard.jpg",
    fallbackImage:
      "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 7,
    name: "Защитное стекло для экрана",
    price: 35,
    category: "accessories",
    image: "/images/screen-protector.webp",
    fallbackImage:
      "https://images.unsplash.com/photo-1561580125-028ce3bf7b02?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 8,
    name: "HEPA фильтр салона",
    price: 110,
    category: "maintenance",
    image: "/images/filter.jpg",
    fallbackImage:
      "https://images.unsplash.com/photo-1604061986761-d9d0cc41b0d1?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 9,
    name: "Всепогодные коврики салона",
    price: 225,
    category: "accessories",
    image: "/images/mats.jpg",
    fallbackImage:
      "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 10,
    name: "Комплект тормозных колодок",
    price: 150,
    category: "maintenance",
    image: "/images/brakes.jpg",
    fallbackImage:
      "https://images.unsplash.com/photo-1486262715619-670810a044e1?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 11,
    name: "Рычаг передней подвески",
    price: 320,
    category: "maintenance",
    image: "/images/suspension.jpg",
    fallbackImage:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80",
  },
];
