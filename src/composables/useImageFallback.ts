/** 记录已失败的 originCover URL，使用 Set 确保全局唯一 */
const failedOriginUrls = new Set<string>()
/** 记录已失败的 originVideoUrl URL */
const failedOriginVideoUrls = new Set<string>()

/**
 * 获取有效的图片 URL
 * 优先使用 originCover，如果该 URL 之前加载失败过，则直接返回 coverUrl
 */
export function getImageUrl(originCover?: string, coverUrl?: string): string {
  // 如果 originCover 存在且之前未失败，优先使用
  if (originCover && !failedOriginUrls.has(originCover)) {
    return originCover
  }
  // 否则使用 coverUrl
  return coverUrl || ''
}

/**
 * 获取有效的视频 URL
 * 优先使用 originVideoUrl，如果该 URL 之前加载失败过，则直接返回 videoUrl
 */
export function getVideoUrl(originVideoUrl?: string, videoUrl?: string): string {
  // 如果 originVideoUrl 存在且之前未失败，优先使用
  if (originVideoUrl && !failedOriginVideoUrls.has(originVideoUrl)) {
    return originVideoUrl
  }
  // 否则使用 videoUrl
  return videoUrl || ''
}

/**
 * 标记 originCover 加载失败
 */
export function markOriginCoverFailed(originCover: string): void {
  failedOriginUrls.add(originCover)
}

/**
 * 标记 originVideoUrl 加载失败
 */
export function markOriginVideoFailed(originVideoUrl: string): void {
  failedOriginVideoUrls.add(originVideoUrl)
}

/**
 * 检查 originCover 是否已失败
 */
export function hasOriginCoverFailed(originCover: string): boolean {
  return failedOriginUrls.has(originCover)
}

/**
 * 创建图片降级加载逻辑
 * 用于 FallbackImage 组件内部
 */
export function useImageFallback() {
  const handleError = (
    e: Event,
    originCover?: string,
    coverUrl?: string
  ) => {
    const img = e.target as HTMLImageElement
    const currentSrc = img.src

    // 如果当前是 originCover 且加载失败，标记并降级
    if (originCover && currentSrc === originCover && coverUrl) {
      markOriginCoverFailed(originCover)
      img.src = coverUrl
    }
  }

  return {
    getImageUrl,
    getVideoUrl,
    handleImageError: handleError,
    markOriginCoverFailed,
    markOriginVideoFailed,
    hasOriginCoverFailed,
  }
}
