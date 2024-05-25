const form = document.querySelector('#mod-inventory-form')

form.addEventListener("change", function () {
    const updateBtn = document.querySelector("#inventory-button")
    updateBtn.removeAttribute("disabled")
})