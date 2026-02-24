const app =  require('./app');
const prisma =  require('./config/db');
const env= require('./config/env');
const logger = require('./utils/logger');
const startOverdueJob =
  require("./utils/overdue_job");

startOverdueJob();

async function start(){

    try {
        await prisma.$connect();
        app.listen(env.PORT, ()=>{
            logger.info(`Server is running on port ${env.PORT}`);
        })
    } catch (error) {
        logger.error(error);
        process.exit(1);
    }
}

start();