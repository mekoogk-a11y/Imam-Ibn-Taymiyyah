import React, { useState, useEffect } from 'react';
import {
  Language,
  ActiveNavTab,
  Book,
  Passage,
  Topic,
} from './types';
import {
  BOOKS_DATA,
  PASSAGES_DATABASE,
  FATWAS_DATABASE,
  TOPICS_DATA,
  SCHOLARS_DATA,
  KNOWLEDGE_NODES,
  KNOWLEDGE_EDGES,
  BIOGRAPHY_STAGES,
  TIMELINE_EVENTS,
  MANUSCRIPTS_DATA,
  ACADEMIC_ARTICLES,
  AUDIO_LECTURES,
  SCHOLAR_PROFILE,
} from './data/encyclopediaData';

// Core Components
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { MegaMenu } from './components/MegaMenu';
import { AdminModal } from './components/AdminModal';

// Views
import { HomeView } from './components/HomeView';
import { BooksView } from './components/BooksView';
import { BookDetailView } from './components/BookDetailView';
import { MajmuFatawaView } from './components/MajmuFatawaView';
import { ReaderView } from './components/ReaderView';
import { SearchView } from './components/SearchView';
import { FatwasView } from './components/FatwasView';
import { BiographyView } from './components/BiographyView';
import { ScholarsGraphView } from './components/ScholarsGraphView';
import { TopicsView } from './components/TopicsView';
import { TopicDetailView } from './components/TopicDetailView';
import { ResearchCollectionsView } from './components/ResearchCollectionsView';
import { SitemapView } from './components/SitemapView';
import { ManuscriptsView } from './components/ManuscriptsView';
import { ArticlesView } from './components/ArticlesView';
import { AudioView } from './components/AudioView';
import { AssistantView } from './components/AssistantView';
import { LibraryView } from './components/LibraryView';
import { AboutView } from './components/AboutView';
import { NotFoundView } from './components/NotFoundView';

