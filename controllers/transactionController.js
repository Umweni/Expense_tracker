import Transaction from '../models/transaction.js';

//create transaction
export const createTransaction = async (req, res) => {
    try {
        const { type, amount, category, date, note} = req.body;

    if (!type || !amount ){
        return res.status(400).send({status: 'error', msg: 'Type and amount are required'})
    };

    //create new transaction
    const transaction = await Transaction.create({
        user: req.user._id,
        type,
        amount,
        category,
        date: date || Date.now(),
        note,
    });
    res.status(201).send({success: 'true', msg: 'successful created', data: transaction })

    } catch (error) {
       console.error(error);
    return res.status(500).send({ status: 'error', msg: 'Some error occurred' });
    }
};

//fetch transaction
export const getTransactions = async (req, res) => {
    try {
        const { month, year, type, category } = req.query;
         const filter = { user: req.user._id };

          if (type) filter.type = type;
         if (category) filter.category = category;

         if (month && year) {
         const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 1);
         filter.date = { $gte: start, $lt: end };
         }

         const transaction = await Transaction.find(filter).sort({ date: -1 });
        return res.status(200).send({ success: true, count: transaction.length, data: transaction });

    } catch (error) {
       console.error(error);
    return res.status(500).send({ status: 'error', msg: 'Some error occurred' });
    }
};
    
//fetch transaction summary
export const getSummary = async (req, res) => {
    try {
        const { month = new Date().getMonth() + 1, year = new Date().getFullYear() } = req.query;

        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 1);

        const summary = await Transaction.aggregate([
            { $match: { user: req.user._id, date: { $gte: start, $lt: end } } },
            { $group: { _id: "$type", total: { $sum: "$amount" } } },
            { $group: {
                _id: null,
                income: { $sum: { $cond: [{ $eq: ["$_id", "income"] }, "$total", 0] } },
                expense: { $sum: { $cond: [{ $eq: ["$_id", "expense"] }, "$total", 0] } }
            }},
            { $project: { _id: 0, income: 1, expense: 1, balance: { $subtract: ["$income", "$expense"] } } }
        ]);
        const byCategory = await Transaction.aggregate([
            { $match: { user: req.user._id, type: "expense", date: { $gte: start, $lt: end } } },
            { $group: { _id: "$category", total: { $sum: "$amount" } } },
             { $sort: { total: -1 } }
         ]);
         res.status(200).send({success: true, data: summary[0] || { income: 0, expense: 0, balance: 0 }, byCategory})

    } catch (error) {
       console.error(error);
    return res.status(500).send({ status: 'error', msg: 'Some error occurred' });
    }
};

//delete transaction
export const deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user._id});
        if(!transaction){
           return res.status(404).send({success: 'false', msg: 'Not found'});
        }
        res.status(200).send({success: 'true', msg: 'successful deleted'});
    } catch (error) {
       console.error(error);
    return res.status(500).send({ status: 'error', msg: 'Some error occurred' });
    }
};