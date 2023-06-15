const archiveURL = "http://web.archive.org/cdx/search/cdx?url=";
const siteURL = "https://scholar.google.com/intl/en/scholar/publishers.html";

// fetch(
//   "http://web.archive.org/cdx/search/cdx?url=https://scholar.google.com/intl/en/scholar/publishers.html&output=json&from=2017&to=2020"
// )
//   .then((res) => res.json())
//   .then((data) => console.log(data));

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
    let queryStrings = `&output=json&from=${earliestYearFilter}&to=${latestYearFilter}`;
    let fullURL = archiveURL + siteURL + queryStrings;

    let res = await fetch(fullURL, {
      method: "GET",
      mode: "cors",
      headers: {
        "Access-Control-Allow-Headers": "include",
        "Allow-Control-Access-Origin": "*",
      },
    });
    console.log("trying to fetch url at", fullURL);

    if (res.ok) {
      console.log("fetch was OK with status of", res.status);
      let contents = await res.json();
      let crawlResults = parseCachedPageData(contents);

      console.log(
        "OK, these are the parsed results, ready for linkification",
        crawlResults
      );
    }
  } catch (e) {
    console.error("No page found", e);
  }
}

function parseCachedPageData(data) {
  let results = data.split("\n").map((datum) => datum.split(" "));
  let parsedResults = [];

  for (let i = 1; i < results.length; i++) {
    let result = results[i];

    let timestamp = result[1];
    let uri = result[2];

    parsedResults = [...parsedResults, { timestamp: timestamp, uri: uri }];
  }

  return parsedResults;
}

function composeArchiveLinks(items) {
  /*
link should look like
web.archive.org/web + untouched timestamp + original siteURL 

*/
}

function layoutUI() {
  updateUILocationString(window.location.host);
}

function updateUILocationString(currentLocation) {
  document.getElementById("text__location__url").textContent = currentLocation;
}

window.addEventListener("DOMContentLoaded", async () => {
  layoutUI();
  // await checkForcachedPagesOf(siteURL);
});

document.querySelectorAll("input").forEach((input) =>
  input.addEventListener("change", (e) => {
    console.log("input changed", e.target.value);
  })
);
