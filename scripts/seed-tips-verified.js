const tips = [
  // SF - Mission
  { street_name: "Valencia St (16th-22nd)", neighborhood: "Mission", city: "sf", difficulty: "hard", parking_type: "metered", best_times: "After 10pm or early morning", notes: "Popular restaurant/bar strip. High turnover. Try one block west on Guerrero or Valencia for better odds." },
  { street_name: "Guerrero St (near 24th)", neighborhood: "Mission", city: "sf", difficulty: "moderate", parking_type: "mixed", best_times: "Weekday afternoons", notes: "Quieter than Valencia. Residential side of the corridor. Check signs for street cleaning." },
  { street_name: "Mission St (16th-25th)", neighborhood: "Mission", city: "sf", difficulty: "moderate", parking_type: "metered", best_times: "Weekday midday", notes: "Main drag with moderate meter turnover. Easier than Valencia one block over." },
  { street_name: "24th St (between streets)", neighborhood: "Mission", city: "sf", difficulty: "hard", parking_type: "metered", best_times: "Before 9am or after 10pm", notes: "Commercial area with mixed use. Very competitive during peak hours." },

  // SF - SOMA
  { street_name: "3rd St (near Moscone)", neighborhood: "SOMA", city: "sf", difficulty: "moderate", parking_type: "metered", best_times: "Weekday afternoons", notes: "Event activity varies. When Moscone has events, nearby parking fills fast." },
  { street_name: "Harrison St (10th-12th)", neighborhood: "SOMA", city: "sf", difficulty: "easy", parking_type: "free", best_times: "Anytime", notes: "Residential side of SOMA. Less touristy. Generally reliable free parking." },
  { street_name: "Folsom St (11th-14th)", neighborhood: "SOMA", city: "sf", difficulty: "moderate", parking_type: "metered", best_times: "Daytime weekdays", notes: "Quieter than Mission. Nightlife area gets busier evenings." },

  // SF - Downtown
  { street_name: "Market St (lower)", neighborhood: "Downtown", city: "sf", difficulty: "hard", parking_type: "metered", best_times: "Late evening only", notes: "Pedestrian heavy. Street parking tight. Paid garages ubiquitous but pricey." },
  { street_name: "Sutter St (near Powell)", neighborhood: "Downtown", city: "sf", difficulty: "moderate", parking_type: "metered", best_times: "Early morning before 10am", notes: "Commercial but less chaotic than Market. Tourist corridor." },
  { street_name: "Pine St (financial district)", neighborhood: "Downtown", city: "sf", difficulty: "hard", parking_type: "metered", best_times: "After 6pm weekdays, most weekends", notes: "Heavy daytime. Office workers dominate. Try after business hours." },

  // SF - Marina
  { street_name: "Marina Blvd", neighborhood: "Marina", city: "sf", difficulty: "moderate", parking_type: "free", best_times: "Weekday afternoons", notes: "Free 1-hour parking with scenic bay views. Waterfront popular on weekends." },
  { street_name: "Chestnut St (Fillmore-Scott)", neighborhood: "Marina", city: "sf", difficulty: "moderate", parking_type: "metered", best_times: "Weekday mornings/midday", notes: "Restaurant/retail corridor. Evenings and weekends get busy." },
  { street_name: "Filbert St (Gough-Franklin)", neighborhood: "Marina", city: "sf", difficulty: "easy", parking_type: "free", best_times: "Anytime", notes: "Residential. One block back from main drag. Much quieter." },

  // SF - Castro
  { street_name: "Castro St (Market-19th)", neighborhood: "Castro", city: "sf", difficulty: "hard", parking_type: "metered", best_times: "Weekday 10am-2pm", notes: "Compact commercial strip. Very tight. Weekends = plan alternatives." },
  { street_name: "18th St (Collingwood-Diamond)", neighborhood: "Castro", city: "sf", difficulty: "moderate", parking_type: "metered", best_times: "Weekday mornings", notes: "More residential feel than Castro St. Parallel option with less competition." },

  // SF - Richmond
  { street_name: "Clement St (5th-15th Ave)", neighborhood: "Richmond", city: "sf", difficulty: "moderate", parking_type: "metered", best_times: "Weekday afternoons", notes: "Diverse retail/dining. Less touristy than downtown. Generally cooperative availability." },
  { street_name: "Geary Blvd (outer)", neighborhood: "Richmond", city: "sf", difficulty: "easy", parking_type: "free", best_times: "Anytime", notes: "Outer Richmond = residential calm. Very predictable free parking." },

  // SF - Sunset
  { street_name: "Judah St (9th-19th Ave)", neighborhood: "Sunset", city: "sf", difficulty: "moderate", parking_type: "metered", best_times: "Weekday 11am-4pm", notes: "Zoo/beach nearby = weekend traffic. Weekdays much easier." },
  { street_name: "Irving St (9th-15th Ave)", neighborhood: "Sunset", city: "sf", difficulty: "easy", parking_type: "free", best_times: "Anytime", notes: "Free residential. Sunset is generally easier than Inner Sunset due to lower density." },

  // SF - Hayes Valley
  { street_name: "Hayes St (Gough-Laguna)", neighborhood: "Hayes Valley", city: "sf", difficulty: "hard", parking_type: "metered", best_times: "Weekday 9-10am only", notes: "Very popular restaurant/bar area. Evenings/weekends = almost impossible." },
  { street_name: "Octavia St (Hayes-Market)", neighborhood: "Hayes Valley", city: "sf", difficulty: "moderate", parking_type: "free", best_times: "Weekday mornings/midday", notes: "Free residential. Better bet than Hayes St itself. One block makes a big difference." },

  // SF - North Beach
  { street_name: "Columbus Ave (Broadway-Lombard)", neighborhood: "North Beach", city: "sf", difficulty: "hard", parking_type: "metered", best_times: "Before 9am or after 10pm", notes: "Tourist corridor + night clubs. Tight. Early morning or late night only." },
  { street_name: "Grant Ave (Union-Pacific)", neighborhood: "North Beach", city: "sf", difficulty: "hard", parking_type: "metered", best_times: "Very early morning", notes: "Chinatown border. Pedestrian heavy. Rush hour = avoid entirely." },

  // Oakland - Downtown
  { street_name: "Broadway (10th-14th)", neighborhood: "Downtown", city: "oakland", difficulty: "moderate", parking_type: "metered", best_times: "Weekday 10am-3pm", notes: "Theater/bar corridor. Meter parking available. Evenings = events make it competitive." },
  { street_name: "14th St (Broadway-Telegraph)", neighborhood: "Downtown", city: "oakland", difficulty: "easy", parking_type: "metered", best_times: "Anytime", notes: "One block off Broadway. Much easier. Same access to amenities." },
  { street_name: "Telegraph Ave (12th-16th)", neighborhood: "Downtown", city: "oakland", difficulty: "moderate", parking_type: "metered", best_times: "Weekday midday", notes: "Main drag through downtown. Uptown district (20th+) gets busier at night." },

  // Oakland - Lake Merritt
  { street_name: "Lakeshore Ave (near lake)", neighborhood: "Lake Merritt", city: "oakland", difficulty: "easy", parking_type: "free", best_times: "Anytime", notes: "Free residential around the lake. Popular with walkers/joggers but spacious." },
  { street_name: "19th St (near lake)", neighborhood: "Lake Merritt", city: "oakland", difficulty: "moderate", parking_type: "free", best_times: "Weekday mornings", notes: "Free parking. Weekends = joggers/families compete. South side quieter." },
  { street_name: "Lakeside Dr (south side)", neighborhood: "Lake Merritt", city: "oakland", difficulty: "easy", parking_type: "free", best_times: "Anytime", notes: "Free. South side of lake always quieter than north." },

  // Oakland - Rockridge
  { street_name: "College Ave (near 51st)", neighborhood: "Rockridge", city: "oakland", difficulty: "hard", parking_type: "metered", best_times: "After 8pm or before 10am", notes: "Restaurant/retail hub. Peak hours = very tight. Residential areas behind offer better odds." },
  { street_name: "Shattuck Ave (48th-54th)", neighborhood: "Rockridge", city: "oakland", difficulty: "moderate", parking_type: "metered", best_times: "Weekday morning/midday", notes: "Parallel to College. Less packed. Good alternative." },
  { street_name: "Claremont Ave (49th-53rd)", neighborhood: "Rockridge", city: "oakland", difficulty: "easy", parking_type: "free", best_times: "Anytime", notes: "Free residential. One block back from College Ave = dramatically easier." },

  // Oakland - Piedmont/Fruitvale
  { street_name: "Grand Ave (near MacArthur)", neighborhood: "Piedmont", city: "oakland", difficulty: "moderate", parking_type: "free", best_times: "Weekday midday", notes: "Free mixed-use. Growing restaurant scene. Still relatively accessible." },
  { street_name: "Piedmont Ave (40th-45th)", neighborhood: "Piedmont", city: "oakland", difficulty: "moderate", parking_type: "metered", best_times: "Weekday 10am-3pm", notes: "Quiet neighborhood. Less pressure than downtown. Consistent availability." },
  { street_name: "34th Ave (International-Fruitvale)", neighborhood: "Fruitvale", city: "oakland", difficulty: "easy", parking_type: "free", best_times: "Anytime", notes: "Free. Cultural district. Less touristed. Very accessible." },

  // Oakland - Jack London District
  { street_name: "Washington St (1st-3rd)", neighborhood: "Jack London", city: "oakland", difficulty: "moderate", parking_type: "metered", best_times: "Weekday afternoons", notes: "Waterfront restaurant/bar area. Weekend brunch = busier. Weekday easier." },
  { street_name: "Clay St (1st-2nd)", neighborhood: "Jack London", city: "oakland", difficulty: "easy", parking_type: "metered", best_times: "Weekday mornings", notes: "Industrial feel. Less demand than Washington. Good parallel option." },

  // Oakland - Uptown
  { street_name: "20th St (Telegraph-Lake)", neighborhood: "Uptown", city: "oakland", difficulty: "hard", parking_type: "metered", best_times: "Weekday 10-11am", notes: "Arts/nightlife hub. Very busy Wed-Sat nights. Daytime more feasible." },
  { street_name: "21st St (Franklin-Lake)", neighborhood: "Uptown", city: "oakland", difficulty: "moderate", parking_type: "metered", best_times: "Weekday mornings", notes: "One block from 20th St = noticeably less pressure. Weekday reliable." },

  // Oakland - Temescal
  { street_name: "Telegraph Ave (48th-53rd)", neighborhood: "Temescal", city: "oakland", difficulty: "moderate", parking_type: "metered", best_times: "Weekday afternoons", notes: "Retail/restaurant mix. Thu-Sat evenings busier. Weekday accessible." },
  { street_name: "49th St (Telegraph-Shattuck)", neighborhood: "Temescal", city: "oakland", difficulty: "easy", parking_type: "free", best_times: "Anytime", notes: "Free residential. Consistent. Back streets always better than main drag." },

  // Oakland - Chinatown
  { street_name: "8th St (Webster-Broadway)", neighborhood: "Chinatown", city: "oakland", difficulty: "hard", parking_type: "metered", best_times: "Weekday 9-10am only", notes: "Busy commercial. Weekends especially packed. Early morning only bet." },
  { street_name: "11th St (Broadway-Telegraph)", neighborhood: "Chinatown", city: "oakland", difficulty: "moderate", parking_type: "metered", best_times: "Weekday midday", notes: "One block back. Still Chinatown character but less congestion than 8th St." },
];

