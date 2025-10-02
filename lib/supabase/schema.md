# Database Structure

## Payments Table

```sql
create table public.payments (
  id uuid not null default gen_random_uuid(),
  order_id uuid null,
  amount numeric(10, 2) not null,
  payment_method text not null,
  transaction_id text null,
  mpesa_receipt_number text null,
  phone_number text null,
  status text null default 'pending'::text,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  
  -- Primary Key
  constraint payments_pkey primary key (id),
  
  -- Foreign Key
  constraint payments_order_id_fkey foreign key (order_id) references orders (id) on delete cascade,
  
  -- Status Check Constraint
  constraint payments_status_check check (
    status = any (array[
      'pending'::text,
      'completed'::text,
      'failed'::text,
      'cancelled'::text
    ])
  )
);
```

## Integration Details

The payments table is designed to work with the Quikk M-Pesa payment service. Here's how the fields map:

- `id`: Unique identifier for the payment
- `order_id`: References the associated order
- `amount`: Payment amount (up to 10 digits with 2 decimal places)
- `payment_method`: Currently supports 'mpesa' and 'card'
- `transaction_id`: Quikk transaction ID / checkout request ID
- `mpesa_receipt_number`: M-Pesa confirmation number after successful payment
- `phone_number`: Customer's phone number for M-Pesa payments
- `status`: Payment status (pending, completed, failed, cancelled)
- `created_at`: Timestamp when the payment was initiated
- `updated_at`: Timestamp when the payment was last updated

## Status Workflow

1. When a payment is initiated:
   - Record is created with status = 'pending'
   - transaction_id is set to the Quikk checkout request ID
   
2. After M-Pesa prompt:
   - If user completes payment:
     - status = 'completed'
     - mpesa_receipt_number is set
   - If user cancels/fails:
     - status = 'failed'
   - If system timeout:
     - status = 'cancelled'

## Querying Examples

```sql
-- Get all completed payments for an order
SELECT * FROM payments
WHERE order_id = '...' AND status = 'completed';

-- Get total revenue from completed payments
SELECT SUM(amount) as total_revenue
FROM payments
WHERE status = 'completed';

-- Get payment methods distribution
SELECT payment_method, COUNT(*) as count
FROM payments
WHERE status = 'completed'
GROUP BY payment_method;

-- Get recent payments with order details
SELECT p.*, o.order_number, o.customer_name, o.customer_email
FROM payments p
JOIN orders o ON p.order_id = o.id
ORDER BY p.created_at DESC
LIMIT 10;
```