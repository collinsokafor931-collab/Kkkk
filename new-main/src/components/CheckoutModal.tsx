import React, { useState } from 'react';
import { X, Check, ArrowRight, ArrowLeft, ShieldCheck, Clock, User, MapPin, FileText, Sparkles, AlertCircle, Truck } from 'lucide-react';
import { CartItem, CustomerInfo, DeliveryInfo, PreOrder } from '../types';
import { OriginalProductImage } from './OriginalProductImage';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderCompleted: (order: PreOrder) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderCompleted,
}) => {
  if (!isOpen) return null;

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Step 1: Customer Information
  const [customer, setCustomer] = useState<CustomerInfo>({
    fullName: '',
    email: '',
    phone: '',
    vipClubNumber: '',
    contactPreference: 'email',
  });

  // Step 2: Delivery Information
  const [delivery, setDelivery] = useState<DeliveryInfo>({
    address: '',
    suite: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Nigeria',
    deliveryMethod: 'white-glove',
    specialInstructions: '',
  });

  // Terms agreement in Step 3
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Financial calculations
  const fullRetailSubtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalDueToday = items.reduce((sum, item) => {
    const unitPrice = item.product.price;
    const depositUnit = Math.round(unitPrice * (item.product.depositPercentage / 100));
    const effectiveUnitPrice = item.payDepositOnly ? depositUnit : unitPrice;
    return sum + effectiveUnitPrice * item.quantity;
  }, 0);
  const balanceDueOnDispatch = fullRetailSubtotal - totalDueToday;
  const shippingFee = delivery.deliveryMethod === 'private-vault'
    ? 0
    : items.reduce((sum, it) => sum + (it.product.shippingFee || 0) * it.quantity, 0);
  const finalChargeToday = totalDueToday + shippingFee;

  // Validation
  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!customer.fullName.trim()) errs.fullName = 'Please provide your full legal name';
    if (!customer.email.trim() || !customer.email.includes('@')) errs.email = 'A valid VIP contact email is required';
    if (!customer.phone.trim() || customer.phone.length < 7) errs.phone = 'Phone number is required for courier dispatch notifications';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (!delivery.address.trim()) errs.address = 'Street address is required';
    if (!delivery.city.trim()) errs.city = 'City is required';
    if (!delivery.state.trim()) errs.state = 'State / Region is required';
    if (!delivery.postalCode.trim()) errs.postalCode = 'Postal / Zip code is required';
    if (!delivery.country.trim()) errs.country = 'Country is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep1()) setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validateStep2()) setCurrentStep(3);
    }
  };

  const handleSubmitPreOrder = () => {
    if (!agreedToTerms) {
      setErrors({ terms: 'Please acknowledge the pre-order dispatch & artisanal timeline terms' });
      return;
    }

    setIsSubmitting(true);

    // Generate unique order number (e.g. SVS-VIP-83921)
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `SVS-VIP-${randomNum}`;

    const newOrder: PreOrder = {
      orderNumber,
      createdAt: new Date().toISOString(),
      customer,
      delivery,
      items,
      subtotal: fullRetailSubtotal,
      depositAmount: totalDueToday,
      balanceDueOnDispatch,
      shippingFee,
      total: finalChargeToday,
      status: 'Confirmed',
      estimatedFulfillment: items[0]?.product.preOrderStatus.estimatedDispatchDate || 'Autumn 2026 Batch',
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onOrderCompleted(newOrder);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl my-auto bg-[#fdfcfb] border border-stone-300 rounded-2xl shadow-2xl text-stone-900 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header with Step Indicator */}
        <div className="p-6 border-b border-stone-200 bg-[#f5f3ee] flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#946e1c] font-semibold">
              Shantel Variety Shop • VIP Pre-Order Reservation
            </span>
            <h3 className="font-serif text-xl text-stone-900 font-normal">
              {currentStep === 1 && 'Step 1 — Customer Information'}
              {currentStep === 2 && 'Step 2 — Delivery & White-Glove Options'}
              {currentStep === 3 && 'Step 3 — Order Review & Confirmation'}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-200/60 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progression Bar */}
        <div className="px-6 py-3 bg-[#f8f7f4] border-b border-stone-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep >= 1 ? 'bg-stone-900 text-white' : 'bg-stone-200 text-stone-500'
              }`}
            >
              1
            </span>
            <span className={currentStep === 1 ? 'text-stone-900 font-semibold' : 'text-stone-500'}>
              Client Details
            </span>
          </div>

          <div className="h-[1px] w-12 bg-stone-300 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep >= 2 ? 'bg-stone-900 text-white' : 'bg-stone-200 text-stone-500'
              }`}
            >
              2
            </span>
            <span className={currentStep === 2 ? 'text-stone-900 font-semibold' : 'text-stone-500'}>
              Delivery Protocol
            </span>
          </div>

          <div className="h-[1px] w-12 bg-stone-300 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep === 3 ? 'bg-stone-900 text-white' : 'bg-stone-200 text-stone-500'
              }`}
            >
              3
            </span>
            <span className={currentStep === 3 ? 'text-stone-900 font-semibold' : 'text-stone-500'}>
              Review & Submit
            </span>
          </div>
        </div>

        {/* Main Content Form */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {/* STEP 1: CUSTOMER INFORMATION */}
          {currentStep === 1 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="p-4 rounded-xl bg-[#f8f7f4] border border-stone-200 text-xs text-stone-700 flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-[#946e1c] shrink-0" />
                <span>
                  Your contact details ensure personalized dispatch alerts, private atelier updates, and direct access to your personal concierge.
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-700 mb-1.5 font-medium">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Eleanor Vance"
                    value={customer.fullName}
                    onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-stone-300 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#946e1c]"
                  />
                  {errors.fullName && <p className="text-red-600 text-xs mt-1">{errors.fullName}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-700 mb-1.5 font-medium">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      placeholder="client@luxury.com"
                      value={customer.email}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-stone-300 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#946e1c]"
                    />
                    {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-700 mb-1.5 font-medium">
                      Mobile Telephone *
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-stone-300 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#946e1c]"
                    />
                    {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-700 mb-1.5 font-medium">
                    VIP Member Number (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. SVS-VIP-0428"
                    value={customer.vipClubNumber || ''}
                    onChange={(e) => setCustomer({ ...customer, vipClubNumber: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-stone-300 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#946e1c]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-700 mb-1.5 font-medium">
                    Preferred Concierge Channel
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['email', 'phone', 'whatsapp'] as const).map((ch) => (
                      <button
                        key={ch}
                        type="button"
                        onClick={() => setCustomer({ ...customer, contactPreference: ch })}
                        className={`py-2 px-3 rounded-lg text-xs uppercase tracking-wider transition-all cursor-pointer ${
                          customer.contactPreference === ch
                            ? 'bg-[#946e1c] text-white font-semibold shadow-sm'
                            : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-300 hover:bg-stone-50'
                        }`}
                      >
                        {ch}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: DELIVERY INFORMATION */}
          {currentStep === 2 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-700 mb-1.5 font-medium">
                    Delivery Street Address *
                  </label>
                  <input
                    type="text"
                    placeholder="100 Luxury Boulevard"
                    value={delivery.address}
                    onChange={(e) => setDelivery({ ...delivery, address: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-stone-300 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#946e1c]"
                  />
                  {errors.address && <p className="text-red-600 text-xs mt-1">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-700 mb-1.5 font-medium">
                      Apartment / Suite / Villa (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Penthouse A"
                      value={delivery.suite || ''}
                      onChange={(e) => setDelivery({ ...delivery, suite: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-stone-300 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#946e1c]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-700 mb-1.5 font-medium">
                      City *
                    </label>
                    <input
                      type="text"
                      placeholder="New York"
                      value={delivery.city}
                      onChange={(e) => setDelivery({ ...delivery, city: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-stone-300 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#946e1c]"
                    />
                    {errors.city && <p className="text-red-600 text-xs mt-1">{errors.city}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-700 mb-1.5 font-medium">
                      State / Province *
                    </label>
                    <input
                      type="text"
                      placeholder="NY"
                      value={delivery.state}
                      onChange={(e) => setDelivery({ ...delivery, state: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-stone-300 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#946e1c]"
                    />
                    {errors.state && <p className="text-red-600 text-xs mt-1">{errors.state}</p>}
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-700 mb-1.5 font-medium">
                      Postal / ZIP Code *
                    </label>
                    <input
                      type="text"
                      placeholder="10021"
                      value={delivery.postalCode}
                      onChange={(e) => setDelivery({ ...delivery, postalCode: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-stone-300 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#946e1c]"
                    />
                    {errors.postalCode && <p className="text-red-600 text-xs mt-1">{errors.postalCode}</p>}
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-700 mb-1.5 font-medium">
                      Country *
                    </label>
                    <input
                      type="text"
                      placeholder="United States"
                      value={delivery.country}
                      onChange={(e) => setDelivery({ ...delivery, country: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-stone-300 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#946e1c]"
                    />
                    {errors.country && <p className="text-red-600 text-xs mt-1">{errors.country}</p>}
                  </div>
                </div>

                {/* Delivery Method Selection */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-700 mb-2 font-medium">
                    Dispatch & Logistics Method
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setDelivery({ ...delivery, deliveryMethod: 'white-glove' })}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        delivery.deliveryMethod === 'white-glove'
                          ? 'border-[#946e1c] bg-[#fbf9f4] text-stone-900 shadow-sm'
                          : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                      }`}
                    >
                      <span className="block font-semibold text-xs text-stone-900">Doorstep Delivery</span>
                      <span className="text-[11px] text-stone-500 block mt-0.5">Nationwide door delivery across all 36 states & FCT</span>
                      <span className="text-[10px] text-[#946e1c] font-semibold mt-1 block">
                        {shippingFee === 0 ? 'Free Shipping' : `₦${shippingFee.toLocaleString()}`}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDelivery({ ...delivery, deliveryMethod: 'complimentary' })}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        delivery.deliveryMethod === 'complimentary'
                          ? 'border-[#946e1c] bg-[#fbf9f4] text-stone-900 shadow-sm'
                          : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                      }`}
                    >
                      <span className="block font-semibold text-xs text-stone-900">Park / Interstate Waybill</span>
                      <span className="text-[11px] text-stone-500 block mt-0.5">Reliable interstate park waybill delivery with tracking</span>
                      <span className="text-[10px] text-[#946e1c] font-semibold mt-1 block">
                        {shippingFee === 0 ? 'Free Shipping' : `₦${shippingFee.toLocaleString()}`}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDelivery({ ...delivery, deliveryMethod: 'private-vault' })}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        delivery.deliveryMethod === 'private-vault'
                          ? 'border-[#946e1c] bg-[#fbf9f4] text-stone-900 shadow-sm'
                          : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                      }`}
                    >
                      <span className="block font-semibold text-xs text-stone-900">Store / Hub Pickup</span>
                      <span className="text-[11px] text-stone-500 block mt-0.5">Pick up directly from Shantel Variety Shop location</span>
                      <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">Free Pickup (₦0)</span>
                    </button>
                  </div>
                </div>

                {/* Special instructions */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-700 mb-1.5 font-medium">
                    Special Delivery Instructions or Gate Codes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Ring concierge desk on arrival, discrete packaging requested"
                    value={delivery.specialInstructions || ''}
                    onChange={(e) => setDelivery({ ...delivery, specialInstructions: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-stone-300 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#946e1c]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: ORDER REVIEW & PRE-ORDER TERMS */}
          {currentStep === 3 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              {/* Product Summaries */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase tracking-wider text-stone-600 font-medium">
                  Reserved Items Summary ({items.length})
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-lg bg-white border border-stone-200 flex items-center justify-between text-xs shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-14 rounded overflow-hidden bg-[#faf8f5] border border-stone-200 shrink-0">
                          <OriginalProductImage
                            src={item.product.images[0]}
                            alt={item.product.name}
                            originalFilename={item.product.originalAssetFilename}
                            objectFit="cover"
                            className="w-full h-full"
                          />
                        </div>
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-[#946e1c] font-semibold block">
                            {item.product.preOrderStatus.batchName}
                          </span>
                          <span className="font-serif text-stone-900 font-medium block">
                            {item.product.name}
                          </span>
                          <span className="text-[11px] text-stone-500">
                            Qty: {item.quantity} • {item.payDepositOnly ? `${item.product.depositPercentage}% Deposit` : 'Paid In Full'}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-serif text-sm text-stone-900 font-semibold block">
                          ₦{(item.payDepositOnly
                            ? Math.round(item.product.price * (item.product.depositPercentage / 100)) * item.quantity
                            : item.product.price * item.quantity
                          ).toLocaleString()}
                        </span>
                        <span className="text-[10px] text-stone-500">
                          Est. {item.product.preOrderStatus.estimatedDispatchDate}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery and Customer recap */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-[#f8f7f4] border border-stone-200">
                  <span className="text-[10px] uppercase tracking-wider text-stone-500 block mb-1 font-medium">
                    Client Contact
                  </span>
                  <p className="text-stone-900 font-medium">{customer.fullName}</p>
                  <p className="text-stone-600">{customer.email}</p>
                  <p className="text-stone-600">{customer.phone}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#f8f7f4] border border-stone-200">
                  <span className="text-[10px] uppercase tracking-wider text-stone-500 block mb-1 font-medium">
                    Delivery Address
                  </span>
                  <p className="text-stone-900 font-medium">
                    {delivery.address} {delivery.suite && `(${delivery.suite})`}
                  </p>
                  <p className="text-stone-600">
                    {delivery.city}, {delivery.state} {delivery.postalCode}, {delivery.country}
                  </p>
                  <p className="text-[#946e1c] text-[11px] mt-0.5 font-medium">Method: {delivery.deliveryMethod.toUpperCase()}</p>
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="p-4 rounded-xl bg-[#fbf9f4] border border-[#946e1c]/35 space-y-2 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Total Pre-Order Retail Value</span>
                  <span className="text-stone-900 font-medium">₦{fullRetailSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Logistics & Handling</span>
                  <span className={shippingFee === 0 ? "text-emerald-700 font-semibold" : "text-stone-900 font-medium"}>
                    {shippingFee === 0 ? "COMPLIMENTARY (₦0)" : `₦${shippingFee.toLocaleString()}`}
                  </span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between text-stone-900 font-semibold text-sm">
                  <span className="text-[#946e1c]">Deposit / Pre-Payment Due Today</span>
                  <span className="font-serif text-lg text-[#946e1c] font-bold">₦{finalChargeToday.toLocaleString()}</span>
                </div>
                {balanceDueOnDispatch > 0 && (
                  <p className="text-[11px] text-stone-500 text-right">
                    Remaining balance of <strong className="text-stone-800">₦{balanceDueOnDispatch.toLocaleString()}</strong> will be requested prior to dispatch inspection.
                  </p>
                )}
              </div>

              {/* Pre-Order Terms Agreement Checkbox */}
              <div className="p-4 rounded-xl bg-[#f8f7f4] border border-stone-300 space-y-2">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-stone-400 text-[#946e1c] focus:ring-[#946e1c] bg-white cursor-pointer"
                  />
                  <span className="text-xs text-stone-700 leading-relaxed">
                    I understand that this is an exclusive <strong>PRE-ORDER RESERVATION</strong>. Items are handcrafted according to stated batch timelines. 
                    I agree to the Shantel Variety Shop pre-order policy and understand full fulfillment updates will be delivered via email and phone.
                  </span>
                </label>
                {errors.terms && <p className="text-red-600 text-xs mt-1 pl-7">{errors.terms}</p>}
              </div>
            </div>
          )}
        </div>

        {/* Footer with Controls */}
        <div className="p-6 border-t border-stone-200 bg-[#f5f3ee] flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              onClick={() => setCurrentStep((prev) => (prev - 1) as 1 | 2)}
              className="px-5 py-3 rounded-xl border border-stone-300 hover:bg-stone-100 text-xs uppercase tracking-wider text-stone-700 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-5 py-3 text-xs uppercase tracking-wider text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}

          {currentStep < 3 ? (
            <button
              onClick={handleNext}
              className="px-8 py-3.5 bg-stone-900 hover:bg-black text-white font-bold text-xs uppercase tracking-[0.2em] rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4 text-[#e5c07b]" />
            </button>
          ) : (
            <button
              onClick={handleSubmitPreOrder}
              disabled={isSubmitting}
              id="submit-preorder-btn"
              className="px-8 py-4 bg-stone-900 hover:bg-black text-white font-bold text-xs uppercase tracking-[0.25em] rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>SECURING ALLOCATION...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#e5c07b]" />
                  <span>CONFIRM PRE-ORDER</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
