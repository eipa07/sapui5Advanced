sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function(Controller, JSONModel){

    return Controller.extend("logaligroup.employees.controller.Main", {

        onInit: function(){
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

            var oJsonModelLayout = new JSONModel();
            // @ts-ignore
            oJsonModelLayout.loadData("./localService/mockdata/Layout.json", false);
            oView.setModel(oJsonModelLayout, "jsonLayout");


            var oJSONModelConfig = new sap.ui.model.json.JSONModel({
                visibleID: true,
                visibleName :true,
                visibleCountry: true,
                visibleCity: false,
                visibleBtnShowCity : true,
                visibleBtnHideCity : false
            });
            oView.setModel(oJSONModelConfig, "jsonModelConfig");

            this._bus = sap.ui.getCore().getEventBus();
            this._bus.subscribe("flexible", "showEmployee", this.showEmployeeDetails, this);
        },

        showEmployeeDetails: function(category, nameEvent, path) {
            var detailView = this.getView().byId("detailEmployeeView");
            detailView.bindElement("jsonEmployees>" + path);
            this.getView().getModel("jsonLayout").setProperty("/ActiveKey", "TwoColumnsMidExpanded");

            var incidenceModel = new sap.ui.model.json.JSONModel([]);
            detailView.setModel(incidenceModel, 'incidenceModel');
            detailView.byId('tableIncidence').removeAllContent();

        }

        

    });

});