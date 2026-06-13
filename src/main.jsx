import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowUpRight,
  BadgeCheck,
  BriefcaseBusiness,
  ChevronDown,
  Mail,
  PenTool,
  Phone,
  Sparkles,
  Target,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BorderGlow from './BorderGlow';
import Grainient from './Grainient';
import heroBackground from './assets/hero-background.mp4';
import pinWork01 from './assets/pinterest/pin-231794-01.jpg';
import pinWork02 from './assets/pinterest/pin-691634-02.jpg';
import pinWork03 from './assets/pinterest/pin-438680-03.jpg';
import './styles.css';

gsap.registerPlugin(ScrollTrigger);

const profile = {
  name: '李梓轩',
  role: 'Visual Designer',
  headline: '以品牌秩序与商业审美，构建可落地的视觉系统。',
  intro:
    '拥有 3 年专业视觉设计经验，覆盖品牌 VI、平面宣传、电商视觉、新媒体视觉与包装设计。擅长将品牌调性、用户审美与市场需求转译为稳定、高质感、可执行的视觉方案。',
  phone: '138XXXX6789',
  email: 'zixuan_design@163.com',
  location: 'Visual Communication / Brand / Campaign',
};

const navItems = [
  ['经历', '#about'],
  ['项目', '#projects'],
  ['优势', '#strengths'],
  ['联系', '#contact'],
];

const stats = [
  ['3+', '年全职经验'],
  ['500+', '年均落地作品'],
  ['95%+', '客户满意度'],
  ['20%+', '活动点击提升'],
];

const projects = [
  {
    title: '品牌 VI 视觉升级',
    meta: '2023.04 - 2023.06 / 视觉主设计师',
    desc: '完成品牌色彩体系、字体规范、LOGO 延展、图标系统与全渠道视觉规范，推动品牌形象年轻化与标准化。',
    image: pinWork01,
    crop: 'left center',
  },
  {
    title: '全年节日营销视觉全案',
    meta: '2022.08 - 至今 / 视觉设计师',
    desc: '围绕电商大促、节日节点与品牌专场，输出活动首页、海报、详情页、引流配图与短视频封面。',
    image: pinWork02,
    crop: 'center center',
  },
  {
    title: '电商店铺视觉优化',
    meta: '首页改版 / 详情页 / 主图精修',
    desc: '优化页面视觉层级与浏览路径，提升商品呈现质感，并为运营活动提供稳定视觉支撑。',
    image: pinWork03,
    crop: 'right center',
  },
];

const strengths = [
  ['商业设计思维', '不止于审美表达，更关注营销目标、平台规范与最终落地效果。', Target],
  ['品牌视觉系统', '熟悉 VI 规范、品牌延展、视觉资产沉淀与多渠道一致性管理。', BadgeCheck],
  ['高效协作交付', '可独立完成需求拆解、方案构思、修改优化与跨部门沟通。', BriefcaseBusiness],
  ['趋势与风格迭代', '持续跟进设计趋势，能适配互联网、电商、文创与品牌营销场景。', Sparkles],
];

const aboutGlowProps = {
  edgeSensitivity: 30,
  glowColor: '40 80 80',
  backgroundColor: '#120F17',
  borderRadius: 34,
  glowRadius: 40,
  glowIntensity: 1,
  coneSpread: 25,
  animated: false,
  colors: ['#c084fc', '#ff2d1f', '#38bdf8'],
};

function AnimatedStat({ value }) {
  const ref = useRef(null);
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const match = value.match(/^(\d+)(.*)$/);
    if (!match) return undefined;

    const target = Number(match[1]);
    const suffix = match[2] || '';
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frameId = 0;
    let hasAnimated = false;

    const runAnimation = () => {
      if (hasAnimated) return;
      hasAnimated = true;

      if (prefersReducedMotion) {
        setDisplayValue(value);
        return;
      }

      const startTime = performance.now();
      const duration = 1200;

      const tick = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayValue(`${Math.round(target * eased)}${suffix}`);

        if (progress < 1) {
          frameId = requestAnimationFrame(tick);
        }
      };

      frameId = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          runAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.45 },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [value]);

  return <strong ref={ref}>{displayValue}</strong>;
}

function HeroVideo() {
  return (
    <div className="hero-media" aria-hidden="true">
      <video className="hero-video" src={heroBackground} autoPlay muted loop playsInline preload="metadata" />
      <div className="hero-fallback" />
      <div className="grain" />
    </div>
  );
}

