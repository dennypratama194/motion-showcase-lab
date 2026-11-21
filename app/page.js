'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronDown } from 'lucide-react';
import gsap from 'gsap';

const projects = [
  { name: 'The Still House', summary: 'A sandstone museum carved by shadow.', type: 'Cultural', place: 'AlUla, Saudi Arabia', year: '2024', image: '/images/still-house.webp', alt: 'Layered sandstone museum in a desert courtyard', text: 'A low sandstone museum set into the desert, with deep recesses that offer shade as visitors move between the galleries and the courtyard.' },
  { name: 'Pine Residence', summary: 'A low concrete home at the forest edge.', type: 'Residential', place: 'Oslo, Norway', year: '2023', image: '/images/pine-residence.webp', alt: 'A dark concrete residence at the edge of a pine forest', text: 'A low concrete residence set among the pines. The broad roof shelters the living spaces while the glazed walls open them to the forest.' },
  { name: 'The Limestone Chapel', summary: 'A quiet chapel shaped by a single shaft of light.', type: 'Cultural', place: 'Puglia, Italy', year: '2022', image: '/images/limestone-chapel.webp', alt: 'A pale limestone chapel in open Mediterranean terrain', text: 'A narrow opening in the limestone wall admits a shaft of daylight that moves slowly across the chapel floor.' },
  { name: 'The Desert Court', summary: 'An open-air court sheltered by sandstone walls.', type: 'Public space', place: 'AlUla, Saudi Arabia', year: '2024', image: '/images/still-house.webp', alt: 'An open courtyard in front of the layered sandstone museum', text: 'Part of the same AlUla site as The Still House, the court creates a sheltered place to pause between the museum and the desert.' },
];

const words = ['Architecture', 'in', 'its', 'quietest', 'form.'];
const number = (index) => String(index + 1).padStart(2, '0');

