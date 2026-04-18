// 轮播和动态效果 Hooks
import { useState, useEffect, useCallback } from 'react';

// 数字递增动画 Hook
export function useCountUp(targetValue: number, duration: number = 2000) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (targetValue === 0) return;
    
    const startTime = Date.now();
    const startValue = 0;
    
    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      // easeOutQuart 缓动函数
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(startValue + (targetValue - startValue) * easeProgress);
      setValue(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [targetValue, duration]);

  return value;
}

// 列表轮播 Hook - 自动滚动显示
export function useListCarousel<T>(items: T[], visibleCount: number = 4, interval: number = 3000) {
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    if (items.length <= visibleCount) return;

    const timer = setInterval(() => {
      setStartIndex(prev => (prev + 1) % items.length);
    }, interval);

    return () => clearInterval(timer);
  }, [items.length, visibleCount, interval]);

  // 获取当前可见的项目（循环）
  const visibleItems = [];
  for (let i = 0; i < Math.min(visibleCount, items.length); i++) {
    visibleItems.push(items[(startIndex + i) % items.length]);
  }

  return { visibleItems, startIndex };
}

// 数据刷新 Hook - 模拟实时数据更新
export function useDataRefresh<T>(
  initialData: T,
  refreshFn: (data: T) => T,
  interval: number = 5000
) {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  useEffect(() => {
    const timer = setInterval(() => {
      setData(prev => refreshFn(prev));
    }, interval);

    return () => clearInterval(timer);
  }, [refreshFn, interval]);

  return data;
}

// 高亮轮播 Hook - 依次高亮列表项
export function useHighlightCarousel(itemCount: number, interval: number = 2000) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (itemCount === 0) return;

    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % itemCount);
    }, interval);

    return () => clearInterval(timer);
  }, [itemCount, interval]);

  return activeIndex;
}

// 随机波动数据生成
export function generateFluctuation(baseValue: number, range: number = 0.1): number {
  const fluctuation = (Math.random() - 0.5) * 2 * range;
  return Math.floor(baseValue * (1 + fluctuation));
}

// 图表数据动态更新 Hook
export function useChartDataRefresh<T extends Record<string, unknown>[]>(
  initialData: T,
  interval: number = 4000,
  fluctuationRange: number = 0.15
): T {
  const [data, setData] = useState<T>(initialData);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  useEffect(() => {
    if (!initialData || initialData.length === 0) return;

    const timer = setInterval(() => {
      setData(prevData => {
        return prevData.map(item => {
          const newItem = { ...item };
          Object.keys(newItem).forEach(key => {
            const value = newItem[key];
            if (typeof value === 'number' && key !== 'name') {
              (newItem as Record<string, unknown>)[key] = generateFluctuation(value, fluctuationRange);
            }
          });
          return newItem;
        }) as T;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [initialData, interval, fluctuationRange]);

  return data;
}