function App() {
  const [isNavFloating, setIsNavFloating] = useState(false);
  const [hasPostHeroBgStarted, setHasPostHeroBgStarted] = useState(false);
  const navFloatingRef = useRef(false);
  const postHeroBgRef = useRef(false);

  useEffect(() => {
    let frameId = 0;

    const updateNavState = () => {
      const next = window.scrollY > 8;
      if (next !== navFloatingRef.current) {
        navFloatingRef.current = next;
        setIsNavFloating(next);
      }

      if (!postHeroBgRef.current && window.scrollY > window.innerHeight * 0.45) {
        postHeroBgRef.current = true;
        setHasPostHeroBgStarted(true);
      }
    };

    const requestUpdate = () => {
      if (frameId) return;
      frameId = requestAnimationFrame(() => {
        frameId = 0;
        updateNavState();
      });
    };

    updateNavState();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (reduceMotion) {
        gsap.set('.hero .nav, .hero-label-row, .hero h1, .hero-bottom > *, .hero-actions, .reveal-item', {
          clearProps: 'all',
          autoAlpha: 1,
        });
        return;
      }

      gsap.set('.nav', { xPercent: -50, y: -28, autoAlpha: 0 });
      gsap.set('.hero-label-row span', { y: -24, autoAlpha: 0 });
      gsap.set('.hero h1', {
        autoAlpha: 0,
        yPercent: 34,
        scaleX: 0.78,
        clipPath: 'inset(0 100% 0 0)',
        transformOrigin: 'left center',
      });
      gsap.set('.hero-bottom > *, .hero-actions', { y: 58, autoAlpha: 0 });
      gsap.set('.hero-video', { scale: 1.08, filter: 'brightness(0.76) contrast(1.18)' });

      const heroTl = gsap.timeline({ defaults: { ease: 'power4.out' } });
      heroTl
        .to('.hero-video', { scale: 1, filter: 'brightness(1) contrast(1)', duration: 2.2, ease: 'power2.out' }, 0)
        .to('.nav', { xPercent: -50, y: 0, autoAlpha: 1, duration: 0.95 }, 0.08)
        .to('.hero-label-row span', { y: 0, autoAlpha: 1, duration: 0.85, stagger: 0.08 }, 0.28)
        .to(
          '.hero h1',
          {
            autoAlpha: 1,
            yPercent: 0,
            scaleX: 1.07,
            clipPath: 'inset(0 0% 0 0)',
            duration: 1.35,
          },
          0.45,
        )
        .to('.hero-bottom > *', { y: 0, autoAlpha: 1, duration: 1.05, stagger: 0.13 }, 0.95)
        .to('.hero-actions', { y: 0, autoAlpha: 1, duration: 0.95 }, 1.16);

      gsap.utils.toArray('.reveal-section').forEach((section) => {
        const title = section.querySelector('.module-title');
        const items = [...section.querySelectorAll('.reveal-item')].filter((item) => item !== title);
        const projectImages = section.querySelectorAll('.project-image img');

        gsap.set(title, {
          y: 96,
          autoAlpha: 0,
          scaleX: 0.9,
          clipPath: 'inset(0 0 100% 0)',
          transformOrigin: 'left center',
        });
        gsap.set(items, { y: 86, autoAlpha: 0, scale: 0.96 });
        gsap.set(projectImages, { scale: 1.16, autoAlpha: 0.72 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 74%',
            once: true,
          },
          defaults: { ease: 'power4.out' },
        });

        tl.to(title, {
          y: 0,
          autoAlpha: 1,
          scaleX: 1,
          clipPath: 'inset(0 0 0% 0)',
          duration: 1.05,
        }).to(
          items,
          {
            y: 0,
            autoAlpha: 1,
            scale: 1,
            duration: 1.05,
            stagger: 0.13,
          },
          0.22,
        );

        if (projectImages.length) {
          tl.to(
            projectImages,
            {
              scale: 1.02,
              autoAlpha: 1,
              duration: 1.3,
              stagger: 0.12,
              ease: 'power3.out',
            },
            0.34,
          );
        }
      });

      gsap.utils.toArray('.project-card').forEach((card) => {
        const image = card.querySelector('img');
        if (!image) return;

        gsap.to(image, {
          yPercent: -6,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.7,
          },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <main>
      <nav className={`nav shell${isNavFloating ? ' is-floating' : ''}`}>
        <a className="brand" href="#top">
          <span>Z</span>
          <small>Li Zixuan</small>
        </a>
        <div className="nav-links">
          {navItems.map(([label, href]) => (
            <a key={label} href={href}>
              [{label}]
            </a>
          ))}
        </div>
        <a className="nav-cta" href={`mailto:${profile.email}`}>
          <Mail size={17} />
          联系我
        </a>
      </nav>
      <section className="hero" id="top">
        <HeroVideo />
        <div className="hero-content shell">
          <div className="hero-label-row">
            <span>[Portfolio]</span>
            <span>[Visual Designer]</span>
            <span>[2026]</span>
          </div>
          <h1>LIZIXUAN</h1>
          <div className="hero-bottom">
            <div className="hero-metric">
              <strong>500+</strong>
              <span>Visual systems & commercial assets delivered yearly</span>
            </div>
            <p>{profile.headline}</p>
            <div className="hero-statement">
              <span>DESIGN</span> IS NOT
              <br />
              DECORATION
            </div>
          </div>
          <div className="hero-actions">
            <a className="primary-btn" href="#projects">
              开始查看
              <ArrowUpRight size={19} />
            </a>
            <a className="ghost-btn" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
          </div>
        </div>
        <a className="scroll-cue" href="#about" aria-label="滚动到个人经历">
          <ChevronDown size={28} />
        </a>
      </section>

      {hasPostHeroBgStarted && (
        <div className="post-hero-bg" aria-hidden="true">
          <Grainient
            color1="#7f140f"
            color2="#12464a"
            color3="#020304"
            timeSpeed={0.32}
            colorBalance={0.34}
            warpStrength={0.72}
            warpFrequency={4.2}
            warpSpeed={0.72}
            warpAmplitude={62}
            blendAngle={-16}
            blendSoftness={0.16}
            rotationAmount={220}
            noiseScale={1.35}
            grainAmount={0.065}
            grainScale={2.4}
            grainAnimated={false}
            contrast={1.28}
            gamma={1.08}
            saturation={0.72}
            centerX={-0.18}
            centerY={0.02}
            zoom={0.82}
            fps={30}
          />
        </div>
      )}

      <section className="about section shell reveal-section" id="about">
        <div className="module-title reveal-item">
          <div className="module-title-en">Profile</div>
          <div className="module-title-cn">个人经历</div>
        </div>
        <div className="about-grid">
          <BorderGlow className="portrait-panel about-glow-card reveal-item" style={{ '--reveal-delay': '160ms' }} {...aboutGlowProps}>
            <div className="portrait">
              <div className="portrait-mark">
                <PenTool size={46} />
                <span>{profile.name}</span>
              </div>
            </div>
          </BorderGlow>
          <BorderGlow className="about-copy about-glow-card reveal-item" style={{ '--reveal-delay': '280ms' }} {...aboutGlowProps}>
            <h2>视觉设计师，擅长把需求整理成清晰、可执行的视觉结果。</h2>
            <p>{profile.intro}</p>
            <div className="contact-lines">
              <a href={`tel:${profile.phone}`}>
                <Phone size={18} />
                {profile.phone}
              </a>
              <a href={`mailto:${profile.email}`}>
                <Mail size={18} />
                {profile.email}
              </a>
            </div>
          </BorderGlow>
          <div className="stats-grid">
            {stats.map(([value, label], index) => (
              <BorderGlow
                className="stat about-glow-card reveal-item"
                key={label}
                style={{ '--reveal-delay': `${380 + index * 110}ms` }}
                {...aboutGlowProps}
              >
                <AnimatedStat value={value} />
                <span>{label}</span>
              </BorderGlow>
            ))}
          </div>
        </div>
      </section>

      <section className="projects section shell reveal-section" id="projects">
        <div className="section-head">
          <div>
            <div className="module-title reveal-item">
              <div className="module-title-en">Selected Work</div>
              <div className="module-title-cn">精选项目</div>
            </div>
          </div>
          <p className="reveal-item" style={{ '--reveal-delay': '120ms' }}>
            先以高级占位图建立展示节奏，后续可替换为品牌 VI、商业海报、电商详情页、包装设计等真实作品。
          </p>
        </div>
        <div className="project-list">
          {projects.map((project, index) => (
            <article className="project-card reveal-item" key={project.title} style={{ '--reveal-delay': `${220 + index * 140}ms` }}>
              <div className="project-image">
                <img src={project.image} alt={project.title} style={{ objectPosition: project.crop }} />
              </div>
              <div className="project-info">
                <span>0{index + 1}</span>
                <h3>{project.title}</h3>
                <p className="meta">{project.meta}</p>
                <p>{project.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="strengths section shell reveal-section" id="strengths">
        <div className="section-head compact">
          <div>
            <div className="module-title reveal-item">
              <div className="module-title-en">Capabilities</div>
              <div className="module-title-cn">个人优势</div>
            </div>
          </div>
        </div>
        <div className="strength-grid">
          {strengths.map(([title, desc, Icon], index) => (
            <article className="strength-card reveal-item" key={title} style={{ '--reveal-delay': `${180 + index * 110}ms` }}>
              <Icon size={28} />
              <h3>{title}</h3>
              <p>{desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="contact-end reveal-section" id="contact">
        <div className="contact-inner shell">
          <div className="module-title reveal-item">
            <div className="module-title-en">Contact</div>
            <div className="module-title-cn">联系方式</div>
          </div>
          <h2 className="reveal-item" style={{ '--reveal-delay': '160ms' }}>
            期待与品牌、产品和市场团队一起，把视觉做得更有辨识度。
          </h2>
          <div className="contact-actions reveal-item" style={{ '--reveal-delay': '300ms' }}>
            <a className="primary-btn" href={`mailto:${profile.email}`}>
              <Mail size={19} />
              发送邮件
            </a>
            <a className="ghost-btn" href={`tel:${profile.phone}`}>
              <Phone size={18} />
              {profile.phone}
            </a>
          </div>
          <div className="footer-line reveal-item" style={{ '--reveal-delay': '420ms' }}>
            <span>{profile.name} / {profile.role}</span>
            <span>{profile.location}</span>
          </div>
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
