sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     */
    function (Controller, JSONModel, Filter, FilterOperator) {
        "use strict";

        function onInit() {

            var oJsonModel = new JSONModel();
            var oView = this.getView();
            var i18nBundle = oView.getModel("i18n").getResourceBundle();

            // var oJson = {
            //     employeeId: "123456",
            //     countryKey: "UK",
            //     listCountry: [
            //         {
            //             key: "US",
            //             text: i18nBundle.getText("countryUS")
            //         }, {
            //             key: "UK",
            //             text: i18nBundle.getText("countryUK")
            //         }, {
            //             key: "ES",
            //             text: i18nBundle.getText("countryES")
            //         }, {
            //             key: "MX",
            //             text: i18nBundle.getText("countryMX")
            //         }
            //     ]
            // };

            // oJsonModel.setData(oJson);

            oJsonModel.loadData("./localService/mockdata/Employees.json", false);
            oJsonModel.attachRequestCompleted(function(oEvent){
                console.log(JSON.stringify(oJsonModel.getData()));
            });
            oView.setModel(oJsonModel);

        }

        function onFilter(){
            var oJson = this.getView().getModel().getData();

            var filters = [];

            if(oJson.employeeId !== ''){
                filters.push(new Filter("EmployeeID", FilterOperator.EQ, oJson.employeeId));
            }

            if(oJson.countryKey !== ''){
                filters.push(new Filter("Country", FilterOperator.EQ, oJson.countryKey));
            }

            var oList = this.getView().byId("tableEmployee");
            var oBinding = oList.getBinding("items");
            oBinding.filter(filters);
        }

        function onClearFilter(){
            var oModel = this.getView().getModel();
            oModel.setProperty("/employeeId", '');
            oModel.setProperty("/countryKey", '');
        }



        var Main = Controller.extend("logaligroup.employees.controller.MainView", {});

        Main.prototype.onValidate = function () {

            var inputEmployee = this.byId("inputEmployee");
            var valueEmployee = inputEmployee.getValue();

            if (valueEmployee.length === 6) {
                //inputEmployee.setDescription("OK");
                this.getView().byId("labelCountry").setVisible(true);
                this.getView().byId("slCountry").setVisible(true);
            } else {
                //inputEmployee.setDescription("fail");
                this.getView().byId("labelCountry").setVisible(false);
                this.getView().byId("slCountry").setVisible(false);
            }

        };


        Main.prototype.onInit = onInit;
        Main.prototype.onFilter = onFilter;
        Main.prototype.onClearFilter = onClearFilter;

        return Main;
    });
