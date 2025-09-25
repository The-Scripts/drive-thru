-- Test data for H2 database
-- Categories
INSERT INTO categories (id, name, description) VALUES (1, 'Beverages', 'Hot and cold drinks');
INSERT INTO categories (id, name, description) VALUES (2, 'Food', 'Burgers, sandwiches and snacks');

-- Brands
INSERT INTO brands (id, name, description) VALUES (1, 'TestBrand1', 'Test brand 1');
INSERT INTO brands (id, name, description) VALUES (2, 'TestBrand2', 'Test brand 2');

-- Shops
INSERT INTO shops (id, name, address) VALUES (1, 'TestShop1', 'Test Address 1');
INSERT INTO shops (id, name, address) VALUES (2, 'TestShop2', 'Test Address 2');

-- Products
INSERT INTO products (id, name, description, price, category_fk, brand_fk, shop_fk, created_at, updated_at)
VALUES (1, 'Test Coffee', 'Delicious test coffee', 4.99, 1, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO products (id, name, description, price, category_fk, brand_fk, shop_fk, created_at, updated_at)
VALUES (2, 'Test Burger', 'Tasty test burger', 8.99, 2, 2, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO products (id, name, description, price, category_fk, brand_fk, shop_fk, created_at, updated_at)
VALUES (3, 'Test Tea', 'Refreshing test tea', 3.99, 1, 1, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
