
function getFormatedTime() {
    // 25 Feb, 06:45 PM
    const now = new Date().toLocaleTimeString('en-us', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })

    const date = now.split(',')[0].split(' ')
    time = now.split(',')[1]
    // console.log(date)
    return `${date[1]} ${date[0]}, ${time}`
}

document.querySelector('#ewallet-form'), addEventListener('submit', function (e) {
    e.preventDefault()
    // console.log('form submitted')

    const type = document.querySelector('.add__type').value
    const desc = document.querySelector('.add__description').value
    const value = this.document.querySelector('.add__value').value
    // console.log(type, desc, value)

    if (desc.length > 0 && value.length > 0) {
        addItem(type, desc, value)
        resetForm()
    }
})

function showItems() {
    let items = getItemsFromLS()

    const collection = document.querySelector('.collection')

    for (let item of items) {

        const newHtml = `
    
        <div class="item">
              <div class="item-description-time">
                <div class="item-description">
                  <p>${item.desc}</p>
                </div>
                <div class="item-time">
                  <p>${item.time}</p>
                </div>
              </div>
              <div class="item-amount ${item.type === '+' ? 'income-amount' : 'expense-amount'}">
                <p>${item.type}$${seperator(item.value)}</p>
              </div>
        </div>
        `

        collection.insertAdjacentHTML('afterbegin', newHtml)
    }
}

showItems()

function addItem(type, desc, value) {

    const time = getFormatedTime()

    const newHtml = `
    
    <div class="item">
          <div class="item-description-time">
            <div class="item-description">
              <p>${desc}</p>
            </div>
            <div class="item-time">
              <p>${time}</p>
            </div>
          </div>
          <div class="item-amount ${type === '+' ? 'income-amount' : 'expense-amount'}">
            <p>${type}$${seperator(value)}</p>
          </div>
    </div>
    `
    // console.log(newHtml)

    const collection = document.querySelector('.collection')
    collection.insertAdjacentHTML('afterbegin', newHtml)

    addItemToLS(type, desc, value, time)

    showTotalIncome()
    showTotalExpense()
    showTotalBalance()
}

function resetForm() {
    document.querySelector('.add__type').value = '+'
    document.querySelector('.add__description').value = ''
    document.querySelector('.add__value').value = ''
}

function getItemsFromLS() {

    let items = localStorage.getItem('items')

    if (items) {
        items = JSON.parse(items)
    } else {
        items = []
    }

    return items
}

function addItemToLS(type, desc, value, time) {

    let items = getItemsFromLS()

    items.push({ desc, time, type, value, })

    localStorage.setItem('items', JSON.stringify(items))
}

function showTotalIncome() {

    let items = getItemsFromLS()

    let totalIncome = 0

    for (let item of items) {
        if (item.type === '+') {
            totalIncome += parseInt(item.value)
        }
    }

    // console.log(totalIncome)

    document.querySelector('.income__amount p').innerText = `$${seperator(totalIncome)}`
}

showTotalIncome()

function showTotalExpense() {

    let items = getItemsFromLS()

    let totalExpense = 0

    for (let item of items) {
        if (item.type === '-') {
            totalExpense += parseInt(item.value)
        }
    }

    // console.log(totalExpense)

    document.querySelector('.expense__amount p').innerText = `$${seperator(totalExpense)}`
}

showTotalExpense()

function showTotalBalance() {
    let items = getItemsFromLS()

    let balance = 0

    for (let item of items) {
        if (item.type === '+') {
            balance += parseInt(item.value)
        } else {
            balance -= parseInt(item.value)
        }
    }

    document.querySelector('.balance__amount p').innerText = seperator(balance)

    if (balance >= 0) {
        document.querySelector('header').className = 'green'
    } else {
        document.querySelector('header').className = 'red'
    }
}

showTotalBalance()

function seperator(amount) {
    amount = parseInt(amount)
    return amount.toLocaleString()
}

/*
    <div class="item">
          <div class="item-description-time">
            <div class="item-description">
              <p>Buy a physics book</p>
            </div>
            <div class="item-time">
              <p>25 Feb, 06:45 PM</p>
            </div>
          </div>
          <div class="item-amount expense-amount">
            <p>-$78</p>
          </div>
    </div>
*/