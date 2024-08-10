const fs = require("fs").promises;

const COUNTER_FILE = "counter.txt";

let counter = 1023;
let interval = 60000 * 4; // Start with 1 minute interval
let intervalId = 0;

async function loadCounter() {
    try {
        const data = await fs.readFile(COUNTER_FILE, "utf8");
        counter = parseInt(data.trim(), 10);
        console.log(`Loaded counter value: ${counter}`);
    } catch (error) {
        if (error.code === "ENOENT") {
            console.log("Counter file not found. Starting with 0.");
        } else {
            console.error("Error loading counter:", error);
        }
    }
}

async function saveCounter() {
    try {
        await fs.writeFile(COUNTER_FILE, counter.toString());
    } catch (error) {
        console.error("Error saving counter:", error);
    }
}

async function makePostRequest() {
    counter++;
    await saveCounter();

    try {
        const response = await fetch("https://zqwqz.org/oyver", {
            headers: {
                accept: "*/*",
                "accept-language": "en-US,en;q=0.9,tr;q=0.8",
                "cache-control": "no-cache",
                "content-type":
                    "application/x-www-form-urlencoded; charset=UTF-8",
                pragma: "no-cache",
                priority: "u=1, i",
                "sec-ch-ua":
                    '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": '"Windows"',
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest",
                cookie: `PHPSESSID=${process.env.PHPSESSID}; guser=${process.env.guser}; browserHash=${process.env.browserHash}; bildirim=${process.env.bildirim}; newsChecked=${process.env.newsChecked}`,
                Referer: "https://zqwqz.org/",
                "Referrer-Policy": "strict-origin-when-cross-origin",
            },
            body: `pid=${counter}&puan=4&type=puanver&t=diziler`,
            method: "POST",
        });

        console.log(
            `POST request sent. Counter: ${counter}, Status: ${response.status}`
        );

        console.log("pid:", counter);
        // Read the response body
        const responseText = await response.text();
        console.log("Response:", responseText);

        // Check if response contains "flood"
        if (responseText.toLowerCase().includes("flood")) {
            interval += 60000; // Add 1 minute to the interval
            console.log(
                `Flood detected. Increasing interval to ${
                    interval / 60000
                } minutes.`
            );
            counter--;
            clearInterval(intervalId);
            intervalId = setInterval(makePostRequest, interval);
        }
    } catch (error) {
        console.error(`Error making POST request: ${error}`);
    }
}

// console.log("Application started. Press Ctrl+C to stop.");
// console.log(`Initial interval: ${interval / 60000} minutes`);

// // Start the initial interval
// let intervalId = setInterval(makePostRequest, interval);

// // Trigger the first request immediately
// makePostRequest();

async function main() {
    await loadCounter();
    console.log("Application started. Press Ctrl+C to stop.");
    console.log(`Initial interval: ${interval / 60000} minutes`);

    // Start the initial interval
    intervalId = setInterval(makePostRequest, interval);

    // Trigger the first request immediately
    makePostRequest();
}

main().catch(console.error);
