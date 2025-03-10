require('dotenv').config(); 
const mysql=require('mysql2');
const mysqlconnect=mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
})
mysqlconnect.connect((error)=>{
    if(error){
        console.log('Error in connection',error);
        return;
    }
    console.log('Database connected ')
})
module.exports=mysqlconnect;
