import Transaction from '../models/transaction.js';

//create transaction
export const createTransaction = async (req, res) => {
    try {
        const { type, amount, category, date, note} = req.body;

    if (!type || !amount || !category || !date || !note){
        res.status(400).send({status: 'error', msg: 'required field must be filled'})
    };

    //create new transaction
    const transaction = await Transaction.create({
        user: req.user._id,
        type,
        amount,
        category,
        date,
        note,
    });
    res.status(201).send({success: 'ok', msg: 'successful created', data: transaction })

    } catch (error) {
        console.error('some error occurred')
    }
};

//fetch transaction