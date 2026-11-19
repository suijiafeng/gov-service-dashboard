import { ReactNode } from 'react';
import { combineQueries, type QueryResult } from '../hooks/useData';

export type QuerySlice = Pick<QueryResult<unknown>, 'loading' | 'error' | 'empty' | 'retry'>;

export function QueryState({
  query,
  children,
  ignoreEmpty = false,
}: {
  query: QuerySlice | QuerySlice[];
  children: ReactNode;
  /** 空列表本身是有效业务结果（例如无预警）时，仍渲染子节点 */
  ignoreEmpty?: boolean;
}) {
  const state = Array.isArray(query) ? combineQueries(query) : query;

  if (state.loading) {
    return (
      <div className="query-state flex h-full min-h-[120px] flex-col items-center justify-center gap-2 text-[var(--gov-text-muted)]" role="status">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-[color:var(--gov-border)] border-t-[var(--gov-blue-soft)]" />
        <span className="text-[13px] tracking-normal">数据加载中</span>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="query-state flex h-full min-h-[120px] flex-col items-center justify-center gap-2 px-3 text-center" role="alert">
        <span className="text-[13px] text-[var(--gov-danger)]">数据加载失败</span>
        <span className="max-w-[280px] break-words text-[13px] text-[var(--gov-text-muted)]">{state.error.message}</span>
        <button
          type="button"
          onClick={state.retry}
          className="gov-btn mt-1 rounded-md border border-[color:var(--gov-border-strong)] px-3 py-1 text-[13px] text-[var(--gov-text-primary)] hover:bg-[rgba(46,123,209,0.35)]"
        >
          重试
        </button>
      </div>
    );
  }

  if (!ignoreEmpty && state.empty) {
    return (
      <div className="query-state flex h-full min-h-[120px] items-center justify-center text-[13px] tracking-normal text-[var(--gov-text-muted)]">
        暂无数据
      </div>
    );
  }

  return <>{children}</>;
}
