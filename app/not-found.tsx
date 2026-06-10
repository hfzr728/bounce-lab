// 自定义 404 页面
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="text-8xl font-extrabold text-slate-700 mb-4">404</div>
      <h1 className="text-2xl font-bold text-slate-200 mb-2">页面不存在</h1>
      <p className="text-slate-400 mb-8 max-w-md">你访问的页面可能已被移除、链接失效，或者你输入的地址有误。</p>
      <div className="flex gap-4">
        <Link href="/" className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-[#0a0a14] font-bold rounded-xl transition-all shadow-md hover:shadow-lg">返回首页</Link>
        <Link href="/assessment" className="px-6 py-3 bg-[#1e293b] border border-slate-700 text-slate-300 font-semibold rounded-xl hover:border-slate-500 transition-all">开始评估</Link>
      </div>
    </div>
  );
}
