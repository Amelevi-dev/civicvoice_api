/**
 * Migration: Convert Commune to Arrondissement (New Mali Administrative Division)
 * 
 * This script updates all user documents from the old Bamako administrative divisions
 * (Commune I-VI) to the new divisions (Arrondissement I-VII).
 * 
 * Mapping:
 * - "Commune I" / "Commune I (Bamako)" → "Arrondissement I"
 * - "Commune II" / "Commune II (Bamako)" → "Arrondissement II"
 * - ... and so on up to VI
 * - New: "Arrondissement VII" (no old equivalent)
 * 
 * Run with: node migrate-commune-to-arrondissement.js
 */

const mongoose = require('mongoose');
const User = require('../src/models/user.model');
const Consultation = require('../src/models/consultation.model');
const Engagement = require('../src/models/engagement.model');

// Mapping from old values to new values
const MAPPING = {
  'Commune I': 'Arrondissement I',
  'Commune I (Bamako)': 'Arrondissement I',
  'Commune II': 'Arrondissement II',
  'Commune II (Bamako)': 'Arrondissement II',
  'Commune III': 'Arrondissement III',
  'Commune III (Bamako)': 'Arrondissement III',
  'Commune IV': 'Arrondissement IV',
  'Commune IV (Bamako)': 'Arrondissement IV',
  'Commune V': 'Arrondissement V',
  'Commune V (Bamako)': 'Arrondissement V',
  'Commune VI': 'Arrondissement VI',
  'Commune VI (Bamako)': 'Arrondissement VI',
  'Cercle de Kati': 'Cercle de Kati' // Keep unchanged for backward compatibility
};

async function migrate() {
  try {
    // Connect to MongoDB
    const dbUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/civicvoice';
    console.log(`Connecting to MongoDB: ${dbUrl}`);
    
    await mongoose.connect(dbUrl);
    console.log('✓ Connected to MongoDB');

    // Migrate Users
    console.log('\n🔄 Migrating Users...');
    const userUpdateResult = await User.updateMany(
      { arrondissement: { $in: Object.keys(MAPPING) } },
      [
        {
          $set: {
            arrondissement: {
              $cond: [
                { $eq: ['$arrondissement', 'Commune I'] },
                'Arrondissement I',
                {
                  $cond: [
                    { $eq: ['$arrondissement', 'Commune I (Bamako)'] },
                    'Arrondissement I',
                    {
                      $cond: [
                        { $eq: ['$arrondissement', 'Commune II'] },
                        'Arrondissement II',
                        {
                          $cond: [
                            { $eq: ['$arrondissement', 'Commune II (Bamako)'] },
                            'Arrondissement II',
                            {
                              $cond: [
                                { $eq: ['$arrondissement', 'Commune III'] },
                                'Arrondissement III',
                                {
                                  $cond: [
                                    { $eq: ['$arrondissement', 'Commune III (Bamako)'] },
                                    'Arrondissement III',
                                    {
                                      $cond: [
                                        { $eq: ['$arrondissement', 'Commune IV'] },
                                        'Arrondissement IV',
                                        {
                                          $cond: [
                                            { $eq: ['$arrondissement', 'Commune IV (Bamako)'] },
                                            'Arrondissement IV',
                                            {
                                              $cond: [
                                                { $eq: ['$arrondissement', 'Commune V'] },
                                                'Arrondissement V',
                                                {
                                                  $cond: [
                                                    { $eq: ['$arrondissement', 'Commune V (Bamako)'] },
                                                    'Arrondissement V',
                                                    {
                                                      $cond: [
                                                        { $eq: ['$arrondissement', 'Commune VI'] },
                                                        'Arrondissement VI',
                                                        {
                                                          $cond: [
                                                            { $eq: ['$arrondissement', 'Commune VI (Bamako)'] },
                                                            'Arrondissement VI',
                                                            '$arrondissement'
                                                          ]
                                                        }
                                                      ]
                                                    }
                                                  ]
                                                }
                                              ]
                                            }
                                          ]
                                        }
                                      ]
                                    }
                                  ]
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          }
        }
      ]
    );
    console.log(`✓ Updated ${userUpdateResult.modifiedCount} users`);

    // Migrate Consultations
    console.log('\n🔄 Migrating Consultations...');
    const consultationUpdateResult = await Consultation.updateMany(
      { arrondissement: { $in: Object.keys(MAPPING) } },
      [
        {
          $set: {
            arrondissement: {
              $switch: {
                branches: [
                  { case: { $eq: ['$arrondissement', 'Commune I'] }, then: 'Arrondissement I' },
                  { case: { $eq: ['$arrondissement', 'Commune I (Bamako)'] }, then: 'Arrondissement I' },
                  { case: { $eq: ['$arrondissement', 'Commune II'] }, then: 'Arrondissement II' },
                  { case: { $eq: ['$arrondissement', 'Commune II (Bamako)'] }, then: 'Arrondissement II' },
                  { case: { $eq: ['$arrondissement', 'Commune III'] }, then: 'Arrondissement III' },
                  { case: { $eq: ['$arrondissement', 'Commune III (Bamako)'] }, then: 'Arrondissement III' },
                  { case: { $eq: ['$arrondissement', 'Commune IV'] }, then: 'Arrondissement IV' },
                  { case: { $eq: ['$arrondissement', 'Commune IV (Bamako)'] }, then: 'Arrondissement IV' },
                  { case: { $eq: ['$arrondissement', 'Commune V'] }, then: 'Arrondissement V' },
                  { case: { $eq: ['$arrondissement', 'Commune V (Bamako)'] }, then: 'Arrondissement V' },
                  { case: { $eq: ['$arrondissement', 'Commune VI'] }, then: 'Arrondissement VI' },
                  { case: { $eq: ['$arrondissement', 'Commune VI (Bamako)'] }, then: 'Arrondissement VI' }
                ],
                default: '$arrondissement'
              }
            }
          }
        }
      ]
    );
    console.log(`✓ Updated ${consultationUpdateResult.modifiedCount} consultations`);

    // Summary
    console.log('\n📊 Migration Summary:');
    console.log(`  - Users updated: ${userUpdateResult.modifiedCount}`);
    console.log(`  - Consultations updated: ${consultationUpdateResult.modifiedCount}`);
    console.log('\n✅ Migration completed successfully!');
    console.log('\nNote: The following divisions have been updated:');
    console.log('  Commune I (Bamako) → Arrondissement I');
    console.log('  Commune II (Bamako) → Arrondissement II');
    console.log('  Commune III (Bamako) → Arrondissement III');
    console.log('  Commune IV (Bamako) → Arrondissement IV');
    console.log('  Commune V (Bamako) → Arrondissement V');
    console.log('  Commune VI (Bamako) → Arrondissement VI');
    console.log('  [NEW] Arrondissement VII');

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

// Run migration
migrate();
