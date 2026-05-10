export const DESTINATIONS = [
  {
    id: '1',
    name: 'Kyoto',
    country: 'Japan',
    rating: 4.9,
    reviews: 1240,
    budget: '$$$',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop',
    tags: ['Culture', 'Nature', 'Historical'],
    description: 'Experience the magic of ancient temples, traditional tea houses, and stunning bamboo forests.',
    highlights: ['Fushimi Inari Shrine', 'Arashiyama Bamboo Grove', 'Kinkaku-ji (Golden Pavilion)'],
    bestTime: 'March to May (Cherry Blossoms) or September to November (Autumn Leaves)'
  },
  {
    id: '2',
    name: 'Santorini',
    country: 'Greece',
    rating: 4.8,
    reviews: 3102,
    budget: '$$$',
    image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=800&auto=format&fit=crop',
    tags: ['Romantic', 'Beaches', 'Relaxation'],
    description: 'Iconic blue-domed churches, whitewashed villages, and breathtaking sunsets over the Aegean Sea.',
    highlights: ['Oia Sunsets', 'Red Beach', 'Akrotiri Archaeological Site'],
    bestTime: 'September to October'
  },
  {
    id: '3',
    name: 'Banff National Park',
    country: 'Canada',
    rating: 4.9,
    reviews: 840,
    budget: '$$',
    image: 'https://images.unsplash.com/photo-1553901753-215db344677a?q=80&w=800&auto=format&fit=crop',
    tags: ['Adventure', 'Nature', 'Mountains'],
    description: 'A paradise for outdoor enthusiasts, featuring turquoise lakes and majestic peaks.',
    highlights: ['Lake Louise', 'Moraine Lake', 'Icefields Parkway'],
    bestTime: 'June to August'
  },
  {
    id: '4',
    name: 'Bali',
    country: 'Indonesia',
    rating: 4.7,
    reviews: 5200,
    budget: '$',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800&auto=format&fit=crop',
    tags: ['Tropical', 'Culture', 'Relaxation'],
    description: 'Lush landscapes, vibrant culture, and world-class surfing beaches.',
    highlights: ['Ubud Monkey Forest', 'Tegallalang Rice Terrace', 'Uluwatu Temple'],
    bestTime: 'April to October'
  },
  {
    id: '5',
    name: 'Reykjavik',
    country: 'Iceland',
    rating: 4.6,
    reviews: 1800,
    budget: '$$$$',
    image: 'https://images.unsplash.com/photo-1504829857797-cb6508f7ce14?q=80&w=800&auto=format&fit=crop',
    tags: ['Adventure', 'Nature', 'Winter'],
    description: 'Geothermal spas, northern lights, and dramatic volcanic landscapes.',
    highlights: ['Blue Lagoon', 'Golden Circle', 'Hallgrimskirkja'],
    bestTime: 'September to March (Northern Lights)'
  },
  {
    id: '6',
    name: 'Machu Picchu',
    country: 'Peru',
    rating: 4.9,
    reviews: 2400,
    budget: '$$',
    image: 'https://images.unsplash.com/photo-1526392060635-9d60198d3de3?q=80&w=800&auto=format&fit=crop',
    tags: ['Historical', 'Adventure', 'Mountains'],
    description: 'The ancient Incan citadel set high in the Andes Mountains.',
    highlights: ['Inca Trail', 'Sun Gate', 'Temple of the Sun'],
    bestTime: 'May to October'
  }
];

export const UPCOMING_TRIPS = [
  {
    id: 't1',
    destination: 'Santorini, Greece',
    date: 'Oct 15 - Oct 22, 2026',
    progress: 80,
    image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=300&auto=format&fit=crop',
    status: 'Upcoming'
  },
  {
    id: 't2',
    destination: 'Kyoto, Japan',
    date: 'Apr 05 - Apr 14, 2027',
    progress: 30,
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=300&auto=format&fit=crop',
    status: 'Planning'
  }
];

export const USER_PROFILE = {
  name: 'Alex Wander',
  username: '@alexwander',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
  stats: {
    countries: 14,
    trips: 28,
    photos: 452
  },
  badges: ['Globetrotter', 'Mountain Explorer', 'Culture Enthusiast']
};
