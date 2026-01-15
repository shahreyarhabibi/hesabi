PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      name TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('income', 'expense', 'both')),
      icon TEXT DEFAULT 'default',
      color TEXT DEFAULT '#6B7280',
      is_default BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
INSERT INTO categories VALUES(1,NULL,'Entertainment','expense','film','#8B5CF6',1,'2026-01-12 05:42:15');
INSERT INTO categories VALUES(2,NULL,'Groceries','expense','shopping-cart','#10B981',1,'2026-01-12 05:42:16');
INSERT INTO categories VALUES(3,NULL,'Dining','expense','utensils','#F59E0B',1,'2026-01-12 05:42:16');
INSERT INTO categories VALUES(4,NULL,'Transportation','expense','car','#3B82F6',1,'2026-01-12 05:42:16');
INSERT INTO categories VALUES(5,NULL,'Shopping','expense','shopping-bag','#EC4899',1,'2026-01-12 05:42:16');
INSERT INTO categories VALUES(6,NULL,'Bills','expense','file-text','#EF4444',1,'2026-01-12 05:42:16');
INSERT INTO categories VALUES(7,NULL,'Personal Care','expense','heart','#F43F5E',1,'2026-01-12 05:42:17');
INSERT INTO categories VALUES(8,NULL,'Healthcare','expense','activity','#06B6D4',1,'2026-01-12 05:42:17');
INSERT INTO categories VALUES(9,NULL,'Education','expense','book','#6366F1',1,'2026-01-12 05:42:17');
INSERT INTO categories VALUES(10,NULL,'Housing','expense','home','#84CC16',1,'2026-01-12 05:42:17');
INSERT INTO categories VALUES(11,NULL,'Utilities','expense','zap','#FBBF24',1,'2026-01-12 05:42:17');
INSERT INTO categories VALUES(12,NULL,'Insurance','expense','shield','#A855F7',1,'2026-01-12 05:42:17');
INSERT INTO categories VALUES(13,NULL,'Subscriptions','expense','repeat','#14B8A6',1,'2026-01-12 05:42:17');
INSERT INTO categories VALUES(14,NULL,'Salary','income','briefcase','#22C55E',1,'2026-01-12 05:42:18');
INSERT INTO categories VALUES(15,NULL,'Freelance','income','laptop','#3B82F6',1,'2026-01-12 05:42:18');
INSERT INTO categories VALUES(16,NULL,'Investments','income','trending-up','#10B981',1,'2026-01-12 05:42:18');
INSERT INTO categories VALUES(17,NULL,'Gifts','income','gift','#F43F5E',1,'2026-01-12 05:42:18');
INSERT INTO categories VALUES(18,NULL,'Refunds','income','rotate-ccw','#8B5CF6',1,'2026-01-12 05:42:18');
INSERT INTO categories VALUES(19,NULL,'Bonus','income','award','#F59E0B',1,'2026-01-12 05:42:18');
INSERT INTO categories VALUES(20,NULL,'Other','both','more-horizontal','#6B7280',1,'2026-01-12 05:42:18');
INSERT INTO categories VALUES(21,NULL,'Transfer','both','arrow-right-left','#64748B',1,'2026-01-12 05:42:19');
CREATE TABLE transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      category_id INTEGER,
      name TEXT NOT NULL,
      description TEXT,
      amount DECIMAL(10, 2) NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
      date DATE NOT NULL,
      recurring BOOLEAN DEFAULT 0,
      recurring_interval TEXT CHECK(recurring_interval IN ('daily', 'weekly', 'monthly', 'yearly')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
    );
INSERT INTO transactions VALUES(31,2,6,'Internet Bill','Paid internet Bill',2300,'expense','2026-01-15T00:00:00.000Z',1,'monthly','2026-01-15 06:51:46','2026-01-15 06:51:46');
INSERT INTO transactions VALUES(32,2,1,'Cinema Ticket',NULL,640,'expense','2026-01-15T00:00:00.000Z',0,NULL,'2026-01-15 06:53:31','2026-01-15 06:53:31');
INSERT INTO transactions VALUES(33,2,14,'Jan Salary',NULL,20000,'income','2026-01-15T00:00:00.000Z',0,NULL,'2026-01-15 06:53:49','2026-01-15 06:53:49');
CREATE TABLE budgets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      category_id INTEGER,
      name TEXT NOT NULL,
      max_amount DECIMAL(10, 2) NOT NULL,
      color TEXT DEFAULT '#0d9488',
      period TEXT DEFAULT 'monthly' CHECK(period IN ('weekly', 'monthly', 'yearly')),
      start_date DATE,
      end_date DATE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
    );
