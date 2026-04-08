require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const path = require('path');

// Load models
const Department = require('../models/Department');
const Tower = require('../models/Tower');
const Process = require('../models/Process');
const Activity = require('../models/Activity');
const Setting = require('../models/Setting');

// Load seed data
const hrData = require('./hr_activities.json');
const faData = require('./fa_activities.json');

async function clearCollections() {
  console.log('🗑️  Clearing existing eper_ collections...');
  await Activity.deleteMany({});
  await Process.deleteMany({});
  await Tower.deleteMany({});
  await Department.deleteMany({});
  await Setting.deleteMany({});
  console.log('✅ Collections cleared.');
}

async function seedSettings() {
  console.log('⚙️  Seeding settings...');
  await Setting.insertMany([
    { key: 'standardHours', value: 160 },
    { key: 'avgSalaryPerFTE', value: 600000 }
  ]);
  console.log('✅ Settings seeded.');
}

async function seedDepartmentData(deptCode, deptName, data) {
  console.log(`\n📁 Seeding department: ${deptName} (${deptCode})`);

  // Create department
  const dept = await Department.create({ code: deptCode, name: deptName });
  console.log(`  ✅ Department created: ${dept.name}`);

  let totalTowers = 0, totalProcesses = 0, totalActivities = 0;

  for (const towerData of data.towers) {
    const tower = await Tower.create({ name: towerData.name, department: dept._id });
    totalTowers++;
    console.log(`  🏢 Tower: ${tower.name}`);

    const towerActivities = [];
    const towerProcesses = [];

    for (const processData of towerData.processes) {
      const process = await Process.create({
        name: processData.name,
        tower: tower._id,
        department: dept._id
      });
      towerProcesses.push(process);
      totalProcesses++;

      for (const actName of processData.activities) {
        towerActivities.push({
          name: actName,
          process: process._id,
          tower: tower._id,
          department: dept._id,
          automationPotential: 'Medium',
          currentFTE: 0,
          proposedFTE: 0,
          isCustom: false
        });
      }
    }

    if (towerActivities.length > 0) {
      await Activity.insertMany(towerActivities);
      totalActivities += towerActivities.length;
      console.log(`    ✅ ${towerActivities.length} activities added`);
    }
  }

  return { towers: totalTowers, processes: totalProcesses, activities: totalActivities };
}

async function main() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    await clearCollections();
    await seedSettings();

    const hrCounts = await seedDepartmentData('HR', 'Human Resources', hrData);
    const faCounts = await seedDepartmentData('FA', 'Finance & Accounts', faData);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 SEED SUMMARY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`HR  → Towers: ${hrCounts.towers} | Processes: ${hrCounts.processes} | Activities: ${hrCounts.activities}`);
    console.log(`FA  → Towers: ${faCounts.towers} | Processes: ${faCounts.processes} | Activities: ${faCounts.activities}`);
    console.log(`Settings: 2`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Seed complete!\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

main();
