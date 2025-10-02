import React from 'react';
import { adminService } from '@/lib/admin-service';

const CustomersPage = async () => {
  const customers = await adminService.getCustomers();

  return (
    <div>
      <h1>Customers</h1>
      <ul>
        {customers.map(customer => (
          <li key={customer.id}>{customer.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default CustomersPage;