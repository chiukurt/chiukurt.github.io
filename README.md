# chiukurt.github.io
Test website for analytics software implementations

https://chiukurt.github.io/

# How to create new hardcoded JS behavior
1. Start the test environment locally e.g., `python -m http.server 8001`
2. Add a new function name in `LUXI_BEHAVIOR_ALLOWLIST` in the file `jsTestCreation\lummmenMain.js`
3. Implement the function above the allowlist.
4. Tailor the test in `jsTestCreation\testResponse.json` according to the new function.
5. Update the URL of the test to be based on your environment, but with the path /faq.html (e.g., `http://localhost:8001/faq.html`) 
6. Visit the URL to to test. This environment is set up so that only the faq page is affected as it loads a special version of the script.
7. Feel free to modify the allowlist or script overall and Kurt will review.
8. Also feel free to make a PR as it makes record keeping easier.
9. Afterwards, Kurt will update the main scripts (what's fetched in `matomoLuxi.js`)