async function seed() {
  const baseUrl = "http://localhost:3000";
  let success = 0;
  let failed = 0;

  const cityCoords = {
    sf: { lat: 37.7749, lng: -122.4194 },
    oakland: { lat: 37.8044, lng: -122.2712 },
  };

  for (const tip of tips) {
    const city = cityCoords[tip.city];
    const latOffset = (Math.random() - 0.5) * 0.02;
    const lngOffset = (Math.random() - 0.5) * 0.02;

    try {
      const res = await fetch(`${baseUrl}/api/spots`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          latitude: city.lat + latOffset,
          longitude: city.lng + lngOffset,
          city: tip.city,
          neighborhood: tip.neighborhood,
          street_name: tip.street_name,
          difficulty: tip.difficulty,
          parking_type: tip.parking_type,
          best_times: tip.best_times || null,
          notes: tip.notes || null,
        }),
      });

      if (res.ok) {
        success++;
        console.log(`✓ ${tip.street_name}`);
      } else {
        failed++;
        console.log(`✗ ${tip.street_name}: ${res.status}`);
      }
    } catch (err) {
      failed++;
      console.error(`✗ ${tip.street_name}: ${err.message}`);
    }
  }

  console.log(`\n✅ Seeded ${success}/${tips.length} parking tips (${failed} failed)`);
}

seed();
