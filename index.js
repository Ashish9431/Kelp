
const fs =require('fs/promises');

async function getAccData(){
    const data= await fs.readFile('./AshishData.json',{
        encoding:'utf-8'
    });
    const accounts=JSON.parse(data);
    return accounts;
}

async function CreateAccData(account){
    const data = JSON.stringify(account,null,2);

    await fs.writeFile('./AshishData.json',data);
}


const createAccount = async( code, name) => {
   const  accountdata = {code, name, balance: 0 }
   let accounts= await getAccData();
   let max= 0;
   accounts.forEach(el => {
    if (max < el.id) {
        max = el.id;
    }
})

let newId = max + 1;
const newAccount = {
    ...accountdata,
    id: newId
}
accounts.push(newAccount);
await CreateAccData(accounts);
    console.log(`Account ${code} created with name ${name} and zero balance`)
}

const deposit = async( code, amount) => {
    let accounts= await getAccData();
    let index=-1;
    accounts.forEach((el,i)=>{
        if(code==el.code){
            index=i;
        }
    });
    if (index===-1) {
        console.log(`Account ${code} does not exist`)
        return
    }

    accounts[index]={
        ...accounts[index],
        balance :accounts[index].balance+amount
    }
    await CreateAccData(accounts);
    console.log(`Deposited ${amount} to account ${code}`)
}

const withdraw = async( code, amount) => {
    let accounts= await getAccData();
    let index=-1;
    let currAmount=-1;
    accounts.forEach((el,i)=>{
        if(code==el.code){
            index=i;
            currAmount=el.balance;
        }
    });
    if (index===-1) {
        console.log(`Account ${code} does not exist`)
        return
    }
    if (currAmount < amount) {
        console.log(`Insufficient balance in account ${code}`)
        return
    }
    accounts[index]={
        ...accounts[index],
        balance :accounts[index].balance-amount
    }
    await CreateAccData(accounts);
    console.log(`Withdraw ${amount} from account ${code}`)
}

const showBalance = async( code) => {
    const accounts = await getAccData();
   const account= accounts.find(el=>code === el.code);
    if (!account) {
        console.log(`Account ${code} does not exist`)
        return
    }
    console.log(`Account ${code} balance is ${account.balance}`)
}

const Arguments = process.argv[2]

switch (Arguments) {
    case 'CREATE':
        createAccount( process.argv[3], process.argv[4])
        break
    case 'DEPOSIT':
        deposit( process.argv[3], Number(process.argv[4]))
        break
    case 'WITHDRAW':
        withdraw( process.argv[3], Number(process.argv[4]))
        break
    case 'BALANCE':
        showBalance( process.argv[3])
        break   
    default:
        console.log('Invalid command')
}
