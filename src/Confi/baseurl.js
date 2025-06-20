const BASE_URL = ""

const hostname = window.location.hostname;

if( hostname === "https://uat-loyalty.lockated.com/") {
    BASE_URL = "https://uat-loyalty.lockated.com/"
} else {
    BASE_URL = "https://piramal-loyalty-dev.lockated.com";
}

export default BASE_URL;