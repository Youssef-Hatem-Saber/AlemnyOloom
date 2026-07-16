import React, { useState } from "react";
import { Lock, User, AlertCircle, Sparkles } from "lucide-react";
import { API_BASE_URL } from "../utils/api";

interface LoginViewProps {
  onLoginSuccess: (user: any, token: string, role: string) => void;
  navigateTo: (path: string) => void;
}

export default function LoginView({ onLoginSuccess, navigateTo }: LoginViewProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check if redirect has error param (e.g. from force logout)
  const queryParams = new URLSearchParams(window.location.search);
  const errorParam = queryParams.get("error");
  const anotherDeviceMsg = errorParam === "another_device" 
    ? "⚠️ تم تسجيل خروجك لأن حسابك فُتح من جهاز آخر في نفس الوقت." 
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("يرجى إدخال اسم المستخدم وكلمة المرور.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "فشل تسجيل الدخول. يرجى التحقق من البيانات.");
      }

      // Save credentials in LocalStorage based on role
      const userRole = data.user.role;
      if (userRole === "student") {
        localStorage.setItem("ao_student_token", data.token);
        localStorage.setItem("ao_student_user", JSON.stringify(data.user));
      } else if (userRole === "lecturer") {
        localStorage.setItem("ao_lecturer_token", data.token);
        localStorage.setItem("ao_lecturer_user", JSON.stringify(data.user));
      } else if (userRole === "admin") {
        localStorage.setItem("ao_admin_token", data.token);
        localStorage.setItem("ao_admin_user", JSON.stringify(data.user));
        // Also log into administrative session storage
        sessionStorage.setItem("ao_admin_auth", "true");
      }

      onLoginSuccess(data.user, data.token, userRole);
      
      // Clean query params
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Redirect to dashboard
      navigateTo("/dashboard");
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء الاتصال بالخادم.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-10 px-4" dir="rtl">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-right">
        {/* Background decors */}
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 text-center space-y-3 mb-8">
          <div className="w-16 h-16 bg-blue-600/10 border-2 border-blue-500 rounded-2xl flex items-center justify-center text-3xl mx-auto shadow-lg shadow-blue-500/20">
            🔐
          </div>
          <h2 className="text-2xl font-black text-white">تسجيل الدخول للمنصة</h2>
          <p className="text-xs text-slate-400">سجل الدخول لمتابعة محاضراتك التفاعلية والبث المباشر</p>
        </div>

        {anotherDeviceMsg && (
          <div className="mb-5 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-2xl p-4 text-xs font-bold leading-relaxed">
            {anotherDeviceMsg}
          </div>
        )}

        {error && (
          <div className="mb-5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl p-4 text-xs font-bold flex items-start gap-2 leading-relaxed">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-300 font-bold">اسم المستخدم *</label>
            <div className="relative">
              <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="أدخل اسم المستخدم الخاص بك..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-10 pl-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-right"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-300 font-bold">كلمة المرور *</label>
            <div className="relative">
              <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كلمة المرور الخاصة بك..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-10 pl-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-right"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 mt-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-extrabold rounded-xl text-sm transition-all shadow-lg shadow-blue-500/20 active:translate-y-[1px] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span>جاري التحقق من البيانات...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-blue-200 animate-pulse" />
                <span>دخول الحساب الآمن</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-5 border-t border-slate-800 text-center text-xs text-slate-500">
          منصة علمني علوم الآمنة - محمية ضد الدخول المتعدد
        </div>
      </div>
    </div>
  );
}
