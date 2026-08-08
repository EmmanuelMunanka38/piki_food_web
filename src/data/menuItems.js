 export const restaurants = [
  {
    id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    name: "Mama Ntilie Restaurant",
    location: "Dar es Salaam",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
  },
  {
    id: "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    name: "Kivukoni Fish Market",
    location: "Dar es Salaam",
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop",
  },
  {
    id: "a3bb189e-8bf9-3888-9912-ace4e6543002",
    name: "Arusha Coffee Lodge",
    location: "Arusha",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop",
  },
];

export const menuItems = [
  {
    id: "b50e9c1a-2d3e-4f5a-8b6c-7d8e9f0a1b2c",
    dish_name: "Chips Mayai",
    description: "Crispy golden chips wrapped in a fluffy egg omelette, served with fresh tomato sauce",
    price_tzs: 6000,
    is_vegetarian: false,
    restaurant: "Mama Ntilie Restaurant",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop",
    category: "Street Food",
  },
  {
    id: "c61f0d2b-3e4f-5a6b-9c7d-8e9f0a1b2c3d",
    dish_name: "Mishkaki",
    description: "Tender marinated beef skewers grilled over charcoal, served with onions and lime",
    price_tzs: 15000,
    is_vegetarian: false,
    restaurant: "Kivukoni Fish Market",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop",
    category: "Grilled",
  },
  {
    id: "d7201e3c-4f5a-6b7c-0d8e-9f0a1b2c3d4e",
    dish_name: "Pilau",
    description: "Fragrant spiced rice cooked with tender meat, aromatic herbs, and exotic spices",
    price_tzs: 12000,
    is_vegetarian: false,
    restaurant: "Arusha Coffee Lodge",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop",
    category: "Rice",
  },
  {
    id: "e8312f4d-5a6b-7c8d-1e9f-0a1b2c3d4e5f",
    dish_name: "Ugali na Nyama",
    description: "Traditional maize flour ugali served with savory beef stew and fresh vegetables",
    price_tzs: 8000,
    is_vegetarian: false,
    restaurant: "Mama Ntilie Restaurant",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&h=300&fit=crop",
    category: "Traditional",
  },
  {
    id: "f942305e-6b7c-8d9e-2f0a-1b2c3d4e5f60",
    dish_name: "Wali Maharage",
    description: "Fragrant coconut rice cooked with seasoned beans, a classic Tanzanian comfort dish",
    price_tzs: 5000,
    is_vegetarian: true,
    restaurant: "Arusha Coffee Lodge",
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=400&h=300&fit=crop",
    category: "Rice",
  },
  {
    id: "0a53416f-7c8d-9e0f-3a1b-2c3d4e5f6071",
    dish_name: "Samaki wa Kupaka",
    description: "Fresh grilled fish coated in rich coconut cream sauce with tropical spices",
    price_tzs: 18000,
    is_vegetarian: false,
    restaurant: "Kivukoni Fish Market",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=300&fit=crop",
    category: "Seafood",
  },
];

