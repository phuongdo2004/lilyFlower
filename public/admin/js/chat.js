
const typinContainer = document.querySelector(".inner-list-typing");
const chatContainer = document.querySelector(".chat-container");
const chatMessageContainer = chatContainer.querySelector(".chat-messages");
const formChat = document.querySelector(".formChat");
const input = formChat.querySelector("input[name='content']");
const emojiPicker = document.querySelector('emoji-picker');
const emojiBtn = formChat.querySelector('.fa-smile');
const imageBtn = formChat.querySelector('.fa-image');
const userId = formChat.getAttribute("my-id");
var typingTimeOut;
var cnt =0;

// Lấy roomChatId từ URL nếu đường dẫn có "chat"
if (window.location.pathname.includes("chat")) {
  const pathParts = window.location.pathname.split("/");
  const roomChatId = pathParts[pathParts.length - 1];

  // Kết nối socket
  const socket = io();

  // Khi trang chat được load, join vào room
  socket.emit("JOIN_ROOM", roomChatId);

if(chatContainer){
  new Viewer(chatContainer ,{
   
  }
)} 
if( input){
  input.addEventListener("keyup", () => {

      socket.emit("CLIENT_SEND_TYPING" ,{data:"show" });
       clearTimeout(typingTimeOut);
       typingTimeOut = setTimeout(() => {
         socket.emit("CLIENT_SEND_TYPING" ,{data:"hide"});
       }, 3000);

  });
}

// SERVER_SEND_TYPING
socket.on("SERVER_SEND_TYPING" , (data)=>{
// console.log("data" , data.userId);
// console.log("userId" , userId);

  const existTyping = typinContainer.querySelector(`[user-id="${data.userId}"]`);

if(data.data=="show"){
  // console.log("chay vao show");
  // console.log("exitstTyping" , existTyping);
  if(!existTyping){

  const div = document.createElement("div");
  div.className = "box-typing";
  div.setAttribute("user-id", data.userId);
  // console.log("data.fullName" , data.fullName);
  div.innerHTML = `
  <div class="inner-name">${data.fullName}</div>
  <div class="inner-dots"><span></span><span></span><span></span></div>
  </div>
  `
  typinContainer.appendChild(div);
}
}else{
  if(existTyping){
    // console.log("phair remove Typing");

  typinContainer.removeChild(existTyping);
}
}



})



// SERVER_SEND_TYPING

//Typing end


 emojiPicker.addEventListener("emoji-click", (event) => {
    input.value += event.detail.unicode;    


  });
// ân hiện emoji start

const emojismile = document.querySelector(".far.fa-smile");
if (emojismile) { 
  // console.log(emojismile);
  emojismile.addEventListener("click", () => {
    emojiPicker.classList.toggle("active");
  });
}
// ẩn hiện emoji end
// CLIENT_SEND_MESSAGE
if( chatContainer){
  

  const formChat = chatContainer.querySelector(".formChat");
  if( formChat){
    const upload = new FileUploadWithPreview.FileUploadWithPreview('upload-images' , 
      {
        multiple: true , 
        maxFileCount: 6,
      }
    );
    formChat.addEventListener("submit" , (event)=>{
  // clearTimeout(typingTimeOut); // Hủy hẹn giờ ở đây
      event.preventDefault();
      const images = upload.cachedFileArray;
 // anh upload mat di
    upload.resetPreviewPanel();
      // console.log(images);
      const tokenUser = document.cookie.split('; ').find(row =>
         row.startsWith('tokenSale='));
         
        //  console.log(tokenUser);
      if (tokenUser) {


  const value = tokenUser.split('=')[1];
  // console.log(value);
var message = event.target.content.value;
if(message == ""){
  console.log("oooooo");
  message ="👍️"
  console.log(message);
}

      // console.log(socket);
      socket.emit("CLIENT_SEND_MESSGAE" ,{
        message: message ,
        tokenSale: value , 
        images: images,
      
      })

}
      // console.log(event.target.content.value);
      

     hidePlane(); 
    })


    // SERVER__RETURN__MESSAGE
 socket.on("SERVER__RETURN__MESSAGE" , (data)=>{
  const div = document.createElement("div");
let htmlContent  = "";
let htmlImages = "";
const formChat = document.querySelector(".formChat");

const input = formChat.querySelector("input[name='content']");

const AccountId  = formChat.getAttribute('my-id');
// const chatMessageContainer = chatContainer.querySelector(".chat-messages");
let receivedHtmlContent =``;
console.log(data);
  if( data.saleId ==AccountId ){
    // console.log("trung ten admin");

    div.className = "messagechat sent";
   
chatMessageContainer.appendChild (div);
  }else{
    // console.log("ben ng nhaanj");
    div.className  ="messagechat received";
     receivedHtmlContent = `
    <div class = "user-info">
      <img src="${data.avatar}" alt="Avatar" class="avatar">
      <span class="username">${data.fullName}</span>
    </div>`;

    
  }
if(data.content){
  console.log("data-coontent" ,  data.content);

    htmlContent = `
    <div class = "message-content">${data.content}</div>`
    
}
// console.log("data.ArrayImages" , data.ArrayImages);
if( data.ArrayImages.length > 0){
   htmlImages += `
  <div class = "message-images">`;
  for( const image of data.ArrayImages){
    htmlImages += `
    <img src="${image}" alt="Image" class="message-image">`
  }
  htmlImages += `</div>`;
}
div.innerHTML = `${receivedHtmlContent}
${htmlContent}
${htmlImages}`;
console.log(`${receivedHtmlContent}
${htmlContent}
${htmlImages}`);

  input.value = "";
chatMessageContainer.scrollTop  = chatMessageContainer.scrollHeight;
  socket.emit("CLIENT_SEND_TYPING" ,{data:"hide" });
  chatMessageContainer.insertBefore(div, typinContainer);
  new Viewer(div);

//  if( data.userId ==ClientId ){
// chatMessageContainer.scrollTop  = chatMessageContainer.scrollHeight;
//  }
 })
  }


chatMessageContainer.scrollTop  = chatMessageContainer.scrollHeight;
}

function addActiveOnLi(){
const url = window.location.href.split("/");
const idRoomChat = url[url.length-1];
const sider = document.querySelector(".container__siderChat");
if( sider){
  const ArrayLi = sider.querySelectorAll("li>a");
  for (const ele of ArrayLi) {
    const link = ele.getAttribute("href").split("/");
    const roomChat = link[link.length -1];
    if( idRoomChat === roomChat){
      const Parent = ele.parentElement;
      Parent.classList.add("active");
      
    }

  }

}
}
addActiveOnLi();
// focus vao input thi biểu tg gửi đi hiện ra 
// formChat.querySelector("input").addEventListener("change" , ()=>{
//   console.log("oo[[");

//   const plane = formChat.querySelector(".far.fa-paper-plane");
//   const like = formChat.querySelector(".fa-solid.fa-thumbs-up.active");
//   plane.classList.add("active");
//   like.classList.remove("active");

// })

function showPlane() {
    const plane = formChat.querySelector(".far.fa-paper-plane");
  const like = formChat.querySelector(".fa-solid.fa-thumbs-up");
  plane.classList.add('active');
  like.classList.remove('active');
}
function hidePlane() {
  const plane = formChat.querySelector(".far.fa-paper-plane");
  const like = formChat.querySelector(".fa-solid.fa-thumbs-up");
  plane.classList.remove('active');
  like.classList.add('active');
}
// input.addEventListener("blur" , hidePlane);
// Khi focus vào input
input.addEventListener('focus', showPlane);

// Khi click vào emoji icon
emojiBtn.addEventListener('click', showPlane);

// Khi click vào icon ảnh
imageBtn.addEventListener('click', showPlane);
}
