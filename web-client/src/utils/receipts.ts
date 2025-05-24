import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { ISale } from "../../../server/src/models/Sale"; // Adjust path

export async function generateSaleReceiptPDF(
	sale: ISale,
	config?: { currency?: string },
) {
	const pdfDoc = await PDFDocument.create();
	const page = pdfDoc.addPage([400, 600]);
	const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
	const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

	let y = 570;
	const fontSize = 10;

	function drawText(text: string, opts?: { bold?: boolean; moveY?: number }) {
		if (opts?.moveY) y -= opts.moveY;
		page.drawText(text, {
			x: 30,
			y: y,
			size: fontSize,
			font: opts?.bold ? bold : font,
			color: rgb(0, 0, 0),
		});
	}

	drawText("SALES RECEIPT", { bold: true, moveY: 0 });
	drawText(`Receipt #: ${sale.receiptNumber || "N/A"}`, { moveY: 15 });
	drawText(`Date: ${new Date(sale.date).toLocaleString()}`, { moveY: 15 });
	drawText(`Customer: ${sale.customer.name}`, { moveY: 15 });
	if (sale.customer.phone)
		drawText(`Phone: ${sale.customer.phone}`, { moveY: 15 });
	if (sale.customer.email)
		drawText(`Email: ${sale.customer.email}`, { moveY: 15 });
	if (sale.customer.RTN) drawText(`RTN: ${sale.customer.RTN}`, { moveY: 15 });

	y -= 25;
	drawText("Items:", { bold: true });

	for (let i = 0; i < sale.items.length; i++) {
		const item = sale.items[i];
		const productName =
			typeof item.product === "object" ? item.product.name : item.product;

		drawText(
			`${item.quantity} x ${productName} @ ${config?.currency || "$"}${item.unitPrice.toFixed(2)}`,
			{ moveY: 15 },
		);
		drawText(`- Total: ${config?.currency || "$"}${item.total.toFixed(2)}`, {
			moveY: 13,
		});
	}

	y -= 25;
	drawText("Payment Info", { bold: true, moveY: 10 });
	drawText(`Method: ${sale.payment.method}`, { moveY: 15 });
	drawText(`Status: ${sale.payment.paymentStatus}`, { moveY: 15 });
	drawText(
		`Subtotal: ${config?.currency || "$"}${sale.payment.totalAmount.toFixed(2)}`,
		{
			moveY: 15,
		},
	);
	drawText(
		`Paid: ${config?.currency || "$"}${sale.payment.paidAmount.toFixed(2)}`,
		{ moveY: 15 },
	);
	if (sale.payment.changeGiven)
		drawText(
			`Change: ${config?.currency || "$"}${sale.payment.changeGiven.toFixed(2)}`,
			{
				moveY: 15,
			},
		);

	y -= 25;
	drawText("Processed By:", { bold: true, moveY: 10 });
	drawText(
		typeof sale.processedBy === "object"
			? sale.processedBy.toString() ?? "N/A"
			: String(sale.processedBy),
		{ moveY: 15 },
	);
	drawText(
		`Store: ${typeof sale.store === "object" ? sale.store.name : sale.store}`,
		{
			moveY: 15,
		},
	);

	return await pdfDoc.save(); // returns a Uint8Array
}
