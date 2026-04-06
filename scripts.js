const form = document.querySelector("form")
const amount = document.querySelector("#amount")
const expense = document.querySelector("#expense")
const category = document.querySelector("#category")
const ul = document.querySelector("ul")
const myRequests = document.querySelector("aside > header > p > span")
const totalExpense = document.querySelector("aside > header > h2")

//Captura o evento input para negar digitação de letras e formatar o valor
amount.oninput = ()=>{
  //Remove caracteres não numéricos
  let value = Number(amount.value.replace(/\D/g, ""))/100

  //Atualiza o input
  amount.value = formatCurrency(value)
}

function formatCurrency(value){
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  })

  return value;
}

form.onsubmit = (event) =>{
  event.preventDefault()

  const newExpense ={
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date()
  }
  console.log(newExpense)
  expenseAdd(newExpense)
}

function expenseAdd(newExpense){
  try {
    const li = document.createElement("li")
    li.classList.add("expense")

    const expenseIcon = document.createElement("img")
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
    expenseIcon.setAttribute("alt", newExpense.category_name)

    const div = document.createElement("div")
    div.classList.add("expense-info")

    const expense = document.createElement("strong")
    expense.textContent = newExpense.expense

    const category_name = document.createElement("span")
    category_name.textContent = newExpense.category_name

    div.append(expense)
    div.append(category_name)

    const span = document.createElement("span")
    span.classList.add("expense-amount")

    const small = document.createElement("small")
    small.textContent = "R$"

    span.append(small)
    span.append(newExpense.amount.toUpperCase().replace("R$", ""))

    const img = document.createElement("img")
    img.setAttribute("src", "img/remove.svg")
    img.setAttribute("alt", "remover")
    img.classList.add("remove-icon")

    li.append(expenseIcon)
    li.append(div)
    li.append(span)
    li.append(img)
    ul.append(li)

    formClear()
    updateTotals()
  } catch (error) {
    alert("Não foi possível atualizar a lista de despesas.")
    console.log(error)
  }
}

function updateTotals(){
  try {
    const itens = ul.children
    const item = ul.children.length
    myRequests.textContent = item == 1 ? `${item} despesa` : `${item} despesas`

    let total = 0

    for(let i = 0; i < item; i++){
      const itemAmount = itens[i].querySelector(".expense-amount")

      let value = parseFloat(itemAmount.textContent.replace(/[^\d]/g, "").replace(",", "."))

      if(isNaN(value)){
        return alert("Não foi possível calcular o total.")
      }

      total += value/100
    }

    totalExpense.innerHTML = `<small>R$</small>${formatCurrency(total).toUpperCase().replace("R$", "")}`
  } catch (error) {
    console.log(error)
    alert("Não foi possível atualziar os totais.")
  }
}

ul.addEventListener("click", function(event){
  if(event.target.classList.contains("remove-icon")){
    const item = event.target.closest(".expense")
    item.remove()

    updateTotals()
  }
})

function formClear(){
  expense.value = ""
  category.value = ""
  amount.value = ""

  expense.focus()
}