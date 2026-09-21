-- ============================================================
-- IBN TAYMIYYAH DIGITAL ENCYCLOPEDIA (موسوعة شيخ الإسلام ابن تيمية)
-- PostgreSQL Comprehensive Schema
-- Normalized relational schema with strict foreign keys, indexing & full-text search
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 1. Roles & Permissions (RBAC)
CREATE TABLE roles (
    id VARCHAR(32) PRIMARY KEY,
    name_ar VARCHAR(120) NOT NULL,
    name_en VARCHAR(120) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE permissions (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    category VARCHAR(64) NOT NULL
);

CREATE TABLE role_permissions (
    role_id VARCHAR(32) REFERENCES roles(id) ON DELETE CASCADE,
    permission_id VARCHAR(64) REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- 2. Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name_ar VARCHAR(255),
    full_name_en VARCHAR(255),
    role_id VARCHAR(32) REFERENCES roles(id) DEFAULT 'RESEARCHER',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Scholars & Historical Persons
CREATE TABLE scholars (
    id VARCHAR(64) PRIMARY KEY,
    name_ar VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    kunya_ar VARCHAR(120),
    birth_year_hijri INT,
    death_year_hijri INT NOT NULL,
    role VARCHAR(64) NOT NULL, -- TEACHER, STUDENT, CONTEMPORARY, BIOGRAPHER
    bio_ar TEXT NOT NULL,
    bio_en TEXT,
    relationship_details_ar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Books (المصنفات والمؤلفات)
CREATE TABLE books (
    id VARCHAR(64) PRIMARY KEY,
    title_ar VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    short_name_ar VARCHAR(120),
    short_name_en VARCHAR(120),
    category VARCHAR(64) NOT NULL, -- AQIDAH, FIQH, POLEMICS, SIYASAH, etc.
    description_ar TEXT NOT NULL,
    description_en TEXT,
    volumes_count INT DEFAULT 1,
    total_pages_approx INT DEFAULT 0,
    copyright_status VARCHAR(64) DEFAULT 'PUBLIC_DOMAIN',
    legal_download_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Book Editions (طبعات الكتب والتحقيقات)
CREATE TABLE book_editions (
    id VARCHAR(64) PRIMARY KEY,
    book_id VARCHAR(64) REFERENCES books(id) ON DELETE CASCADE,
    edition_name VARCHAR(255) NOT NULL,
    editor VARCHAR(255) NOT NULL, -- المحقق
    publisher VARCHAR(255) NOT NULL, -- الناشر
    publication_year_hijri INT,
    publication_year_gregorian INT,
    city VARCHAR(120),
    volumes_count INT DEFAULT 1,
    digital_source VARCHAR(255),
    is_canonical BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Volumes & Chapters
CREATE TABLE volumes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    book_id VARCHAR(64) REFERENCES books(id) ON DELETE CASCADE,
    volume_number INT NOT NULL,
    title_ar VARCHAR(255),
    total_pages INT,
    UNIQUE(book_id, volume_number)
);

CREATE TABLE chapters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    book_id VARCHAR(64) REFERENCES books(id) ON DELETE CASCADE,
    volume_number INT NOT NULL,
    title_ar VARCHAR(255) NOT NULL,
    title_en VARCHAR(255),
    start_page INT NOT NULL,
    end_page INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Documented Passages (النصوص الموثقة)
CREATE TABLE passages (
    id VARCHAR(64) PRIMARY KEY,
    book_id VARCHAR(64) REFERENCES books(id) ON DELETE CASCADE,
    volume_number INT NOT NULL,
    page_number INT NOT NULL,
    chapter_title_ar VARCHAR(255) NOT NULL,
    text_arabic TEXT NOT NULL,
    text_english TEXT,
    keywords TEXT[],
    verified_source_citation TEXT NOT NULL,
    verification_status VARCHAR(64) DEFAULT 'VERIFIED_CANONICAL',
    publisher VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Search Index on Passages
CREATE INDEX idx_passages_arabic_trgm ON passages USING gin (text_arabic gin_trgm_ops);
CREATE INDEX idx_passages_book_vol ON passages (book_id, volume_number);

-- 8. Topics Taxonomy (التبويب الموضوعي)
CREATE TABLE topics (
    id VARCHAR(64) PRIMARY KEY,
    name_ar VARCHAR(120) NOT NULL,
    name_en VARCHAR(120) NOT NULL,
    description_ar TEXT NOT NULL,
    description_en TEXT,
    category VARCHAR(64) NOT NULL,
    parent_topic_id VARCHAR(64) REFERENCES topics(id)
);

CREATE TABLE passage_topics (
    passage_id VARCHAR(64) REFERENCES passages(id) ON DELETE CASCADE,
    topic_id VARCHAR(64) REFERENCES topics(id) ON DELETE CASCADE,
    PRIMARY KEY (passage_id, topic_id)
);

-- 9. Fatwa & Question Database (المسائل والفتاوى)
CREATE TABLE fatwas (
    id VARCHAR(64) PRIMARY KEY,
    question_ar TEXT NOT NULL,
    question_en TEXT,
    answer_ar TEXT NOT NULL,
    answer_en TEXT,
    book_id VARCHAR(64) REFERENCES books(id) ON DELETE SET NULL,
    volume_number INT,
    page_number INT,
    topic_id VARCHAR(64) REFERENCES topics(id),
    verified_citation TEXT NOT NULL,
    edition VARCHAR(255),
    verification_status VARCHAR(32) DEFAULT 'VERIFIED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Historical Timeline Events (أحداث الخط الزمني)
CREATE TABLE timeline_events (
    id VARCHAR(64) PRIMARY KEY,
    year_hijri INT NOT NULL,
    year_gregorian INT NOT NULL,
    month_hijri VARCHAR(64),
    title_ar VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    description_ar TEXT NOT NULL,
    description_en TEXT,
    location_ar VARCHAR(120),
    location_en VARCHAR(120),
    category VARCHAR(64) NOT NULL,
    primary_sources TEXT[]
);

-- 11. Manuscripts & Document Archives (المخطوطات والوثائق)
CREATE TABLE manuscripts (
    id VARCHAR(64) PRIMARY KEY,
    title_ar VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    library VARCHAR(255) NOT NULL,
    city VARCHAR(120) NOT NULL,
    country VARCHAR(120) NOT NULL,
    shelfmark VARCHAR(120) NOT NULL,
    folios_count INT,
    copyist_date_hijri VARCHAR(120),
    script_type VARCHAR(120),
    description_ar TEXT,
    digital_scan_available BOOLEAN DEFAULT FALSE,
    public_archive_url TEXT
);

-- 12. Knowledge Relationships Graph
CREATE TABLE relationships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_entity_id VARCHAR(64) NOT NULL,
    target_entity_id VARCHAR(64) NOT NULL,
    relationship_type VARCHAR(64) NOT NULL, -- WRITTEN_BY, STUDIED_UNDER, TAUGHT, DISCUSSES, REFERENCES
    label_ar VARCHAR(120) NOT NULL,
    label_en VARCHAR(120) NOT NULL,
    source_citation TEXT
);

-- 13. User Personal Library (المفضلة، الحواشي والملاحظات)
CREATE TABLE bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    item_type VARCHAR(32) NOT NULL, -- BOOK, PASSAGE, FATWA
    target_id VARCHAR(64) NOT NULL,
    user_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE highlights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    passage_id VARCHAR(64) REFERENCES passages(id) ON DELETE CASCADE,
    text_snippet TEXT NOT NULL,
    color VARCHAR(16) DEFAULT 'yellow',
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. Audit Logs (سجل التدقيق والمراجعة)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(64) NOT NULL,
    entity_type VARCHAR(64) NOT NULL,
    entity_id VARCHAR(64),
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
