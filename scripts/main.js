const proxyURL = "https://api.allorigins.win/get?url=";
const archiveURL = "http://web.archive.org/cdx/search/cdx?url="; // RETURNS a link to the archived version and a datetime object
const siteURL = "https://www.serebii.net";

let earliestYearFilter = 2013;
let latestYearFilter = 2023;

function getTimestamp(dateObj) {
  let currentYear = String(dateObj.getFullYear());
  let currentDate = String(dateObj.getDate());
  let currentMonth = String(dateObj.getMonth() + 1);

  if (Number(currentMonth.charAt(0)) < 10) {
    currentMonth = "0" + currentMonth;
  }

  return currentYear + currentMonth + currentDate;
}

async function checkForcachedPagesOf(URL, time) {
  try {
    let fullURL = proxyURL + archiveURL + siteURL;

    let res = await fetch(fullURL, {
      method: "GET",
    });
    console.log("trying to fetch url at", fullURL);

    if (res.ok) {
      console.log("fetch was OK with status of", res.status);
      let data = await res.json();
      let contents = data.contents;
      let crawlResults = parseCachedPageData(contents);
    }
  } catch (e) {
    console.error("No page found", e);
  }
}

function parseCachedPageData(data) {
  let results = data.split("\n").map((datum) => datum.split(" "));
  let parsedResults = [];

  results.forEach((result) => {
    let timestamp = result[1];
    let uri = result[2];

    // WORKAROUND since proxy server doesn't preserve the query strings
    let timestampYear = timestamp.match(/\d{4}/)[0];

    if (
      Number(timestamp) < earliestYearFilter ||
      Number(timestamp) > latestYearFilter
    ) {
      return;
    }

    parsedResults = [...parsedResults, { timestamp: timestamp, uri: uri }];
  });

  return parsedResults;
}

function composeArchiveLinks(items) {
  /*
link should look like
web.archive.org/web + untouched timestamp + original siteURL 

*/
}

window.addEventListener("DOMContentLoaded", async () => {
  await checkForcachedPagesOf(siteURL);
});
