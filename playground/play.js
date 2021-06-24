const text = 'Hello Welecome Your Man';
const textArray = text.split(' ');
const result = [];
let inc = text.split(' ').length;

for (let i = 0; i <= textArray.length; i += 1) {
  for (let initialIndex = 0; initialIndex <= textArray.length - inc; initialIndex += inc) {
    const splicedArray = text.split(' ').splice(initialIndex, inc);
    result.push(splicedArray.join(' '));
  }
  inc -= 1;
  if (inc === 0) break;
}
