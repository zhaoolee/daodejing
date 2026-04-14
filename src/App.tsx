import { useEffect, useMemo, useState } from 'react'
import logo from './assets/header/logo-yinyang.jpg'
import chapters from './data/chapters.json'

type Chapter = {
  id: number
  chapter: string
  title: string
  original: string
  translation: string
  english: string
  sourceUrl: string
}

const chapterList = chapters as Chapter[]
const defaultChapterId = 1
const minFontSize = 19
const maxFontSize = 25
const defaultFontSize = 21

function getChapterIdFromHash() {
  const matched = window.location.hash.match(/chapter-(\d+)/)
  if (!matched) return defaultChapterId

  const id = Number(matched[1])
  return Number.isInteger(id) && id >= 1 && id <= chapterList.length
    ? id
    : defaultChapterId
}

function splitParagraphs(text: string) {
  return text
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function App() {
  const [activeChapterId, setActiveChapterId] = useState(defaultChapterId)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false)
  const [fontSize, setFontSize] = useState(defaultFontSize)
  const [locale, setLocale] = useState<'zh' | 'en'>('zh')

  useEffect(() => {
    const storedFontSize = window.localStorage.getItem('daodejing-font-size')
    const parsed = storedFontSize ? Number(storedFontSize) : Number.NaN
    const storedLocale = window.localStorage.getItem('daodejing-locale')

    if (storedLocale === 'zh' || storedLocale === 'en') {
      setLocale(storedLocale)
    }

    if (!Number.isNaN(parsed)) {
      setFontSize(Math.min(maxFontSize, Math.max(minFontSize, parsed)))
    }

    const syncFromHash = () => {
      setActiveChapterId(getChapterIdFromHash())
      setDrawerOpen(false)
      setMobileToolsOpen(false)
    }

    syncFromHash()
    window.addEventListener('hashchange', syncFromHash)

    return () => window.removeEventListener('hashchange', syncFromHash)
  }, [])

  useEffect(() => {
    window.localStorage.setItem('daodejing-font-size', String(fontSize))
  }, [fontSize])

  useEffect(() => {
    window.localStorage.setItem('daodejing-locale', locale)
  }, [locale])

  const activeChapter = useMemo(
    () => chapterList.find((chapter) => chapter.id === activeChapterId) ?? chapterList[0],
    [activeChapterId],
  )

  const currentIndex = chapterList.findIndex((chapter) => chapter.id === activeChapter.id)
  const previousChapter = currentIndex > 0 ? chapterList[currentIndex - 1] : null
  const nextChapter = currentIndex < chapterList.length - 1 ? chapterList[currentIndex + 1] : null
  const chapterDisplayName = locale === 'zh' ? activeChapter.chapter : `Chapter ${activeChapter.id}`
  const originalLabel = locale === 'zh' ? '原文' : 'Original'
  const translationLabel = locale === 'zh' ? '译文' : 'English'
  const previousLabel = previousChapter
    ? locale === 'zh'
      ? `上一章 · ${previousChapter.chapter}`
      : `Previous · Chapter ${previousChapter.id}`
    : locale === 'zh'
      ? '已是第一章'
      : 'First Chapter'
  const nextLabel = nextChapter
    ? locale === 'zh'
      ? `下一章 · ${nextChapter.chapter}`
      : `Next · Chapter ${nextChapter.id}`
    : locale === 'zh'
      ? '已是最后一章'
      : 'Last Chapter'
  const sourceLabel =
    locale === 'zh' ? '内容整理来源：daodejing.org' : 'English translation: Stephen Mitchell'
  const sourceLinkLabel = locale === 'zh' ? '查看当前章节来源页面' : 'View English source'
  const sourceHref = locale === 'zh' ? activeChapter.sourceUrl : 'https://wamoyo.github.io/tao-te-ching/'

  const goToChapter = (chapterId: number) => {
    setMobileToolsOpen(false)
    window.location.hash = `chapter-${chapterId}`
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const increaseFontSize = () => setFontSize((current) => Math.min(maxFontSize, current + 1))
  const decreaseFontSize = () => setFontSize((current) => Math.max(minFontSize, current - 1))

  return (
    <div className="app-layout">
      <header className="app-topbar">
        <div className="app-topbar-inner">
          <div className="app-topbar-main">
            <div className="app-topbar-side app-topbar-side--left">
              <button
                type="button"
                className="chrome-button chrome-button--menu"
                onClick={() => {
                  setDrawerOpen(true)
                  setMobileToolsOpen(false)
                }}
              >
                {locale === 'zh' ? '目录' : 'Menu'}
              </button>
            </div>

            <div className="app-brand">
              <div className="app-brand-mark" aria-hidden="true">
                <img src={logo} alt="" />
              </div>
              <div className="app-brand-copy">
                <span className="app-brand-title">{locale === 'zh' ? '道德经' : 'Tao Te Ching'}</span>
              </div>
            </div>

            <div className="app-topbar-side app-topbar-side--right">
              <button
                type="button"
                className={`chrome-button chrome-button--more ${mobileToolsOpen ? 'chrome-button--active' : ''}`}
                onClick={() => setMobileToolsOpen((open) => !open)}
                aria-expanded={mobileToolsOpen}
              >
                {locale === 'zh' ? '更多' : 'More'}
              </button>
            </div>
          </div>

          <div className="app-topbar-actions">
            <div className="locale-toggle" aria-label="language switcher">
              <button
                type="button"
                className={`locale-toggle__button ${locale === 'zh' ? 'locale-toggle__button--active' : ''}`}
                onClick={() => setLocale('zh')}
              >
                中文
              </button>
              <button
                type="button"
                className={`locale-toggle__button ${locale === 'en' ? 'locale-toggle__button--active' : ''}`}
                onClick={() => setLocale('en')}
              >
                English
              </button>
            </div>
            <div className="font-controls font-controls--desktop">
              <button type="button" className="chrome-button" onClick={decreaseFontSize}>
                A-
              </button>
              <span>{fontSize}px</span>
              <button type="button" className="chrome-button" onClick={increaseFontSize}>
                A+
              </button>
            </div>
          </div>
        </div>

        <div className={`mobile-tools ${mobileToolsOpen ? 'mobile-tools--open' : ''}`}>
          <div className="mobile-tools__section">
            <span className="mobile-tools__label">{locale === 'zh' ? '字号' : 'Text Size'}</span>
            <div className="font-controls font-controls--mobile">
              <button type="button" className="chrome-button" onClick={decreaseFontSize}>
                A-
              </button>
              <span>{fontSize}px</span>
              <button type="button" className="chrome-button" onClick={increaseFontSize}>
                A+
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="app-shell">
        <aside className={`sidebar ${drawerOpen ? 'sidebar--open' : ''}`}>
          <nav className="chapter-nav" aria-label="道德经章节导航">
            {chapterList.map((chapter) => (
              <button
                key={chapter.id}
                className={`chapter-link ${chapter.id === activeChapter.id ? 'chapter-link--active' : ''}`}
                onClick={() => goToChapter(chapter.id)}
                type="button"
              >
                <span className="chapter-link__name">
                  {locale === 'zh' ? chapter.chapter : `Chapter ${chapter.id}`}
                </span>
              </button>
            ))}
          </nav>
        </aside>

        <div
          className={`backdrop ${drawerOpen ? 'backdrop--visible' : ''}`}
          onClick={() => setDrawerOpen(false)}
          aria-hidden={!drawerOpen}
        />

        <main className="reading-stage" style={{ ['--reader-font-size' as string]: `${fontSize}px` }}>
          <div className="note-sheet">
            <div className="sheet-frame sheet-frame-outer" />
            <div className="sheet-frame sheet-frame-inner" />
            <span className="sheet-corner sheet-corner-top-left" />
            <span className="sheet-corner sheet-corner-top-right" />
            <span className="sheet-corner sheet-corner-bottom-left" />
            <span className="sheet-corner sheet-corner-bottom-right" />

            <div className="sheet-inner">
              <section className="hero-note">
                <h2>{chapterDisplayName}</h2>
              </section>

              <article className="note-section">
                <header className="note-index">{originalLabel}</header>
                <div className="note-copy note-copy--original">
                  {splitParagraphs(activeChapter.original).map((paragraph, index) => (
                    <p key={`${activeChapter.id}-original-${index}`}>{paragraph}</p>
                  ))}
                </div>
              </article>

              <article className="note-section">
                <header className="note-index">{translationLabel}</header>
                <div className="note-copy note-copy--translation">
                  {splitParagraphs(locale === 'zh' ? activeChapter.translation : activeChapter.english).map(
                    (paragraph, index) => (
                      <p key={`${activeChapter.id}-translation-${index}`}>{paragraph}</p>
                    ),
                  )}
                </div>
              </article>

              <section className="chapter-pager">
                <button
                  type="button"
                  className="pager-button"
                  onClick={() => previousChapter && goToChapter(previousChapter.id)}
                  disabled={!previousChapter}
                >
                  {previousLabel}
                </button>
                <button
                  type="button"
                  className="pager-button"
                  onClick={() => nextChapter && goToChapter(nextChapter.id)}
                  disabled={!nextChapter}
                >
                  {nextLabel}
                </button>
              </section>
            </div>

            <footer className="sheet-footer">
              <span className="sheet-footer-icon" aria-hidden="true">
                <svg viewBox="0 0 32 32" role="img" focusable="false">
                  <circle cx="16" cy="16" r="16" />
                  <text x="50%" y="50%">
                    道
                  </text>
                </svg>
              </span>
              <span className="sheet-footer-copy">
                <span className="sheet-footer-brand">{sourceLabel}</span>
                <a href={sourceHref} target="_blank" rel="noreferrer" className="sheet-footer-via">
                  {sourceLinkLabel}
                </a>
              </span>
            </footer>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