export const testimonials = [
  {
    id: 1,
    name: "Amina Hassan",
    avatar: "https://images.unsplash.com/photo-1765607476283-ca2d8201ddd4?w=150&h=150&fit=crop&crop=face",
    location: "Dar es Salaam",
    rating: 5,
    review: "I order lunch through Piki Food almost every weekday. The M-Pesa checkout takes less than 3 seconds, and my food consistently arrives within 25 minutes. The real-time tracking gives me full visibility from restaurant to doorstep — something no other local app has delivered this reliably.",
  },
  {
    id: 2,
    name: "John Mwangi",
    avatar: "https://images.unsplash.com/photo-1745690720220-24e337e571c7?w=150&h=150&fit=crop&crop=face",
    location: "Nairobi",
    rating: 5,
    review: "As someone who manages a busy schedule, Piki Food has become essential. I can schedule orders in advance, save my favorite restaurants, and reorder with a single tap. The restaurant selection in Nairobi is outstanding — from local nyama choma spots to international chains. The app is fast and the interface is clean.",
  },
  {
    id: 3,
    name: "Fatima Omar",
    avatar: "https://images.unsplash.com/photo-1754843780819-9266a192ca7a?w=150&h=150&fit=crop&crop=face",
    location: "Mwanza",
    rating: 5,
    review: "What sets Piki Food apart is the consistency. Whether I'm ordering ugali na nyama or a pizza, the quality matches what I'd get dining in. Customer support resolved my one issue within minutes through WhatsApp. Having a reliable delivery option in Mwanza has genuinely improved how my family eats during busy weeks.",
  },
  {
    id: 4,
    name: "David Kimaro",
    avatar: "https://images.unsplash.com/photo-1745859426100-544678ee3cdb?w=150&h=150&fit=crop&crop=face",
    location: "Arusha",
    rating: 5,
    review: "I switched from international delivery apps to Piki Food six months ago and haven't looked back. The pricing is transparent with no hidden fees, the riders are professional, and the M-Pesa integration means I never have to worry about card issues. It's built specifically for how we actually pay and order in East Africa.",
  },
  {
    id: 5,
    name: "Neema Joseph",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop&crop=face",
    location: "Dar es Salaam",
    rating: 5,
    review: "Piki Food imebadilisha jinsi ninavyopata chakula. Naagiza kutoka mikahawa ninayopenda na kulipa kwa M-Pesa bila shida yoyote. Chakula changu kinafika kikiwa kikali kwa chini ya dakika thelathini. Nawashauri wote wajaribu leo!",
  },
  {
    id: 6,
    name: "Peter Otieno",
    avatar: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=150&h=150&fit=crop&crop=face",
    location: "Kisumu",
    rating: 5,
    review: "Piki Food has completely changed how I order food in Kisumu. The app is fast, the restaurants are well vetted, and the riders are always professional. Being able to pay with M-Pesa makes everything seamless — no cards, no cash needed.",
  },
  {
    id: 7,
    name: "Zainabu Mushi",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&h=150&fit=crop&crop=face",
    location: "Dodoma",
    rating: 5,
    review: "Ufuatiliaji wa wakati halisi unanipa amani ya akili kila ninapoagiza. Naweza kuona mwendesha baiskeli wangu anakotoka hadi anapofika. Pia, msaada wa wateja kwa WhatsApp unajibu haraka sana. Huduma bora kabisa!",
  },
  {
    id: 8,
    name: "Oscar Wanjiru",
    avatar: "https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?w=150&h=150&fit=crop&crop=face",
    location: "Nairobi",
    rating: 5,
    review: "As a busy professional in Nairobi, I rely on Piki Food almost daily. The selection is fantastic, orders arrive on time, and the WhatsApp support responds within minutes if anything goes wrong. It has genuinely made my weekdays easier.",
  },
];


const LOGO_DEV_TOKEN = import.meta.env.VITE_LOGO_DEV_TOKEN;

export const foodCompanies = [
  { id: 1, name: "KFC", domain: "kfc.com" },
  { id: 2, name: "Pizza Hut", domain: "pizzahut.com" },
  { id: 3, name: "Burger King", domain: "bk.com" },
  { id: 4, name: "Subway", domain: "subway.com" },
  { id: 5, name: "Domino's", domain: "dominos.com" },
  { id: 6, name: "Glovo", domain: "glovoapp.com" },
  { id: 7, name: "Jumia Food", domain: "jumia.com" },
  { id: 8, name: "Bolt", domain: "bolt.eu" },
  { id: 9, name: "Coca-Cola", domain: "coca-cola.com" },
  { id: 10, name: "Pepsi", domain: "pepsi.com" },
  { id: 11, name: "Uber Eats", domain: "ubereats.com" },
  { id: 12, name: "McDonald's", domain: "mcdonalds.com" },
  { id: 13, name: "Starbucks", domain: "starbucks.com" },
  { id: 14, name: "Tusker", domain: "tuskerbeer.com" },
];

export const getLogoUrl = (domain) =>
  `https://img.logo.dev/${domain}?token=${LOGO_DEV_TOKEN}&size=120&format=png&fallback=monogram`;


