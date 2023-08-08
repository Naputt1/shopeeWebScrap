const url = 'VIVO-Y15s-3GB-RAM-32GB-ROM-i.-แบตเตอรี่-5000mAh-I-ประกันศูนย์-1-ปี-i.139408702.15710742409?sp_atk=de57558a-0732-4e88-8afd-8cdcee2c056c&xptdk=de57558a-0732-4e88-8afd-8cdcee2c056c';

// Regular expression to match the first product ID
const firstProductIdRegex = /i\.(\d+)\.\d+/;
const firstMatches = url.match(firstProductIdRegex)[1];
console.log(firstMatches);

// Regular expression to match the second product ID
const secondProductIdRegex = /\.(\d+)\?sp_atk/;
const secondMatches = url.match(secondProductIdRegex)[1];
console.log(secondMatches)

if (firstMatches && firstMatches.length >= 2) {
  const firstProductId = firstMatches[1];
  console.log('First Product ID:', firstMatches);
} else {
  console.log('First Product ID not found.');
}

if (secondMatches && secondMatches.length >= 2) {
  const secondProductId = secondMatches[1];
  console.log('Second Product ID:', secondMatches);
} else {
  console.log('Second Product ID not found.');
}
