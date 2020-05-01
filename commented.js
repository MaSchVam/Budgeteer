

//////////////////////////////
// BUDGET CONTROLLER

var budgetController = (function() {

    //Expense and income function constructors

    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    //Expense and income storage object

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };

    //Return method to the global scope, so that the "controller" function can add new items in data object above.
    
    return {
        addItem: function(type, des, val) {
            var newItem, ID;

            //ID = last ID + 1
            //Create new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            //Create new item, based on 'inc' or 'exp' type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            //Push it into our data structure
            data.allItems[type].push(newItem);

            //Return the item
            return newItem;
        },

        testing: function() {
            console.log(data);

        }

    };


})();



//////////////////////////////
// UI CONTROLLER

var UIController = (function() {

    //Object with all the CSS classes of needed elements in the DOM

    var DOMstrings = {

        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
    }

    //Return this method to the global scope, so the "controller" function can read the value from the input fields

    return {
        getInput: function() {
            return {

                type: document.querySelector(DOMstrings.inputType).value, // Will be either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            };
        },

        //Method to push new HTML list items into the DOM

        addListItem: function(obj, type) {

            var html, newHtml;
            
            //Create HTML string with %PLACEHOLDER% text

            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
            //Replace %PLACEHOLDER% text with actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            //Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },

        //Return the DOMstrings inside this method to make the selectors available in the global scope

        getDOMstrings: function() {
            return DOMstrings;
        }

    };

})();



//////////////////////////////
// GLOBAL APP CONTROLLER

var controller = (function(budgetCtrl, UIctrl) {

    //Importing the DOMstrings and setting up event listeners

    var setupEventListeners = function() {

        var DOM = UIController.getDOMstrings();

        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event) {

            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }

        });

    };

    //Function to be executed when the submit button (or enter key is) is pressed. This function executes all the logic in this app, by interacting with the other controllers.

    var ctrlAddItem = function() {

        var input, newItem;

        // 1. Get the field input data from the "UIController" function.
        input = UIController.getInput();

        // 2. Add item to budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        // 3. Add new item to user interface
        UIctrl.addListItem(newItem, input.type);

        // 4. Calculate the budget

        // 5. Display the budget on the UI

    }

    //Return the initialization method for this function.

    return {

        init: function() {
            console.log('Application has started.');
            setupEventListeners();
        }
    };


})(budgetController, UIController);

//Application is initialized with the returned method in the "controller" function.

controller.init();