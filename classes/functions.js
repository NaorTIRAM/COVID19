
//helper functions used often by program

//check if a field is unique in an array
export function isUnique(array, value, arg_name){
    for (let i =0; i<array.length; i++) {
        if (array[i][arg_name] == value) {
            return Promise.reject('ID taken')
        }
    }
    return true;
}

//this function returns MULTIPLE objects with the field id in them
export function getAllByID(arr, id, arg_name){
    let tmp = [];
    for (let i =0; i<arr.length; i++)
        if (arr[i][arg_name] == id)
            tmp.push(arr[i]);
    return tmp;
}


//this function returns a SINGLE objects with the field id in them
export function getSingleByID(arr, id, arg_name){
    let tmp;
    for (let i =0; i<arr.length; i++)
        if (arr[i][arg_name] == id){
            tmp = arr[i];
            break;
        }
    return tmp;
}