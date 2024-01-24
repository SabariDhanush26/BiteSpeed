import {config} from 'dotenv'
config();

export const constants ={
    development : {
        username:'postgres',
        password:process.env.Password,
        database:process.env.database,
        host:process.env.host,
        dialect: 'postgres',
        port:process.env.portNumber
    },
    production:{
        PORT : process.env.PORT
    }
}
