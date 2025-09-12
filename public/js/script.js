var socket = io();

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


const modal = document.querySelector(".modal");

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
}, 3000); // Tự động ẩn sau 3 giây


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


// lay ra cac phuong xa 

// https://provinces.open-api.vn/api/d/1?depth=2




getData();


// xu li khi clicj vao cac the village ,  provice , distric start 
// const formAddress = document.querySelector(".formInforAddress");
// if (formAddress) {
//   const container = formAddress.querySelector(".proviceContainer");
//   if (container) {
//     const provice = container.querySelector(".city");
//     const distric = container.querySelector(".distric");
//     const village = container.querySelector(".village");
//     const labelDistric = distric.querySelector("label");
//     const labelVillage = village.querySelector("label");
//     const labelProvice = provice.querySelector("label");

//     if (provice) {
//       provice.addEventListener("click", () => {
//         //  add class actiive cho provice 


//         labelProvice.classList.add("active");
//         labelDistric.classList.remove("active");
//         labelVillage.classList.remove("active");
//         getData();



//       });



//     }
//   }


//   //  return an di formAddress start
//   const modalAddress = document.querySelector(".modal__Address");
//   if (modalAddress) {

//     const returnForm = formAddress.querySelector(".return");
//     if (returnForm) {

//       returnForm.addEventListener("click", () => {
//         modalAddress.classList.remove("active");

//       })
//     }

//   }
//   // return an diii formAddress end

// }
// xu li khi clicj vao cac the village ,  provice , distric end 
//  thay doii dia chi start
const btnAddress = document.querySelector(".change__address");
if (btnAddress) {

  btnAddress.addEventListener("click", () => {
    const modalAddress = document.querySelector(".modal__Address");
    modalAddress.classList.add("active");
  })
}

//  thay doiii diia ch end 
//  goi fetch khi dat hang start
const order = document.querySelector(".order");
if (order) {

  const btnOrder = order.querySelector("button");


  if (btnOrder) {
    btnOrder.addEventListener("click", () => {

      const container = document.querySelector(".address__container__body");
      if (container) {
        const fullName = container.querySelector(".infor__name").textContent;
        //  console.log(fullName.textContent);
        const phone = container.querySelector(".infor__phone").textContent;
        const address = container.querySelector(".infor__address").textContent;
        const data = {
          fullName: fullName,
          phone: phone,
          address: address
        }
        // goi ham fetch 
        fetch('checkout/order', {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          })
          .then(res => res.json())
          .then(data => {
            console.log(data);
            if (data.code == 200 && data.products) {
              // console.log(data.products);
              for (const element of data.products) {
                console.log(element.priceNew);

              }
              const queryParams = new URLSearchParams({
                products: JSON.stringify(data.products)
              }).toString();
              // console.log(queryParams);


              window.location.href = `/checkout/order/success`
            }



          })
      }
    })
  }


}

//  goi fetch khi dat hang end


// SEARCH SUGGESTION START
// const searchContainer = document.querySelector(".header__list__search");
// if (searchContainer) {
//   const form = searchContainer.querySelector("form");
//   const inputSearch = searchContainer.querySelector('input');
//   if (inputSearch) {
//     inputSearch.addEventListener("keyup", (e) => {
//       if (form.querySelector(".inner-suggest")) {

//         form.removeChild(form.querySelector(".inner-suggest"));
//       }
//       fetch(`/search/suggest?keyword=${e.target.value}`)
//         .then(res => res.json())
//         .then(data => {
//           if (data.code == 200) {
//             let subDiv2 = "";
//             const div = document.createElement("div");
//             div.classList.add("inner-suggest");
//             div.classList.add("show");
//             console.log(data.pro);
//             // (data.pro).forEach(item => {
//             for( var i = 0 ; i<= 7 ; i++){
//               let subDiv = `

//       <a class="inner-item" 

//       href="/products/detail/${data.pro[i].slug}">
//         <div class="inner-image">
//           <img src= ${data.pro[i].thumbnail}>
//         </div>
//         <div class="inner-info">
//           <div class="inner-title">${data.pro[i].title}</div>
//           <div class="inner-singer">
//            <i class="fa-solid fa-money-bill-1"></i>
//             ${data.pro[i].price} $
//             ${data.pro[i].description ? data.pro[i].description.substring(0, 60) : ''}...
//           </div>
//         </div>
//         </a>
//      `
//      console.log(div);
//               div.insertAdjacentHTML('beforeend', subDiv);
//               console.log(subDiv);

//             }
//             // console.log(div);
//             form.appendChild(div);
//           }
//         })
//     })
//   }
// }

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
// SEARCH SUGGESTION START
const searchContainer = document.querySelector(".header__list__search");
if (searchContainer) {
  const form = searchContainer.querySelector("form");
  const inputSearch = searchContainer.querySelector('input');
  if (inputSearch) {
    inputSearch.addEventListener("keyup", (e) => {
      // Xóa gợi ý cũ nếu có
      const oldSuggest = form.querySelector(".inner-suggest");
      if (oldSuggest) {
        form.removeChild(oldSuggest);
      }
      fetch(`/search/suggest?keyword=${e.target.value}`)
        .then(res => res.json())
        .then(data => {
          if (data.code == 200 && Array.isArray(data.pro)) {
            const div = document.createElement("div");
            div.classList.add("inner-suggest", "show");
            // Lặp tối đa 8 phần tử hoặc ít hơn nếu không đủ
            for (let i = 0; i < data.pro.length; i++) {
              const item = data.pro[i];
              if (!item || !item.slug || !item.thumbnail || !item.title) continue;
              let subDiv = `
    <a class="inner-item" href="/products/detail/${escapeHTML(item.slug)}">
      <div class="inner-image">
        <img src="${escapeHTML(item.thumbnail)}">
      </div>
      <div class="inner-info">
        <div class="inner-title">${escapeHTML(item.title)}</div>
        <div class="inner-singer">
          <i class="fa-solid fa-money-bill-1"></i>
          ${escapeHTML(item.price)} Vnd
          
        </div>
        <div class = "inner-desc">
        ${item.description ? escapeHTML(item.description.substring(0, 60)) : ''}...
        </div>
        </div>
    </a>
  `;
              div.innerHTML += subDiv;
            }
            form.appendChild(div);
          }
        });
    });
  }
}


// SEARCH SUGGESTION END
window.addEventListener("DOMContentLoaded", function () {
  // Kiểm tra nếu URL có "/category/" và có id phía sau
  const match = window.location.pathname.includes("order");
  if (match) {
    const orderIcon = this.document.querySelector(".containerInfor__user .container .buy");
    if (orderIcon) {

      orderIcon.classList.add("active");
      console.log(orderIcon);
    }
  }
  // check xem ao trang user đe them mau 
  const user = window.location.pathname.includes("user/edit");
  if (user) {
    const userIcon = this.document.querySelector(".containerInfor__user .container .account");
    console.log(userIcon);
    if (userIcon) {

      userIcon.classList.add("active");
      console.log(userIcon);
    }
  }
});

//  user/order start

const containerOrder = document.querySelector(".containerInfor__order");
if (containerOrder) {
  const containerOrder__header = containerOrder.querySelector(".containerInfor__order__header")
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


// user//order/end