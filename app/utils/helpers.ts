export type FoodStatus = 'AVAILABLE' | 'EXPIRING_SOON' | 'EXPIRED';

export const getFoodBadge = (status: FoodStatus) => {
  switch (status) {
    case 'AVAILABLE':
      return { color: 'bg-green-500', dot: 'bg-white', text: 'Còn nhận' };
    case 'EXPIRING_SOON':
      return { color: 'bg-red-500', dot: 'bg-white', text: 'Sắp hết hạn' };
    case 'EXPIRED':
      return { color: 'bg-slate-500', dot: 'bg-white', text: 'Đã hết hạn' };
    default:
      return { color: 'bg-slate-500', dot: 'bg-white', text: 'Không rõ' };
  }
};

export const formatDistance = (distanceInKm: number): string => {
  if (distanceInKm < 1) {
    return `${Math.round(distanceInKm * 1000)}m`;
  }
  return `${distanceInKm.toFixed(1)}km`;
};

export const formatTimeLeft = (dateStr: string): string => {
  const expiresAt = new Date(dateStr).getTime();
  const now = Date.now();
  const diff = expiresAt - now;

  if (diff <= 0) return 'Đã hết hạn';

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `Còn ${days} ngày`;
  }
  
  if (hours > 0) {
    return `Còn ${hours} giờ`;
  }
  
  return `Còn ${minutes} phút`;
};

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
