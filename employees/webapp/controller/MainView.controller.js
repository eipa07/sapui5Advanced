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

            
            var oView = this.getView();
            //var i18nBundle = oView.getModel("i18n").getResourceBundle();

            var oJsonModelEmpl = new JSONModel();
            // @ts-ignore
            oJsonModelEmpl.loadData("./localService/mockdata/Employees.json", false);
            oView.setModel(oJsonModelEmpl, "jsonEmployees");

            var oJsonModelCountries = new JSONModel();
            // @ts-ignore
            oJsonModelCountries.loadData("./localService/mockdata/Countries.json", false);
            oView.setModel(oJsonModelCountries, "jsonCountries");


            var oJSONModelConfig = new sap.ui.model.json.JSONModel({
                visibleID: true,
                visibleName :true,
                visibleCountry: true,
                visibleCity: false,
                visibleBtnShowCity : true,
                visibleBtnHideCity : false
            });
            oView.setModel(oJSONModelConfig, "jsonModelConfig");

        }

        function onFilter(){
            var oJsonCountry = this.getView().getModel("jsonCountries").getData();

            var filters = [];

            if(oJsonCountry.EmployeeId !== ''){
                filters.push(new Filter("EmployeeID", FilterOperator.EQ, oJsonCountry.EmployeeId));
            }

            if(oJsonCountry.CountryKey !== ''){
                filters.push(new Filter("Country", FilterOperator.EQ, oJsonCountry.CountryKey));
            }

            var oList = this.getView().byId("tableEmployee");
            var oBinding = oList.getBinding("items");
            oBinding.filter(filters);
        }

        function onClearFilter(){
            var oModel = this.getView().getModel("jsonCountries");
            oModel.setProperty("/EmployeeId", "");
            oModel.setProperty("/CountryKey", "");
        }

        function showPostalCode(oEvent){
            var itemPresed = oEvent.getSource();
            var oContext = itemPresed.getBindingContext("jsonEmployees");
            var objectContext = oContext.getObject();

            sap.m.MessageToast.show(objectContext.PostalCode);
        }


        function onShowCity() {
            var oJSONModelConfig = this.getView().getModel("jsonModelConfig");
            oJSONModelConfig.setProperty("/visibleCity", true);
            oJSONModelConfig.setProperty("/visibleBtnShowCity", false);
            oJSONModelConfig.setProperty("/visibleBtnHideCity", true);

        }

        function onHideCity(){
            var oJSONModelConfig = this.getView().getModel("jsonModelConfig");
            oJSONModelConfig.setProperty("/visibleCity", false);
            oJSONModelConfig.setProperty("/visibleBtnShowCity", true);
            oJSONModelConfig.setProperty("/visibleBtnHideCity", false);
        };



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
        Main.prototype.showPostalCode = showPostalCode;
        Main.prototype.onShowCity = onShowCity;
        Main.prototype.onHideCity = onHideCity;
        return Main;
    });
