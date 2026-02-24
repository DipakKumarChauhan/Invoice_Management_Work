const cron = require("node-cron");
const prisma = require("../config/db");

function startOverdueJob() {
    // Schedule the job to run every day at midnight
    cron.schedule("0 0 * * *", async () => {

        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const result =await prisma.invoice.updateMany({
            where:{
                dueDate: {lt: today},
                balanceDue: {gt: 0},
                status: { not: "OVERDUE" }
            },
            data:{
                status: "OVERDUE"
            }
        });



        } catch (error) {
            throw new Error("Failed to update overdue invoices: " + error.message);
        }
        
    },
    {
        timezone: "Asia/Kolkata"
    }
    
);
}

module.exports = startOverdueJob;