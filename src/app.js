//
// APPLICATION ENTRY POINT
//

// XXX: RUNTIME POLYFILL: Required for generators and others
import 'babel/polyfill';
import config from 'config';
import cron from 'cron';
import kue from 'kue';

const tz = 'America/New_York';
let CronJob = cron.CronJob;
let queueConfig = {
  jobEvents: false,
  redis: {
    host: config.get('redis.host'),
    port: config.get('redis.port'),
    auth: config.get('redis.password')
  }
};

let queue = kue.createQueue(queueConfig);
queue.watchStuckJobs();

// Start GUI Server
kue.app.listen(process.env.PORT || 8081);

function createJob(jobType, data={}) {
  console.log(`Creating ${jobType} job:`, data);
  queue.create(jobType, data)
    .removeOnComplete(true)
    .backoff({delay: 60*1000, type:'exponential'})
    .save();
}

// Crontab format ---
// Seconds: 0-59
// Minutes: 0-59
// Hours: 0-23
// Day of Month: 1-31
// Months: 0-11
// Day of Week: 0-6

// 0, 3, 6, 9, 12, 15, 18, 21
let refreshRetention = new CronJob('0 0 0-23/3 * * *', () => {
  createJob('refreshAllViews', { type: 'retention', title: 'Retention'} );
}, null, true, tz);

// 1, 4, 7, 10, 13, 16, 19, 22
let refreshRevenue = new CronJob('0 0 1-23/3 * * *', () => {
  createJob('refreshAllViews', { type: 'revenue', title: 'Revenue'} );
}, null, true, tz);

// 2, 5, 8, 11, 14, 17, 20, 23
let refreshBehaviorFlow = new CronJob('0 0 2-23/3 * * *', () => {
  createJob('refreshAllViews', { type: 'behaviorFlow', title: 'Behavior Flow'} );
}, null, true, tz);

// 12:30 AM
let pruneAllViews = new CronJob('0 30 0 * * *', () => {
  createJob('pruneAllViews', {title: 'Prune all views'});
}, null, true, tz);

// 8:00 AM
let sendEmails = new CronJob('0 0 8 * * *', () => {
  createJob('sendSummaryEmails');
}, null, true, tz);
