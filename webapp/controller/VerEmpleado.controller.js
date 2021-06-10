//@ts-nocheck
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox"

],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.core.routing.History} History
     * @param {typeof sap.ui.core.UIComponent} UIComponent
     * @param {typeof sap.ui.model.Filter} Filter
     * @param {typeof sap.ui.model.FilterOperator} FilterOperator
     *  @param {typeof sap.m.Messagebox} Messagebox
     * 
     */
    function (Controller, History, UIComponent, Filter, FilterOperator, MessageBox) {
        "use strict";

        function onInit() {
            this._splitAppEmployee = this.byId("SplitAppDemo");

            

        };

        function toHome(oEvent) {
            const oHistory = History.getInstance();
            const sPreviousHAsh = oHistory.getPreviousHash();

            if (sPreviousHAsh !== undefined) {
                window.history.go(-1);
            } else {
                const oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("RouteMain", {}, true);
            }
        };

        function onSelectEmployee(oEvent) {
            //Se navega al detalle del empleado
            this._splitAppEmployee.to(this.createId("detalle_Empleado"));
            var context = oEvent.getParameter("listItem").getBindingContext("odataModel");
            //Se almacena el usuario seleccionado
            this.employeeId = context.getProperty("EmployeeId");
            var detailEmployee = this.byId("detalle_Empleado");
            //Se bindea a la vista con la entidad Users y las claves del id del empleado y el id del alumno
            detailEmployee.bindElement("odataModel>/Users(EmployeeId='" + this.employeeId + "',SapId='" + this.getOwnerComponent().SapId + "')");


            // Bind Files
            this.byId("UploadCollection").bindAggregation("items", {
                path: "odataModel>/Attachments",
                filters: [
                    new Filter("SapId", FilterOperator.EQ, this.getOwnerComponent().SapId),
                    new Filter("EmployeeId", FilterOperator.EQ, this.employeeId),
                ],
                template: new sap.m.UploadCollectionItem({
                    documentId: "{odataModel>AttId}",
                    visibleEdit: false,
                    fileName: "{odataModel>DocName}"

                }).attachPress(this.downloadFile)
            });



        };

        function onBeforeUploadStart(oEvent) {
            var oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
                name: "slug",
                value: this.getOwnerComponent().SapId + ";" + this.employeeId + ";" + oEvent.getParameter("fileName")
            });
            oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
        };

        function onChange(oEvent) {
            var oUploadCollection = oEvent.getSource();
            // Header Token
            var oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
                name: "x-csrf-token",
                value: this.getView().getModel("odataModel").getSecurityToken()
            });
            oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
        };

        function onUploadComplete(oEvent) {
            var oUploadCollection = oEvent.getSource();
            oUploadCollection.getBinding("items").refresh();
        }

        function onFileDeleted(oEvent) {
            var oUploadCollection = oEvent.getSource();
            var sPath = oEvent.getParameter("item").getBindingContext("odataModel").getPath();
            this.getView().getModel("odataModel").remove(sPath, {
                success: function () {
                    oUploadCollection.getBinding("items").refresh();
                },
                error: function () {

                }
            });
        }

        function downloadFile(oEvent) {
            var sPath = oEvent.getSource().getBindingContext("odataModel").getPath();
            window.open("/sap/opu/odata/sap/ZEMPLOYEES_SRV" + sPath + "/$value");
        };


        function onEliminar(empId) {
            var msgEliminar = this.getView().getModel("i18n").getResourceBundle().getText("msgEliminar");
            var _view = this.getView();
            var _empId = empId;

            var _sapid = this.getOwnerComponent().SapId;
            MessageBox.error(msgEliminar, {
                actions: [MessageBox.Action.OK, MessageBox.Action.CLOSE],
                emphasizedAction: MessageBox.Action.OK,
                onClose: function (sAction) {
                    if (sAction === 'OK') {


                        _view.getModel("odataModel").remove("/Users(EmployeeId='" + _empId + "',SapId='" + _sapid + "')", {
                            success: function (data) {

                                sap.m.MessageToast.show(_view.getModel("i18n").getResourceBundle().getText("confirmarEliminar"));
                                //En el detalle se muestra el mensaje "Seleecione empleado"
                                this._splitAppEmployee.to(this.createId("detailSelectEmployee"));
                            }.bind(this),
                            error: function (e) {
                                sap.base.Log.info(e);
                            }.bind(this)
                        });
                    } else {
                        sap.m.MessageToast.show("Action selected: " + sAction);
                    }

                }
            });
        }

        function onAscender(oEvent) {
            if (!this.ascenderDialog) {
                this.ascenderDialog = sap.ui.xmlfragment("final/empleados/fragment/AscenderEmpleado", this);
                this.getView().addDependent(this.ascenderDialog);
            }
            this.ascenderDialog.setModel(new sap.ui.model.json.JSONModel({}), "newRise");
            this.ascenderDialog.open();
        };

        function confirmaAscenso(oEvent) {
            //Se obtiene el modelo newRise
            var newRise = this.ascenderDialog.getModel("newRise");
            //Se obtiene los datos
            var odata = newRise.getData();
            //Se prepara la informacion para enviar a sap y se agrega el campo sapId con el id del alumno y el id del empleado
            var body = {
                Ammount: odata.Ammount,
                CreationDate: odata.CreationDate,
                Comments: odata.Comments,
                SapId: this.getOwnerComponent().SapId,
                EmployeeId: this.employeeId
            };
            this.getView().setBusy(true);
            this.getView().getModel("odataModel").create("/Salaries", body, {
                success: function () {
                    this.getView().setBusy(false);
                    sap.m.MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("ascensoCorrecto"));
                    this.onCloseRiseDialog();
                }.bind(this),
                error: function () {
                    this.getView().setBusy(false);
                    sap.m.MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("ascensoErroneo"));
                }.bind(this)
            });

        };

        function onCloseRiseDialog(){
		this.ascenderDialog.close();
	}

        return Controller.extend("final.empleados.controller.VerEmpleado", {
            onInit: onInit,
            toHome: toHome,
            onSelectEmployee: onSelectEmployee,
            onBeforeUploadStart: onBeforeUploadStart,
            onChange: onChange,
            onUploadComplete: onUploadComplete,
            onFileDeleted: onFileDeleted,
            downloadFile: downloadFile,
            onEliminar: onEliminar,
            onAscender: onAscender,
            confirmaAscenso: confirmaAscenso,
            onCloseRiseDialog: onCloseRiseDialog
        });



    });