INSERT INTO budgets VALUES(13,2,1,'Entertainment',2000,'#0d9488','monthly',NULL,NULL,'2026-01-15 06:52:12','2026-01-15 06:52:12');
INSERT INTO budgets VALUES(14,2,6,'Bills',2500,'#f97316','monthly',NULL,NULL,'2026-01-15 06:52:55','2026-01-15 06:53:07');
CREATE TABLE pots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      target_amount DECIMAL(10, 2) NOT NULL,
      saved_amount DECIMAL(10, 2) DEFAULT 0,
      color TEXT DEFAULT '#3B82F6',
      icon TEXT DEFAULT 'piggy-bank',
      deadline DATE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
INSERT INTO pots VALUES(10,2,'Buy a Mobile','To Buy a Mobile',10000,10000,'#0d9488','piggy-bank',NULL,'2026-01-15 06:52:31','2026-01-15 06:55:17');
CREATE TABLE pot_transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pot_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      amount DECIMAL(10, 2) NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('deposit', 'withdrawal')),
      note TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (pot_id) REFERENCES pots(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
INSERT INTO pot_transactions VALUES(8,10,2,2000,'deposit',NULL,'2026-01-15 06:54:09');
INSERT INTO pot_transactions VALUES(9,10,2,8000,'deposit',NULL,'2026-01-15 06:55:17');
CREATE TABLE accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      provider TEXT NOT NULL,
      provider_account_id TEXT NOT NULL,
      refresh_token TEXT,
      access_token TEXT,
      expires_at INTEGER,
      token_type TEXT,
      scope TEXT,
      id_token TEXT,
      session_state TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(provider, provider_account_id)
    );
