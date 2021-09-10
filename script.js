'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};


const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [];

/////////////////////////////////////////////////


const updateUi = function(acc){
  displayMovements(acc);
    displayBalanceValue(acc);
    displaySumInBalanceValue(acc);
}

// const arr = ['a', 'b', 'c'];

// console.log(arr.slice(2));
// console.log(arr.splice(1));
// console.log(arr);

// movements.forEach(function(movement,index){
//   if(movement > 0){
//     console.log(`Movement ${index +1} Your Deposite ${movement}`);
//   }else{
//     console.log(`Movement ${index +1} Your withDraw ${movement}`);
//   }
// })

// currencies.forEach(function(value, key,map){
//   console.log(`${key}: ${value}`)
// })

const startLogoutTimer = function(){

  let time = 100;

  const tick = function(){
    const min = String(Math.trunc(time / 60)).padStart(2,0);
    const sec = String(time % 60).padStart(2,0);
    labelTimer.textContent = `${min}: ${sec}`;
    time--;

    if(time === 0){
      clearInterval(timer);
      labelWelcome.textContent = ` Login in to get Start`;
      containerApp.style.opacity = 0;
    }
  }
  tick();
  const timer = setInterval(tick,1000)
}



const displayMovements = function (acc, sort = false) {


  const movs = sort ? acc.movements.slice().sort((a,b) => a-b): acc.movements;
  containerMovements.innerHTML = '';
  movs.forEach(function (mov, i) {

    const date = new Date(acc.movementsDates[i]);
    const year = date.getFullYear();
    const hour = date.getHours();
    const month = `${date.getMonth()}`.padStart(2,0);
    const day = `${date.getDay()}`.padStart(2,0);
    const min = date.getMinutes();

    const dispalyDate = ` ${day}/${month}/${year}`;


    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html =  `<div class="movements__row">
                    <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
                    <div class="movements__date">${dispalyDate}</div>
                    <div class="movements__value">${mov.toFixed(2)}</div>
                  </div>`;

    containerMovements.insertAdjacentHTML('afterbegin',html)
                  
    });
}


// displayMovements(account1.movements);

const eruoTousd = 1.1;

const movementusd = account1.movements.map(mov => mov*eruoTousd);

// console.log(movementusd);
// console.log(movements);

const createUsername = function (accunts) {
  accunts.forEach(function(account){
    account.username = account.owner
    .toLowerCase().split(' ').map(name => name[0]).join('');
  }) 
}


// const name = 'jhons ahmed';

// const nameChange = name.toLowerCase().split('');
createUsername(accounts);
// console.log(accounts);

// const deposit = movements.filter(mov => mov > 0);

// console.log(deposit);

// const withDrawls = movements.filter(mov => mov < 0);

// console.log(withDrawls);

const displayBalanceValue = function(acc){
  acc.balance = acc.movements.reduce((acc,cur,i) => acc + cur,0);
  // acc.balance = balance;
  labelBalance.textContent = `${acc.balance}€`;
}

// displayBalanceValue(account1.movements);

const displaySumInBalanceValue = function(acc){
  const income = acc.movements.filter(mov => mov > 0  ).reduce((acc,mov)=>acc+mov,0); 
  labelSumIn.textContent = `${income.toFixed(2)}€`;

  const out = acc.movements.filter(mov => mov < 0  ).reduce((acc,mov)=>acc+mov,0); 
  labelSumOut.textContent = `${Math.abs(out).toFixed(2)}€`;

  const interest = acc.movements.filter(mov => mov > 0).map(deposit => (deposit*acc.interestRate) /100 ).filter((int,i) =>{
    return int >=1;
  }).
  reduce((acc,int)=> acc+int,0)
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
}

// displaySumInBalanceValue(account1.movements);
let currentAccount;





btnLogin.addEventListener('click',function(e){
  e.preventDefault();


 
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);

  if(currentAccount?.pin === Number(inputLoginPin.value)){
    labelWelcome.textContent = `Welcome back ${currentAccount.owner.split(' ')[0]}`;

    containerApp.style.opacity = 100;

    const now = new Date();
    const year = now.getFullYear();
    const hour = now.getHours();
    const month = `${now.getMonth()}`.padStart(2,0);
    const day = `${now.getDay()}`.padStart(2,0);
    const min = now.getMinutes();
    
    labelDate.textContent =` ${day}/${month}/${year}, ${hour}:${min}`;

    inputLoginUsername.value = inputLoginPin.value = '';
    startLogoutTimer();
    updateUi(currentAccount);
  }
 
})


btnTransfer.addEventListener('click', function(e){
  e.preventDefault();


  const amount =  Number(inputTransferAmount.value);
  const recive = accounts.find(acc =>acc.username === inputTransferTo.value) ;

  inputTransferAmount.value = inputTransferTo.value = '';


  if(amount > 0 && currentAccount.balance >= amount && recive?.username !==  currentAccount.username){

    currentAccount.movements.push(-amount);
    recive.movements.push(amount);

    currentAccount.movementsDates.push(new Date().toISOString());
    recive.movementsDates.push(new Date().toISOString());
    timer = startLogoutTimer();
    clearInterval(timer);
    updateUi(currentAccount);
    console.log("transfer Valid");
  }
 
})

btnClose.addEventListener('click', function(e){
  e.preventDefault();
if(inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin){

const index = accounts.findIndex(acc => acc.username == currentAccount.username)

 
  // containerApp.style.opacity = 100;
  console.log(index);
  accounts.splice(index, 1);
  containerApp.style.opacity = 0;
  labelWelcome.textContent = `Account Has been Delete `;

}else{
  labelWelcome.textContent = `UserName Or Password Not Match `;
}

})


btnLoan.addEventListener('click',function(e){
  e.preventDefault();
  const amount = Number(inputLoanAmount.value)
  

 
  inputLoanAmount.value  = '';
  if(amount > 0 && currentAccount.movements.some(mov => mov >= amount *0.1)){
    currentAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    updateUi(currentAccount);

    
  }else{
    labelWelcome.textContent = `You can't loan `;
  }
})
let sorted = false;
btnSort.addEventListener('click', function(e){
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
})


// const x = Array.from({length:7 },(_,i) => i + 1);

// console.log(x);














