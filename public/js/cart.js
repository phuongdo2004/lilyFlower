// socket.emit("CLIENT_UPDATE_QUANTITY", {
//   productId: "productId",
//   quantity: "quantity",
// })
// //  check gchoosen start

// const inputCheck = document.querySelectorAll("[check-item]");
// const inputChecked = document.querySelectorAll("[check-item]:checked");
// if (inputChecked.length > 0) {
//   var arrPrice = [];
//   inputChecked.forEach(item => {
//     arrPrice.push(item.value);
//   })
//   console.log("prepare sunbmit");
// console.log(inputChecked);
//   socket.emit("CLIENT_SEND_PRICE", arrPrice);

// }

// if (inputCheck) {
//   inputCheck.forEach(item => {
//     item.addEventListener("click", () => {
//       console.log("click");

//       const id = item.getAttribute("productId");

//       // duyet qua cac phantu dc checked
//       const checkItem = document.querySelectorAll("[check-item]:checked");
//       var arrPrice = [];
//       checkItem.forEach(item => {
//         console.log(item);

//         arrPrice.push(item.value);
//       })

//       socket.emit("CLIENT_SEND_PRICE", arrPrice);


//     })

//   })

// }
// socket.on("SEVER_SEND_TOTALPRICE", data => {
//   const totalPrice = parseInt(data.totalPrice);

//   const containerOrderPrice = document.querySelector(".order");

//   const orderPrice = containerOrderPrice.querySelector("h2");

//   orderPrice.innerHTML = `Tổng đơn hàng :${data.totalPrice.toLocaleString('vi-VN')}đ`;


// })


// //  check choosen end

// // luu ppproductids vao db gui choo BE khi chuan bi mua start
// const containerOrderPrice = document.querySelector(".order");

// if (containerOrderPrice) {

//   const orderPrice = containerOrderPrice.querySelector("a");

//   if (orderPrice) {
//     orderPrice.addEventListener("click", () => {
//       console.log("chay ");

//       const inputCheck = Array.from(document.querySelectorAll("[check-item]"));


//       const inputChecked = document.querySelectorAll("[check-item]:checked");
//       const setB = new Set(inputChecked);

//       //  const C = A.filter(item => !BSet.has(item));
//       const inputFalseCheckedC = inputCheck.filter(item => !setB.has(item));
//       const arrayFalse = [];
//       console.log("opo");
//       console.log(inputFalseCheckedC);

//       inputFalseCheckedC.forEach(item => {
//         // console.log(item.getAttribute("productId"));
//         arrayFalse.push(item.getAttribute("productId"));

//       })


//       if (inputChecked.length > 0) {
//         const arrId = [];
//         inputChecked.forEach(item => {
//           const id = item.getAttribute("productId");
//           // console.log(id);
//           arrId.push(id);


//         })
//         console.log(arrId);



//         socket.emit("CLIENT_SEND_PRODUCTID_BUYS", {

//           arrId: arrId,
//           arrFalse: arrayFalse

//         });


//       }




//     })
//   }
// }




// // luu ppproductids vao db gui choo BE khi chuan bi mua endd


// -----------------------------------------------------------------------------
// lm bang js 
// luu ppproductids vao db gui choo BE khi chuan bi mua start
// luu ppproductids vao db gui choo BE khi chuan bi mua start


 const formatCurrency = (amount) => {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };
async function createDataSendServer(isRedirectToCart = false) {
    const inputCheck = Array.from(document.querySelectorAll("[check-item]"));
    const inputChecked = document.querySelectorAll("[check-item]:checked");
    
    if (inputChecked.length === 0) {
        console.log("Không có sản phẩm nào được chọn.");
        return;
    }

    const setB = new Set(inputChecked);
    const inputFalseCheckedC = inputCheck.filter(item => !setB.has(item));
    
    const arrId = Array.from(inputChecked).map(item => item.getAttribute("productId"));
    const arrayFalse = Array.from(inputFalseCheckedC).map(item => item.getAttribute("productId"));

    const data = {
        arrId: arrId,
        arrFalse: arrayFalse
    };
    try {
        const response = await fetch(`/checkout/saveChoosen`, { // Sử dụng đường dẫn tuyệt đối
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        // Xử lý các lỗi HTTP
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Lỗi HTTP: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        
        if (result.code == 200) {
            console.log("Cập nhật thành công!");
            if (isRedirectToCart) {
                window.location.href = `/cart/`;
            } else {
                window.location.href = `/checkout/`;
            }
        } else {
            console.log("Cập nhật không thành công.");
        }
    } catch (error) {
        console.error("Lỗi khi gửi dữ liệu:", error);
    }
}

function sendArrCheckedToServer() {
    console.log("chay vao sendArrCheckedToServer");
    const containerOrderPrice = document.querySelector(".order");
    if (containerOrderPrice) {
        const orderPrice = containerOrderPrice.querySelector("a");
        if (orderPrice) {
            orderPrice.addEventListener("click", () => {
                createDataSendServer(false); // Đặt lại về checkout
            });
        }
    }
}

// Hàm khởi tạo ban đầu khi trang tải
document.addEventListener("DOMContentLoaded", () => {
    const tableCart = document.querySelector(".list_products");
    if (!tableCart) return;
    const orderPart = document.querySelector(".order");
    const loadCheckedInput = (listInputChecked) => {
        let totalPriceCart = 0;
        const totalPriceHtml = orderPart ? orderPart.querySelector("h2") : null;
        const formatCurrency = (amount) => {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
        };
        listInputChecked.forEach(input => {
            totalPriceCart += Number(input.value);
        });
        
        if (totalPriceHtml) {
            totalPriceHtml.textContent = formatCurrency(totalPriceCart);
        }
    };

    const clickCheckedInput = () => {
        const listInputCheck = tableCart.querySelectorAll("[check-item]");
        if (listInputCheck.length > 0) {
            listInputCheck.forEach(input => {
                input.addEventListener("click", () => {
                    createDataSendServer(true); // Đặt lại về cart
                    const listChecked = tableCart.querySelectorAll("[check-item]:checked");
                    loadCheckedInput(listChecked);
                });
            });
        }
    };

    const listInputChecked = tableCart.querySelectorAll("[check-item]:checked");
    loadCheckedInput(listInputChecked);
    clickCheckedInput();
    sendArrCheckedToServer();
});




