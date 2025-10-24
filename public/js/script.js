var socket = io();
console.log("chay vao script");
const modal = document.querySelector(".modal");
const carousel = document.getElementById('carousel');
 const track = document.getElementById('track');
//xử lí các ảnh lướt ang bên
function scrollImage(){
      const slides = Array.from(track.children);
      const dotsContainer = document.getElementById('dots');
      let index = 0;
      let interval = 3000; // ms
      let timer;

      // create dots
      slides.forEach((s,i)=>{
        const d = document.createElement('div');
        d.className = 'dot' + (i===0? ' active':'');
        d.dataset.i = i;
        dotsContainer.appendChild(d);
      });
      const dots = Array.from(dotsContainer.children);

      function setActive(i){
        slides.forEach((s,idx)=> s.classList.toggle('active', idx===i));
        dots.forEach((d,idx)=> d.classList.toggle('active', idx===i));
      }

      function moveToNext(){
        index = (index+1)%slides.length;
        setActive(index);
      }

      function start(){ timer = setInterval(moveToNext, interval); }
      function stop(){ clearInterval(timer); }

      // pause on hover
      const carousel = document.getElementById('carousel');
      carousel.addEventListener('mouseenter', stop);
      carousel.addEventListener('mouseleave', start);

      // click dots
      dots.forEach(d=> d.addEventListener('click', e=>{
        index = Number(e.target.dataset.i);
        setActive(index);
        stop(); start();
      }));

      start();
    };
if(track){
    scrollImage();

}
if (document.querySelector("[upload-image-input]")) {
  document.querySelector("[upload-image-input]").addEventListener("change", (event) => {

    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const img = document.getElementById("preview");
        img.src = e.target.result;
        img.style.display = "block";
        document.querySelector("[upload-image-input]").value = img.src;

      };
      reader.readAsDataURL(file);

    }

  })
}
// toast Message start
function hideToast() {
  let toast = document.querySelector(".toast");
  if (toast) {
    toast.classList.add("hide");
    setTimeout(() => {
      toast.classList.remove("active", "hide"); // Xóa cả hai class sau hiệu ứng
    }, 500); // Thời gian khớp với transition (0.5s)
  }
}

// Thêm sự kiện đóng toast
setTimeout(() => {
  hideToast();
}, 3000);


//  TOast Message end

const formLogin = document.querySelector(".form");
const formSignin = document.querySelector(".form1");
const removeLogin = document.querySelectorAll(".butLogin")
if (removeLogin) {
  removeLogin.forEach(item => {
    item.addEventListener("click", () => {
      modal.style.display = "none";
      formLogin.style.display = "none";
      formSignin.style.display = "none";
    })

  })

}


//  phan trang start
const paginationItem = document.querySelectorAll("[button-pagination]");
const url = new URL(window.location.href);
if (paginationItem.length > 0) {
  paginationItem.forEach(item => {
    item.addEventListener("click", () => {
      const page = item.getAttribute("button-pagination");
      url.searchParams.set("page", page);
      window.location.href = url.href;

    })
  })

}

//  phân trang end
// loginHOme , Signin start
const loginHome = document.querySelector(".loginHome");
if (loginHome) {
  loginHome.addEventListener("click", () => {
    modal.style.display = "flex";
    formLogin.style.display = "flex";
  })
}
const SigninHome = document.querySelector(".signinHome");
if (SigninHome) {
  SigninHome.addEventListener("click", () => {
    modal.style.display = "flex";
    formSignin.style.display = "flex";
  })
}


// LoginHOme   , Signin end// 
// scoll start
const aboutLink = document.getElementById("about-link");
if (aboutLink) {
  aboutLink.addEventListener("click", function () {
    const homeSection = document.getElementById("about-section");
    homeSection.scrollIntoView({
      behavior: "smooth"
    });

  });
}

const homeLink = document.getElementById("home-link");
if (homeLink) {
  document.getElementById("home-link").addEventListener("click", function () {
    const homeSection = document.getElementById("home-section");
    homeSection.scrollIntoView({
      behavior: "smooth"
    });

  });
}

const reviewLink = document.getElementById("review-link");
if (reviewLink) {
  document.getElementById("review-link").addEventListener("click", function () {
    const homeSection = document.getElementById("review-section");
    homeSection.scrollIntoView({
      behavior: "smooth"
    });
  });
}

