
(async function () {
  var luxiferAnalytics = "https://luxifer-analytics-cdn-fcbkengwhub0fdd9.z01.azurefd.net";
  var luxiferAbDataSource = "https://getabtestseu-573194387152.europe-west1.run.app";
  if (typeof matomoLuxiSiteId === 'undefined' || typeof matomoLuxiSampleSize === 'undefined') return;

  setTimeout(() => {
    window.__LUMMMEN__.markReady("matomo", "data");
  }, 1000);

  console.log("loaded: ", matomoLuxiSampleSize, matomoLuxiSiteId);

  window.__LUMMMEN__.ready.then((data) => {
    console.log("finalized: ", data)
  });

})();
