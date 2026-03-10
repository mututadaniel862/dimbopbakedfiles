declare module 'pesepay' {
  export class Pesepay {
    constructor(integrationKey: string, encryptionKey: string);
    resultUrl: string;
    returnUrl: string;
    createTransaction(amount: number, currencyCode: string, reasonForPayment: string): any;
    initiateTransaction(transaction: any): Promise<{
      redirectUrl: string;
      referenceNumber: string;
      pollUrl: string;
      transactionStatus: string;
      amountDetails: any;
    }>;
    checkPayment(referenceNumber: string): Promise<{
      transactionStatus: string;
      referenceNumber: string;
      amountDetails: any;
      redirectUrl: string;
      pollUrl: string;
    }>;
    makeSeamlessPayment(payment: any, reason: string, amount: number, requiredFields: any): Promise<{
      pollUrl: string;
      referenceNumber: string;
      transactionStatus: string;
    }>;
    createPayment(
      currencyCode: string,
      paymentMethodCode: string,
      email?: string,
      phoneNumber?: string,
      name?: string
    ): any;
  }
}