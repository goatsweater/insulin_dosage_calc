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
    const itemLabelElem = createInputElement("Item Label", "Label", ("label" + newItemElemId), "text");
    const pkgServingElem = createInputElement("Package Serving Size", "0.75", ("pkgserving" + newItemElemId), "number");
    const pkgCarbsElem = createInputElement("Package Carbohydrates", "23", ("pkgcarbs" + newItemElemId), "number");
    const pkgFibreElem = createInputElement("Package Fibre", "2", ("pkgfibre" + newItemElemId), "number");
    const persServingElem = createInputElement("Your serving size", "1.5", ("persserving" + newItemElemId), "number");
    itemBody.appendChild(itemLabelElem);
    itemBody.appendChild(pkgServingElem);
    itemBody.appendChild(pkgCarbsElem);
    itemBody.appendChild(pkgFibreElem);
    itemBody.appendChild(persServingElem);

    const calcButton = createButton("Calculate", ("btn" + newItemElemId));
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
        headerBadge.className = "badge bg-secondary";
        headerBadge.textContent = totalCarbs.toString() + " g";
        headerButton.appendChild(headerBadge);
    });

    // Add the item to the page
    carbcalcAccordion.appendChild(item);
}

function createInputElement(labelString, placeholderText, idValue, controlType = "number") {
    // Container div
    const inputContainer = document.createElement("div");
    inputContainer.className = "mb-3";

    // label
    const inputLabel = document.createElement("label");
    inputLabel.className = "form-label";
    inputLabel.setAttribute("for", idValue);
    inputLabel.textContent = labelString;

    // input
    const inputControl = document.createElement("input");
    inputControl.type = controlType;
    inputControl.className = "form-control";
    inputControl.id = idValue;
    inputControl.placeholder = placeholderText;

    inputContainer.appendChild(inputLabel);
    inputContainer.appendChild(inputControl);

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

    const ratioValueElem = document.getElementById("ratiovalue");
    let ratioValue = ratioValueElem.valueAsNumber;
    console.log("Ration value: %d", ratioValue)

    let ratioedCarbs = totalCarbs / ratioValue;
    console.log("Final carb value: %s", ratioedCarbs);

    const scaledCarbsElem = document.getElementById("dosagetotal");
    scaledCarbsElem.textContent = ratioedCarbs;
}


// Add event listeners to buttons.
let newFoodItemButton = document.getElementById('addfooditem');
newFoodItemButton.addEventListener('click', createFoodItem);

let calcTotalCarbsButton = document.getElementById('calccarbtotal');
calcTotalCarbsButton.addEventListener('click', calculateTotalCarbs);

let calcCarbRatioButton = document.getElementById('calcdosageratio');
calcCarbRatioButton.addEventListener('click', calculateDosageRatio);