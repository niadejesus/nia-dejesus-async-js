//main.js
// Create a new worker, giving it the code in "generate.js"
const worker = new Worker("./generate.js");

// When the user clicks "Generate primes", send a message to the worker.
// The message command is "generate", and the message also contains "quota",
// which is the number of primes to generate.
document.querySelector("#generate").addEventListener("click", () => {
  const quota = document.querySelector("#quota").value;
  worker.postMessage({
    command: "generate",
    quota,
  });
});

// When the worker sends a message back to the main thread,
// update the output box with a message for the user, including the number of
// primes that were generated, taken from the message data.
worker.addEventListener("message", (message) => {
  document.querySelector("#output").textContent =
    `Finished generating ${message.data} primes!`;
});

document.querySelector("#reload").addEventListener("click", () => {
  document.querySelector("#user-input").value =
    'Try typing in here immediately after pressing "Generate primes"';
  document.location.reload();
});
// generate.js
// Listen for messages from the main thread.
// If the message command is "generate", call `generatePrimes()`
addEventListener("message", (message) => {
    if (message.data.command === "generate") {
      generatePrimes(message.data.quota);
    }
  });
  
  // Generate primes (very inefficiently)
  function generatePrimes(quota) {
    function isPrime(n) {
      for (let c = 2; c <= Math.sqrt(n); ++c) {
        if (n % c === 0) {
          return false;
        }
      }
      return true;
    }
  
    const primes = [];
    const maximum = 1000000;
  
    while (primes.length < quota) {
      const candidate = Math.floor(Math.random() * (maximum + 1));
      if (isPrime(candidate)) {
        primes.push(candidate);
      }
    }
  
    // When we have finished, send a message to the main thread,
    // including the number of primes we generated.
    postMessage(primes.length);
  }
/*The way that this works is that this runs as soon as the main script creates the worker.
The first thing the worker does is start listening for messages from the main script.
This is done by using addEventListener() which is a global function in a worker.
Inside the message event handler, the data property of the event contains a copy 
of the argument passed from the main script. If the main script passed the
generate commands, we call generatePrimes(), passing in the quota value from the
message event.
The generatePrimes() function is just like the synchronous version, 
except instead of returning a value, we send a message to the main script 
when we are done.We use the postMessage() function for this, which like addEventListener() 
is a global function in a worker. As we already saw, the main script is listening for this message 
and will update the DOM when the message is received.
*/
/*The worker that is created is called a dedicated worker. This means
that it's used by a single script instance.*/