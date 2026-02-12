//importing database functions
import {central, db1, db2, db3, vault} from "./database.js";
 
//main function
export async function getUserData(id) {
 
    //step 1: validate input
    if(typeof id !== "number") {
        throw new Error("Invalid Input -- Not a Number!");
    }
    if (id < 1 || id > 10) {
        throw new Error("Invalid Input -- Out of Range");
    }
    //Step 2: Create database lookup object
    const dbs = {
        db1,
        db2,
        db3
    };
    //Step 3: Ask central which databse to use
    const dbName = await central(id);
    // dbs[dbName](id)
    //Step 4: Run correct everything into one object
    const [basicInfo, personalInfo] = await Promise.all([
        dbs[dbName](id),
        vault(id)
    ]);
    //Step 5: combine everything into one object
    return {
        id,
        ...personalInfo,
        ...basicInfo
    };
}
 getUserData(5)
 
.then(data => console.log("valid User:", data))
.catch(err => console.error("Error:", err. Message));