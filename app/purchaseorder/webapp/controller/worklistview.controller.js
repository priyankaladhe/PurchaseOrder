sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("purchaseorder.controller.worklistview", {
        onInit() {
        
            const oModel = new sap.ui.model.json.JSONModel({

                "PurchaseOrders" : []

            }); 
            this.getView().setModel(oModel, "oModel"); 

            const serviceUrl = this.getOwnerComponent().getModel().getServiceUrl();
        
            // Perform GET Call
            $.ajax({
                url: serviceUrl + "getPurchaseOrderList",
                type: "POST",
                contentType: "application/json",
                success: function (response) {
                    console.log("Success:", response.value.value);
                    oModel.setProperty('/PurchaseOrders', response.value.value);
                
                },
                error: function (oError) {
                    console.error("Error fetching data:", oError);
                }
            });
        },
        onToggleInfoToolbar: function () {
            console.log("🔹 Navigating to createobject...");
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("Routecreateobjectview",{}, true);  // Make sure this name matches the "name" in manifest.json
        },
        onRowPress: function (oEvent) {
            var oSelectedItem = oEvent.getSource(); // Get selected row
            var oContext = oSelectedItem.getBindingContext("oModel"); // Get the binding context

            if (oContext) {
                var sPurchaseOrder = oContext.getProperty("PurchaseOrder"); // Fetch Purchase Order ID

                // Navigate to the Object Page with the selected Purchase Order ID
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("Routeobjectview", {
                    purchaseOrderId: sPurchaseOrder
                });
            }
        }
    });
});