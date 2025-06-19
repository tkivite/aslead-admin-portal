
export interface Payment {
  id: string
  mobileNumber: string
  receivedFrom: string
  invoiceId: string
  reference: string
  description: string
  amount: number
  channel: string
  paymentMode: string
  receivedBy: string
  paymentFor: string
  transactionTime: string
  createdAt: string
  updatedAt: string
}

export interface UnmatchedPayment {
  paymentId: number
  reference: string
  transactionId: string
  phoneNumber: string
  amount: number
  paymentMethod: string
  paymentDate: string
  status: string
  description?: string
  matched: boolean
}



export interface Invoice {
  id: string
  category: string
  invoiceType: string
  invoiceNumber: string
  invoiceReference: string
  description: string
  totalAmount: number
  paidAmount: number
  invoiceStatus: string
  createdAt: string
  updatedAt: string
}


export interface MpesaPayment {
  id: number
  createdAt: string
  TransactionType: string
  TransID: string
  TransTime: string
  TransAmount: number
  BusinessShortCode: string
  BillRefNumber: string
  InvoiceNumber: string
  OrgAccountBalance: number
  ThirdPartyTransID: string
  MSISDN: string
  FirstName: string
}
