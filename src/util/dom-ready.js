export default function waitForDOMReady() {
  return new Promise(resolve => {
    if (isInteractive()) {
      resolve();
    } else {
      const handler = function() {
        if (isInteractive()) {
          document.removeEventListener("readystatechange", handler, false);
          resolve();
        }
      };

      document.addEventListener("readystatechange", handler, false);
    }
  });
}

function isInteractive() {
  return (
    document.readyState === "complete" || document.readyState === "interactive"
  );
}
