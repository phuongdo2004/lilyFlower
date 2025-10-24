const systemConfig = window.systemConfig;

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
}, 3000); // Tự động ẩn sau 3 giây


//  TOast Message end


// load đên strang nào li tự thêm class active vào 
document.addEventListener("DOMContentLoaded", () => {
  const currentUrl = window.location.pathname;

  const menuItems = document.querySelectorAll(".container__sider ul li a");
  menuItems.forEach(item => {
    if (item.getAttribute("href") == currentUrl) {
      //  truy van ra ther cha
      item.parentElement.classList.add("active");
    } else {
      item.parentElement.classList.remove("active");

    }
  })
})
// load đên strang nào li tự thêm class active vào  end 


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
//  loc trang thai  start
const btnStatus = document.querySelectorAll("[button-status]");

if (btnStatus.length > 0) {
  btnStatus.forEach(button => {
    const buttonStatus = button.getAttribute("button-status");
    if (buttonStatus == url.searchParams.get("status")) {
      button.classList.add("active");

    }
    button.addEventListener("click", () => {



      const status = button.getAttribute("button-status");

      const url = new URL(window.location.href);
      url.searchParams.set("status", status);
      window.location.href = url.href;



    })
  })


}


//  loc trang thai end 

// thay doi trang thai  start

const boxAction = document.querySelector("select[name = 'custom-select']");
if (boxAction) {
  const button = (document.querySelector("button[name ='statusBtn']"));

  if (button) {
    button.addEventListener("click", () => {
      var ids = [];
      const listId = document.querySelectorAll("input[name = 'checkItem']");

      listId.forEach(item => {
        if (item.checked) {
          ids.push(item.getAttribute("id"));
        }
      })
      const value = boxAction.value;
      const data = {
        ids: ids,
        value: value,
      }

      const link = boxAction.getAttribute("box-action");
      if (ids.length > 0 && value != "") {
        fetch(link, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),

        }).then(res => res.json())
          .then(data => {
            if (data.code == 200) {
              window.location.reload();
            }
          })
      } else {
        alert("vui long chon hanh dong va cac item can thay doi");
      }
    })
  }

}

//  thay doi trang thai end 
// sap xep multi start


const selectSort = document.querySelector("select[name = 'sort']");
if (selectSort) {

  selectSort.addEventListener("change", () => {
    const data = selectSort.value;
    const url = new URL(window.location.href);

    const [sortKey, sortValue] = (selectSort.value).split("-");


    if (sortKey && sortValue) {

      url.searchParams.set("sortKey", sortKey);
      url.searchParams.set("sortValue", sortValue);
      window.location.href = url.href;

    }
  })

}
//  them option mac dinh cho 

const sortKey = url.searchParams.get("sortKey");
const sortValue = url.searchParams.get("sortValue");
if (sortKey && sortValue) {
  const optionSelect = selectSort.querySelector(`option[value = '${sortKey}-${sortValue}']`)
  optionSelect.setAttribute("selected", true);
}
// sap xep multi end

//  Clear sap xep start
const btnClear = document.querySelector("button[sort-clear]");
if (btnClear) {
  btnClear.addEventListener("click", () => {
    url.searchParams.delete("sortKey");
    url.searchParams.delete("sortValue");
    window.location.href = url.href;
  })
}

//  clear sap xep end 


// change status product start

const listButtonStatus = document.querySelectorAll("[button-change-status]");
if (listButtonStatus) {
  listButtonStatus.forEach(btn => {
    btn.addEventListener("click", () => {
      const link = btn.getAttribute("link");
      fetch(link, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",

        },
      }).then(res => res.json())
        .then(data => {
          if (data.code == 200) {
            window.location.reload();
          }
        })
    })
  })
}

//  change status produc end


// check All start
const checkAll = document.querySelector("[checkAll]");
if (checkAll) {
  const listCheck = document.querySelectorAll("input[name = 'checkItem']");;

  checkAll.addEventListener("change", () => {

    listCheck.forEach(item => {
      item.checked = checkAll.checked;

    })
  })

}


//  check All end

// deleted product start
const listActiveElements = document.querySelectorAll(".active__admin");

if (listActiveElements) {
  listActiveElements.forEach(listActive => {
    const listButtons = listActive.querySelectorAll("button"); // Sửa thành "button"


    if (listButtons) {
      listButtons.forEach(button => {
        button.addEventListener("click", () => {
          const link = button.getAttribute("link");
          // Thêm logic xóa sản phẩm tại đây (ví dụ: gửi yêu cầu AJAX)
          fetch(link, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",

            },
          }).then(res => res.json())
            .then(data => {
              if (data.code == 200) {
                window.location.reload();

              }
            })
        });
      });
    }
  });
}
// deleted product end

