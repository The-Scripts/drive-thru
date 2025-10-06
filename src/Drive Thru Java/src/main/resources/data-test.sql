-- Test data for H2 database
-- Categories
INSERT INTO categories (id, name, created_at, updated_at) VALUES (1, 'Beverages', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO categories (id, name, created_at, updated_at) VALUES (2, 'Food', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Brands
INSERT INTO brands (id, name, description, image_url, created_at, updated_at) VALUES (1, 'TestBrand1', 'Test brand 1', 'https://example.com/brand1.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO brands (id, name, description, image_url, created_at, updated_at) VALUES (2, 'TestBrand2', 'Test brand 2', 'https://example.com/brand2.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Shops (only has id and brand_fk columns)
INSERT INTO shops (id, brand_fk) VALUES (1, 1);
INSERT INTO shops (id, brand_fk) VALUES (2, 2);

-- Products
INSERT INTO products (id, name, description, price, category_fk, brand_fk, shop_fk, created_at, updated_at)
VALUES (1, 'Test Coffee', 'Delicious test coffee', 4.99, 1, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO products (id, name, description, price, category_fk, brand_fk, shop_fk, created_at, updated_at)
VALUES (2, 'Test Burger', 'Tasty test burger', 8.99, 2, 2, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO products (id, name, description, price, category_fk, brand_fk, shop_fk, created_at, updated_at)
VALUES (3, 'Test Tea', 'Refreshing test tea', 3.99, 1, 1, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
