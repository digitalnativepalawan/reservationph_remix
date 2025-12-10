import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AirbnbData {
  name: string;
  description: string;
  price: number;
  guests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  location: {
    city: string;
    province: string;
  };
  images: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!url || !url.includes('airbnb')) {
      return new Response(
        JSON.stringify({ error: 'Invalid Airbnb URL' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Normalize URL - add https:// if missing
    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = 'https://' + normalizedUrl;
    }

    console.log('Scraping Airbnb URL:', normalizedUrl);

    // Fetch the Airbnb page
    const response = await fetch(normalizedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Airbnb page');
    }

    const html = await response.text();

    // Extract data from the page
    const extractedData: Partial<AirbnbData> = {
      name: '',
      description: '',
      price: 0,
      guests: 0,
      bedrooms: 0,
      bathrooms: 0,
      amenities: [],
      location: { city: '', province: '' },
      images: [],
    };

    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch) {
      extractedData.name = titleMatch[1].split('|')[0].split('-')[0].trim();
    }

    // Extract JSON-LD data (Airbnb uses this for structured data)
    const jsonLdMatch = html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/gi);
    if (jsonLdMatch) {
      for (const match of jsonLdMatch) {
        const jsonStr = match.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');
        try {
          const jsonData = JSON.parse(jsonStr);
          
          if (jsonData['@type'] === 'Product' || jsonData['@type'] === 'Accommodation') {
            extractedData.name = jsonData.name || extractedData.name;
            extractedData.description = jsonData.description || '';
            
            if (jsonData.offers && jsonData.offers.price) {
              extractedData.price = parseFloat(jsonData.offers.price);
            }
            
            if (jsonData.image) {
              const images = Array.isArray(jsonData.image) ? jsonData.image : [jsonData.image];
              extractedData.images = images;
            }
          }
        } catch (e) {
          console.log('Error parsing JSON-LD:', e);
        }
      }
    }

    // Extract meta tags for additional data
    const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
    if (metaDescMatch && !extractedData.description) {
      extractedData.description = metaDescMatch[1];
    }

    // Extract Open Graph images
    const ogImageMatches = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/gi);
    if (ogImageMatches) {
      for (const match of ogImageMatches) {
        const urlMatch = match.match(/content=["']([^"']+)["']/);
        if (urlMatch && extractedData.images) {
          extractedData.images.push(urlMatch[1]);
        }
      }
    }

    // Extract number of guests, bedrooms, bathrooms from the page
    const guestsMatch = html.match(/(\d+)\s*guests?/i);
    if (guestsMatch) {
      extractedData.guests = parseInt(guestsMatch[1]);
    }

    const bedroomsMatch = html.match(/(\d+)\s*bedrooms?/i);
    if (bedroomsMatch) {
      extractedData.bedrooms = parseInt(bedroomsMatch[1]);
    }

    const bathroomsMatch = html.match(/(\d+)\s*bathrooms?/i);
    if (bathroomsMatch) {
      extractedData.bathrooms = parseInt(bathroomsMatch[1]);
    }

    // Common amenities to look for
    const commonAmenities = [
      'Wi-Fi', 'Kitchen', 'Parking', 'Pool', 'Air conditioning',
      'TV', 'Washer', 'Workspace', 'Hot water', 'Coffee maker',
      'Balcony', 'Beach access', 'Garden', 'Gym', 'Security'
    ];

    extractedData.amenities = commonAmenities.filter(amenity => 
      html.toLowerCase().includes(amenity.toLowerCase())
    );

    // Extract location from URL or page
    const locationMatch = html.match(/in\s+([^,]+),\s+([^<]+)/i);
    if (locationMatch && extractedData.location) {
      extractedData.location.city = locationMatch[1].trim();
      extractedData.location.province = locationMatch[2].trim();
    }

    // Deduplicate images
    if (extractedData.images) {
      extractedData.images = [...new Set(extractedData.images)].slice(0, 15);
    }

    console.log('Extracted data:', extractedData);

    return new Response(
      JSON.stringify(extractedData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error scraping Airbnb:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to scrape Airbnb listing';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});