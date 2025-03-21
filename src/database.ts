import * as mongodb from 'mongodb'
import { Employee } from './employee'
import { error } from 'console';

export const collections:{
    employees?:mongodb.Collection<Employee>;
} = {}

export const connectToDataBase = async(url:string)=>{
    const client = new mongodb.MongoClient(url);
    await client.connect();

    const db = client.db('meanStackProject');
    await applySchemaValidation(db);

    const employeeCollection = db.collection<Employee>('employees');
    collections.employees = employeeCollection;
}


const applySchemaValidation = async(db:mongodb.Db)=>{
    const jsonSchema = {
        $jsonSchema:{
            bsonType:'object',
            required:['name','position','level'],
            additionalProperties:false,
            properties:{
                _id:{},
                name:{
                    bsonType:'string',
                    description:"'name' is required and is a string",
                },
                position:{
                    bsonType:'string',
                    description:"'position' is required and is a string",
                    minLength:5,
                },
                level:{
                    bsonType:'string',
                    description:"'level' is required and is one of 'junior', 'mid' or 'senior'",
                    enum:['junior','mid','senior']
                }
            }
        }
    }

    await db.command({
        collMod:'employees',
        validator:jsonSchema,
    }).catch(async(error:mongodb.MongoServerError)=>{
        if(error.codeName==='namespaceNotFound'){
                await db.createCollection('employees',{validator:jsonSchema})
        }
    })

}

//snVhd!3*UcEyc7Y