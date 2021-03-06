// @ts-nocheck
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
], function (Controller, JSONModel, MessageBox) {

    return Controller.extend("logaligroup.employees.controller.Main", {

        onBeforeRendering: function () {
            this._detailEmployeeView = this.getView().byId('detailEmployeeView');
        },

        onInit: function () {
            var oView = this.getView();
            console.log(oView.getModel("odataNorthwind"));
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
                visibleName: true,
                visibleCountry: true,
                visibleCity: false,
                visibleBtnShowCity: true,
                visibleBtnHideCity: false
            });
            oView.setModel(oJSONModelConfig, "jsonModelConfig");

            this._bus = sap.ui.getCore().getEventBus();
            this._bus.subscribe("flexible", "showEmployee", this.showEmployeeDetails, this);
            this._bus.subscribe("incidence", "onSaveIncidence", this.onSaveODataIncidence, this);


            this._bus.subscribe("incidence", "onDeleteIncidence", function(channelId, eventId, data) {
                
                 var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

                 this.getView().getModel("incidenceModel").remove("/IncidentsSet(IncidenceId='" + data.IncidenceId +
                    "',SapId='" + data.SapId +
                    "',EmployeeId='" + data.EmployeeId + "')", {
                    success: function () {
                        this.onReadODataIncidence.bind(this)(data.EmployeeId);
                        sap.m.MessageToast.show(oResourceBundle.getText("odataDeleteOK"));
                    }.bind(this),
                    error: function (e) {
                        sap.m.MessageToast.show(oResourceBundle.getText("odataDeleteKO"));
                    }.bind(this)
                });

            }, this);
        },

        showEmployeeDetails: function (category, nameEvent, path) {
            var detailView = this.getView().byId("detailEmployeeView");
            detailView.bindElement("odataNorthwind>" + path);
            this.getView().getModel("jsonLayout").setProperty("/ActiveKey", "TwoColumnsMidExpanded");

            var incidenceModel = new sap.ui.model.json.JSONModel([]);
            detailView.setModel(incidenceModel, 'incidenceModel');
            detailView.byId('tableIncidence').removeAllContent();

            // Mostrar las incidencias que ya existen
            this.onReadODataIncidence(this._detailEmployeeView.getBindingContext("odataNorthwind").getObject().EmployeeID);

        },

        onSaveODataIncidence: function (channelId, eventId, data) {

            var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
            var employeeId = this._detailEmployeeView.getBindingContext("odataNorthwind").getObject().EmployeeID;
            var incidenceModel = this._detailEmployeeView.getModel("incidenceModel").getData();

            if (typeof incidenceModel[data.incidenceRow].IncidenceId == 'undefined') {
                var body = {
                    SapId: this.getOwnerComponent().SapId,
                    EmployeeId: employeeId.toString(),
                    CreationDate: incidenceModel[data.incidenceRow].CreationDate,
                    Type: incidenceModel[data.incidenceRow].Type,
                    Reason: incidenceModel[data.incidenceRow].Reason
                };

                this.getView().getModel("incidenceModel").create("/IncidentsSet", body, {
                    success: function () {
                        this.onReadODataIncidence.bind(this)(employeeId);
                        MessageBox.success(oResourceBundle.getText("odataSaveOK"));
                        // sap.m.MessageToast.show(oResourceBundle.getText("odataSaveOK"));
                    }.bind(this),
                    error: function (e) {
                        sap.m.MessageToast.show(oResourceBundle.getText("odataSaveKO"));
                    }.bind(this)
                })



            } else if (incidenceModel[data.incidenceRow].CreationDateX ||
                incidenceModel[data.incidenceRow].ReasonX ||
                incidenceModel[data.incidenceRow].TypeX) {

                var body = {
                    CreationDate: incidenceModel[data.incidenceRow].CreationDate,
                    CreationDateX: incidenceModel[data.incidenceRow].CreationDateX,
                    Type: incidenceModel[data.incidenceRow].Type,
                    TypeX: incidenceModel[data.incidenceRow].TypeX,
                    Reason: incidenceModel[data.incidenceRow].Reason,
                    ReasonX: incidenceModel[data.incidenceRow].ReasonX
                };

                this.getView().getModel("incidenceModel").update("/IncidentsSet(IncidenceId='" + incidenceModel[data.incidenceRow].IncidenceId +
                    "',SapId='" + incidenceModel[data.incidenceRow].SapId +
                    "',EmployeeId='" + incidenceModel[data.incidenceRow].EmployeeId + "')", body, {
                    success: function () {
                        this.onReadODataIncidence.bind(this)(employeeId);
                        sap.m.MessageToast.show(oResourceBundle.getText("odataUpdateOK"));
                    }.bind(this),
                    error: function (e) {
                        sap.m.MessageToast.show(oResourceBundle.getText("odataUpdateKO"));
                    }.bind(this)
                });
            } else {
                sap.m.MessageToast.show(oResourceBundle.getText("odataNoChanges"));
            }

        },

        onReadODataIncidence: function (employeeID) {

            this.getView().getModel("incidenceModel").read("/IncidentsSet", {
                filters: [
                    new sap.ui.model.Filter("SapId", "EQ", this.getOwnerComponent().SapId),
                    new sap.ui.model.Filter("EmployeeId", "EQ", employeeID.toString())
                ],
                success: function (data) {
                    var incidenceModel = this._detailEmployeeView.getModel("incidenceModel");
                    incidenceModel.setData(data.results);
                    var tableIncidence = this._detailEmployeeView.byId("tableIncidence");
                    tableIncidence.removeAllContent();

                    for (var incidence in data.results) {
                        data.results[incidence]._ValidatenDate = true;
                        data.results[incidence].EnabledFalse = false;

                        var newIncidence = sap.ui.xmlfragment("logaligroup.employees.fragment.NewIncidence",
                            this._detailEmployeeView.getController());
                        this._detailEmployeeView.addDependent(newIncidence);
                        newIncidence.bindElement("incidenceModel>/" + incidence);
                        tableIncidence.addContent(newIncidence);
                    }
                }.bind(this),
                error: function (e) {
                }
            });
        }








    });

});