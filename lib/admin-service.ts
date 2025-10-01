import { createClient } from '@/lib/supabase/client';
import { type Order, type PaymentTransaction, type AdminStats, type Customer } from './admin-data';
import { type Database } from './database-types';

export class AdminService {
  private supabase = createClient<Database>();

  async getOrders(): Promise<Order[]> {
    const { data: orders, error } = await this.supabase
      .from('orders')
      .select(`
        *,
        customer:customers(
          first_name,
          last_name,
          email
        ),
        items:order_items(
          book_id,
          quantity,
          price,
          book:books(
            title,
            author:authors(
              name
            )
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Admin Service] Error fetching orders:', error);
      throw error;
    }

    return orders.map(order => ({
      id: order.id,
      customer_id: order.customer_id,
      total_amount: order.total_amount,
      status: order.status,
      payment_status: order.payment_status,
      payment_method: order.payment_method,
      shipping_address: order.shipping_address,
      created_at: order.created_at,
      updated_at: order.updated_at,
      customerName: order.customer ? `${order.customer.first_name} ${order.customer.last_name}` : 'Unknown',
      customerEmail: order.customer?.email,
      items: (order.items || []).map((item: any) => ({
        bookId: item.book_id,
        title: item.book?.title || 'Unknown',
        author: item.book?.author?.name || 'Unknown',
        quantity: item.quantity,
        price: item.price
      }))
    }));
  }

  async getTransactions(): Promise<PaymentTransaction[]> {
    const { data: transactions, error } = await this.supabase
      .from('payments')
      .select(`
        *,
        orders(
          customer:customers(
            first_name,
            last_name,
            email
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Admin Service] Error fetching transactions:', error);
      throw error;
    }

    return transactions.map(tx => ({
      id: tx.id,
      order_id: tx.order_id,
      amount: tx.amount,
      payment_method: tx.payment_method,
      transaction_id: tx.transaction_id,
      mpesa_receipt_number: tx.mpesa_receipt_number,
      phone_number: tx.phone_number,
      status: tx.status,
      created_at: tx.created_at,
      updated_at: tx.updated_at,
      customerName: tx.orders?.customer ? `${tx.orders.customer.first_name} ${tx.orders.customer.last_name}` : 'Unknown',
      customerEmail: tx.orders?.customer?.email,
      orderNumber: tx.order_id // Using order_id as orderNumber for display
    }));
    
  }

  async getAdminStats(): Promise<AdminStats> {
    // Get total orders
    const { count: totalOrders } = await this.supabase
      .from('orders')
      .select('*', { count: 'exact' });

    // Get total revenue
    const { data: revenueData } = await this.supabase
      .from('payments')
      .select('amount')
      .eq('status', 'completed');
    const totalRevenue = revenueData?.reduce((sum, tx) => sum + tx.amount, 0) || 0;

    // Get pending payments
    const { count: pendingPayments } = await this.supabase
      .from('payments')
      .select('*', { count: 'exact' })
      .eq('status', 'pending');

    // Get failed payments
    const { count: failedPayments } = await this.supabase
      .from('payments')
      .select('*', { count: 'exact' })
      .eq('status', 'failed');

    // Get today's orders
    const today = new Date().toISOString().split('T')[0];
    const { count: todayOrders } = await this.supabase
      .from('orders')
      .select('*', { count: 'exact' })
      .gte('created_at', today);

    // Get payment method stats
    const { data: mpesaCount } = await this.supabase
      .from('payments')
      .select('*', { count: 'exact' })
      .eq('payment_method', 'mpesa');

    const { data: cardCount } = await this.supabase
      .from('payments')
      .select('*', { count: 'exact' })
      .eq('payment_method', 'card');

    // Get monthly revenue for the past 8 months
    const monthlyRevenue: number[] = [];
    for (let i = 7; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).toISOString();
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString();

      const { data: monthData } = await this.supabase
        .from('payments')
        .select('amount')
        .eq('status', 'completed')
        .gte('transaction_date', startOfMonth)
        .lt('transaction_date', endOfMonth);

      monthlyRevenue.push(monthData?.reduce((sum, tx) => sum + tx.amount, 0) || 0);
    }

    return {
      totalOrders: totalOrders || 0,
      totalRevenue,
      pendingPayments: pendingPayments || 0,
      failedPayments: failedPayments || 0,
      todayOrders: todayOrders || 0,
      todayRevenue: 0, // Calculate from today's completed transactions
      monthlyRevenue,
      paymentMethodStats: {
        mpesa: mpesaCount?.length || 0,
        card: cardCount?.length || 0
      }
    };
  }

  async getRecentOrders(limit: number = 5): Promise<Order[]> {
    return this.getOrders();
  }

  async getRecentTransactions(limit: number = 5): Promise<PaymentTransaction[]> {
    return this.getTransactions();
  }

  async getCustomers(): Promise<Customer[]> {
    const { data: customers, error } = await this.supabase
      .from('customers')
      .select('*');

    if (error) {
      console.error('[Admin Service] Error fetching customers:', error);
      throw error;
    }

    return customers ?? [];
  }
}

export const adminService = new AdminService();