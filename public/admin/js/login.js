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