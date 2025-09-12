const formChat = document.querySelector(".formChat");
const input = document.querySelector("input[name='content']");
const emojiPicker = document.querySelector('emoji-picker');
const chatContainer = document.querySelector(".chat-container");
const chatMessageContainer = document.querySelector(".chat-messages");
const typinContainer = document.querySelector(".inner-list-typing");
if(chatContainer){
  new Viewer(chatContainer);
} 
var cnt = 0;

// Lấy roomChatId từ URL nếu đường dẫn có "chat"
if (window.location.pathname.includes("chat")) {
  const pathParts = window.location.pathname.split("/");
  const roomChatId = pathParts[pathParts.length - 1];

  // Kết nối socket
  const socket = io();

  // Khi trang chat được load, join vào room
  socket.emit("JOIN_ROOM", roomChatId);

// Lắng nghe các sự kiện khác như typing, message...
socket.on("SERVER_SEND_TYPING", (data) => {
  // Xử lý hiển thị typing
});


// TYping start
var typingTimeOut;
if (formChat) {
  const userId = formChat.getAttribute("my-id");
  if (input) {
    input.addEventListener("keyup", () => {
      console.log("keyup");

      socket.emit("CLIENT_SEND_TYPING", {
        data: "show"
      });
      clearTimeout(typingTimeOut);
      typingTimeOut = setTimeout(() => {
        socket.emit("CLIENT_SEND_TYPING", {
          data: "hide"
        });
      }, 3000);

    });
  }

}


// SERVER_SEND_TYPING
socket.on("SERVER_SEND_TYPING", (data) => {
console.log("server gui");

  // console.log("userId" , userId);
  // console.log("data.userId" , data.userId);
  const existTyping = typinContainer.querySelector(`[user-id="${data.userId}"]`);
  if (data.data == "show") {
    // console.log("chay vao show");
    if (!existTyping) {
      // console.log("chay vaoqqqq client khac");
      const div = document.createElement("div");
      div.className = "box-typing";
      div.setAttribute("user-id", data.userId);
      div.innerHTML = `
  <div class="inner-name">${data.fullName}</div>
  <div class="inner-dots"><span></span><span></span><span></span></div>
  </div>
  `
      typinContainer.appendChild(div);

    }
  } else {
    // console.log(existTyping);
    // console.log("phai xoa phia client ");
    if (existTyping) {
      typinContainer.removeChild(existTyping);
    }
  }

})



// SERVER_SEND_TYPING

//Typing end
// ẩn hiện emoji start
if (input) {
  emojiPicker.addEventListener("emoji-click", (event) => {
    console.log(event.detail.unicode);
    input.value += event.detail.unicode;


  });
}


// ân hiện emoji start

const emojismile = document.querySelector(".far.fa-smile");
if (emojismile) {
  console.log(emojismile);
  emojismile.addEventListener("click", () => {
    emojiPicker.classList.toggle("active");
  });
}
// ẩn hiện emoji end

if (chatContainer) {

  if (formChat) {
    const upload = new FileUploadWithPreview.FileUploadWithPreview('upload-images', {
      multiple: true,
      maxFileCount: 6,
    });
    formChat.addEventListener("submit", (event) => {

      const images = upload.cachedFileArray;
      // anh upload mat di
      upload.resetPreviewPanel();
      event.preventDefault();
      const tokenUser = document.cookie.split('; ').find(row =>
        row.startsWith('tokenUser='));
      console.log(tokenUser);
      if (tokenUser) {

        const value = tokenUser.split('=')[1];
        const message = event.target.content.value;


        socket.emit("CLIENT_SEND_MESSGAE", {
          message: message,
          tokenUser: value,
          images: images,
        })

      }
      // console.log(event.target.content.value);


    })


    // SERVER__RETURN__MESSAGE
    socket.on("SERVER__RETURN__MESSAGE", (data) => {
      // console.log("data" , data);
      const div = document.createElement("div");
      let htmlContent = "";
      let htmlImages = "";
      const ClientId = formChat.getAttribute("my-id");
      let receivedHtmlContent = ``;
      if (data.userId == ClientId) {

        div.className = "messagechat sent";
        htmlContent = `<div class = "message-content">${data.content}</div>`
        div.innerHTML = htmlContent;
        chatMessageContainer.appendChild(div);
      } else {

        //  console.log("ben ng nhaanj");
        div.className = "messagechat received";
        receivedHtmlContent = `
    <div class = "user-info">
      <img src="${data.avatar}" alt="Avatar" class="avatar">
      <span class="username">${data.fullName}</span>
    </div>`;

      }
      if (data.content) {
        htmlContent = `<div class = "message-content">${data.content}</div>`

      }
      if (data.ArrayImages.length > 0) {
        htmlImages += `
  <div class = "message-images">`;
        for (const image of data.ArrayImages) {
          htmlImages += `
    <img src="${image}" alt="Image" class="message-image">`
        }
        htmlImages += `</div>`;
      }
      div.innerHTML = `${receivedHtmlContent}
${htmlContent}
${htmlImages}`;
      if (input) {
        input.value = "";
      }

      socket.emit("CLIENT_SEND_TYPING", {
        data: "hide"
      });
      chatMessageContainer.insertBefore(div, typinContainer);
      new Viewer(div);
  
      chatMessageContainer.scrollTop = chatMessageContainer.scrollHeight;
    })
  }

  chatMessageContainer.scrollTop = chatMessageContainer.scrollHeight;

}
}