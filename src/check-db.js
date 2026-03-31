const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

async function checkDb() {
  const envPath = path.join(process.cwd(), '.env');
  const envContent = fs.readFileSync(envPath, 'utf8');
  const env = {};
  envContent.split(/\r?\n/).forEach(line => {
    const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (m) {
      let key = m[1];
      let value = m[2] || '';
      if (value.length > 0 && value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
        value = value.replace(/\\n/gm, '\n');
      }
      env[key] = value.replace(/(^['"]|['"]$)/g, '');
    }
  });

  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const tables = {
    coaching: 'image_url',
    companies: 'logo_url',
    developers: 'logo_url',
    awards: 'icon'
  };

  const publicImagesDir = path.join(process.cwd(), 'public', 'images');
  const existingImages = fs.readdirSync(publicImagesDir);

  for (const [table, column] of Object.entries(tables)) {
    console.log(`\nChecking table: ${table} (column: ${column})`);
    const { data, error } = await supabase.from(table).select(`*`);

    if (error) {
      console.error(`Error fetching ${table}:`, error.message);
      if (table === 'awards') {
        const { data: cols } = await supabase.from(table).select().limit(1);
        if (cols && cols.length > 0) {
            console.log(`Available columns in ${table}:`, Object.keys(cols[0]));
        }
      }
      continue;
    }

    console.log(`Found ${data.length} items in ${table}`);
    if (table === 'awards' && data.length > 0) {
        console.log('Sample award item:', data[0]);
    }

    for (const item of data) {
      const url = item[column];
      if (!url) {
        console.log(`[ID: ${item.id}] NULL URL`);
        continue;
      }

      // 1. Check for /components/
      if (url.includes('/components/')) {
        console.log(`[ID: ${item.id}] Points to /components/: ${url}`);
        const cleanedUrl = url.replace(/^\/?components\//, '').replace(/^\/images\//, '');
        // We'll fix it if it's supposed to be in /images/
        const finalUrl = `/images/${cleanedUrl}`;
        console.log(`  -> Cleaning to: ${finalUrl}`);
        // await supabase.from(table).update({ [column]: finalUrl }).eq('id', item.id);
      }

      // 2. Check if local path exists in public/images
      if (!url.startsWith('http')) {
        let fileName = url.replace(/^\/?images\//, '').replace(/^\//, '');
        if (!existingImages.includes(fileName)) {
          console.log(`[ID: ${item.id}] File NOT FOUND: ${fileName} (Full URL: ${url})`);
        } else {
          // console.log(`[ID: ${item.id}] OK: ${url}`);
        }
      } else {
        // console.log(`[ID: ${item.id}] EXTERNAL URL: ${url}`);
      }
    }
  }
}

checkDb().catch(err => {
  console.error(err);
  process.exit(1);
});
