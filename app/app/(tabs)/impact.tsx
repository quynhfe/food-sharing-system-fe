import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import {
  ShoppingBag,
  Recycle,
  Globe,
  Award,
  Leaf,
  Star,
  Heart,
  Lock,
  Zap,
  MessageCircle
} from 'lucide-react-native';
import { impactService, PeriodFilter, ChartMonth } from '@/services/impactService';

const PRIMARY = '#218c28';

// ─── Mini Bar Chart (no lib needed) ────────────────────────────
function BarChart({ data }: { data: ChartMonth[] }) {
  if (!data || data.length === 0) return null;

  const maxCount = Math.max(...data.map((d) => d.count), 1);
  const BAR_MAX_HEIGHT = 96;

  return (
    <View className="flex-row items-end justify-between h-32 px-1 mt-2">
      {data.map((item, i) => {
        const isLast = i === data.length - 1;
        const barHeight = Math.max(8, (item.count / maxCount) * BAR_MAX_HEIGHT);
        return (
          <View key={i} className="flex-1 items-center gap-1.5">
            <Text
              style={{
                fontSize: 10,
                color: PRIMARY,
                fontWeight: '600',
                marginBottom: 2,
                display: item.count > 0 ? 'flex' : 'none',
              }}
            >
              {item.count}
            </Text>
            <View
              style={{
                width: 10,
                height: barHeight,
                backgroundColor: isLast ? PRIMARY : `${PRIMARY}66`,
                borderTopLeftRadius: 6,
                borderTopRightRadius: 6,
              }}
            />
            <Text
              style={{
                fontSize: 10,
                fontWeight: '600',
                color: isLast ? PRIMARY : '#94A3B8',
                textTransform: 'uppercase',
              }}
            >
              {item.month}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

// ─── KPI Card ───────────────────────────────────────────────────
interface KpiCardProps {
  icon: React.ReactNode;
  iconBg: string;
  value: string;
  label: string;
}

function KpiCard({ icon, iconBg, value, label }: KpiCardProps) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: iconBg,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </View>
      <View>
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#0F172A' }}>{value}</Text>
        <Text style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>{label}</Text>
      </View>
    </View>
  );
}

// ─── Main Screen ───────────────────────────────────────────────
export default function ImpactScreen() {
  const [period, setPeriod] = useState<PeriodFilter>('month');
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: stats,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ['impact-stats', period],
    queryFn: () => impactService.getStats(period),
    staleTime: 2 * 60 * 1000, // cache 2 phút
  });

  const {
    data: chart,
    isLoading: chartLoading,
    refetch: refetchChart,
  } = useQuery({
    queryKey: ['impact-chart'],
    queryFn: () => impactService.getChart(),
    staleTime: 2 * 60 * 1000, // cache 2 phút
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchStats(), refetchChart()]);
    setRefreshing(false);
  }, [refetchStats, refetchChart]);

  const filters: { label: string; value: PeriodFilter }[] = [
    { label: 'Tuần', value: 'week' },
    { label: 'Tháng', value: 'month' },
    { label: 'Tất cả', value: 'all' },
  ];

  const isLoading = statsLoading || chartLoading;

  const BADGES = [
    { icon: <Leaf size={20} color="#16A34A" fill="#16A34A" />, bg: '#DCFCE7', unlocked: true },
    { icon: <Star size={20} color="#CA8A04" fill="#CA8A04" />, bg: '#FEF9C3', unlocked: true },
    { icon: <Heart size={20} color={PRIMARY} fill={PRIMARY} />, bg: `${PRIMARY}1A`, unlocked: true },
    { icon: <Lock size={20} color="#CBD5E1" />, bg: '#F1F5F9', unlocked: false },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F6F8F6' }} edges={['top']}>
      {/* Header */}
      <View
        style={{
          backgroundColor: '#F6F8F6',
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 8,
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ fontSize: 22, fontWeight: '700', color: '#0F172A' }}>
            Tác động của tôi 🌱
          </Text>
          <TouchableOpacity 
            onPress={() => router.push('/(tabs)/messages/index')}
            style={{ width: 44, height: 44, backgroundColor: '#fff', borderRadius: 22, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}
            activeOpacity={0.8}
          >
            <MessageCircle size={22} color="#334155" />
          </TouchableOpacity>
        </View>

        {/* Filter pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {filters.map((f) => (
              <TouchableOpacity
                key={f.value}
                onPress={() => setPeriod(f.value)}
                style={{
                  paddingHorizontal: 20,
                  paddingVertical: 6,
                  borderRadius: 999,
                  backgroundColor: period === f.value ? PRIMARY : '#fff',
                  borderWidth: 1,
                  borderColor: period === f.value ? PRIMARY : `${PRIMARY}1A`,
                  shadowColor: period === f.value ? PRIMARY : 'transparent',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 8,
                  elevation: period === f.value ? 4 : 0,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '500',
                    color: period === f.value ? '#fff' : '#0F172A',
                  }}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 140, gap: 16 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={PRIMARY} />
        }
      >
        {isLoading ? (
          <View style={{ alignItems: 'center', marginTop: 80 }}>
            <ActivityIndicator size="large" color={PRIMARY} />
          </View>
        ) : (
          <>
            {/* 2×2 KPI Grid */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <KpiCard
                icon={<ShoppingBag size={20} color="#EA580C" />}
                iconBg="#FFEDD5"
                value={`${stats?.totalShared ?? 0} món`}
                label="Đã chia sẻ"
              />
              <KpiCard
                icon={<Recycle size={20} color={PRIMARY} />}
                iconBg="#DCFCE7"
                value={`${stats?.totalFoodKg ?? 0} kg`}
                label="Thực phẩm đã cứu"
              />
            </View>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <KpiCard
                icon={<Globe size={20} color="#2563EB" />}
                iconBg="#DBEAFE"
                value={`${stats?.totalCo2Kg ?? 0} kg`}
                label="CO₂ đã giảm"
              />
              <KpiCard
                icon={<Award size={20} color="#CA8A04" />}
                iconBg="#FEF9C3"
                value={stats?.levelName ?? '—'}
                label="Cấp độ"
              />
            </View>

            {/* Chart Card */}
            <View
              style={{
                backgroundColor: '#fff',
                borderRadius: 16,
                padding: 20,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 16,
                }}
              >
                <Text style={{ fontSize: 15, fontWeight: '700', color: '#0F172A' }}>
                  Hoạt động theo tháng
                </Text>
                <Text style={{ fontSize: 12, color: '#94A3B8' }}>6 tháng gần nhất</Text>
              </View>
              <BarChart data={chart ?? []} />
            </View>

            {/* Journey / Level Progress Card */}
            <View
              style={{
                backgroundColor: '#fff',
                borderRadius: 16,
                padding: 20,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              {/* Header row */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 16,
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: '700',
                    color: '#94A3B8',
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                  }}
                >
                  Hành trình của bạn
                </Text>
                {(stats?.sharesNeeded ?? 0) > 0 && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: `${PRIMARY}1A`,
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                      borderRadius: 999,
                      gap: 3,
                    }}
                  >
                    <Zap size={12} color={PRIMARY} />
                    <Text style={{ fontSize: 11, fontWeight: '600', color: PRIMARY }}>
                      Cần {stats?.sharesNeeded} lần nữa
                    </Text>
                  </View>
                )}
              </View>

              {/* Level names */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  marginBottom: 8,
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#0F172A' }}>
                  {stats?.levelName ?? '—'}
                </Text>
                {stats?.nextLevelName && (
                  <Text style={{ fontSize: 14, fontWeight: '500', color: '#94A3B8' }}>
                    {stats.nextLevelName}
                  </Text>
                )}
              </View>

              {/* Progress bar */}
              <View
                style={{
                  width: '100%',
                  height: 12,
                  backgroundColor: '#F1F5F9',
                  borderRadius: 999,
                  overflow: 'hidden',
                  marginBottom: 20,
                }}
              >
                <View
                  style={{
                    width: `${stats?.expPercent ?? 0}%`,
                    height: '100%',
                    backgroundColor: PRIMARY,
                    borderRadius: 999,
                  }}
                />
              </View>

              {/* EXP label */}
              <Text style={{ fontSize: 12, color: '#64748B', marginBottom: 16, textAlign: 'center' }}>
                {stats?.exp ?? 0} EXP · {stats?.expPercent ?? 0}% tới cấp tiếp theo
              </Text>

              {/* Badges */}
              <View
                style={{
                  paddingTop: 16,
                  borderTopWidth: 1,
                  borderTopColor: '#F8FAFC',
                }}
              >
                <Text
                  style={{ fontSize: 12, fontWeight: '500', color: '#64748B', marginBottom: 12 }}
                >
                  Huy hiệu đã đạt được
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 8 }}>
                  {BADGES.map((badge, i) => (
                    <View
                      key={i}
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        backgroundColor: badge.bg,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: badge.unlocked ? 0 : 2,
                        borderStyle: badge.unlocked ? undefined : 'dashed',
                        borderColor: badge.unlocked ? undefined : '#E2E8F0',
                        opacity: badge.unlocked ? 1 : 0.6,
                      }}
                    >
                      {badge.icon}
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
