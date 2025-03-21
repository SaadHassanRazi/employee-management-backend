import * as express from 'express'
import * as mongodb from 'mongodb'
import { collections } from './database'

export const employeeRouter = express.Router()

employeeRouter.get('/',async(req,res)=>{
    try {
        const employees = await collections.employees?.find({}).toArray();
        res.status(200).send(employees)
    } catch (error) {
        res.status(500).send(error)
        console.error('error message',error)
    }
})


employeeRouter.get('/:id',async(req,res)=>{
    try {
        const id = req.params.id;
        const query = {_id:new mongodb.ObjectId(id)};
        const employee = await collections.employees?.findOne(query)

        if(employee){
            res.status(200).send(employee);

        }else{
            res.status(404).send(`Failed to find employee:Id ${id}`)
        }
    } catch (error) {
        res.status(404).send(`Failed to find an an employee: ID ${req.params.id}`)
    }
})

employeeRouter.put('/:id', async (req, res) => {
    try {
        const id = req?.params?.id;
        const { _id, ...employeeData } = req.body; // Exclude _id from the update

        const query = { _id: new mongodb.ObjectId(id) };
        const result = await collections.employees?.updateOne(query, { $set: employeeData });

        if (result && result.matchedCount) {
            res.status(200).send(`Updated employee ID: ${id}`);
        } else if (!result?.matchedCount) {
            res.status(404).send(`Failed to find employee ID: ${id}`);
        } else {
            res.status(304).send(`Failed to update employee ID: ${id}`);
        }
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
});

employeeRouter.delete('/:id',async(req,res)=>{
    try {
        const id = req?.params?.id;
        const query = {_id:new mongodb.ObjectId(id)}
        const result = await collections.employees?.deleteOne(query)

        if(result && result.deletedCount){
            res.status(200).send(`Removed an employee ID: ${id}`)
        }else if(!result?.deletedCount){
            res.status(400).send(`Failed to remove an employee ${id}`)
        }else{
            res.status(404).send(`Failed to find an employee ${id}`)
        }
    } catch (error) {
        console.error(error)
        res.status(400).send(error)
    }
})

employeeRouter.post('/',async(req,res)=>{
    try {
        const employee = req.body
        const result = await collections.employees?.insertOne(employee)

        if(result?.acknowledged){
            res.status(201).send(`Created a new Employee: ID ${result.insertedId}`)
        }else{
            res.status(501).send('Failed to create new employee')
        }
    } catch (error) {
        console.error(error);
        res.status(400).send(error)    
     }
})