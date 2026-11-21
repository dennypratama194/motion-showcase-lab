'use client';

import { useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, ChevronDown } from 'lucide-react';

const classes = [
  { name: 'Reformer', level: 'All levels', format: 'Small group', duration: '50 min', summary: 'Spring-assisted movement for balanced strength and control.', detail: 'The reformer’s springs offer both support and resistance. Classes progress at a steady pace, with time to adjust the equipment and find a version of each exercise that suits you.' },
  { name: 'Mat Pilates', level: 'All levels', format: 'Small group', duration: '45 min', summary: 'A grounded practice built around breath, alignment, and flow.', detail: 'With a mat and a few small props, we work through a sequence of slow, deliberate movements. The instructor offers variations throughout the class.' },
  { name: 'Private Sessions', level: 'Tailored to you', format: 'One to one', duration: '55 min', summary: 'A personal session shaped around your pace and goals.', detail: 'You and your instructor decide where to focus, whether that’s learning the fundamentals or spending more time with a particular movement. Sessions can include both mat and reformer work.' },
];

const questions = [
  ['Do I need Pilates experience?', 'No. Reformer and Mat Pilates welcome beginners. Let your instructor know it’s your first class so they can introduce the equipment and offer variations.'],
  ['What should I bring?', 'Wear comfortable clothing you can move in and bring water. Grip socks are helpful for reformer classes. Mats and small props are provided.'],
  ['Which class should I choose?', 'Choose Mat Pilates if you’d like to begin with floor-based exercises, Reformer if you’re curious about spring resistance, or a Private Session for one-to-one guidance.'],
];

export default function Home() {
  const [selected, setSelected] = useState(0);
  const tabList = useRef(null);
  const active = classes[selected];

  function moveTab(event, index) {
    const next = {
      ArrowRight: (index + 1) % classes.length,
      ArrowLeft: (index + classes.length - 1) % classes.length,
      Home: 0,
      End: classes.length - 1,
    }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    tabList.current.querySelectorAll('button')[next].focus();
    setSelected(next);
  }

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="masthead" id="top">
        <div className="shell header-inner">
          <a className="wordmark" href="#top" aria-label="Serein home">Serein<span>.</span></a>
          <nav aria-label="Main navigation">
            <a href="#method">The method</a>
            <a href="#classes">Classes</a>
            <a href="#studio">Studio</a>
          </nav>
          <a className="header-action" href="#classes">Find a class <ArrowUpRight size={14} aria-hidden="true" /></a>
        </div>
      </header>

      <main id="main">
        <section className="hero" id="method" aria-labelledby="hero-title">
          <div className="hero-content">
            <p className="eyebrow hero-reveal"><span /> The Pilates Studio</p>
            <h1 className="hero-reveal" id="hero-title">Move with<br /><em>intention.</em></h1>
            <p className="hero-intro hero-reveal">Reformer, mat, and private Pilates in a studio designed for unhurried movement.</p>
            <a className="primary-action hero-reveal" href="#classes">Explore the classes <ArrowUpRight size={16} aria-hidden="true" /></a>
          </div>
          <div className="hero-visual">
            <img src="/serein/hero.webp" alt="A woman stretching on a reformer in a sunlit Pilates studio" fetchPriority="high" />
          </div>
        </section>

        <div className="shell hero-foot">
          <p>Reformer <span /> Mat <span /> Private</p>
          <a href="#classes">Discover the practice <ArrowDown size={14} aria-hidden="true" /></a>
        </div>

        <section className="shell classes" id="classes" aria-labelledby="classes-title">
          <div className="section-heading">
            <p className="eyebrow">The practice</p>
            <h2 id="classes-title">Find your <em>rhythm.</em></h2>
          </div>
          <div className="class-tabs" role="tablist" aria-label="Pilates classes" ref={tabList}>
            {classes.map((service, index) => (
              <button type="button" role="tab" key={service.name} id={`class-tab-${index}`} aria-selected={selected === index} aria-controls="class-detail" tabIndex={selected === index ? 0 : -1} onClick={() => setSelected(index)} onKeyDown={(event) => moveTab(event, index)}>
                <span>{service.name}</span>
                <ArrowUpRight size={17} aria-hidden="true" />
                <span className="tab-summary">{service.summary}</span>
              </button>
            ))}
          </div>
          <div id="class-detail" role="tabpanel" aria-labelledby={`class-tab-${selected}`} tabIndex={0} className="class-detail">
            <div className="class-facts"><span>{active.format}</span><span>{active.duration}</span><span>{active.level}</span></div>
            <p>{active.detail}</p>
            <a href="#visit">Plan your first visit <ArrowUpRight size={14} aria-hidden="true" /></a>
          </div>
        </section>

        <section className="studio" id="studio" aria-labelledby="studio-title">
          <div className="studio-visual"><img src="/serein/studio.webp" alt="Oak reformers lined up beneath the arches of the studio" loading="lazy" /></div>
          <div className="studio-content">
            <p className="eyebrow">Inside Serein</p>
            <h2 id="studio-title">Room to<br /><em>slow down.</em></h2>
            <p>Our small classes give instructors time to offer individual guidance. You’ll have room to learn the equipment, ask questions, and move at a pace that works for you.</p>
            <a href="#visit">Your first visit <ArrowUpRight size={15} aria-hidden="true" /></a>
          </div>
        </section>

        <section className="shell visit" id="visit" aria-labelledby="visit-title">
          <div className="section-heading"><p className="eyebrow">Before class</p><h2 id="visit-title">Your first <em>visit.</em></h2></div>
          <div className="questions">
            {questions.map(([question, answer]) => (
              <details key={question}>
                <summary>{question}<ChevronDown size={16} aria-hidden="true" /></summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="shell"><a className="wordmark" href="#top" aria-label="Back to top">Serein<span>.</span></a><p>The Pilates Studio</p><a href="#classes">Explore classes <ArrowUpRight size={14} aria-hidden="true" /></a></div>
      </footer>
    </>
  );
}
