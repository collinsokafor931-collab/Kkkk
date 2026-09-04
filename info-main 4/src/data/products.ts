import { Product } from '../types';

const INITIAL_15_PRODUCTS: Product[] = [
  {
    id: 'svs-slot-1',
    slotNumber: 1,
    name: 'Double-Headed Water Ripple & Sunset Ambient Lamp',
    subtitle: 'Dual Projection Heads • Sunset Glow & Dreamy Water Ripple Lighting',
    category: 'home',
    price: 10000,
    rawPriceText: '₦10,000',
    shippingFee: 4000,
    originalAssetFilename: 'IMG-20260830-WA0038.jpg',
    depositPercentage: 50,
    images: ['/products/IMG-20260830-WA0038.jpg'],
    description: 'Give your room that soft, dreamy Pinterest and TikTok aesthetic! Perfect for your bedroom, living room, bedside, or content creation corner. Creates a beautiful ripple & sunset-style projection glow.',
    details: [
      'Dual optical heads: Sunset atmospheric glow + Dynamic water ripple projection',
      'Standing tall metal stem with multi-angle swivel head articulation',
      'Pre-order Price: ₦10,000 | Shipping: ₦4,000 | Total: ₦14,000',
      'Energy efficient low-heat LED emitter with standard plug-in adapter'
    ],
    specifications: {
      'Lighting Effects': 'Dual Sunset Golden Glow & Water Ripple Refraction',
      'Mounting': 'Floor Standing Stem / Bedside Accent',
      'Input Power': 'Standard AC 220V with DC Adapter',
      'Pre-Order Price': '₦10,000',
      'Shipping Fee': '₦4,000',
      'Total Landed Cost': '₦14,000'
    },
    options: [
      {
        name: 'Stem Finish',
        values: ['Atelier Warm Gold', 'Modern Matte Black'],
        default: 'Atelier Warm Gold'
      }
    ],
    preOrderStatus: {
      batchName: 'Air Cargo Fast Allocation',
      isOpen: true,
      slotsTotal: 40,
      slotsClaimed: 29,
      estimatedDispatchDate: 'Sept 20 — Oct 02, 2026',
      preOrderClosingDate: 'Sept 15, 2026',
      productionStage: 'Pre-order Open'
    },
    featured: true,
    isNewDrop: true
  },
  {
    id: 'svs-slot-2',
    slotNumber: 2,
    name: 'Shark Claw Clip — Pearl Mermaid Tail (~9cm)',
    subtitle: 'Lustrous Pearl Inlay • High-Tension Golden Spring • Zero Shipping Fee',
    category: 'accessories',
    price: 500,
    rawPriceText: '₦500',
    shippingFee: 0,
    originalAssetFilename: 'IMG-20260830-WA0039.jpg',
    depositPercentage: 100,
    images: ['/products/IMG-20260830-WA0039.jpg'],
    description: 'Simple, classy & perfect for everyday styling. Features iridescent pearls set along a sweeping mermaid-tail curve.',
    details: [
      'Preorder Price: ₦500 per piece — 100% Free Shipping',
      'Reinforced golden alloy spring for strong all-day hold',
      'Wholesale packs and reseller bundles available'
    ],
    specifications: {
      'Length': 'Approx. 9cm',
      'Style': 'Pearl Mermaid Tail',
      'Shipping Fee': '₦0 (FREE)'
    },
    options: [
      {
        name: 'Pack Order',
        values: ['Single Clip (₦500)', 'Pack of 5 Assorted (₦2,500)', 'Reseller Starter 10-Pack (₦5,000)'],
        default: 'Single Clip (₦500)'
      }
    ],
    preOrderStatus: {
      batchName: 'Weekly Express Air Drop',
      isOpen: true,
      slotsTotal: 150,
      slotsClaimed: 112,
      estimatedDispatchDate: 'Sept 18 — Sept 25, 2026',
      preOrderClosingDate: 'Sept 12, 2026',
      productionStage: 'Pre-order Open'
    },
    featured: true,
    isNewDrop: true
  },
  {
    id: 'svs-slot-3',
    slotNumber: 3,
    name: 'Shark Claw Clip — Crystal Rhinestone Pavé',
    subtitle: 'Brilliant Pavé Rhinestones • Evening & Bridal Glamour',
    category: 'accessories',
    price: 500,
    rawPriceText: '₦500',
    shippingFee: 0,
    originalAssetFilename: 'IMG-20260830-WA0040.jpg',
    depositPercentage: 100,
    images: ['/products/IMG-20260830-WA0040.jpg'],
    description: 'Dazzling rhinestone pavé claw clip that catches the light from every angle. Ideal for weddings, dinners, and everyday elevation.',
    details: [
      'Preorder Price: ₦500 per piece — Free Shipping',
      'Hand-set micro-pavé crystals with anti-snag smooth back',
      'Non-slip grip teeth'
    ],
    specifications: {
      'Length': 'Approx. 9cm',
      'Finish': 'Faceted Rhinestone Pavé',
      'Shipping': 'Free Nationwide'
    },
    options: [
      {
        name: 'Pack Order',
        values: ['Single Clip (₦500)', 'Pack of 5 Assorted (₦2,500)', 'Reseller 10-Pack (₦5,000)'],
        default: 'Single Clip (₦500)'
      }
    ],
    preOrderStatus: {
      batchName: 'Weekly Express Air Drop',
      isOpen: true,
      slotsTotal: 100,
      slotsClaimed: 74,
      estimatedDispatchDate: 'Sept 18 — Sept 25, 2026',
      preOrderClosingDate: 'Sept 12, 2026',
      productionStage: 'Pre-order Open'
    }
  },
  {
    id: 'svs-slot-4',
    slotNumber: 4,
    name: 'Shark Claw Clip — Matte Nude S-Wave Aesthetic',
    subtitle: 'Velvety Soft-Touch Matte • Minimalist S-Wave Curve',
    category: 'accessories',
    price: 500,
    rawPriceText: '₦500',
    shippingFee: 0,
    originalAssetFilename: 'IMG-20260830-WA0041.jpg',
    depositPercentage: 100,
    images: ['/products/IMG-20260830-WA0041.jpg'],
    description: 'Ultra-modern matte nude aesthetic clip with clean fluid curves. The quintessential everyday hair accessory.',
    details: [
      'Matte soft-touch finish with ergonomic squeeze handle',
      'Preorder Price: ₦500 — Free Shipping'
    ],
    specifications: {
      'Material': 'Resilient Matte Acrylic Polymer',
      'Length': '9.2cm'
    },
    options: [
      {
        name: 'Quantity',
        values: ['Single Clip (₦500)', 'Pack of 5 (₦2,500)', 'Reseller 10-Pack (₦5,000)'],
        default: 'Single Clip (₦500)'
      }
    ],
    preOrderStatus: {
      batchName: 'Weekly Express Air Drop',
      isOpen: true,
      slotsTotal: 80,
      slotsClaimed: 45,
      estimatedDispatchDate: 'Sept 18 — Sept 25, 2026',
      preOrderClosingDate: 'Sept 12, 2026',
      productionStage: 'Pre-order Open'
    }
  },
  {
    id: 'svs-slot-5',
    slotNumber: 5,
    name: 'Shark Claw Clip — Amber Tortoiseshell Heart (In Hair)',
    subtitle: 'Rich Amber Resin • Elegant Heart Silhouette in Updo',
    category: 'accessories',
    price: 500,
    rawPriceText: '₦500',
    shippingFee: 0,
    originalAssetFilename: 'IMG-20260830-WA0042.jpg',
    depositPercentage: 100,
    images: ['/products/IMG-20260830-WA0042.jpg'],
    description: 'Warm amber tones and classic tortoiseshell grain, beautifully styled in a half-up twist.',
    details: [
      'Glossy hand-polished tortoiseshell resin',
      'Preorder Price: ₦500 — Free Shipping'
    ],
    specifications: { 'Length': '8.8cm', 'Finish': 'Warm Amber Tortoise' },
    options: [
      {
        name: 'Pack Order',
        values: ['Single Clip (₦500)', 'Pack of 5 (₦2,500)'],
        default: 'Single Clip (₦500)'
      }
    ],
    preOrderStatus: {
      batchName: 'Weekly Express Air Drop',
      isOpen: true,
      slotsTotal: 90,
      slotsClaimed: 60,
      estimatedDispatchDate: 'Sept 18 — Sept 25, 2026',
      preOrderClosingDate: 'Sept 12, 2026',
      productionStage: 'Pre-order Open'
    }
  },
  {
    id: 'svs-slot-6',
    slotNumber: 6,
    name: 'Shark Claw Clip — Amber Heart in Box Display',
    subtitle: 'Collector Presentation Box • Gift-Ready Packaging',
    category: 'accessories',
    price: 500,
    rawPriceText: '₦500',
    shippingFee: 0,
    originalAssetFilename: 'IMG-20260830-WA0043.jpg',
    depositPercentage: 100,
    images: ['/products/IMG-20260830-WA0043.jpg'],
    description: 'Shown in its protective boutique packaging. Ready for gifting or retail shelf presentation.',
    details: ['Preorder Price: ₦500 per piece', 'Individual cellophane or carton display presentation'],
    specifications: { 'Packaging': 'Individual Boutique Pack', 'Length': '8.8cm' },
    options: [{ name: 'Quantity', values: ['Single (₦500)', 'Wholesale 10-Pack (₦5,000)'], default: 'Single (₦500)' }],
    preOrderStatus: {
      batchName: 'Weekly Express Air Drop',
      isOpen: true,
      slotsTotal: 60,
      slotsClaimed: 38,
      estimatedDispatchDate: 'Sept 18 — Sept 25, 2026',
      preOrderClosingDate: 'Sept 12, 2026',
      productionStage: 'Pre-order Open'
    }
  },
  {
    id: 'svs-slot-7',
    slotNumber: 7,
    name: 'Shark Claw Clip — Matte Espresso Chocolate Square',
    subtitle: 'Deep Cocoa Brown • Clean Geometric Profile',
    category: 'accessories',
    price: 500,
    rawPriceText: '₦500',
    shippingFee: 0,
    originalAssetFilename: 'IMG-20260830-WA0044.jpg',
    depositPercentage: 100,
    images: ['/products/IMG-20260830-WA0044.jpg'],
    description: 'Sleek geometric square clip in rich espresso brown. Perfect match for earthy wardrobes.',
    details: ['Modern flat-back silhouette', 'Strong grip for medium to thick hair'],
    specifications: { 'Color': 'Matte Espresso Chocolate', 'Length': '9.0cm' },
    options: [{ name: 'Quantity', values: ['Single (₦500)', 'Pack of 5 (₦2,500)'], default: 'Single (₦500)' }],
    preOrderStatus: {
      batchName: 'Weekly Express Air Drop',
      isOpen: true,
      slotsTotal: 80,
      slotsClaimed: 52,
      estimatedDispatchDate: 'Sept 18 — Sept 25, 2026',
      preOrderClosingDate: 'Sept 12, 2026',
      productionStage: 'Pre-order Open'
    }
  },
  {
    id: 'svs-slot-8',
    slotNumber: 8,
    name: 'Shark Claw Clip — Translucent Cream Dual Heart',
    subtitle: 'Milky Translucent Finish • Dual Heart Embellishment',
    category: 'accessories',
    price: 500,
    rawPriceText: '₦500',
    shippingFee: 0,
    originalAssetFilename: 'IMG-20260830-WA0045.jpg',
    depositPercentage: 100,
    images: ['/products/IMG-20260830-WA0045.jpg'],
    description: 'Delicate milky translucent resin with dual heart cutouts. Feminine and graceful.',
    details: ['High tensile spring', 'Smooth edge teeth to protect hair shafts'],
    specifications: { 'Finish': 'Translucent Cream Milk', 'Length': '8.5cm' },
    options: [{ name: 'Quantity', values: ['Single (₦500)', 'Pack of 5 (₦2,500)'], default: 'Single (₦500)' }],
    preOrderStatus: {
      batchName: 'Weekly Express Air Drop',
      isOpen: true,
      slotsTotal: 75,
      slotsClaimed: 41,
      estimatedDispatchDate: 'Sept 18 — Sept 25, 2026',
      preOrderClosingDate: 'Sept 12, 2026',
      productionStage: 'Pre-order Open'
    }
  },
  {
    id: 'svs-slot-9',
    slotNumber: 9,
    name: 'Shark Claw Clip — Ivory Matte Twisted Loop',
    subtitle: 'Nordic Infinity Twist • Creamy Ivory Matte Texture',
    category: 'accessories',
    price: 500,
    rawPriceText: '₦500',
    shippingFee: 0,
    originalAssetFilename: 'IMG-20260830-WA0046.jpg',
    depositPercentage: 100,
    images: ['/products/IMG-20260830-WA0046.jpg'],
    description: 'A sculptural infinity loop motif in warm ivory matte. Elegant minimalism.',
    details: ['Soft matte feel', 'All-day non-slip grip'],
    specifications: { 'Color': 'Warm Ivory Matte', 'Length': '9.4cm' },
    options: [{ name: 'Quantity', values: ['Single (₦500)', 'Pack of 5 (₦2,500)'], default: 'Single (₦500)' }],
    preOrderStatus: {
      batchName: 'Weekly Express Air Drop',
      isOpen: true,
      slotsTotal: 70,
      slotsClaimed: 49,
      estimatedDispatchDate: 'Sept 18 — Sept 25, 2026',
      preOrderClosingDate: 'Sept 12, 2026',
      productionStage: 'Pre-order Open'
    }
  },
  {
    id: 'svs-slot-10',
    slotNumber: 10,
    name: 'Shark Claw Clip — Plush White Sherpa Fur',
    subtitle: 'Cozy Fuzzy Winter Texture • Statement Bouclé Sherpa',
    category: 'accessories',
    price: 500,
    rawPriceText: '₦500',
    shippingFee: 0,
    originalAssetFilename: 'IMG-20260830-WA0047.jpg',
    depositPercentage: 100,
    images: ['/products/IMG-20260830-WA0047.jpg'],
    description: 'Fluffy white sherpa fur wrapped around a durable claw clip. Cute, soft, and trendy.',
    details: ['Ultra-soft faux shearling wrap', 'Sturdy hidden acrylic core'],
    specifications: { 'Texture': 'Plush White Faux Sherpa', 'Length': '9.5cm' },
    options: [{ name: 'Quantity', values: ['Single (₦500)', 'Pack of 5 (₦2,500)'], default: 'Single (₦500)' }],
    preOrderStatus: {
      batchName: 'Weekly Express Air Drop',
      isOpen: true,
      slotsTotal: 90,
      slotsClaimed: 68,
      estimatedDispatchDate: 'Sept 18 — Sept 25, 2026',
      preOrderClosingDate: 'Sept 12, 2026',
      productionStage: 'Pre-order Open'
    }
  },
  {
    id: 'svs-slot-11',
    slotNumber: 11,
    name: 'Silver Crest 6L Intelligent Air Fryer (Black & Gold)',
    subtitle: 'Extra Large 6L Capacity • 2400W High Power • LCD Touchscreen',
    category: 'kitchen',
    price: 20000,
    rawPriceText: '₦20,000',
    shippingFee: 5000,
    originalAssetFilename: 'IMG-20260830-WA0048.jpg',
    depositPercentage: 50,
    images: ['/products/IMG-20260830-WA0048.jpg'],
    description: 'Factory direct pre-order price! Rapid 360-degree hot air circulation for crispy chicken, pastries, and roasts with zero oil.',
    details: [
      'Model: Silver Crest S-18 Extra Large Capacity Air Fryer',
      '2400 Watts high-efficiency heating element with intelligent digital thermostat',
      'Pre-order Price: ₦20,000 | Shipping: ₦5,000 | Total: ₦25,000',
      'Non-stick easy-clean pull-out fry basket'
    ],
    specifications: {
      'Model': 'Silver Crest S-18',
      'Capacity': '6.0 Litres Extra Large',
      'Rated Power': '2400W High Performance',
      'Pre-Order Price': '₦20,000',
      'Shipping Fee': '₦5,000'
    },
    options: [{ name: 'Trim Color', values: ['Gloss Obsidian with Rose Bronze'], default: 'Gloss Obsidian with Rose Bronze' }],
    preOrderStatus: {
      batchName: 'Air Cargo Fast Allocation',
      isOpen: true,
      slotsTotal: 30,
      slotsClaimed: 18,
      estimatedDispatchDate: 'Sept 22 — Oct 05, 2026',
      preOrderClosingDate: 'Sept 16, 2026',
      productionStage: 'Pre-order Open'
    },
    featured: true
  },
  {
    id: 'svs-slot-12',
    slotNumber: 12,
    name: 'Silver Crest 2-in-1 Heavy Duty Commercial Blender (4500W)',
    subtitle: '4500W Pure Copper Motor • Unbreakable Pitcher + Dry Spice Grinder',
    category: 'kitchen',
    price: 28000,
    rawPriceText: '₦28,000',
    shippingFee: 5000,
    originalAssetFilename: 'IMG-20260830-WA0049.jpg',
    depositPercentage: 50,
    images: ['/products/IMG-20260830-WA0049.jpg'],
    description: 'Blends beans, tough tiger nuts, ice cubes, dry spices, and yam without struggling. Built like a commercial workhorse.',
    details: [
      'Blender + Dedicated Stainless Steel Dry Spice Grinder Cup included',
      '4500W German-standard pure copper winding motor with overload protection',
      'Pre-order Price: ₦28,000 | Shipping: ₦5,000 | Total: ₦33,000'
    ],
    specifications: {
      'Motor Power': '4500W Peak Surge Copper Motor',
      'Jar Capacity': '2.0 Litres Polycarbonate Unbreakable Jar',
      'Pre-Order Price': '₦28,000',
      'Shipping Fee': '₦5,000'
    },
    options: [{ name: 'Base Finish', values: ['Signal Vermilion Red', 'Deep Onyx Black'], default: 'Signal Vermilion Red' }],
    preOrderStatus: {
      batchName: 'Air Cargo Fast Allocation',
      isOpen: true,
      slotsTotal: 35,
      slotsClaimed: 24,
      estimatedDispatchDate: 'Sept 22 — Oct 05, 2026',
      preOrderClosingDate: 'Sept 16, 2026',
      productionStage: 'Pre-order Open'
    },
    featured: true
  },
  {
    id: 'svs-slot-13',
    slotNumber: 13,
    name: 'Bardefu 8-in-1 Culinary Workstation (9500W)',
    subtitle: 'Blender, Juicer, Meat Mincer, Food Processor & Multi-Grater Kit',
    category: 'kitchen',
    price: 65000,
    rawPriceText: '₦65,000',
    shippingFee: 8000,
    originalAssetFilename: 'IMG-20260830-WA0050.jpg',
    depositPercentage: 50,
    images: ['/products/IMG-20260830-WA0050.jpg'],
    description: 'The ultimate all-in-one kitchen machine! Replaces 8 different bulky appliances. Pure heavy-duty versatility.',
    details: [
      '8 Specialized Kitchen Attachments included in one master bundle',
      '9500W ultra high-torque drive base for effortless mincing and shredding',
      'Pre-order Price: ₦65,000 | Shipping: ₦8,000 | Total: ₦73,000'
    ],
    specifications: {
      'Peak Rating': '9500W Ultra High Output Motor',
      'Pre-Order Price': '₦65,000',
      'Shipping Fee': '₦8,000'
    },
    options: [{ name: 'Workstation Finish', values: ['Brushed Platinum Stainless Steel'], default: 'Brushed Platinum Stainless Steel' }],
    preOrderStatus: {
      batchName: 'Sea Freight Batch Express',
      isOpen: true,
      slotsTotal: 25,
      slotsClaimed: 16,
      estimatedDispatchDate: 'Oct 05 — Oct 20, 2026',
      preOrderClosingDate: 'Sept 20, 2026',
      productionStage: 'Pre-order Open'
    }
  },
  {
    id: 'svs-slot-14',
    slotNumber: 14,
    name: '12-inch Solar Emergency Rechargeable Fan Kit + 2 Bulbs',
    subtitle: 'Complete Off-Grid Kit • Solar Panel • 2 LED Bulbs • USB Phone Charger',
    category: 'solar',
    price: 48000,
    rawPriceText: '₦48,000',
    shippingFee: 6000,
    originalAssetFilename: 'IMG-20260830-WA0051.jpg',
    depositPercentage: 50,
    images: ['/products/IMG-20260830-WA0051.jpg'],
    description: 'Stay cool and powered up even during blackout! Complete solar emergency power package with long-lasting rechargeable battery.',
    details: [
      '12-inch high-velocity oscillating table fan with integrated night lamp',
      'High-efficiency solar photovoltaic panel with outdoor charging cable',
      '2 hanging LED bulbs with independent switches + 5V USB output port',
      'Pre-order Price: ₦48,000 | Shipping: ₦6,000 | Total: ₦54,000'
    ],
    specifications: {
      'Fan Blade Size': '12 Inches (300mm)',
      'Solar Panel': '9V Multi-crystalline Photovoltaic Module',
      'Lighting': '2 × DC 6V LED Hanging Bulbs',
      'Pre-Order Price': '₦48,000',
      'Shipping Fee': '₦6,000'
    },
    options: [{ name: 'Body Color', values: ['Pure White with Royal Blue Accents'], default: 'Pure White with Royal Blue Accents' }],
    preOrderStatus: {
      batchName: 'Air Cargo Fast Allocation',
      isOpen: true,
      slotsTotal: 40,
      slotsClaimed: 31,
      estimatedDispatchDate: 'Sept 22 — Oct 05, 2026',
      preOrderClosingDate: 'Sept 16, 2026',
      productionStage: 'Pre-order Open'
    },
    featured: true
  },
  {
    id: 'svs-slot-15',
    slotNumber: 15,
    name: '15KG Drum Steam Inverter Washing Machine & Dryer Combo',
    subtitle: 'Massive 15KG Wash / 10KG Dry • Direct Drive Steam Care Inverter',
    category: 'appliances',
    price: 420000,
    rawPriceText: '₦420,000',
    shippingFee: 100000,
    originalAssetFilename: 'IMG-20260830-WA0052.jpg',
    depositPercentage: 50,
    images: ['/products/IMG-20260830-WA0052.jpg'],
    description: 'Large family laundry perfection! 15KG wash capacity with 100% steam drying capability. Direct drive brushless inverter motor.',
    details: [
      'Wash Capacity: 15.0 KG | Dry Capacity: 10.0 KG (King-size duvets fit easily)',
      'High-temperature anti-allergy steam cycle kills 99.9% of bacteria',
      'Pre-order Price: ₦420,000 | Shipping: ₦100,000 | Total: ₦520,000'
    ],
    specifications: {
      'Wash Capacity': '15.0 Kilograms',
      'Drying Capacity': '10.0 Kilograms Full Condensing Dry',
      'Motor': 'Smart Direct Drive Brushless Inverter',
      'Pre-Order Price': '₦420,000',
      'Shipping Fee': '₦100,000'
    },
    options: [{ name: 'Color Finish', values: ['Graphite Dark Titanium Silver'], default: 'Graphite Dark Titanium Silver' }],
    preOrderStatus: {
      batchName: 'Container Cargo Allocation 40HQ',
      isOpen: true,
      slotsTotal: 15,
      slotsClaimed: 9,
      estimatedDispatchDate: 'Oct 28 — Nov 18, 2026',
      preOrderClosingDate: 'Sept 30, 2026',
      productionStage: 'Pre-order Open'
    },
    featured: true
  }
];

