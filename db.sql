-- Database Schema and Alterations Extracted

-- ==========================================
-- FROM schema.sql
-- ==========================================

CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  role_name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  role_id INT,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(150) UNIQUE NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  phone VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  password_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  password_reset_required BOOLEAN DEFAULT FALSE,
  job_title VARCHAR(100),
  location VARCHAR(100),
  profile_image VARCHAR(255),
  status ENUM('active', 'inactive', 'pending') DEFAULT 'active',
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  address TEXT,
  project_type VARCHAR(100),
  calculation_type ENUM('Chargeable Area', 'Covered Area', 'Carpet Area') DEFAULT 'Chargeable Area',
  total_floors INT DEFAULT 0,
  total_project_area DECIMAL(10, 2) DEFAULT 0.00,
  project_image VARCHAR(255),
  description TEXT,
  status ENUM('active', 'inactive', 'maintenance') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS units (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  unit_number VARCHAR(50) NOT NULL,
  floor_number VARCHAR(50),
  block_tower VARCHAR(50),
  chargeable_area DECIMAL(10, 2),
  carpet_area DECIMAL(10, 2),
  covered_area DECIMAL(10, 2),
  builtup_area DECIMAL(10, 2),
  unit_condition ENUM('fully_fitted', 'semi_fitted', 'bare_shell') DEFAULT 'bare_shell',
  plc ENUM('front_facing', 'corner', 'park_facing', 'road_facing'),
  projected_rent DECIMAL(12, 2),
  status ENUM('vacant', 'occupied', 'under_maintenance', 'reserved') DEFAULT 'vacant',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS unit_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  unit_id INT NOT NULL,
  image_path VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS owners (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(150),
  phone VARCHAR(50),
  company_name VARCHAR(255),
  tax_id VARCHAR(100),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS owner_units (
  id INT AUTO_INCREMENT PRIMARY KEY,
  owner_id INT NOT NULL,
  unit_id INT NOT NULL,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES owners(id) ON DELETE CASCADE,
  FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS owner_documents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  owner_id INT NOT NULL,
  document_type VARCHAR(100),
  document_path VARCHAR(255),
  status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES owners(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS owner_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  owner_id INT NOT NULL,
  subject VARCHAR(255),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES owners(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tenants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL,
  brand_name VARCHAR(255),
  legal_entity_type VARCHAR(100),
  registration_no VARCHAR(100),
  industry VARCHAR(100),
  tax_id VARCHAR(100),
  id_type VARCHAR(50),
  contact_person_name VARCHAR(150),
  contact_person_email VARCHAR(150),
  contact_person_phone VARCHAR(50),
  website VARCHAR(255),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  zip_code VARCHAR(50),
  country VARCHAR(100),
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tenant_units (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tenant_id INT NOT NULL,
  unit_id INT NOT NULL,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sub_tenants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tenant_id INT NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  registration_no VARCHAR(100),
  industry VARCHAR(100),
  contact_person VARCHAR(150),
  email VARCHAR(150),
  phone VARCHAR(50),
  allotted_area DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS leases (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT,
  unit_id INT,
  owner_id INT,
  tenant_id INT,
  sub_tenant_id INT,
  lease_type ENUM('Direct lease', 'Subtenant lease') DEFAULT 'Direct lease',
  rent_model ENUM('Fixed', 'Revenue Share') DEFAULT 'Fixed',
  sub_lease_area_sqft DECIMAL(10,2),
  lease_start DATE,
  lease_end DATE,
  rent_commencement_date DATE,
  fitout_period_end DATE,
  tenure_months INT,
  lockin_period_months INT,
  notice_period_months INT,
  monthly_rent DECIMAL(15, 2),
  cam_charges DECIMAL(15, 2),
  billing_frequency VARCHAR(50),
  payment_due_day VARCHAR(50),
  currency_code VARCHAR(10) DEFAULT 'INR',
  security_deposit DECIMAL(15, 2),
  utility_deposit DECIMAL(15, 2),
  deposit_type VARCHAR(50),
  revenue_share_percentage DECIMAL(5, 2),
  revenue_share_applicable_on VARCHAR(50),
  status ENUM('draft', 'pending_approval', 'approved', 'active', 'terminated', 'expired') DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id),
  FOREIGN KEY (unit_id) REFERENCES units(id),
  FOREIGN KEY (owner_id) REFERENCES owners(id),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  FOREIGN KEY (sub_tenant_id) REFERENCES sub_tenants(id)
);

CREATE TABLE IF NOT EXISTS lease_escalations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lease_id INT NOT NULL,
  sequence_no INT,
  effective_from DATE,
  effective_to DATE,
  increase_type ENUM('Percentage', 'Fixed Amount') DEFAULT 'Percentage',
  value DECIMAL(12, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lease_id) REFERENCES leases(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  title VARCHAR(255),
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS activity_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  action VARCHAR(255),
  module VARCHAR(100),
  details TEXT,
  ip_address VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_name VARCHAR(255),
  company_logo VARCHAR(255),
  theme_color VARCHAR(50),
  currency VARCHAR(10) DEFAULT 'INR',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS documents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  entity_type ENUM('project', 'unit', 'tenant', 'owner') NOT NULL,
  entity_id INT,
  document_type VARCHAR(100),
  file_path VARCHAR(255) NOT NULL,
  uploaded_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ==========================================
-- FROM backend\add_escalation_end_date.js
-- ==========================================

SHOW COLUMNS FROM lease_escalations LIKE 'effective_to'");

        if (rows.length === 0) {
            await pool.query("ALTER TABLE lease_escalations ADD COLUMN effective_to DATE AFTER effective_from;


-- ==========================================
-- FROM backend\alter_parties.js
-- ==========================================

ALTER TABLE parties ADD COLUMN brand_category VARCHAR(255);

ALTER TABLE parties ADD COLUMN representative_designation VARCHAR(255);

ALTER TABLE parties ADD COLUMN owner_group VARCHAR(255);


-- ==========================================
-- FROM backend\alter_party_type.js
-- ==========================================

ALTER TABLE parties ADD COLUMN party_type VARCHAR(255);


-- ==========================================
-- FROM backend\seed_notifications.js
-- ==========================================

DELETE FROM notifications");

        // Insert new
        for (const n of notifications) {
            // Note: we are storing 'type' in 'title' prefix or just retrieving it heuristically later
            // asking to alter table might be risky if live. 
            // Schema doesn;

ALTER TABLE notifications ADD COLUMN type VARCHAR(50) DEFAULT;


-- ==========================================
-- FROM backend\scripts\add_block_tower_to_units.js
-- ==========================================

ALTER TABLE units 
                ADD COLUMN block_tower VARCHAR(50) AFTER floor_number
            `);


-- ==========================================
-- FROM backend\scripts\add_block_tower_to_units_fix.js
-- ==========================================

ALTER TABLE units 
                ADD COLUMN block_tower VARCHAR(50) DEFAULT NULL AFTER floor_number
            `);


-- ==========================================
-- FROM backend\scripts\add_filter_options_table.js
-- ==========================================

CREATE TABLE IF NOT EXISTS filter_options (
        id INT AUTO_INCREMENT PRIMARY KEY,
        category VARCHAR(100);


-- ==========================================
-- FROM backend\scripts\add_joint_owner_columns.js
-- ==========================================

ALTER TABLE unit_ownerships ADD COLUMN share_percentage DECIMAL(5,2) DEFAULT 100.00;


-- ==========================================
-- FROM backend\scripts\add_lease_dates_columns.js
-- ==========================================

ALTER TABLE leases ${col};


-- ==========================================
-- FROM backend\scripts\add_lease_fields.js
-- ==========================================

SELECT * FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?",
            [tableName, columnName]
        );
        
        if (rows.length === 0) {
            await pool.query(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnDefinition};

ALTER TABLE lease_escalations MODIFY COLUMN effective_to DATE NULL;

ALTER TABLE leases MODIFY COLUMN payment_due_day VARCHAR(50);


-- ==========================================
-- FROM backend\scripts\add_new_columns.js
-- ==========================================

ALTER TABLE units ADD COLUMN unit_category VARCHAR(100);

ALTER TABLE units ADD COLUMN unit_zoning_type VARCHAR(100);

ALTER TABLE leases ADD COLUMN premium_on_lease DECIMAL(10,2) DEFAULT 0;

ALTER TABLE leases ADD COLUMN monthly_net_sales DECIMAL(15,2) DEFAULT 0;


-- ==========================================
-- FROM backend\scripts\add_ownership_doc_tables.js
-- ==========================================

CREATE TABLE IF NOT EXISTS ownership_document_types (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL UNIQUE,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

INSERT INTO ownership_document_types (name) VALUES (?)', [type]);
                console.log(`Inserted default type: ${type}`);
            } catch (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    console.log(`Type already exists: ${type}`);
                } else {
                    console.error(`Failed to insert type ${type}:`, err.message);
                }
            }
        }

        // 3. Create unit_ownership_documents table
        // Links a specific document upload to a specific unit-party ownership relation
        // We assume 'unit_ownerships' table exists (if not, we might need to check previous migrations, but context implies it exists)
        // Wait, checking schema.sql... 
        // schema.sql shows 'owner_units' and 'ownership_history' logic seems manually query based in controller.
        // Let's check ownershipController.js: it uses 'unit_ownerships' table.
        // Queries: 'INSERT INTO unit_ownerships (unit_id, party_id, start_date, ownership_status)...'

        // We need a way to link documents to the ownership record. 
        // Since unit_ownerships might not have a clean ID we can refer to easily if it's a many-to-many link table without a primary key? 
        // Let's verify unit_ownerships schema. It's not in schema.sql text I saw earlier... context might be missing it or it was created in a previous unrecorded step.
        // Assuming unit_ownerships exists. Does it have an ID? 
        // Usually link tables might not, but let's assume we can link by (unit_id, party_id).
        // Or better, let's add an ID to unit_ownerships if it doesn't have one, OR just link by unit_id and party_id.
        // To be safe and clean, I will create the document table linking to unit_id and party_id directly.

        await connection.query(`
            CREATE TABLE IF NOT EXISTS unit_ownership_documents (
                id INT AUTO_INCREMENT PRIMARY KEY,
                unit_id INT NOT NULL,
                party_id INT NOT NULL,
                document_type_id INT,
                document_date DATE,
                file_path VARCHAR(255),
                uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE,
                FOREIGN KEY (party_id) REFERENCES parties(id) ON DELETE CASCADE,
                FOREIGN KEY (document_type_id) REFERENCES ownership_document_types(id) ON DELETE SET NULL
            );


-- ==========================================
-- FROM backend\scripts\add_owner_cols.js
-- ==========================================

ALTER TABLE owners ${col};


-- ==========================================
-- FROM backend\scripts\add_owner_missing_cols.js
-- ==========================================

ALTER TABLE owners ${col};


-- ==========================================
-- FROM backend\scripts\add_party_fields.js
-- ==========================================

ALTER TABLE parties ADD COLUMN brand_name VARCHAR(255) NULL AFTER company_name;

ALTER TABLE parties ADD COLUMN legal_entity_type VARCHAR(100) NULL AFTER brand_name;


-- ==========================================
-- FROM backend\scripts\add_tenant_fields.js
-- ==========================================

SHOW COLUMNS FROM tenants LIKE 'brand_name'`);

        if (columns.length === 0) {
            await pool.query(`
                ALTER TABLE tenants
                ADD COLUMN brand_name VARCHAR(255) AFTER company_name,
                ADD COLUMN legal_entity_type VARCHAR(100) AFTER brand_name,
                ADD COLUMN id_type VARCHAR(50) AFTER tax_id;


-- ==========================================
-- FROM backend\scripts\alter_calculation_type_multiselect.js
-- ==========================================

ALTER TABLE projects 
            MODIFY COLUMN calculation_type VARCHAR(255) DEFAULT 'Chargeable Area'
        `);


-- ==========================================
-- FROM backend\scripts\apply_schema_fixes.js
-- ==========================================

ALTER TABLE owners 
                ADD COLUMN kyc_status ENUM(;

ALTER TABLE tenants 
                ADD COLUMN kyc_status ENUM(;


-- ==========================================
-- FROM backend\scripts\apply_schema_updates.js
-- ==========================================

CREATE TABLE IF NOT EXISTS unit_images (
              id INT AUTO_INCREMENT PRIMARY KEY,
              unit_id INT NOT NULL,
              image_path VARCHAR(255) NOT NULL,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE
            );

CREATE TABLE IF NOT EXISTS tenant_units (
              id INT AUTO_INCREMENT PRIMARY KEY,
              tenant_id INT NOT NULL,
              unit_id INT NOT NULL,
              assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
              FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE
            );


-- ==========================================
-- FROM backend\scripts\create_lease_escalations_table.js
-- ==========================================

CREATE TABLE IF NOT EXISTS lease_escalations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                lease_id INT NOT NULL,
                sequence_no INT,
                effective_from DATE NOT NULL,
                effective_to DATE,
                increase_type VARCHAR(50) DEFAULT;


-- ==========================================
-- FROM backend\scripts\create_owner_extras.js
-- ==========================================

CREATE TABLE IF NOT EXISTS owner_documents (
              id INT AUTO_INCREMENT PRIMARY KEY,
              owner_id INT NOT NULL,
              document_type VARCHAR(100),
              document_path VARCHAR(255),
              status ENUM(;

CREATE TABLE IF NOT EXISTS owner_messages (
              id INT AUTO_INCREMENT PRIMARY KEY,
              owner_id INT NOT NULL,
              subject VARCHAR(255),
              message TEXT NOT NULL,
              is_read BOOLEAN DEFAULT FALSE,
              sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (owner_id) REFERENCES owners(id) ON DELETE CASCADE
            );


-- ==========================================
-- FROM backend\scripts\create_owner_units.js
-- ==========================================

CREATE TABLE IF NOT EXISTS owner_units (
              id INT AUTO_INCREMENT PRIMARY KEY,
              owner_id INT NOT NULL,
              unit_id INT NOT NULL,
              assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (owner_id) REFERENCES owners(id) ON DELETE CASCADE,
              FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE
            );


-- ==========================================
-- FROM backend\scripts\create_tenant_units.js
-- ==========================================

CREATE TABLE IF NOT EXISTS tenant_units (
                id INT AUTO_INCREMENT PRIMARY KEY,
                tenant_id INT NOT NULL,
                unit_id INT NOT NULL,
                FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
                FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE
            );


-- ==========================================
-- FROM backend\scripts\db_migration_calculation_type.js
-- ==========================================

ALTER TABLE projects 
        ADD COLUMN calculation_type ENUM('Chargeable Area', 'Covered Area', 'Carpet Area') DEFAULT 'Chargeable Area' AFTER project_type
      `);


-- ==========================================
-- FROM backend\scripts\fix_activity_schema.js
-- ==========================================

DESCRIBE activity_logs");
        const colNames = cols.map(c => c.Field);

        if (!colNames.includes('details')) {
            console.log("Adding 'details' column...");
            await connection.query("ALTER TABLE activity_logs ADD COLUMN details TEXT;

ALTER TABLE activity_logs ADD COLUMN ip_address VARCHAR(45);


-- ==========================================
-- FROM backend\scripts\fix_db_schema.js
-- ==========================================

DROP TABLE IF EXISTS documents");

            console.log("Creating new documents table...");
            await connection.query(`
        CREATE TABLE documents (
          id INT AUTO_INCREMENT PRIMARY KEY,
          entity_type ENUM(;


-- ==========================================
-- FROM backend\scripts\fix_db_tables.js
-- ==========================================

CREATE TABLE IF NOT EXISTS unit_ownerships (
                id INT AUTO_INCREMENT PRIMARY KEY,
                unit_id INT NOT NULL,
                party_id INT NOT NULL,
                ownership_status ENUM(;

CREATE TABLE IF NOT EXISTS lease_escalations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                lease_id INT NOT NULL,
                sequence_no INT,
                effective_from DATE,
                effective_to DATE,
                increase_type ENUM(;

SHOW COLUMNS FROM leases LIKE 'monthly_rent'");
        if (leaseCols.length === 0) {
            console.log("Adding monthly_rent to leases...");
            await connection.query("ALTER TABLE leases ADD COLUMN monthly_rent DECIMAL(15,2) DEFAULT 0;


-- ==========================================
-- FROM backend\scripts\fix_documents_table.js
-- ==========================================

CREATE TABLE IF NOT EXISTS documents (
          id INT AUTO_INCREMENT PRIMARY KEY,
          project_id INT,
          category VARCHAR(100) DEFAULT;


-- ==========================================
-- FROM backend\scripts\fix_missing_tables.js
-- ==========================================

SHOW TABLES LIKE 'lease_escalations'");
            if (rows.length === 0) {
                console.log("❌ Table 'lease_escalations' DOES NOT exist.");

                // Create it
                console.log("Creating 'lease_escalations' table...");
                await connection.query(`
          CREATE TABLE IF NOT EXISTS lease_escalations (
            id INT AUTO_INCREMENT PRIMARY KEY,
            lease_id INT NOT NULL,
            sequence_no INT,
            effective_from DATE,
            increase_type ENUM(;


-- ==========================================
-- FROM backend\scripts\fix_missing_tables_v2.js
-- ==========================================

CREATE TABLE IF NOT EXISTS documents (
                id INT AUTO_INCREMENT PRIMARY KEY,
                entity_type ENUM(;

CREATE TABLE IF NOT EXISTS unit_images (
                id INT AUTO_INCREMENT PRIMARY KEY,
                unit_id INT NOT NULL,
                image_path VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE
            );


-- ==========================================
-- FROM backend\scripts\initDb.js
-- ==========================================

CREATE TABLE IF NOT EXISTS roles (
          id INT AUTO_INCREMENT PRIMARY KEY,
          role_name VARCHAR(50) NOT NULL UNIQUE
        );

ALTER TABLE roles ADD COLUMN role_name VARCHAR(50) UNIQUE;

SELECT * FROM roles");
      if (roles.length === 0) {
        await connection.query(`
          INSERT INTO roles (name, role_name) VALUES 
          ('Admin', 'Admin'), ('User', 'User'), ('Manager', 'Manager'), ('Lease Manager', 'Lease Manager')
        `);
        console.log("Seeded roles.");
      }

      // 2. USERS
      await connection.query(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          first_name VARCHAR(50),
          last_name VARCHAR(50),
          email VARCHAR(100) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          role_id INT,
          status VARCHAR(20) DEFAULT;

CREATE TABLE IF NOT EXISTS projects (
          id INT AUTO_INCREMENT PRIMARY KEY,
          project_name VARCHAR(100) NOT NULL,
          project_image VARCHAR(255),
          location VARCHAR(100),
          status VARCHAR(20) DEFAULT;

CREATE TABLE IF NOT EXISTS owners (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100),
          email VARCHAR(100),
          phone VARCHAR(20),
          alternative_contact VARCHAR(20),
          representative_name VARCHAR(100),
          representative_phone VARCHAR(20),
          representative_email VARCHAR(100),
          address TEXT,
          total_owned_area DECIMAL(10, 2) DEFAULT 0,
          gst_number VARCHAR(50),
          kyc_status VARCHAR(20) DEFAULT;

ALTER TABLE owners ADD COLUMN ${colDef};

CREATE TABLE IF NOT EXISTS units (
          id INT AUTO_INCREMENT PRIMARY KEY,
          project_id INT,
          owner_id INT,
          unit_number VARCHAR(20) NOT NULL,
          status VARCHAR(20) DEFAULT;

CREATE TABLE IF NOT EXISTS tenants (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(100),
          phone VARCHAR(20),
          status VARCHAR(20) DEFAULT;

CREATE TABLE IF NOT EXISTS leases (
          id INT AUTO_INCREMENT PRIMARY KEY,
          lease_id VARCHAR(50) UNIQUE,
          unit_id INT,
          tenant_id INT,
          start_date DATE,
          term_end DATE,
          monthly_rent DECIMAL(10, 2),
          status VARCHAR(20) DEFAULT;

CREATE TABLE IF NOT EXISTS documents (
          id INT AUTO_INCREMENT PRIMARY KEY,
          project_id INT,
          category VARCHAR(50),
          file_path VARCHAR(255),
          uploaded_by INT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
          FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
        );

CREATE TABLE IF NOT EXISTS notifications (
          id INT AUTO_INCREMENT PRIMARY KEY,
          type VARCHAR(50),
          message TEXT,
          is_read BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );


-- ==========================================
-- FROM backend\scripts\init_party_master.js
-- ==========================================

CREATE TABLE IF NOT EXISTS parties (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    type ENUM(;

CREATE TABLE IF NOT EXISTS unit_ownerships (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    unit_id INT NOT NULL,
                    party_id INT NOT NULL,
                    ownership_status ENUM(;


-- ==========================================
-- FROM backend\scripts\migrate_chargeable_area.js
-- ==========================================

ALTER TABLE projects MODIFY COLUMN calculation_type VARCHAR(50) DEFAULT 'Chargeable Area'");

ALTER TABLE units RENAME COLUMN super_area TO chargeable_area");


-- ==========================================
-- FROM backend\scripts\migrate_parties.js
-- ==========================================

SELECT * FROM owners");
        console.log(`Migrating ${owners.length} owners...`);

        for (const owner of owners) {
            const nameParts = owner.name.split(' ');
            const firstName = nameParts[0];
            const lastName = nameParts.slice(1).join(' ') || '';
            const type = owner.company_name ? 'Company' : 'Individual';

            const [res] = await connection.query(`
                INSERT INTO parties 
                (type, company_name, first_name, last_name, email, phone, identification_number, address_line1, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                type, owner.company_name, firstName, lastName, owner.email, owner.phone, owner.tax_id, owner.address, owner.created_at
            ]);

            ownerMap.set(owner.id, res.insertId);
        }

        // 2. Migrate Owner Units -> Unit Ownerships
        const [ownerUnits] = await connection.query("SELECT * FROM owner_units");

        for (const ou of ownerUnits) {
            const newPartyId = ownerMap.get(ou.owner_id);
            if (newPartyId) {
                await connection.query(`
                    INSERT INTO unit_ownerships (unit_id, party_id, ownership_status, start_date)
                    VALUES (?, ?, 'Active', ?)
                `, [ou.unit_id, newPartyId, ou.assigned_at]);
            }
        }

        // 3. Migrate Tenants
        const [tenants] = await connection.query("SELECT * FROM tenants");
        console.log(`Migrating ${tenants.length} tenants...`);

        for (const tenant of tenants) {
            const contactName = tenant.contact_person_name ? tenant.contact_person_name.split(' ') : [''];
            const firstName = contactName[0];
            const lastName = contactName.slice(1).join(' ') || '';

            const [res] = await connection.query(`
                INSERT INTO parties 
                (type, company_name, first_name, last_name, email, phone, identification_number, address_line1, city, state, postal_code, country, created_at)
                VALUES ('Company', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                tenant.company_name, firstName, lastName,
                tenant.contact_person_email, tenant.contact_person_phone,
                tenant.tax_id, tenant.address, tenant.city, tenant.state, tenant.zip_code, tenant.country,
                tenant.created_at
            ]);

            tenantMap.set(tenant.id, res.insertId);
        }

        // 4. Update Leases
        // First add columns (if they don't exist)
        try {
            await connection.query("ALTER TABLE leases ADD COLUMN party_owner_id INT, ADD COLUMN party_tenant_id INT;

SELECT * FROM leases");
        for (const lease of leases) {
            const newOwnerId = lease.owner_id ? ownerMap.get(lease.owner_id) : null;
            const newTenantId = lease.tenant_id ? tenantMap.get(lease.tenant_id) : null;

            if (newOwnerId || newTenantId) {
                await connection.query(
                    "UPDATE leases SET party_owner_id = ?, party_tenant_id = ? WHERE id = ?",
                    [newOwnerId, newTenantId, lease.id]
                );
            }
        }

        // 5. Update Documents
        // Need to update ENUM first
        console.log("Updating documents table...");
        await connection.query("ALTER TABLE documents MODIFY COLUMN entity_type ENUM(;


-- ==========================================
-- FROM backend\scripts\update_db_schema.js
-- ==========================================

CREATE TABLE IF NOT EXISTS owner_units (
              id INT AUTO_INCREMENT PRIMARY KEY,
              owner_id INT NOT NULL,
              unit_id INT NOT NULL,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (owner_id);


-- ==========================================
-- FROM backend\scripts\update_rent_model_schema.js
-- ==========================================

ALTER TABLE leases MODIFY COLUMN rent_model VARCHAR(50) NOT NULL DEFAULT;


