let isStopTestLoadBalancer = false
let isStopTestWebService = false

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
            console.error(err)
            reject(err)
        })
})

async function testWebService(url) {
    let containerDOM = document.getElementById("web-service-response-container")
    for (let i = 0; i < 100; i++) {
        if (isStopTestWebService) {
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
            break;
        }
    }
}

async function testLoadBalancer() {
    let containerDOM = document.getElementById("response-container")
    for (let i = 0; i < 100; i++) {
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
            break;
        }
    }
}

let testLoadBalancerDOM = document.getElementById("test-load-balancer")
testLoadBalancerDOM.addEventListener("click", () => {
    // disable the start button
    testLoadBalancerDOM.setAttribute('disabled', true)

    testLoadBalancer()
})

let testWebServiceDOM = document.getElementById("test-web-service")
testWebServiceDOM.addEventListener("click", () => {
    let webServiceAddressDOM = document.getElementById("web-service-address")
    let webServiceAddress = webServiceAddressDOM.value

    if (!webServiceAddress) {
        window.alert("Alamat Web Service harus diisi")
        return
    }

    // disable the start button
    testWebServiceDOM.setAttribute('disabled', true)

    testWebService(webServiceAddress)
})

let stopTestLoadBalancerDOM = document.getElementById("stop-test-load-balancer")
stopTestLoadBalancerDOM.addEventListener('click', function() {
    isStopTestLoadBalancer = true
    // reenable the start button after 1000 ms
    testLoadBalancerDOM.removeAttribute('disabled')
    setTimeout(function() {
        isStopTestLoadBalancer = false
    }, 1000)
})

let stopTestWebServiceDOM = document.getElementById("stop-test-web-service")
stopTestWebServiceDOM.addEventListener('click', function() {
    // reenable the start button after 1000 ms
    isStopTestWebService = true
    testWebServiceDOM.removeAttribute('disabled')
    setTimeout(function() {
        isStopTestWebService = false
    }, 1000)
})
