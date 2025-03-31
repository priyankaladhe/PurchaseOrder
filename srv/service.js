const { executeHttpRequest } = require('@sap-cloud-sdk/http-client');
const { getDestination } = require('@sap-cloud-sdk/core');

module.exports = async function (srv) {
    srv.on('PostPurchaseOrderData', async (req) => {
        try {
            console.log(req);
            // The original utf8 string
            var base64string = req.data.encode;
            // Create a buffer from the string
            var bufferObj = Buffer.from(base64string, "base64");
            // Encode the Buffer as a utf8 string
            var decodedString = bufferObj.toString("utf8");
            JSON.stringify(decodedString);
            console.log(decodedString);

            const DESTINATION_NAME = 'Purchase_Order';

            const destination = await getDestination('Purchase_Order');

            const auth = 'Basic ' + Buffer.from(destination.username + ':' + destination.password).toString('base64');

            const response = await executeHttpRequest({ destinationName: DESTINATION_NAME }, {
                method: 'POST',
                url: 'PurchaseOrder',
                data: decodedString,
                headers: {
                    'Authorization': auth,
                    'content-type': 'application/json'
                }
            });


            return response.data;
            console.log(response);
        } catch (error) {
            console.error('Error calling destination API:', error);
            //throw new Error('Failed to fetch data from the destination API');
        }
    });

    srv.on('getPurchaseOrderList', async (req) => {
        try {
 
            const DESTINATION_NAME = 'Purchase_Order';
            const response = await executeHttpRequest({ destinationName: DESTINATION_NAME }, {
                method: 'GET',
                url: 'PurchaseOrder'
            });
            return response.data;
            console.log(response);
        } catch (error) {
            console.error('Error calling destination API:', error);
            throw new Error('Failed to fetch data from the destination API');
        }
    });

    srv.on('getPurchaseOrderItems', async (req) => {
        try {
 
            const DESTINATION_NAME = 'Purchase_Order';
            
            const itemResponse = await executeHttpRequest({ destinationName: DESTINATION_NAME }, {
                method: 'GET',
                url: 'PurchaseOrderItem'
            });
            return itemResponse.data;
            console.log(itemResponse);
        } catch (error) {
            console.error('Error calling destination API:', error);
            throw new Error('Failed to fetch data from the destination API');
        }
    });
};