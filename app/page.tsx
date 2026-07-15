"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type View = "chat" | "home" | "nearby" | "messages" | "growth" | "meet";

type PetChoice = {
  id: string;
  name: string;
  petName: string;
  emoji: string;
  note: string;
  color: string;
  category: string;
  story: string;
  match: number;
};

type Match = {
  id: string;
  pet: string;
  emoji: string;
  preset: string;
  owner: string;
  score: number;
  distance: string;
  status: string;
  tags: string[];
  color: string;
};

const petChoices: PetChoice[] = [
  { id: "fox", name: "眼镜小狐狸", petName: "小焰", emoji: "🦊", note: "机灵热情，会接住你的每个梗", color: "#ff8a4c", category: "元气派", story: "总把新鲜事装进口袋，最期待陪你探索园区里没去过的咖啡角。", match: 96 },
  { id: "cat", name: "云朵布偶猫", petName: "蓝莓", emoji: "🐱", note: "温柔细腻，熟悉后很黏人", color: "#7396ff", category: "慢热型", story: "喜欢安静地观察世界。你不想说话时，它会先陪你坐一会儿。", match: 94 },
  { id: "dog", name: "星星柯基", petName: "有米", emoji: "🐶", note: "元气直接，永远行动力满格", color: "#f7b84b", category: "元气派", story: "最擅长把“改天吧”变成“现在出发”，口袋里永远装着快乐。", match: 91 },
  { id: "panda", name: "围巾小熊猫", petName: "墨墨", emoji: "🐼", note: "佛系幽默，是天然的治愈派", color: "#8a5a48", category: "治愈系", story: "相信所有坏心情都能被一个拥抱和一顿好吃的慢慢消化。", match: 93 },
  { id: "rabbit", name: "垂耳兔", petName: "糖耳", emoji: "🐰", note: "柔软害羞，记得每个小细节", color: "#f3a7bd", category: "慢热型", story: "会把你随口提过的小愿望写进秘密日记，等合适的时候给你惊喜。", match: 97 },
  { id: "golden", name: "金毛幼犬", petName: "麦芽", emoji: "🐕", note: "真诚开朗，对世界充满好奇", color: "#d9a15d", category: "元气派", story: "见到每个人都想摇尾巴，但会坚定地把最喜欢的位置留给你。", match: 95 },
  { id: "penguin", name: "针织帽企鹅", petName: "冰豆", emoji: "🐧", note: "冷静靠谱，偶尔一本正经搞笑", color: "#e4bc55", category: "治愈系", story: "走路慢一点没关系，它会陪你把每一步都踩得稳稳当当。", match: 88 },
  { id: "axolotl", name: "泡泡六角龙", petName: "啵啵", emoji: "🫧", note: "软萌乐观，情绪恢复速度超快", color: "#ef91ad", category: "治愈系", story: "住在自己的粉色泡泡里，也随时欢迎你进去休息五分钟。", match: 92 },
  { id: "dragon", name: "薄荷小龙", petName: "青团", emoji: "🐉", note: "勇敢好奇，喜欢收集微小宝藏", color: "#77c8aa", category: "奇幻种", story: "还不会喷火，但已经学会用勇气替你照亮陌生的第一步。", match: 90 },
  { id: "capybara", name: "水豚先生", petName: "松饼", emoji: "🦫", note: "情绪稳定，什么场面都很松弛", color: "#b48a62", category: "治愈系", story: "它的人生哲学只有一句：别着急，先晒会儿太阳再决定。", match: 98 },
  { id: "otter", name: "挎包小水獭", petName: "浪花", emoji: "🦦", note: "爱玩爱笑，擅长制造共同话题", color: "#6f91c9", category: "元气派", story: "随身小包里装着石头、零食和十个随时能用的破冰小游戏。", match: 89 },
  { id: "fennec", name: "耳机耳廓狐", petName: "月牙", emoji: "🦊", note: "敏锐浪漫，拥有自己的歌单宇宙", color: "#b391d9", category: "慢热型", story: "耳朵能听见很远的声音，也最懂那些你没有说出口的心情。", match: 94 },
  { id: "alpaca", name: "奶油羊驼", petName: "云朵", emoji: "🦙", note: "温吞可爱，擅长给人安全感", color: "#8eb9df", category: "治愈系", story: "像一团会走路的云，愿意替你挡住一点点不必要的焦虑。", match: 96 },
  { id: "hamster", name: "卫衣仓鼠", petName: "奶酪", emoji: "🐹", note: "小小一只，却拥有超强生活力", color: "#ed826b", category: "元气派", story: "会把一天分成很多个值得庆祝的小格子，完成一件就开心一次。", match: 87 },
  { id: "seal", name: "水手小海豹", petName: "小浪", emoji: "🦭", note: "单纯亲切，见面从不会冷场", color: "#6488bd", category: "治愈系", story: "刚从很远的海面旅行回来，肚子里装满了适合午休讲的小故事。", match: 90 },
  { id: "raccoon", name: "渔夫帽浣熊", petName: "灰灰", emoji: "🦝", note: "古灵精怪，特别会发现隐藏彩蛋", color: "#d0a23e", category: "奇幻种", story: "擅长在普通日子里翻出宝藏，也擅长把尴尬悄悄藏起来。", match: 93 },
];

const adoptionFilters = ["全部", "治愈系", "元气派", "慢热型", "奇幻种"];

const personalities = ["热情社牛", "傲娇慢热", "佛系治愈", "机智搞笑", "安静社恐"];
const interestOptions = ["City Walk", "咖啡探店", "脱口秀", "王者荣耀", "健身", "摄影", "撸猫", "周末看展"];

const matches: Match[] = [
  {
    id: "m1",
    pet: "团子",
    emoji: "🐱",
    preset: "cat",
    owner: "B 座 · 产品设计",
    score: 92,
    distance: "180m",
    status: "午休想喝一杯燕麦拿铁",
    tags: ["咖啡探店", "脱口秀", "12:10 午休"],
    color: "#829cff",
  },
  {
    id: "m2",
    pet: "可乐",
    emoji: "🐶",
    preset: "dog",
    owner: "K1 · 前端开发",
    score: 87,
    distance: "260m",
    status: "今晚开黑，缺一个打野",
    tags: ["王者荣耀", "不加班", "ENFP"],
    color: "#f0aa4c",
  },
  {
    id: "m3",
    pet: "糯米",
    emoji: "🐼",
    preset: "panda",
    owner: "A 座 · 内容运营",
    score: 81,
    distance: "420m",
    status: "周末想去看新媒体艺术展",
    tags: ["周末看展", "摄影", "慢热"],
    color: "#6c7287",
  },
];

