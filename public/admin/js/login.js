// toast Message start
function hideToast() {
  let toast = document.querySelector(".toast");
  if (toast) {
    toast.classList.add("hide");
    setTimeout(() => {
      toast.classList.remove("active", "hide"); // Xóa cả hai class sau hiệu ứng
    }, 500);
  }
}

// Thêm sự kiện đóng toast
setTimeout(() => {
  hideToast();
}, 3000); 


//  TOast Message end