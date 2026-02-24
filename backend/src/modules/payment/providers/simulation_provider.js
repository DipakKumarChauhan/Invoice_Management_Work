async function processPayment({ amount }) {
  // simulate gateway delay
  await new Promise(resolve => setTimeout(resolve, 300));

  return {
    success: true,
    gatewayOrderId: `SIM_ORDER_${Date.now()}`,
    gatewayPaymentId: `SIM_PAY_${Date.now()}`
  };
}

module.exports = {
  processPayment
};