function createFoodItem() {
    // Get a reference to the accordion
    let carbcalcAccordion = document.getElementById("carbcalc");
    const newItemId = carbcalcAccordion.children.length + 1;
    const newItemElemId = "carbitem" + newItemId;

    // Create a new accordion element
    const item = document.createElement("div");
    item.className = "accordion-item";

    // Create the header
    const header = document.createElement("h2");
    header.className = "accordion-header";
    header.id = "heading" + newItemId;
    item.appendChild(header);

    // Accordion button
    const headerButton = document.createElement("button");
    headerButton.className = "accordion-button";
    headerButton.setAttribute("type", "button");
    headerButton.setAttribute("data-bs-toggle", "collapse");
    headerButton.setAttribute("data-bs-target", "#collapse" + newItemId);
    headerButton.textContent = "Item " + newItemId;
    header.appendChild(headerButton);

    // Accordion contents
    const itemContent = document.createElement("div");
    itemContent.className = "accordion-collapse collapse show";
    itemContent.id = "collapse" + newItemId;
    // Accordion body
    const itemBody = document.createElement("div");
    itemBody.className = "accordion-body";

    itemContent.appendChild(itemBody);
    item.appendChild(itemContent);

    // Add form elements to the body
    const itemLabelElem = createInputElement("Item", "Label", ("label" + newItemElemId), controlType = "text");
    const pkgServingElem = createInputElement("Pkg serving", "0.75", ("pkgserving" + newItemElemId), controlType = "number");
    const pkgCarbsElem = createInputElement("Pkg carbs", "23", ("pkgcarbs" + newItemElemId), controlType = "number", suffix = "g");
    const pkgFibreElem = createInputElement("Pkg fibre", "2", ("pkgfibre" + newItemElemId), controlType = "number", suffix = "g");
    const persServingElem = createInputElement("Your serving", "1.5", ("persserving" + newItemElemId), controlType = "number");
    itemBody.appendChild(itemLabelElem);
    itemBody.appendChild(pkgServingElem);
    itemBody.appendChild(pkgCarbsElem);
    itemBody.appendChild(pkgFibreElem);
    itemBody.appendChild(persServingElem);

    const calcButton = createButton("Calculate item", ("btn" + newItemElemId));
    itemBody.appendChild(calcButton);
    calcButton.addEventListener('click', function() {
        headerButton.textContent = itemLabelElem.getElementsByTagName("input")[0].value;

        let carbs = pkgCarbsElem.getElementsByTagName("input")[0].valueAsNumber;
        console.log("carbs: " + carbs);
        let fibre = pkgFibreElem.getElementsByTagName("input")[0].valueAsNumber;
        console.log("fibre: " + fibre);
        let servingSize = pkgServingElem.getElementsByTagName("input")[0].valueAsNumber;
        console.log("serving: " + servingSize);
        let portionSize = persServingElem.getElementsByTagName("input")[0].valueAsNumber;
        console.log("portion: " + portionSize);

        let totalCarbs = (((carbs - fibre) / servingSize) * portionSize);
        console.log("total: " + totalCarbs);

        // Item carbs total grams
        const headerBadge = document.createElement("span");
        headerBadge.className = "badge bg-secondary mx-3";
        headerBadge.textContent = totalCarbs.toString() + " g";
        headerButton.appendChild(headerBadge);
    });

    // Add the item to the page
    carbcalcAccordion.appendChild(item);
}

