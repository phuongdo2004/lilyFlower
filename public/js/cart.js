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




