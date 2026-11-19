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
      <div className="query-state h-full min-h-[120px] flex flex-col items-center justify-center gap-2 text-[var(--gov-text-muted)]" role="status">
        <span className="w-5 h-5 rounded-full border-2 border-[color:var(--gov-border)] border-t-[var(--gov-blue-soft)] animate-spin" />
        <span className="text-xs tracking-[0.18em]">数据加载中</span>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="query-state h-full min-h-[120px] flex flex-col items-center justify-center gap-2 px-3 text-center" role="alert">
        <span className="text-xs text-[var(--gov-danger)]">数据加载失败</span>
        <span className="text-[10px] text-[var(--gov-text-muted)] max-w-[240px] break-words">{state.error.message}</span>
        <button
          type="button"
          onClick={state.retry}
          className="mt-1 px-3 py-1 text-xs border border-[color:var(--gov-border-strong)] text-[var(--gov-text-primary)] rounded-sm hover:bg-[rgba(46,123,209,0.35)] transition-colors"
        >
          重试
        </button>
      </div>
    );
  }

  if (!ignoreEmpty && state.empty) {
    return (
      <div className="query-state h-full min-h-[120px] flex items-center justify-center text-xs tracking-[0.16em] text-[var(--gov-text-muted)]">
        暂无数据
      </div>
    );
  }

  return <>{children}</>;
}
