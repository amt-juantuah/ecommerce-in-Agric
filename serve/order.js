import { sendOrder } from "./main.js"

let initial = 1;
const prodQuant = document.getElementById('prodQuant');
const img = document.querySelector('.buy-product-pic');
const totalprice = document.getElementById('totalprice');
let quantity = document.getElementById('quantity');
const per = document.getElementById('per');
const price = document.getElementById('price');
const buyForm = document.getElementById('buyForm');
const successModal = document.getElementById("success-notif-modal");

const productsFile = "./serve/products.json";
const fetchProducts = await fetch(productsFile);
const allProducts = await fetchProducts.json();

const data = localStorage.getItem('product');
const ID = JSON.parse(data);
const response = allProducts.find(product => product.id === ID);

// get corresponding object on buy page after clicking to buy
if (response) {

    const changeTotal = (x) => {
        totalprice.textContent = "GHC " + (response.price * x)
    }

    img.style.backgroundImage = "url('" + response.image + "')";

    price.textContent = response.price;
    per.textContent = "/" + response.per
    totalprice.textContent = "GHC " + response.price
    quantity.textContent = initial

    prodQuant.addEventListener('change', (e) => {
        initial = e.target.value;
        quantity.textContent = initial;
        changeTotal(initial)
    })
}
   
// get form data

const getOrderDetails = () => {
    return {
        customerName: document.getElementById("cName").value, 
        customerNumber: document.getElementById("cNumber").value, 
        customerEmail: document.getElementById("cEmail").value, 
        customerCountry: document.getElementById("cCountry").value, 
        customerAddress: document.getElementById("cAddress").value, 
        delivery: document.getElementById("cDelivery").value, 
        product: response.name, 
        quantity: document.getElementById("prodQuant").value, 
        price: response.price, 
        totalAmount: document.getElementById("totalprice").textContent, 
        specifications: document.getElementById("cSpecifications").value
    }
}

if (buyForm) {
    buyForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formResults = getOrderDetails();
        
        if (formResults) {
            // send order to firebase realtime db
            const orderSent = sendOrder(formResults.customerName, formResults.customerNumber, formResults.customerEmail, formResults.customerCountry, formResults.customerAddress, formResults.delivery, formResults.product, formResults.quantity, formResults.price, formResults.totalAmount, formResults.specifications);

            if (orderSent) {
                e.target.reset();
                document.getElementById("buy-input").innerHTML = "";
                successModal.style.display = 'flex';
                document.querySelector(".buy-sent").disabled = true;
                document.querySelector(".buy-sent").style.cursor = "not-allowed"
                localStorage.removeItem("product")
            } else {
                console.log('Error sending order')
            }
        }
    })
}