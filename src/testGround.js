const getRandomObjectByPercentage = (arr) => {
    // Step 1: Calculate total weight
    const totalWeight = arr.reduce((sum, obj) => sum + obj.percentage, 0);

    // Step 2: Generate a random number
    const randomNum = Math.random() * totalWeight;

    // Step 3: Determine the selected object
    let cumulativeWeight = 0;
    for (const obj of arr) {
        cumulativeWeight += obj.percentage;
        if (randomNum < cumulativeWeight) {
            return obj;
        }
    }
}

// Example array
const objects = [
    { coin: 4, percentage: 20 },
    { coin: 4, percentage: 30 },
    { coin: 4, percentage: 50 }
];

// Get a randomly selected object based on percentageage
const selectedObject = getRandomObjectByPercentage(objects);
