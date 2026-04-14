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
const githubRepoUrl = 'https://github.com/zhaoolee/daodejing'

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

function stripAnnotationMarkers(text: string) {
  return text
    .replace(/[①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳⑴⑵⑶⑷⑸⑹⑺⑻⑼⑽⑾⑿⒀⒁⒂⒃⒄⒅⒆⒇]/g, '')
    .replace(/\[\d+\]/g, '')
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
  const sourceLabel = locale === 'zh' ? '内容整理来源：daodejing.org' : 'Source: Tao Te Ching English rendering'

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
                  {splitParagraphs(stripAnnotationMarkers(activeChapter.original)).map((paragraph, index) => (
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
              <a
                href={githubRepoUrl}
                target="_blank"
                rel="noreferrer"
                className="sheet-footer-icon-link"
                aria-label="在 GitHub 查看开源仓库"
                title="GitHub 开源地址"
              >
                <svg viewBox="0 0 24 24" role="img" focusable="false" aria-hidden="true">
                  <path d="M12 .5C5.65.5.5 5.66.5 12.02c0 5.08 3.29 9.39 7.86 10.9.58.11.79-.25.79-.56 0-.28-.01-1.19-.02-2.16-3.2.7-3.88-1.36-3.88-1.36-.52-1.34-1.28-1.69-1.28-1.69-1.05-.72.08-.71.08-.71 1.16.08 1.78 1.2 1.78 1.2 1.03 1.78 2.71 1.27 3.37.97.1-.75.4-1.27.72-1.56-2.55-.29-5.23-1.29-5.23-5.72 0-1.26.45-2.3 1.18-3.11-.12-.29-.51-1.47.11-3.06 0 0 .97-.31 3.16 1.19a10.9 10.9 0 0 1 5.76 0c2.19-1.5 3.16-1.19 3.16-1.19.62 1.59.23 2.77.11 3.06.73.81 1.18 1.85 1.18 3.11 0 4.44-2.69 5.42-5.25 5.71.41.35.77 1.04.77 2.1 0 1.52-.01 2.75-.01 3.13 0 .31.21.68.8.56a11.52 11.52 0 0 0 7.85-10.9C23.5 5.66 18.35.5 12 .5Z" />
                </svg>
              </a>
              <span className="sheet-footer-copy">
                <span className="sheet-footer-brand">{sourceLabel}</span>
              </span>
            </footer>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
