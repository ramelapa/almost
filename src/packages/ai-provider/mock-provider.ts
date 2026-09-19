import { z } from "zod";
import { LLMProvider } from "./types";
import { Experience, ExperienceRouterOutput } from "../schemas";

export class MockLLMProvider implements LLMProvider {
  name = "mock";

  async generateStructured<T>(
    prompt: string,
    schema: z.ZodSchema<T>,
    _systemPrompt?: string
  ): Promise<T> {
    // If router output is requested
    if (this.isRouterSchema(schema)) {
      const routed = this.routePrompt(prompt);
      return routed as unknown as T;
    }

    // If experience generation is requested
    const experience = this.generateExperienceForPrompt(prompt);
    return experience as unknown as T;
  }

  private isRouterSchema(schema: z.ZodSchema<unknown>): boolean {
    const description = (schema as unknown as { description?: string }).description;
    return Boolean(description?.includes("router") || JSON.stringify(schema).includes("experienceType"));
  }

  public routePrompt(prompt: string, intensity = 3): ExperienceRouterOutput {
    const p = prompt.toLowerCase();

    // 1. Billion Dollar Mode
    if (
      p.includes("billion") ||
      p.includes("million") ||
      p.includes("spend it") ||
      p.includes("lottery") ||
      p.includes("infinite money")
    ) {
      return {
        experienceType: "billion-dollar",
        title: "Billion Dollar Spending Spree",
        intent: "extravagance",
        mood: "euphoric",
        intensity,
        duration: 4,
        theme: "gold-monolith",
      };
    }

    // 2. QuitCart (tempted impulse buy)
    if (
      p.includes("almost bought") ||
      p.includes("tempted") ||
      p.includes("quit cart") ||
      p.includes("impulse") ||
      p.includes("talk me out of") ||
      p.includes("$") ||
      p.includes("cart") ||
      p.includes("save my money")
    ) {
      return {
        experienceType: "quit-cart",
        title: "Impulse Intercept",
        intent: "prudence",
        mood: "grounded",
        intensity,
        duration: 3,
        theme: "minimal-editorial",
      };
    }

    // 3. DreamTrip (travel, flights, destinations)
    if (
      p.includes("switzerland") ||
      p.includes("travel") ||
      p.includes("trip") ||
      p.includes("vacation") ||
      p.includes("flight") ||
      p.includes("hotel") ||
      p.includes("paris") ||
      p.includes("tokyo") ||
      p.includes("alps") ||
      p.includes("amalfi") ||
      p.includes("visit") ||
      p.includes("destination")
    ) {
      return {
        experienceType: "dream-trip",
        title: "Fictional Expedition",
        intent: "wanderlust",
        mood: "adventurous",
        intensity,
        duration: 4,
        theme: "editorial-alpine",
      };
    }

    // 4. Five-Minute Escape (relaxation, peace, quiet, breathing)
    if (
      p.includes("peace") ||
      p.includes("relax") ||
      p.includes("exhausted") ||
      p.includes("bored") ||
      p.includes("overwhelmed") ||
      p.includes("restless") ||
      p.includes("quiet") ||
      p.includes("away from everything") ||
      p.includes("rain") ||
      p.includes("breath") ||
      p.includes("escape") ||
      p.includes("meditat")
    ) {
      return {
        experienceType: "five-minute-escape",
        title: "Sanctuary in the Rain",
        intent: "restoration",
        mood: "contemplative",
        intensity,
        duration: 5,
        theme: "zen-monochrome",
      };
    }

    // 5. ZeroCart (Default fantasy shopping: supercar, watch, telescope, espresso machine...)
    return {
      experienceType: "zero-cart",
      title: "The Ultimate Possession Simulation",
      intent: "aspiration",
      mood: "excited",
      intensity,
      duration: 4,
      theme: "luxury-obsidian",
    };
  }

