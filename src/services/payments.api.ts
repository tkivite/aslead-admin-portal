import api from "./api";
import { ApiResponse, PageResponse } from "@/types/api.types";
import { Invoice, MpesaPayment, Payment } from "@/types/payments.types";

// Payments services
export const paymentsService = {
  getPayments: async (
    page = 0,
    size = 10
  ): Promise<PageResponse<Payment>> => {
    const response = await api.get<ApiResponse<PageResponse<Payment>>>(
      `/payments/api/payments?page=${page}&size=${size}`
    );
    return response.data.body;
  },

    getInvoices: async (): Promise<PageResponse<Invoice>> => {
      const response = await api.get<ApiResponse<PageResponse<Invoice>>>(`/payments/api/invoices`)
      return response.data.body
    },
      // Get MPESA payments
      getMpesaPayments: async (page = 0, size = 10): Promise<PageResponse<MpesaPayment>> => {
        const response = await api.get<ApiResponse<PageResponse<MpesaPayment>>>(
          `/payments/api/payments/mpesa?page=${page}&size=${size}`,
        )
        return response.data.body
      },
        // Get paginated payments (alias for getAllPayments with pagination)
  getPaginatedPayments: async (page = 0, size = 10): Promise<PageResponse<Payment>> => {
    const response = await api.get<ApiResponse<PageResponse<Payment>>>(
      `/payments/api/payments?page=${page}&size=${size}`,
    )
    return response.data.body
  },
    
}

 