const tips = [
  // SF - Mission
  { street_name: "Valencia St (16th-20th)", neighborhood: "Mission", city: "sf", difficulty: "hard", parking_type: "metered", best_times: "After 10pm & early morning", notes: "2hr limit. Popular restaurant strip — aim for side streets one block over." },
  { street_name: "Guerrero St (24th-26th)", neighborhood: "Mission", city: "sf", difficulty: "moderate", parking_type: "mixed", best_times: "Weekday mornings", notes: "Free permit zone. Street cleaning Wed 8-10am." },
  { street_name: "Mission St (near 25th)", neighborhood: "Mission", city: "sf", difficulty: "moderate", parking_type: "metered", best_times: "After 6pm", notes: "2hr limit daytime. Lot behind the church ($15/day)." },
  { street_name: "24th St (Mission-Bryant)", neighborhood: "Mission", city: "sf", difficulty: "hard", parking_type: "metered", best_times: "Very early morning (6-8am)", notes: "2hr limit. Packed with bars/restaurants after 5pm." },

  // SF - SOMA
  { street_name: "3rd St (near Moscone)", neighborhood: "SOMA", city: "sf", difficulty: "moderate", parking_type: "metered", best_times: "Weekends", notes: "Paid lots nearby ($3-5/hr). Street parking sparse during events." },
  { street_name: "Harrison St (near 10th)", neighborhood: "SOMA", city: "sf", difficulty: "easy", parking_type: "free", best_times: "Anytime", notes: "Free residential. Less crowded than nearby streets." },
  { street_name: "Folsom St (near 11th)", neighborhood: "SOMA", city: "sf", difficulty: "moderate", parking_type: "metered", best_times: "Weekday midday", notes: "2hr limit. Nightlife area gets packed after 9pm." },

  // SF - Downtown
  { street_name: "Market St (near 5th)", neighborhood: "Downtown", city: "sf", difficulty: "hard", parking_type: "metered", best_times: "After 8pm", notes: "1hr limit during day. Garages expensive ($8-12/hr). Bart is your friend." },
  { street_name: "Sutter St (near Stockton)", neighborhood: "Downtown", city: "sf", difficulty: "moderate", parking_type: "metered", best_times: "Early morning (7-9am)", notes: "2hr limit. Lots underneath (Geary garage)." },
  { street_name: "Pine St (near Montgomery)", neighborhood: "Downtown", city: "sf", difficulty: "hard", parking_type: "metered", best_times: "Very late night", notes: "Tourist area. Pay lots ubiquitous but pricey ($10+/hr)." },

  // SF - Marina
  { street_name: "Marina Blvd (near Fillmore)", neighborhood: "Marina", city: "sf", difficulty: "moderate", parking_type: "free", best_times: "Weekday afternoons", notes: "Free 1-hour parking. Best views + spot rotation." },
  { street_name: "Chestnut St (near Scott)", neighborhood: "Marina", city: "sf", difficulty: "moderate", parking_type: "metered", best_times: "Weekday mornings", notes: "2hr limit. Neighborhood is restaurant row — evenings packed." },
  { street_name: "Filbert St (near Gough)", neighborhood: "Marina", city: "sf", difficulty: "easy", parking_type: "free", best_times: "Anytime", notes: "Residential side street. Quiet parking, minimal competition." },

  // SF - Castro
  { street_name: "Castro St (Market-18th)", neighborhood: "Castro", city: "sf", difficulty: "hard", parking_type: "metered", best_times: "Weekday 10am-2pm", notes: "2hr limit. Friday/Saturday packed. Street cleaning Tue 8-10am." },
  { street_name: "18th St (Castro-Collingwood)", neighborhood: "Castro", city: "sf", difficulty: "moderate", parking_type: "metered", best_times: "Weekday mornings", notes: "2hr limit. More residential one block off Castro." },

  // SF - Richmond
  { street_name: "Clement St (near 9th)", neighborhood: "Richmond", city: "sf", difficulty: "moderate", parking_type: "metered", best_times: "Weekday afternoons", notes: "1hr limit (some 2hr). Less touristy than downtown." },
  { street_name: "Geary Blvd (near 25th)", neighborhood: "Richmond", city: "sf", difficulty: "easy", parking_type: "free", best_times: "Anytime", notes: "Free residential. Outer Richmond always quieter." },

  // SF - Sunset
  { street_name: "Judah St (near 19th)", neighborhood: "Sunset", city: "sf", difficulty: "moderate", parking_type: "metered", best_times: "Weekday 1-4pm", notes: "1hr limit. Beach/zoo traffic Sun/holidays—avoid." },
  { street_name: "Irving St (near 9th)", neighborhood: "Sunset", city: "sf", difficulty: "easy", parking_type: "free", best_times: "Anytime", notes: "Free residential. Very consistent availability." },

  // SF - Hayes Valley
  { street_name: "Hayes St (Gough-Laguna)", neighborhood: "Hayes Valley", city: "sf", difficulty: "hard", parking_type: "metered", best_times: "Weekday 10-11am only", notes: "2hr limit. Restaurant/bar hotspot. Evenings impossible." },
  { street_name: "Octavia St (near Hayes)", neighborhood: "Hayes Valley", city: "sf", difficulty: "moderate", parking_type: "free", best_times: "Weekday midday", notes: "Free residential. Better bet than Hayes St directly." },

  // SF - North Beach
  { street_name: "Columbus Ave (near Broadway)", neighborhood: "North Beach", city: "sf", difficulty: "hard", parking_type: "metered", best_times: "Weekday 9-10am", notes: "1hr limit. Touristy nightlife area — evenings packed." },
  { street_name: "Grant Ave (near Union)", neighborhood: "North Beach", city: "sf", difficulty: "hard", parking_type: "metered", best_times: "Early morning only", notes: "1hr limit. Chinatown. Best to avoid except dawn." },

  // Oakland - Downtown
  { street_name: "Broadway (near 12th)", neighborhood: "Downtown", city: "oakland", difficulty: "moderate", parking_type: "metered", best_times: "Weekday 10am-3pm", notes: "2hr limit. Theater/bar strip; evenings crowded." },
  { street_name: "14th St (near Broadway)", neighborhood: "Downtown", city: "oakland", difficulty: "easy", parking_type: "metered", best_times: "Anytime", notes: "2hr limit. One block off Broadway = much easier." },
  { street_name: "Telegraph Ave (near 14th)", neighborhood: "Downtown", city: "oakland", difficulty: "moderate", parking_type: "metered", best_times: "Weekday afternoons", notes: "1hr limit. Uptown popular Wed-Sat nights." },

  // Oakland - Lake Merritt
  { street_name: "Lakeshore Ave (near Bellevue)", neighborhood: "Lake Merritt", city: "oakland", difficulty: "easy", parking_type: "free", best_times: "Anytime", notes: "Free residential. Popular but plenty of spots." },
  { street_name: "19th St (near Lakeshore)", neighborhood: "Lake Merritt", city: "oakland", difficulty: "moderate", parking_type: "free", best_times: "Weekday mornings", notes: "Free. Weekends fill up with joggers/families." },
  { street_name: "Lakeside Dr (near 23rd)", neighborhood: "Lake Merritt", city: "oakland", difficulty: "easy", parking_type: "free", best_times: "Anytime", notes: "Free. South shore quieter than north." },

  // Oakland - Rockridge
  { street_name: "College Ave (near 51st)", neighborhood: "Rockridge", city: "oakland", difficulty: "hard", parking_type: "metered", best_times: "After 7pm & weekends", notes: "2hr limit daytime. Street cleaning Tue 8-10am. Restaurant row." },
  { street_name: "Shattuck Ave (near 51st)", neighborhood: "Rockridge", city: "oakland", difficulty: "moderate", parking_type: "metered", best_times: "Weekday mornings", notes: "2hr limit. Parallel to College with less competition." },
  { street_name: "Claremont Ave (near 50th)", neighborhood: "Rockridge", city: "oakland", difficulty: "easy", parking_type: "free", best_times: "Anytime", notes: "Free residential. One block back = safe bet." },

  // Oakland - Piedmont/Fruitvale
  { street_name: "Grand Ave (near MacArthur)", neighborhood: "Piedmont", city: "oakland", difficulty: "moderate", parking_type: "free", best_times: "Weekday midday", notes: "Free mixed use. Emerging restaurant scene." },
  { street_name: "Piedmont Ave (near 41st)", neighborhood: "Piedmont", city: "oakland", difficulty: "moderate", parking_type: "metered", best_times: "Weekday 10am-2pm", notes: "1hr limit. Quiet neighborhood east of downtown." },
  { street_name: "34th Ave (near International)", neighborhood: "Fruitvale", city: "oakland", difficulty: "easy", parking_type: "free", best_times: "Anytime", notes: "Free. Cultural district; less touristed." },

  // Oakland - Jack London District
  { street_name: "Washington St (near 3rd)", neighborhood: "Jack London", city: "oakland", difficulty: "moderate", parking_type: "metered", best_times: "Weekday afternoons", notes: "2hr limit. Weekend brunch/nightlife gets busy." },
  { street_name: "Clay St (near 2nd)", neighborhood: "Jack London", city: "oakland", difficulty: "easy", parking_type: "metered", best_times: "Weekday mornings", notes: "2hr limit. Industrial; less demand than Washington." },

  // Oakland - Uptown
  { street_name: "20th St (near Telegraph)", neighborhood: "Uptown", city: "oakland", difficulty: "hard", parking_type: "metered", best_times: "Weekday 10-11am only", notes: "1hr limit. Arts/bar hotspot Wed-Sat. Avoid evenings." },
  { street_name: "21st St (near Franklin)", neighborhood: "Uptown", city: "oakland", difficulty: "moderate", parking_type: "metered", best_times: "Weekday mornings", notes: "2hr limit. One block off 20th = less competition." },

  // Oakland - Temescal
  { street_name: "Telegraph Ave (near 51st)", neighborhood: "Temescal", city: "oakland", difficulty: "moderate", parking_type: "metered", best_times: "Weekday afternoons", notes: "1hr limit. Retail/restaurant. Busy Thu-Sat." },
  { street_name: "49th St (near Telegraph)", neighborhood: "Temescal", city: "oakland", difficulty: "easy", parking_type: "free", best_times: "Anytime", notes: "Free residential. Quieter side streets." },

  // Oakland - Chinatown
  { street_name: "8th St (near Webster)", neighborhood: "Chinatown", city: "oakland", difficulty: "hard", parking_type: "metered", best_times: "Weekday 9-10am only", notes: "1hr limit. Weekends dim sum = packed." },
  { street_name: "11th St (near Broadway)", neighborhood: "Chinatown", city: "oakland", difficulty: "moderate", parking_type: "metered", best_times: "Weekday midday", notes: "2hr limit. One block back easier than main drag." },
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
