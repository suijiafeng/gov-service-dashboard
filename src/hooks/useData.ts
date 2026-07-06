// 自定义 Hooks - 数据获取
import { useState, useEffect } from 'react';
import * as api from '../api';

// 通用数据加载 Hook
function useApiData<T>(fetcher: () => Promise<{ data: T }>, initialValue: T) {
  const [data, setData] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetcher();
        if (mounted) {
          setData(response.data);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  return { data, loading, error };
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
