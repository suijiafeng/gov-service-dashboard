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

export function useEducationStats() {
  return useApiData(api.getEducationStats, { bachelor: 0 } as api.EducationStats);
}

export function useAppointmentSlots() {
  return useApiData(api.getAppointmentSlots, [] as { time: string; count: number }[]);
}
