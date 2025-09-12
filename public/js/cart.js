
socket.emit("CLIENT_UPDATE_QUANTITY" , {
  productId: "productId",
  quantity: "quantity",
})
//  check gchoosen start

const inputCheck  = document.querySelectorAll("[check-item]");
const inputChecked  = document.querySelectorAll("[check-item]:checked");
if( inputChecked.length>0){
console.log(inputChecked.length);
 
var arrPrice =[];
inputChecked.forEach(item=>{
  arrPrice.push(item.value);
})

  socket.emit("CLIENT_SEND_PRICE" , arrPrice);

}

if( inputCheck){
  inputCheck.forEach(item=>{
    item.addEventListener("click" , ()=>{
        console.log("click");

      const id = item.getAttribute("productId");

// duyet qua cac phantu dc checked
const checkItem  = document.querySelectorAll("[check-item]:checked");
var arrPrice =[];
checkItem.forEach(item=>{
  console.log(item);
  
  arrPrice.push(item.value);
})

  socket.emit("CLIENT_SEND_PRICE" , arrPrice);


  })

  })

}
socket.on("SEVER_SEND_TOTALPRICE" , data=>{
const totalPrice = parseInt(data.totalPrice) ;

const containerOrderPrice = document.querySelector(".order");

const orderPrice = containerOrderPrice.querySelector("h2");

  orderPrice.innerHTML = `Tổng đơn hàng :${data.totalPrice}$`;


})


//  check choosen end

// luu ppproductids vao db gui choo BE khi chuan bi mua start
const containerOrderPrice = document.querySelector(".order");

if(containerOrderPrice){

  const orderPrice = containerOrderPrice.querySelector("a");

if( orderPrice){
  orderPrice.addEventListener("click" , ()=>{
    console.log("chay ");

    const inputCheck = Array.from(document.querySelectorAll("[check-item]"));


    const inputChecked  = document.querySelectorAll("[check-item]:checked");
    const setB = new Set(inputChecked);

//  const C = A.filter(item => !BSet.has(item));
    const inputFalseCheckedC = inputCheck.filter(item => !setB.has(item));
   const arrayFalse  = [];
   console.log("opo");
   console.log(inputFalseCheckedC);

   inputFalseCheckedC.forEach(item =>{
    // console.log(item.getAttribute("productId"));
    arrayFalse.push(item.getAttribute("productId"));

   })


    if( inputChecked.length>0){
      const arrId = [];
      inputChecked.forEach(item=> {
        const id = item.getAttribute("productId");
        // console.log(id);
        arrId.push(id);


      })
      console.log(arrId);

 

      socket.emit("CLIENT_SEND_PRODUCTID_BUYS" , {
        
        arrId: arrId ,
        arrFalse: arrayFalse

      });
      

    }
  



  })
}
}

 


// luu ppproductids vao db gui choo BE khi chuan bi mua endd