  public generateExperienceForPrompt(prompt: string, intensity = 3): Experience {
    const route = this.routePrompt(prompt, intensity);
    const id = `exp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    switch (route.experienceType) {
      case "zero-cart":
        return this.createZeroCartExperience(id, prompt, intensity);
      case "dream-trip":
        return this.createDreamTripExperience(id, prompt, intensity);
      case "five-minute-escape":
        return this.createFiveMinuteEscapeExperience(id, prompt, intensity);
      case "billion-dollar":
        return this.createBillionDollarExperience(id, prompt, intensity);
      case "quit-cart":
        return this.createQuitCartExperience(id, prompt, intensity);
    }
  }

  // Experience 1: ZeroCart
  private createZeroCartExperience(id: string, prompt: string, intensity: number): Experience {
    const p = prompt.toLowerCase();
    let product = "Aurelius X9 Hypercar";
    let category = "sports-car";
    let fictionalPrice = 241300;
    let subtitle = "Carbon-fiber monocoque with dual quantum turbos";
    let image = "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1200&auto=format&fit=crop";
    let cartDescription = "Review your bespoke hypercar specification.";
    let options = [
      { id: "opt-1", label: "Matte Obsidian & Liquid Gold Accents", price: 18500, highlight: "Curated" },
      { id: "opt-2", label: "Active Carbon-Fiber Aero Pack", price: 18000 },
      { id: "opt-3", label: "Titanium Sport Exhaust with Blue Flame Tune", price: 9200 },
      { id: "opt-4", label: "Track Telemetry & Ceramic Brakes", price: 15000 },
      { id: "opt-5", label: "Laser-Etched Signature on Sill", price: 3500 },
    ];
    let stats = [
      { label: "Real money spent", value: "$0" },
      { label: "Garage space used", value: "0 sq ft" },
      { label: "Insurance premium", value: "$0/mo" },
      { label: "Regret tomorrow", value: "probably $0" },
    ];

    let background: string = "obsidian";

    if (p.includes("telescope") || p.includes("space") || p.includes("astronomy") || p.includes("galaxies") || p.includes("observing")) {
      category = "telescope";
      product = "Celestron Deep-Space Quantum Refractor";
      fictionalPrice = 24900;
      subtitle = "Cryo-cooled apochromatic fluorite optics capable of resolving distant galaxies";
      image = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop";
      cartDescription = "Review your deep-space observing observatory configuration.";
      background = "celestial-deep-space";
      options = [
        { id: "t-1", label: "Harmonic Drive Computerized Equatorial Mount", price: 6500, highlight: "Curated" },
        { id: "t-2", label: "Cryo-Cooled BSI Deep-Sky Astrophotography Camera", price: 4200 },
        { id: "t-3", label: "2-Inch Ultra-Wide 100° Nitrogen-Purged Eyepieces", price: 1850 },
        { id: "t-4", label: "Robotic Observatory Dome Automation Suite", price: 12000 },
        { id: "t-5", label: "Hydrogen-Alpha Solar Imaging Filter Array", price: 3400 },
      ];
      stats = [
        { label: "Real money spent", value: "$0" },
        { label: "Moons resolved", value: "All of them" },
        { label: "Light travel time", value: "2.5M light yrs" },
        { label: "Storage space", value: "Mental rooftop" },
      ];
    } else if (p.includes("watch") || p.includes("rolex") || p.includes("tourbillon") || p.includes("patek")) {
      category = "watch";
      product = "Chronos Stellaris Tourbillon";
      fictionalPrice = 86500;
      subtitle = "Hand-finished meteorite dial with gravitational tourbillon balance";
      image = "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop";
      cartDescription = "Review your high-horology tourbillon commission.";
      options = [
        { id: "w-1", label: "Muonionalusta Meteorite Dial Inlay", price: 12500, highlight: "Curated" },
        { id: "w-2", label: "Solid 950 Platinum Mesh Bracelet", price: 18000 },
        { id: "w-3", label: "Exhibition Double-Curved Sapphire Caseback", price: 4500 },
        { id: "w-4", label: "Hand-Guilloché 22k Rose Gold Micro-Rotor", price: 6000 },
        { id: "w-5", label: "Hand-Stitched Alligator Deployment Strap", price: 2800 },
      ];
      stats = [
        { label: "Real money spent", value: "$0" },
        { label: "Escapement beat", value: "28,800 vph" },
        { label: "Safe deposit box", value: "Unneeded" },
        { label: "Timekeeping accuracy", value: "Perpetual" },
      ];
    } else if (p.includes("espresso") || p.includes("coffee")) {
      category = "home-tech";
      product = "La Marzocco Monolith Gold Espresso Rig";
      fictionalPrice = 9800;
      subtitle = "Dual saturated boilers with aerospace-grade brass groupheads";
      image = "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop";
      cartDescription = "Review your bespoke coffee laboratory configuration.";
      options = [
        { id: "e-1", label: "Integrated Gravimetric Smart Scales & PID Core", price: 1800, highlight: "Curated" },
        { id: "e-2", label: "Titanium Flat Burr Planetary Grinder Companion", price: 3400 },
        { id: "e-3", label: "Custom Walnut & Brushed Brass Accent Trim", price: 1200 },
        { id: "e-4", label: "Commercial Plumbed Rotary Vane Pump", price: 2100 },
      ];
      stats = [
        { label: "Real money spent", value: "$0" },
        { label: "Extraction pressure", value: "9.0 bar" },
        { label: "Counter space used", value: "0 sq ft" },
        { label: "Morning satisfaction", value: "100%" },
      ];
    } else if (p.includes("audio") || p.includes("sound") || p.includes("speaker") || p.includes("theater")) {
      category = "home-tech";
      product = "Monolith Spatial Audio Rig";
      fictionalPrice = 48000;
      subtitle = "Architectural spatial acoustic system with beryllium transducer towers";
      image = "https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=1200&auto=format&fit=crop";
      cartDescription = "Review your architectural acoustic system specification.";
      options = [
        { id: "a-1", label: "Beryllium Transducer Floor-Standing Acoustic Towers", price: 14000, highlight: "Curated" },
        { id: "a-2", label: "Pure Class-A Monoblock Balanced Amplifiers", price: 12500 },
        { id: "a-3", label: "Parametric Room Acoustic Correction Sensor Suite", price: 4500 },
        { id: "a-4", label: "Sub-Bass Magnetic Levitation Floor Decouplers", price: 3200 },
      ];
      stats = [
        { label: "Real money spent", value: "$0" },
        { label: "Acoustic distortion", value: "0.001%" },
        { label: "Living room clutter", value: "0 sq ft" },
        { label: "Harmonic depth", value: "Sublime" },
      ];
    } else if (p.includes("house") || p.includes("home") || p.includes("mansion") || p.includes("villa") || p.includes("penthouse") || p.includes("architecture")) {
      category = "dream-home";
      product = "Cliffside Minimalist Sanctuary";
      fictionalPrice = 18500000;
      subtitle = "Cantilevered architectural marvel hovering over ocean cliffs with zero clutter";
      image = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop";
      cartDescription = "Review your architectural estate blueprint.";
      options = [
        { id: "h-1", label: "Suspended Cantilevered Heated Infinity Pool", price: 850000, highlight: "Curated" },
        { id: "h-2", label: "Electrochromic Privacy Glass Curtain Wall", price: 650000 },
        { id: "h-3", label: "Geothermal Subterranean Climate Sphere", price: 420000 },
        { id: "h-4", label: "Rooftop Whisper Helipad & Solar Tile Canopy", price: 380000 },
        { id: "h-5", label: "Sub-Level 1,200-Bottle Sommelier Vault", price: 240000 },
      ];
      stats = [
        { label: "Real money spent", value: "$0" },
        { label: "Property tax owed", value: "$0.00" },
        { label: "Maintenance headaches", value: "0" },
        { label: "Aesthetic peace", value: "100%" },
      ];
    }

    return {
      id,
      type: "zero-cart",
      title: `${product} (Fictional Possession)`,
      subtitle: `${subtitle} • Fictional Simulation • $0 Spent`,
      theme: {
        style: "luxury-obsidian",
        intensity,
        background,
        accentColor: category === "telescope" ? "#38bdf8" : "#f59e0b",
      },
      stages: [
        {
          id: "stage-discover",
          type: "scene",
          title: "Engineered for Obscene Desire",
          subtitle: product,
          description: `You are looking at the pinnacle of human excess. Every contour has been honed to provoke envy, yet right now, it exists solely in your mind.`,
          media: {
            type: "image",
            url: image,
            alt: product,
            caption: `${product} — Simulated Display Asset`,
          },
        },
        {
          id: "stage-customize",
          type: "customize",
          title: "Bespoke Specification",
          description: `Select your custom enhancements for this ${product}. Real cost: $0.`,
          options,
        },
        {
          id: "stage-cart",
          type: "cart",
          title: "Imaginary Bag Summary",
          description: `${cartDescription} Take a deep breath. Notice how clean your bank account remains ($0).`,
          options: [
            { id: "base", label: `Base ${product}`, price: fictionalPrice },
          ],
        },
        {
          id: "stage-checkout",
          type: "checkout",
          title: "Commit to the Imaginary Purchase — $0",
          description: "Slide to finalize. No credit card requested. Fictional transaction ($0).",
        },
        {
          id: "stage-reflection",
          type: "reflection",
          title: "Congratulations. It is yours.",
          subtitle: `Your imaginary ${product} has been delivered to your mental garage.`,
        },
      ],
      conclusion: {
        headline: "Congratulations. Nothing happened.",
        message: `Your imaginary ${product} is officially yours. You experienced the surge of acquisition without the weight of possession. Real expenditure: $0.`,
        fictionalPrice,
        avoidedAmount: fictionalPrice,
        certificateTitle: `Certificate of Fictional Acquisition — ${product}`,
        meTooPrompt: `Someone just simulated acquiring an imaginary ${product} ($0 spent).`,
        stats,
      },
      metadata: {
        category,
        basePrice: fictionalPrice,
        baseProduct: product,
        imageUrl: image,
      },
    };
  }

  // Experience 2: DreamTrip
  private createDreamTripExperience(id: string, prompt: string, intensity: number): Experience {
    const p = prompt.toLowerCase();
    let destination = "Switzerland (Alpine Sanctuary)";
    let origin = "Washington (IAD)";
    let hotel = "Alpine Cloud Resort & Thermal Spa";
    let flightSuite = "Air France La Première Fictional Suite";
    let image = "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=1200&auto=format&fit=crop";

    let day1Options = [
      { id: "d1-act-1", label: "Lake Lucerne Private Steamer & Glacier Walk", price: 1200 },
      { id: "d1-act-2", label: "Historic Old Town Private Architectural Tour", price: 450 },
    ];
    let day2Options = [
      { id: "d2-act-1", label: "Mountain Railway to Jungfraujoch & Fondue", price: 950 },
      { id: "d2-act-2", label: "Glacier 3000 Suspension Bridge Expedition", price: 800 },
    ];
    let day3Options = [
      { id: "d3-act-1", label: "Sunset Paragliding Over Interlaken Meadows", price: 650 },
      { id: "d3-act-2", label: "Private Alpine Thermal Bath & Cedar Sauna", price: 500 },
    ];

    if (p.includes("tokyo") || p.includes("japan") || p.includes("kyoto")) {
      destination = "Kyoto & Tokyo, Japan";
      origin = "San Francisco (SFO)";
      hotel = "Hoshinoya Kyoto Cedar Villa";
      flightSuite = "ANA The Room First Class Suite";
      image = "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop";
      day1Options = [
        { id: "d1-act-1", label: "Private Arashiyama Bamboo Grove Sunset Walk", price: 600 },
        { id: "d1-act-2", label: "Traditional Gion Tea Ceremony with Master Whisk", price: 400 },
      ];
      day2Options = [
        { id: "d2-act-1", label: "Shinkansen Gran Class to Mount Fuji Vista", price: 850 },
        { id: "d2-act-2", label: "Private Tsukiji Outer Market Chef Masterclass", price: 750 },
      ];
      day3Options = [
        { id: "d3-act-1", label: "Nighttime Ginza Jazz Bar & Rare Whisky Flight", price: 500 },
        { id: "d3-act-2", label: "Dawn Meditation at Fushimi Inari Torii Paths", price: 350 },
      ];
    } else if (p.includes("amalfi") || p.includes("italy")) {
      destination = "Amalfi Coast & Positano, Italy";
      origin = "New York (JFK)";
      hotel = "Le Sirenuse Cliffside Suite";
      flightSuite = "Emirates A380 Shower Suite";
      image = "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1200&auto=format&fit=crop";
      day1Options = [
        { id: "d1-act-1", label: "Riva Speedboat Cruise to Faraglioni Rocks, Capri", price: 1400 },
        { id: "d1-act-2", label: "Private Cliffside Lemon Grove Limoncello Tasting", price: 380 },
      ];
      day2Options = [
        { id: "d2-act-1", label: "Path of the Gods Guided Panoramic Hike", price: 600 },
        { id: "d2-act-2", label: "Ravello Villa Cimbrone Private Sunset Concert", price: 900 },
      ];
      day3Options = [
        { id: "d3-act-1", label: "Positano Beachfront Michelin Seafood Dinner", price: 750 },
        { id: "d3-act-2", label: "Private Ceramic Painting & Coastal Vineyard Tour", price: 450 },
      ];
    }

    return {
      id,
      type: "dream-trip",
      title: `Expedition to ${destination} (Fictional Trip)`,
      subtitle: `${origin} → ${destination} • Fictional Itinerary • $0 Cost`,
      theme: {
        style: "editorial-alpine",
        intensity,
        background: "glacial",
        accentColor: "#06b6d4",
      },
      stages: [
        {
          id: "stage-flight",
          type: "choice",
          title: "Flight Cabin Selection",
          description: "Select your imaginary seat across the skies.",
          options: [
            { id: "suite-1", label: flightSuite, description: "Krug 2008 vintage upon boarding, cashmere pyjamas", price: 14500, highlight: "Recommended" },
            { id: "suite-2", label: "Private Supersonic Concorde II", description: "Mach 2.2 cruising altitude, arrive in 3.5 hours", price: 28000 },
          ],
          media: {
            type: "image",
            url: image,
            alt: destination,
          },
        },
        {
          id: "stage-hotel",
          type: "choice",
          title: "Sanctuary Haven",
          description: `Where will you wake up each morning in ${destination}?`,
          options: [
            { id: "hotel-1", label: hotel, description: "Private heated infinity pool facing the scenery, cedar sauna", price: 8400, highlight: "Top Rated" },
            { id: "hotel-2", label: "Historic Manor Chalet", description: "Fireplace lit nightly, vintage wine cellar access", price: 6200 },
          ],
        },
        {
          id: "stage-itinerary",
          type: "choice",
          title: "Craft Your Multi-Day Itinerary",
          description: "Select custom experiences for Day 1, Day 2, and Day 3. Each day is distinct and all are included in your journey.",
          options: [
            { id: "day-1", label: `Day 1: ${day1Options[0].label}`, price: day1Options[0].price, category: "Day 1" },
            { id: "day-2", label: `Day 2: ${day2Options[0].label}`, price: day2Options[0].price, category: "Day 2" },
            { id: "day-3", label: `Day 3: ${day3Options[0].label}`, price: day3Options[0].price, category: "Day 3" },
          ],
          customData: {
            days: [
              { day: 1, title: "Day 1: Arrival & Exploration", options: day1Options },
              { day: 2, title: "Day 2: Peak Expedition", options: day2Options },
              { day: 3, title: "Day 3: Panorama & Sanctuary", options: day3Options },
            ],
          },
        },
        {
          id: "stage-review",
          type: "scene",
          title: "Complete Expedition Review",
          subtitle: `${destination} — 7-Day Curated Odyssey`,
          description: "Review your curated flight, sanctuary haven, and daily itinerary. Zero booking fees, zero real transactions.",
        },
        {
          id: "stage-checkout",
          type: "checkout",
          title: "BOOK FICTIONAL TRIP — $0",
          description: "Finalize your fictional booking. Generate your instant VIP simulation boarding pass ($0).",
        },
        {
          id: "stage-reflection",
          type: "reflection",
          title: "Your Boarding Pass is Issued",
          subtitle: "Ready for departure whenever your mind desires a quiet getaway. Fictional ticket.",
        },
      ],
      conclusion: {
        headline: "You have arrived without moving.",
        message: `Your complete fictional expedition to ${destination} is booked. Real money spent: $0. Jetlag: zero hours. Packing anxiety: zero percent.`,
        fictionalPrice: 28400,
        avoidedAmount: 28400,
        certificateTitle: `Official Fictional Boarding Pass — ${destination}`,
        meTooPrompt: `Someone just booked a fictional luxury trip to ${destination} for $0.`,
        stats: [
          { label: "Flight & Stay cost", value: "$0" },
          { label: "Airport security wait", value: "0 mins" },
          { label: "Luggage lost", value: "0 bags" },
          { label: "Wanderlust fulfilled", value: "100%" },
        ],
      },
      metadata: {
        origin,
        destination,
        hotel,
        flightSuite,
        day1Options,
        day2Options,
        day3Options,
        basePrice: 28400,
      },
    };
  }

  // Experience 3: Five-Minute Escape
  private createFiveMinuteEscapeExperience(id: string, prompt: string, intensity: number): Experience {
    const p = prompt.toLowerCase();
    let place = "Kyoto Rain Café";
    const drinkPrompt = "Choose your brew";
    let drinkOptions = [
      { id: "d-1", label: "Ceremonial Uji Matcha", description: "Whisked to emerald velvet foam", price: 0 },
      { id: "d-2", label: "Dark Roast Sumiyaki Coffee", description: "Smoky, slow drip over charcoal", price: 0 },
      { id: "d-3", label: "Roasted Hojicha Tea", description: "Warm, toasty aroma in handmade ceramic cup", price: 0 },
    ];
    const seatOptions = [
      { id: "s-1", label: "Window Seat Against the Glass", description: "Watch raindrops race down the pane", price: 0 },
      { id: "s-2", label: "Quiet Counter Corner", description: "Listen to the gentle hiss of boiling water", price: 0 },
      { id: "s-3", label: "Velvet Booth in the Back", description: "Submerged in warm amber shadows", price: 0 },
    ];
    let image = "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1200&auto=format&fit=crop";

    if (p.includes("cabin") || p.includes("snow") || p.includes("mountain")) {
      place = "Snowy Mountain Cabin";
      image = "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop";
      drinkOptions = [
        { id: "d-1", label: "Spiced Hot Cider", description: "Cinnamon stick and star anise", price: 0 },
        { id: "d-2", label: "Single Malt Peated Scotch", description: "Warm honey and gentle smoke", price: 0 },
        { id: "d-3", label: "Chamomile & Pine Honey", description: "Calming herbal infusion", price: 0 },
      ];
    } else if (p.includes("beach") || p.includes("ocean") || p.includes("sea")) {
      place = "Quiet Twilight Beach";
      image = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop";
    }

    return {
      id,
      type: "five-minute-escape",
      title: `${place} (Fictional Escape)`,
      subtitle: "A silent simulated interlude away from the noise of the world • $0",
      theme: {
        style: "zen-monochrome",
        intensity,
        background: "rain",
        accentColor: "#10b981",
      },
      stages: [
        {
          id: "stage-seat",
          type: "choice",
          title: "Choose your seat",
          description: "Take a breath. Settle into the room.",
          options: seatOptions,
          media: {
            type: "image",
            url: image,
            alt: place,
          },
        },
        {
          id: "stage-drink",
          type: "choice",
          title: drinkPrompt,
          description: "What shall we prepare for your imagination while you sit here in silence?",
          options: drinkOptions,
        },
        {
          id: "stage-scene",
          type: "scene",
          title: "Five Quiet Minutes",
          description: "Close your eyes or watch the ambient pulse. Let your shoulders drop.",
        },
        {
          id: "stage-reflection",
          type: "reflection",
          title: "The interlude is complete.",
          subtitle: "Your drink will never arrive. Your wallet kept $8.50. You gained five quiet minutes.",
        },
      ],
      conclusion: {
        headline: "You gained five quiet minutes.",
        message: "Your drink will never arrive. Your wallet kept $8.50. The noise outside was paused.",
        fictionalPrice: 8.5,
        avoidedAmount: 8.5,
        certificateTitle: `Five-Minute Escape Token — ${place}`,
        meTooPrompt: `Someone is taking a fictional five-minute escape right now.`,
        stats: [
          { label: "Quiet minutes gained", value: "5.0 mins" },
          { label: "Real money spent", value: "$0.00" },
          { label: "Cortisol reduction", value: "-34%" },
          { label: "Messages answered", value: "0" },
        ],
      },
      metadata: {
        place,
      },
    };
  }

  // Experience 4: Billion Dollar Mode
  private createBillionDollarExperience(id: string, _prompt: string, intensity: number): Experience {
    return {
      id,
      type: "billion-dollar",
      title: "Billion Dollar Mode",
      subtitle: "Starting Fictional Balance: $1,000,000,000 (Imaginary Funds). Spend it.",
      theme: {
        style: "gold-monolith",
        intensity,
        background: "midnight-gold",
        accentColor: "#fbbf24",
      },
      stages: [
        {
          id: "stage-spree",
          type: "choice",
          title: "The Extravagance Catalog (Fictional Assets)",
          description: "Every item is ready for instant imaginary acquisition. Add as many as your billion can endure.",
          options: [
            { id: "b-1", label: "Sovereign Polynesian Atoll Island", description: "12 private white-sand beaches, airstrip, coral reef preserve", price: 145000000 },
            { id: "b-2", label: "450-ft Mega Yacht with Submarine Garage", description: "Helipad, two swimming pools, 24-person submarine", price: 320000000 },
            { id: "b-3", label: "Historic Premier League Football Club", description: "Stadium, academy, global broadcast rights", price: 420000000 },
            { id: "b-4", label: "Private Lunar Colony Dome", description: "Pressurized geodesic biodome overlooking Earth", price: 250000000 },
            { id: "b-5", label: "Manhattan Art-Deco Penthouse Skyscraper", description: "Top 4 floors overlooking Central Park with cantilevered pool", price: 180000000 },
            { id: "b-6", label: "Daft Punk Private Lawn Reunion", description: "One-night private pyramid concert in your backyard", price: 35000000 },
            { id: "b-7", label: "Fleet of 10 Bespoke Hypercars", description: "Carbon-fiber bespoke fleet with personalized garage", price: 40000000 },
          ],
        },
        {
          id: "stage-checkout",
          type: "checkout",
          title: "Authorize Imaginary Wire Transfer — $0",
          description: "Confirm simulated transaction from your fictional sovereign trust ($0 real money).",
        },
        {
          id: "stage-reflection",
          type: "reflection",
          title: "Transfer Finalized",
          subtitle: "The imaginary balance has vanished. The bank account remains completely intact.",
        },
      ],
      conclusion: {
        headline: "You spent the billion.",
        message: "You experienced the dizzying sensation of unlimited capital without a single audit.",
        fictionalPrice: 843220000,
        avoidedAmount: 843220000,
        certificateTitle: "Billionaire Spending Certificate (Fictional)",
        meTooPrompt: "Someone just spent a fictional $843 million in two minutes.",
        stats: [
          { label: "Imaginary amount spent", value: "$843,220,000" },
          { label: "Actual financial damage", value: "$0.00" },
          { label: "IRS inquiry probability", value: "0.0%" },
          { label: "Satisfaction quotient", value: "Maximal" },
        ],
      },
    };
  }

  // Experience 5: QuitCart
  private createQuitCartExperience(id: string, prompt: string, intensity: number): Experience {
    let itemName = "Flagship Titanium Smartphone";
    let basePrice = 1499;
    let userStatedPrice: number | undefined = undefined;

    // Detect price if user mentioned a dollar amount
    const match = prompt.match(/\$?([0-9,]+)/);
    if (match) {
      const parsed = parseFloat(match[1].replace(/,/g, ""));
      if (!isNaN(parsed) && parsed > 0) {
        basePrice = parsed;
        userStatedPrice = parsed;
      }
    }

    if (prompt.toLowerCase().includes("espresso") || prompt.toLowerCase().includes("coffee")) {
      itemName = "Barista Pro Dual-Boiler Espresso Machine";
      if (!match) basePrice = 2199;
    } else if (prompt.toLowerCase().includes("laptop") || prompt.toLowerCase().includes("macbook")) {
      itemName = "Pro Studio Laptop (Max Spec)";
      if (!match) basePrice = 3499;
    } else if (prompt.toLowerCase().includes("watch") || prompt.toLowerCase().includes("shoes")) {
      itemName = "Designer Luxury Accessory";
      if (!match) basePrice = 850;
    }

    const hasUserStatedPrice = userStatedPrice !== undefined;

    return {
      id,
      type: "quit-cart",
      title: `Impulse Intercept: ${itemName} (Shopping Simulation)`,
      subtitle: userStatedPrice !== undefined
        ? `Stated temptation: $${userStatedPrice.toLocaleString()} • Walk through the register, then walk away clean with $0 spent.`
        : `Illustrative retail reference: $${basePrice.toLocaleString()} • Walk through the register, then walk away clean with $0 spent.`,
      theme: {
        style: "minimal-editorial",
        intensity,
        background: "charcoal",
        accentColor: "#f43f5e",
      },
      stages: [
        {
          id: "stage-config",
          type: "customize",
          title: `Configure Your ${itemName} (Simulation)`,
          description: "Select finish and optional tiers to explore buying euphoria with no initial selections.",
          options: [
            { id: "c-1", label: "1TB Ultra Capacity Tier", price: 300, highlight: "Optional" },
            { id: "c-2", label: "Matte Cosmic Black Anodized Finish", price: 0 },
            { id: "c-3", label: "3-Year Accidental Damage Protection", price: 279 },
            { id: "c-4", label: "Expedited Next-Morning Drone Delivery", price: 45 },
          ],
        },
        {
          id: "stage-checkout",
          type: "checkout",
          title: "COMMIT TO SIMULATED CHECKOUT",
          description: "Click to authorize simulated payment. No real money will be charged.",
        },
        {
          id: "stage-reflection",
          type: "reflection",
          title: "ORDER CANCELED SUCCESSFULLY",
          subtitle: userStatedPrice !== undefined
            ? `You kept your: $${userStatedPrice.toLocaleString()}. Actual purchase: $0.`
            : `Simulated cart avoided: $${basePrice.toLocaleString()}. Actual purchase: $0.`,
        },
      ],
      conclusion: {
        headline: "ORDER CANCELED SUCCESSFULLY",
        message: userStatedPrice !== undefined
          ? `You walked right up to the edge of the checkout button and stepped back. You kept your $${userStatedPrice.toLocaleString()}.`
          : `You walked right up to the edge of the checkout button and stepped back with $0 spent.`,
        fictionalPrice: basePrice,
        avoidedAmount: basePrice,
        certificateTitle: `Temptation Intercept Certificate — ${itemName}`,
        meTooPrompt: `Someone just walked away from a simulated $${basePrice.toLocaleString()} checkout with $0 spent.`,
        stats: [
          {
            label: hasUserStatedPrice ? "You kept" : "Simulated spending avoided",
            value: `$${basePrice.toLocaleString()}`,
          },
          { label: "Actual purchase", value: "$0.00" },
          { label: "Buyer remorse tomorrow", value: "0%" },
          { label: "Mental clarity gained", value: "+100%" },
        ],
      },
      metadata: {
        itemName,
        basePrice,
        userStatedPrice,
        hasUserStatedPrice,
      },
    };
  }
}
