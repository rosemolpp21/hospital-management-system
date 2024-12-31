const mysql=require('mysql2');
const mysqlconnect=mysql.createConnection({
    host:'127.0.0.1',
    user:'root',
    password:'123456789',
    database:'healthcare_system'
})
mysqlconnect.connect((error)=>{
    if(error){
        console.log('error in connection',error);
        return;
    }
    console.log('database connected ')
})
module.exports=mysqlconnect;
