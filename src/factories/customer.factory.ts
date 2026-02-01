import { CustomersRepository } from "@/database/repositories/customers.repository";
import { PrismaClient } from "@/generated/prisma/client";
import { CustomerService } from "@/services/customers.services";

const customerFactory = (() => {
  let customerService: CustomerService;

  return {
    getService: (): CustomerService => {
      if (!customerService) {
        const customerRepository = new CustomersRepository(new PrismaClient());

        customerService = new CustomerService(customerRepository);
      }
      return customerService;
    },
  };
})();

export default customerFactory;