export default function Home() {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);
  const [preview, setPreview] = useState(0);
  const [selected, setSelected] = useState(0);
  const panel = useRef(null);
  const toggle = useRef(null);
  const firstProject = useRef(null);
  const hero = useRef(null);
  const backdrop = useRef(null);
  const keyboardOpen = useRef(false);
  const hoverOpen = useRef(false);
  const hoverClose = useRef(null);
  const active = projects[selected];

  useLayoutEffect(() => {
    if (!shown) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (open && keyboardOpen.current) firstProject.current?.focus();
    const animation = gsap.timeline({
      onComplete: () => { if (!open) setShown(false); },
    });
    animation.to(panel.current, {
      opacity: open ? 1 : 0,
      y: open ? 0 : -6,
      duration: reduced ? 0 : open ? 0.22 : 0.16,
      ease: open ? 'power3.out' : 'power2.in',
    }, 0).to(backdrop.current, {
      opacity: open ? 1 : 0,
      duration: reduced ? 0 : 0.16,
      ease: 'power2.out',
    }, 0);
    if (reduced) animation.progress(1);
    return () => animation.kill();
  }, [open, shown]);

  useEffect(() => () => clearTimeout(hoverClose.current), []);

  useEffect(() => {
    if (!open) return;
    function closeOnEscape(event) {
      if (event.key === 'Escape') {
        setOpen(false);
        toggle.current?.focus();
      }
    }
    function closeOutside(event) {
      if (!panel.current?.contains(event.target) && !toggle.current?.contains(event.target)) {
        if (event.target === backdrop.current && panel.current?.contains(document.activeElement)) toggle.current?.focus();
        setOpen(false);
      }
    }
    window.addEventListener('keydown', closeOnEscape);
    window.addEventListener('pointerdown', closeOutside);
    return () => {
      window.removeEventListener('keydown', closeOnEscape);
      window.removeEventListener('pointerdown', closeOutside);
    };
  }, [open]);

  function showProjects(keyboard = false) {
    keyboardOpen.current = keyboard;
    setPreview(selected);
    setShown(true);
    setOpen(true);
  }

  function enterTrigger(event) {
    if (event.pointerType !== 'mouse') return;
    clearTimeout(hoverClose.current);
    if (open) return;
    hoverOpen.current = true;
    showProjects();
  }

  function leaveMenu(event) {
    if (event.pointerType !== 'mouse' || !hoverOpen.current) return;
    clearTimeout(hoverClose.current);
    // Allow diagonal travel from the centered trigger into the panel.
    hoverClose.current = setTimeout(() => {
      if (!panel.current?.contains(document.activeElement)) setOpen(false);
    }, 130);
  }

  function toggleProjects(event) {
    clearTimeout(hoverClose.current);
    hoverOpen.current = false;
    if (open) {
      if (event.detail === 0 && !keyboardOpen.current) {
        keyboardOpen.current = true;
        firstProject.current?.focus();
      } else {
        setOpen(false);
      }
    } else {
      showProjects(event.detail === 0);
    }
  }

  function selectProject(index) {
    clearTimeout(hoverClose.current);
    setSelected(index);
    setOpen(false);
    hero.current?.focus({ preventScroll: true });
  }

  return (
    <div>
      <header className="site-header">
        <div className="frame header-inner">
          <a className="brand" href="#" aria-label="Atelier home" onClick={() => { setOpen(false); setSelected(0); }}>ATELIER<sup>®</sup></a>
          <nav className="header-menu" aria-label="Main navigation">
            <button className="index-button" ref={toggle} aria-expanded={open} aria-controls="project-index" onPointerEnter={enterTrigger} onPointerLeave={leaveMenu} onClick={toggleProjects}>
              <span>Projects</span>
              <ChevronDown size={14} aria-hidden="true" />
            </button>
            <a href="#studio" onClick={() => setOpen(false)}>Studio</a>
          </nav>
          <a className="header-cta" href="#project-detail" onClick={() => setOpen(false)}><span>View project</span><ArrowUpRight size={15} aria-hidden="true" /></a>
        </div>
        <div className="menu-backdrop" ref={backdrop} hidden={!shown} aria-hidden="true" />
        <nav id="project-index" ref={panel} aria-label="Project index" className="frame project-index" hidden={!shown} inert={!open} onPointerEnter={() => clearTimeout(hoverClose.current)} onPointerLeave={leaveMenu}>
          <div className="index-grid">
            <div className="index-list">
              {projects.map((project, i) => (
                <button key={project.name} ref={i === 0 ? firstProject : undefined} className="project-option" data-active={preview === i} onPointerEnter={(event) => { if (event.pointerType !== 'touch') setPreview(i); }} onFocus={() => setPreview(i)} onClick={() => selectProject(i)}>
                  <span className="project-option-name">{project.name}</span>
                  <span className="project-option-summary">{project.summary}</span>
                </button>
              ))}
            </div>
            <figure className="index-preview">
              <div className="preview-crop">
                {projects.map((project, i) => (
                  <img key={project.name} src={project.image.replace('.webp', '-preview.webp')} fetchPriority="low" decoding="async" alt={project.alt} aria-hidden={preview !== i} data-active={preview === i} />
                ))}
              </div>
              <figcaption className="micro flex justify-between gap-4"><span>{projects[preview].place}</span><span>{projects[preview].type} · {projects[preview].year}</span></figcaption>
            </figure>
          </div>
        </nav>
      </header>

      <main>
        <section id="work" ref={hero} tabIndex={-1} aria-label="Featured project">
          <div className="hero-mask">
            <img className="hero-image" src={active.image} alt={active.alt} fetchPriority="high" />
          </div>
          <div className="frame hero-heading">
            <p className="eyebrow micro intro-detail"><span className="marker" /> Selected Works</p>
            <h1 aria-label="Architecture in its quietest form.">
              <span className="headline-line" aria-hidden="true">{words.slice(0, 2).map((word) => <span className="word-mask" key={word}><span className="hero-word">{word}</span></span>)}</span>
              <span className="headline-line" aria-hidden="true">{words.slice(2).map((word) => <span className="word-mask" key={word}><span className={`hero-word ${word === 'quietest' ? 'italic-word' : ''}`}>{word}</span></span>)}</span>
            </h1>
          </div>

          <div className="frame hero-caption">
            <div className="caption-project" aria-live="polite"><span className="micro caption-index">/ {number(selected)}</span><a href="#project-detail">{active.name}</a></div>
            <div className="caption-location micro">{active.place} <span>—</span> {active.year}</div>
            <div className="caption-arrows">
              <button aria-label="Previous project" onClick={() => setSelected((selected + projects.length - 1) % projects.length)}><ArrowLeft size={17} /></button>
              <button aria-label="Next project" onClick={() => setSelected((selected + 1) % projects.length)}><ArrowRight size={17} /></button>
            </div>
          </div>
        </section>

        <section id="project-detail" tabIndex={-1} className="frame detail-section">
          <p className="micro"><span className="marker" /> {active.type} / {active.year}</p>
          <div><h2>{active.name}</h2><p>{active.text}</p></div>
        </section>
        <section id="studio" tabIndex={-1} className="frame detail-section">
          <p className="micro"><span className="marker" /> The Studio</p>
          <div><h2>ATELIER®</h2><p>We design buildings around the ways people experience light, material, and landscape.</p></div>
        </section>
      </main>
      <footer className="frame site-footer micro"><span>ATELIER® Architecture Practice</span><a href="#">Back to top ↑</a></footer>
    </div>
  );
}
