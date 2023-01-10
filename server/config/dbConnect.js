const  mongoose = require("mongoose")


const dbConnect=()=>{
    try {
        const con=mongoose.connect(`mongodb://127.0.0.1:27017/unoecom2`)
        console.log(`DB CONNECTED `);
        } catch (error) {
        console.log(error);
    }
}

module.exports=dbConnect;