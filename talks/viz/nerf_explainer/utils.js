function smooth(x) {
    return x * x * x * (x * (x * 6 - 15) + 10);
}

function binaryClosestIdx(arr, target) {
    let start = 0;
    let end = arr.length - 1;
    let mid = Math.floor((start + end) / 2);

    while (1) {
        if (arr[mid] === target) {
            return mid;
        }
        else if (start >= end) {
            break;
        }
        else if (arr[mid] > target) {
            end = mid - 1;
        } else {
            start = mid + 1;
        }
        
        mid = Math.floor((start + end) / 2);
    }

    // Return the closest between the last value checked and it's surrounding neighbors
    const first = Math.max(mid - 1, 0);
    const neighbors = arr.slice(first, mid + 2);
    const best = neighbors.reduce((b, el) => Math.abs(el - target) < Math.abs(b - target) ? el : b);

    return first + neighbors.indexOf(best);
}

export { smooth, binaryClosestIdx };