-- Create sample reviews for books
-- Note: This requires actual customer IDs from the customers table

INSERT INTO reviews (book_id, customer_id, rating, comment)
SELECT 
  '750e8400-e29b-41d4-a716-446655440001',
  c.id,
  5,
  'An absolutely masterful work that deals with complex themes of justice and morality. Harper Lee''s storytelling is both powerful and moving.'
FROM customers c 
WHERE c.email LIKE '%@%' 
LIMIT 1
ON CONFLICT (book_id, customer_id) DO NOTHING;

INSERT INTO reviews (book_id, customer_id, rating, comment)
SELECT 
  '750e8400-e29b-41d4-a716-446655440002',
  c.id,
  5,
  'Orwell''s vision of a dystopian future is both terrifying and prophetic. A must-read that remains incredibly relevant today.'
FROM customers c 
WHERE c.email LIKE '%@%' 
LIMIT 1
ON CONFLICT (book_id, customer_id) DO NOTHING;

INSERT INTO reviews (book_id, customer_id, rating, comment)
SELECT 
  '750e8400-e29b-41d4-a716-446655440003',
  c.id,
  4,
  'Jane Austen''s wit and social commentary shine through in this delightful romance. Elizabeth Bennet is a wonderful protagonist.'
FROM customers c 
WHERE c.email LIKE '%@%' 
LIMIT 1
ON CONFLICT (book_id, customer_id) DO NOTHING;

INSERT INTO reviews (book_id, customer_id, rating, comment)
SELECT 
  '750e8400-e29b-41d4-a716-446655440004',
  c.id,
  4,
  'Fitzgerald captures the excess and emptiness of the Jazz Age perfectly. The symbolism and prose are beautiful.'
FROM customers c 
WHERE c.email LIKE '%@%' 
LIMIT 1
ON CONFLICT (book_id, customer_id) DO NOTHING;

INSERT INTO reviews (book_id, customer_id, rating, comment)
SELECT 
  '750e8400-e29b-41d4-a716-446655440005',
  c.id,
  5,
  'Classic Agatha Christie at her finest. The plot twists kept me guessing until the very end. Hercule Poirot is brilliant as always.'
FROM customers c 
WHERE c.email LIKE '%@%' 
LIMIT 1
ON CONFLICT (book_id, customer_id) DO NOTHING;
