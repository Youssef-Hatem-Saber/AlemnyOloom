import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  ArrowUp, 
  ArrowDown, 
  Copy, 
  Printer, 
  RefreshCw, 
  Sparkles, 
  Check, 
  Info,
  SlidersHorizontal,
  Compass
} from 'lucide-react';

interface StemSchool {
  name: string;
  governorate: string;
  gender: 'boys' | 'girls' | 'mixed';
  lat: number;
  lng: number;
  distance?: number;
}

const GOVERNORATE_COORDINATES: Record<string, { lat: number; lng: number }> = {
  "القاهرة": { lat: 30.0444, lng: 31.2358 },
  "الجيزة": { lat: 29.9870, lng: 31.2118 },
  "الإسكندرية": { lat: 31.1975, lng: 29.8925 },
  "الدقهلية": { lat: 31.0500, lng: 31.3833 },
  "الغربية": { lat: 30.7818, lng: 30.9995 },
  "الشرقية": { lat: 30.5833, lng: 31.5000 },
  "القليوبية": { lat: 30.4628, lng: 31.1837 },
  "البحيرة": { lat: 31.0333, lng: 30.4667 },
  "المنوفية": { lat: 30.5567, lng: 31.0097 },
  "كفر الشيخ": { lat: 31.1119, lng: 30.9427 },
  "الإسماعيلية": { lat: 30.5965, lng: 32.2715 },
  "السويس": { lat: 29.9667, lng: 32.5333 },
  "بورسعيد": { lat: 31.2625, lng: 32.3061 },
  "دمياط": { lat: 31.4175, lng: 31.8144 },
  "بني سويف": { lat: 29.0733, lng: 31.0975 },
  "الفيوم": { lat: 29.3090, lng: 30.8420 },
  "المنيا": { lat: 28.1099, lng: 30.7503 },
  "أسيوط": { lat: 27.1809, lng: 31.1837 },
  "سوهاج": { lat: 26.5591, lng: 31.6957 },
  "قنا": { lat: 26.1606, lng: 32.7160 },
  "الأقصر": { lat: 25.6872, lng: 32.6396 },
  "أسوان": { lat: 24.0889, lng: 32.8998 },
  "الوادي الجديد": { lat: 25.4435, lng: 30.5483 },
  "شمال سيناء": { lat: 31.1316, lng: 33.8015 },
  "جنوب سيناء": { lat: 28.2415, lng: 33.6231 },
  "البحر الأحمر": { lat: 27.2579, lng: 33.8116 },
  "مطروح": { lat: 31.3543, lng: 27.2373 }
};

