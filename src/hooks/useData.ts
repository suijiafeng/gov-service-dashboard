// 自定义 Hooks - 数据获取
import { useCallback, useEffect, useState } from 'react';
import * as api from '../api';

export interface QueryResult<T> {
  data: T;
  loading: boolean;
  error: Error | null;
  empty: boolean;
  retry: () => void;
}

function isEmptyData(data: unknown): boolean {
  if (data == null) return true;
  if (Array.isArray(data)) return data.length === 0;
  if (typeof data === 'string') return data.trim().length === 0;
  if (typeof data === 'object') {
    const values = Object.values(data as Record<string, unknown>);
    if (values.length === 0) return true;
    const structural = values.filter(
      (value) =>
        Array.isArray(value) ||
        typeof value === 'string' ||
        (value != null && typeof value === 'object'),
    );
    if (structural.length === 0 || structural.length !== values.length) return false;
    return structural.every((value) => isEmptyData(value));
  }
  return false;
}

export function combineQueries(
  queries: Array<Pick<QueryResult<unknown>, 'loading' | 'error' | 'empty' | 'retry'>>,
) {
  const error = queries.find((query) => query.error)?.error ?? null;
  const loading = queries.some((query) => query.loading);
  return {
    loading,
    error,
    empty: !loading && error == null && queries.every((query) => query.empty),
    retry: () => {
      queries.forEach((query) => query.retry());
    },
  };
}

// 通用数据加载 Hook
function useApiData<T>(
  fetcher: () => Promise<{ data: T }>,
  initialValue: T,
  isEmpty: (data: T) => boolean = isEmptyData,
): QueryResult<T> {
  const [data, setData] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [attempt, setAttempt] = useState(0);

  const retry = useCallback(() => {
    setAttempt((current) => current + 1);
  }, []);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetcher();
        if (!mounted) return;
        setData(response.data);
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err : new Error('数据加载失败'));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [attempt, fetcher]);

  return {
    data,
    loading,
    error,
    empty: !loading && error == null && isEmpty(data),
    retry,
  };
}

// ============ 左侧面板 Hooks ============

export function useServiceCategories() {
  return useApiData(api.getServiceCategories, [] as string[]);
}

export function useAgeDistribution() {
  return useApiData(api.getAgeDistribution, [] as api.AgeDistributionItem[]);
}

export function useWeeklyFlow() {
  return useApiData(api.getWeeklyFlow, [] as api.WeeklyFlowItem[]);
}

export function useVisitStatistics() {
  return useApiData(api.getVisitStatistics, {
    lastMonth: { infant: 0, adult: 0 },
    thisMonth: { youth: 0, elderly: 0 },
  } as api.VisitStatistics);
}

// ============ 右侧面板 Hooks ============

export function useAnnouncement() {
  return useApiData(api.getAnnouncement, '');
}

export function useServiceRecords() {
  return useApiData(api.getServiceRecords, [] as api.ServiceRecord[]);
}

export function useWindowUsage() {
  return useApiData(api.getWindowUsage, [] as api.WindowUsageItem[]);
}

export function useStaffData() {
  return useApiData(api.getStaffData, [] as api.StaffDataItem[]);
}

export function useDailyServiceStats() {
  return useApiData(api.getDailyServiceStats, {
    totalAppointments: 0,
    pending: 0,
    completed: 0,
    processing: 0,
    praised: 0,
  } as api.DailyServiceStats);
}

// ============ 中间面板 Hooks ============

export function useEquipmentStats() {
  return useApiData(api.getEquipmentStats, [] as api.EquipmentStatsItem[]);
}

export function useMapFlowData() {
  return useApiData(api.getMapFlowData, {
    lines: [],
    cities: [],
  } as api.MapFlowData);
}

export function useProvinceVisits() {
  return useApiData(api.getProvinceVisits, [] as api.ProvinceVisitItem[]);
}

export function useEducationStats() {
  return useApiData(api.getEducationStats, { bachelor: 0 } as api.EducationStats);
}

export function useAppointmentSlots() {
  return useApiData(api.getAppointmentSlots, [] as { time: string; count: number }[]);
}

// ============ v2 调度模式 Hooks ============

export function useQueueData() {
  return useApiData(api.getQueueData, [] as api.QueueItem[]);
}

export function useWindowMatrix() {
  return useApiData(api.getWindowMatrix, [] as api.WindowMatrixItem[]);
}

export function useEfficiencyStats() {
  return useApiData(api.getEfficiencyStats, {
    onTimeRate: 0,
    immediateRate: 0,
    avgProcessMinutes: 0,
    todayAccepted: 0,
  } as api.EfficiencyStats);
}

export function useOverdueItems() {
  return useApiData(api.getOverdueItems, [] as api.OverdueRecord[]);
}

export function useSatisfactionStats() {
  return useApiData(api.getSatisfactionStats, {
    todayRate: 0,
    weekRate: 0,
    counts: { great: 0, good: 0, ok: 0, bad: 0 },
    badReviews: [],
  } as api.SatisfactionStats);
}

export function useStaffPerformance() {
  return useApiData(api.getStaffPerformance, [] as api.StaffPerformanceItem[]);
}

export function useSiteData() {
  return useApiData(api.getSiteData, [] as api.SiteItem[]);
}

export function useResidenceDistribution() {
  return useApiData(api.getResidenceDistribution, [] as api.ResidenceItem[]);
}

export function useDiversionStats() {
  return useApiData(api.getDiversionStats, {
    onlineRate: 0,
    onlineRateTrend: 0,
    noShowRate: 0,
    selfServiceShare: 0,
  } as api.DiversionStats);
}

export function useDeviceStats() {
  return useApiData(api.getDeviceStats, { devices: [], workOrders: [] } as api.DeviceStats);
}

export function useSiteDetails() {
  return useApiData(api.getSiteDetails, {} as api.SiteDetails);
}

export function useWindowDetails() {
  return useApiData(api.getWindowDetails, [] as api.WindowDetailItem[]);
}

export function useServiceItemRanking() {
  return useApiData(api.getServiceItemRanking, [] as api.ServiceItemRankingItem[]);
}

export function usePerformanceTrend() {
  return useApiData(api.getPerformanceTrend, [] as api.PerformanceTrendItem[]);
}