const navItems: { id: View; icon: string; label: string }[] = [
  { id: "chat", icon: "✦", label: "文心入口" },
  { id: "home", icon: "⌂", label: "我的萌宠" },
  { id: "nearby", icon: "⌖", label: "附近搭子" },
  { id: "messages", icon: "◌", label: "消息" },
  { id: "growth", icon: "♧", label: "成长手册" },
];

const presetSprites: Record<string, { image: string; position: string; size: string }> = {
  fox: { image: "/assets/pet-presets-3d.png", position: "0% 0%", size: "200% 200%" },
  cat: { image: "/assets/pet-presets-3d.png", position: "100% 0%", size: "200% 200%" },
  dog: { image: "/assets/pet-presets-3d.png", position: "0% 100%", size: "200% 200%" },
  panda: { image: "/assets/pet-presets-3d.png", position: "100% 100%", size: "200% 200%" },
  rabbit: { image: "/assets/pet-presets-3d-plus.png", position: "0% 0%", size: "400% 300%" },
  golden: { image: "/assets/pet-presets-3d-plus.png", position: "33.333% 0%", size: "400% 300%" },
  penguin: { image: "/assets/pet-presets-3d-plus.png", position: "66.667% 0%", size: "400% 300%" },
  axolotl: { image: "/assets/pet-presets-3d-plus.png", position: "100% 0%", size: "400% 300%" },
  dragon: { image: "/assets/pet-presets-3d-plus.png", position: "0% 50%", size: "400% 300%" },
  capybara: { image: "/assets/pet-presets-3d-plus.png", position: "33.333% 50%", size: "400% 300%" },
  otter: { image: "/assets/pet-presets-3d-plus.png", position: "66.667% 50%", size: "400% 300%" },
  fennec: { image: "/assets/pet-presets-3d-plus.png", position: "100% 50%", size: "400% 300%" },
  alpaca: { image: "/assets/pet-presets-3d-plus.png", position: "0% 100%", size: "400% 300%" },
  hamster: { image: "/assets/pet-presets-3d-plus.png", position: "33.333% 100%", size: "400% 300%" },
  seal: { image: "/assets/pet-presets-3d-plus.png", position: "66.667% 100%", size: "400% 300%" },
  raccoon: { image: "/assets/pet-presets-3d-plus.png", position: "100% 100%", size: "400% 300%" },
};

function PetAvatar({ emoji, color, size = "md", pulse = false, preset }: { emoji: string; color: string; size?: "sm" | "md" | "lg" | "xl"; pulse?: boolean; preset?: string }) {
  const sprite = preset ? presetSprites[preset] : undefined;
  return (
    <div className={`pet-avatar pet-${size} ${pulse ? "pet-pulse" : ""} ${preset ? "is-3d" : ""}`} style={{ "--pet-color": color } as React.CSSProperties}>
      {sprite ? <span className="pet-render-sprite" style={{ backgroundImage: `url('${sprite.image}')`, backgroundPosition: sprite.position, backgroundSize: sprite.size }} /> : <span>{emoji}</span>}
    </div>
  );
}

function PetGifAvatar({ pet, size = "lg", className = "" }: { pet: PetChoice; size?: "lg" | "xl"; className?: string }) {
  return (
    <span className={`pet-avatar pet-${size} pet-pulse is-3d pet-gif-avatar ${className}`} style={{ "--pet-color": pet.color } as React.CSSProperties}>
      <span key={pet.id} className="pet-gif-render" style={{ backgroundImage: `url('/assets/pets/${pet.id}.gif')` }} aria-hidden="true" />
    </span>
  );
}

function FloatingPet({ pet, status, onOpen }: { pet: PetChoice; status: string; onOpen: () => void }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragStart = useRef<{ x: number; y: number; offsetX: number; offsetY: number; moved: boolean } | null>(null);

  function onPointerDown(event: React.PointerEvent<HTMLButtonElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStart.current = { x: event.clientX, y: event.clientY, offsetX: offset.x, offsetY: offset.y, moved: false };
  }

  function onPointerMove(event: React.PointerEvent<HTMLButtonElement>) {
    const start = dragStart.current;
    if (!start) return;
    const nextX = start.offsetX + event.clientX - start.x;
    const nextY = start.offsetY + event.clientY - start.y;
    start.moved ||= Math.abs(nextX - start.offsetX) > 4 || Math.abs(nextY - start.offsetY) > 4;
    setOffset({
      x: Math.min(24, Math.max(-(window.innerWidth - 130), nextX)),
      y: Math.min(window.innerHeight - 118, Math.max(-(window.innerHeight - 150), nextY)),
    });
  }

  function onPointerUp(event: React.PointerEvent<HTMLButtonElement>) {
    const wasDragged = dragStart.current?.moved;
    dragStart.current = null;
    if (!wasDragged) onOpen();
    event.currentTarget.releasePointerCapture(event.pointerId);
  }

  return (
    <button
      className="floating-pet"
      data-pet-id={pet.id}
      style={{ transform: `translate3d(${offset.x}px, ${offset.y}px, 0)` }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={() => { dragStart.current = null; }}
      aria-label={`拖动${pet.petName}移动，点击打开主页`}
    >
      <span className="floating-pet-bubble"><i>●</i>{status}</span>
      <span className="floating-pet-hint">按住拖动</span>
      <PetGifAvatar pet={pet} size="lg" />
      <small>{pet.petName}</small>
    </button>
  );
}

function MeetupRoutes({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.round(rect.width * ratio);
      canvas.height = Math.round(rect.height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, rect.width, rect.height);

      const paths = [
        { color: "#4078ed", points: [0.12, 0.76, 0.27, 0.72, 0.35, 0.57, 0.49, 0.5] },
        { color: "#8a6ee5", points: [0.87, 0.19, 0.72, 0.22, 0.65, 0.42, 0.52, 0.48] },
      ];

      paths.forEach(({ color, points }) => {
        const [sx, sy, c1x, c1y, c2x, c2y, ex, ey] = points;
        const trace = () => {
          context.beginPath();
          context.moveTo(sx * rect.width, sy * rect.height);
          context.bezierCurveTo(c1x * rect.width, c1y * rect.height, c2x * rect.width, c2y * rect.height, ex * rect.width, ey * rect.height);
        };
        trace(); context.strokeStyle = "rgba(255,255,255,.96)"; context.lineWidth = 10; context.lineCap = "round"; context.stroke();
        trace(); context.strokeStyle = color; context.lineWidth = 5; context.setLineDash(active ? [10, 7] : []); context.lineDashOffset = active ? -6 : 0; context.stroke(); context.setLineDash([]);

        [0.25, 0.5, 0.75].forEach((t) => {
          const mt = 1 - t;
          const x = mt ** 3 * sx + 3 * mt ** 2 * t * c1x + 3 * mt * t ** 2 * c2x + t ** 3 * ex;
          const y = mt ** 3 * sy + 3 * mt ** 2 * t * c1y + 3 * mt * t ** 2 * c2y + t ** 3 * ey;
          context.beginPath(); context.arc(x * rect.width, y * rect.height, 5, 0, Math.PI * 2); context.fillStyle = "#fff"; context.fill(); context.lineWidth = 3; context.strokeStyle = color; context.stroke();
        });
      });
    };

    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [active]);

  return <canvas ref={canvasRef} className="meet-route-canvas" aria-hidden="true" />;
}

