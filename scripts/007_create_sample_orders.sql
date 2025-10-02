-- Create sample orders and payments for admin dashboard testing
-- Note: This requires actual customer IDs from the customers table
-- Run this after users have signed up

-- Sample order 1 (completed)
INSERT INTO orders (id, customer_id, total_amount, status, payment_status, payment_method, shipping_address) 
SELECT 
  '850e8400-e29b-41d4-a716-446655440001',
  c.id,
  45.97,
  'delivered',
  'paid',
  'mpesa',
  'Nairobi, Kenya'
FROM customers c 
WHERE c.email LIKE '%@%' 
LIMIT 1
ON CONFLICT (id) DO NOTHING;

-- Sample order items for order 1
INSERT INTO order_items (order_id, book_id, quantity, price)
VALUES 
('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', 2, 12.99),
('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440003', 1, 11.99),
('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440004', 1, 10.99)
ON CONFLICT DO NOTHING;

-- Sample payment for order 1
INSERT INTO payments (order_id, amount, payment_method, transaction_id, mpesa_receipt_number, phone_number, status)
VALUES 
('850e8400-e29b-41d4-a716-446655440001', 45.97, 'mpesa', 'TXN123456789', 'QHJ8K9L0M1', '254712345678', 'completed')
ON CONFLICT DO NOTHING;

-- Sample order 2 (processing)
INSERT INTO orders (id, customer_id, total_amount, status, payment_status, payment_method, shipping_address) 
SELECT 
  '850e8400-e29b-41d4-a716-446655440002',
  c.id,
  28.98,
  'processing',
  'paid',
  'mpesa',
  'Mombasa, Kenya'
FROM customers c 
WHERE c.email LIKE '%@%' 
LIMIT 1
ON CONFLICT (id) DO NOTHING;

-- Sample order items for order 2
INSERT INTO order_items (order_id, book_id, quantity, price)
VALUES 
('850e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440002', 1, 13.99),
('850e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440005', 1, 14.99)
ON CONFLICT DO NOTHING;

-- Sample payment for order 2
INSERT INTO payments (order_id, amount, payment_method, transaction_id, mpesa_receipt_number, phone_number, status)
VALUES 
('850e8400-e29b-41d4-a716-446655440002', 28.98, 'mpesa', 'TXN987654321', 'QHJ2N3O4P5', '254798765432', 'completed')
ON CONFLICT DO NOTHING;

-- Sample order 3 (pending payment)
INSERT INTO orders (id, customer_id, total_amount, status, payment_status, payment_method, shipping_address) 
SELECT 
  '850e8400-e29b-41d4-a716-446655440003',
  c.id,
  24.48,
  'pending',
  'pending',
  'mpesa',
  'Kisumu, Kenya'
FROM customers c 
WHERE c.email LIKE '%@%' 
LIMIT 1
ON CONFLICT (id) DO NOTHING;

-- Sample order items for order 3
INSERT INTO order_items (order_id, book_id, quantity, price)
VALUES 
('850e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440007', 1, 12.49),
('850e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440009', 1, 11.49)
ON CONFLICT DO NOTHING;

-- Sample payment for order 3 (pending)
INSERT INTO payments (order_id, amount, payment_method, phone_number, status)
VALUES 
('850e8400-e29b-41d4-a716-446655440003', 24.48, 'mpesa', '254756789012', 'pending')
ON CONFLICT DO NOTHING;
