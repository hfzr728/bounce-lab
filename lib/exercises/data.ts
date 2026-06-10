// ============================================================
// 弹跳训练动作库 — 按部位分类，含专业详解（65个动作）
// ============================================================

export interface Exercise {
  id: string;
  name: string;
  nameEn: string;
  category: string;
  targetMuscles: string;
  difficulty: "初级" | "中级" | "高级";
  description: string;
  coachingCues: string[];
  setsReps: string;
  icon: string;
  caution?: string;
}

export type ExerciseCategory = {
  id: string;
  label: string;
  icon: string;
  description: string;
};

export const CATEGORIES: ExerciseCategory[] = [
  { id: "lower_strength", label: "下肢力量", icon: "🏋️", description: "弹跳的根基——深蹲、硬拉等基础力量动作，提升地面反作用力产出能力" },
  { id: "olympic_lifts", label: "奥林匹克举", icon: "🏆", description: "爆发力训练的顶峰——高翻、抓举等举重衍生动作，最大化全身协调发力与RFD" },
  { id: "plyometrics", label: "增强式训练", icon: "⚡", description: "爆发力核心——跳箱、深跳等利用SSC快速伸缩循环提升弹跳高度" },
  { id: "core", label: "核心抗旋", icon: "🔄", description: "力量传递中枢——稳定的核心确保下肢力量高效传递到全身" },
  { id: "upper_body", label: "上肢摆臂", icon: "💪", description: "摆臂贡献10-15%跳跃高度——上肢力量与协调性训练" },
  { id: "mobility", label: "柔韧与活动度", icon: "🤸", description: "关节活动范围决定动作效率——踝、髋、胸椎活动度是弹跳上限的关键" },
  { id: "speed", label: "速度与敏捷", icon: "🏃", description: "发力率RFD训练——短跑、绳梯提升神经系统募集速度" },
  { id: "recovery", label: "恢复与预康复", icon: "🧘", description: "伤病预防与恢复——泡沫轴、拉伸、激活训练保障训练的持续性" },
];

