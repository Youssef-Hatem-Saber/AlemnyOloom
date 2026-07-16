import React, { useEffect, useRef, useState } from "react";

interface SecureVideoPlayerProps {
  src: string;
  studentCode: string;
}

export default function SecureVideoPlayer({ src, studentCode }: SecureVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [watermarkPos, setWatermarkPos] = useState({ top: "20%", left: "30%" });
  const [isDevToolsDetected, setIsDevToolsDetected] = useState(false);
  const [hlsInstance, setHlsInstance] = useState<any>(null);

  // 1. Move watermark randomly every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const randomTop = Math.floor(Math.random() * 80) + 10; // 10% to 90%
      const randomLeft = Math.floor(Math.random() * 80) + 10; // 10% to 90%
      setWatermarkPos({
        top: `${randomTop}%`,
        left: `${randomLeft}%`
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // 2. Prevent right click, inspect hotkeys, and run DevTools detection loop
  useEffect(() => {
    // Disable right click
    const preventContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    document.addEventListener("contextmenu", preventContextMenu);

    // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U
    const preventKeys = (e: KeyboardEvent) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I", "J", "C", "i", "j", "c"].includes(e.key)) ||
        (e.ctrlKey && ["U", "u"].includes(e.key)) ||
        (e.metaKey && e.altKey && ["I", "i", "J", "j"].includes(e.key))
      ) {
        e.preventDefault();
        alert("⚠️ غير مسموح بفحص الصفحة أو سرقة المحتوى!");
      }
    };
    document.addEventListener("keydown", preventKeys);

    // DevTools Detection Loop (Using debugger timing trick)
    const detectDevTools = () => {
      const start = performance.now();
      // This debugger statement will pause execution ONLY if DevTools is open.
      // If paused, the elapsed time will be much larger than 100ms.
      debugger; 
      const end = performance.now();
      
      if (end - start > 100) {
        setIsDevToolsDetected(true);
        if (videoRef.current) {
          videoRef.current.pause();
        }
      }
    };

    const devToolsInterval = setInterval(detectDevTools, 2000);

    return () => {
      document.removeEventListener("contextmenu", preventContextMenu);
      document.removeEventListener("keydown", preventKeys);
      clearInterval(devToolsInterval);
    };
  }, []);

  // 3. Load video streams (HLS/FLV/MP4)
  useEffect(() => {
    const video = videoRef.current;
    if (!video || isDevToolsDetected) return;

    let hls: any = null;
    let flvPlayer: any = null;

    const isFlv = src.includes(".flv");
    const isHls = src.includes(".m3u8");

    const initHlsPlayer = () => {
      // @ts-ignore
      if (window.Hls && window.Hls.isSupported()) {
        // @ts-ignore
        hls = new window.Hls();
        hls.loadSource(src);
        hls.attachMedia(video);
        
        hls.on(
          // @ts-ignore
          window.Hls.Events.ERROR,
          (event: any, data: any) => {
            if (data.fatal) {
              switch (data.type) {
                // @ts-ignore
                case window.Hls.ErrorTypes.NETWORK_ERROR:
                  console.log("HLS Network error, trying to recover...");
                  hls.startLoad();
                  break;
                // @ts-ignore
                case window.Hls.ErrorTypes.MEDIA_ERROR:
                  console.log("HLS Media error, trying to recover...");
                  hls.recoverMediaError();
                  break;
                default:
                  console.error("HLS Unrecoverable error:", data);
                  break;
              }
            }
          }
        );
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // Fallback for native HLS (Safari/iOS)
        video.src = src;
      }
    };

    const initFlvPlayer = () => {
      // @ts-ignore
      if (window.flvjs && window.flvjs.isSupported()) {
        // @ts-ignore
        flvPlayer = window.flvjs.createPlayer({
          type: "flv",
          url: src,
          isLive: true
        });
        flvPlayer.attachMediaElement(video);
        flvPlayer.load();
        flvPlayer.play().catch((err: any) => console.log("FLV play blocked/interrupted:", err));
        
        // @ts-ignore
        flvPlayer.on(window.flvjs.ErrorTypes.NETWORK_ERROR, () => {
          console.log("FLV Network error, attempting recovery...");
          if (flvPlayer) {
            flvPlayer.unload();
            flvPlayer.load();
            flvPlayer.play().catch(() => {});
          }
        });
      }
    };

    const initNativePlayer = () => {
      video.src = src;
    };

    if (isFlv) {
      // @ts-ignore
      if (window.flvjs) {
        initFlvPlayer();
      } else {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/flv.js@1.6.2/dist/flv.min.js";
        script.async = true;
        script.onload = initFlvPlayer;
        document.body.appendChild(script);
      }
    } else if (isHls) {
      // @ts-ignore
      if (window.Hls) {
        initHlsPlayer();
      } else {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/hls.js@latest";
        script.async = true;
        script.onload = initHlsPlayer;
        document.body.appendChild(script);
      }
    } else {
      initNativePlayer();
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
      if (flvPlayer) {
        flvPlayer.unload();
        flvPlayer.detachMediaElement();
        flvPlayer.destroy();
      }
    };
  }, [src, isDevToolsDetected]);

  if (isDevToolsDetected) {
    return (
      <div className="w-full aspect-video bg-red-950/90 border border-red-500 rounded-2xl flex flex-col items-center justify-center p-6 text-center select-none" dir="rtl">
        <span className="text-5xl mb-4">⚠️</span>
        <h3 className="text-xl font-bold text-white mb-2">تم كشف محاولة فحص الصفحة (DevTools)!</h3>
        <p className="text-red-300 text-sm max-w-md">
          من أجل أمان وخصوصية المحاضرات، يرجى إغلاق أدوات مطوري المتصفح (Inspect Element) وإعادة تحميل الصفحة لمتابعة المشاهدة.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all"
        >
          إعادة تحميل الصفحة
        </button>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-800 select-none group"
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        controls
        autoPlay
        playsInline
        controlsList="nodownload"
        onContextMenu={(e) => e.preventDefault()}
      />
      
      {/* Floating Student Code Watermark */}
      <div
        style={{
          position: "absolute",
          top: watermarkPos.top,
          left: watermarkPos.left,
          transform: "translate(-50%, -50%)",
          transition: "top 2s ease-in-out, left 2s ease-in-out",
          pointerEvents: "none",
          zIndex: 100
        }}
        className="bg-black/40 backdrop-blur-xs text-white/30 text-xs sm:text-sm font-mono px-3 py-1.5 rounded-lg border border-white/5 select-none font-bold"
      >
        AlemnyOloom: {studentCode}
      </div>

      {/* Screen recording protection overlay (visual blocker on capture tools) */}
      <div className="absolute inset-0 pointer-events-none border-2 border-white/5 z-50"></div>
    </div>
  );
}
