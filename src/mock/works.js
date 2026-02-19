// 内存中的作品与任务状态，便于 Mock 进度
const worksList = []
const taskProgress = {} // taskId -> { progress, workId, templateId, avatarUrl }

let nextWorkId = 1000
let nextTaskId = 1

export function getWorksList() {
  const generating = []
  const done = []
  for (const w of worksList) {
    if (w.status === 'generating') generating.push(w)
    else done.push(w)
  }
  for (const taskId of Object.keys(taskProgress)) {
    const t = taskProgress[taskId]
    if (t.workId) continue
    generating.push({
      taskId,
      templateId: t.templateId,
      templateTitle: t.templateTitle || '皖美运动·跑步篇',
      avatarUrl: t.avatarUrl,
      progress: t.progress ?? 0,
      status: 'generating',
    })
  }
  return {
    generating,
    done,
    totalCount: worksList.length + (generating.length > 0 ? 1 : 0),
  }
}

import { templateList } from './templates.js'

export function submitWork({ templateId, image }) {
  const taskId = String(nextTaskId++)
  const template = templateList.find((t) => t.id === String(templateId))
  taskProgress[taskId] = {
    progress: 0,
    templateId,
    templateTitle: template?.title || '皖美运动·跑步篇',
    avatarUrl: image,
    workId: null,
  }
  // 模拟进度推进
  const tick = () => {
    const t = taskProgress[taskId]
    if (!t || t.workId) return
    t.progress = Math.min(100, (t.progress || 0) + 15)
    if (t.progress >= 100) {
      const workId = String(nextWorkId++)
      t.workId = workId
      worksList.push({
        id: workId,
        templateId,
        templateTitle: t.templateTitle,
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        coverUrl: 'https://picsum.photos/400/300?random=w',
        completedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
        status: 'done',
      })
      delete taskProgress[taskId]
    }
  }
  setTimeout(tick, 800)
  setTimeout(tick, 1600)
  setTimeout(tick, 2400)
  setTimeout(tick, 3200)
  return { taskId }
}

export function getProgress(taskId) {
  const t = taskProgress[taskId]
  if (t) return { progress: t.progress ?? 0, workId: t.workId }
  const w = worksList.find((x) => x.taskId === taskId)
  if (w) return { progress: 100, workId: w.id }
  return { progress: 0, workId: null }
}

export function getWorkDetail(id) {
  const w = worksList.find((x) => x.id === String(id))
  if (!w) return null
  return {
    id: w.id,
    templateId: w.templateId,
    title: w.templateTitle,
    videoUrl: w.videoUrl,
    coverUrl: w.coverUrl,
    completedAt: w.completedAt,
  }
}
