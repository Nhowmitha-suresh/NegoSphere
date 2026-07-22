"""
Curated Indian retail dataset & wholesale bazaar engine.
Provides hyper-realistic data across major Indian e-commerce platforms and physical tech bazaars:
- E-commerce: Amazon India, Flipkart, Croma, Reliance Digital, Vijay Sales, Tata CLiQ, Poorvika, Sangeetha
- Physical Wholesale Bazaars: Nehru Place (Delhi), SP Road (Bengaluru), Lamington Road (Mumbai), Ritchie Street (Chennai)
"""

CATALOG_DATA = {
    "samsung s24 ultra": {
        "name": "Samsung Galaxy S24 Ultra (256GB, Titanium Gray)",
        "brand": "Samsung",
        "category": "Smartphones",
        "variant": "256GB / 12GB RAM (Indian Retail Edition)",
        "specs": {
            "display": "6.8 inch Dynamic AMOLED 2X 120Hz",
            "processor": "Snapdragon 8 Gen 3 for Galaxy",
            "camera": "200MP + 50MP + 12MP + 10MP",
            "battery": "5000 mAh + 45W Fast Charging",
            "warranty": "1 Year Samsung India Warranty"
        },
        "base_mrp": 129999,
        "vendors": [
            {
                "vendor_name": "Amazon India",
                "price": 117990,
                "original_price": 129999,
                "discount_pct": 9.2,
                "seller_rating": 4.6,
                "in_stock": True,
                "scraped_url": "https://www.amazon.in/dp/B0CS5X3822",
                "location": "Mumbai Fulfilment Center",
                "delivery_days": 1,
                "perks": "₹10,000 Instant HDFC Bank Credit Card Cashback + 12 Mo No-Cost EMI"
            },
            {
                "vendor_name": "Flipkart",
                "price": 119999,
                "original_price": 129999,
                "discount_pct": 7.7,
                "seller_rating": 4.5,
                "in_stock": True,
                "scraped_url": "https://www.flipkart.com/p/itm12345",
                "location": "Bengaluru Warehouse",
                "delivery_days": 2,
                "perks": "₹9,000 Exchange Bonus + Flipkart Axis 5% Cashback"
            },
            {
                "vendor_name": "Croma Electronics",
                "price": 114900,
                "original_price": 129999,
                "discount_pct": 11.6,
                "seller_rating": 4.7,
                "in_stock": True,
                "scraped_url": "https://www.croma.com/p/274812",
                "location": "Delhi NCR Megastore",
                "delivery_days": 1,
                "perks": "Free 25W Charger + Tata Neu Pass 5% NeuCoins"
            },
            {
                "vendor_name": "SP Road Wholesale Bazaar (Bengaluru)",
                "price": 111500,
                "original_price": 129999,
                "discount_pct": 14.2,
                "seller_rating": 4.8,
                "in_stock": True,
                "scraped_url": "https://sproadbazaar.in/samsung-s24-ultra",
                "location": "SP Road, Bengaluru",
                "delivery_days": 0,
                "perks": "Offline Cash/UPI Spot Bargain Discount + GST Invoice"
            },
            {
                "vendor_name": "Nehru Place Tech Market (Delhi)",
                "price": 110990,
                "original_price": 129999,
                "discount_pct": 14.6,
                "seller_rating": 4.7,
                "in_stock": True,
                "scraped_url": "https://nehruplacemarket.com/deal/s24u",
                "location": "Nehru Place, New Delhi",
                "delivery_days": 0,
                "perks": "Free Premium Tempered Glass & Official Silicon Case Bundle"
            }
        ],
        "history_90d": [
            {"date": "2026-04-22", "price": 129999, "vendor": "Market Avg"},
            {"date": "2026-05-07", "price": 124999, "vendor": "Market Avg"},
            {"date": "2026-05-22", "price": 121990, "vendor": "Market Avg"},
            {"date": "2026-06-06", "price": 119500, "vendor": "Market Avg"},
            {"date": "2026-06-21", "price": 117800, "vendor": "Market Avg"},
            {"date": "2026-07-06", "price": 116500, "vendor": "Market Avg"},
            {"date": "2026-07-22", "price": 114274, "vendor": "Market Avg"}
        ]
    },
    "macbook air m3": {
        "name": "Apple MacBook Air 15-inch M3 (16GB, 512GB SSD, Midnight)",
        "brand": "Apple",
        "category": "Laptops",
        "variant": "15-inch M3 16GB / 512GB (India Official)",
        "specs": {
            "display": "15.3-inch Liquid Retina Display",
            "processor": "Apple M3 8-core CPU / 10-core GPU",
            "ram": "16GB Unified Memory",
            "storage": "512GB Superfast SSD",
            "warranty": "1 Year AppleCare India Warranty"
        },
        "base_mrp": 154900,
        "vendors": [
            {
                "vendor_name": "Apple BKC (Official Mumbai)",
                "price": 154900,
                "original_price": 154900,
                "discount_pct": 0.0,
                "seller_rating": 4.9,
                "in_stock": True,
                "scraped_url": "https://www.apple.com/in/shop/buy-mac/macbook-air",
                "location": "JBKC, Mumbai",
                "delivery_days": 1,
                "perks": "₹10,000 Student Discount + Free Engraving"
            },
            {
                "vendor_name": "Amazon India",
                "price": 142990,
                "original_price": 154900,
                "discount_pct": 7.7,
                "seller_rating": 4.7,
                "in_stock": True,
                "scraped_url": "https://www.amazon.in/dp/B0CX23490",
                "location": "Bengaluru Hub",
                "delivery_days": 1,
                "perks": "₹5,000 SBI Card Cashback + No-Cost EMI"
            },
            {
                "vendor_name": "Imagine Apple Reseller",
                "price": 139900,
                "original_price": 154900,
                "discount_pct": 9.7,
                "seller_rating": 4.8,
                "in_stock": True,
                "scraped_url": "https://www.myimaginestore.com/macbook-air-m3",
                "location": "Chennai Megastore",
                "delivery_days": 1,
                "perks": "Free USB-C Multi-Hub Adapter (Worth ₹3,999)"
            },
            {
                "vendor_name": "Ritchie Street Tech Hub (Chennai)",
                "price": 136500,
                "original_price": 154900,
                "discount_pct": 11.8,
                "seller_rating": 4.6,
                "in_stock": True,
                "scraped_url": "https://ritchiestreet.in/macbook-m3",
                "location": "Ritchie Street, Chennai",
                "delivery_days": 0,
                "perks": "Direct Corporate GST Invoice 18% Input Credit"
            }
        ],
        "history_90d": [
            {"date": "2026-04-22", "price": 154900, "vendor": "Market Avg"},
            {"date": "2026-05-15", "price": 149900, "vendor": "Market Avg"},
            {"date": "2026-06-01", "price": 146500, "vendor": "Market Avg"},
            {"date": "2026-07-01", "price": 144500, "vendor": "Market Avg"},
            {"date": "2026-07-22", "price": 141990, "vendor": "Market Avg"}
        ]
    },
    "sony wh-1000xm5": {
        "name": "Sony WH-1000XM5 Wireless ANC Headphones",
        "brand": "Sony",
        "category": "Headphones",
        "variant": "Black",
        "specs": {
            "noise_canceling": "HD Noise Canceling Processor QN1",
            "battery_life": "30 Hours with ANC",
            "warranty": "1 Year Sony India Brand Warranty"
        },
        "base_mrp": 34990,
        "vendors": [
            {
                "vendor_name": "Headphone Zone India",
                "price": 24990,
                "original_price": 34990,
                "discount_pct": 28.5,
                "seller_rating": 4.9,
                "in_stock": True,
                "scraped_url": "https://www.headphonezone.in/products/sony-wh-1000xm5",
                "location": "Mumbai Headquarters",
                "delivery_days": 2,
                "perks": "Free Audiophile Hard Carrying Case + Extended 6 Mo Warranty"
            },
            {
                "vendor_name": "Amazon India",
                "price": 26990,
                "original_price": 34990,
                "discount_pct": 22.8,
                "seller_rating": 4.6,
                "in_stock": True,
                "scraped_url": "https://www.amazon.in/dp/B0B3C572",
                "location": "Delhi NCR",
                "delivery_days": 1,
                "perks": "₹2,000 ICICI Card Discount"
            },
            {
                "vendor_name": "Lamington Road Audio Market (Mumbai)",
                "price": 23990,
                "original_price": 34990,
                "discount_pct": 31.4,
                "seller_rating": 4.7,
                "in_stock": True,
                "scraped_url": "https://lamingtonroad.in/sony-xm5",
                "location": "Lamington Road, Mumbai",
                "delivery_days": 0,
                "perks": "Cash Discount + Free Desktop Headphone Stand"
            }
        ],
        "history_90d": [
            {"date": "2026-04-22", "price": 29990, "vendor": "Market Avg"},
            {"date": "2026-05-15", "price": 28490, "vendor": "Market Avg"},
            {"date": "2026-06-15", "price": 27100, "vendor": "Market Avg"},
            {"date": "2026-07-22", "price": 25323, "vendor": "Market Avg"}
        ]
    }
}

