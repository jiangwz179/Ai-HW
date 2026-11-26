import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, X, Check } from 'lucide-react';
import { playShutterSound } from '../utils/audio';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64Data: string, mimeType: string) => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setCapturedPreview(null);
      setErrorMsg(null);
      return;
    }
    startCamera();
    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    stopCamera();
    setErrorMsg(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 960 },
        },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.warn('Camera access denied or unavailable:', err);
      setErrorMsg('無法存取您的相機鏡頭，請確認瀏覽器相機權限已開啟，或改用相片上傳。');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
  };

  const switchCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const takeSnapshot = () => {
    if (!videoRef.current) return;
    playShutterSound();

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 800;
    canvas.height = video.videoHeight || 600;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedPreview(dataUrl);
    }
  };

  const confirmSnapshot = () => {
    if (!capturedPreview) return;
    const base64Data = capturedPreview.split(',')[1];
    onCapture(base64Data, 'image/jpeg');
    onClose();
  };

  const retake = () => {
    setCapturedPreview(null);
    if (!stream) {
      startCamera();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#0e101a] border border-cyan-500/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-slate-900/80">
          <div className="flex items-center space-x-2">
            <Camera className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold tracking-wide text-white">拍攝餐點或菜單・多模態影像採樣</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative aspect-[4/3] bg-black flex items-center justify-center overflow-hidden">
          {errorMsg ? (
            <div className="p-6 text-center text-slate-400 text-xs">
              <p className="text-rose-400 font-bold mb-2">相機存取受限</p>
              <p>{errorMsg}</p>
            </div>
          ) : capturedPreview ? (
            <img src={capturedPreview} alt="Snapshot preview" className="w-full h-full object-cover" />
          ) : (
            <>
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              <div className="absolute inset-8 border border-white/20 rounded-2xl pointer-events-none flex flex-col justify-between p-3">
                <div className="flex justify-between">
                  <div className="w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
                  <div className="w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
                </div>
                <div className="text-center text-[10px] tracking-widest text-cyan-400/80 uppercase font-mono">
                  ✦ MEAL OR MENU SCAN [7][8] ✦
                </div>
                <div className="flex justify-between">
                  <div className="w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
                  <div className="w-4 h-4 border-b-2 border-r-2 border-cyan-400" />
                </div>
              </div>
            </>
          )}
        </div>

        <div className="p-4 bg-slate-900/90 border-t border-white/10 flex items-center justify-between">
          {!capturedPreview ? (
            <>
              <button
                type="button"
                onClick={switchCamera}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 flex items-center gap-1.5 transition"
                title="切換前後鏡頭"
              >
                <RefreshCw className="w-4 h-4 text-cyan-400" />
                <span className="hidden sm:inline">切換鏡頭</span>
              </button>

              <button
                type="button"
                onClick={takeSnapshot}
                className="w-14 h-14 rounded-full border-4 border-white bg-gradient-to-tr from-emerald-400 to-cyan-400 shadow-lg hover:scale-105 active:scale-95 transition flex items-center justify-center cursor-pointer"
                title="按下快門"
              >
                <div className="w-6 h-6 rounded-full bg-white" />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="text-xs text-slate-400 hover:text-white px-3 py-2"
              >
                取消
              </button>
            </>
          ) : (
            <div className="w-full flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={retake}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700 flex items-center justify-center gap-1.5 transition font-bold"
              >
                <RefreshCw className="w-4 h-4" />
                <span>重拍照片</span>
              </button>
              <button
                type="button"
                onClick={confirmSnapshot}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:brightness-110 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 shadow-lg transition"
              >
                <Check className="w-4 h-4" />
                <span>確認用於分析</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