const contactLink = document.getElementById("contact-link");
if (contactLink) {
  document.getElementById("contact-link").addEventListener("click", function () {
    const homeSection = document.getElementById("contact-section");
    homeSection.scrollIntoView({
      behavior: "smooth"
    });

  });
}


const productLink = document.getElementById("product-link");
if (productLink) {
  document.getElementById("product-link").addEventListener("click", function () {
    const homeSection = document.getElementById("product-section");
    homeSection.scrollIntoView({
      behavior: "smooth"
    });

  });
}

// taiar lại trang scoll ở vị trí ban đầu 
window.onload = function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
};

// scoll end

// submit form start
const formDetail = document.getElementById("productFormDetail");
if (formDetail) {
  const id = formDetail.getAttribute("idProduct");
  const buttonCart = formDetail.querySelector(".cart");
  if (buttonCart) {
    buttonCart.addEventListener("click", () => {
      formDetail.action = `/cart/add/${id}`
    })
  }

  const buttonBuy = formDetail.querySelector(".buy");
  if (buttonBuy) {
    buttonBuy.addEventListener("click", () => {
      formDetail.action = `/cart/add/buy/${id}`;
    })
  }

}
// submit form end


// update quantityy order start 
const inputQuantity = document.querySelectorAll("input[name  = 'quantity']");
if (inputQuantity.length > 0) {
  inputQuantity.forEach(input => {
    input.addEventListener("change", () => {
      const quantity = parseInt(input.value);
      const productId = input.getAttribute('productId');
      if (productId) {
        window.location.href = `/cart/update/${productId}/${quantity}`;
      }
    })
  })
}

// upddate quantity order  end


//  check choosen start

const inputCheck = document.querySelectorAll("[check]");
if (inputCheck) {
  inputCheck.forEach(item => {
    item.addEventListener("click", () => {
      const id = item.getAttribute("productId");
    })
  })
}


//  check choosen end
// formAddress start
const selectContainer = document.querySelector(".selectContainer");
if (selectContainer) {
  selectContainer.addEventListener("click", (event) => {
    event.stopPropagation();
    document.querySelector(".select-box").classList.toggle("active");
  });

}



