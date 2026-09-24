export const DEFAULT_DATA = {
  brand: "Your Brand Name",
  tagline: "Makeup Artist • Gele Stylist • Lagos",
  logo: "",
  whatsapp: "",
  currency: "₦",
  paymentNote: "A 50% deposit secures your booking. Please send your receipt on WhatsApp.",
  socials: { instagram: "", tiktok: "", facebook: "", whatsapp: "", youtube: "" },
  prices: [
    { category: "Makeup", icon: "💄", items: [
      { name: "Soft Glam", price: 25000, note: "" },
      { name: "Full Glam", price: 35000, note: "" },
      { name: "Bridal Makeup", price: 80000, note: "Includes trial" } ] },
    { category: "Gele", icon: "👑", items: [
      { name: "Regular Gele", price: 10000, note: "" },
      { name: "Bridal Gele", price: 20000, note: "" } ] },
    { category: "Make-You-Look Packages", icon: "✨", items: [
      { name: "Makeup + Gele Combo", price: 40000, note: "" } ] }
  ],
  accounts: [{ bank: "Bank Name", number: "0000000000", name: "Account Name" }],
  gallery: []
};
