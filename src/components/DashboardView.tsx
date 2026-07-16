import React, { useState, useEffect, useRef } from "react";
import { 
  BookOpen, Video, Users, LogOut, MessageSquare, Send, Sparkles, 
  Clock, PlayCircle, Lock, ShieldAlert, Key, Clipboard, Check 
} from "lucide-react";
import { apiRequest, getSocket, disconnectSocket, LIVE_STREAM_BASE_URL } from "../utils/api";
import SecureVideoPlayer from "./SecureVideoPlayer";

interface DashboardViewProps {
  user: any;
  onLogout: () => void;
}

export default function DashboardView({ user, onLogout }: DashboardViewProps) {
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [lectures, setLectures] = useState<any[]>([]);
  const [activeLecture, setActiveLecture] = useState<any | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lecturer specific state
  const [streamInfo, setStreamInfo] = useState<any | null>(null);
  const [newLectureTitle, setNewLectureTitle] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingMessage, setProcessingMessage] = useState("");

  const chatEndRef = useRef<HTMLDivElement>(null);

  // 1. Fetch courses based on role
  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const endpoint = user.role === "student" ? "/api/student/courses" : "/api/lecturer/courses";
        const data = await apiRequest(endpoint, "GET");
        setCourses(data);
      } catch (err: any) {
        setError("فشل تحميل الكورسات. يرجى التحقق من اتصال الإنترنت.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, [user]);

  // Listen for recording ready event via socket
  useEffect(() => {
    const socket = getSocket();
    if (socket) {
      const handleRecordingReady = (data: any) => {
        console.log("Lecture recording ready event received:", data);
        setProcessingProgress(100);
        setProcessingMessage("اكتمل دمج ومعالجة المحاضرة بنجاح وحفظها محلياً!");
        
        setTimeout(() => {
          setIsProcessing(false);
          setActiveLecture(null);
          // Refresh list of lectures
          if (selectedCourse) {
            handleSelectCourse(selectedCourse);
          }
        }, 1500);
      };

      socket.on("lecture_recording_ready", handleRecordingReady);
      return () => {
        socket.off("lecture_recording_ready", handleRecordingReady);
      };
    }
  }, [selectedCourse, activeLecture]);

  // 2. Fetch lectures when a course is selected
  const handleSelectCourse = async (course: any) => {
    setSelectedCourse(course);
    setActiveLecture(null);
    setLectures([]);
    setIsLoading(true);
    try {
      const data = await apiRequest(`/api/student/courses/${course._id}/lectures`, "GET");
      setLectures(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Connect to Chat and get history when a lecture is opened
  useEffect(() => {
    if (!activeLecture) {
      setChatMessages([]);
      return;
    }

    const loadChatAndConnect = async () => {
      try {
        // Fetch chat history
        const history = await apiRequest(`/api/student/lectures/${activeLecture._id}/chat`, "GET");
        setChatMessages(history);

        // Connect Socket
        const socket = getSocket();
        if (socket) {
          socket.emit("join_lecture", { lectureId: activeLecture._id });
          
          socket.off("receive_message"); // Prevent duplicate listeners
          socket.on("receive_message", (msg: any) => {
            setChatMessages((prev) => [...prev, msg]);
          });
        }
      } catch (err) {
        console.error("Chat loading or socket connection error:", err);
      }
    };

    loadChatAndConnect();

    return () => {
      // Disconnect socket logic or clean listeners
      const socket = getSocket();
      if (socket) {
        socket.off("receive_message");
      }
    };
  }, [activeLecture]);

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Send Message Handler
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeLecture) return;

    const socket = getSocket();
    if (socket) {
      socket.emit("send_message", {
        lectureId: activeLecture._id,
        message: newMessage.trim()
      });
      setNewMessage("");
    }
  };

  // --- LECTURER ACTIONS ---
  
  // Create New Lecture Slot
  const handleCreateLecture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLectureTitle.trim() || !selectedCourse) return;

    try {
      const data = await apiRequest("/api/admin/lectures", "POST", {
        courseId: selectedCourse._id,
        title: newLectureTitle.trim()
      });
      setLectures([data, ...lectures]);
      setNewLectureTitle("");
    } catch (err) {
      alert("فشل إضافة المحاضرة.");
    }
  };

  // Start Live Stream (Lecturer)
  const handleStartLive = async (lecture: any) => {
    try {
      const data = await apiRequest("/api/lecturer/lectures/start", "POST", {
        lectureId: lecture._id
      });
      setStreamInfo(data);
      // Update local state
      setLectures(lectures.map(l => l._id === lecture._id ? { ...l, isLive: true, streamKey: data.streamKey } : l));
      setActiveLecture({ ...lecture, isLive: true, streamKey: data.streamKey });
    } catch (err) {
      alert("فشل بدء البث المباشر.");
    }
  };

  // End Live Stream (Lecturer)
  const handleEndLive = async (lecture: any) => {
    if (!confirm("هل أنت متأكد من رغبتك في إنهاء المحاضرة والبث المباشر؟")) return;

    // Initialize progress loader
    setProcessingProgress(10);
    setProcessingMessage("جاري إرسال طلب إنهاء البث المباشر للخادم...");
    setIsProcessing(true);

    try {
      await apiRequest("/api/lecturer/lectures/end", "POST", {
        lectureId: lecture._id
      });
      
      setStreamInfo(null);
      // Update local state
      setLectures(lectures.map(l => l._id === lecture._id ? { ...l, isLive: false } : l));
      
      // Start simulated progress updates while merging is in progress
      setProcessingProgress(25);
      setProcessingMessage("تم إنهاء البث بنجاح؛ جاري استخلاص أجزاء البث المؤقتة...");
      
      const interval = setInterval(() => {
        setProcessingProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          if (prev > 45 && prev < 75) {
            setProcessingMessage("جاري دمج أجزاء البث وتحويلها إلى صيغة MP4...");
          } else if (prev >= 75) {
            setProcessingMessage("جاري تأمين ملف الفيديو وحفظه في مجلد الكورس الآمن...");
          }
          return prev + 3;
        });
      }, 300);
    } catch (err) {
      setIsProcessing(false);
      alert("فشل إنهاء البث المباشر.");
    }
  };

  const handleCopyClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-8" dir="rtl">
      
      {/* 1. Header user bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl text-right relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 bg-blue-600/10 border-2 border-blue-500/30 rounded-2xl flex items-center justify-center text-2xl font-bold">
            👤
          </div>
          <div>
            <h2 className="text-xl font-black">{user.role === "student" ? `كود الطالب: ${user.studentCode}` : user.name}</h2>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 justify-start">
              <span>دور الحساب: {user.role === "student" ? "طالب مشترك" : "محاضر"}</span>
              {user.studentCode && user.role !== "student" && (
                <>
                  <span className="text-slate-700">•</span>
                  <span className="font-mono bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded text-blue-300">
                    كود الطالب: {user.studentCode}
                  </span>
                </>
              )}
            </p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="bg-red-950/40 hover:bg-red-950/70 border border-red-500/20 hover:border-red-500/40 text-red-300 font-bold px-4 py-2.5 rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer relative z-10"
        >
          <LogOut className="w-4 h-4" />
          <span>تسجيل خروج آمن</span>
        </button>
      </div>

      {/* 2. Main content view splits */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* RIGHT COLUMN: Sidebar (Courses & Lecture list) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* A. Courses Selection */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
              <BookOpen className="w-5 h-5 text-blue-500" />
              كورساتك التعليمية
            </h3>

            {isLoading && courses.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">جاري التحميل...</p>
            ) : courses.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">
                {user.role === "student" 
                  ? "لا يوجد كورسات مشترك بها حالياً. يرجى التواصل مع الإدارة للتفعيل بكود الطالب الخاص بك."
                  : "لم يتم تعيين أي كورس لك بعد بواسطة المدير."}
              </p>
            ) : (
              <div className="space-y-2">
                {courses.map((course) => (
                  <button
                    key={course._id}
                    onClick={() => handleSelectCourse(course)}
                    className={`w-full text-right p-3.5 rounded-2xl border transition-all text-sm flex items-center justify-between cursor-pointer ${
                      selectedCourse?._id === course._id
                        ? "bg-blue-50/50 border-blue-500 text-blue-900 font-bold"
                        : "border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span>{course.title}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-bold">
                      {course.category}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* B. Lectures selection for selected course */}
          {selectedCourse && (
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Video className="w-5 h-5 text-blue-500" />
                  محاضرات الكورس
                </h3>
                {user.role === "lecturer" && (
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded font-bold">
                    لوحة البث
                  </span>
                )}
              </div>

              {/* Add Lecture form (Lecturer / Admin only) */}
              {user.role === "lecturer" && (
                <form onSubmit={handleCreateLecture} className="flex gap-2 mb-3">
                  <input
                    type="text"
                    required
                    value={newLectureTitle}
                    onChange={(e) => setNewLectureTitle(e.target.value)}
                    placeholder="عنوان محاضرة جديدة..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-sm cursor-pointer whitespace-nowrap"
                  >
                    إضافة
                  </button>
                </form>
              )}

              {lectures.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">لا يوجد محاضرات مضافة بعد في هذا الكورس.</p>
              ) : (
                <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                  {lectures.map((lecture) => (
                    <div
                      key={lecture._id}
                      className={`p-3 rounded-2xl border transition-all flex flex-col gap-2.5 ${
                        activeLecture?._id === lecture._id
                          ? "bg-slate-900 border-slate-800 text-white"
                          : "border-slate-100 bg-slate-50/50 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 text-right">
                        <span className="text-xs font-extrabold line-clamp-2">{lecture.title}</span>
                        {lecture.isLive ? (
                          <span className="bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full animate-pulse whitespace-nowrap shrink-0">
                            مباشر الآن
                          </span>
                        ) : lecture.videoUrl ? (
                          <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">
                            مسجلة S3
                          </span>
                        ) : (
                          <span className="bg-slate-200 text-slate-600 text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">
                            غير مبثوثة
                          </span>
                        )}
                      </div>

                      {/* Controls and viewing options */}
                      <div className="flex items-center justify-between border-t border-slate-200/20 pt-2 text-[11px] font-sans">
                        <span className="text-slate-400 font-mono text-[9px]">
                          {new Date(lecture.createdAt).toLocaleDateString("ar-EG")}
                        </span>

                        <div className="flex gap-1.5">
                          {/* Student view controls */}
                          {user.role === "student" && (
                            <>
                              {lecture.isLive && (
                                <button
                                  onClick={() => setActiveLecture(lecture)}
                                  className="bg-red-600 hover:bg-red-700 text-white font-extrabold px-3 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                                >
                                  <PlayCircle className="w-3.5 h-3.5" />
                                  <span>دخول البث</span>
                                </button>
                              )}
                              {!lecture.isLive && lecture.videoUrl && (
                                <button
                                  onClick={() => setActiveLecture(lecture)}
                                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                                >
                                  <PlayCircle className="w-3.5 h-3.5" />
                                  <span>شاهد المسجل</span>
                                </button>
                              )}
                              {!lecture.isLive && !lecture.videoUrl && (
                                <span className="text-slate-400 flex items-center gap-1">
                                  <Lock className="w-3.5 h-3.5" />
                                  مغلق
                                </span>
                              )}
                            </>
                          )}

                          {/* Lecturer controls */}
                          {user.role === "lecturer" && (
                            <>
                              {!lecture.isLive && !lecture.videoUrl && (
                                <button
                                  onClick={() => handleStartLive(lecture)}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                                >
                                  <span>بدء لايف</span>
                                </button>
                              )}
                              {lecture.isLive && (
                                <button
                                  onClick={() => handleEndLive(lecture)}
                                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                                >
                                  <span>إنهاء لايف</span>
                                </button>
                              )}
                              {!lecture.isLive && lecture.videoUrl && (
                                <button
                                  onClick={() => setActiveLecture(lecture)}
                                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                                >
                                  <span>معاينة المسجل</span>
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* LEFT COLUMN: Player & Chat Interface */}
        <div className="lg:col-span-8 space-y-6">
          {activeLecture ? (
            <div className="space-y-6">
              
              {/* Active Lecture Header */}
              <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 shadow-lg text-right flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black">{activeLecture.title}</h3>
                    {activeLecture.isLive ? (
                      <span className="bg-red-600 text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase animate-pulse">
                        بث مباشر فوري
                      </span>
                    ) : (
                      <span className="bg-blue-600 text-white text-[9px] font-bold px-2.5 py-1 rounded-full">
                        محاضرة مسجلة
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">المادة: {selectedCourse?.title}</p>
                </div>
                
                <button
                  onClick={() => setActiveLecture(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  إغلاق المشاهدة
                </button>
              </div>

              {/* Secure Player Area */}
              <div className="space-y-2">
                {activeLecture.isLive ? (
                  // Node-Media-Server plays HLS streams on: http://host:8000/live/streamKey/index.m3u8
                  <SecureVideoPlayer 
                    src={`${LIVE_STREAM_BASE_URL}/${activeLecture.streamKey}/index.m3u8`} 
                    studentCode={user.studentCode || `Lecturer: ${user.name}`} 
                  />
                ) : activeLecture.videoUrl ? (
                  // Plays recorded video from AWS S3
                  <SecureVideoPlayer 
                    src={`${activeLecture.videoUrl}?token=${encodeURIComponent(
                      localStorage.getItem("ao_student_token") || 
                      localStorage.getItem("ao_lecturer_token") || 
                      localStorage.getItem("ao_admin_token") || ""
                    )}`} 
                    studentCode={user.studentCode || `Lecturer: ${user.name}`} 
                  />
                ) : (
                  <div className="w-full aspect-video bg-slate-950 border border-slate-800 rounded-2xl flex flex-col items-center justify-center p-6 text-center text-slate-400">
                    محاضرة فارغة
                  </div>
                )}
              </div>

              {/* OBS SETUP CARD (Only for Lecturer who started a Live stream) */}
              {user.role === "lecturer" && activeLecture.isLive && streamInfo && (
                <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-5 shadow-xl space-y-4 text-right">
                  <h4 className="text-sm font-black text-amber-400 flex items-center gap-1.5">
                    <Key className="w-4 h-4" />
                    بيانات إعداد البث في برنامج OBS Studio
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    من أجل بدء الشرح للطلاب، يرجى نسخ هذه البيانات ووضعها في برنامج OBS (Settings - Stream):
                  </p>
                  
                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex flex-col gap-1">
                      <span className="text-slate-500 font-sans font-bold">عنوان خادم البث (Server URL):</span>
                      <div className="flex gap-2 bg-slate-950 border border-slate-800 p-2.5 rounded-xl items-center justify-between">
                        <span className="text-emerald-400 overflow-x-auto text-left select-all">{streamInfo.streamUrl}</span>
                        <button
                          onClick={() => handleCopyClipboard(streamInfo.streamUrl)}
                          className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                        >
                          {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Clipboard className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-slate-500 font-sans font-bold">مفتاح البث (Stream Key):</span>
                      <div className="flex gap-2 bg-slate-950 border border-slate-800 p-2.5 rounded-xl items-center justify-between">
                        <span className="text-amber-400 overflow-x-auto text-left select-all">{streamInfo.streamKey}</span>
                        <button
                          onClick={() => handleCopyClipboard(streamInfo.streamKey)}
                          className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                        >
                          {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Clipboard className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-500/10 border border-amber-500/20 text-amber-300 p-3.5 rounded-2xl text-[11px] font-sans leading-relaxed">
                    🚨 **هام:** بمجرد الضغط على "Start Streaming" في OBS، سيبدأ البث فوراً ويظهر لجميع الطلاب المشتركين.
                  </div>
                </div>
              )}

              {/* SYNCHRONOUS CHAT PANEL */}
              <div className="bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col h-[400px]">
                
                {/* Chat Header */}
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-blue-500" />
                    شات المحاضرة المباشر
                  </h4>
                  <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold animate-pulse">
                    فوري متزامن
                  </span>
                </div>

                {/* Messages List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
                  {chatMessages.map((msg) => (
                    <div 
                      key={msg._id || msg.createdAt} 
                      className={`flex flex-col text-right max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
                        msg.senderRole === "admin" 
                          ? "bg-amber-50 border border-amber-100 mr-0 ml-auto" 
                          : msg.senderRole === "lecturer"
                          ? "bg-emerald-50 border border-emerald-100 mr-0 ml-auto"
                          : "bg-slate-50 border border-slate-100 ml-0 mr-auto"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold mb-1">
                        <span className={
                          msg.senderRole === "admin" 
                            ? "text-amber-700" 
                            : msg.senderRole === "lecturer"
                            ? "text-emerald-700"
                            : "text-slate-800"
                        }>
                          {msg.senderName}
                        </span>
                        
                        <span className="text-[9px] opacity-60 font-normal">
                          ({msg.senderRole === "admin" ? "مدير" : msg.senderRole === "lecturer" ? "محاضر" : "طالب"})
                        </span>

                        {msg.studentCode && (
                          <span className="text-[8px] bg-slate-200 text-slate-700 px-1 py-0.2 rounded font-mono font-bold">
                            {msg.studentCode}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-700 break-words font-sans">{msg.message}</p>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                {/* Message input */}
                <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 flex gap-2">
                  <input
                    type="text"
                    required
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="اكتب رسالتك هنا في الشات الفوري..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-right"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 flex items-center justify-center cursor-pointer transition-colors shadow-sm"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

              </div>

            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-white text-center shadow-xl space-y-4 select-none relative overflow-hidden h-[500px] flex flex-col items-center justify-center">
              <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>
              <div className="w-20 h-20 bg-blue-600/10 border-2 border-blue-500/20 rounded-full flex items-center justify-center text-4xl mx-auto shadow-xl animate-bounce">
                🎓
              </div>
              <h3 className="text-xl font-black">أهلاً بك في منصة المحاضرات التفاعلية</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                يرجى تحديد كورس من القائمة الجانبية ثم اختيار المحاضرة المطلوبة لبدء مشاهدة البث المباشر أو المحاضرات المسجلة.
              </p>
            </div>
          )}
        </div>
      </div>

      {isProcessing && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 text-center">
            <div className="w-16 h-16 bg-blue-600/10 border-2 border-blue-500 rounded-2xl flex items-center justify-center text-3xl mx-auto shadow-lg shadow-blue-500/20 animate-spin">
              ⚙️
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-black text-white">جاري معالجة المحاضرة المسجلة</h3>
              <p className="text-xs text-slate-400 font-medium">{processingMessage}</p>
            </div>
            
            <div className="space-y-1">
              <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden p-[2px] border border-slate-800">
                <div 
                  style={{ width: `${processingProgress}%` }}
                  className="bg-gradient-to-r from-blue-600 to-indigo-500 h-full rounded-full transition-all duration-300 shadow-md shadow-blue-500/30"
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-bold px-1">
                <span>{processingProgress}%</span>
                <span>تحديث فوري</span>
              </div>
            </div>
            
            <div className="text-[10px] text-amber-400 font-bold leading-normal bg-amber-500/5 border border-amber-500/10 rounded-xl p-3 text-right">
              ⚠️ يرجى عدم إغلاق هذه الصفحة أو المتصفح حتى يتم الانتهاء تماماً وتخزين الملف بشكل آمن.
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