function getData() {
  const selectContainer = document.querySelector(".selectContainer");
  if (selectContainer) {
    const city = selectContainer.querySelector(".city");
    const distric = selectContainer.querySelector(".distric");
    const village = selectContainer.querySelector(".village");
    const selected = selectContainer.querySelector(".selected");
    const lableProvice = document.querySelector(".proviceContainer");
    const la = lableProvice.querySelector(".city").querySelector("label");
    const dis = lableProvice.querySelector(".distric").querySelector("label");
    const lableCity = lableProvice.querySelector(".city").querySelector("label");
    const vill = lableProvice.querySelector(".village").querySelector("label"); {
      if (document.querySelectorAll('.formInforAddress')) {
        if (selectContainer) {


          // append data privice 
          fetch("https://provinces.open-api.vn/api/p/")
            .then(response => response.json())
            .then(data => {
              let provinceSelect = document.querySelector(".options-container");
              // Xóa nội dung cũ trước khi thêm mới (tránh lỗi trùng)
              provinceSelect.innerHTML = "";
              // add class active vao lable 
              la.classList.add("active");
              // Thêm tất cả các option vào container
              data.forEach(province => {
                let option = document.createElement("div");
                option.classList = "option";
                option.setAttribute("provice", "true");
                option.value = province.code;
                option.textContent = province.name;
                option.innerHTML =
                  `<input type="radio" class="radio" id=${province.code} name="address">
                  <label  class = "lableList" >
                    ${province.name}
                  </label>
                  `;

                provinceSelect.appendChild(option);
              });

              // lang nghe su kien click chọn
              document.querySelectorAll('[provice]').forEach(option => {
                option.addEventListener('click', (event) => {
                  event.stopPropagation(); // Ngăn sự kiện lan truyền lên cha
                  let input = option.querySelector('.radio');
                  let lable = option.querySelector(".lableList");
                  input.checked = true;

                  selected.value = `${(lable.innerHTML).trim()}`;

                  // an di de hien ra cac huyen 
                  let provinceCode = input.getAttribute("id");

                  fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`)
                    .then(response => response.json())
                    .then(distric => {
                      const str = selected.value
                      const tring = str.trim();
                      provinceSelect.innerHTML = "";
                      // add class active vao lable 
                      // bo class active o tinh, thanh pho

                      la.classList.remove("active");
                      // them active vao quan huyen 
                      // const lableDistric = document.querySelector(".proviceContainer");
                      dis.classList.add("active");
                      // add class active vao lable 

                      if (distric.name == tring) {
                        (distric.districts).forEach(item => {
                          let option = document.createElement("div");
                          option.classList = "option";
                          option.setAttribute("distric", "true");

                          // option.value = item.code;
                          // option.textContent = item.name;
                          option.innerHTML = `<input type="radio" class="radio" id=${item.code} name="address">
  
                          <label  class = "lableList" >
                            ${item.name}
                          </label>
                          `


                          provinceSelect.appendChild(option);
                        })
                        document.querySelectorAll('[distric]').forEach(option => {

                          option.addEventListener('click', (event) => {

                            event.stopPropagation(); // Ngăn sự kiện lan truyền lên cha
                            dis.classList.remove("active");
                            console.log(dis);
                            let input = option.querySelector('.radio');
                            let lable = option.querySelector(".lableList");
                            input.checked = true;

                            selected.value = `${selected.value} / ${(lable.innerHTML).trim()}`;
                            // https://provinces.open-api.vn/api/d/1?depth=2
                            const districCode = input.getAttribute("id");
                            provinceSelect.innerHTML = "";
                            fetch(`https://provinces.open-api.vn/api/d/${districCode}?depth=2`)
                              .then(response => response.json())
                              .then(data => {

                                (data.wards).forEach(item => {
                                  const wards = document.createElement("div");

                                  // add class active vao lable 
                                  // bo class active o tinh thnah pho

                                  la.classList.remove("active");
                                  lableCity.classList.remove("active");

                                  // them active vao quan huyen 
                                  // const lableDistric = document.querySelector(".proviceContainer");
                                  vill.classList.add("active");

                                  wards.classList = "option";
                                  wards.setAttribute("wards", "true");
                                  wards.innerHTML = `<input type="radio" class="radio" id=${item.code} name="address">
                                <label  class = "lableList" >
                                  ${item.name}
                                </label>
                      `
                                  provinceSelect.appendChild(wards);
                                })
                                document.querySelectorAll("[wards]").forEach(option => {
                                  option.addEventListener("click", (e) => {
                                    e.stopPropagation(); // Thêm dòng này!
                                    const lable = option.querySelector(".lableList");
                                    selected.value = `${selected.value} / ${(lable.innerHTML).trim()}`;
                                    // an di cacc lua chon                           
                                    // const aa = document.querySelector(".select-box");
                                    document.querySelector(".itemVillage").classList.remove("active");
                                    document.querySelector(".select-box").classList.remove("active");
                                    console.log(document.querySelector(".select-box"));
                                    // Nhung ban do  
                                    const address = selected.value.replace(/\s*\/\s*/g, ', ');
                                    const encoded = encodeURIComponent(address);
                                    const iframe = `<iframe width="391" height="140" style="border:0" loading="lazy"
          allowfullscreen referrerpolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps?q=${encoded}&output=embed"></iframe>`;
                                    document.querySelector(".map").innerHTML = iframe;
                                    getData();
                                  })
                                })

                              })
                          })
                        })
                      }
                    });
                });
              });
            })
        }

      }
    }
  }
}

getData();

//  thay doii dia chi start
const btnAddress = document.querySelector(".change__address");
if (btnAddress) {
  btnAddress.addEventListener("click", () => {
    const modalAddress = document.querySelector(".modal__Address");
    modalAddress.classList.add("active");
  })
}

//  thay doiii diia ch end 
//  checkout/payment start 
if(document.querySelector(".orderCheckout")){
  const buttonPayment = document.querySelector(".orderCheckout").querySelector("button");
const container = document.querySelector(".address__container__body");
if (container) {
  const fullName = container.querySelector(".infor__name").textContent.trim();
  const phone = container.querySelector(".infor__phone").textContent.trim();
  const address = container.querySelector(".infor__address").textContent.trim();
  // Lấy giá tiền từ thẻ h2 trong .orderCheckout
  const totalPriceText = document.querySelector(".orderCheckout h2").textContent;
  // Cắt lấy số tiền, loại bỏ chữ và ký tự không phải số, dấu chấm
  const totalPrice = totalPriceText.replace(/[^\d.]/g, '').trim();
  
  const data = {
    fullName: fullName,
    phone: phone,
    address: address,
    totalPrice: totalPrice // gửi lên server
  };
if( buttonPayment.addEventListener("click" , ()=>{
  fetch('/checkout/payment', {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(data),
}).then(res=> res.json())
.then(data=>{
  if( data.payUrl){
    window.location.href = data.payUrl;
  }
})

}));
}

}



