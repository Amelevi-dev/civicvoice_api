# Migration: Commune → Arrondissement (New Mali Administrative Division)

Date: May 11, 2026

## Overview

Cette migration aligne l'application CivicVoice sur le nouveau découpage administratif du Mali pour Bamako. Les 6 communes ont été remplacées par 7 arrondissements.

## Changes Made

### 1. **Backend API** (`civicvoice_api`)

#### Updated Models
- **[user.model.js](../src/models/user.model.js)**: Enum `arrondissement` updated
  - OLD: `'Commune I'`, `'Commune II'`, ..., `'Commune VI'`, `'Commune I (Bamako)'`, ..., `'Commune VI (Bamako)'`
  - NEW: `'Arrondissement I'`, `'Arrondissement II'`, ..., `'Arrondissement VII'`
  - Other regions unchanged: Kayes, Koulikoro, Sikasso, Ségou, Mopti, Tombouctou, Gao, Kidal, Taoudénit, Ménaka, Dioïla, Kati

#### Updated Server Seed Data
- **[server.js](../server.js)**: Default admin user arrondissement
  - Changed: `'Commune I (Bamako)'` → `'Arrondissement I'`

### 2. **Mobile App** (`civicvoice_app`)

#### Registration Form
- **[RegisterScreen.js](../src/screens/RegisterScreen.js)**:
  - ✅ Validation message updated: `'La commune est requise'` → `"L'arrondissement est requis"`
  - ✅ Default value updated: `'Commune I (Bamako)'` → `'Arrondissement I'`
  - ✅ UI Label updated: `'ARRONDISSEMENT / COMMUNE'` → `'ARRONDISSEMENT'`
  - ✅ Picker items updated with 7 new arrondissements (I-VII)

### 3. **Backoffice** (`civicvoice_backoffice`)

#### Create Consultation Form
- **[CreateConsultation.jsx](../src/pages/consultations/CreateConsultation.jsx)**:
  - ✅ Label updated: `'Commune / Collectivité'` → `'Arrondissement'`
  - ✅ Form default value: `'Commune I (Bamako)'` → `'Arrondissement I'`
  - ✅ Options updated with 7 new arrondissements

#### User Registration Form
- **[Register.jsx](../src/pages/auth/Register.jsx)**:
  - ✅ Label updated: `'Commune / Région'` → `'Arrondissement / Région'`
  - ✅ Form default value: `'Commune I'` → `'Arrondissement I'`
  - ✅ Options updated: Bamako section now shows 7 arrondissements

#### Dashboard
- **[dashboard.jsx](../src/pages/dashboard/dashboard.jsx)**:
  - ✅ `REGION_GROUPS` constant updated: Bamako array now contains 7 arrondissements
  - ✅ Chart title updated: `'Dynamisme par Commune'` → `'Dynamisme par Arrondissement'`

#### Access Management
- **[AccessManagement.jsx](../src/pages/admin/AccessManagement.jsx)**:
  - ✅ Table header updated: `'Commune'` → `'Arrondissement'` (2 occurrences)

## Database Migration

### Running the Migration

To update existing data in MongoDB with the new arrondissement values:

```bash
# Navigate to API directory
cd civicvoice_api

# Run the migration script
node migrations/migrate-commune-to-arrondissement.js
```

### What the Migration Does

The migration script performs the following transformations:

```
"Commune I" / "Commune I (Bamako)"  → "Arrondissement I"
"Commune II" / "Commune II (Bamako)" → "Arrondissement II"
"Commune III" / "Commune III (Bamako)" → "Arrondissement III"
"Commune IV" / "Commune IV (Bamako)" → "Arrondissement IV"
"Commune V" / "Commune V (Bamako)" → "Arrondissement V"
"Commune VI" / "Commune VI (Bamako)" → "Arrondissement VI"
```

Affected collections:
- `users` - All user documents
- `consultations` - All consultation documents
- `engagements` - All engagement documents (via consultation references)

### Migration Output Example

```
✓ Connected to MongoDB
🔄 Migrating Users...
✓ Updated 45 users
🔄 Migrating Consultations...
✓ Updated 23 consultations
📊 Migration Summary:
  - Users updated: 45
  - Consultations updated: 23
✅ Migration completed successfully!
```

### Before Running

1. **Backup your database** before running the migration:
   ```bash
   mongodump --db civicvoice --out ./backup
   ```

2. **Test in development** first

3. **Check environment variables**:
   - Ensure `MONGODB_URI` is set correctly (if not using default localhost)

## Verification Checklist

After deploying the changes, verify:

- [ ] **Backend API**
  - New users can be created with Arrondissement I-VII
  - Old values (Commune I, etc.) are rejected
  - Admin user has been seeded with Arrondissement I

- [ ] **Mobile App**
  - Picker displays 7 arrondissements (Arrondissement I-VII)
  - New registrations use Arrondissement values
  - Profile displays correct arrondissement name

- [ ] **Backoffice**
  - Consultation creation form shows 7 arrondissements
  - User registration form shows 7 arrondissements in Bamako group
  - Dashboard filters correctly by new arrondissements
  - Access Management table shows "Arrondissement" header

- [ ] **Database**
  - Existing users migrated to new values
  - Consultations reference new arrondissement values
  - No old values remain in the database

## Rollback (if needed)

If you need to revert this migration, use your database backup:

```bash
mongorestore --db civicvoice ./backup/civicvoice
```

## API Breaking Changes

⚠️ **Important**: The `arrondissement` field enum values have changed:

- **Before**: `['Commune I', 'Commune II', ..., 'Commune I (Bamako)', ...]`
- **After**: `['Arrondissement I', 'Arrondissement II', ..., 'Arrondissement VII']`

Any external systems or scripts that reference the old values will need to be updated.

## Field Names

The field name `arrondissement` remains unchanged to maintain API backward compatibility and reduce breaking changes.

## Notes

- The new 7th arrondissement follows the official Mali 2024 administrative division update
- Other regions (Kayes, Koulikoro, etc.) remain unchanged
- The "Cercle de Kati" option remains unchanged
- Consultations created for old communes are automatically mapped to new arrondissements during migration
