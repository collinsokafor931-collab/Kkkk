export interface ProductOption {
  name: string; // e.g. "Color", "Size", "Hardware Finish", "Material"
  values: string[];
  default: string;
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: 'home' | 'accessories' | 'kitchen' | 'solar' | 'appliances' | 'all' | string;
  price: number;
  shippingFee?: number;
  marketPrice?: number;
  originalAssetFilename?: string;
  slotNumber?: number;
  rawPriceText?: string;
  priceTagDetected?: boolean;
  isCustomUploaded?: boolean;
  depositPercentage: number; // e.g. 30% deposit
  images: string[];
  description: string;
  details: string[];
  specifications: Record<string, string>;
  options: ProductOption[];
  preOrderStatus: {
    batchName: string; // e.g. "VIP Batch IV"
    isOpen: boolean;
    slotsTotal: number;
    slotsClaimed: number;
    estimatedDispatchDate: string; // e.g. "Nov 15 - Nov 28, 2026"
    preOrderClosingDate: string; // e.g. "Sept 30, 2026"
    productionStage: 'Pre-order Open' | 'Sourcing & Handcrafting' | 'Quality & Hallmarking' | 'Dispatched';
  };
  featured?: boolean;
  isNewDrop?: boolean;
}

export interface CartItem {
  id: string; // unique item uuid (productId + options stringified)
  product: Product;
  selectedOptions: Record<string, string>;
  monogramText?: string;
  quantity: number;
  payDepositOnly: boolean;
}

export interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  vipClubNumber?: string;
  contactPreference: 'email' | 'phone' | 'whatsapp';
}

export interface DeliveryInfo {
  address: string;
  suite?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  deliveryMethod: 'complimentary' | 'white-glove' | 'private-vault';
  specialInstructions?: string;
}

export interface PreOrder {
  orderNumber: string;
  createdAt: string;
  customer: CustomerInfo;
  delivery: DeliveryInfo;
  items: CartItem[];
  subtotal: number;
  depositAmount: number;
  balanceDueOnDispatch: number;
  shippingFee: number;
  total: number;
  status: 'Confirmed' | 'Crafting' | 'Quality Review' | 'Dispatched' | 'Delivered';
  estimatedFulfillment: string;
}
