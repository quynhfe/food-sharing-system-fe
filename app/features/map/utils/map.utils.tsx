import { Utensils, Leaf, Package, MoreHorizontal } from "lucide-react-native";

export const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'cooked': return <Utensils size={16} color="white" />;
    case 'raw': return <Leaf size={16} color="white" />;
    case 'packaged': return <Package size={16} color="white" />;
    case 'other':
    default: return <MoreHorizontal size={16} color="white" />;
  }
};

export const getCategoryColor = (category: string) => {
  switch (category) {
    case 'cooked': return 'bg-orange-500';
    case 'raw': return 'bg-emerald-500';
    case 'packaged': return 'bg-blue-500';
    case 'other':
    default: return 'bg-slate-500';
  }
};

export const getJitteredCoord = (val: number, index: number) => {
  return val + (Math.sin(index * 9999) * 0.00015);
};