export function App() {
  const [language, setLanguage] = useState<Language>('ar');
  const [activeTab, setActiveTab] = useState<ActiveNavTab>('home');
  const [currentBookId, setCurrentBookId] = useState<string>(BOOKS_DATA[0].id);
  const [selectedBook, setSelectedBook] = useState<Book>(BOOKS_DATA[0]);
  const [selectedTopic, setSelectedTopic] = useState<Topic>(TOPICS_DATA[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [assistantQuery, setAssistantQuery] = useState<string>('');
  const [adminModalOpen, setAdminModalOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState<boolean>(false);

  // Bookmarks in localStorage
  const [bookmarkedPassages, setBookmarkedPassages] = useState<Passage[]>(() => {
    try {
      const saved = localStorage.getItem('ibn_taymiyyah_bookmarks');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [PASSAGES_DATABASE[0], PASSAGES_DATABASE[1]];
  });

  useEffect(() => {
    try {
      localStorage.setItem('ibn_taymiyyah_bookmarks', JSON.stringify(bookmarkedPassages));
    } catch {
      // ignore
    }
  }, [bookmarkedPassages]);

  // Set document title and direction based on language
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    if (language === 'ar') {
      document.title = 'موسوعة شيخ الإسلام ابن تيمية | التراث العلمي الموثق';
    } else {
      document.title = 'Ibn Taymiyyah Digital Encyclopedia | Verified Heritage';
    }
  }, [language]);

  // Keyboard shortcut: Ctrl+K / Cmd+K to jump to search, Escape to close MegaMenu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setActiveTab('search');
        setMegaMenuOpen(false);
      }
      if (e.key === 'Escape') {
        setMegaMenuOpen(false);
        setAdminModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenBookInReader = (bookId: string) => {
    setCurrentBookId(bookId);
    setActiveTab('reader');
    setMegaMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenPassageInReader = (bookId: string, _passageId?: string) => {
    setCurrentBookId(bookId);
    setActiveTab('reader');
    setMegaMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectBookDetail = (book: Book) => {
    setSelectedBook(book);
    setActiveTab('book-detail');
    setMegaMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTopicDetail = (topic: Topic) => {
    setSelectedTopic(topic);
    setActiveTab('topic-detail');
    setMegaMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleBookmark = (passage: Passage) => {
    setBookmarkedPassages((prev) => {
      const exists = prev.some((p) => p.id === passage.id);
      if (exists) {
        return prev.filter((p) => p.id !== passage.id);
      } else {
        return [...prev, passage];
      }
    });
  };

  const isPassageBookmarked = (passageId: string) => {
    return bookmarkedPassages.some((p) => p.id === passageId);
  };

  const handleAskAI = (prompt: string) => {
    setAssistantQuery(prompt);
    setActiveTab('assistant');
    setMegaMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchWithinBook = (bookId: string, query: string) => {
    setSearchQuery(query);
    setActiveTab('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentBook = BOOKS_DATA.find((b) => b.id === currentBookId) || BOOKS_DATA[0];
  const currentBookPassages = PASSAGES_DATABASE.filter((p) => p.bookId === currentBook.id);
  const majmuBook = BOOKS_DATA.find((b) => b.id === 'majmu-fatawa') || BOOKS_DATA[0];

  return (
    <div className={`min-h-screen bg-[#F7F4EC] text-[#090909] flex flex-col ${language === 'ar' ? 'font-naskh' : 'font-sans'}`}>
      {/* 1. Header with MegaMenu Toggle */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (tab === 'admin') {
            setAdminModalOpen(true);
          } else {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={() => {
          if (searchQuery.trim()) {
            setActiveTab('search');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        bookmarksCount={bookmarkedPassages.length}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        megaMenuOpen={megaMenuOpen}
        onToggleMegaMenu={() => setMegaMenuOpen(!megaMenuOpen)}
      />

      {/* MegaMenu Dropdown / Drawer */}
      <MegaMenu
        language={language}
        isOpen={megaMenuOpen}
        onClose={() => setMegaMenuOpen(false)}
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setMegaMenuOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* 2. Main Content Area with Sidebar Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block shrink-0 sticky top-24 h-[calc(100vh-7rem)]">
          <Sidebar
            language={language}
            activeTab={activeTab}
            onSelectTab={(tab) => {
              if (tab === 'admin') {
                setAdminModalOpen(true);
              } else {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            counts={{
              books: BOOKS_DATA.length,
              passages: PASSAGES_DATABASE.length,
              fatwas: FATWAS_DATABASE.length,
              topics: TOPICS_DATA.length,
              scholars: SCHOLARS_DATA.length,
              manuscripts: MANUSCRIPTS_DATA.length,
            }}
          />
        </div>

        {/* Mobile Drawer (When Opened) */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/50 lg:hidden flex"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              className="w-72 bg-[#FFFDF7] h-full overflow-y-auto p-4 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Sidebar
                language={language}
                activeTab={activeTab}
                onSelectTab={(tab) => {
                  setMobileMenuOpen(false);
                  if (tab === 'admin') {
                    setAdminModalOpen(true);
                  } else {
                    setActiveTab(tab);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                counts={{
                  books: BOOKS_DATA.length,
                  passages: PASSAGES_DATABASE.length,
                  fatwas: FATWAS_DATABASE.length,
                  topics: TOPICS_DATA.length,
                  scholars: SCHOLARS_DATA.length,
                  manuscripts: MANUSCRIPTS_DATA.length,
                }}
              />
            </div>
          </div>
        )}

        {/* Dynamic View Center Container */}
        <main className="flex-1 min-w-0">
          {activeTab === 'home' && (
            <HomeView
              language={language}
              onSelectTab={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSearch={(q) => {
                setSearchQuery(q);
                setActiveTab('search');
              }}
              onOpenBook={handleOpenBookInReader}
              books={BOOKS_DATA}
              samplePassage={PASSAGES_DATABASE[1]}
            />
          )}

          {activeTab === 'books' && (
            <BooksView
              language={language}
              books={BOOKS_DATA}
              onOpenBookInReader={handleOpenBookInReader}
              onSelectBookDetail={handleSelectBookDetail}
            />
          )}

          {activeTab === 'book-detail' && (
            <BookDetailView
              language={language}
              book={selectedBook}
              passages={PASSAGES_DATABASE}
              onOpenBookInReader={handleOpenBookInReader}
              onOpenPassageInReader={(p) => handleOpenPassageInReader(p.bookId, p.id)}
              onSelectBook={(id) => {
                const b = BOOKS_DATA.find((item) => item.id === id);
                if (b) setSelectedBook(b);
              }}
              onSearchWithinBook={handleSearchWithinBook}
              onBack={() => setActiveTab('books')}
            />
          )}

          {activeTab === 'majmu-fatawa' && (
            <MajmuFatawaView
              language={language}
              onOpenPassageInReader={(p) => handleOpenPassageInReader(p.bookId, p.id)}
              onOpenBookInReader={handleOpenBookInReader}
              passages={PASSAGES_DATABASE}
              book={majmuBook}
              onNavigateHome={() => setActiveTab('home')}
            />
          )}

          {activeTab === 'reader' && (
            <ReaderView
              language={language}
              currentBook={currentBook}
              passages={currentBookPassages}
              onBookmarkPassage={handleToggleBookmark}
              isBookmarked={isPassageBookmarked}
            />
          )}

          {activeTab === 'search' && (
            <SearchView
              language={language}
              books={BOOKS_DATA}
              topics={TOPICS_DATA}
              allPassages={PASSAGES_DATABASE}
              initialQuery={searchQuery}
              onOpenPassageInReader={handleOpenPassageInReader}
              onAskAI={handleAskAI}
            />
          )}

          {activeTab === 'fatwas' && (
            <FatwasView
              language={language}
              fatwas={FATWAS_DATABASE}
              onOpenBookInReader={handleOpenBookInReader}
            />
          )}

          {activeTab === 'biography' && (
            <BiographyView
              language={language}
              profile={SCHOLAR_PROFILE}
              stages={BIOGRAPHY_STAGES}
              timeline={TIMELINE_EVENTS}
              mode="biography"
            />
          )}

          {activeTab === 'timeline' && (
            <BiographyView
              language={language}
              profile={SCHOLAR_PROFILE}
              stages={BIOGRAPHY_STAGES}
              timeline={TIMELINE_EVENTS}
              mode="timeline"
            />
          )}

          {activeTab === 'topics' && (
            <TopicsView
              language={language}
              topics={TOPICS_DATA}
              passages={PASSAGES_DATABASE}
              onSelectTopicForSearch={() => {
                setActiveTab('search');
              }}
              onOpenPassageInReader={handleOpenPassageInReader}
              onSelectTopicDetail={handleSelectTopicDetail}
              onAskAIWithTopic={handleAskAI}
            />
          )}

          {activeTab === 'topic-detail' && (
            <TopicDetailView
              language={language}
              topic={selectedTopic}
              allBooks={BOOKS_DATA}
              allPassages={PASSAGES_DATABASE}
              allFatwas={FATWAS_DATABASE}
              allArticles={ACADEMIC_ARTICLES}
              onOpenBookInReader={handleOpenBookInReader}
              onOpenPassageInReader={(p) => handleOpenPassageInReader(p.bookId, p.id)}
              onSelectTopic={(id) => {
                const t = TOPICS_DATA.find((item) => item.id === id);
                if (t) setSelectedTopic(t);
              }}
              onAskAIWithTopic={handleAskAI}
              onSearchWithinTopic={(q) => {
                setSearchQuery(q);
                setActiveTab('search');
              }}
              onBack={() => setActiveTab('topics')}
            />
          )}

          {activeTab === 'research-collections' && (
            <ResearchCollectionsView
              language={language}
              onOpenBookInReader={handleOpenBookInReader}
              onOpenPassageInReader={(p) => handleOpenPassageInReader(p.bookId, p.id)}
              onBack={() => setActiveTab('library')}
              allPassages={PASSAGES_DATABASE}
              allBooks={BOOKS_DATA}
            />
          )}

          {activeTab === 'sitemap' && (
            <SitemapView
              language={language}
              onSelectTab={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onBack={() => setActiveTab('home')}
            />
          )}

          {activeTab === 'scholars' && (
            <ScholarsGraphView
              language={language}
              scholars={SCHOLARS_DATA}
              graphNodes={KNOWLEDGE_NODES}
              graphEdges={KNOWLEDGE_EDGES}
              onOpenBookInReader={handleOpenBookInReader}
            />
          )}

          {activeTab === 'graph' && (
            <ScholarsGraphView
              language={language}
              scholars={SCHOLARS_DATA}
              graphNodes={KNOWLEDGE_NODES}
              graphEdges={KNOWLEDGE_EDGES}
              onOpenBookInReader={handleOpenBookInReader}
            />
          )}

          {activeTab === 'manuscripts' && (
            <ManuscriptsView
              language={language}
              manuscripts={MANUSCRIPTS_DATA}
            />
          )}

          {activeTab === 'articles' && (
            <ArticlesView
              language={language}
              articles={ACADEMIC_ARTICLES}
            />
          )}

          {activeTab === 'audio' && (
            <AudioView
              language={language}
              audioItems={AUDIO_LECTURES}
            />
          )}

          {activeTab === 'assistant' && (
            <AssistantView
              language={language}
              initialQuery={assistantQuery}
              onOpenPassageInReader={handleOpenPassageInReader}
            />
          )}

          {activeTab === 'library' && (
            <LibraryView
              language={language}
              bookmarkedPassages={bookmarkedPassages}
              onRemoveBookmark={(id) => {
                setBookmarkedPassages((prev) => prev.filter((p) => p.id !== id));
              }}
              onOpenPassageInReader={handleOpenPassageInReader}
            />
          )}

          {activeTab === 'about' && (
            <AboutView language={language} />
          )}

          {activeTab === 'not-found' && (
            <NotFoundView
              language={language}
              onSelectTab={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}
        </main>
      </div>

      {/* 3. Footer */}
      <Footer
        language={language}
        onSelectTab={(tab) => {
          if (tab === 'admin') {
            setAdminModalOpen(true);
          } else {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
      />

      {/* 4. Admin and Scholarly Review Modal */}
      <AdminModal
        language={language}
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        passages={PASSAGES_DATABASE}
        books={BOOKS_DATA}
      />
    </div>
  );
}

export default App;
