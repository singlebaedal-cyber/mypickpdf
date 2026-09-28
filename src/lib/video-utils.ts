/**
 * Video Compression and Processing Utilities
 * 100% Client-Side in-browser using HTML5 Canvas & MediaRecorder API
 * Zero server uploads for complete user privacy
 */

export type VideoCompressionLevel = "extreme" | "recommended" | "less";

export interface VideoCompressionOptions {
  level: VideoCompressionLevel;
  onProgress?: (percent: number) => void;
}

export interface VideoCompressionResult {
  blob: Blob;
  originalSize: number;
  compressedSize: number;
  ratio: number;
  format: string;
  downloadName: string;
  url: string;
}

/**
 * Detect best supported MIME type for video recording on the current browser
 */
export function getSupportedVideoMimeType(): { mimeType: string; ext: string } {
  if (typeof window === "undefined" || !("MediaRecorder" in window)) {
    return { mimeType: "video/webm", ext: "webm" };
  }

  const types = [
    { mime: "video/mp4;codecs=avc1.42E01E,mp4a.40.2", ext: "mp4" },
    { mime: "video/mp4;codecs=h264", ext: "mp4" },
    { mime: "video/mp4", ext: "mp4" },
    { mime: "video/webm;codecs=h264", ext: "mp4" },
    { mime: "video/webm;codecs=vp9,opus", ext: "webm" },
    { mime: "video/webm;codecs=vp8,opus", ext: "webm" },
    { mime: "video/webm", ext: "webm" },
  ];

  for (const t of types) {
    if (MediaRecorder.isTypeSupported(t.mime)) {
      return { mimeType: t.mime, ext: t.ext };
    }
  }

  return { mimeType: "", ext: "mp4" };
}

/**
 * Compress a video file using browser Canvas and MediaRecorder
 */
export async function compressVideo(
  file: File,
  options: VideoCompressionOptions
): Promise<VideoCompressionResult> {
  const { level, onProgress } = options;
  const originalSize = file.size;

  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "auto";
    video.autoplay = false;
    video.muted = true;
    video.playsInline = true;

    const fileUrl = URL.createObjectURL(file);
    video.src = fileUrl;

    const cleanup = () => {
      URL.revokeObjectURL(fileUrl);
      video.remove();
    };

    video.onerror = () => {
      cleanup();
      reject(new Error("동영상 파일을 읽을 수 없습니다. 지원되는 형식(MP4, MOV, WebM)인지 확인해 주세요."));
    };

    video.onloadedmetadata = async () => {
      try {
        const duration = video.duration;
        if (!duration || !isFinite(duration)) {
          cleanup();
          reject(new Error("동영상 재생 시간을 확인할 수 없습니다."));
          return;
        }

        let origW = video.videoWidth || 1280;
        let origH = video.videoHeight || 720;

        // Calculate target dimensions and bitrate based on compression level
        let maxDim = 1280;
        let targetBitrate = 2000000; // 2.0 Mbps
        let fps = 30;

        if (level === "extreme") {
          // 카카오톡 / 메일 전송용 (초강력 압축)
          maxDim = 720;
          targetBitrate = 900000; // 0.9 Mbps
          fps = 24;
        } else if (level === "recommended") {
          // 표준 밸런스 압축
          maxDim = 1080;
          targetBitrate = 1800000; // 1.8 Mbps
          fps = 30;
        } else {
          // 가벼운 압축 (고화질 유지)
          maxDim = 1920;
          targetBitrate = 3200000; // 3.2 Mbps
          fps = 30;
        }

        // Scale while preserving aspect ratio
        let targetW = origW;
        let targetH = origH;
        if (Math.max(origW, origH) > maxDim) {
          const scale = maxDim / Math.max(origW, origH);
          targetW = Math.round((origW * scale) / 2) * 2;
          targetH = Math.round((origH * scale) / 2) * 2;
        }

        const canvas = document.createElement("canvas");
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext("2d", { alpha: false });

        if (!ctx) {
          cleanup();
          reject(new Error("그래픽 렌더링 컨텍스트를 초기화할 수 없습니다."));
          return;
        }

        // Capture stream from canvas
        const stream = canvas.captureStream ? canvas.captureStream(fps) : (canvas as any).mozCaptureStream(fps);

        // Attempt audio capture via AudioContext
        let audioCtx: AudioContext | null = null;
        try {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContextClass) {
            audioCtx = new AudioContextClass();
            video.muted = false; // unmute internally for AudioContext source
            video.volume = 1.0;
            const source = audioCtx.createMediaElementSource(video);
            const dest = audioCtx.createMediaStreamDestination();
            source.connect(dest);
            const audioTracks = dest.stream.getAudioTracks();
            if (audioTracks.length > 0) {
              stream.addTrack(audioTracks[0]);
            }
          }
        } catch (e) {
          console.warn("Audio capture bypassed, recording video track only:", e);
          video.muted = true;
        }

        const { mimeType, ext } = getSupportedVideoMimeType();
        const recorderOptions: MediaRecorderOptions = {
          videoBitsPerSecond: targetBitrate,
        };
        if (mimeType) {
          recorderOptions.mimeType = mimeType;
        }

        let mediaRecorder: MediaRecorder;
        try {
          mediaRecorder = new MediaRecorder(stream, recorderOptions);
        } catch (e) {
          // Fallback to basic media recorder without custom mimeType
          mediaRecorder = new MediaRecorder(stream, { videoBitsPerSecond: targetBitrate });
        }

        const chunks: Blob[] = [];
        mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            chunks.push(e.data);
          }
        };

        mediaRecorder.onstop = () => {
          try {
            if (audioCtx && audioCtx.state !== "closed") {
              audioCtx.close();
            }
          } catch (e) {}

          const compressedBlob = new Blob(chunks, { type: mediaRecorder.mimeType || "video/mp4" });
          const compressedSize = compressedBlob.size;
          const ratio = Math.max(0, Math.round((1 - compressedSize / originalSize) * 100));

          const baseName = file.name.replace(/\.[^/.]+$/, "");
          const downloadName = `${baseName}_compressed.${ext}`;
          const resultUrl = URL.createObjectURL(compressedBlob);

          cleanup();
          resolve({
            blob: compressedBlob,
            originalSize,
            compressedSize,
            ratio,
            format: ext,
            downloadName,
            url: resultUrl,
          });
        };

        mediaRecorder.start(100);

        // Frame rendering loop
        let isCancelled = false;
        video.currentTime = 0;
        
        const renderFrame = () => {
          if (isCancelled) return;

          if (video.ended || video.currentTime >= duration - 0.05) {
            if (onProgress) onProgress(100);
            mediaRecorder.stop();
            return;
          }

          ctx.drawImage(video, 0, 0, targetW, targetH);
          const currentPercent = Math.min(99, Math.round((video.currentTime / duration) * 100));
          if (onProgress) onProgress(currentPercent);

          requestAnimationFrame(renderFrame);
        };

        // Start playing video
        video.play().then(() => {
          requestAnimationFrame(renderFrame);
        }).catch((err) => {
          isCancelled = true;
          cleanup();
          reject(new Error("동영상 인코딩 재생 실패: 브라우저 재생 권한을 확인해 주세요."));
        });

      } catch (err: any) {
        cleanup();
        reject(err);
      }
    };
  });
}

/**
 * Trigger browser file download from Blob
 */
export function downloadVideoBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
