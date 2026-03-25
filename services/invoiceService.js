import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const createInvoice = (order) => {
  // ✅ Always resolve absolute path
  const invoicesDir = path.join(process.cwd(), "server", "invoices");

  // ✅ Auto-create invoices folder if missing
  if (!fs.existsSync(invoicesDir)) {
    fs.mkdirSync(invoicesDir, { recursive: true });
  }

  const filePath = path.join(
    invoicesDir,
    `invoice-${Date.now()}.pdf`
  );

  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(20).text("Fintail Aquatic Invoice\n");
  doc.fontSize(14).text(`Customer: ${order.customerEmail}`);
  doc.text(`Date: ${new Date().toLocaleDateString()}\n`);

  order.products.forEach(p => {
    doc.text(`${p.name} × ${p.quantity} - $${p.price}`);
  });

  doc.text("\nTotal: $" + order.total);
  doc.end();

  return filePath;
};
