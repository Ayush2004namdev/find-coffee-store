import {table} from "../../lib/airtable"



const CreateCoffeeStore = async (req, res) => {
    const {id , name , location , imageUrl, rating} = req.body
    if(req.method === 'POST' ){  
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
        if(name){
       const response = await table.create([
            {
                fields: {
                    id,
                    name ,
                    location,
                    rating,
                    imageUrl,
                }
            }
        ])
        const createRecord = response.map(record => {
            return{
                ...record.fields
            }
        })
        res.json({message:"create store" ,  createRecord})
    }
    else{
        res.json({message:"name is missing"})
    }
}

}else{
    res.json({message:"Id is missing"})
}

    }catch(err){
        console.log(err)
        res.json({message:"Something went wrong"})
    }
}
}

export default CreateCoffeeStore;