export const parseRideData = (text: string) => {
    console.log("Parsing text:", text);

    let fare = 0;
    let distance = 0;
    let time = 0;

    // --- Price Logic ---
    // Regex to find currency values explicitly formatted as R$ XX,XX or similar
    const moneyRegex = /R\$\s?(\d+[.,]\d{2})/gi;
    let match;
    let prices: number[] = [];

    while ((match = moneyRegex.exec(text)) !== null) {
        let val = parseFloat(match[1].replace(',', '.'));
        prices.push(val);
    }

    // Filter out very small numbers (likely /km rates)
    prices = prices.filter(p => p > 3);

    if (prices.length > 0) {
        // Heuristic: Pick the first valid price found, usually the overlay/fare is prominent
        fare = prices[0];
    }

    // --- Distance Logic ---
    // Look for numbers followed by 'km'
    const distRegex = /(\d+[.,]?\d*)\s?km/gi;
    let distMatches: number[] = [];
    while ((match = distRegex.exec(text)) !== null) {
        distMatches.push(parseFloat(match[1].replace(',', '.')));
    }

    if (distMatches.length > 0) {
        // Use Max distance found (avoids segment distances)
        distance = Math.max(...distMatches);
    }

    // --- Time Logic ---
    // Patterns: "40m", "9 min", "0h40m"
    const timeRegexMin = /(\d+)\s?min/gi;
    const timeRegexHour = /(\d+)h(\d+)?m?/gi;

    let timeCandidates: number[] = [];

    // Check Hour format first
    while ((match = timeRegexHour.exec(text)) !== null) {
        let h = parseInt(match[1]);
        let m = match[2] ? parseInt(match[2]) : 0;
        timeCandidates.push((h * 60) + m);
    }

    // Check Min format
    while ((match = timeRegexMin.exec(text)) !== null) {
        timeCandidates.push(parseInt(match[1]));
    }

    if (timeCandidates.length > 0) {
        time = Math.max(...timeCandidates);
    }

    return { fare, distance, time };
};
