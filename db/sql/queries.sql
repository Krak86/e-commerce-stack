SELECT version();
SELECT current_database();
SELECT current_user;
SELECT now();
SELECT * FROM pg_stat_activity;
SELECT * FROM pg_tables WHERE schemaname = 'public';
SELECT * FROM pg_tables WHERE tablename = 'categories';
SELECT * FROM users;
SELECT * FROM categories;
SELECT * FROM products;
SELECT * FROM product_translations;
SELECT * FROM product_images;
DELETE FROM categories;
SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public';
SELECT * FROM information_schema.columns WHERE table_schema = 'public';
SELECT * FROM pg_roles;
SELECT * FROM pg_settings WHERE name IN ('max_connections', 'shared_buffers', 'work_mem');
SELECT schema_name FROM information_schema.schemata;

/*
Таблиця	                        Призначення

users	                        Користувачі магазину (реєстрація, логін)

categories	                    Категорії товарів (10 штук)
category_translations

products	                    Товари (1000 штук)
product_translations
product_images	                Зображення товарів

cart_items	                    Товари в кошику користувача
orders	                        Замовлення (total_amount, shipping_address_id, payment_method, user_id, order_items [])
order_items	                    Деталізація: які товари, кількість, ціна, варіант

payments	                    Інформація про оплату
payment_methods
payment_method_translations

shipping	                    Дані доставки
shipping_methods	            Керування методами доставки
shipping_method_translations	Мультимовність, SEO, UX

addresses	                    Адреси користувачів