def get_fallback_product_data(query: str) -> dict:
    """Intelligently matches search query to Indian retail vendors or generates a localized Indian market record."""
    clean_query = query.strip().lower()
    
    for key, data in CATALOG_DATA.items():
        if key in clean_query or any(w in clean_query for w in key.split()):
            return data

    # Dynamic Indian retail generator for unlisted items
    words = query.strip().title().split()
    brand = words[0] if len(words) > 0 else "Generic"
    name = query.strip().title()
    category = "Consumer Goods"
    
    base_mrp = 45000
    if "macbook" in clean_query or "iphone" in clean_query or "car" in clean_query or "enfield" in clean_query:
        base_mrp = 140000
    elif "tv" in clean_query or "laptop" in clean_query:
        base_mrp = 65000
    elif "watch" in clean_query or "headphone" in clean_query or "shoe" in clean_query:
        base_mrp = 18000

    v1 = round(base_mrp * 0.89)
    v2 = round(base_mrp * 0.83)
    v3 = round(base_mrp * 0.86)
    v4 = round(base_mrp * 0.79)

    return {
        "name": f"{name} (Indian Retail Edition)",
        "brand": brand,
        "category": category,
        "variant": "Official Standard Edition",
        "specs": {
            "warranty": "1 Year Official India Brand Warranty",
            "authenticity": "100% Genuine Tax Invoice",
            "packaging": "Original Sealed Box"
        },
        "base_mrp": base_mrp,
        "vendors": [
            {
                "vendor_name": "Amazon India",
                "price": v1,
                "original_price": base_mrp,
                "discount_pct": round(((base_mrp - v1) / base_mrp) * 100, 1),
                "seller_rating": 4.6,
                "in_stock": True,
                "scraped_url": f"https://www.amazon.in/s?k={query}",
                "location": "Mumbai Hub",
                "delivery_days": 1,
                "perks": "Bank Card Cashbacks Available"
            },
            {
                "vendor_name": "Flipkart",
                "price": v3,
                "original_price": base_mrp,
                "discount_pct": round(((base_mrp - v3) / base_mrp) * 100, 1),
                "seller_rating": 4.4,
                "in_stock": True,
                "scraped_url": f"https://www.flipkart.com/search?q={query}",
                "location": "Bengaluru Warehouse",
                "delivery_days": 2,
                "perks": "SuperCoins Rewards + No Cost EMI"
            },
            {
                "vendor_name": "Croma Electronics",
                "price": v2,
                "original_price": base_mrp,
                "discount_pct": round(((base_mrp - v2) / base_mrp) * 100, 1),
                "seller_rating": 4.7,
                "in_stock": True,
                "scraped_url": f"https://www.croma.com/search?q={query}",
                "location": "Delhi NCR Megastore",
                "delivery_days": 1,
                "perks": "Tata Neu Pass 5% NeuCoins"
            },
            {
                "vendor_name": "SP Road Wholesale Market (Bengaluru)",
                "price": v4,
                "original_price": base_mrp,
                "discount_pct": round(((base_mrp - v4) / base_mrp) * 100, 1),
                "seller_rating": 4.8,
                "in_stock": True,
                "scraped_url": f"https://sproadbazaar.in/search?q={query}",
                "location": "SP Road, Bengaluru",
                "delivery_days": 0,
                "perks": "Spot Cash & UPI Bargain Discount"
            }
        ],
        "history_90d": [
            {"date": "2026-04-22", "price": base_mrp, "vendor": "Market Avg"},
            {"date": "2026-05-15", "price": round(base_mrp * 0.94), "vendor": "Market Avg"},
            {"date": "2026-06-15", "price": round(base_mrp * 0.88), "vendor": "Market Avg"},
            {"date": "2026-07-22", "price": round((v1 + v2 + v3 + v4) / 4), "vendor": "Market Avg"}
        ]
    }
