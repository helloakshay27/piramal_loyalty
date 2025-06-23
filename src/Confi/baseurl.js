let BASE_URL = ""

const hostname = window.location.hostname;
console.log("Current hostname:", hostname);

if( hostname === "uat-loyalty.lockated.com") {
    BASE_URL = "https://uat-piramal-loyalty-dev.lockated.com/"
} else {
    BASE_URL = "https://piramal-loyalty-dev.lockated.com";
}

export default BASE_URL;