const INITIAL_STEM_SCHOOLS: StemSchool[] = [
  { name: "مدرسة 6 أكتوبر بنين بالجيزة", governorate: "الجيزة", gender: "boys", lat: 29.9722, lng: 30.9388 },
  { name: "مدرسة 6 أكتوبر الحي 11 المشتركة", governorate: "الجيزة", gender: "mixed", lat: 29.9700, lng: 30.9500 },
  { name: "مدرسة المعادي بنات بالقاهرة", governorate: "القاهرة", gender: "girls", lat: 29.9602, lng: 31.2569 },
  { name: "مدرسة القاهرة الجديدة المشتركة", governorate: "القاهرة", gender: "mixed", lat: 30.0150, lng: 31.4880 },
  { name: "مدرسة الإسكندرية المشتركة", governorate: "الإسكندرية", gender: "mixed", lat: 30.9200, lng: 29.5800 },
  { name: "مدرسة كفر الشيخ المشتركة", governorate: "كفر الشيخ", gender: "mixed", lat: 31.1119, lng: 30.9427 },
  { name: "مدرسة الدقهلية المشتركة", governorate: "الدقهلية", gender: "mixed", lat: 31.0550, lng: 31.3800 },
  { name: "مدرسة الإسماعيلية المشتركة", governorate: "الإسماعيلية", gender: "mixed", lat: 30.5965, lng: 32.2715 },
  { name: "مدرسة البحر الأحمر المشتركة", governorate: "البحر الأحمر", gender: "mixed", lat: 27.2579, lng: 33.8116 },
  { name: "مدرسة أسيوط المشتركة", governorate: "أسيوط", gender: "mixed", lat: 27.1809, lng: 31.1837 },
  { name: "مدرسة الأقصر المشتركة", governorate: "الأقصر", gender: "mixed", lat: 25.6872, lng: 32.6396 },
  { name: "مدرسة سرس الليان بالمنوفية بنات", governorate: "المنوفية", gender: "girls", lat: 30.4285, lng: 30.9169 },
  { name: "مدرسة مدينة السادات بالمنوفية بنين", governorate: "المنوفية", gender: "boys", lat: 30.3800, lng: 30.5000 },
  { name: "مدرسة الغربية المشتركة", governorate: "الغربية", gender: "mixed", lat: 30.7818, lng: 30.9995 },
  { name: "مدرسة القليوبية (العبور) المشتركة", governorate: "القليوبية", gender: "mixed", lat: 30.2200, lng: 31.4700 },
  { name: "مدرسة الشرقية المشتركة", governorate: "الشرقية", gender: "mixed", lat: 30.5833, lng: 31.5000 },
  { name: "مدرسة قنا المشتركة", governorate: "قنا", gender: "mixed", lat: 26.1606, lng: 32.7160 },
  { name: "مدرسة الفيوم بنين", governorate: "الفيوم", gender: "boys", lat: 29.3090, lng: 30.8420 },
  { name: "مدرسة بني سويف المشتركة", governorate: "بني سويف", gender: "mixed", lat: 29.0733, lng: 31.0975 },
  { name: "مدرسة المنيا بنين", governorate: "المنيا", gender: "boys", lat: 28.1099, lng: 30.7503 },
  { name: "مدرسة سوهاج بنات", governorate: "سوهاج", gender: "girls", lat: 26.5591, lng: 31.6957 },
  { name: "مدرسة العريش بشمال سيناء المشتركة", governorate: "شمال سيناء", gender: "mixed", lat: 31.1316, lng: 33.8015 },
  { name: "مدرسة السويس المشتركه", governorate: "السويس", gender: "mixed", lat: 29.9667, lng: 32.5333 },
  { name: "مدرسة اسوان المشتركه", governorate: "أسوان", gender: "mixed", lat: 24.0889, lng: 32.8998 },
  { name: "مدرسة دمياط المشتركه", governorate: "دمياط", gender: "mixed", lat: 31.4300, lng: 31.6700 },
  { name: "مدرسة البحيرة المشتركة", governorate: "البحيرة", gender: "mixed", lat: 31.0333, lng: 30.4667 }
];

// Haversine formula to compute distance in km between two lat/lng coordinates
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

interface StemDesiresPageProps {
  GOVERNORATES: string[];
  lang: string;
  t: (ar: string, en: string) => string;
}

