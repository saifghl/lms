export const stateCityMap = {
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Navi Mumbai", "Solapur"],
    "Delhi": ["New Delhi", "Delhi Cantonment", "Karawal Nagar"],
    "Karnataka": ["Bangalore", "Hubli-Dharwad", "Mysore", "Mangalore", "Belgaum", "Davanagere"],
    "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Ramagundam"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tiruppur", "Erode"],
    "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Malda", "Kharagpur"],
    "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur", "Bhilwara"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Meerut", "Varanasi", "Allahabad", "Bareilly"],
    "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Dewas"],
    "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Rajahmundry", "Tirupati"],
    "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga", "Arrah", "Begusarai"],
    "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda"],
    "Haryana": ["Faridabad", "Gurgaon", "Panipat", "Ambala", "Rohtak", "Karnal", "Sonipat", "Panchkula"],
    "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Kollam", "Thrissur", "Alappuzha"],
    "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur"],
    "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat"],
    "Jharkhand": ["Ranchi", "Dhanbad", "Jamshedpur", "Bokaro", "Deoghar"],
    "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba", "Durg"],
    "Uttarakhand": ["Dehradun", "Haridwar", "Roorkee", "Haldwani"],
    "Himachal Pradesh": ["Shimla", "Mandi", "Dharamshala", "Solan"],
    "Goa": ["Panaji", "Vasco da Gama", "Margao", "Ponda"],
    "Jammu and Kashmir": ["Srinagar", "Jammu", "Anantnag", "Baramulla"],
    "Chandigarh": ["Chandigarh"]
};

export const indianStates = Object.keys(stateCityMap).sort();

export const getCitiesByState = (stateName) => {
    return stateCityMap[stateName] ? stateCityMap[stateName].sort() : [];
};

export const indianCities = Object.values(stateCityMap)
    .flat()
    .sort((a, b) => a.localeCompare(b));
