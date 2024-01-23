import {config} from 'dotenv'
config();

export const constants ={
    development : {
        username:'postgres',
        password:process.env.Password,
        database:process.env.database,
        host:process.env.host,
        dialect: process.env.dialect,
        PORT : process.env.PORT,
        portNumber:process.env.portNumber

    },
    production:{

    }
}
