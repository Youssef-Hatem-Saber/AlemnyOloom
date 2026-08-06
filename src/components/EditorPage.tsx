import React, { useState } from 'react';
import { 
  Code, 
  Eye, 
  Download, 
  Copy, 
  Trash2, 
  ArrowRight, 
  Sparkles, 
  HelpCircle,
  Laptop,
  CheckCircle,
  ExternalLink
} from 'lucide-react';

interface EditorPageProps {
  onNavigateHome: () => void;
}

export default function EditorPage({ onNavigateHome }: EditorPageProps) {
  const [code, setCode] = useState(`<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>صفحتي الأولى</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      color: #333;
      margin: 0;
      padding: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
    }
    .card {
      background: white;
      border-radius: 20px;
      padding: 2.5rem;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      max-width: 500px;
      text-align: center;
      border: 1px solid rgba(255,255,255,0.8);
    }
    h1 {
      color: #2563eb;
      margin-bottom: 1rem;
      font-size: 2.2rem;
    }
    p {
      line-height: 1.6;
      color: #555;
    }
    .badge {
      display: inline-block;
      background: #dbeafe;
      color: #2563eb;
      padding: 0.5rem 1rem;
      border-radius: 9999px;
      font-weight: bold;
      margin-top: 1.5rem;
    }
  </style>
</head>
<body>

  <div class="card">
    <h1>أهلاً بك في أكاديمية علّمني علوم! 🚀</h1>
    <p>هذا هو محرر الأكواد التفاعلي المباشر. يمكنك تعديل هذا الكود أو كتابة كود جديد بالكامل ومشاهدة النتيجة تظهر فوراً في لوحة المعاينة بالأسفل.</p>
    <div class="badge">مسار تطوير الويب web01</div>
  </div>

</body>
</html>`);

  const [copied, setCopied] = useState(false);

  // Helper code snippets
  const injectSnippet = (type: string) => {
    let snippet = '';
    if (type === 'base') {
      snippet = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>عنوان الصفحة</title>
</head>
<body>
  <h1>عنوان رئيسي</h1>
  <p>اكتب محتوى الفقرة هنا...</p>
</body>
</html>`;
    } else if (type === 'card') {
      snippet = `\n  <div style="background:#fff; border:1px solid #ddd; border-radius:12px; padding:20px; margin:10px 0; box-shadow:0 4px 6px rgba(0,0,0,0.05);">
    <h3 style="color:#2563eb; margin-top:0;">عنوان الكارت</h3>
    <p style="color:#666; font-size:14px;">هذا النص يمثل محتوى داخل كارت بتصميم أنيق وبسيط.</p>
  </div>\n`;
    } else if (type === 'button') {
      snippet = `\n  <button style="background:#2563eb; color:#fff; border:none; padding:10px 20px; border-radius:8px; font-weight:bold; cursor:pointer; font-size:14px; transition:0.2s;" onclick="alert('تم الضغط على الزر!')">اضغط هنا</button>\n`;
    } else if (type === 'image') {
      snippet = `\n  <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=400" alt="Work space" style="width:100%; max-width:400px; border-radius:12px; margin:10px 0;">\n`;
    } else if (type === 'table') {
      snippet = `\n  <table style="width:100%; border-collapse:collapse; margin:15px 0; text-align:right;">
    <thead>
      <tr style="background:#f1f5f9; border-bottom:2px solid #cbd5e1;">
        <th style="padding:10px;">المادة</th>
        <th style="padding:10px;">الدرجة</th>
        <th style="padding:10px;">التقدير</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom:1px solid #e2e8f0;">
        <td style="padding:10px;">أساسيات الويب</td>
        <td style="padding:10px;">100/95</td>
        <td style="padding:10px; color:green; font-weight:bold;">ممتاز</td>
      </tr>
      <tr style="border-bottom:1px solid #e2e8f0;">
        <td style="padding:10px;">تنسيقات CSS</td>
        <td style="padding:10px;">100/90</td>
        <td style="padding:10px; color:green; font-weight:bold;">ممتاز</td>
      </tr>
    </tbody>
  </table>\n`;
    }

    if (snippet) {
      if (type === 'base') {
        if (window.confirm('هل تريد مسح الكود الحالي واستبداله بالهيكل الأساسي؟')) {
          setCode(snippet);
        }
      } else {
        // insert inside body
        const bodyIndex = code.toLowerCase().indexOf('</body>');
        if (bodyIndex !== -1) {
          setCode(prev => prev.substring(0, bodyIndex) + snippet + prev.substring(bodyIndex));
        } else {
          setCode(prev => prev + snippet);
        }
      }
    }
  };

  // Copy code to clipboard
  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download code as index.html
  const handleDownloadFile = () => {
    const element = document.createElement("a");
    const file = new Blob([code], {type: 'text/html'});
    element.href = URL.createObjectURL(file);
    element.download = "index.html";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Clear workspace
  const handleClearCode = () => {
    if (window.confirm('هل أنت متأكد من رغبتك في مسح مساحة العمل بالكامل؟')) {
      setCode(`<!DOCTYPE html>
<html>
<head>
  <title>صفحة فارغة</title>
</head>
<body>

  <!-- اكتب الكود الخاص بك هنا -->

</body>
</html>`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 font-sans" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Branding */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-800 p-6 rounded-3xl border border-slate-700/80 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400">
              <Laptop className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <span>محرر الأكواد التفاعلي</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-black font-mono">Live HTML Editor</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">اكتب الأكواد البرمجية لصفحتك وشاهد مخرجاتها في المتصفح لحظة بلحظة</p>
            </div>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={onNavigateHome}
              className="flex-1 md:flex-initial px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة للرئيسية</span>
            </button>
          </div>
        </div>

        {/* Templates and Helper tools block */}
        <div className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-2xl flex flex-wrap justify-between items-center gap-4">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-bold ml-1">إدراج عناصر سريعة:</span>
            <button onClick={() => injectSnippet('base')} className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 rounded-lg font-bold cursor-pointer transition-all">
              📄 صفحة جديدة فارغة
            </button>
            <button onClick={() => injectSnippet('card')} className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg font-bold cursor-pointer transition-all">
              📇 كارت بطاقة
            </button>
            <button onClick={() => injectSnippet('button')} className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg font-bold cursor-pointer transition-all">
              🔘 زر تفاعلي
            </button>
            <button onClick={() => injectSnippet('image')} className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg font-bold cursor-pointer transition-all">
              🖼️ إدراج صورة
            </button>
            <button onClick={() => injectSnippet('table')} className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg font-bold cursor-pointer transition-all">
              📊 جدول بيانات
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCopyCode}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                copied ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/20' : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
              }`}
            >
              {copied ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'تم النسخ!' : 'نسخ الكود'}</span>
            </button>

            <button
              onClick={handleDownloadFile}
              className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تحميل index.html</span>
            </button>

            <button
              onClick={handleClearCode}
              className="px-3 py-1.5 bg-red-600/10 hover:bg-red-600/20 border border-red-500/20 text-red-400 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>تفريغ الكود</span>
            </button>
          </div>
        </div>

        {/* Code Editor and Live preview container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          
          {/* Left panel - Text editor */}
          <div className="flex flex-col bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="bg-slate-900/80 px-5 py-3 border-b border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-300 font-mono flex items-center gap-1.5">
                <Code className="w-4.5 h-4.5 text-blue-400" />
                <span>محرر كود HTML & CSS</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Workspace Code Editor</span>
            </div>
            
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full flex-1 bg-slate-950 text-emerald-400 font-mono text-xs p-6 focus:outline-none resize-none direction-ltr text-left leading-relaxed min-h-[500px]"
              placeholder="اكتب كود الـ HTML هنا..."
            />
          </div>

          {/* Right panel - Live Render Preview */}
          <div className="flex flex-col bg-white border border-slate-300 rounded-3xl overflow-hidden shadow-2xl">
            <div className="bg-slate-100/90 px-5 py-3 border-b border-slate-200 flex justify-between items-center text-xs text-slate-800 font-bold">
              <span className="flex items-center gap-1.5">
                <Eye className="w-4.5 h-4.5 text-slate-500" />
                <span>لوحة العرض والمعاينة الفورية</span>
              </span>
              <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-mono flex items-center gap-1">
                <span>Rendering OK</span>
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
              </span>
            </div>
            
            <iframe
              srcDoc={code}
              title="Code playground live output"
              className="w-full flex-1 bg-white border-none min-h-[500px]"
              sandbox="allow-scripts"
            />
          </div>

        </div>

      </div>
    </div>
  );
}