export default function StemDesiresPage({ GOVERNORATES, lang, t }: StemDesiresPageProps) {
  const [selectedGov, setSelectedGov] = useState<string>("القاهرة");
  const [gender, setGender] = useState<'boys' | 'girls'>('boys');
  const [orderedSchools, setOrderedSchools] = useState<StemSchool[]>([]);
  const [copied, setCopied] = useState<boolean>(false);

  // Recalculate and sort schools when governorate or gender changes
  useEffect(() => {
    const govCoords = GOVERNORATE_COORDINATES[selectedGov];
    if (!govCoords) return;

    // 1. Calculate distances to all schools
    const schoolsWithDistance = INITIAL_STEM_SCHOOLS.map(school => {
      const distance = calculateDistance(govCoords.lat, govCoords.lng, school.lat, school.lng);
      return { ...school, distance };
    });

    // 2. Sort by distance ascending
    schoolsWithDistance.sort((a, b) => (a.distance || 0) - (b.distance || 0));

    // 3. Filter by gender compatibility automatically
    const filtered = schoolsWithDistance.filter(school => {
      if (gender === 'boys') {
        return school.gender === 'boys' || school.gender === 'mixed';
      } else {
        return school.gender === 'girls' || school.gender === 'mixed';
      }
    });

    setOrderedSchools(filtered);
  }, [selectedGov, gender]);

  // Manual reordering controls (Up/Down)
  const moveSchool = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= orderedSchools.length) return;

    const updated = [...orderedSchools];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;
    
    setOrderedSchools(updated);
  };

  // Reset to default geographical sorting
  const resetToGeographicalSort = () => {
    const govCoords = GOVERNORATE_COORDINATES[selectedGov];
    if (!govCoords) return;

    const schoolsWithDistance = INITIAL_STEM_SCHOOLS.map(school => {
      const distance = calculateDistance(govCoords.lat, govCoords.lng, school.lat, school.lng);
      return { ...school, distance };
    });

    schoolsWithDistance.sort((a, b) => (a.distance || 0) - (b.distance || 0));

    const filtered = schoolsWithDistance.filter(school => {
      if (gender === 'boys') {
        return school.gender === 'boys' || school.gender === 'mixed';
      } else {
        return school.gender === 'girls' || school.gender === 'mixed';
      }
    });

    setOrderedSchools(filtered);
  };

  // Formatting output text for copying
  const handleCopyText = () => {
    const header = `ترتيب رغبات مدارس STEM (المحافظة: ${selectedGov} | النوع: ${gender === 'boys' ? 'بنين' : 'بنات'}):\n`;
    const body = orderedSchools.map((school, idx) => {
      const genderLabel = school.gender === 'boys' ? 'بنين' : school.gender === 'girls' ? 'بنات' : 'مشتركة';
      return `${idx + 1}. ${school.name} (${genderLabel}) - المسافة: ${school.distance} كم`;
    }).join('\n');

    navigator.clipboard.writeText(header + body);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Print layout handler
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-fade-in text-right">
      
      {/* Header Info Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-8 sm:p-12 border border-slate-800 shadow-2xl text-white">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 space-y-4 max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-black border border-blue-500/30">
            <Compass className="w-3.5 h-3.5 animate-spin" />
            أداة تحديد الترتيب الجغرافي الذكي
          </span>
          
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            ترتيب رغبات مدارس المتفوقين (STEM)
          </h2>
          
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans font-medium">
            تساعدك هذه الأداة في ترتيب رغبات مدارس المتفوقين في العلوم والتكنولوجيا (STEM) الـ 26 على مستوى جمهورية مصر العربية تلقائيًا بناءً على المسافة الجغرافية بالكيلومتر من محافظتك التي تختارها، مع إمكانية تعديل الترتيب يدويًا لمساعدتك في تحديد رغباتك.
          </p>
        </div>
      </div>

      {/* Disclaimer Alert Box */}
      <div className="bg-amber-50/80 border border-amber-200/70 rounded-3xl p-5 text-right flex items-start gap-3 shadow-sm border-r-4 border-r-amber-500">
        <Info className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-amber-800">تنويه هام جداً:</h4>
          <p className="text-xs text-amber-700 leading-relaxed font-sans font-medium">
            ترتيب الرغبات هي أداة مساعدة فقط لكي تعرف المدارس الأقرب لك جغرافيًا وهو ما نقترح ترتيب الرغبات على أساسه. هذا الترتيب ليس رسميًا ولا يُعتد به وليس إجبارًا على أحد.
          </p>
        </div>
      </div>

      {/* Main Grid: Control Panel + Desires List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Sidebar Controls */}
        <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-blue-600" />
              خيارات الترتيب والتصفية
            </h3>
          </div>

          {/* Governorate Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block font-sans">اختر محافظتك الحالية *</label>
            <div className="relative">
              <select
                value={selectedGov}
                onChange={(e) => setSelectedGov(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none font-bold text-right cursor-pointer"
              >
                {GOVERNORATES.map(gov => (
                  <option key={gov} value={gov}>{gov}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-450">
                <MapPin className="w-4 h-4 text-slate-400" />
              </div>
            </div>
            <p className="text-[10px] text-slate-405">
              سيتم حساب مسافة كل مدرسة بناءً على إحداثيات عاصمة هذه المحافظة.
            </p>
          </div>

          {/* Gender Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block font-sans">نوع التقديم (جنس الطالب)</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setGender('boys')}
                className={`py-3 px-4 rounded-2xl text-xs font-bold transition-all border flex items-center justify-center gap-2 cursor-pointer ${
                  gender === 'boys'
                    ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-650 hover:bg-slate-100'
                }`}
              >
                <span>طالب (بنين)</span>
              </button>
              <button
                type="button"
                onClick={() => setGender('girls')}
                className={`py-3 px-4 rounded-2xl text-xs font-bold transition-all border flex items-center justify-center gap-2 cursor-pointer ${
                  gender === 'girls'
                    ? 'bg-pink-50 border-pink-200 text-pink-700 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-650 hover:bg-slate-100'
                }`}
              >
                <span>طالبة (بنات)</span>
              </button>
            </div>
          </div>

          {/* Gender filter info note */}
          <div className="bg-blue-50/40 p-4 rounded-2xl border border-blue-100/60 text-right space-y-1.5">
            <h4 className="text-xs font-bold text-blue-800 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              تصفية جنس الطالب تلقائيًا
            </h4>
            <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
              تم تفعيل التصفية التلقائية. عند اختيار جنس الطالب، سيتم تلقائيًا استبعاد المدارس غير المتوافقة (إخفاء مدارس البنين للبنات، ومدارس البنات للبنين) لمنع الأخطاء في التنسيق.
            </p>
          </div>

          {/* Reset / Actions */}
          <div className="pt-4 border-t border-slate-100 space-y-3 font-sans">
            <button
              onClick={resetToGeographicalSort}
              className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-750 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-slate-500" />
              إعادة الضبط للترتيب الجغرافي
            </button>
            

          </div>

          {/* Guidelines */}
          <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200/45 space-y-2 text-xs text-slate-700 leading-relaxed font-sans">
            <h4 className="font-bold text-amber-800 flex items-center gap-1">
              <Info className="w-4 h-4 text-amber-700" />
              توجيهات هامة عند التقديم:
            </h4>
            <p>
              1. <strong>المسافات تقريبية:</strong> تم حساب المسافة الجغرافية المباشرة (خط مستقيم)، وقد تختلف مسافة القيادة الفعلية أو وسائل النقل والمواصلات.
            </p>
            <p>
              2. <strong>ترتيب الرغبات:</strong> يجب إدخال الرغبات في موقع الوزارة بنفس الترتيب الذي تحدده. المدارس الداخلية توفر إقامة كاملة طوال الأسبوع للطلاب.
            </p>
          </div>
        </div>

        {/* Desires List View */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between text-right px-2 pb-2">
            <div>
              <h3 className="text-lg font-extrabold text-[#0F172A]">
                قائمة ترتيب الرغبات المقترحة
              </h3>
              <p className="text-xs text-slate-500 font-sans mt-0.5">
                مجموع المدارس المتاحة للتنسيق: <span className="font-bold text-blue-600 font-mono">{orderedSchools.length} مدرسة</span>
              </p>
            </div>
            
            <span className="text-[10px] bg-blue-50 text-blue-700 font-extrabold px-3 py-1.5 rounded-full border border-blue-200/50">
              الموقع الحالي: {selectedGov}
            </span>
          </div>

          {/* Timeline Wrapper */}
          <div className="relative border-r-2 border-dashed border-blue-200/60 mr-4 sm:mr-6 space-y-4">
            
            {orderedSchools.map((school, index) => {
              const isFirst = index === 0;
              const isLast = index === orderedSchools.length - 1;
              const genderLabel = school.gender === 'boys' ? 'بنين' : school.gender === 'girls' ? 'بنات' : 'مشتركة';
              
              return (
                <div key={school.name} className="relative pr-8 sm:pr-10 transition-all duration-300">
                  
                  {/* Step Dot Badge */}
                  <span className={`absolute -right-[11px] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center font-mono text-[9px] font-black text-white shadow-sm transition-colors duration-300 ${
                    isFirst 
                      ? 'bg-blue-600 ring-4 ring-blue-100 scale-110' 
                      : isLast 
                        ? 'bg-slate-600' 
                        : 'bg-slate-400'
                  }`}>
                    {index + 1}
                  </span>

                  {/* Card Container */}
                  <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-350 transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    
                    {/* Info Side */}
                    <div className="space-y-1.5 text-right flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                          school.gender === 'boys' 
                            ? 'bg-blue-100 text-blue-800' 
                            : school.gender === 'girls' 
                              ? 'bg-pink-100 text-pink-800' 
                              : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {genderLabel}
                        </span>
                        
                        <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded">
                          محافظة {school.governorate}
                        </span>

                        {isFirst && (
                          <span className="text-[9px] bg-amber-100 text-amber-800 font-black px-1.5 py-0.5 rounded flex items-center gap-0.5 animate-pulse">
                            <Sparkles className="w-2.5 h-2.5" />
                            الأقرب جغرافياً
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                        {school.name}
                      </h4>
                      
                      <p className="text-[11px] text-slate-500 font-sans flex items-center gap-1 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-red-500 inline" />
                        المسافة التقديرية: <span className="font-bold text-slate-800 font-mono text-xs">{school.distance} كم</span>
                      </p>
                    </div>

                    {/* Interactive controls */}
                    <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center border-t sm:border-t-0 pt-2 sm:pt-0 w-full sm:w-auto justify-end">
                      <span className="text-xs font-black text-slate-400 font-mono ml-3">
                        رغبة {index + 1}
                      </span>

                      <button
                        onClick={() => moveSchool(index, 'up')}
                        disabled={isFirst}
                        className={`p-2 rounded-xl border transition-all cursor-pointer ${
                          isFirst 
                            ? 'bg-slate-50 border-slate-100 text-slate-350 pointer-events-none' 
                            : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-blue-600 active:scale-95'
                        }`}
                        title="تحريك لأعلا"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => moveSchool(index, 'down')}
                        disabled={isLast}
                        className={`p-2 rounded-xl border transition-all cursor-pointer ${
                          isLast 
                            ? 'bg-slate-50 border-slate-100 text-slate-350 pointer-events-none' 
                            : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-blue-600 active:scale-95'
                        }`}
                        title="تحريك لأسفل"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* CSS print utility specifically inside this component to handle windows print correctly */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-area-wrapper, #print-area-wrapper * {
            visibility: visible;
          }
          #print-area-wrapper {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            direction: rtl;
            text-align: right;
            padding: 20px;
          }
        }
      `}</style>

      {/* Hidden print page template rendered cleanly */}
      <div id="print-area-wrapper" className="hidden print:block font-sans text-right space-y-6">
        <div className="border-b-2 border-slate-900 pb-4 text-center">
          <h1 className="text-2xl font-black">أكاديمية علّمني علوم</h1>
          <h2 className="text-xl font-bold mt-2">بيان ترتيب رغبات مدارس المتفوقين في العلوم والتكنولوجيا (STEM)</h2>
          <div className="flex justify-center gap-6 text-sm mt-3 font-semibold">
            <span>المحافظة المختارة: {selectedGov}</span>
            <span>النوع: {gender === 'boys' ? 'بنين (طالب)' : 'بنات (طالبة)'}</span>
            <span>التاريخ: {new Date().toLocaleDateString('ar-EG')}</span>
          </div>
        </div>

        <table className="w-full border-collapse border border-slate-300 text-sm">
          <thead>
            <tr className="bg-slate-100">
              <th className="border border-slate-300 p-2 text-right">الرغبة</th>
              <th className="border border-slate-300 p-2 text-right">اسم المدرسة</th>
              <th className="border border-slate-300 p-2 text-right">المحافظة</th>
              <th className="border border-slate-300 p-2 text-right">النوع</th>
              <th className="border border-slate-300 p-2 text-right">المسافة التقديرية</th>
            </tr>
          </thead>
          <tbody>
            {orderedSchools.map((school, index) => (
              <tr key={index} className="hover:bg-slate-50">
                <td className="border border-slate-300 p-2 font-bold">{index + 1}</td>
                <td className="border border-slate-300 p-2 font-bold">{school.name}</td>
                <td className="border border-slate-300 p-2">{school.governorate}</td>
                <td className="border border-slate-300 p-2">{school.gender === 'boys' ? 'بنين' : school.gender === 'girls' ? 'بنات' : 'مشتركة'}</td>
                <td className="border border-slate-300 p-2 font-mono">{school.distance} كم</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pt-8 text-center text-xs text-slate-500 border-t border-slate-200">
          تم استخراج هذا المستند من أداة ترتيب الرغبات الخاصة بأكاديمية علّمني علوم - بوابة العبور لمدارس المتفوقين
        </div>
      </div>

    </div>
  );
}
