import {table} from "../../lib/airtable"

const upVoteStore = async(req , res) => {
    if(req.method === "PUT"){
        const {id} = req.body
        try{
            if(id){
                const findStore = await table.select({
                    filterByFormula : `id="${id}"`
                }).firstPage()

                if(findStore.length !== 0){
                    const records = findStore.map(record => {
                         return{
                            recordId : record.id,
                             ...record.fields
                         }
                     }) 

                     const calculateVoting = parseInt(records[0].rating) +1 ;
                     const updated = await table.update([
                        {
                            id: records[0].recordId,
                            fields : {
                                rating : calculateVoting
                            }
                        }
                     ])
                     
                     res.json(updated)
                 }
            } 
            else{
            res.json({message : "what the fuk"})
        }
    }
        catch(err){
            res.status(400).json({message : "something went wrong" , err})
        }
    }
}

export default upVoteStore;