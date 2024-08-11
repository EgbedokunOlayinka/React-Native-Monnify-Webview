export type PaymentMethod =
  | 'CARD'
  | 'ACCOUNT_TRANSFER'
  | 'USSD'
  | 'PHONE_NUMBER';

export type Currency = 'NGN';

export type MonnifySuccessResponse = {
  amount: number;
  amountPaid: number;
  completed: boolean;
  completedOn: string;
  createdOn: string;
  currencyCode: Currency;
  customerEmail: string;
  customerName: string;
  fee: number;
  metaData: {
    deviceType: string;
    ipAddress: string;
  };
  payableAmount: number;
  paymentMethod: PaymentMethod;
  paymentReference: string;
  paymentStatus: string;
  transactionReference: string;
};

export type MonnifyCancelledResponse = {
  authorizedAmount: number;
  paymentStatus: string;
  redirectUrl: string | null;
  responseCode: string;
  responseMessage: string;
};

export type RNMonnifyProps = {
  amount: number;
  currency?: Currency;
  reference?: string;
  customerFullName: string;
  customerEmail: string;
  apiKey: string;
  contractCode: string;
  paymentDescription?: string;
  autoStart?: boolean;
};

export type MonnifyCheckoutRequestData = RNMonnifyProps & {
  metadata: {
    deviceType: string;
  };
  onComplete: (response: MonnifySuccessResponse) => {};
  onClose: (response: MonnifyCancelledResponse) => {};
};

export interface RNMonnifyRef {
  startTransaction: () => void;
  endTransaction: () => void;
}
