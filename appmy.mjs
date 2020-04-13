// Bedget Controller
var bedgetController = (function () {

    var Expense = function (id,description,value) {
        this.id = id;
        this.description=description;
        this.value= value;
        this.percentage = -1;

    };
    Expense.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };
    Expense.prototype.getPercentage = function () {
        return this.percentage;
        
    };
    
    var Income = function (id,description,value) {
        this.id = id;
        this.description=description;
        this.value= value;
        
    };
    var calculateTotal = function (type) {

        var sum = 0 ;
        data.allItems[type].forEach(function (cur) {
            sum += cur.value;
            
        });

        data.totals[type]= sum;
        
    };

    var data = {
        allItems:{
            exp :[],
            inc : []
        },
        totals:{
            exp:0,
            inc:0
        },budget:0,
        persentage : -1
    };

    return{
        addItem :function (type,des,val) {
            var newItem,ID;

            //create the new id
            if (data.allItems.length > 0){
            ID = data.allItems[type][data.allItems[type].length-1].id+1;

            }else{
                ID=0;
            }
            

            //create a new item base on inc & exp
            if(type === 'exp'){
            newItem = new Expense(ID, des, val);
            }else if (type === 'inc'){
            newItem = new Income(ID,des,val);
             }
             // push into data struture 
             data.allItems[type].push(newItem);
             
             // return new elment
             return newItem;

        }, 

        deleteItem:function (type,id) {
            var ids,index;



            ids =  data.allItems[type].map(function (current) {
               return current.id;
               
           });

           index = ids.indexOf(id);

           if (index !== -1) {
            data.allItems[type].splice(index, 1);
            }
            
        },

        calculateBudget:function () {

            // calcul the total income and expencese 
            calculateTotal('exp');
            calculateTotal('inc');

            // calculate the budget:income - expenses

            data.budget = data.totals.inc - data.totals.exp;

            // calculate persentage of the spent income
            if (data.totals.inc > 0){

            data.persentage = Math.round(data.totals.exp / data.totals.inc)*100;

            }
            else{
                data.persentage = -1;
            }
            
        },

        calculatePercentages:function () {

            data.allItems.exp.forEach(function (cur) {
                cur.calcPercentage(data.totals.inc);
            });
        },
        getPercentages:function name(params) {
            var allperc = data.allItems.exp.forEach(function (cur) {
                return cur.getPercentage();

            });
            return allperc;
            
        
        },
        getBudget:function () {
            return{
                budget:data.budget,
                totalInc:data.totals.inc,
                totalExp:data.totals.exp,
                persentage:data.totals.persentage
            }
            
        },

        testing:function () {
            console.log(data);
            
        }
    };


})();


