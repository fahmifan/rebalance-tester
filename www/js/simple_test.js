let isStopTestLoadBalancer = false
let isStopTestWebService = false
let isWebServiceRun = true

let stopTestLoadBalancerDOM = document.getElementById("stop-test-load-balancer")
let startTestLoadBalancerDOM = document.getElementById("start-test-load-balancer")
let startTestWebServiceDOM = document.getElementById("test-web-service")
let stopTestWebServiceDOM = document.getElementById("stop-test-web-service")


const fetchSorts = (url, opts) => new Promise((resolve, reject) => {  
    fetch(url)
        .then(res => {
            if (!opts || opts.withJSON) {
                return res.json()
            }

            return res.clone().text()
        })
        .then(res => {
            if (!opts || opts.withJSON) {
                resolve(res.message)
                return
            }

            resolve(res)
        })
        .catch(err => {
            console.log(err)
            reject(err)
        })
})

async function testWebService(url) {
    let containerDOM = document.getElementById("web-service-response-container")
    for (let i = 0; i < 100; i++) {
        if (!isWebServiceRun) {
            let li = `<li>stopped</li>`
            containerDOM.innerHTML += li                    
            containerDOM.scrollTop = containerDOM.scrollHeight;
            break
        }

        try {
            let sorts = await fetchSorts(`${url}/api/sorts`, { withJSON: false })
            let li = `<li>${sorts}</li>`
            containerDOM.innerHTML += li                    
            containerDOM.scrollTop = containerDOM.scrollHeight;
        } catch (err) {
            console.error(err)
            let li = `<li>${err}</li>`
            containerDOM.innerHTML += li                    
            containerDOM.scrollTop = containerDOM.scrollHeight;
            // break;
        }
    }
}

async function testLoadBalancer() {
    let containerDOM = document.getElementById("response-container")
    for (let i = 0; ; i++) {
        if (isStopTestLoadBalancer) {
            let li = `<li>stopped</li>`
            containerDOM.innerHTML += li                    
            containerDOM.scrollTop = containerDOM.scrollHeight;

            break
        }

        try {
            let sorts = await fetchSorts("/api/sorts")
            let li = `<li>${sorts}</li>`
            containerDOM.innerHTML += li                    
            containerDOM.scrollTop = containerDOM.scrollHeight;
        } catch (err) {
            console.error(err)
            let li = `<li>failed</li>`
            containerDOM.innerHTML += li                    
            containerDOM.scrollTop = containerDOM.scrollHeight;
        }
    }
}

function startLoadBalancerTest() {
    isStopTestLoadBalancer = false
}

function stopLoadBalancerTest() {
    isStopTestLoadBalancer = true
}

function startWebServiceTest() {
    isWebServiceRun = true
}

function stopWebServiceTest() {
    isWebServiceRun = false
}

// load balancers
startTestLoadBalancerDOM.addEventListener("click", () => {
    startLoadBalancerTest()
    startTestLoadBalancerDOM.setAttribute('disabled', true)
    stopTestLoadBalancerDOM.removeAttribute('disabled')
    testLoadBalancer()
})


stopTestLoadBalancerDOM.addEventListener('click', function() {
    stopLoadBalancerTest()
    startTestLoadBalancerDOM.removeAttribute('disabled')
    stopTestLoadBalancerDOM.setAttribute('disabled', true)
})


stopTestWebServiceDOM.addEventListener('click', function() {
    stopWebServiceTest()
    stopTestWebServiceDOM.setAttribute('disabled', true)
    startTestWebServiceDOM.removeAttribute('disabled')
})

startTestWebServiceDOM.addEventListener("click", () => {
    let webServiceAddressDOM = document.getElementById("web-service-address")
    let webServiceAddress = webServiceAddressDOM.value

    if (!webServiceAddress) {
        window.alert("Alamat Web Service harus diisi")
        return
    }

    // disable the start button
    startTestWebServiceDOM.setAttribute('disabled', true)
    stopTestWebServiceDOM.removeAttribute('disabled')

    startWebServiceTest()
    testWebService(webServiceAddress)
})


