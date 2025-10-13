const createTree = (array  , parentId = "")=>{
  const newArr = [];
  for (const item of array) {
    if( item.parent_id== parentId){

      const children = createTree(array , item.id);
      if( children.length>0){
        item.children = children;
      
      }
      newArr.push(item);
    }
    
  }
return newArr;

}

module.exports.index = (array , parentId = "")=>{
const tree = createTree(array ,parentId);

return tree;



}