// UI Controller
var UIController = (function () {

    var DOMStrings ={
        inputType : '.add__type',
        inputDescription:'.add__description',
        inputvalue:'.add__value',
        inputBtn:'.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel:'.budget__value',
        incomeLabel:'.budget__income--value',
        expenceseLabel:'.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container:'.container',
        expensesPerLabel:'.item__percentage',
        dateLabel:'.budget__title--month'


    };

    var formatNumber=function (num,type) {
        /*
        + or - before number
        exactly 2 decimal points
        comma separating the thousands
        2310.4567 -> + 2,310.46
        2000 -> + 2,000.00
        */
       num = Math.abs(num);
       num = num.toFixed(2);

       numSplit = num.split('.');

       int = numSplit[0];
       if (int.length > 3){
           int = int.substr(0,int.length -3) + ' ' + int.substr(int.length-3,3);
       }

       dec = numSplit[1];

       return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;

        
    };

    var nodeListForEach = function (list,callback) {
        for(var i =0;i< list.length;i++)
        {
            callback(list[i], i);

        }
        
    };

    return{
        getInput:function () {

           return{
            type : document.querySelector(DOMStrings.inputType).value,
            description : document.querySelector(DOMStrings.inputDescription).value,
            value :parseFloat(document.querySelector(DOMStrings.inputvalue).value)
           };
        },

        addListItem:function (obj,type) {
            var html,newHtml,element;

            // create HTML string with placeHolder

            if (type === 'inc'){
                element = DOMStrings.incomeContainer;
                //element = DOMstrings.incomeContainer;
            
            html ='<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }else if (type === 'exp'){
                element = DOMStrings.expensesContainer;
               // element = DOMstrings.expensesContainer;
            
            html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            //replace the place holder in the text some actile data

            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value,type));

            //Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
        },
        deleteListItem:function (selectorID) {

            var el = document.getElementById(selectorID);

            el.parentNode.removeChild(el);
            
        },

        clearFields:function () {

            var fields,fieldsArr;

           fields =  document.querySelectorAll(DOMStrings.inputDescription + ' ,' + DOMStrings.inputvalue);
            
            fieldsArr = Array.prototype.slice.call(fields);

            fields.forEach(function (current,index,array) {
                current.value = "";

                
            });
            fieldsArr[0].focus();

        },

        displayBudget: function (obj) {
            var type;
            obj.budget > 0 ? type ='inc' : type = 'exp'

            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget,type);
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc,'inc');
            document.querySelector(DOMStrings.expenceseLabel).textContent = formatNumber(obj.totalExp,'exp');
            
            if(obj.persentage > 0){
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.persentage + '%';

            }else{
                document.querySelector(DOMStrings.percentageLabel).textContent = '---';
            }
        },
        displayPercentages:function () {
            var fields = document.querySelectorAll(DOMStrings.expensesPerLable);

            nodeListForEach (fields, function(current, index) {

                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
                
            });

        },

        displayMonth : function () {
            var now, months, month, year;
            
            now = new Date();
            //var christmas = new Date(2016, 11, 25);
            
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth();
            
            year = now.getFullYear();
            document.querySelector(DOMStrings.dateLabel).textContent = months[month] + ' ' + year;
            
        },

        changedType: function () {

            var fields = document.querySelectorAll(

            DOMStrings.inputType + ',' +
            DOMStrings.inputDescription + ',' +
            DOMStrings.inputValue);
        
        nodeListForEach(fields, function(cur) {
           cur.classList.toggle('red-focus'); 
        });
        
        document.querySelector(DOMStrings.inputBtn).classList.toggle('red');
            
        },


        getDOMStrings : function () {
            return DOMStrings;
        }
    };


    
})();
// controller
var controller=(function (budgetCtrl,UICtrl) {

    var setUpEventListener = function () {
        var DOM = UICtrl.getDOMStrings();
        
        
        document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);


        document.addEventListener('keypress',function (event) {
            
            if (event.keyCode === 13|| event.which === 13){

                ctrlAddItem();


            }
            
        });

        document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change',UICtrl.changedType);

    };

    
    var updateBudget = function () {

        // add the calculate the bedget
        budgetCtrl.calculateBudget();


        // retun the budget

        var budget = budgetCtrl.getBudget();

    // display the bedget to the UI

    UICtrl.displayBudget(budget);
        
    };
    var updatePercentages = function () {

        // calbul the percentage 
        budgetCtrl.calculatePercentages();

        //read the percentage from budget controller
        var percentages = budgetCtrl.getPercentages();

        //update the UI with the new percentage 

        UICtrl.displayPercentages(percentages);
        
    };

    var ctrlAddItem = function(){
        var input,newItem;
    


    // get the input data feild

        var input = UICtrl.getInput();
        
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {

        //add the item to the budgetController 

        var newItem = budgetCtrl.addItem(input.type,input.description,input.value);

        //add the item to the UI
        UICtrl.addListItem(newItem,input.type);

        // clear over fields
        UICtrl.clearFields();

        // calcul and update budeget
        updateBudget();

        // calculate and update percentage 
        updatePercentages();

    
        }

     
    };
    var ctrlDeleteItem = function (event) 
    {
        var itemID,splitID,type,ID;


        itemID=event.target.parentNode.parentNode.parentNode.id;
        //inc-1
        splitID = itemID.split('-');
        type = splitID[0];
        ID = parseInt(splitID[1]);

        // 1. delete the item from the data structure
        budgetCtrl.deleteItem(type,ID);
            
        // 2. Delete the item from the UI
        UICtrl.deleteListItem(itemID);
        
        // 3. Update and show the new budget
        updateBudget();
        
        // 4. Calculate and update percentages
        updatePercentages();
           
       };



    return{
        init:function () {
            console.log('Application has been started ');
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget:0,
                totalInc:0,
                totalExp:0,
                persentage:-1
            });
            setUpEventListener();
        }
    };


        
   


})(bedgetController,UIController);

controller.init();