function createInputElement(labelString, placeholderText, idValue, controlType = "number", suffix = "") {
    // Container div
    const inputContainer = document.createElement("div");
    inputContainer.className = "row mb-3";

    // label
    const inputLabel = document.createElement("label");
    inputLabel.className = "form-label col-form-label col-sm-6";
    inputLabel.setAttribute("for", idValue);
    inputLabel.textContent = labelString;

    // input div wrapper
    const inputDiv = document.createElement("div");
    inputDiv.className = "col-sm-6";
    // input group for suffix
    const inputGroup = document.createElement("div");
    inputGroup.className = "input-group";
    const inputGroupSuffix = document.createElement("span");
    inputGroupSuffix.className = "input-group-text";
    inputGroupSuffix.textContent = suffix;
    // input
    const inputControl = document.createElement("input");
    inputControl.type = controlType;
    inputControl.className = "form-control";
    inputControl.id = idValue;
    inputControl.placeholder = placeholderText;

    inputContainer.appendChild(inputLabel);
    if (suffix == "") {
        inputDiv.appendChild(inputControl);
    } else {
        inputGroup.appendChild(inputControl);
        inputGroup.appendChild(inputGroupSuffix);
        inputDiv.appendChild(inputGroup);
    }
    inputContainer.appendChild(inputDiv);

    return inputContainer;
}

function createButton(labelString, idValue) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = labelString;
    button.className = "btn btn-primary";
    button.id = idValue;

    return button;
}

function calculateTotalCarbs() {
    let totalCarbs = 0;
    const itemList = Array.from(document.getElementById("carbcalc").children);

    itemList.forEach(element => {
        let grams = element.getElementsByTagName("span")[0].textContent.split(' ')[0];
        console.log("Item grams: %s", grams);
        totalCarbs = totalCarbs + Number(grams);
    });
    console.log("Total carbs: %s", totalCarbs);

    const totalCarbElem = document.getElementById("mealcarbtotal");
    totalCarbElem.textContent = totalCarbs;
}


function calculateDosageRatio() {
    const totalCarbElem = document.getElementById("mealcarbtotal");
    let totalCarbs = Number(totalCarbElem.textContent);
    console.log("Total carbs: %d", totalCarbs)

    const ratioValueElem = document.getElementById("mealselector");
    let ratioValue = Number(ratioValueElem.options[ratioValueElem.options.selectedIndex].value)
    console.log("Ratio value: %d", ratioValue)

    // Protect against div by 0 errors
    let ratioedCarbs = 0;
    if (ratioValue > 0) {
        ratioedCarbs = totalCarbs / ratioValue;
    }
    console.log("Final carb value: %s", ratioedCarbs);

    const scaledCarbsElem = document.getElementById("dosagetotal");
    scaledCarbsElem.textContent = ratioedCarbs;
}


function loadMealSelection() {
    let meals = JSON.parse(localStorage.getItem('meals'));
    // Exit if there is nothing to do
    if (meals == null) { return; }

    // Load the list of meals from previously saved meals
    const mealSelectionElem = document.getElementById('mealselector');
    mealSelectionElem.remove(0);

    meals.forEach(meal => {
        let mealOption = document.createElement("option");
        mealOption.text = meal.name + " (1:" + meal.ratio + ")";
        mealOption.value = meal.ratio;
        mealSelectionElem.add(mealOption);
    });

}


function saveNewMeal() {
    let meals = JSON.parse(localStorage.getItem('meals'));

    if (meals == null) {
        meals = [];
    }

    let meal = {
        "name": document.getElementById("mealname").value,
        "ratio": document.getElementById("mealratio").valueAsNumber
    };

    console.log("Saving meal: %s", JSON.stringify(meal));
    meals.push(meal);

    // Save the meals for future sessions
    localStorage.setItem('meals', JSON.stringify(meals));

    // Reload the selection menu
    loadMealSelection();
}


// Add event listeners to buttons.
let newFoodItemButton = document.getElementById('addfooditem');
newFoodItemButton.addEventListener('click', createFoodItem);

let calcTotalCarbsButton = document.getElementById('calccarbtotal');
calcTotalCarbsButton.addEventListener('click', calculateTotalCarbs);

let calcCarbRatioButton = document.getElementById('calcdosageratio');
calcCarbRatioButton.addEventListener('click', calculateDosageRatio);

let mealSaveButton = document.getElementById('savemealbutton');
mealSaveButton.addEventListener('click', saveNewMeal);
window.addEventListener('load', loadMealSelection);