// Helper to generate categories systematically for slots 16 to 200
const CATEGORY_ROTATION: Array<'home' | 'accessories' | 'kitchen' | 'solar' | 'appliances'> = [
  'accessories',
  'kitchen',
  'home',
  'solar',
  'appliances',
];

// Generate Slots 16 to 200 to give the user exactly 200 slots
function generateAdditionalSpaces(): Product[] {
  const spaces: Product[] = [];
  for (let i = 16; i <= 200; i++) {
    const padded = String(i).padStart(3, '0');
    const cat = CATEGORY_ROTATION[(i - 16) % CATEGORY_ROTATION.length];
    
    let defaultPrice = 15000;
    let defaultShipping = 3000;
    if (cat === 'accessories') { defaultPrice = 3500; defaultShipping = 1000; }
    else if (cat === 'kitchen') { defaultPrice = 25000; defaultShipping = 4000; }
    else if (cat === 'solar') { defaultPrice = 38000; defaultShipping = 5000; }
    else if (cat === 'appliances') { defaultPrice = 95000; defaultShipping = 15000; }

    spaces.push({
      id: `svs-slot-${i}`,
      slotNumber: i,
      name: `Portfolio Space #${i}`,
      subtitle: 'Awaiting original file attachment • Price tag auto-detect enabled',
      category: cat,
      price: defaultPrice,
      rawPriceText: `₦${defaultPrice.toLocaleString()}`,
      shippingFee: defaultShipping,
      originalAssetFilename: `IMG-20260830-WA${padded}.jpg`,
      depositPercentage: 50,
      images: [`/products/Slot-${padded}.jpg`],
      description: `Original portfolio space #${i}. Attach your original photo to automatically read the price tag, title, and product specifications with zero AI tweaks.`,
      details: [
        `Portfolio Space #${i} of 200 Ready for Allocation`,
        'Price tag & typography auto-detected upon image attachment',
        'VIP Pre-Order direct factory procurement'
      ],
      specifications: {
        'Space Allocation': `Slot #${i} of 200`,
        'Status': 'Awaiting Original File',
        'Pre-Order Price': `₦${defaultPrice.toLocaleString()}`,
        'Estimated Deposit (50%)': `₦${Math.round(defaultPrice * 0.5).toLocaleString()}`
      },
      options: [
        {
          name: 'Allocation',
          values: ['Standard VIP Allocation', 'Express Direct Drop'],
          default: 'Standard VIP Allocation'
        }
      ],
      preOrderStatus: {
        batchName: `VIP Batch Drop ${Math.ceil(i / 20)}`,
        isOpen: true,
        slotsTotal: 40,
        slotsClaimed: 0,
        estimatedDispatchDate: 'Oct 15 — Nov 05, 2026',
        preOrderClosingDate: 'Sept 30, 2026',
        productionStage: 'Pre-order Open'
      },
      featured: false,
      isNewDrop: true
    });
  }
  return spaces;
}

export const SAMPLE_PRODUCTS: Product[] = [
  ...INITIAL_15_PRODUCTS,
  ...generateAdditionalSpaces()
];

export const CATEGORIES = [
  { id: 'all', label: 'All 200 Spaces' },
  { id: 'attached', label: 'Photo Attached' },
  { id: 'pending', label: 'Awaiting Photo' },
  { id: 'home', label: 'Ambient & Home' },
  { id: 'accessories', label: 'Fashion & Jewelry' },
  { id: 'kitchen', label: 'Kitchen & Dining' },
  { id: 'solar', label: 'Solar & Power' },
  { id: 'appliances', label: 'Appliances' }
];
