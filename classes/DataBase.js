import { People } from "./People.js";

//main database class holds all data
export class dataBase{
    constructor(){
        this.people = new People();
        this.labtests =[]
    }
}