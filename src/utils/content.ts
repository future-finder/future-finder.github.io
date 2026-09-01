export function readingTime(body: string) {
  const chinese = (body.match(/[\u3400-\u9fff]/g) || []).length;
  const latin = body.replace(/[\u3400-\u9fff]/g, ' ').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(chinese / 300 + latin / 220));
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
}

export const statusLabels: Record<string, string> = {
  active: '进行中', completed: '已完成', reproduction: '复现', learning: '学习中',
  archived: '已归档', planned: '待补充', seed: 'Seed', growing: 'Growing', evergreen: 'Evergreen',
};
