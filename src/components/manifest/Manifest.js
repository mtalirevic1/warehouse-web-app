import React from 'react';
import jsPDF from "jspdf";
import "jspdf-autotable";

   export const exportPDF = products => {
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "portrait"; // portrait or landscape

        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);

        doc.setFontSize(15);

        const title = "Shipment Manifest";
        const headers = [["Name", "Quantity"]];

        const data = products.map(elt => [elt.name, elt.quantity]);

        let content = {
            startY: 50,
            head: headers,
            body: data
        };

        doc.text(title, marginLeft, 40);
        doc.autoTable(content);
        doc.save("shipmentManifest.pdf")
    };

