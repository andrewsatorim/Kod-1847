-- =============================================
-- Код 1847 — Seed Data
-- Run this after 001_create_tables.sql
-- =============================================

-- Events
INSERT INTO events (day, month_ru, month_en, name_ru, name_en, desc_ru, desc_en, time, tag_ru, tag_en, sort_order) VALUES
('12', 'Апрель', 'April', 'Чайная дегустация: улуны Уишань', 'Tea Tasting: Wuyi Oolongs', 'Четыре улунских сорта, урожай 2024. Комментарии чайного мастера.', 'Four oolong varieties, 2024 harvest. Tea master commentary.', '18:00', 'Дегустация', 'Tasting', 1),
('18', 'Апрель', 'April', 'Джаз-вечер', 'Jazz Evening', 'Живая музыка, авторские напитки, камерная атмосфера.', 'Live music, signature drinks, intimate atmosphere.', '20:00', 'Музыка', 'Music', 2),
('22', 'Апрель', 'April', 'Дымная церемония', 'Smoke Ceremony', 'Ритуал подачи кальяна с элементами японской чайной традиции.', 'Hookah serving ritual with Japanese tea tradition elements.', '19:00', 'Церемония', 'Ceremony', 3),
('27', 'Апрель', 'April', 'Пуэр-вечер: выдержанные сорта', 'Pu-erh Evening: Aged Varieties', 'Три выдержанных шу-пуэра от 5 до 15 лет выдержки.', 'Three aged shu pu-erhs from 5 to 15 years.', '18:00', 'Дегустация', 'Tasting', 4),
('3', 'Май', 'May', 'Мастер-класс: заваривание гунфу-ча', 'Workshop: Gongfu-cha Brewing', 'Практическое занятие по технике традиционного заваривания.', 'Hands-on session on traditional brewing technique.', '17:00', 'Мастер-класс', 'Workshop', 5),
('10', 'Май', 'May', 'Закрытый ужин', 'Private Dinner', 'Авторское меню от приглашённого шефа. Паринг чая к каждому блюду.', 'Guest chef''s signature menu. Tea pairing for each course.', '19:30', 'Ужин', 'Dinner', 6);

-- Contacts
INSERT INTO contacts (key, value_ru, value_en) VALUES
('address', 'Москва, Арбат', 'Moscow, Arbat'),
('hours', 'Ежедневно, 14:00 — 02:00', 'Daily, 14:00 — 02:00'),
('phone', '+7 (495) 123-45-67', '+7 (495) 123-45-67'),
('telegram', 'https://t.me/kod1847', 'https://t.me/kod1847'),
('instagram', '#', '#'),
('partnership_phone', '+7 (901) 535-90-00', '+7 (901) 535-90-00');

-- Menu categories
INSERT INTO menu_categories (tab, title_ru, title_en, desc_ru, desc_en, sort_order) VALUES
('tea', 'Редкие сорта', 'Rare Teas', 'Коллекционные чаи ограниченного урожая. Выдержанные пуэры, высокогорные улуны, утёсные даньцуны', 'Limited harvest collector teas. Aged pu-erhs, high-mountain oolongs, rock dancongs', 1),
('tea', 'Церемониальные', 'Ceremonial', 'Подача по традиции гунфу-ча. Полный ритуал с прогревом посуды и многократными проливами', 'Served in gongfu-cha tradition. Full ritual with vessel warming and multiple infusions', 2),
('tea', 'Светлые', 'Light Teas', 'Белые и зелёные чаи. Нежный вкус, цветочные и травяные ноты', 'White and green teas. Delicate taste, floral and herbal notes', 3),
('tea', 'Тёмные', 'Dark Teas', 'Красные, чёрные и выдержанные пуэры. Глубокий вкус', 'Red, black and aged pu-erhs. Deep taste', 4),
('tea', 'Сезон', 'Seasonal', 'Чаи текущего урожая и сезонные купажи', 'Current harvest teas and seasonal blends', 5),
('hookah', 'Купажи мастера', 'Master''s Blends', 'Авторские составы шеф-кальянщика. Сложные многослойные миксы', 'Head hookah master''s signature blends. Complex multi-layered mixes', 1),
('hookah', 'Моно', 'Mono', 'Чистый вкус одного сорта табака', 'Pure single-variety tobacco taste', 2),
('hookah', 'Дымные церемонии', 'Smoke Ceremonies', 'Ритуал подачи с элементами чайной церемонии', 'Serving ritual with tea ceremony elements', 3),
('hookah', 'Лёгкий дым', 'Light Smoke', 'Мягкие фруктовые и цветочные композиции', 'Soft fruit and floral compositions', 4),
('food', 'Закуски', 'Appetizers', 'Лёгкие закуски к чаю и кальяну', 'Light appetizers paired with tea and hookah', 1),
('food', 'Десерты', 'Desserts', 'Авторские десерты к чайному меню', 'Signature desserts for our tea menu', 2);

