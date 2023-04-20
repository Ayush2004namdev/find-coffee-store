import {table} from "../../lib/airtable"

const getCoffeeStoreById = async (req, res) => {
    const id = req.query.id
    try{
        if(id){
            const findStore = await table.select({
                filterByFormula : `id="${id}"`
            }).firstPage()
            if(findStore.length !== 0){
                const records = findStore.map(record => {
                     return{
                         ...record.fields
                     }
                 })
                 res.json(records)
             }
             else{
                res.status(200).json({message : "Store not found"})
             }
        }
        else{
            res.status(300).json({message : "ID is missing"})
        }
    }
    catch(err){
        console.log(err)
        res.status(400).json({message : "something went wrong" , err})
    }
}

export default getCoffeeStoreById;