// change position start
const listPositionChange = document.querySelectorAll("[changeStatusPosition]");
if (listPositionChange) {
  listPositionChange.forEach(input => {
    input.addEventListener("change", () => {
      const position = input.value;
      var data = {
        position: position
      }
      const link = input.getAttribute("link");

      fetch(link, {
        body: JSON.stringify(data),

        method: "PATCH",
        headers: {
          "Content-Type": "application/json",

        },
      })
        .then(res => res.json())
        .then(data => {
          if (data.code == 200) {
            window.location.reload();

          }
        })
    })
  })
}

// change position end


// permission start

const tablePermission = document.querySelector("[table-permissions]");
if (tablePermission) {
  const button = document.querySelector("[buttonPermission]");
  button.addEventListener("click", () => {
    const link = button.getAttribute("button-submit");

    const array = [];


    const listInputPermission = document.querySelectorAll("input:checked");
    if (listInputPermission.length > 0) {
      listInputPermission.forEach(input => {
        const data = input.getAttribute("data-name");
        const id = input.getAttribute("data-id");
        const role = {
          data: data,
          id: id,
        }
        array.push(role);


      })
    }
    const listElementRoleId = tablePermission.querySelectorAll("[role-id");
    const roles = [];

    for (const element of listElementRoleId) {
      const roleId = element.getAttribute("role-id");
      var role = {
        id: roleId,
        permission: [],
      }
      for (const item of array) {
        if (item.id == roleId) {
          role.permission.push(item.data);

        }

      }
      //   trar ve 1 mang du lieu 
      roles.push(role);
    }
    //loc cacs phantu theo id 
    fetch(link, {
      body: JSON.stringify(roles),

      method: "PATCH",
      headers: {
        "Content-Type": "application/json",

      },

    }).then(res => res.json())
      .then(data => {
        if (data.code == 200) {
          window.location.reload();
        }
      })
  })
}

// permission end
// role Deleted start
const butttonDeleted = document.querySelector("[buttonDeleted]");
if (butttonDeleted) {
  butttonDeleted.addEventListener("click", () => {
    const link = butttonDeleted.getAttribute("link");
    fetch(link, {

      method: "PATCH",
      headers: {
        "Content-Type": "application/json",

      },
    }).then(res => res.json())
      .then(data => {
        if (data.code == 200) {

          window.location.reload();

        }
      })


  })

}


// role Deleted end

// Start Choosing lastest message
async function getLatestChat() {
  const liChat = document.querySelector("[liChat]");
  if (liChat) {

    const linkChat = liChat.querySelector("a").getAttribute("href");
    const res = await fetch(linkChat);
    const response = await res.json();
    const messages = response.chats;


    const latestMessage = messages.reduce((latest, current) => {
      // So sánh và trả về object message mới nhất
      return !latest || new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest;
    }, null);

    if (latestMessage) {
      const roomChatIdLatest = latestMessage.roomChatId;
      // lay id khach hang 
      localStorage.setItem("roomChatIdLatest", roomChatIdLatest);
      liChat.querySelector("a").setAttribute("href", `${linkChat}/detail/${roomChatIdLatest}`);
    }
  }
}
getLatestChat();
// End Choosing lastest message

// chageStatusOrder start
const buttonChangeStatus = document.querySelector("[updateStatusOrder]");
if (buttonChangeStatus) {
  buttonChangeStatus.addEventListener("click", () => {
    const select = document.getElementById("statusSelect");
    const status = select.value;
    const link = buttonChangeStatus.getAttribute("link");
    fetch(link, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
          credentials: 'same-origin', // giữ cookie/session nếu cần
      },
      body: JSON.stringify({ status: status }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.code == 200) {
          window.location.href = `/${systemConfig.prefixAdmin}/orders`;
          if (data.flashes && data.flashes.success && data.flashes.success.length) {
    showToast(data.flashes.success[0]); // hiển thị message ngay
  }
        }
      });
  })
}
// changeStatusOrder end

// Delete order start
const butttonDeleteOrder = document.querySelector("[buttonDeleteOrder]");
if (butttonDeleteOrder) {
  butttonDeleteOrder.addEventListener("click", () => {
    const link = butttonDeleteOrder.getAttribute("link");
    fetch(link,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },

      }

    )
      .then(res => res.json())
      .then(data => {
        if (data.code == 200) {
          window.location.href = `/admin/orders`
        }
      })
  })
}

// Delete order end

// Load la trang khi  nhấn nút back trên trình duyệt
window.addEventListener('pageshow', function (event) {
  if (event.persisted) {
    window.location.reload();
  }
});
// Load la trang khi  nhấn nút back trên trình duyệt end


window.addEventListener("DOMContentLoaded", () => {

  // Xử lí sự kiện bôii trăng trong phần siderbar start
  const sidebar = document.querySelector(".container__sider");
  if (sidebar) {

    const listUl = sidebar.querySelectorAll("ul li a");
    if (listUl.length > 0) {
      const pathname = window.location.href;
      listUl.forEach(item => {
        if (pathname.includes(item.href)) {
          item.parentElement.classList.add("active")

        } else {
          item.parentElement.classList.remove("active");
        }



      })
    }
  }

  // Xử lí sự kiện bôii trăng trong phần siderbar end 

})