export const EXERCISES: Exercise[] = [
  // ================================================================
  // 下肢力量
  // ================================================================
  {
    id: "back-squat", name: "杠铃后蹲", nameEn: "Barbell Back Squat", category: "lower_strength",
    targetMuscles: "股四头肌、臀大肌、腘绳肌、核心", difficulty: "中级",
    description: "力量训练之王。将杠铃置于斜方肌上部（高杠）或后三角肌（低杠），屈膝屈髋下蹲至大腿与地面平行或更低，然后发力站起。后蹲是发展下肢绝对力量的最高效动作，是弹跳训练中不可替代的基础。高杠偏股四头肌，低杠偏后链。",
    coachingCues: ["双脚与肩同宽，脚尖微外展", "下蹲时先屈髋再屈膝，保持躯干刚性", "膝盖方向与脚尖一致，不要内扣", "底部稍作停顿，爆发性站起", "全程保持核心收紧，背部平直"],
    setsReps: "力量期：4-5组×3-5次 @80-90%1RM\n肌肥大期：3-4组×8-12次 @70-80%1RM", icon: "🏋️",
    caution: "膝关节有伤者可用箱式深蹲替代；下背部有问题可选前蹲减轻脊柱压力"
  },
  {
    id: "front-squat", name: "杠铃前蹲", nameEn: "Barbell Front Squat", category: "lower_strength",
    targetMuscles: "股四头肌（重点）、臀大肌、核心、上背", difficulty: "高级",
    description: "将杠铃置于锁骨和三角肌前束上，肘关节抬高，保持躯干更加直立地进行深蹲。前蹲对弹跳的迁移性优于后蹲——更接近跳跃时的躯干角度，对股四头肌和核心的要求更高。如果手腕活动度不足可用交叉握法或助力带。",
    coachingCues: ["杠铃架在锁骨+前三角肌上，不是喉咙", "肘关节尽量抬高，指尖轻触杠铃", "保持躯干直立，想象后背贴着一面墙", "膝盖可以超过脚尖——这是正常的"],
    setsReps: "4组×4-6次 @75-85%1RM", icon: "🏋️",
  },
  {
    id: "deadlift", name: "传统硬拉", nameEn: "Conventional Deadlift", category: "lower_strength",
    targetMuscles: "臀大肌、腘绳肌、竖脊肌、斜方肌、前臂", difficulty: "中级",
    description: "从地面拉起杠铃至完全站直，然后有控制地放下。硬拉发展后链力量（臀、腘绳肌、背部），是弹跳蹬地发力的关键肌群。强大的后链意味着更强的地面反作用力。传统硬拉从完全静止启动，训练初始发力能力。",
    coachingCues: ["杠铃贴着小腿上拉，不要离身体太远", "启动时先'拉紧'杠铃，消除松弛再发力", "全程保持背部平直，不要弓背", "站直时臀部前推，不要过度后仰"],
    setsReps: "3-4组×3-5次 @80-90%1RM", icon: "🏋️",
    caution: "下背部有伤者可用六角杠铃硬拉替代"
  },
  {
    id: "bulgarian-split-squat", name: "保加利亚分腿蹲", nameEn: "Bulgarian Split Squat", category: "lower_strength",
    targetMuscles: "股四头肌、臀大肌、腘绳肌、髋屈肌", difficulty: "中级",
    description: "后脚抬高置于凳上，前脚前跨，重心放在前腿，屈膝下蹲至前大腿与地面平行。这是弹跳训练中最重要的单侧力量动作——检测和纠正左右不平衡，同时发展单腿发力能力，与跳跃的单腿蹬伸模式高度一致。",
    coachingCues: ["前脚距离凳子约60-80cm——下蹲时前膝不超过脚尖", "重心放在前脚脚跟，用前腿发力", "保持躯干直立，核心收紧", "左右力量差异>10%时优先加强弱侧"],
    setsReps: "3-4组×8-10次每侧", icon: "🦵",
  },
  {
    id: "romanian-deadlift", name: "罗马尼亚硬拉", nameEn: "Romanian Deadlift (RDL)", category: "lower_strength",
    targetMuscles: "腘绳肌（重点）、臀大肌、竖脊肌", difficulty: "初级",
    description: "从站立位开始，微屈膝，臀部后推，杠铃沿大腿前侧下滑至小腿中段，感受腘绳肌的拉伸，然后臀部前推回到起始位置。RDL是发展腘绳肌离心力量的最佳动作，对跳跃落地缓冲和弹性势能储存至关重要。",
    coachingCues: ["膝盖保持微屈不锁死", "臀部向后推——想象用屁股关门", "杠铃始终贴着腿", "感到腘绳肌拉伸即可，不要弓背"],
    setsReps: "3-4组×8-12次 @60-75%1RM", icon: "🦵",
  },
  {
    id: "hip-thrust", name: "臀推", nameEn: "Barbell Hip Thrust", category: "lower_strength",
    targetMuscles: "臀大肌（重点）、腘绳肌", difficulty: "初级",
    description: "上背靠在凳边，杠铃置于髋部，屈膝脚踩地，臀部发力将杠铃向上推至身体成一条直线，顶峰收缩1-2秒。臀大肌是人体最大的肌肉，是跳跃蹬伸的主要发力肌群之一。臀推直接针对臀部力量，对弹跳有极高的迁移性。",
    coachingCues: ["下巴微收，眼睛看前方", "推到顶峰时骨盆后倾，用力夹臀", "下降时控制，不要自由落体", "杠铃位置在髋骨下方，必要时垫毛巾"],
    setsReps: "3-4组×8-10次 @75-85%1RM", icon: "🍑",
  },
  {
    id: "calf-raise", name: "负重提踵", nameEn: "Weighted Calf Raise", category: "lower_strength",
    targetMuscles: "腓肠肌、比目鱼肌", difficulty: "初级",
    description: "站姿或坐姿负重，脚尖站在台阶边缘（或平地上），踮脚至最高点后缓慢放下。小腿三头肌是跳跃最后蹬离地面时的关键发力肌群，强壮的小腿能贡献额外的弹跳高度。坐姿（屈膝）针对比目鱼肌，站姿（伸膝）针对腓肠肌。",
    coachingCues: ["全幅度运动——最低到最高", "顶峰停顿1秒", "离心阶段（下降）用3-4秒慢放", "大重量低次数 + 轻重量高次数交替"],
    setsReps: "3-4组×15-20次", icon: "🦶",
  },
  {
    id: "trap-bar-deadlift", name: "六角杠铃硬拉", nameEn: "Trap Bar Deadlift", category: "lower_strength",
    targetMuscles: "臀大肌、股四头肌、腘绳肌、竖脊肌", difficulty: "初级",
    description: "站在六角杠铃中央，握把后以中立姿势拉起杠铃。相比传统硬拉，六角杠铃硬拉对下背部更友好，同时能更均衡地训练下肢前后链，是弹跳训练的优质力量动作选择。研究显示其对CMJ的迁移性可能优于传统硬拉。",
    coachingCues: ["保持躯干中立——比传统硬拉更容易", "发力时想象双脚踩穿地面", "站直时臀部前推但不要过度后仰", "对弹跳的迁移性可能优于传统硬拉"],
    setsReps: "3-4组×4-6次 @80-90%1RM", icon: "🏋️",
  },
  {
    id: "goblet-squat", name: "高脚杯深蹲", nameEn: "Goblet Squat", category: "lower_strength",
    targetMuscles: "股四头肌、臀大肌、核心", difficulty: "初级",
    description: "双手抱一只哑铃或壶铃在胸前，像捧着一个高脚杯，进行深蹲。高脚杯深蹲非常适合初学者学习正确的深蹲模式——胸前的重量自然引导躯干直立、核心收紧。也是训练前热身激活的优质动作。",
    coachingCues: ["哑铃紧贴胸口——像捧着杯子", "肘关节轻轻触碰膝盖内侧——确保深度", "保持躯干直立——重量会帮你做到", "先掌握动作模式再过渡到杠铃"],
    setsReps: "3-4组×10-15次", icon: "🍷",
  },
  {
    id: "walking-lunge", name: "弓步走", nameEn: "Walking Lunge", category: "lower_strength",
    targetMuscles: "股四头肌、臀大肌、腘绳肌、核心稳定", difficulty: "初级",
    description: "双手持哑铃（或自重），向前跨出一大步，后膝接近地面但不触碰，然后前腿发力站起，将后腿带到前方，连续交替前进。弓步走训练单腿力量和动态稳定性，与跑步和跳跃的单腿模式高度吻合。",
    coachingCues: ["跨步足够大——前膝不超过脚尖", "后膝接近地面但不触碰", "躯干保持直立，不要前倾", "每一步都要控制，不要晃动"],
    setsReps: "3-4组×12-16步", icon: "🚶",
  },
  {
    id: "nordic-hamstring-curl", name: "北欧腘绳肌弯举", nameEn: "Nordic Hamstring Curl", category: "lower_strength",
    targetMuscles: "腘绳肌（离心重点）、臀大肌", difficulty: "高级",
    description: "跪姿，脚踝固定（可由搭档压住或使用器械），身体保持刚直缓慢前倾，用腘绳肌的离心力量控制下降，在即将触地时用手推回。北欧弯举是腘绳肌离心训练的黄金动作——强大的腘绳肌离心力量对跳跃落地缓冲和预防腘绳肌拉伤至关重要。",
    coachingCues: ["全程保持身体刚直——髋关节不折叠", "下降越慢越好——挑战离心极限", "在能力范围内控制，不要直接趴倒", "每周1-2次即可——离心训练恢复时间较长"],
    setsReps: "3-4组×3-5次缓慢离心", icon: "🦵",
    caution: "腘绳肌有拉伤史者从最低难度开始（只做上半段）"
  },
  {
    id: "step-up", name: "负重登阶", nameEn: "Weighted Step-Up", category: "lower_strength",
    targetMuscles: "臀大肌（重点）、股四头肌、腘绳肌", difficulty: "初级",
    description: "双手持哑铃，面对台阶或跳箱，单脚踏上后发力站起，对侧腿顺势跟进但不着地（或轻触），然后有控制地下落。登阶是高度专项化的单侧力量动作——与跳跃的单腿蹬伸模式极其相似，对弹跳有直接迁移。",
    coachingCues: ["台阶高度——膝盖呈90度时最佳", "用脚跟发力——不要用脚尖", "控制下落——离心训练同样重要", "对比两侧差异——优先加强弱侧"],
    setsReps: "3-4组×8-10次/每侧", icon: "🪜",
  },
  {
    id: "single-leg-rdl", name: "单腿罗马尼亚硬拉", nameEn: "Single Leg RDL", category: "lower_strength",
    targetMuscles: "腘绳肌、臀大肌、踝关节稳定肌群", difficulty: "中级",
    description: "单腿站立，对侧手持哑铃，支撑腿微屈膝，臀部后推，上身前倾的同时对侧腿向后抬起，保持身体成一条直线，然后臀部发力回到起始位置。单腿RDL是弹跳训练的核心单侧后链动作——同时训练腘绳肌力量、踝关节稳定性和本体感觉，对单腿起跳落地稳定有极高迁移性。",
    coachingCues: ["支撑腿膝盖微屈——不要锁死", "髋关节是铰链轴——上身和抬起的腿同步运动", "保持骨盆水平——不要旋转", "先自重掌握平衡，再加负重"],
    setsReps: "3-4组×8-10次/每侧", icon: "🦩",
  },
  {
    id: "tibialis-raise", name: "胫骨前肌提举", nameEn: "Tibialis Anterior Raise", category: "lower_strength",
    targetMuscles: "胫骨前肌、踝背屈肌群", difficulty: "初级",
    description: "背靠墙站立，脚跟距墙约15-20cm，或使用专门的胫骨前肌训练器械，脚尖反复勾起-放下。胫骨前肌是最常被忽视的下肢肌肉——它负责踝背屈和足弓支撑，弱化的胫骨前肌与胫骨骨膜炎（Shin Splints）高度相关。强化这块肌肉是弹跳训练的'保险'。",
    coachingCues: ["脚跟始终贴地——只有前脚掌在动", "脚尖尽量勾向小腿", "控制放下——不要自由落体", "可以负重（弹力带或Kettlebell挂钩）"],
    setsReps: "3-4组×15-20次", icon: "🦶",
  },
  {
    id: "isometric-wall-squat", name: "靠墙等长静蹲", nameEn: "Isometric Wall Squat", category: "lower_strength",
    targetMuscles: "股四头肌、臀大肌、髌腱", difficulty: "初级",
    description: "背靠墙，下蹲至大腿与地面平行（或疼痛允许的角度），保持静态。等长静蹲是髌腱健康的核心训练——在不过度移动关节的情况下给髌腱施加可控负荷，促进胶原蛋白有序排列和腱细胞修复。是髌腱炎康复和预防的必备动作。",
    coachingCues: ["下蹲角度——膝痛者从浅角度开始（<45°膝角）", "膝盖对准脚尖方向", "正常呼吸——不要憋气", "目标是5组×45秒，逐步增加"],
    setsReps: "3-5组×30-60秒", icon: "🧱",
  },

  // ================================================================
  // 奥林匹克举（新增类别）
  // ================================================================
  {
    id: "power-clean", name: "高翻", nameEn: "Power Clean", category: "olympic_lifts",
    targetMuscles: "臀大肌、腘绳肌、股四头肌、斜方肌、核心、肩部", difficulty: "高级",
    description: "从地面将杠铃以爆发力拉至肩前位置（1/4蹲接杠）。高翻是奥林匹克举重的基础动作，训练三关节伸展（踝、膝、髋）的协调爆发力——这正是跳跃蹬伸的核心模式。高翻产生的地面反作用力和发力率（RFD）是弹跳训练中最高效的神经适应刺激之一。",
    coachingCues: ["第一拉：从地面到膝盖——保持背角不变", "第二拉：从膝盖到大腿中段——杠铃贴身加速", "第三拉：全力三关节伸展+耸肩+高拉", "接杠时肘关节快速翻到杠下", "全程保持杠铃贴身——越近越高效"],
    setsReps: "4-5组×2-3次 @70-85%1RM", icon: "🏆",
    caution: "需专业教练指导技术；技术不熟练前使用轻重量；腕/肩关节有伤者慎用"
  },
  {
    id: "hang-clean", name: "悬垂高翻", nameEn: "Hang Clean", category: "olympic_lifts",
    targetMuscles: "臀大肌、腘绳肌、斜方肌、核心、肩部", difficulty: "高级",
    description: "从大腿中段（悬垂位）起始，省略地面到膝盖的第一拉，直接做第二拉和第三拉。悬垂高翻是高翻的简化版——去掉了技术要求最高的第一拉，更专注于三关节伸展的爆发力。对弹跳的专项迁移性可能比完整高翻更高，因为跳跃没有'从地面拉起'的阶段。",
    coachingCues: ["起始位：杠铃在大腿中段，肩在杠前", "预拉：微屈膝臀后推像RDL，但杠铃不下滑", "爆发：三关节同时伸展+耸肩——杠铃像火箭发射", "接杠快速翻肘——1/4蹲高度接住"],
    setsReps: "4-5组×3-4次 @65-80%1RM", icon: "🏆",
    caution: "技术优先于重量——宁可轻而快，不可重而慢"
  },
  {
    id: "jump-shrug", name: "跳跃耸肩", nameEn: "Jump Shrug", category: "olympic_lifts",
    targetMuscles: "臀大肌、斜方肌、腓肠肌、核心", difficulty: "中级",
    description: "从悬垂位起始，做三关节伸展+全力耸肩，双脚可以离地（跳跃），但手臂不拉杠——杠铃仅靠下肢爆发力上升。跳跃耸肩是奥林匹克举的分解训练——专门强化三关节伸展的爆发力部分，去掉接杠的复杂性，对弹跳训练的迁移性非常直接。",
    coachingCues: ["手臂保持伸直——不要拉杠铃", "耸肩到最高点——耳朵贴肩膀", "双脚可以离地——全力向上", "每组间充分休息——保证最大爆发力"],
    setsReps: "4-5组×3-5次 @70-85%高翻1RM", icon: "🤷",
  },

  // ================================================================
  // 增强式训练
  // ================================================================
  {
    id: "box-jump", name: "箱跳", nameEn: "Box Jump", category: "plyometrics",
    targetMuscles: "股四头肌、臀大肌、腓肠肌、核心", difficulty: "初级",
    description: "面对跳箱站立，快速下蹲后爆发性起跳，双脚同时落在箱上成站立姿势。箱跳是最基础的增强式训练动作，教会身体如何快速产生力量并协调落地。注意：应从箱上走下而非跳下，以保护跟腱。",
    coachingCues: ["预蹲幅度比深蹲浅——约1/4蹲即可", "手臂用力向上摆增加动能", "落地声音越小越好——说明缓冲好", "从低箱（30-45cm）开始逐步加高", "每组间充分休息2-3分钟"],
    setsReps: "3-5组×3-5次", icon: "📦",
  },
  {
    id: "depth-jump", name: "深跳", nameEn: "Depth Jump", category: "plyometrics",
    targetMuscles: "股四头肌、臀大肌、腓肠肌、跟腱复合体", difficulty: "高级",
    description: "从一定高度的箱子上迈下（不是跳下），双脚着地后立即以最短触地时间全力向上跳起。深跳是弹跳训练的黄金动作——最大化利用SSC（拉伸-缩短周期），训练跟腱和肌肉的弹性势能储存与释放能力。触地时间越短、反弹越高=弹跳潜力越大。",
    coachingCues: ["从箱子上迈下，不要跳下——避免预激活", "触地瞬间立即反弹——想象地面是烧红的铁板", "触地时间目标<0.2秒", "落地姿势与起跳姿势完全一致", "从低高度（30cm）开始，每周增加5cm", "组间休息3-5分钟"],
    setsReps: "3-4组×3-5次", icon: "⚡",
    caution: "有跟腱炎/髌腱炎史者慎用；需至少3个月系统力量训练基础；落点需有缓冲垫"
  },
  {
    id: "broad-jump", name: "立定跳远", nameEn: "Standing Broad Jump", category: "plyometrics",
    targetMuscles: "臀大肌、股四头肌、腘绳肌、核心", difficulty: "初级",
    description: "双脚与肩同宽站立，下蹲摆臂后全力向前跳出，双脚同时着地并站稳。最自然的爆发力输出方式，测试和训练水平方向发力能力。与垂直跳跃结合训练，全面提升多方向爆发力。",
    coachingCues: ["摆臂幅度要大——手臂先向后摆再全力前甩", "起跳角度约30-45度——不是直上直下", "落地时膝盖微屈吸收冲击", "比较连续5次的成绩——下降<5%为优秀"],
    setsReps: "4-5组×3-5次", icon: "📏",
  },
  {
    id: "tuck-jump", name: "抱膝跳", nameEn: "Tuck Jump", category: "plyometrics",
    targetMuscles: "股四头肌、髋屈肌、核心、腓肠肌", difficulty: "中级",
    description: "原地连续垂直起跳，每次跳到最高点时双膝向胸口收起，双手快速抱膝后立即放下准备下一次起跳。抱膝跳训练快速连续起跳能力和空中身体控制力，是篮球/排球弹跳训练的经典动作。",
    coachingCues: ["触地时间越短越好——像弹簧一样", "核心收紧带动膝盖上提", "手臂向下摆、向上摆形成节奏", "落地要轻，用前脚掌着地"],
    setsReps: "3-4组×8-10次", icon: "🦘",
  },
  {
    id: "single-leg-bound", name: "单腿跨步跳", nameEn: "Single Leg Bound", category: "plyometrics",
    targetMuscles: "股四头肌、臀大肌、腘绳肌、踝关节稳定肌群", difficulty: "高级",
    description: "单腿起跳，尽量向前上方跃出，用同一条腿落地并立即再次起跳，连续进行。最高级的下肢增强式训练，最大化单腿爆发力和关节刚性，直接迁移到篮球/排球中的单腿起跳场景。",
    coachingCues: ["起跳腿的膝盖积极前顶", "摆臂配合——对侧手臂前摆", "落地瞬间肌肉紧张——不能软", "从3-5次/组开始，逐步增加"],
    setsReps: "3-4组×4-6次/每条腿", icon: "🦘",
    caution: "需至少6个月系统力量基础；膝关节/踝关节稳定性不足者先用双腿版本"
  },
  {
    id: "pogo-jump", name: "弹震跳", nameEn: "Pogo Jump", category: "plyometrics",
    targetMuscles: "腓肠肌、比目鱼肌、跟腱、足底筋膜", difficulty: "初级",
    description: "膝盖微屈（几乎不弯），只用脚踝和小腿发力连续弹跳，触地时间极短（<150ms）。弹震跳训练跟腱刚性和弹性势能利用效率，是发展弹跳'弹性'的专项训练——跟腱贡献跳跃中约35%的弹性能。",
    coachingCues: ["膝盖几乎不弯——只有脚踝在动", "前脚掌着地立即弹起", "保持身体直立，核心收紧", "可以连续做30-50次——培养弹性节奏"],
    setsReps: "3-4组×20-30次", icon: "🏀",
  },
  {
    id: "hurdle-hop", name: "跨栏跳", nameEn: "Hurdle Hop", category: "plyometrics",
    targetMuscles: "股四头肌、臀大肌、腓肠肌、髋屈肌", difficulty: "中级",
    description: "排列多个低栏（或障碍物），连续双脚或单脚跳过，触地时间尽量短。跨栏跳训练连续爆发力和节奏感，比单纯的箱跳更具动态性和协调性要求。栏间距离和高度可调整以改变训练重点。",
    coachingCues: ["触地即弹起——弹簧一样", "栏高从低开始（15-30cm）", "膝盖积极上提过栏", "双手配合摆动保持节奏"],
    setsReps: "3-4组×5-8个栏", icon: "🏇",
  },
  {
    id: "lateral-bound", name: "侧向跨步跳", nameEn: "Lateral Bound", category: "plyometrics",
    targetMuscles: "臀中肌、内收肌、股四头肌、核心", difficulty: "中级",
    description: "单腿侧向发力，尽量向侧方跳远，对侧腿着地后立即反向跳回。侧向增强式训练发展冠状面爆发力和髋关节侧向稳定性——大多数弹跳训练只在矢状面，补充侧向训练可全面提升下肢功能并预防髋膝损伤。",
    coachingCues: ["起跳腿全力侧推", "落地腿主动吸收冲击并立即反弹", "保持躯干稳定——不要侧倾", "左右方向都要练"],
    setsReps: "3-4组×5-8次/每侧", icon: "↔️",
  },
  {
    id: "seated-box-jump", name: "坐姿箱跳", nameEn: "Seated Box Jump", category: "plyometrics",
    targetMuscles: "臀大肌、股四头肌、核心", difficulty: "中级",
    description: "坐在凳子或箱子上，臀部离凳后立即爆发性跳上对面的跳箱。消除预蹲和反向动作，纯练向心爆发力——从静止状态直接发力，最接近SJ（蹲跳）的发力模式。",
    coachingCues: ["坐姿端正，双脚着地", "臀部离凳的瞬间全力爆发", "手臂配合向上猛摆", "坐姿消除了SSC——纯向心发力"],
    setsReps: "3-4组×3-5次", icon: "🪑",
  },
  {
    id: "depth-drop", name: "深跳落", nameEn: "Depth Drop", category: "plyometrics",
    targetMuscles: "腘绳肌、臀大肌、股四头肌离心控制", difficulty: "中级",
    description: "从箱子上迈下后仅做落地缓冲（不跳起），训练离心力量和落地力学。深跳落是深跳的预备训练——先学会安全高效地吸收冲击力，再进阶到立即反弹。落地的声音越小、姿势越稳定=离心控制越好。",
    coachingCues: ["落地声音尽可能小——最好的缓冲", "髋膝踝同时屈曲吸收冲击", "落地姿势保持2秒稳定——不要晃动", "从30cm开始，逐步增加到60cm"],
    setsReps: "3-4组×3-5次", icon: "⬇️",
  },
  {
    id: "depth-to-broad-jump", name: "深跳转立定跳远", nameEn: "Depth to Broad Jump", category: "plyometrics",
    targetMuscles: "臀大肌、腘绳肌、股四头肌、核心", difficulty: "高级",
    description: "从箱子上深跳落地后立即转化为水平立定跳远。这是深跳的高级变式——训练在极短触地时间内从垂直方向转化为水平方向的爆发力，对篮球/排球中抢篮板后快攻等场景有极高迁移性。",
    coachingCues: ["深跳落地瞬间转换方向——不要停顿", "触地时间目标<250ms", "立定跳远时充分摆臂——手臂向前甩", "从低箱（30cm）开始"],
    setsReps: "3-4组×3-4次", icon: "⚡",
    caution: "需熟练掌握深跳和立定跳远后再尝试；大幅度的方向转换对关节压力大"
  },

  // ================================================================
  // 核心训练
  // ================================================================
  {
    id: "pallof-press", name: "帕洛夫推举", nameEn: "Pallof Press", category: "core",
    targetMuscles: "腹横肌、腹内外斜肌、多裂肌", difficulty: "初级",
    description: "侧对龙门架或弹力带，双手握住把手在胸前，向前推出后保持稳定，抵抗旋转力。帕洛夫推举训练核心抗旋能力——跳跃时核心必须稳定以高效传递下肢力量，防止能量泄漏。这是核心训练的'三大基础动作'之一。",
    coachingCues: ["双脚与肩同宽，膝盖微屈", "推出时保持躯干不动——不要被拉力带偏", "全程正常呼吸，不要憋气", "推到最远端保持2-3秒"],
    setsReps: "3组×8-10次/每侧", icon: "🔄",
  },
  {
    id: "dead-bug", name: "死虫式", nameEn: "Dead Bug", category: "core",
    targetMuscles: "腹横肌、腹直肌、骨盆稳定肌群", difficulty: "初级",
    description: "仰卧，四肢朝天，腰部贴地。对侧手脚同时缓慢放下至接近地面但不触碰，然后回到起始位置。死虫式训练核心抗伸能力——保护下背部在跳跃和力量训练中不过度伸展，是构建核心刚性基础的首选动作。",
    coachingCues: ["腰部始终贴着地面——这是最重要的", "动作越慢越好——离心控制是关键", "手脚放得越低难度越大", "如果腰部离地，减小活动范围"],
    setsReps: "3组×10-12次/每侧", icon: "🪲",
  },
  {
    id: "ab-wheel-rollout", name: "健腹轮滚动", nameEn: "Ab Wheel Rollout", category: "core",
    targetMuscles: "腹直肌（重点）、腹横肌、背阔肌、肩部", difficulty: "中级",
    description: "跪姿（或站姿），双手握健腹轮向前滚出，身体尽量伸展至平行地面，然后用核心力量拉回。健腹轮是最高效的核心抗伸训练之一，同时训练肩部稳定性和全身协调——与跳跃时的全身刚性结构高度吻合。",
    coachingCues: ["起始时臀部微收，骨盆后倾锁定核心", "向前滚动时保持身体刚直——不要塌腰", "用核心力量拉回，不是手臂", "跪姿全程完成后可进阶到站姿"],
    setsReps: "3-4组×8-12次", icon: "🔄",
  },
  {
    id: "hanging-leg-raise", name: "悬垂举腿", nameEn: "Hanging Leg Raise", category: "core",
    targetMuscles: "腹直肌（下部重点）、髋屈肌、前臂握力", difficulty: "中级",
    description: "悬挂在单杠上，保持身体稳定不晃动，用腹部力量将腿举起至与地面平行或更高，然后有控制地放下。训练腹部下部和髋屈肌力量——对跳跃时膝盖上提动作有直接迁移。",
    coachingCues: ["悬挂时肩胛骨下沉——不要'挂着'肩膀", "举腿时骨盆后倾——用腹部发力而非髋屈肌", "下降时控制速度——不要自由落体", "膝盖微屈降低难度，直腿抬到90度就够了"],
    setsReps: "3-4组×10-15次", icon: "🦍",
  },
  {
    id: "side-plank", name: "侧平板支撑", nameEn: "Side Plank", category: "core",
    targetMuscles: "腹内外斜肌、腰方肌、臀中肌", difficulty: "初级",
    description: "侧卧，单肘撑地，身体成一条直线，保持稳定。侧平板训练核心抗侧屈能力——跳跃时保持躯干不侧倾，确保力量对称传递。进阶时可抬起上面腿增加不稳定性。",
    coachingCues: ["肩膀在肘关节正上方", "从头到脚一条直线——臀部不要下沉", "保持30-60秒，然后换边", "进阶：上面腿抬起——增加不稳定性"],
    setsReps: "每侧3组×30-60秒", icon: "🧱",
  },
  {
    id: "bird-dog", name: "鸟狗式", nameEn: "Bird Dog", category: "core",
    targetMuscles: "竖脊肌、多裂肌、臀大肌、肩部稳定", difficulty: "初级",
    description: "四足跪姿，对侧手脚同时伸展至与地面平行，保持2-3秒，然后有控制地收回。鸟狗式训练核心抗旋和脊柱稳定——是腰部康复和核心激活的经典动作，也是训练前激活后链的优质选择。",
    coachingCues: ["骨盆保持不动——像桌面上放着一杯水", "伸展时不要追求高度——平行即可", "动作慢而稳——避免晃动", "呼气时伸展，吸气时收回"],
    setsReps: "3组×8-10次/每侧", icon: "🐦",
  },
  {
    id: "suitcase-carry", name: "手提重物行走", nameEn: "Suitcase Carry", category: "core",
    targetMuscles: "腹内外斜肌、腰方肌、握力", difficulty: "初级",
    description: "单手持重哑铃或壶铃，保持身体直立不侧倾，向前行走。手提行走训练核心抗侧屈的实用力量——身体必须抵抗单侧负荷的拉力，对日常和运动中的核心稳定性有极高迁移。是功能性和实用价值最高的核心训练之一。",
    coachingCues: ["身体保持中立——不要向重物一侧倾斜", "核心收紧，肩胛骨下沉", "走30-50米后换手", "重量逐步增加——挑战核心稳定性"],
    setsReps: "3组×30-50米/每侧", icon: "💼",
  },
  {
    id: "copenhagen-plank", name: "哥本哈根侧平板", nameEn: "Copenhagen Plank", category: "core",
    targetMuscles: "内收肌群、腹内外斜肌、腰方肌", difficulty: "高级",
    description: "侧卧，上面腿放在凳子上，下面腿悬空，用核心和内收肌群的力量将身体撑起保持直线。哥本哈根侧平板针对内收肌群和核心抗侧屈——强大的内收肌群对单腿跳跃的骨盆稳定至关重要，是预防腹股沟拉伤的最佳训练之一。",
    coachingCues: ["身体成一条直线——从头到脚", "上面腿的膝盖内侧压向凳子", "下面腿保持悬空——核心发力维持", "从10秒保持开始，逐步增加到30秒"],
    setsReps: "每侧3组×15-30秒", icon: "🇩🇰",
    caution: "内收肌群有拉伤史者从低难度（膝着地版）开始"
  },
  {
    id: "sprinter-situp", name: "短跑仰卧起坐", nameEn: "Sprinter Situp", category: "core",
    targetMuscles: "腹直肌、腹内外斜肌、髋屈肌", difficulty: "中级",
    description: "仰卧，双腿伸直略微离地。做仰卧起坐时对侧膝盖向胸口收起、同侧手臂像短跑一样摆动，交替进行。短跑仰卧起坐模拟了短跑和跳跃中上下肢协调摆动的核心发力模式——整合核心力量和四肢协调。",
    coachingCues: ["下巴不要前伸——保持颈部中立", "动作要有节奏——像在跑", "膝盖尽量靠近胸口", "全程腰部贴地"],
    setsReps: "3组×12-16次（交替）", icon: "🏃",
  },

  // ================================================================
  // 上肢摆臂
  // ================================================================
  {
    id: "weighted-pull-up", name: "负重引体向上", nameEn: "Weighted Pull Up", category: "upper_body",
    targetMuscles: "背阔肌、二头肌、前臂、核心", difficulty: "中级",
    description: "在腰间悬挂额外重量进行引体向上。上肢拉力与弹跳摆臂力量和全身刚性有关——强大的背部和手臂能产生更有力的摆臂，贡献额外的跳跃高度。引体向上时的全身刚性维持也直接迁移到跳跃的空中姿态控制。",
    coachingCues: ["全幅度——下巴过杠、手臂完全伸直", "上拉时想象把杠拉向胸口而非下巴", "核心收紧避免身体晃动"],
    setsReps: "3-4组×5-8次", icon: "💪",
  },
  {
    id: "med-ball-overhead-throw", name: "药球过顶抛", nameEn: "Medicine Ball Overhead Throw", category: "upper_body",
    targetMuscles: "肩部、三头肌、背阔肌、核心", difficulty: "初级",
    description: "双手持药球于头后，像足球界外球一样全力向前上方抛出。训练上肢爆发力和全身协调发力——模仿跳跃中手臂向上摆动的发力模式。球的重量通常为3-6kg。",
    coachingCues: ["双脚前后站立，重心在后脚", "球拉到头部后方充分蓄力", "抛球时后腿蹬地+核心发力+手臂前甩", "追求最大抛掷高度而非距离"],
    setsReps: "3-4组×6-8次", icon: "🤾",
  },
  {
    id: "push-press", name: "借力推举", nameEn: "Push Press", category: "upper_body",
    targetMuscles: "肩部、三头肌、核心、下肢", difficulty: "中级",
    description: "杠铃置于锁骨前，微屈膝后爆发性蹬腿，利用下肢力量将杠铃推举过头顶。借力推举训练全身协调爆发——下肢发力→核心传递→上肢完成，与跳跃摆臂的发力链完全一致（三关节伸展→力量经核心→上肢末端释放）。",
    coachingCues: ["预蹲幅度小——约1/4蹲即可", "蹬腿和推举同时进行——不要分两步", "杠铃轨迹尽量垂直——贴脸上升", "接杠时微屈膝吸收冲击"],
    setsReps: "3-4组×5-8次 @70-85%1RM", icon: "🏋️‍♂️",
  },
  {
    id: "band-pull-apart", name: "弹力带肩后拉", nameEn: "Band Pull-Apart", category: "upper_body",
    targetMuscles: "后三角肌、菱形肌、肩袖肌群", difficulty: "初级",
    description: "双手持弹力带于胸前，手臂伸直，向两侧拉开至弹力带触碰胸口，然后有控制地收回。训练肩胛骨后缩和肩袖稳定——强壮的上背部对摆臂和全身姿态至关重要。是训练前激活肩部的最佳热身动作之一。",
    coachingCues: ["手臂保持伸直——用背部发力不是手臂", "拉开时肩胛骨夹紧", "弹力带张力始终保持——不要松弛", "可以做高次数——15-20次为佳"],
    setsReps: "3组×15-20次", icon: "🩹",
  },
  {
    id: "med-ball-slam", name: "药球下砸", nameEn: "Medicine Ball Slam", category: "upper_body",
    targetMuscles: "背阔肌、腹直肌、肩部、核心", difficulty: "初级",
    description: "双手持药球举过头顶，全力向下砸向地面——像排球扣杀。训练从完全伸展到强力屈曲的爆发力模式，背阔肌和核心的协调爆发力。与跳跃摆臂手臂从后上方向前上方甩的发力方向相反但肌群重叠，形成训练的互补效应。",
    coachingCues: ["球举过顶——充分伸展身体", "核心收紧——腹部像被揍了一拳", "全力下砸——不是放下", "球反弹后直接接住——连续做"],
    setsReps: "3-4组×8-12次", icon: "🏐",
  },

  // ================================================================
  // 速度与敏捷
  // ================================================================
  {
    id: "sprint-30m", name: "30米短跑", nameEn: "30m Sprint", category: "speed",
    targetMuscles: "臀大肌、腘绳肌、股四头肌、腓肠肌", difficulty: "初级",
    description: "从静止或慢跑启动，全力冲刺30米。短距离冲刺训练神经系统快速募集肌纤维的能力（RFD/发力率），与弹跳的快速发力模式一致。30米是弹跳训练中最常用的冲刺距离——前10米练启动，10-30米练加速。",
    coachingCues: ["启动时重心前倾", "手臂快速前后摆动——前摆到下巴高度", "膝盖高抬、脚踝刚性", "每组冲刺后充分休息，避免疲劳影响质量"],
    setsReps: "4-6组", icon: "🏃",
  },
  {
    id: "ladder-drill", name: "绳梯训练", nameEn: "Agility Ladder Drill", category: "speed",
    targetMuscles: "足部小肌群、髋屈肌、核心、神经系统", difficulty: "初级",
    description: "在敏捷梯上进行多种步法练习（如小碎步、高抬腿、侧滑步等）。绳梯训练提高足部速度和协调性，改善神经-肌肉连接效率，让双脚更快、更精准地找到发力位置——这对跳跃中精确的起跳点（如篮球上篮前的脚步）非常重要。",
    coachingCues: ["脚掌着地时要有弹性——像踩在弹簧上", "手臂自然配合摆动", "先从慢速准确开始，再追求速度", "每种步法练到流畅后再加快"],
    setsReps: "4-6种步法×2-3组", icon: "🪜",
  },
  {
    id: "resisted-sprint", name: "阻力冲刺", nameEn: "Resisted Sprint", category: "speed",
    targetMuscles: "臀大肌、腘绳肌、股四头肌、核心", difficulty: "中级",
    description: "使用弹力带、阻力伞或推雪橇等外部阻力进行短距离冲刺。阻力冲刺在不过度增加关节负荷的情况下提高发力能力，是连接力量训练和速度训练的理想桥梁——比单纯的力量训练更具专项性，比单纯的冲刺更具力量刺激。",
    coachingCues: ["阻力不要太大——控制在体重的10-20%", "保持正常的冲刺姿势——不要因阻力变形", "每组间充分休息——追求质量而非疲劳", "与无阻力冲刺交替进行效果更好"],
    setsReps: "4-6组×20-30米", icon: "🏃‍♂️",
  },
  {
    id: "a-skip", name: "A式跳跃", nameEn: "A-Skip", category: "speed",
    targetMuscles: "髋屈肌、股四头肌、腓肠肌、核心", difficulty: "初级",
    description: "原地或行进间高抬腿跳跃，强调膝盖高抬和脚踝刚性——像字母A。A式跳跃是最基础的跑姿训练，改善髋屈肌力量和步频，对跳跃中膝盖上提的主动发力有直接帮助。是训练前热身和动作模式学习的核心动作。",
    coachingCues: ["膝盖尽量高抬——至少到髋部高度", "脚踝保持刚性——不要软脚", "手臂与对侧腿配合摆动", "先慢速标准动作，再加速"],
    setsReps: "3-4组×20-30米", icon: "🅰️",
  },
  {
    id: "wall-drill", name: "墙跑练习", nameEn: "Wall Drill (Running Mechanics)", category: "speed",
    targetMuscles: "髋屈肌、臀大肌、腓肠肌、核心", difficulty: "初级",
    description: "面对墙壁，身体前倾约45度双手扶墙，做高抬腿跑步动作——这是学习正确跑姿和跳跃起跳角度（身体前倾）的基础训练。墙跑练习消除了向前倒的恐惧，让你专注在正确的膝盖驱动和脚踝刚性上。",
    coachingCues: ["身体成一条直线——像一块倾斜的木板", "膝盖驱动——大腿抬至与地面平行", "脚掌直接落在身体下方——不是前方", "节奏由慢到快——先求正确再求速度"],
    setsReps: "3-4组×15-20秒连续", icon: "🧱",
  },
  {
    id: "sled-push", name: "雪橇推", nameEn: "Sled Push", category: "speed",
    targetMuscles: "股四头肌、臀大肌、腓肠肌、核心", difficulty: "中级",
    description: "双手推动负重雪橇，身体前倾约45度，用爆发性步伐推进。雪橇推是水平方向爆发力的金牌动作——身体角度、发力方向和肌群参与与短跑加速阶段高度一致，直接迁移到弹跳的起跳蹬伸（特别是助跑起跳）。没有技术门槛，安全性极高。",
    coachingCues: ["身体前倾45度——保持刚直", "每一步全力蹬地——不是走是推", "手臂伸直推——身体角度不变", "负荷：能保持爆发力推进10-20米的重量"],
    setsReps: "4-6组×10-20米", icon: "🛷",
  },

  // ================================================================
  // 柔韧与活动度
  // ================================================================
  {
    id: "ankle-dorsiflexion-stretch", name: "踝关节背屈拉伸", nameEn: "Ankle Dorsiflexion Stretch", category: "mobility",
    targetMuscles: "腓肠肌、比目鱼肌、跟腱", difficulty: "初级",
    description: "面对墙壁，脚尖距墙一定距离，膝盖前移触碰墙壁，脚后跟不离地。评估和改善踝关节背屈活动度的经典方法。良好的踝背屈=更深的起跳角度=更长的发力距离=更高的跳跃。目标：脚尖距墙>13cm（优秀）。",
    coachingCues: ["脚后跟全程贴地", "膝盖对准第二个脚趾方向——不要内扣", "每天做，每次保持30秒", "目标：脚尖距墙13cm以上"],
    setsReps: "每侧3-5次×30秒保持", icon: "🦶",
  },
  {
    id: "hip-flexor-stretch", name: "髋屈肌拉伸", nameEn: "Hip Flexor Stretch", category: "mobility",
    targetMuscles: "髂腰肌、股直肌、阔筋膜张肌", difficulty: "初级",
    description: "弓步姿势，后腿膝盖着地，将后脚拉向臀部（或靠墙），前移重心感受髋前侧的拉伸。久坐导致髋屈肌缩短，限制起跳时髋关节伸展幅度，直接影响跳跃高度——髋伸展每减少10°，CMJ下降约2-4cm。",
    coachingCues: ["核心收紧，骨盆后倾——避免腰椎代偿", "前移重心直到感觉到髋前侧强烈拉伸", "保持30-60秒，不要弹震", "训练前后都可以做"],
    setsReps: "每侧3次×30-60秒", icon: "🧘",
  },
  {
    id: "thoracic-spine-rotation", name: "胸椎旋转", nameEn: "Thoracic Spine Rotation", category: "mobility",
    targetMuscles: "胸椎、肋间肌、背阔肌", difficulty: "初级",
    description: "侧卧或四足跪姿，一手放在头后，向对侧旋转打开胸椎，眼睛跟随手臂方向。胸椎活动度影响摆臂幅度和全身协调性——僵硬的胸椎=受限的摆臂=降低的跳跃效率。胸椎应贡献约35-40°的旋转幅度。",
    coachingCues: ["旋转时骨盆保持不动——只有胸椎在转", "呼气时加深旋转幅度", "转到最大幅度保持2-3秒", "如果有卡顿感说明该侧胸椎受限"],
    setsReps: "每侧8-10次", icon: "🧘",
  },
  {
    id: "couch-stretch", name: "沙发拉伸", nameEn: "Couch Stretch", category: "mobility",
    targetMuscles: "股直肌、髂腰肌、股四头肌远端", difficulty: "初级",
    description: "后膝靠墙或靠沙发边缘，前脚踩地成弓步，保持骨盆后倾，感受大腿前侧的深度拉伸。沙发拉伸是髋屈肌拉伸的进阶版，特别针对股直肌——这块肌肉在跳跃时既屈髋又伸膝（双关节肌），紧张会显著影响跳跃幅度和蹬伸效率。",
    coachingCues: ["后膝尽量靠墙——距离越小拉伸越强", "骨盆后倾——核心收紧避免腰椎前凸", "保持60-120秒——这是需要耐心拉伸的部位", "训练前做动态版，训练后做静态版"],
    setsReps: "每侧2-3次×60-120秒", icon: "🛋️",
  },
  {
    id: "pigeon-stretch", name: "鸽子式拉伸", nameEn: "Pigeon Stretch", category: "mobility",
    targetMuscles: "梨状肌、臀大肌深层、髋外旋肌群", difficulty: "初级",
    description: "前腿屈膝横放在身体前方，后腿向后伸直，上身前倾感受臀深层的拉伸。鸽子式针对臀部深层外旋肌群——这些肌肉在跳跃的髋伸展和落地稳定中扮演关键角色。紧张的梨状肌会导致骨盆旋转，影响力量传递。",
    coachingCues: ["前腿小腿尽量与垫子前缘平行", "感到臀部深层拉伸而非膝盖痛——调整角度", "保持深呼吸——帮助臀肌放松", "如果膝盖不适，在臀下垫毛巾"],
    setsReps: "每侧2-3次×45-60秒", icon: "🕊️",
  },
  {
    id: "hip-airplane", name: "髋关节飞机式", nameEn: "Hip Airplane", category: "mobility",
    targetMuscles: "髋关节囊、臀中肌、梨状肌、核心", difficulty: "中级",
    description: "单腿站立，对侧腿向后抬起，身体前倾，双臂侧展像飞机翅膀，以支撑腿髋关节为轴心旋转身体。髋飞机是动态髋关节活动度和单腿稳定性的高级训练——在单腿站立（大多数跳跃的启动位置）下挑战髋关节所有平面的活动范围。",
    coachingCues: ["支撑腿微屈膝——不要锁死", "以髋关节为轴心旋转——不是腰", "旋转幅度由小到大——不要勉强", "每侧做5-8次缓慢控制的旋转"],
    setsReps: "每侧2-3组×5-8次", icon: "✈️",
  },
  {
    id: "ankle-abc", name: "踝关节字母练习", nameEn: "Ankle Alphabet Drill", category: "mobility",
    targetMuscles: "踝关节所有活动平面肌群", difficulty: "初级",
    description: "坐姿或站姿（单腿），用脚趾在空中写出A到Z所有字母。这个简单的练习能活动踝关节的所有方向——背屈、跖屈、内翻、外翻及其组合。特别适合训练前激活和伤病恢复期维持踝关节活动度。",
    coachingCues: ["每个字母都写大——最大化关节活动范围", "用脚踝发力——不是用膝盖和髋", "每天都可以做——作为日常踝关节维护", "伤病恢复期特别重要——防止关节僵硬"],
    setsReps: "每侧A到Z一遍", icon: "🔤",
  },

  // ================================================================
  // 恢复与预康复
  // ================================================================
  {
    id: "foam-rolling-quads", name: "泡沫轴放松——股四头肌", nameEn: "Foam Rolling: Quadriceps", category: "recovery",
    targetMuscles: "股四头肌、髂胫束", difficulty: "初级",
    description: "俯卧，泡沫轴置于大腿下方，用体重压力前后滚动。泡沫轴自我筋膜放松可以缓解肌肉紧张、促进血液循环、加速训练后恢复。股四头肌是跳跃训练中负荷最大的肌群之一，需要定期放松以维持肌肉质量和防止髌腱过度负荷。",
    coachingCues: ["滚到最酸痛的点停住30秒", "呼吸要深——帮助肌肉放松", "不要直接滚膝盖和髋骨", "训练后做效果最好"],
    setsReps: "每侧2-3分钟", icon: "🫧",
  },
  {
    id: "banded-ankle-distraction", name: "弹力带踝关节牵引", nameEn: "Banded Ankle Distraction", category: "recovery",
    targetMuscles: "踝关节囊、距骨", difficulty: "初级",
    description: "用弹力带固定在脚踝前方，向前跨步，弹力带将距骨向前牵引，同时进行踝背屈活动。通过关节牵引增加关节间隙，配合主动运动恢复活动度。对于踝背屈受限（<10cm膝到墙测试）的运动员，这是最有效的干预手段之一。",
    coachingCues: ["弹力带尽量固定在踝关节前方低处", "牵引力要大——感觉关节被拉开", "在牵引状态下主动做背屈动作10-15次", "左右踝都要做"],
    setsReps: "每侧2-3组×10-15次", icon: "🩹",
  },
  {
    id: "single-leg-balance", name: "单腿平衡训练", nameEn: "Single Leg Balance", category: "recovery",
    targetMuscles: "踝关节本体感觉、足部内在肌、核心", difficulty: "初级",
    description: "单腿站立，保持稳定。进阶：闭眼、站在软垫上、接抛球、或在平衡板上。良好的本体感觉和踝关节稳定性是预防扭伤的关键——踝关节扭伤是弹跳训练最常见伤病之一。单腿平衡也是所有单腿训练的安全前提。",
    coachingCues: ["从睁眼平底开始——坚持30秒", "进阶到闭眼", "再进阶到软垫/泡沫垫", "最终目标：闭眼软垫60秒"],
    setsReps: "每侧3-5次×30-60秒", icon: "⚖️",
  },
  {
    id: "foam-rolling-calves", name: "泡沫轴放松——小腿", nameEn: "Foam Rolling: Calves", category: "recovery",
    targetMuscles: "腓肠肌、比目鱼肌、跟腱", difficulty: "初级",
    description: "坐姿将泡沫轴置于小腿下方，用体重压力前后滚动，重点放松腓肠肌和比目鱼肌。小腿是弹跳训练中负荷最高但又最容易被忽视的肌群——定期放松预防跟腱炎和足底筋膜炎。",
    coachingCues: ["从跟腱上方滚到膝盖后方", "脚尖朝内/朝外变换角度——放松不同肌纤维", "酸痛点停住30秒", "训练后做，配合拉伸效果更好"],
    setsReps: "每侧2-3分钟", icon: "🫧",
  },
  {
    id: "contrast-bath", name: "冷热交替浴", nameEn: "Contrast Bath Therapy", category: "recovery",
    targetMuscles: "全身循环系统、肌肉筋膜", difficulty: "初级",
    description: "交替使用热水（38-42°C）和冷水（10-15°C）浸泡下肢，各1-3分钟，重复3-5轮。冷热交替通过血管的收缩和扩张促进血液循环和代谢废物清除，是专业运动员常用的恢复手段，特别适合高强度训练日后的恢复。",
    coachingCues: ["热水1-3分钟 → 冷水1分钟 → 重复3-5轮", "以冷水结束——减少炎症反应", "训练后30分钟内效果最好", "没有条件可用淋浴交替冲腿"],
    setsReps: "3-5轮交替", icon: "🌡️",
  },
  {
    id: "banded-glute-bridge", name: "弹力带臀桥", nameEn: "Banded Glute Bridge", category: "recovery",
    targetMuscles: "臀大肌（激活）、腘绳肌", difficulty: "初级",
    description: "仰卧屈膝，弹力带套在膝盖上方，臀部发力上推至身体成直线，同时膝盖向外对抗弹力带。弹力带臀桥是训练前激活臀大肌的黄金动作——很多人的臀肌在久坐后'失活'（臀肌失忆症），导致跳跃时过多依赖股四头肌和下背部，增加伤病风险。",
    coachingCues: ["膝盖持续对抗弹力带向外——不要内扣", "推到顶峰夹臀2秒", "下降控制——感受臀肌拉伸", "可以做高次数——15-20次激活效果最好"],
    setsReps: "2-3组×15-20次", icon: "🍑",
  },
  {
    id: "banded-lateral-walk", name: "弹力带侧走", nameEn: "Banded Lateral Walk", category: "recovery",
    targetMuscles: "臀中肌、臀小肌、阔筋膜张肌", difficulty: "初级",
    description: "弹力带套在膝盖上方或脚踝，微蹲姿势，向侧方行走保持弹力带张力不松弛。弹力带侧走是激活臀中肌的最实用方法——臀中肌是髋关节侧向稳定器，对跳跃落地时防止膝关节内扣（动态膝外翻）至关重要。训练前必做的激活动作。",
    coachingCues: ["保持微蹲姿势——不要站起来", "膝盖对准脚尖——持续对抗弹力带", "步幅小——15-20cm", "每侧走10-15步后换方向"],
    setsReps: "2-3组×10-15步/每方向", icon: "🦀",
  },
  {
    id: "eccentric-heel-drop", name: "离心提踵下降", nameEn: "Eccentric Heel Drop", category: "recovery",
    targetMuscles: "腓肠肌、比目鱼肌、跟腱", difficulty: "初级",
    description: "双脚站在台阶边缘，踮脚到最高点后，用一条腿（或双腿）缓慢下降脚后跟至最低点（3-4秒），然后用双腿踮回最高点，重复。离心提踵下降是跟腱炎康复的金标准训练（Alfredson Protocol）——离心负荷促进跟腱胶原蛋白的修复和有序排列。",
    coachingCues: ["上升用双腿——下降用单腿（或双腿控制）", "离心阶段3-4秒缓慢放下", "直膝针对腓肠肌，屈膝针对比目鱼肌", "轻微疼痛可接受（VAS<4/10），尖锐疼痛则停止"],
    setsReps: "3组×15次（直膝）+3组×15次（屈膝）", icon: "🦶",
    caution: "跟腱断裂急性期（<6周）禁用；从双腿离心开始再进阶到单腿"
  },
];

export function getExercisesByCategory(categoryId: string): Exercise[] {
  return EXERCISES.filter(e => e.category === categoryId);
}

export function searchExercises(query: string): Exercise[] {
  const q = query.toLowerCase();
  return EXERCISES.filter(e =>
    e.name.includes(q) || e.nameEn.toLowerCase().includes(q) ||
    e.targetMuscles.includes(q) || e.description.includes(q)
  );
}
