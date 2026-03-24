import type { FoodPost } from '../types';

export type FoodRequestSummary = {
  pendingCount: number;
  acceptedCount: number;
  completedCount: number;
};

type BadgeVariant = 'default' | 'success' | 'destructive';

/**
 * Nhãn trạng thái nhận món: phân biệt chủ bài (có yêu cầu đã duyệt / chờ) và người xem thường.
 */
export function getFoodAvailabilityBadge(
  food: Pick<FoodPost, 'status' | 'availableQuantity' | 'quantity'>,
  opts?: { isOwner?: boolean; requestSummary?: FoodRequestSummary }
): { label: string; variant: BadgeVariant } {
  const avail = Number(food.availableQuantity ?? food.quantity ?? 0);

  if (food.status === 'expired') {
    return { label: 'Hết hạn', variant: 'destructive' };
  }

  if (food.status === 'completed' || avail <= 0) {
    return { label: 'Đã nhận hết', variant: 'default' };
  }

  if (opts?.isOwner && opts.requestSummary) {
    const { pendingCount, acceptedCount } = opts.requestSummary;
    if (acceptedCount > 0 && avail > 0) {
      return { label: 'Đang giao · còn nhận thêm', variant: 'default' };
    }
    if (acceptedCount > 0) {
      return { label: 'Đang giao dịch', variant: 'default' };
    }
    if (pendingCount > 0) {
      return { label: `Còn nhận · ${pendingCount} chờ duyệt`, variant: 'success' };
    }
  }

  if (food.status === 'active' && avail > 0) {
    return { label: 'Còn nhận', variant: 'success' };
  }

  return { label: 'Còn nhận', variant: 'success' };
}

export function summarizeRequestsForPost(
  requests: Array<{ postId?: unknown; status?: string }>,
  postId: string
): FoodRequestSummary {
  const pid = String(postId);
  const list = requests.filter((r) => {
    const p = r.postId;
    const id = p && typeof p === 'object' && p !== null && '_id' in p ? String((p as { _id: string })._id) : String(p ?? '');
    return id === pid;
  });
  return {
    pendingCount: list.filter((r) => r.status === 'pending').length,
    acceptedCount: list.filter((r) => r.status === 'accepted').length,
    completedCount: list.filter((r) => r.status === 'completed').length,
  };
}