//  checkout payment end
function escapeHTML(str) {
  const temp = document.createElement("div");
  temp.innerHTML = str;
  const description = temp.textContent || temp.innerText || "";
  if (!description) return '';
  return String(description)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
// Hàm escapeHTML để ngăn chặn XSS, đảm bảo an toàn
function escapeHTML(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

// SEARCH SUGGESTION START
const searchContainer = document.querySelector(".header__list__search");
if (searchContainer) {
    const form = searchContainer.querySelector("form");
    const inputSearch = searchContainer.querySelector('input[type="text"]'); // Chỉ định type nếu có nhiều input
    if (inputSearch) {
        let timeoutId; // Để debounce các yêu cầu fetch
        inputSearch.addEventListener("keyup", (e) => {
            const keyword = e.target.value.trim(); // Loại bỏ khoảng trắng thừa
            // --- Cải thiện: Xóa gợi ý cũ trước khi thêm mới hoặc nếu không có từ khóa ---
            // Tìm hộp gợi ý hiện có và xóa nó
            const existingSuggestBox = form.querySelector(".inner-suggest");
            if (existingSuggestBox) {
                form.removeChild(existingSuggestBox);
            }

            if (keyword.length === 0) { // Nếu ô tìm kiếm trống, không làm gì cả
                return; // Thoát khỏi hàm để không tạo gợi ý mới
            }
            // --- Hết phần cải thiện ---

            
timeoutId = setTimeout(() => {
    fetch(`/search/suggest?keyword=${encodeURIComponent(keyword)}`) // Encode keyword cho an toàn URL
        .then(res => res.json())
        .then(data => {
          console.log(data);
            // --- Cải thiện: Xóa gợi ý cũ một lần nữa nếu có request mới hoàn thành ---
            const currentSuggestBox = form.querySelector(".inner-suggest");
            if (currentSuggestBox) {
                form.removeChild(currentSuggestBox);
            }
            // --- Hết phần cải thiện ---

            if (data.code === 200 && Array.isArray(data.pro) && data.pro.length > 0) {
                const div = document.createElement("div");
                div.classList.add("inner-suggest", "show"); // Thêm class show để hiển thị
                
                // Lặp tối đa 8 phần tử hoặc ít hơn nếu không đủ
                for (let i = 0; i < data.pro.length && i < 8; i++) { // Giới hạn 8 phần tử
                    const item = data.pro[i];
                    // Đảm bảo item và các thuộc tính quan trọng tồn tại
                    if (!item || !item.slug || !item.thumbnail || !item.title || item.price === undefined) continue;
                    
                    // Kiểm tra và cung cấp giá trị mặc định cho description nếu nó null/undefined
                    const description = item.description ? escapeHTML(item.description.substring(0, 60)) : 'Không có mô tả';

                    let itemHTML = `
                        <a class="inner-item" href="/products/detail/${escapeHTML(item.slug)}">
                            <div class="inner-image">
                                <img src="${escapeHTML(item.thumbnail)}" alt="${escapeHTML(item.title)}">
                            </div>
                            <div class="inner-info">
                                <div class="inner-title">${escapeHTML(item.title)}</div>
                                <div class="inner-singer">
                                    <i class="fa-solid fa-money-bill-1"></i>
                                    ${escapeHTML(item.price.toLocaleString('vi-VN'))} VNĐ
                                </div>
                                <div class="inner-desc">
                                    ${description}...
                                </div>
                            </div>
                        </a>
                    `;
                    div.innerHTML += itemHTML;
                }
                
                form.appendChild(div); // Thêm hộp gợi ý mới vào form
                console.log(form);
            } else {
                // Nếu không có kết quả hoặc lỗi, đảm bảo hộp gợi ý bị xóa (đã xử lý ở trên)
                // hoặc ẩn đi nếu bạn muốn giữ DOM nhưng chỉ ẩn bằng CSS
                // const currentSuggestBox = form.querySelector(".inner-suggest");
                // if (currentSuggestBox) {
                //     currentSuggestBox.classList.remove("show"); // Nếu bạn muốn ẩn thay vì xóa
                // }
            }
        })
        .catch(error => {
            console.error('Lỗi khi lấy gợi ý tìm kiếm:', error);
            const currentSuggestBox = form.querySelector(".inner-suggest");
            if (currentSuggestBox) {
                form.removeChild(currentSuggestBox); // Xóa gợi ý khi có lỗi
            }
        });
}, 300);
});

        // Lắng nghe sự kiện blur (rời khỏi) ô input để ẩn gợi ý
inputSearch.addEventListener("blur", () => {
    // Sử dụng setTimeout để tạo độ trễ nhỏ
    // Điều này cho phép sự kiện click trên các liên kết bên trong
    // ô gợi ý được xử lý trước khi hộp gợi ý bị ẩn.
    setTimeout(() => {
        const suggestBox = form.querySelector(".inner-suggest.show");
        if (suggestBox) {
            // Thay vì removeChild, chúng ta chỉ xóa class "show" để ẩn bằng CSS
            suggestBox.classList.remove("show"); 
        }
    }, 200); // 200ms là độ trễ hợp lý
});

// Lắng nghe sự kiện focus (khi click vào ô input) để hiển thị lại gợi ý nếu có dữ liệu
inputSearch.addEventListener("focus", () => {
    const keyword = inputSearch.value.trim();
    const suggestBox = form.querySelector(".inner-suggest"); // Lấy hộp gợi ý (có thể đang ẩn)

    // Nếu có từ khóa và hộp gợi ý đã tồn tại (dù đang ẩn), hiển thị lại
    if (keyword.length > 0 && suggestBox) {
        suggestBox.classList.add("show");
    }
});
}
}
//  user/order start

const containerOrder = document.querySelector(".containerInfor__order");
if (containerOrder) {
  const containerOrder__header = containerOrder.querySelector(".containerInfor__order__header")
  if(containerOrder__header){
    const listButton = containerOrder__header.querySelectorAll("div");
  const containerTable = containerOrder.querySelector(".container");

  listButton.forEach(item => {
    item.addEventListener("click", () => {
      const itemClass = (item.classList)[0];
      fetch(`/user/order/${itemClass}`)
        .then(res => res.json())
        .then(data => {
          
          containerTable.innerHTML = "";
          const orders = data.orders;
          var htmlContent = ``;
          for (const item of orders) {
            let statusBadge = '';
            if (item.status === 'Chờ xác nhận') {
              statusBadge = '<span class="statusBadge pending">Chờ xác nhận</span>';
            } else if (item.status === 'Đang xử lý') {
              statusBadge = '<span class="statusBadge inProgress">Đang xử lý</span>';
            } else if (item.status === 'Đã hủy') {
              statusBadge = '<span class="statusBadge cancelled">Đã hủy</span>';
            } else if (item.status === 'Đang vận chuyển') {
              statusBadge = '<span class="statusBadge delivering">Đang vận chuyển</span>';
            } else if (item.status === 'Trả lại') {
              statusBadge = '<span class="statusBadge return">Trả lại</span>';
            } else if (item.status === 'Đã giao') {
              statusBadge = '<span class="statusBadge delivered">Đã giao</span>';
            } else {
              statusBadge = `<span class="statusBadge">${item.status}</span>`;
            }

            htmlContent += `<div class="tableContainer">
    <div class="table-row" onclick="window.location.href = '/user/order/detail/${item._id}'">
        <div class="product-name">${item._id}</div>
        <div class="cell">
            <img class="product-image" src=${item.firstOdrderImage} alt='ảnh hoa'>
        </div>
        <div class="cell">${Number(item.price).toLocaleString('vi-VN')} vnđ</div>
        <div class="cell">${item.createdAtFormatted}</div>
        <div class="cell">${item.payment}</div>
        <div class="cell">
            ${statusBadge}
        </div>
    </div>
</div>`
          }
          containerTable.innerHTML = htmlContent;
        })
      item.classList.add("active");
      listButton.forEach(button => {
        if (button.classList[0] != itemClass) {
          button.classList.remove("active");
        }
      })
    })
  })
  }
  
}


// user//order/end
// cancel Order start
const btnCancelOrder = document.querySelector(".btnCancelOrder");
if( btnCancelOrder){
  btnCancelOrder.addEventListener("click" , ()=>{
   const orderId  = btnCancelOrder.getAttribute("id");
   console.log(orderId);
   fetch(`/user/order/cancel/${orderId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  
}).then(res=> res.json())
.then(data=>{
 if( data.code ==200){
  btnCancelOrder.classList.add("inactive");
  // window.location.reload();
 }
})
  })
}

// cancel Order end