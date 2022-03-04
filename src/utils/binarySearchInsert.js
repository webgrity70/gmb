function binarySearchInsert(sortedArray, comparator, item) {
  let high = sortedArray.length - 1;
  let low = 0;
  let mid = 0;

  if (sortedArray.length === 0) {
    sortedArray.push(item);
    return 0;
  }

  while (low <= high) {
    // https://github.com/darkskyapp/binary-search
    // http://googleresearch.blogspot.com/2006/06/extra-extra-read-all-about-it-nearly.html
    // eslint-disable-next-line
    mid = low + ((high - low) >> 1);
    const cmp = comparator(sortedArray[mid], item);
    if (cmp < 0.0) {
      // searching too low
      low = mid + 1;
    } else if (cmp > 0.0) {
      // searching too high
      high = mid - 1;
    } else {
      // duplicate item, ignore
      return mid;
    }
  }

  const cmp = comparator(sortedArray[mid], item);
  if (cmp <= 0.0) {
    mid += 1;
  }

  sortedArray.splice(mid, 0, item);
  return mid;
}

export default binarySearchInsert;
