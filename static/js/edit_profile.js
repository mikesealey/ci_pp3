
$(document).ready(function (){
    document.querySelectorAll("label").forEach(function(label) {
      label.classList.add("form-label", "mt-2")
    })

    document.querySelectorAll("input").forEach(function(input) {
      input.classList.add("form-control")
    })

    document.querySelectorAll("button").forEach(function(button) {
      button.classList.add("btn", "btn-primary", "w-100", "mt-3")
    })
})