INSERT INTO accounts VALUES(3,10,'oauth','github','162581616',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-15 05:14:43');
CREATE TABLE IF NOT EXISTS "users" (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT,
        name TEXT, last_name TEXT,
        avatar TEXT,
        provider TEXT DEFAULT 'credentials',
        provider_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      , currency TEXT DEFAULT 'USD', theme TEXT DEFAULT 'light', email_verified BOOLEAN DEFAULT 0);
INSERT INTO users VALUES(1,'test@example.com','$2b$10$iBRKuUnt3xfr/SeonYf4Veu7neQGIEF1puA9OOFN1brKfYNIhawhO','Test User',NULL,NULL,'credentials',NULL,'2026-01-01 07:11:19','2026-01-12 04:31:48','USD','light',0);
INSERT INTO users VALUES(2,'admin@example.com','$2b$12$kdLbab2MzksrqEtdmb/FMu2yHovmjjK3L00V0xoHpsEnZLi0XZmiK','Admin User',NULL,'/avatars/boy.png','credentials',NULL,'2026-01-01 07:11:19','2026-01-12 04:31:48','USD','light',0);
INSERT INTO users VALUES(3,'ali@gmail.com','$2b$10$5sW2tB3r7h5z.ELGEOFx.OUH.9U2rfxqi5wF/04saxu66v5CKncGu','aLI','','/avatars/user.png','credentials',NULL,'2026-01-01 07:18:03','2026-01-15 05:26:56','USD','light',0);
INSERT INTO users VALUES(4,'ahmad@mail.com','$2b$10$tUZHa96hkJkbbKo3rfabSO061C/r3TUC6RdY326lXJNdF7cihaDee','Ahmad',NULL,NULL,'credentials',NULL,'2026-01-01 10:04:14','2026-01-12 04:31:48','USD','light',0);
INSERT INTO users VALUES(5,'alireza@gmail.com','$2b$12$ksxkQdbTKvPCorXzTLDXnOavpnKIiTJQVhIU2jv40u6s57psgwIo.','Ali Habibi',NULL,'/avatars/boy.png','credentials',NULL,'2026-01-11 11:03:56','2026-01-12 05:26:05','USD','light',0);
INSERT INTO users VALUES(6,'ahmad@gmail.com','$2b$10$tThJQmUbNbI/oCM5fkrvFequq5/1uhx9c0jFHV6TffO8Aj0.v6s9e','Ahmad',NULL,'/avatars/boy.png','credentials',NULL,'2026-01-12 05:23:03','2026-01-12 05:23:31','USD','light',0);
INSERT INTO users VALUES(9,'ahmad@example.com','$2b$10$fuY63AmQZoBJ.oIZGFP4vezjZXr93dWSd9ryp.DilegQGx1GWvbF2','Ahmad','Rashid','/avatars/user.png','credentials',NULL,'2026-01-15 04:46:14','2026-01-15 05:14:12','USD','light',0);
INSERT INTO users VALUES(10,'shahreyarhabibi@gmail.com',NULL,'Ali','Reza Habibi','https://avatars.githubusercontent.com/u/162581616?v=4','github',NULL,'2026-01-15 05:14:43','2026-01-15 05:14:43','USD','light',1);
INSERT INTO users VALUES(11,'AhmadReza@gmail.com','$2b$10$Xldc.kN7xW9Cg9W6X15Awu5nX3.gj6l76.jVrJaBUqWpw8tXgDv3.','Ahmad Reza','Ahmadi',NULL,'credentials',NULL,'2026-01-15 05:16:20','2026-01-15 05:16:20','USD','light',0);
INSERT INTO users VALUES(12,'asdas@ASD.COM','$2b$10$r7r0Kmkr6.Ov39lR9qOW4OH9WOTbKz5WjMBTiUAbvmwnsNWs1Nn7a','asdad','asdas',NULL,'credentials',NULL,'2026-01-15 06:19:12','2026-01-15 06:19:12','USD','light',0);
INSERT INTO users VALUES(13,'shahreyar@telegmail.com','$2b$10$MpLkJfZlTt4hhyNFB/pQAuMJvdZ0vj.VLQ8lO1cOIvD9uBuw9WHQy','Ali Reza','Habibi',NULL,'credentials',NULL,'2026-01-15 06:33:04','2026-01-15 06:33:04','USD','light',1);
INSERT INTO users VALUES(14,'hunteralireza700@gmail.com','$2b$10$bmsmt.LBM4tMImsIDRSiSOQ9stMYNrGMcEQsQKaiEaOaEZPM8UAKe','Shahreyar','Habibi',NULL,'credentials',NULL,'2026-01-15 06:38:37','2026-01-15 06:38:37','USD','light',1);
CREATE TABLE otp_codes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        code TEXT NOT NULL,
        expires_at DATETIME NOT NULL,
        used BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
INSERT INTO otp_codes VALUES(1,'shahreyar@telegmail.com','627735','2026-01-15T06:34:04.193Z',1,'2026-01-15 06:33:04');
INSERT INTO otp_codes VALUES(2,'hunteralireza700@gmail.com','182074','2026-01-15T06:39:37.714Z',1,'2026-01-15 06:38:37');
CREATE TABLE otp_rate_limits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        request_count INTEGER DEFAULT 0,
        first_request_at DATETIME,
        last_request_at DATETIME,
        blocked_until DATETIME
      );
INSERT INTO otp_rate_limits VALUES(1,'shahreyar@telegmail.com',1,'2026-01-15T06:33:04.319Z','2026-01-15T06:33:04.319Z',NULL);
INSERT INTO otp_rate_limits VALUES(2,'hunteralireza700@gmail.com',1,'2026-01-15T06:38:37.874Z','2026-01-15T06:38:37.874Z',NULL);
PRAGMA writable_schema=ON;
CREATE TABLE IF NOT EXISTS sqlite_sequence(name,seq);
DELETE FROM sqlite_sequence;
INSERT INTO sqlite_sequence VALUES('categories',21);
INSERT INTO sqlite_sequence VALUES('transactions',33);
INSERT INTO sqlite_sequence VALUES('budgets',14);
INSERT INTO sqlite_sequence VALUES('pots',10);
INSERT INTO sqlite_sequence VALUES('pot_transactions',9);
INSERT INTO sqlite_sequence VALUES('accounts',3);
INSERT INTO sqlite_sequence VALUES('users',14);
INSERT INTO sqlite_sequence VALUES('otp_rate_limits',2);
INSERT INTO sqlite_sequence VALUES('otp_codes',2);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_category ON transactions(category_id);
CREATE INDEX idx_budgets_user_id ON budgets(user_id);
CREATE INDEX idx_pots_user_id ON pots(user_id);
CREATE INDEX idx_categories_user_id ON categories(user_id);
CREATE INDEX idx_pot_transactions_pot ON pot_transactions(pot_id);
CREATE INDEX idx_otp_email ON otp_codes(email);
CREATE INDEX idx_otp_expires ON otp_codes(expires_at);
CREATE INDEX idx_rate_limit_email ON otp_rate_limits(email);
PRAGMA writable_schema=OFF;
COMMIT;
