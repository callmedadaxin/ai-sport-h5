export const templateList = [
  {
    id: '1',
    title: '亲情友情·聚皖里',
    tag: '乒乓悦动',
    cover: 'https://picsum.photos/400/300?random=1',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
  {
    id: '2',
    title: '乡土情怀·打球咯',
    tag: '徽州乡韵',
    cover: 'https://picsum.photos/400/300?random=2',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
  {
    id: '3',
    title: '文人雅兴',
    tag: '文人雅兴',
    cover: 'https://picsum.photos/400/300?random=3',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
  {
    id: '4',
    title: '徽味人生',
    tag: '徽味人生',
    cover: 'https://picsum.photos/400/300?random=4',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
]

export function getTemplateDetail(id) {
  const t = templateList.find((x) => x.id === String(id))
  if (!t) return null
  return {
    ...t,
    title: t.title,
    subtitle: '上传一张您的清晰正面照',
    desc: 'AI将自动为您生成专属运动数字代言',
  }
}
