// API 服务层 - 模拟异步请求
import * as mockData from './mock/data';

// 模拟网络延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 模拟 API 响应
interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}

// 包装响应
const wrapResponse = <T>(data: T): ApiResponse<T> => ({
  code: 200,
  data,
  message: 'success',
});

// ============ 左侧面板 API ============

// 获取热门办理事项
export async function getServiceCategories() {
  await delay(100);
  return wrapResponse(mockData.serviceCategories);
}

// 获取市民年龄分布
export async function getAgeDistribution() {
  await delay(150);
  return wrapResponse(mockData.ageDistributionData);
}

// 获取每周人流量
export async function getWeeklyFlow() {
  await delay(120);
  return wrapResponse(mockData.weeklyFlowData);
}

// 获取业务办理统计
export async function getVisitStatistics() {
  await delay(100);
  return wrapResponse(mockData.visitStatistics);
}

// ============ 右侧面板 API ============

// 获取公告内容
export async function getAnnouncement() {
  await delay(80);
  return wrapResponse(mockData.announcement);
}

// 获取服务叫号记录
export async function getServiceRecords() {
  await delay(130);
  return wrapResponse(mockData.serviceRecords);
}

// 获取窗口服务量统计
export async function getWindowUsage() {
  await delay(140);
  return wrapResponse(mockData.windowUsageData);
}

// 获取工作人员接待数据
export async function getStaffData() {
  await delay(110);
  return wrapResponse(mockData.staffData);
}

// 获取今日政务服务统计
export async function getDailyServiceStats() {
  await delay(90);
  return wrapResponse(mockData.dailyServiceStats);
}

// 获取预约时段分布
export async function getAppointmentSlots() {
  await delay(100);
  return wrapResponse(mockData.appointmentSlots);
}

// ============ 中间面板 API ============

// 获取自助终端使用统计
export async function getEquipmentStats() {
  await delay(120);
  return wrapResponse(mockData.equipmentStats);
}

// 获取地图流向数据
export async function getMapFlowData() {
  await delay(100);
  return wrapResponse(mockData.mapFlowData);
}

// 获取网上办件率
export async function getEducationStats() {
  await delay(80);
  return wrapResponse(mockData.educationStats);
}

// ============ 导出类型 ============
export type AgeDistributionItem = typeof mockData.ageDistributionData[number];
export type WeeklyFlowItem = typeof mockData.weeklyFlowData[number];
export type ServiceRecord = typeof mockData.serviceRecords[number];
export type WindowUsageItem = typeof mockData.windowUsageData[number];
export type StaffDataItem = typeof mockData.staffData[number];
export type EquipmentStatsItem = typeof mockData.equipmentStats[number];
export type DailyServiceStats = typeof mockData.dailyServiceStats;
export type VisitStatistics = typeof mockData.visitStatistics;
export type MapFlowData = typeof mockData.mapFlowData;
export type EducationStats = typeof mockData.educationStats;
