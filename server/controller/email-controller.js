import Email from "../model/email.js";

export const saveSentEmail = (req,res) =>{
    try{
       const email = new Email(req.body);
       email.save();
       res.status(200).json('Email Saved Successfully');
    }catch(error){
        res.status(500).json(error.message);
    }
}

export const getEmails = async (req,res) =>{
    try{
        let emails;
        if(req.params.type === 'inbox'){
            emails = await Email.find({ bin: false })
        }
        else if(req.params.type === 'bin'){
            emails = await Email.find({ bin: true })
        }
        else if(req.params.type === 'allmail'){
            emails = await Email.find({});
        } else if(req.params.type === 'starred'){
            emails = await Email.find({starred:true,bin:false});
        }
        else{
            emails=await Email.find({type:req.params.type});
        }
        return res.status(200).json(emails);
    }catch(error){
        res.status(500).json(error.message);
    }
}

export const moveEmailsToBin = async (req, res) => {
    try {
        await Email.updateMany({ _id: { $in: req.body }}, { $set: { bin: true, starred: false, type: '' }});
        return res.status(200).json('Emails deleted Successfully');
    } catch (error) {
        res.status(500).json(error.message);   
    }
}

export const toggleStarredEmail = async (req, res) => {
    try {   
        await Email.updateOne({ _id: req.body.id }, { $set: { starred: req.body.value }})
        res.status(201).json('Value is updated');
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const deleteEmails = async (request, response) => {
    try {
        await Email.deleteMany({ _id: { $in: request.body }})
        response.status(200).json('emails deleted successfully');
    } catch (error) {
        response.status(500).json(error.message);
    }
}
