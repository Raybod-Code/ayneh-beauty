import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Log to verify (remove after testing)
console.log("Supabase URL:", supabaseUrl ? "✅ Loaded" : "❌ Missing");
console.log("Service Key:", supabaseKey ? "✅ Loaded" : "❌ Missing");

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedData() {
  try {
    console.log("🌱 Starting seed...");

    // 1. Get first active tenant
    const { data: tenants } = await supabase
      .from("tenants")
      .select("*")
      .eq("status", "active")
      .limit(1);

    if (!tenants || tenants.length === 0) {
      console.log("❌ No active tenant found!");
      return;
    }

    const tenant = tenants[0];
    console.log(`✅ Found tenant: ${tenant.name}`);

    // 2. Seed Services
    console.log("📦 Seeding services...");
    const services = [
      {
        tenant_id: tenant.id,
        name: "کوتاهی مو",
        description: "کوتاهی حرفه‌ای مو با جدیدترین تکنیک‌ها",
        category: "hair",
        price: 150000,
        duration: 45,
        is_active: true,
      },
      {
        tenant_id: tenant.id,
        name: "رنگ مو",
        description: "رنگ کامل مو با رنگ‌های اورجینال",
        category: "hair",
        price: 500000,
        duration: 120,
        is_active: true,
      },
      {
        tenant_id: tenant.id,
        name: "مش مو",
        description: "مش و هایلایت حرفه‌ای",
        category: "hair",
        price: 350000,
        duration: 90,
        is_active: true,
      },
      {
        tenant_id: tenant.id,
        name: "مانیکور",
        description: "مانیکور دست با ژل و اکلیل",
        category: "nails",
        price: 80000,
        duration: 30,
        is_active: true,
      },
      {
        tenant_id: tenant.id,
        name: "پدیکور",
        description: "پدیکور کامل پا",
        category: "nails",
        price: 100000,
        duration: 40,
        is_active: true,
      },
      {
        tenant_id: tenant.id,
        name: "آرایش عروس",
        description: "آرایش کامل عروس با تست رایگان",
        category: "makeup",
        price: 2000000,
        duration: 180,
        is_active: true,
      },
      {
        tenant_id: tenant.id,
        name: "آرایش مهمانی",
        description: "آرایش برای مهمانی و مجالس",
        category: "makeup",
        price: 300000,
        duration: 60,
        is_active: true,
      },
      {
        tenant_id: tenant.id,
        name: "پاکسازی پوست",
        description: "پاکسازی عمیق پوست صورت",
        category: "skin",
        price: 250000,
        duration: 60,
        is_active: true,
      },
      {
        tenant_id: tenant.id,
        name: "میکرونیدلینگ",
        description: "میکرونیدلینگ برای جوانسازی پوست",
        category: "skin",
        price: 600000,
        duration: 90,
        is_active: true,
      },
      {
        tenant_id: tenant.id,
        name: "ماساژ سوئدی",
        description: "ماساژ آرامش‌بخش بدن",
        category: "spa",
        price: 400000,
        duration: 60,
        is_active: true,
      },
    ];

    const { data: insertedServices, error: servicesError } = await supabase
      .from("services")
      .insert(services)
      .select();

    if (servicesError) {
      console.error("❌ Services error:", servicesError);
      return;
    } else {
      console.log(`✅ Added ${insertedServices?.length} services`);
    }

    // 3. Seed Staff
    console.log("👥 Seeding staff...");
    const staff = [
      {
        tenant_id: tenant.id,
        name: "مریم احمدی",
        email: "maryam@example.com",
        phone: "09121234567",
        role: "admin",
        specialties: "مدیریت، رنگ مو، کوتاهی",
        bio: "مدیر و موسس سالن با 15 سال تجربه",
        rating: 5.0,
        is_active: true,
      },
      {
        tenant_id: tenant.id,
        name: "فاطمه رضایی",
        email: "fatemeh@example.com",
        phone: "09129876543",
        role: "stylist",
        specialties: "رنگ مو، مش، هایلایت",
        bio: "متخصص رنگ و مش با 8 سال تجربه",
        rating: 4.9,
        is_active: true,
      },
      {
        tenant_id: tenant.id,
        name: "سارا کریمی",
        email: "sara@example.com",
        phone: "09127654321",
        role: "stylist",
        specialties: "کوتاهی، فر، براشینگ",
        bio: "آرایشگر ماهر با 6 سال سابقه",
        rating: 4.8,
        is_active: true,
      },
      {
        tenant_id: tenant.id,
        name: "زهرا محمدی",
        email: "zahra@example.com",
        phone: "09123456789",
        role: "stylist",
        specialties: "آرایش، میکاپ عروس، ناخن",
        bio: "میکاپ آرتیست با 10 سال تجربه",
        rating: 5.0,
        is_active: true,
      },
      {
        tenant_id: tenant.id,
        name: "نگار حسینی",
        email: "negar@example.com",
        phone: "09125555555",
        role: "assistant",
        specialties: "پذیرش، رزرو",
        bio: "منشی و مسئول پذیرش",
        rating: 4.7,
        is_active: true,
      },
    ];

    const { data: insertedStaff, error: staffError } = await supabase
      .from("staff")
      .insert(staff)
      .select();

    if (staffError) {
      console.error("❌ Staff error:", staffError);
      return;
    } else {
      console.log(`✅ Added ${insertedStaff?.length} staff members`);
    }

    // 4. Seed Customers
    console.log("👤 Seeding customers...");
    const customers = [
      {
        tenant_id: tenant.id,
        name: "نیلوفر امینی",
        email: "niloofar@example.com",
        phone: "09131111111",
        customer_type: "vip",
        visit_count: 25,
        total_spent: 5000000,
        loyalty_points: 250,
        last_visit: "2024-12-20",
        birthday: "1990-05-15",
        address: "تهران، ونک",
        notes: "مشتری VIP، ترجیح میده با مریم خانم کار کنه",
      },
      {
        tenant_id: tenant.id,
        name: "پریسا نوری",
        email: "parisa@example.com",
        phone: "09132222222",
        customer_type: "premium",
        visit_count: 18,
        total_spent: 3500000,
        loyalty_points: 180,
        last_visit: "2024-12-18",
        birthday: "1988-08-22",
        address: "تهران، سعادت آباد",
      },
      {
        tenant_id: tenant.id,
        name: "شبنم کاظمی",
        email: "shabnam@example.com",
        phone: "09133333333",
        customer_type: "loyal",
        visit_count: 15,
        total_spent: 2800000,
        loyalty_points: 150,
        last_visit: "2024-12-15",
        birthday: "1992-03-10",
      },
      {
        tenant_id: tenant.id,
        name: "مهسا رحیمی",
        email: "mahsa@example.com",
        phone: "09134444444",
        customer_type: "regular",
        visit_count: 8,
        total_spent: 1200000,
        loyalty_points: 80,
        last_visit: "2024-12-10",
      },
      {
        tenant_id: tenant.id,
        name: "آیدا موسوی",
        email: "aida@example.com",
        phone: "09135555555",
        customer_type: "regular",
        visit_count: 5,
        total_spent: 800000,
        loyalty_points: 50,
        last_visit: "2024-12-05",
      },
      {
        tenant_id: tenant.id,
        name: "الناز صادقی",
        email: "elnaz@example.com",
        phone: "09136666666",
        customer_type: "vip",
        visit_count: 30,
        total_spent: 7500000,
        loyalty_points: 300,
        last_visit: "2024-12-22",
        birthday: "1985-11-30",
        address: "تهران، نیاوران",
      },
      {
        tenant_id: tenant.id,
        name: "ترانه اکبری",
        email: "taraneh@example.com",
        phone: "09137777777",
        customer_type: "premium",
        visit_count: 12,
        total_spent: 2200000,
        loyalty_points: 120,
        last_visit: "2024-12-12",
      },
      {
        tenant_id: tenant.id,
        name: "رویا جعفری",
        email: "roya@example.com",
        phone: "09138888888",
        customer_type: "regular",
        visit_count: 3,
        total_spent: 450000,
        loyalty_points: 30,
        last_visit: "2024-11-28",
      },
    ];

    const { data: insertedCustomers, error: customersError } = await supabase
      .from("customers")
      .insert(customers)
      .select();

    if (customersError) {
      console.error("❌ Customers error:", customersError);
      return;
    } else {
      console.log(`✅ Added ${insertedCustomers?.length} customers`);
    }

    // 5. Seed Bookings
    console.log("📅 Seeding bookings...");
    
    const today = new Date();
    const bookings = [];

    // Create bookings for the next 7 days
    for (let i = 0; i < 25; i++) {
      const daysAhead = Math.floor(Math.random() * 7) - 2; // -2 to +4 days
      const bookingDate = new Date(today);
      bookingDate.setDate(today.getDate() + daysAhead);
      
      const hour = 9 + Math.floor(Math.random() * 10); // 9-18
      const minute = Math.random() > 0.5 ? "00" : "30";
      
      const customer = insertedCustomers[Math.floor(Math.random() * insertedCustomers.length)];
      const service = insertedServices[Math.floor(Math.random() * insertedServices.length)];
      const staffMember = insertedStaff[Math.floor(Math.random() * insertedStaff.length)];
      
      const statuses = ["pending", "confirmed", "in-progress", "completed"];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      bookings.push({
        tenant_id: tenant.id,
        customer_id: customer.id,
        customer_name: customer.name,
        customer_phone: customer.phone,
        service_id: service.id,
        service_name: service.name,
        staff_id: staffMember.id,
        staff_name: staffMember.name,
        booking_date: bookingDate.toISOString().split("T")[0],
        booking_time: `${hour.toString().padStart(2, '0')}:${minute}`,
        duration: service.duration,
        price: service.price,
        status: status,
        priority: customer.customer_type === "vip" ? "vip" : "normal",
        notes: i % 3 === 0 ? "مشتری خواسته به موقع شروع بشه" : "",
      });
    }

    const { data: insertedBookings, error: bookingsError } = await supabase
      .from("bookings")
      .insert(bookings)
      .select();

    if (bookingsError) {
      console.error("❌ Bookings error:", bookingsError);
      return;
    } else {
      console.log(`✅ Added ${insertedBookings?.length} bookings`);
    }

    // 6. Seed Transactions (Financial)
    console.log("💰 Seeding transactions...");
    const transactions = [
      // Income - Services
      {
        tenant_id: tenant.id,
        type: "income",
        amount: 500000,
        category: "خدمات",
        description: "درآمد رنگ مو - نیلوفر امینی",
        payment_method: "card",
        date: "2024-12-20",
      },
      {
        tenant_id: tenant.id,
        type: "income",
        amount: 350000,
        category: "خدمات",
        description: "درآمد مش مو - پریسا نوری",
        payment_method: "cash",
        date: "2024-12-18",
      },
      {
        tenant_id: tenant.id,
        type: "income",
        amount: 150000,
        category: "خدمات",
        description: "درآمد کوتاهی مو - شبنم کاظمی",
        payment_method: "card",
        date: "2024-12-15",
      },
      {
        tenant_id: tenant.id,
        type: "income",
        amount: 2000000,
        category: "خدمات",
        description: "درآمد آرایش عروس - مهسا رحیمی",
        payment_method: "transfer",
        date: "2024-12-10",
      },
      {
        tenant_id: tenant.id,
        type: "income",
        amount: 180000,
        category: "خدمات",
        description: "درآمد مانیکور و پدیکور - آیدا موسوی",
        payment_method: "cash",
        date: "2024-12-05",
      },
      // Income - Products
      {
        tenant_id: tenant.id,
        type: "income",
        amount: 450000,
        category: "محصولات",
        description: "فروش محصولات مراقبت مو - الناز صادقی",
        payment_method: "card",
        date: "2024-12-22",
      },
      {
        tenant_id: tenant.id,
        type: "income",
        amount: 280000,
        category: "محصولات",
        description: "فروش محصولات آرایشی - ترانه اکبری",
        payment_method: "card",
        date: "2024-12-12",
      },
      // Expenses - Salaries
      {
        tenant_id: tenant.id,
        type: "expense",
        amount: 15000000,
        category: "حقوق و دستمزد",
        description: "حقوق ماهانه پرسنل - آذر ماه",
        payment_method: "transfer",
        date: "2024-12-01",
      },
      // Expenses - Rent
      {
        tenant_id: tenant.id,
        type: "expense",
        amount: 25000000,
        category: "اجاره",
        description: "اجاره ماهانه سالن - آذر ماه",
        payment_method: "transfer",
        date: "2024-12-01",
      },
      // Expenses - Utilities
      {
        tenant_id: tenant.id,
        type: "expense",
        amount: 1200000,
        category: "آب و برق",
        description: "قبض آب و برق و گاز",
        payment_method: "cash",
        date: "2024-12-05",
      },
      // Expenses - Supplies
      {
        tenant_id: tenant.id,
        type: "expense",
        amount: 5500000,
        category: "مواد اولیه",
        description: "خرید رنگ مو و مواد اولیه",
        payment_method: "card",
        date: "2024-12-08",
      },
      {
        tenant_id: tenant.id,
        type: "expense",
        amount: 3200000,
        category: "مواد اولیه",
        description: "خرید محصولات آرایشی و ناخن",
        payment_method: "card",
        date: "2024-12-14",
      },
      // Expenses - Equipment
      {
        tenant_id: tenant.id,
        type: "expense",
        amount: 8500000,
        category: "تجهیزات",
        description: "خرید سشوار حرفه‌ای",
        payment_method: "card",
        date: "2024-12-10",
      },
      // Expenses - Marketing
      {
        tenant_id: tenant.id,
        type: "expense",
        amount: 2500000,
        category: "بازاریابی",
        description: "تبلیغات اینستاگرام و گوگل",
        payment_method: "card",
        date: "2024-12-15",
      },
      // More income
      {
        tenant_id: tenant.id,
        type: "income",
        amount: 600000,
        category: "خدمات",
        description: "درآمد میکرونیدلینگ",
        payment_method: "card",
        date: "2024-12-21",
      },
      {
        tenant_id: tenant.id,
        type: "income",
        amount: 400000,
        category: "خدمات",
        description: "درآمد ماساژ سوئدی",
        payment_method: "cash",
        date: "2024-12-19",
      },
    ];

    const { data: insertedTransactions, error: transactionsError } = await supabase
      .from("transactions")
      .insert(transactions)
      .select();

    if (transactionsError) {
      console.error("❌ Transactions error:", transactionsError);
    } else {
      console.log(`✅ Added ${insertedTransactions?.length} transactions`);
    }

    // 7. Seed Inventory
    console.log("📦 Seeding inventory...");
    const inventory = [
      {
        tenant_id: tenant.id,
        name: "رنگ مو لورآل سری Excellence",
        category: "رنگ مو",
        sku: "HAIR-COLOR-001",
        quantity: 45,
        min_quantity: 10,
        unit_price: 280000,
        selling_price: 450000,
        supplier: "نمایندگی لورآل",
        description: "رنگ مو حرفه‌ای لورآل با پوشش کامل سفیدی",
      },
      {
        tenant_id: tenant.id,
        name: "رنگ مو گارنیر Olia",
        category: "رنگ مو",
        sku: "HAIR-COLOR-002",
        quantity: 32,
        min_quantity: 10,
        unit_price: 220000,
        selling_price: 350000,
        supplier: "نمایندگی گارنیر",
        description: "رنگ مو بدون آمونیاک",
      },
      {
        tenant_id: tenant.id,
        name: "شامپو ترمیم کننده کراستاس",
        category: "محصولات مراقبت مو",
        sku: "SHAMPOO-001",
        quantity: 8,
        min_quantity: 15,
        unit_price: 450000,
        selling_price: 680000,
        supplier: "نمایندگی کراستاس",
        description: "شامپو ترمیم کننده موهای آسیب دیده",
      },
      {
        tenant_id: tenant.id,
        name: "ماسک مو آرگان ویتالیتیز",
        category: "محصولات مراقبت مو",
        sku: "MASK-001",
        quantity: 25,
        min_quantity: 10,
        unit_price: 180000,
        selling_price: 290000,
        supplier: "پخش ویتالیتیز",
        description: "ماسک مو با روغن آرگان",
      },
      {
        tenant_id: tenant.id,
        name: "سرم مو حاوی کراتین",
        category: "محصولات مراقبت مو",
        sku: "SERUM-001",
        quantity: 18,
        min_quantity: 8,
        unit_price: 320000,
        selling_price: 480000,
        supplier: "پخش محصولات مو",
        description: "سرم کراتین برای صاف کردن و براقیت",
      },
      {
        tenant_id: tenant.id,
        name: "لاک ژل OPI",
        category: "ناخن",
        sku: "NAIL-001",
        quantity: 55,
        min_quantity: 20,
        unit_price: 85000,
        selling_price: 140000,
        supplier: "نمایندگی OPI",
        description: "لاک ژل ماندگار - رنگ‌های متنوع",
      },
      {
        tenant_id: tenant.id,
        name: "تیپ ناخن فرنچ",
        category: "ناخن",
        sku: "NAIL-002",
        quantity: 150,
        min_quantity: 50,
        unit_price: 45000,
        selling_price: 75000,
        supplier: "پخش لوازم ناخن",
        description: "تیپ ناخن فرنچ - بسته 100 عددی",
      },
      {
        tenant_id: tenant.id,
        name: "کرم پودر میبلین Fit Me",
        category: "آرایشی",
        sku: "MAKEUP-001",
        quantity: 12,
        min_quantity: 10,
        unit_price: 280000,
        selling_price: 420000,
        supplier: "نمایندگی میبلین",
        description: "کرم پودر مات - تمام رنگ‌ها",
      },
      {
        tenant_id: tenant.id,
        name: "پالت سایه هدی بیوتی",
        category: "آرایشی",
        sku: "MAKEUP-002",
        quantity: 5,
        min_quantity: 8,
        unit_price: 1200000,
        selling_price: 1800000,
        supplier: "واردات هدی بیوتی",
        description: "پالت 18 رنگ سایه چشم",
      },
      {
        tenant_id: tenant.id,
        name: "رژلب مک مت",
        category: "آرایشی",
        sku: "MAKEUP-003",
        quantity: 28,
        min_quantity: 15,
        unit_price: 380000,
        selling_price: 580000,
        supplier: "نمایندگی مک",
        description: "رژلب مات با دوام بالا",
      },
      {
        tenant_id: tenant.id,
        name: "کرم آبرسان نوتروژینا",
        category: "محصولات پوست",
        sku: "SKIN-001",
        quantity: 22,
        min_quantity: 10,
        unit_price: 180000,
        selling_price: 280000,
        supplier: "نمایندگی نوتروژینا",
        description: "کرم آبرسان برای پوست خشک",
      },
      {
        tenant_id: tenant.id,
        name: "سرم ویتامین C",
        category: "محصولات پوست",
        sku: "SKIN-002",
        quantity: 15,
        min_quantity: 8,
        unit_price: 420000,
        selling_price: 650000,
        supplier: "پخش محصولات پوست",
        description: "سرم ویتامین C برای روشنایی پوست",
      },
      {
        tenant_id: tenant.id,
        name: "ماسک صورت طلا",
        category: "محصولات پوست",
        sku: "SKIN-003",
        quantity: 35,
        min_quantity: 15,
        unit_price: 95000,
        selling_price: 150000,
        supplier: "پخش محصولات پوست",
        description: "ماسک ورقه‌ای با عصاره طلا",
      },
      {
        tenant_id: tenant.id,
        name: "دستگاه سشوار حرفه‌ای",
        category: "ابزار و تجهیزات",
        sku: "TOOL-001",
        quantity: 4,
        min_quantity: 2,
        unit_price: 3500000,
        selling_price: 5200000,
        supplier: "نمایندگی ابزار",
        description: "سشوار 2000 وات حرفه‌ای",
      },
      {
        tenant_id: tenant.id,
        name: "اتو مو حرفه‌ای",
        category: "ابزار و تجهیزات",
        sku: "TOOL-002",
        quantity: 3,
        min_quantity: 2,
        unit_price: 2800000,
        selling_price: 4200000,
        supplier: "نمایندگی ابزار",
        description: "اتو مو با صفحات سرامیک",
      },
      {
        tenant_id: tenant.id,
        name: "دستکش یکبار مصرف",
        category: "سایر",
        sku: "SUPPLY-001",
        quantity: 0,
        min_quantity: 100,
        unit_price: 180000,
        selling_price: 250000,
        supplier: "پخش لوازم بهداشتی",
        description: "دستکش لاتکس - بسته 100 عددی",
      },
      {
        tenant_id: tenant.id,
        name: "حوله یکبار مصرف",
        category: "سایر",
        sku: "SUPPLY-002",
        quantity: 250,
        min_quantity: 100,
        unit_price: 85000,
        selling_price: 120000,
        supplier: "پخش لوازم بهداشتی",
        description: "حوله یکبار مصرف - بسته 50 عددی",
      },
    ];

    const { data: insertedInventory, error: inventoryError } = await supabase
      .from("inventory")
      .insert(inventory)
      .select();

    if (inventoryError) {
      console.error("❌ Inventory error:", inventoryError);
    } else {
      console.log(`✅ Added ${insertedInventory?.length} inventory items`);
    }

    // 8. Seed Campaigns (Marketing)
    console.log("📱 Seeding campaigns...");
    const campaigns = [
      {
        tenant_id: tenant.id,
        name: "تخفیف نوروز 1404",
        type: "promotional",
        message: "سلام {name} عزیز! به مناسبت نوروز 1404، تخفیف ویژه 30% برای کلیه خدمات! از {salon} رزرو کنید. 📞 02122334455",
        target_segment: "all",
        status: "sent",
        scheduled_date: "2024-12-20",
        scheduled_time: "10:00",
        sent_at: "2024-12-20T10:00:00",
        recipients_count: 8,
        success_count: 8,
      },
      {
        tenant_id: tenant.id,
        name: "تبریک تولد مشتریان",
        type: "birthday",
        message: "تولدت مبارک {name} جان! 🎂🎉 به عنوان هدیه تولد، یک سشن مانیکور رایگان برای شما! {salon}",
        target_segment: "birthday",
        status: "scheduled",
        scheduled_date: "2025-01-01",
        scheduled_time: "09:00",
        recipients_count: 2,
      },
      {
        tenant_id: tenant.id,
        name: "یادآوری نوبت فردا",
        type: "reminder",
        message: "{name} عزیز، نوبت شما فردا {date} ساعت {time} می‌باشد. {salon} - 02122334455",
        target_segment: "all",
        status: "sent",
        scheduled_date: "2024-12-22",
        scheduled_time: "18:00",
        sent_at: "2024-12-22T18:00:00",
        recipients_count: 5,
        success_count: 5,
      },
      {
        tenant_id: tenant.id,
        name: "معرفی خدمات جدید میکرونیدلینگ",
        type: "announcement",
        message: "سلام {name}! خدمات جدید میکرونیدلینگ در {salon} آغاز شد. 🌟 برای جوانسازی پوست و رفع چین و چروک. اطلاعات بیشتر: 02122334455",
        target_segment: "vip",
        status: "draft",
        recipients_count: 2,
      },
      {
        tenant_id: tenant.id,
        name: "پیشنهاد ویژه مشتریان VIP",
        type: "special-offer",
        message: "{name} گرامی، به عنوان مشتری VIP، 40% تخفیف ویژه برای پکیج کامل زیبایی! 👑 {salon} - 02122334455",
        target_segment: "vip",
        status: "scheduled",
        scheduled_date: "2025-01-05",
        scheduled_time: "11:00",
        recipients_count: 2,
      },
      {
        tenant_id: tenant.id,
        name: "بازگشت مشتریان غیرفعال",
        type: "promotional",
        message: "سلام {name}! دلتون برامون تنگ شده 💕 تخفیف 25% برای بازگشت شما به {salon}. منتظریم! 02122334455",
        target_segment: "inactive",
        status: "draft",
        recipients_count: 0,
      },
    ];

    const { data: insertedCampaigns, error: campaignsError } = await supabase
      .from("campaigns")
      .insert(campaigns)
      .select();

    if (campaignsError) {
      console.error("❌ Campaigns error:", campaignsError);
    } else {
      console.log(`✅ Added ${insertedCampaigns?.length} campaigns`);
    }
    // در تابع seedData، بعد از campaigns:

// 9. Seed Notifications
console.log("🔔 Seeding notifications...");
const sampleNotifications = [
  {
    tenant_id: tenant.id,
    title: "رزرو جدید",
    message: "نیلوفر امینی یک رزرو جدید برای رنگ مو ثبت کرد",
    type: "booking",
    priority: "high",
    is_read: false,
    link: "/salon/bookings",
  },
  {
    tenant_id: tenant.id,
    title: "موجودی کم",
    message: "موجودی شامپو کراستاس کمتر از حد مجاز است",
    type: "inventory",
    priority: "urgent",
    is_read: false,
    link: "/salon/inventory",
  },
  {
    tenant_id: tenant.id,
    title: "پرداخت دریافت شد",
    message: "پرداخت 500,000 تومان از پریسا نوری دریافت شد",
    type: "payment",
    priority: "normal",
    is_read: true,
    link: "/salon/financial",
  },
  {
    tenant_id: tenant.id,
    title: "کمپین ارسال شد",
    message: "کمپین 'تخفیف نوروز' با موفقیت برای 8 نفر ارسال شد",
    type: "marketing",
    priority: "normal",
    is_read: true,
    link: "/salon/marketing",
  },
  {
    tenant_id: tenant.id,
    title: "مشتری جدید",
    message: "رویا جعفری به عنوان مشتری جدید ثبت شد",
    type: "customer",
    priority: "low",
    is_read: false,
    link: "/salon/customers",
  },
];

const { data: insertedNotifications, error: notificationsError } = await supabase
  .from("notifications")
  .insert(sampleNotifications)
  .select();

if (notificationsError) {
  console.error("❌ Notifications error:", notificationsError);
} else {
  console.log(`✅ Added ${insertedNotifications?.length} notifications`);
}


    console.log("\n🎉 Seed completed successfully!\n");
    console.log("📊 Summary:");
    console.log(`   - Services: ${insertedServices?.length || 0}`);
    console.log(`   - Staff: ${insertedStaff?.length || 0}`);
    console.log(`   - Customers: ${insertedCustomers?.length || 0}`);
    console.log(`   - Bookings: ${insertedBookings?.length || 0}`);
    console.log(`   - Transactions: ${insertedTransactions?.length || 0}`);
    console.log(`   - Inventory: ${insertedInventory?.length || 0}`);
    console.log(`   - Campaigns: ${insertedCampaigns?.length || 0}`);
    console.log("\n");

  } catch (error) {
    console.error("❌ Seed failed:", error);
  }
}


seedData();
