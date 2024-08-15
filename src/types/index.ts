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
  onSuccess: (response: MonnifyWebViewMessage) => void;
  onCancel: () => void;
  ref: React.ReactElement;
};

export type MonnifyCheckoutRequestData = RNMonnifyProps & {
  metadata: {
    deviceType: string;
  };
};

export type RNMonnifyRef = {
  startTransaction: () => void;
};

export type MonnifyWebViewMessage = {
  status: 'success' | 'failed';
  data: MonnifySuccessResponse | MonnifyCancelledResponse;
};
