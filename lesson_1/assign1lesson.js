/*************************************************
 * PART 1: Stack Overflow Measurement
 *************************************************/

let counter = 0;

function overflowTest() {
  counter++;
  overflowTest();
}

function runPart1() {
  try {
    overflowTest();
  } catch (error) {
    console.error("Part 1 Error:", error.message);
    console.log("Call stack size reached:", counter);
  }
}

// runPart1(); // ← uncomment when testing Part 1



/*************************************************
 * PART 2: Trampolined Array Flattening
 *************************************************/

function trampoline(fn) {
  let result = fn();
  while (typeof result === "function") {
    result = result();
  }
  return result;
}

function flattenArray(arr, result = []) {
  if (arr.length === 0) return result;

  const [first, ...rest] = arr;

  if (Array.isArray(first)) {
    return () => flattenArray(first.concat(rest), result);
  } else {
    result.push(first);
    return () => flattenArray(rest, result);
  }
}

function runPart2() {
  const nested = [1, [2, [3, [4, [5]]]], 6];
  const flattened = trampoline(() => flattenArray(nested));
  console.log("Part 2 Result:", flattened);
}

// runPart2(); // ← uncomment when testing Part 2



/*************************************************
 * PART 3: Deferred Execution (Browser Only)
 *************************************************/

// ⚠️ This part requires a browser + HTML element
function runPart3() {
  const output = document.getElementById("output");

  function isPrime(num) {
    if (num < 2) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) return false;
    }
    return true;
  }

  function renderPrimes(n, current = 2) {
    if (current > n) {
      alert("Prime calculation complete!");
      return;
    }

    if (isPrime(current)) {
      const div = document.createElement("div");
      div.textContent = current;
      output.appendChild(div);
    }

    setTimeout(() => renderPrimes(n, current + 1), 0);
  }

  renderPrimes(10000);
}
console.log("Part 3 Result:", output);

runPart3(); // ← uncomment when testing Part 3
