import { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import CNJson from '../api/mock/china.json';
import { Card } from './Card';
import { useEquipmentStats, useMapFlowData, useDailyServiceStats } from '../hooks/useData';

const chinaMapData = CNJson as Parameters<typeof echarts.registerMap>[1];

export function CenterPanel() {
  const [mapLoaded, setMapLoaded] = useState(false);
  const { data: equipmentStats } = useEquipmentStats();
  const { data: mapFlowData } = useMapFlowData();
  const { data: dailyStats } = useDailyServiceStats();
  

  useEffect(() => {
    // fetch('https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json')
    //   .then(response => response.json())
    //   .then(geoJson => {
    //     echarts.registerMap('china', geoJson);
    //     setMapLoaded(true);
    //   })
    //   .catch(error => {
    //     console.error('Error loading map data:', error);
    //   });

     try {
      echarts.registerMap('china', chinaMapData);
      setMapLoaded(true);
    } catch (error) {
      console.error('Error registering local china geojson:', error);
    }
  }, []);

  const getMapOptions = () => ({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(9, 27, 49, 0.94)',
      borderColor: '#6b93c2',
      textStyle: { color: '#edf3fb' }
    },
    geo: {
      map: 'china',
      roam: true,
      zoom: 1.2, // 启用缩放和拖拽
      top: '90px',
      label: {
        show: true,
        color: '#b8c9dd',
        fontSize: 10,
        opacity: 0.88
      },
      itemStyle: {
        areaColor: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [{
            offset: 0, color: 'rgba(63, 103, 153, 0.92)'
          }, {
            offset: 1, color: 'rgba(14, 38, 68, 0.96)'
          }]
        },
        borderColor: '#7c9ec4',
        borderWidth: 1.1,
        shadowColor: 'rgba(11, 25, 45, 0.25)',
        shadowBlur: 8,
        shadowOffsetX: 0,
        shadowOffsetY: 3
      },
      emphasis: {
        itemStyle: {
          areaColor: 'rgba(97, 139, 193, 0.45)',
        },
        label: {
          show: true,
          color: '#f7fbff'
        }
      }
    },
    series: [
      {
        type: 'lines',
        zlevel: 1,
        effect: {
          show: true,
          period: 7,
          trailLength: 0.45,
          color: '#c7a45a',
          symbolSize: 2.5
        },
        lineStyle: {
          color: 'rgba(199, 164, 90, 0.22)',
          width: 1,
          opacity: 0.65,
          curveness: 0.2
        },
        data: mapFlowData.lines
      },
      {
        type: 'lines',
        zlevel: 2,
        symbol: ['none', 'arrow'],
        symbolSize: 10,
        effect: {
          show: true,
          period: 7,
          trailLength: 0,
          symbol: 'arrow',
          symbolSize: 6
        },
        lineStyle: {
          color: '#c7a45a',
          width: 1.5,
          opacity: 0.78,
          curveness: 0.18
        },
        data: mapFlowData.lines
      },
      {
        type: 'effectScatter',
        coordinateSystem: 'geo',
        zlevel: 2,
        rippleEffect: {
          brushType: 'stroke'
        },
        label: {
          show: true,
          position: 'right',
          formatter: '{b}',
          color: '#edf3fb',
          fontSize: 11
        },
        symbolSize: 8,
        itemStyle: {
          color: '#c7a45a',
          borderColor: '#f0e2ba',
          borderWidth: 1,
          shadowBlur: 6,
          shadowColor: 'rgba(37, 32, 22, 0.25)'
        },
        data: mapFlowData.cities
      }
    ]
  });

  return (
    <div className="flex-1 flex flex-col h-full px-2">
      {/* Map Section */}
      <div className="flex-[8] min-h-0 relative">
        <div className="absolute top-4 left-4 z-10 flex items-center space-x-2 bg-[rgba(9,27,49,0.82)] border border-[color:var(--gov-border)] px-4 py-2 rounded-sm">
          <div className="w-2 h-2 rounded-full bg-[var(--gov-gold)] animate-pulse" />
          <span className="text-[var(--gov-text-primary)] font-semibold tracking-[0.18em]">全市市民来访分布图</span>
        </div>



        {/* 左下角 KPI 指标 */}
        <div className="absolute bottom-8 left-4 z-20 flex flex-col space-y-2">
          {[
            { label: '今日预约', value: dailyStats.totalAppointments },
            { label: '已完成', value: dailyStats.completed },
            { label: '办理中', value: dailyStats.processing },
            { label: '待办件', value: dailyStats.pending },
          ].map(item => (
            <div key={item.label} className="flex items-center space-x-2 bg-[rgba(9,27,49,0.76)] border-l-2 border-[color:var(--gov-gold)] pl-2 pr-3 py-1 backdrop-blur-sm">
              <span className="text-[10px] text-[var(--gov-text-secondary)] w-12">{item.label}</span>
              <span className="text-sm font-bold text-white">{item.value.toLocaleString()}</span>
            </div>
          ))}
        </div>

        <div className="w-full h-full pt-20 flex items-center justify-center">
          {mapLoaded ? (
            <ReactECharts 
              option={getMapOptions()} 
              style={{ height: '100%', width: '100%' }}
              opts={{ renderer: 'canvas' }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[var(--gov-text-secondary)]">
              加载地图数据中...
            </div>
          )}
        </div>

      </div>

      {/* Equipment Statistics Bottom Section */}
      <div className="flex-[2] min-h-0 mt-4 flex flex-col relative">
        <Card title="自助服务终端使用统计" className="h-full border-t-[color:var(--gov-border-strong)]">
          <div className="text-xs text-[var(--gov-gold-soft)] mb-2 flex items-center space-x-1 -mt-2">
            <span>⚠️</span>
            <span>自助终端1、终端4使用量下降，请检查设备状态......</span>
          </div>
          <div className="flex flex-1 items-stretch gap-2 px-1 pb-1 h-[90px] overflow-x-auto">
            {equipmentStats.map((stat, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-28 flex flex-col justify-between h-full bg-[rgba(14,38,68,0.55)] border border-[color:var(--gov-border)] rounded-sm p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] hover:border-[color:var(--gov-border-strong)] hover:bg-[rgba(25,55,92,0.7)] transition-colors duration-300"
              >
                <div className="text-[10px] text-center mb-1 text-[var(--gov-text-secondary)]">{stat.name}</div>
                <div className="flex items-end justify-between px-1">
                  <div className="flex items-baseline space-x-1">
                    <span className="text-xl font-bold tracking-wider text-white">{stat.count}</span>
                    <span className="text-[10px] text-[var(--gov-text-muted)]">台</span>
                  </div>
                  <span className={`text-[10px] font-bold ${stat.trend === 'up' ? 'text-[var(--gov-gold-soft)]' : stat.trend === 'down' ? 'text-[var(--gov-danger)]' : 'text-slate-400'}`}>
                    {stat.trend === 'up' ? '↗ ' : stat.trend === 'down' ? '↘ ' : '— '}{stat.percent}
                  </span>
                </div>
                <div className="w-full h-4 mt-1 opacity-80">
                  <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 20">
                    <path
                      d={stat.trend === 'up' ? "M0,20 Q25,10 50,15 T100,0" : stat.trend === 'down' ? "M0,0 Q25,10 50,5 T100,20" : "M0,10 L100,10"}
                      fill="none"
                      stroke={stat.trend === 'up' ? '#c7a45a' : stat.trend === 'down' ? '#b35b52' : '#9ca3af'}
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