-- Partnership formats
INSERT INTO partnership_formats (num, title_ru, title_en, points_ru, points_en, suit_ru, suit_en, sort_order) VALUES
('01', 'Фиксированная аренда', 'Fixed Venue Rental', '["Билеты и сбор полностью остаются у организатора","Клуб предоставляет площадку за фиксированную стоимость","Может быть включено чайное сопровождение","Гости могут заказывать напитки, десерты и кальяны по желанию","Заказы оплачиваются отдельно"]', '["Tickets and fees stay entirely with the organizer","Club provides venue for a fixed fee","Tea service can be included","Guests may order drinks, desserts, and hookah","Orders are charged separately"]', '10 - 40 гостей: выставки, лекции, презентации, закрытые показы', '10 - 40 guests: exhibitions, lectures, presentations, private screenings', 1),
('02', 'Билетный формат', 'Ticket Format', '["Билеты и сбор полностью остаются у организатора","Площадка без фиксированной аренды","Условие клуба: каждый гость заказывает напитки (1 300 ₽)","Дополнительные заказы оплачиваются отдельно"]', '["Tickets and fees stay entirely with the organizer","No fixed venue rental","Club condition: each guest orders drinks (1 300 ₽)","Additional orders are charged separately"]', '6 - 14 гостей: сессии, разборы, мастермайнды, камерные встречи', '6 - 14 guests: sessions, reviews, masterminds, intimate meetings', 2),
('03', 'Партнёрский формат', 'Partnership Format', '["Мероприятие для гостей бесплатное","Площадка без аренды","Клуб зарабатывает на напитках, десертах и кальянах","Может быть включено чайное сопровождение","Организатор получает 15 - 25% от выручки","Организатор за себя не платит"]', '["Event is free for guests","No venue rental","Club earns from drinks, desserts, and hookah","Tea service can be included","Organizer receives 15 - 25% of revenue","Organizer pays nothing for themselves"]', '', '', 3);

-- Club events
INSERT INTO club_events (name_ru, name_en, desc_ru, desc_en, detail_ru, detail_en, sort_order) VALUES
('Пятничный «Открытый» стол', 'Friday Open Table', 'Варка чая на огне, пролив 3 - 5 чаев. Идеально для общения и знакомства.', 'Fire-brewed tea, 3 - 5 infusions. Ideal for socializing.', 'До 20 гостей · 3 часа', 'Up to 20 guests · 3 hours', 1),
('КиноЧай', 'CineTea', 'Совместный просмотр глубокого кинематографа и обсуждение с модератором и экспертами.', 'Screening of art-house cinema with moderated discussion.', 'До 20 гостей · 2 - 3 часа · 2 раза в месяц', 'Up to 20 guests · 2 - 3 hours · Twice a month', 2),
('Чайное действо', 'Tea Experience', 'Погружение в чайные традиции и историю. Серьёзные переговоры с тактичным разливом.', 'Immersion into tea traditions. Thoughtful meetings with tactful service.', 'До 8 гостей · 1,5 - 2 часа · 3 - 5 чаев', 'Up to 8 guests · 1.5 - 2 hours · 3 - 5 teas', 3),
('Стилизованные чаепития', 'Themed Tea Ceremonies', 'Самоварное, чаоджоуское, тайваньское чаепития. Вау-эффект и новые эмоции.', 'Samovar, Chaozhou, Taiwanese ceremonies. Wow-effect and new emotions.', '3 - 12 гостей · 1,5 - 2 часа', '3 - 12 guests · 1.5 - 2 hours', 4);
