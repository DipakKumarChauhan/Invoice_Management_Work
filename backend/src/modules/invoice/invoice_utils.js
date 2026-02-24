function calculateInvoice(lines, taxPercent = 0){
    const computedLines = lines.map(line => {
        const lineTotal = line.quantity * line.unitPrice;
        return {
            ...line,
            lineTotal
        };
    });
    const subTotal= computedLines.reduce((sum, line) => sum + line.lineTotal, 0);

    const taxAmount = (subTotal * taxPercent) / 100;
    const total = subTotal + taxAmount;

    return {
        computedLines,
        subTotal,
        taxAmount,
        total
    };
}

module.exports = {
    calculateInvoice
}