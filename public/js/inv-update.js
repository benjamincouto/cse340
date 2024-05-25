const form = document.querySelector('#mod-inventory-form')

form.addEventListener("change", function () {
    const updateBtn = document.querySelector("#modify-button")
    updateBtn.removeAttribute("disabled")
})