export default function Home() {
  const [view, setView] = useState<View>("chat");
  const [petCreated, setPetCreated] = useState(false);
  const [creatorOpen, setCreatorOpen] = useState(false);
  const [creatorStep, setCreatorStep] = useState(1);
  const [adoptionFilter, setAdoptionFilter] = useState("全部");
  const [selectedPet, setSelectedPet] = useState(petChoices[0]);
  const [personality, setPersonality] = useState(personalities[0]);
  const [interests, setInterests] = useState<string[]>(["City Walk", "咖啡探店", "脱口秀"]);
  const [generating, setGenerating] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatStarted, setChatStarted] = useState(false);
  const [locationLevel, setLocationLevel] = useState("楼栋级");
  const [mapMode, setMapMode] = useState<"pet" | "heat">("pet");
  const [mapSelected, setMapSelected] = useState("m1");
  const [distanceFilter, setDistanceFilter] = useState("500m");
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [pawRound, setPawRound] = useState(0);
  const [humanJoined, setHumanJoined] = useState(false);
  const [shareActive, setShareActive] = useState(false);
  const [shareSeconds, setShareSeconds] = useState(30 * 60);
  const [met, setMet] = useState(false);
  const [toast, setToast] = useState("");

  const petName = selectedPet.petName;
  const floatingPetStatus = view === "chat" ? "正在听你说话…" : view === "nearby" ? "发现 3 个同频搭子" : view === "messages" ? "有新消息，快来看看" : "今天心情很好 ✦";

  useEffect(() => {
    if (!selectedMatch || humanJoined || pawRound >= 3) return;
    const timer = window.setTimeout(() => setPawRound((round) => round + 1), 850);
    return () => window.clearTimeout(timer);
  }, [selectedMatch, pawRound, humanJoined]);

  useEffect(() => {
    if (!shareActive || shareSeconds <= 0) return;
    const timer = window.setInterval(() => setShareSeconds((seconds) => Math.max(0, seconds - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [shareActive, shareSeconds]);

  useEffect(() => {
    if (!shareActive) return;
    const timer = window.setTimeout(() => {
      setMet(true);
      setShareActive(false);
      setToast("双方已到达漫咖啡，位置共享自动关闭");
    }, 12000);
    return () => window.clearTimeout(timer);
  }, [shareActive]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const timeLeft = useMemo(() => {
    const minutes = Math.floor(shareSeconds / 60).toString().padStart(2, "0");
    const seconds = (shareSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  }, [shareSeconds]);

  const adoptionPets = useMemo(
    () => adoptionFilter === "全部" ? petChoices : petChoices.filter((pet) => pet.category === adoptionFilter),
    [adoptionFilter],
  );

  function toggleInterest(tag: string) {
    setInterests((current) => current.includes(tag) ? current.filter((item) => item !== tag) : current.length < 4 ? [...current, tag] : current);
  }

  function runGeneration() {
    setGenerating(true);
    window.setTimeout(() => {
      setGenerating(false);
      setCreatorStep(3);
    }, 1500);
  }

  function confirmPet() {
    setPetCreated(true);
    setCreatorOpen(false);
    setCreatorStep(1);
    setView("home");
    setToast(`${petName} 已经住进你的桌面啦`);
  }

  function openPaw(match: Match) {
    if (!petCreated) {
      setCreatorOpen(true);
      setToast("先创建萌宠，才能去碰爪哦");
      return;
    }
    setSelectedMatch(match);
    setPawRound(0);
    setHumanJoined(false);
  }

  function submitChat(event: FormEvent) {
    event.preventDefault();
    if (!chatInput.trim()) return;
    setChatStarted(true);
    setChatInput("");
  }

  function navigate(next: View) {
    if (next === "home" && !petCreated) {
      setCreatorOpen(true);
      return;
    }
    setView(next);
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <button className="brand" onClick={() => setView("chat")} aria-label="返回文心入口">
          <span className="wenxin-wordmark"><img src="/wenxin-yiyan-official.png" alt="文心一言" /></span>
        </button>

        <button className="new-chat-button" onClick={() => setView("chat")}><span>＋</span> 开启新对话</button>

        <p className="nav-section-title">对话</p>
        <div className="wenxin-nav">
          <button><span>▱</span> 知识库</button>
          <button><span>◷</span> 对话历史 <i>⌄</i></button>
        </div>

        <div className="pet-plugin-label"><span>智能体</span><i>NEW</i></div>

        <button className={`pet-plugin-card ${view !== "chat" ? "active" : ""}`} onClick={() => petCreated ? setView("home") : setCreatorOpen(true)}>
          <span className="plugin-icon">🐾</span>
          <span><b>萌宠搭子</b><small>{petCreated ? `${petName} 正在陪伴你` : "轻量 AI 社交功能"}</small></span>
          <i>›</i>
        </button>
        {petCreated && <div className="pet-plugin-actions"><button onClick={() => setView("home")}>我的萌宠</button><button onClick={() => { setCreatorStep(1); setCreatorOpen(true); }}>更换萌宠</button></div>}

        <div className="side-bottom">
          <button className="mock-status"><span /> 萌宠搭子正在运行</button>
          <button className="profile-mini" onClick={() => petCreated ? setView("home") : setCreatorOpen(true)}>
            {petCreated ? <PetAvatar emoji={selectedPet.emoji} color={selectedPet.color} preset={selectedPet.id} size="sm" /> : <span className="empty-avatar">人</span>}
            <span><b>随意剑仙</b><small>{petCreated ? `${petName}的主人` : "还没有萌宠"}</small></span>
            <i>···</i>
          </button>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div className="mobile-brand"><span className="wenxin-icon-crop"><img src="/wenxin-yiyan-official.png" alt="" /></span> 文心一言</div>
          <div className="breadcrumb"><span>文心一言</span><i>／</i><b>{view === "chat" ? "新对话" : `萌宠搭子 · ${navItems.find((item) => item.id === view)?.label ?? "地图约见"}`}</b></div>
          <div className="top-actions">
            <button className="icon-button" aria-label="通知">♢<em>2</em></button>
          </div>
        </header>

        <div className="content-area">
          {view === "chat" && (
            <section className="chat-entry page-enter">
              <div className="entry-head">
                <div className="wenxin-orb wenxin-icon-crop"><img src="/wenxin-yiyan-official.png" alt="文心一言" /><i /></div>
                <p className="eyebrow">文心一言</p>
                <h1>{petCreated ? "你好，今天有什么我能帮你的？" : "你好，今天有什么我能帮你的？"}</h1>
                <p>{petCreated ? `${petName}也在一旁陪着你，需要时可以让 TA 帮你认识同频的人。` : "问问题、找灵感、写内容，或者体验一个会替你社交的 AI 萌宠。"}</p>
              </div>

              <div className="chat-stage">
                {chatStarted && (
                  <div className="mini-conversation">
                    <div className="user-bubble">最近想认识一些能午休喝咖啡的朋友。</div>
                    <div className="ai-bubble"><span>✦</span><p>收到。我听见了三个关键词：<b>午休同频、咖啡搭子、低压力社交</b>。让萌宠先替你打个招呼，会更自然。</p></div>
                  </div>
                )}
                <form className="composer" onSubmit={submitChat}>
                  <textarea value={chatInput} onChange={(event) => setChatInput(event.target.value)} placeholder={petCreated ? `告诉${petName}你今天的心情或计划…` : "和我聊聊你的性格、兴趣，或者最近想认识怎样的人…"} />
                  <div className="composer-tools">
                    <div><button type="button">◎ 深度思考</button><button type="button">文心大模型⌄</button></div>
                    <div><button type="button" aria-label="添加图片">＋</button><button className="send-button" aria-label="发送">↑</button></div>
                  </div>
                </form>

                {!petCreated ? (
                  <button className="create-prompt" onClick={() => setCreatorOpen(true)}>
                    <span className="prompt-pet">🐾</span>
                    <span><b>萌宠搭子</b><small>让一只 AI 萌宠理解你，替你轻松破冰</small></span>
                    <em>体验功能 →</em>
                  </button>
                ) : (
                  <div className="pet-understanding">
                    <PetAvatar emoji={selectedPet.emoji} color={selectedPet.color} preset={selectedPet.id} size="sm" pulse />
                    <span><b>{petName} 正在理解你</b><small>已更新标签：午休有空 · 咖啡探店 · 轻松破冰</small></span>
                    <div className="pet-understanding-actions"><button className="replace-pet-button" onClick={() => { setCreatorStep(1); setCreatorOpen(true); }}>更换萌宠</button><button onClick={() => setView("nearby")}>去附近看看 →</button></div>
                  </div>
                )}

                <div className="quick-prompts">
                  {["帮我总结一篇文章", "写一个周末旅行计划", "解释一个复杂概念"].map((prompt) => (
                    <button key={prompt} onClick={() => { setChatInput(prompt); setChatStarted(true); }}>{prompt}</button>
                  ))}
                </div>
              </div>

            </section>
          )}

          {view === "home" && petCreated && (
            <section className="pet-home page-enter">
              <div className="page-title-row">
                <div><p className="eyebrow">MY AI PET</p><h1>嗨，我是 {petName}</h1><p>你的社交信使，也是最懂你节律的数字搭子。</p></div>
                <button className="primary-button" onClick={() => setView("nearby")}>去附近碰个爪</button>
              </div>

              <div className="pet-dashboard-grid">
                <article className="pet-hero-card" style={{ "--pet-color": selectedPet.color } as React.CSSProperties}>
                  <div className="floating-chip chip-one">Lv. 6 · 默契搭子</div>
                  <div className="floating-chip chip-two">心情很好 ✦</div>
                  <PetAvatar emoji={selectedPet.emoji} color={selectedPet.color} preset={selectedPet.id} size="xl" pulse />
                  <h2>{petName}</h2>
                  <p>“今天不想尬聊，想找个懂咖啡也懂梗的人。”</p>
                  <div className="pet-actions"><button onClick={() => { setCreatorStep(1); setCreatorOpen(true); }}>更换萌宠</button><button onClick={() => setView("chat")}>和我聊聊</button></div>
                </article>

                <article className="insight-card">
                  <div className="card-head"><span><i className="spark">✦</i><b>文心理解的你</b></span><button>管理标签</button></div>
                  <div className="insight-summary">
                    <strong>73%</strong>
                    <span><b>人格理解度</b><small>比上周更懂你 12%</small></span>
                    <div className="circle-progress" />
                  </div>
                  <div className="label-groups">
                    <div><small>显性兴趣</small><p>{interests.map((tag) => <span key={tag}>{tag}</span>)}</p></div>
                    <div><small>社交节律</small><p><span>12:10 午休</span><span>周五下班后</span><span>慢热开场</span></p></div>
                    <div><small>AI 推断 · 仅自己可见</small><p><span className="ai-tag">偏好小范围见面</span><span className="ai-tag">喜欢有目的的邀约</span></p></div>
                  </div>
                  <p className="privacy-note">🔒 AI 推断不会直接展示给其他用户，你可以随时删除。</p>
                </article>

                <article className="today-card">
                  <div className="card-head"><span><b>今日动态</b></span><button>全部</button></div>
                  <div className="timeline">
                    <div><i className="done">✓</i><span><b>更新了你的咖啡偏好</b><small>从最近 3 次对话中理解 · 10:24</small></span></div>
                    <div><i>🐾</i><span><b>发现 3 只同频萌宠</b><small>B 座与 K1，匹配度最高 92%</small></span></div>
                    <div><i>☕</i><span><b>午休碰爪窗口即将开启</b><small>12:00—13:30 · 楼栋级可见</small></span></div>
                  </div>
                </article>

                <article className="growth-mini-card">
                  <div className="card-head"><span><b>本周成长</b></span><small>4 / 7 天活跃</small></div>
                  <div className="growth-bars">{[45, 72, 36, 90, 62, 28, 15].map((height, index) => <i key={index} style={{ height: `${height}%` }} className={index === 3 ? "peak" : ""} />)}</div>
                  <p><b>再完成 2 次碰爪</b>，解锁「咖啡侦探」围巾</p>
                </article>
              </div>
            </section>
          )}

          {view === "nearby" && (
            <section className="nearby page-enter">
              <div className="page-title-row compact-title">
                <div><p className="eyebrow">NEARBY PAWS</p><h1>附近有谁和你同频？</h1><p>只显示模糊位置，先看萌宠与标签，不看身高收入。</p></div>
                <div className="location-control"><span className="live-dot" />位置可见：<select value={locationLevel} onChange={(event) => setLocationLevel(event.target.value)}><option>仅在线</option><option>楼栋级</option><option>楼层级 · 30分钟</option></select></div>
              </div>

              <div className="nearby-layout">
                <article className="map-card">
                  <div className="map-toolbar"><span><b>西二旗科技园</b><small><i className="live-dot" /> 已定位 · 精度约 200 米</small></span><div><button className={mapMode === "pet" ? "active" : ""} onClick={() => setMapMode("pet")}>萌宠</button><button className={mapMode === "heat" ? "active" : ""} onClick={() => setMapMode("heat")}>热力</button></div></div>
                  <div className="map-filterbar">
                    <div><span>距离</span>{["300m", "500m", "1km"].map((item) => <button key={item} className={distanceFilter === item ? "active" : ""} onClick={() => setDistanceFilter(item)}>{item}</button>)}</div>
                    <button className="map-filter-button">☷ 兴趣筛选 <b>3</b></button>
                  </div>
                  <div className={`fake-map ${mapMode === "heat" ? "heat-mode" : ""}`}>
                    <div className="road road-one" /><div className="road road-two" /><div className="road road-three" />
                    <div className="building b-one"><b>K1</b><small>研发中心</small></div>
                    <div className="building b-two"><b>B</b><small>创新大厦</small></div>
                    <div className="building b-three"><b>A3</b><small>内容中心</small></div>
                    <div className="building cafe"><b>☕</b><small>漫咖啡</small></div>
                    {mapMode === "heat" && <><span className="heat-spot heat-one" /><span className="heat-spot heat-two" /><span className="heat-spot heat-three" /></>}
                    <button className={`map-pet mp-one ${mapSelected === "m1" ? "selected" : ""}`} onClick={() => setMapSelected("m1")}><PetAvatar emoji="🐱" color="#829cff" preset="cat" size="sm" /><small>团子 · 92%</small></button>
                    <button className={`map-pet mp-two ${mapSelected === "m2" ? "selected" : ""}`} onClick={() => setMapSelected("m2")}><PetAvatar emoji="🐶" color="#f0aa4c" preset="dog" size="sm" /><small>可乐 · 87%</small></button>
                    <button className={`map-pet mp-three ${mapSelected === "m3" ? "selected" : ""}`} onClick={() => setMapSelected("m3")}><PetAvatar emoji="🐼" color="#6c7287" preset="panda" size="sm" /><small>糯米 · 81%</small></button>
                    {petCreated && <div className="you-pin"><PetAvatar emoji={selectedPet.emoji} color={selectedPet.color} preset={selectedPet.id} size="sm" /><span>你在这里</span></div>}
                    <div className="map-controls"><button aria-label="回到我的位置">⌖</button><span /><button aria-label="放大地图">＋</button><button aria-label="缩小地图">−</button></div>
                    {(() => { const active = matches.find((item) => item.id === mapSelected) ?? matches[0]; return <div className="map-selection-card"><PetAvatar emoji={active.emoji} color={active.color} preset={active.preset} size="sm" /><span><b>{active.pet} <em>{active.score}% 同频</em></b><small>{active.distance} · {active.status}</small></span><button onClick={() => openPaw(active)}>碰个爪</button></div>; })()}
                    <div className="map-privacy">🔒 不保存历史轨迹 · 精确位置永不开放</div>
                  </div>
                </article>

                <div className="match-list">
                  <div className="match-list-head"><span><b>为你推荐</b><small>按节律与兴趣排序</small></span><button>换一批 ↻</button></div>
                  {matches.map((match) => (
                    <article className={`match-card ${mapSelected === match.id ? "selected" : ""}`} key={match.id} onClick={() => setMapSelected(match.id)}>
                    <div className="match-avatar-wrap"><PetAvatar emoji={match.emoji} color={match.color} preset={match.preset} size="md" /><strong>{match.score}%</strong></div>
                      <div className="match-main"><div><h3>{match.pet}</h3><span className="online-badge">在线</span><small>{match.distance}</small></div><p>“{match.status}”</p><small>{match.owner}</small><div className="match-tags">{match.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div>
                      <button className="paw-button" onClick={() => openPaw(match)}>🐾 碰个爪</button>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          )}

          {view === "messages" && (
            <section className="messages-page page-enter">
              <div className="page-title-row compact-title"><div><p className="eyebrow">MESSAGES</p><h1>萌宠带回了新消息</h1><p>AI 破冰与真人消息分开呈现，边界更清楚。</p></div></div>
              <div className="message-layout">
                <aside className="conversation-list">
                  <button className="active"><PetAvatar emoji="🐱" color="#829cff" preset="cat" size="sm" /><span><b>团子和 {petCreated ? petName : "小焰"}</b><small>我们都喜欢那家燕麦拿铁…</small></span><em>2</em></button>
                  <button><PetAvatar emoji="🐶" color="#f0aa4c" preset="dog" size="sm" /><span><b>可乐</b><small>今晚 8 点开黑吗？</small></span></button>
                  <button><span className="system-avatar">✦</span><span><b>萌宠搭子助手</b><small>本周成长报告已生成</small></span></button>
                </aside>
                <article className="conversation-preview">
                  <div className="conversation-title"><div><PetAvatar emoji="🐱" color="#829cff" preset="cat" size="sm" /><span><b>团子 × {petCreated ? petName : "小焰"}</b><small>真人聊天已双向解锁</small></span></div><button onClick={() => setView("meet")}>约一杯 ☕</button></div>
                  <div className="conversation-body">
                    <div className="date-label">今天 11:42 · AI 破冰摘要</div>
                    <div className="summary-bubble">两只萌宠发现你们都在 12:10 午休、喜欢低糖咖啡，也都看过上周的脱口秀开放麦。</div>
                    <div className="chat-row"><PetAvatar emoji="🐱" color="#829cff" preset="cat" size="sm" /><span>嗨～团子说你也常去楼下那家咖啡店？</span></div>
                    <div className="chat-row self"><span>是的！我一般十二点十分过去，人比较少 ☕</span><PetAvatar emoji={petCreated ? selectedPet.emoji : "🦊"} color={selectedPet.color} preset={petCreated ? selectedPet.id : "fox"} size="sm" /></div>
                    <div className="chat-row"><PetAvatar emoji="🐱" color="#829cff" preset="cat" size="sm" /><span>那今天一起？我们可以在 B 座大堂碰头。</span></div>
                  </div>
                  <div className="chat-input"><input placeholder="发消息给团子的主人…"/><button>发送</button></div>
                </article>
              </div>
            </section>
          )}

          {view === "growth" && (
            <section className="growth-page page-enter">
              <div className="page-title-row compact-title"><div><p className="eyebrow">PET JOURNEY</p><h1>{petCreated ? `${petName} 的成长手册` : "你的萌宠成长手册"}</h1><p>每次真实而舒适的互动，都会让萌宠更懂你。</p></div><button className="secondary-button">分享本周卡片</button></div>
              <div className="growth-grid">
                <article className="level-card"><p>当前等级</p><strong>Lv. 6</strong><h2>默契搭子</h2><div className="xp-track"><i /></div><small>1,860 / 2,400 XP</small><PetAvatar emoji={petCreated ? selectedPet.emoji : "🦊"} color={selectedPet.color} preset={petCreated ? selectedPet.id : "fox"} size="lg" /></article>
                <article className="achievement-card"><div className="card-head"><span><b>最近成就</b></span><small>已解锁 7 / 24</small></div><div className="achievement-list"><div><i>☕</i><span><b>咖啡雷达</b><small>完成 3 次咖啡邀约</small></span></div><div><i>🐾</i><span><b>破冰小能手</b><small>累计碰爪 10 次</small></span></div><div className="locked"><i>🎭</i><span><b>梗王之王</b><small>还差 2 次脱口秀话题</small></span></div></div></article>
                <article className="weekly-card"><div className="card-head"><span><b>本周社交能量</b></span><strong>+36%</strong></div><div className="week-chart">{[30, 46, 38, 72, 88, 54, 66].map((height, index) => <div key={index}><i style={{ height: `${height}%` }} /><small>{"一二三四五六日"[index]}</small></div>)}</div></article>
                <article className="memory-card"><div className="card-head"><span><b>AI 记忆胶囊</b></span><button>管理记忆</button></div><p>“你更喜欢一对一的见面，而且有明确地点和时间时会更安心。”</p><p>“午休是你最稳定的社交窗口，周三与周五状态最好。”</p><small>所有记忆仅用于匹配与对话，可随时查看、纠正或删除。</small></article>
              </div>
            </section>
          )}

          {view === "meet" && (
            <section className="meet-page page-enter">
              <div className="page-title-row compact-title"><div><button className="back-link" onClick={() => setView("messages")}>← 返回聊天</button><p className="eyebrow">BAIDU MAPS MEET</p><h1>一起去喝杯咖啡吧</h1><p>百度地图推荐双方步行都轻松的中间点。</p></div><div className={`share-state ${shareActive ? "active" : ""}`}><span />{shareActive ? `共享剩余 ${timeLeft}` : "尚未共享位置"}</div></div>
              <div className="meet-layout">
                <article className="meet-map-card">
                  <div className="meet-map">
                    <div className="map-grid"><span className="map-block block-a" /><span className="map-block block-b" /><span className="map-block block-c" /><span className="map-block block-d" /><span className="map-park">西二旗公园<small>WEST PARK</small></span><i className="map-water" /></div>
                    <div className="street-label street-one">西二旗北路</div><div className="street-label street-two">创新大街</div>
                    <div className="poi poi-one"><i>便</i><span>便利店</span></div><div className="poi poi-two"><i>园</i><span>创业园</span></div><div className="poi poi-three"><i>车</i><span>停车场</span></div>
                    <MeetupRoutes active={shareActive} />
                    <span className="route-distance route-distance-a">你 · 260 米</span><span className="route-distance route-distance-b">团子 · 310 米</span>
                    <div className={`traveler traveler-a ${shareActive ? "moving" : ""} ${met ? "arrived" : ""}`}><PetAvatar emoji={petCreated ? selectedPet.emoji : "🦊"} color={selectedPet.color} preset={petCreated ? selectedPet.id : "fox"} size="sm" /><small><b>你</b>{shareActive ? "正在前往 · 约 12 秒" : "K1 · 3 分钟"}</small></div>
                    <div className={`traveler traveler-b ${shareActive ? "moving" : ""} ${met ? "arrived" : ""}`}><PetAvatar emoji="🐱" color="#829cff" preset="cat" size="sm" /><small><b>团子</b>{shareActive ? "正在前往 · 约 12 秒" : "B 座 · 4 分钟"}</small></div>
                    <div className="destination-pin"><span>☕</span><div><b>漫咖啡</b><small>双方都方便的汇合点</small></div><em>4.7</em></div>
                    {met && <div className="met-banner"><span>🎉</span><b>{petCreated ? petName : "小焰"} 和团子相遇啦！</b><small>位置共享已自动关闭</small></div>}
                    <div className="map-branding"><b>百度地图</b><small>模拟地图数据</small></div>
                  </div>
                </article>

                <aside className="meet-panel">
                  <div className="meet-pets"><PetAvatar emoji={petCreated ? selectedPet.emoji : "🦊"} color={selectedPet.color} preset={petCreated ? selectedPet.id : "fox"} size="md" /><i>····· ☕ ·····</i><PetAvatar emoji="🐱" color="#829cff" preset="cat" size="md" /></div>
                  <h2>漫咖啡 · 园区店</h2><p className="place-meta">步行约 6 分钟 · 双方中间点 · 评分 4.7</p>
                  <div className="meet-option"><small>见面时间</small><div><button className="active">今天 12:15</button><button>今天 18:30</button></div></div>
                  <div className="meet-option"><small>位置权限</small><div><button className="active">仅本次 · 30分钟</button><button>只看距离</button></div></div>
                  <div className="safety-box"><span>🔒</span><p><b>双向开启才可见</b><small>不存储轨迹，结束后自动关闭；任何一方都可随时停止共享。</small></p></div>
                  {!shareActive ? <button className="primary-button full" onClick={() => { setMet(false); setShareActive(true); setShareSeconds(1800); setToast("双方已开启限时位置共享"); }}>开启共享并导航</button> : <button className="primary-button full arrive" disabled>萌宠正在沿路线前往…</button>}
                  <button className="text-button" onClick={() => setView("messages")}>取消本次约见</button>
                </aside>
              </div>
            </section>
          )}
        </div>

        <nav className="mobile-nav" aria-label="移动端导航">
          {navItems.slice(0, 5).map((item) => <button key={item.id} className={view === item.id ? "active" : ""} onClick={() => navigate(item.id)}><span>{item.icon}</span><small>{item.label.replace("文心入口", "文心").replace("附近搭子", "附近").replace("成长手册", "成长")}</small></button>)}
        </nav>
      </section>

      {petCreated && <FloatingPet pet={selectedPet} status={floatingPetStatus} onOpen={() => setView("home")} />}

      {creatorOpen && (
        <div className="modal-layer" role="dialog" aria-modal="true" aria-label="创建你的 AI 萌宠">
          <div className={`creator-modal ${creatorStep === 1 ? "adoption-modal" : ""}`}>
            <button className="modal-close" onClick={() => setCreatorOpen(false)} aria-label="关闭">×</button>
            <div className="creator-side">
              <div className="creator-orb">✦</div>
              <p>文心一言驱动</p>
              <h2>把你的性格，<br/>变成会说话的萌宠</h2>
              <div className="creator-steps"><div className={creatorStep >= 1 ? "active" : ""}><i>1</i><span><b>遇见萌宠</b><small>从领养所选择搭子</small></span></div><div className={creatorStep >= 2 ? "active" : ""}><i>2</i><span><b>注入灵魂</b><small>性格与兴趣标签</small></span></div><div className={creatorStep >= 3 ? "active" : ""}><i>3</i><span><b>生成完成</b><small>领养你的 AI 搭子</small></span></div></div>
              <small className="mock-tip">演示说明：形象与人格均由前端预置数据模拟</small>
            </div>

            <div className="creator-main">
              {creatorStep === 1 && (
                <>
                  <div className="adoption-header">
                    <div>
                      <span className="adoption-kicker">🐾 萌宠领养所 · 今日开放</span>
                      <h2>看看谁在等你带 TA 回家</h2>
                      <p>每只萌宠都有自己的性格种子。先凭眼缘认识，再把你的灵魂注入给 TA。</p>
                    </div>
                    <div className="shelter-count"><strong>{petChoices.length}</strong><span>只萌宠<br/>等待领养</span></div>
                  </div>
                  <div className="adoption-filters">
                    {adoptionFilters.map((filter) => (
                      <button key={filter} className={adoptionFilter === filter ? "active" : ""} aria-pressed={adoptionFilter === filter} onClick={() => setAdoptionFilter(filter)}>{filter}</button>
                    ))}
                  </div>
                  <div className="adoption-layout">
                    <div className="adoption-shelf">
                      <div className="adoption-grid">
                        {adoptionPets.map((pet) => (
                          <button key={pet.id} className={`adoption-card ${selectedPet.id === pet.id ? "active" : ""}`} onClick={() => setSelectedPet(pet)} style={{ "--choice-color": pet.color } as React.CSSProperties}>
                            <span className="adoption-heart">{selectedPet.id === pet.id ? "♥" : "♡"}</span>
                            <PetAvatar emoji={pet.emoji} color={pet.color} preset={pet.id} size="md" />
                            <span className="adoption-card-copy"><b>{pet.petName}</b><small>{pet.name}</small></span>
                            <em>{pet.category}</em>
                          </button>
                        ))}
                      </div>
                    </div>
                    <aside className="adoption-profile" style={{ "--choice-color": selectedPet.color } as React.CSSProperties}>
                      <span className="waiting-badge"><i /> 正在等待领养</span>
                      <div className="profile-pet-stage">
                        <span className="tiny-heart heart-one">♥</span><span className="tiny-heart heart-two">♥</span>
                        <PetGifAvatar pet={selectedPet} size="xl" className="adoption-preview-gif" />
                      </div>
                      <div className="profile-name-line">
                        <div><h3>{selectedPet.petName}</h3><p>{selectedPet.name}</p></div>
                        <strong>{selectedPet.match}%<small>与你契合</small></strong>
                      </div>
                      <p className="adoption-story">“{selectedPet.story}”</p>
                      <div className="adoption-traits"><span>{selectedPet.category}</span><span>{selectedPet.note.split("，")[0]}</span><span>可换装</span></div>
                      <button className="adopt-button" onClick={() => setCreatorStep(2)}><span>♥</span> 就决定是 TA 了</button>
                      <small className="adoption-promise">领养后仍可调整外观，不会丢失成长记录</small>
                    </aside>
                  </div>
                </>
              )}

              {creatorStep === 2 && <><div className="modal-heading"><span>02 / 03</span><h2>把你的性格，慢慢告诉 {petName}</h2><p>领养从了解彼此开始。这些信息会决定萌宠的说话方式，也会成为匹配依据。</p></div><div className="form-section"><label>一句话描述自己</label><textarea defaultValue="有一点慢热，但遇到喜欢的话题会很能聊。午休喜欢喝咖啡，周末愿意出门看展。" /></div><div className="form-section"><label>萌宠性格</label><div className="choice-chips">{personalities.map((item) => <button key={item} className={personality === item ? "active" : ""} onClick={() => setPersonality(item)}>{item}</button>)}</div></div><div className="form-section"><label>兴趣标签 <small>最多选择 4 个</small></label><div className="choice-chips interests">{interestOptions.map((item) => <button key={item} className={interests.includes(item) ? "active" : ""} onClick={() => toggleInterest(item)}>{interests.includes(item) ? "✓ " : "+ "}{item}</button>)}</div></div><div className="modal-footer"><button className="text-button" onClick={() => setCreatorStep(1)}>← 上一步</button><button className="primary-button" onClick={runGeneration} disabled={generating}>{generating ? <><span className="loading-dot"/> 文心正在生成…</> : "生成我的萌宠 ✦"}</button></div></>}

              {creatorStep === 3 && <div className="result-stage" style={{ "--pet-color": selectedPet.color } as React.CSSProperties}><span className="success-badge">✦ 3D 萌宠生成完成</span><PetAvatar emoji={selectedPet.emoji} color={selectedPet.color} preset={selectedPet.id} size="xl" pulse /><h2>你好，我叫 {petName}！</h2><p>我是一个<b>{personality}</b>的{selectedPet.name}。以后我会替你记住喜好、认识同频的人，也会在你不想开口时先去碰个爪。</p><div className="result-tags">{interests.map((tag) => <span key={tag}>{tag}</span>)}</div><div className="result-actions"><button className="secondary-button" onClick={() => setCreatorStep(1)}>换一只看看</button><button className="primary-button" onClick={confirmPet}>确认领养，进入萌宠主页 →</button></div><small>领养后可从萌宠主页随时更换</small></div>}
            </div>
          </div>
        </div>
      )}

      {selectedMatch && (
        <div className="modal-layer" role="dialog" aria-modal="true" aria-label="萌宠碰爪">
          <div className="paw-modal">
            <button className="modal-close" onClick={() => setSelectedMatch(null)} aria-label="关闭">×</button>
            <div className="paw-head"><div className="paw-pair"><PetAvatar emoji={selectedPet.emoji} color={selectedPet.color} preset={selectedPet.id} size="md" /><span>🐾</span><PetAvatar emoji={selectedMatch.emoji} color={selectedMatch.color} preset={selectedMatch.preset} size="md" /></div><p>AI 萌宠碰爪中</p><h2>{petName} × {selectedMatch.pet}</h2><small>{humanJoined ? "双方主人已加入 · 真人聊天" : `自动进行 3 轮破冰 · ${pawRound}/3`}</small></div>
            <div className="paw-chat">
              {!humanJoined && <div className="ai-boundary">✦ 以下内容由文心根据双方可见标签生成，主人正在围观</div>}
              {pawRound >= 1 && <div className="pet-message left"><PetAvatar emoji={selectedPet.emoji} color={selectedPet.color} preset={selectedPet.id} size="sm" /><span><b>{petName}</b>嗨团子！我主人说今天午休想去喝咖啡，但又不想排太久的队 ☕</span></div>}
              {pawRound >= 2 && <div className="pet-message right"><span><b>{selectedMatch.pet}</b>也太巧了！我主人 12:10 下楼，而且只点燕麦拿铁。你们不会是失散的咖啡搭子吧？</span><PetAvatar emoji={selectedMatch.emoji} color={selectedMatch.color} preset={selectedMatch.preset} size="sm" /></div>}
              {pawRound >= 3 && <div className="pet-message left"><PetAvatar emoji={selectedPet.emoji} color={selectedPet.color} preset={selectedPet.id} size="sm" /><span><b>{petName}</b>暗号对上了！再问一道：加班到 12 点和早上 6 点开会，你主人选哪个？</span></div>}
              {pawRound >= 3 && !humanJoined && <div className="game-result"><span>🎮</span><p><b>默契选择一致</b><small>双方都选择“换个工作” · 萌宠互动分 +12</small></p></div>}
              {pawRound < 3 && !humanJoined && <div className="typing"><i/><i/><i/><span>{pawRound === 0 ? `${petName} 正在打招呼` : `${selectedMatch.pet} 正在接话`}</span></div>}
              {humanJoined && <><div className="unlock-banner">✓ 双方都愿意加入，真人聊天已解锁</div><div className="human-message left"><span className="human-avatar">林</span><span>嗨，我是团子的主人！刚才那句“换个工作”真的笑到了 😂</span></div><div className="human-message right"><span>哈哈哈，看来宠随主人。要不今天真的去喝一杯？</span><span className="human-avatar blue">我</span></div></>}
            </div>
            <div className="paw-footer">
              {!humanJoined ? <><button className="text-button" onClick={() => setSelectedMatch(null)}>下次再碰</button><button className="primary-button" disabled={pawRound < 3} onClick={() => setHumanJoined(true)}>{pawRound < 3 ? "先围观萌宠聊天…" : "我也加入 · 双向解锁"}</button></> : <><button className="text-button" onClick={() => { setSelectedMatch(null); setView("messages"); }}>继续聊天</button><button className="primary-button" onClick={() => { setSelectedMatch(null); setView("meet"); }}>约一杯 · 百度地图 →</button></>}
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast"><span>✓</span>{toast}</div>}
    </main>
  );
}
