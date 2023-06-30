const Passbook = require("../model/passbook.schema");
const Withdraw = require("../model/withdraw.schema");
const Tds = require('../model/tds.schema')
const ObjectId = require('mongodb').ObjectId
const { messaging, statuscode } = require("../utils/messaging.utils");
const User = require("../model/user.schema");

async function tdsCalc(res, iUserId, nAmount){
    /*
        A>>>>>> 2189.46
        BB>>>>>> 0
        C>>>>>> 852.63
        D>>>> 0
    */

    try {
        //* findUser
        const isUser = await User.findOne({ _id: iUserId })
        console.log('-------->',isUser)

        if(!isUser){
            return res.status(200).json({message: 'User not Found'})
        }

        let currentDate = new Date()
        console.log(currentDate)
        const startDate = new Date() 
        const firstDate = new Date(currentDate.setDate(startDate.getDate() - startDate.getDate() + 1))
        const fDate = JSON.stringify(firstDate)
        const lDate = JSON.stringify(startDate)
        console.log('fDate>>>>',fDate)
        console.log('lDate>>>>',lDate)
        // fDate>>>> "2023-06-01T09:31:55.502Z"      
        // lDate>>>> "2023-06-30T09:31:55.504Z"
        // console.log('>>>>>>FFF',firstDate.toString())
        //* find A
        //* first find the PastTotalWithdraw of this month
        //! if find query is not work then use aggregation
        // 2023-06-30T04:46:41.331Z
        // 2023-06-01T04:46:41.331Z
        // const PastTotalWithdraw1 = await Withdraw.find({
        //     iUserId: iUserId,
        //     dCreatedAt: { $lte: ISODate(lDate), $gte: ISODate(fDate) }
        // })
        // console.log(PastTotalWithdraw1)
        const PastTotalWithdraw = await Withdraw.aggregate([
            {
                $match: { 
                    iUserId: isUser._id,
                    eStatus: 'S',
                    dCreatedAt: { $lte: new Date("2023-06-30T09:31:55.504Z"), $gte: new Date("2023-06-01T09:31:55.502Z") } 
                }
            },
            {
                $group: {
                    _id: null,
                    Sum: {
                        $sum: "$nAmount"
                    }
                }
            }
        ])

        console.log('STEP1>>>> ',PastTotalWithdraw)

        // if(PastTotalWithdraw.length == 0){
        //     return messaging(res, statuscode.statusSuccess, 'Past Withdraw not Found')
        // }

        // const sumOfWithdraw = PastTotalWithdraw.reduce(
        //     (accumulator, currentValue) => accumulator + currentValue.nTotalBalance,
        //     0
        // )
        const requestedWithdraw = nAmount
        console.log(nAmount,'>>>>>>>>>')

        const A = PastTotalWithdraw.length == 0 ? requestedWithdraw : PastTotalWithdraw[0].Sum + requestedWithdraw
        console.log('A>>>>>>', A)

        //* find B
        //* Total Deposit of this month
        const TotalDeposit = await Passbook.aggregate([
            {
                $match: { 
                    "iUserId": isUser._id,
                    'eStatus': 'S',
                    "eTransactionType": "Deposit",
                    "dCreatedAt": { $lte: new Date('2023-06-30T04:46:41.331Z'), $gte: new Date('2023-06-01T04:46:41.331Z') }
                }
            },
            {
                $group: {
                    _id: null,
                    Sum: {
                        $sum: "$nDepositBalance"
                    }
                }
            }
        ])
        console.log('TTT>>>>>>',TotalDeposit)
        // if(TotalDeposit.length == 0){
        //     return messaging(res, statuscode.statusSuccess, 'deposit not found')
        // }
        // const TotalDeposit = await Passbook.find({
        //     $and: [
        //         { eTransactionType: 'Deposit' },
        //         { dCreatedAt: { $gt: currentDate, $lte: firstDate }}
        //     ]
        // })
        // const sumOfDeposit = TotalDeposit.reduce(
        //     (accumulator, currentValue) => accumulator + currentValue.nTotalBalance,
        //     0
        // )
        const B = TotalDeposit.length == 0 ? 0 : TotalDeposit[0].Sum
        console.log('BB>>>>>>',B)

        //* find C
        //* Opening Balance of this month (means last month last entry of balance)
        //* find the last month last entry of the bank balance
        currentDate = new Date()
        const lastMonthDate = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDate()));
        console.log('?????Date', lastMonthDate)
        // console.log('?????Type', typeof lastMonthDate)
        // '2023-05-31T04:46:29.733Z' last date
        const openingBalance = await Passbook.findOne({ 
            $and: [
                { iUserId: isUser._id },
                { eStatus: 'S' },
                { dCreatedAt: { $lt: lastMonthDate } }
                // { dCreatedAt: { $lte: new Date('2023-05-31T04:46:29.733Z') } }
            ]
        }).sort({dCreatedAt: -1})
        console.log('?????', openingBalance)
        const C = openingBalance.nTotalBalance 
        console.log('??????C', C)

        //* find D
        //* Total Amount on which we deducted TDS in this Month
        currentDate = new Date()
        console.log('>>>>>>!!!!', currentDate)
        const totalDeductedTDS = await Passbook.find({
            $and: [
                { iUserId: isUser._id },
                { eStatus: 'S' },
                { eTransactionType: 'TDS' },
                { dCreatedAt: { $lte: currentDate, $gte: firstDate } }
            ]
        })
        console.log('DDDDDD', totalDeductedTDS)
        const sumOfTDS = totalDeductedTDS.reduce(
            (accumulator, currentValue) => accumulator + currentValue.nAmount,
            0
        );
        console.log('D>>>>', sumOfTDS)
        const D = sumOfTDS

        const taxableAmount = (A - B - C - D)
        const ans = taxableAmount * 30 / 100;
        console.log(taxableAmount,'TAX--------')
        console.log(ans,'ANS-------')

        return ans <= 0 ? {ans: 0} : { taxableAmount, ans }
    } catch (error) {
        // console.log(error)
        return messaging(res, statuscode.statusNotFound, 'TDS Calculation Error')
    }

    
}

module.exports = tdsCalc