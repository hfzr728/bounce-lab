// 资源导航页 — 弹跳训练方法、计划、资料整理（国内可访问链接）
// ============================================================

export default function ResourcesPage() {
  const resources = [
    {
      category: "📚 经典训练体系",
      items: [
        {
          title: "PJF Performance 官网",
          desc: "Paul Fabritz 的运动表现体系，涵盖弹跳训练、损伤预防、康复、营养。Vert Code 系列的官方出处。",
          url: "https://pjfperformance.net/",
        },
        {
          title: "The Jump Manual（Jacob Hiller）",
          desc: "经典弹跳训练手册官方网站，包含力量训练、增强式训练、柔韧性训练三大模块。",
          url: "https://www.jumpmanual.com/",
        },
        {
          title: "Bilibili 弹跳训练资源汇总",
          desc: "B站搜索「弹跳训练」——大量免费中文教学视频，涵盖 Vert Code 解析、增强式训练教程、扣篮训练实录等。",
          url: "https://search.bilibili.com/all?keyword=%E5%BC%B9%E8%B7%B3%E8%AE%AD%E7%BB%83",
        },
      ],
    },
    {
      category: "⚡ 增强式训练 (Plyometrics)",
      items: [
        {
          title: "增强式训练入门（知乎专栏）",
          desc: "中文详解增强式训练原理、安全注意事项、基础动作教学——深跳、箱跳、跨栏跳、跳深等。",
          url: "https://www.zhihu.com/search?type=content&q=%E5%A2%9E%E5%BC%BA%E5%BC%8F%E8%AE%AD%E7%BB%83%20%E5%BC%B9%E8%B7%B3",
        },
        {
          title: "SAQ 训练法详解（B站视频）",
          desc: "Speed-Agility-Quickness 综合训练法，对弹跳的发力速度和协调性有显著帮助。",
          url: "https://search.bilibili.com/all?keyword=SAQ%E8%AE%AD%E7%BB%83%20%E5%BC%B9%E8%B7%B3",
        },
        {
          title: "Plyometric Training（NSCA 官方文章）",
          desc: "美国国家体能协会关于增强式训练的权威指南，英文但内容专业全面。",
          url: "https://www.nsca.com/education/articles/ptq/plyometric-training/",
        },
      ],
    },
    {
      category: "🎯 力量训练基础",
      items: [
        {
          title: "深蹲技术完全指南（知乎）",
          desc: "高杠 vs 低杠、前蹲、保加利亚分腿蹲——弹跳训练中最重要的下肢力量动作详解。",
          url: "https://www.zhihu.com/search?type=content&q=%E6%B7%B1%E8%B9%B2%20%E6%8A%80%E6%9C%AF%20%E8%AF%A6%E8%A7%A3",
        },
        {
          title: "奥林匹克举重与弹跳（B站教程）",
          desc: "高翻、抓举等奥举动作对爆发力的提升——如何在弹跳训练中正确融入奥举训练。",
          url: "https://search.bilibili.com/all?keyword=%E9%AB%98%E7%BF%BB%20%E5%BC%B9%E8%B7%B3%20%E8%AE%AD%E7%BB%83",
        },
        {
          title: "核心抗旋训练（B站视频）",
          desc: "Pallof Press、Dead Bug 等核心抗旋/抗伸训练——弹跳专项必备的核心稳定性训练。",
          url: "https://search.bilibili.com/all?keyword=Pallof%20Press%20%E6%A0%B8%E5%BF%83%E8%AE%AD%E7%BB%83",
        },
      ],
    },
    {
      category: "🧘 恢复与伤病预防",
      items: [
        {
          title: "髌腱炎（跳跃膝）预防与康复（丁香园）",
          desc: "弹跳训练最常见伤病——髌腱炎的成因、预防措施和康复训练方案。",
          url: "https://www.dxy.cn/",
        },
        {
          title: "泡沫轴放松与拉伸指南（B站视频）",
          desc: "训练前后的筋膜放松和拉伸方法大全，提高恢复效率，降低受伤风险。",
          url: "https://search.bilibili.com/all?keyword=%E6%B3%A1%E6%B2%AB%E8%BD%B4%20%E6%94%BE%E6%9D%BE%20%E8%AE%AD%E7%BB%83%E5%90%8E",
        },
        {
          title: "睡眠与运动表现（知乎科普）",
          desc: "为什么睡眠是恢复的第一要素？如何优化睡眠来最大化弹跳训练效果。",
          url: "https://www.zhihu.com/search?type=content&q=%E7%9D%A1%E7%9C%A0%20%E8%BF%90%E5%8A%A8%E8%A1%A8%E7%8E%B0%20%E6%81%A2%E5%A4%8D",
        },
        {
          title: "Y-Balance 测试与下肢伤病预防（PubMed）",
          desc: "YBT 测试预测下肢受伤风险的科学依据和操作方法。",
          url: "https://pubmed.ncbi.nlm.nih.gov/?term=y+balance+test+injury+prevention",
        },
      ],
    },
    {
      category: "📖 推荐书籍",
      items: [
        {
          title: "《Jump Attack》— Tim Grover（京东）",
          desc: "乔丹、科比训练师 Tim Grover 的弹跳训练圣经。适合有基础的训练者。",
          url: "https://search.jd.com/Search?keyword=Jump+Attack+Tim+Grover",
        },
        {
          title: "《Vertical Jump Bible》— Kelly Baggett（搜索）",
          desc: "最全面的弹跳训练参考书之一，从理论到实践一应俱全。含 4 个训练阶段和针对性方案。",
          url: "https://search.jd.com/Search?keyword=Vertical+Jump+Bible",
        },
        {
          title: "《NSCA 体能训练概论》（京东）",
          desc: "美国国家体能协会权威教材，系统学习力量、爆发力、速度训练的科学原理。中文版。",
          url: "https://search.jd.com/Search?keyword=NSCA%E4%BD%93%E8%83%BD%E8%AE%AD%E7%BB%83%E6%A6%82%E8%AE%BA",
        },
        {
          title: "《体育运动中的功能性训练》（京东）",
          desc: "Michael Boyle 经典著作，功能性训练方法论基础，对弹跳训练的计划设计有重要参考价值。",
          url: "https://search.jd.com/Search?keyword=%E4%BD%93%E8%82%B2%E8%BF%90%E5%8A%A8%E4%B8%AD%E7%9A%84%E5%8A%9F%E8%83%BD%E6%80%A7%E8%AE%AD%E7%BB%83",
        },
      ],
    },
    {
      category: "🎬 视频资源",
      items: [
        {
          title: "B站「弹跳训练」频道",
          desc: "大量中文弹跳训练视频：扣篮训练实录、Vert Code 跟练、增强式训练教学、技术分析等。",
          url: "https://search.bilibili.com/all?keyword=%E5%BC%B9%E8%B7%B3%E8%AE%AD%E7%BB%83&order=totalrank",
        },
        {
          title: "PJF Performance YouTube（需科学上网）",
          desc: "Paul Fabritz 的官方频道，最权威的弹跳训练视频内容。（需翻墙工具访问）",
          url: "https://www.youtube.com/@PJFPerformance",
        },
        {
          title: "知乎「弹跳训练」话题",
          desc: "大量中文弹跳训练经验分享、技术讨论、训练计划交流。",
          url: "https://www.zhihu.com/topic/19780008",
        },
      ],
    },
    {
      category: "🔬 科学文献（PubMed 循证）",
      items: [
        {
          title: "力-速曲线个体化训练（Jiménez-Reyes 2017）",
          desc: "验证了基于CMJ力-速曲线的个体化训练方法——偏向力量不足者补力量，偏向速度不足者补增强式，效果优于统一训练方案。",
          url: "https://pubmed.ncbi.nlm.nih.gov/27002490/",
        },
        {
          title: "F-V不平衡训练对篮球运动员的影响（Barrera-Domínguez 2023）",
          desc: "8周个体化F-V不平衡训练显著提升篮球运动员的跳跃和体能表现，证实了个体化训练优于一刀切方案。",
          url: "https://pubmed.ncbi.nlm.nih.gov/37470434/",
        },
        {
          title: "增强式 vs 综合训练（Sánchez-Sixto 2021）",
          desc: "纯增强式训练提高CMJ速度但降低力量输出；力量+增强式综合训练同时维持力量和提升跳跃表现——建议弹跳训练中力量与增强式结合。",
          url: "https://pubmed.ncbi.nlm.nih.gov/34168689/",
        },
        {
          title: "垂直跳跃训练方法综述（Perez-Gomez 2013）",
          desc: "系统综述了提升垂直跳跃的主要训练方法：增强式训练、力量训练、复合训练和电刺激，归纳出四类有效方法的核心要素。",
          url: "https://pubmed.ncbi.nlm.nih.gov/23828282/",
        },
      ],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold text-white mb-3">
          📖 弹跳训练资源导航
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto">
          精选弹跳训练方法论、视频教程、推荐书籍与科学文献。链接均无需翻墙即可访问（标注除外）。
        </p>
      </div>

      <div className="space-y-10">
        {resources.map((section) => (
          <section key={section.category}>
            <h2 className="text-xl font-bold text-white mb-4">
              {section.category}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {section.items.map((item) => (
                <a
                  key={item.title}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-[#1e293b] border border-slate-700/50 rounded-xl p-5 hover:border-amber-500/30 hover:shadow-md transition-all group"
                >
                  <h3 className="font-semibold text-white group-hover:text-amber-400 transition-colors mb-1.5">
                    {item.title}
                    <span className="inline-block ml-1.5 text-xs text-gray-600 group-hover:text-amber-400">↗</span>
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {item.desc}
                  </p>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-16 p-6 bg-amber-500/5 rounded-2xl border border-amber-500/10 text-center">
        <h3 className="font-semibold text-amber-400 mb-2">💡 资源推荐有来源？</h3>
        <p className="text-sm text-gray-400 mb-4">
          如果你有优质的弹跳训练资源推荐（视频、文章、书籍、工具），欢迎反馈。我们会持续更新这个导航页面。
        </p>
        <a
          href="/assessment"
          className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg text-sm"
        >
          准备好了？开始评估 →
        </a>
      </div>
    </div>
  );
}
