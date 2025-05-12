const fs = require('fs');
const path = require('path');

const fallbackDir = path.join(__dirname);

// Files that should be kept as direct arrays (for grid presets)
const ARRAY_FILES = [
    'tongue-position.json',
    'lip-shape.json',
    'length.json'
];

fs.readdirSync(fallbackDir).forEach((file) => {
    if (file.endsWith('.json')) {
        const filePath = path.join(fallbackDir, file);
        const raw = fs.readFileSync(filePath, 'utf-8');
        let original;
        try {
            original = JSON.parse(raw);
        } catch (e) {
            console.error(`Failed to parse ${file}:`, e);
            return;
        }

        if (ARRAY_FILES.includes(file)) {
            // If already a plain array of objects, skip
            if (Array.isArray(original) && !(original.length === 1 && original[0].status && original[0].data && Array.isArray(original[0].data.sections))) {
                console.log(`${file} already in array format, skipping.`);
                return;
            }
            // If it's an array with a single API envelope, extract sections
            if (Array.isArray(original) && original.length === 1 && original[0].status && original[0].data && Array.isArray(original[0].data.sections)) {
                fs.writeFileSync(filePath, JSON.stringify(original[0].data.sections, null, 2));
                console.log(`Extracted sections from API envelope in ${file}`);
                return;
            }
            // If it's a single API envelope object, extract sections
            if (original.status && original.data && Array.isArray(original.data.sections)) {
                fs.writeFileSync(filePath, JSON.stringify(original.data.sections, null, 2));
                console.log(`Extracted sections from API envelope in ${file}`);
                return;
            }
            // Otherwise, just wrap as array
            const wrapped = Array.isArray(original) ? original : [original];
            fs.writeFileSync(filePath, JSON.stringify(wrapped, null, 2));
            console.log(`Converted ${file} to array format`);
        } else {
            // For other files, use API envelope
            if (original.status && original.data && Array.isArray(original.data.sections)) {
                console.log(`${file} already wrapped in API envelope, skipping.`);
                return;
            }
            const sections = Array.isArray(original) ? original : [original];
            const wrapped = {
                status: 'success',
                message: '',
                data: { sections }
            };
            fs.writeFileSync(filePath, JSON.stringify(wrapped, null, 2));
            console.log(`Wrapped ${file} in API envelope`);
        }
    }
}); 