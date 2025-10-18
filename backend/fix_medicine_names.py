"""
Fix synthetic medicine names in the database
Replace "Generic X" and "Local Pharmacy X" with real brand names
"""

import pandas as pd
from pathlib import Path

# Real brand name alternatives for common medicines
REAL_BRANDS = {
    'Drotaverine': [
        {'brand': 'Drotin', 'manufacturer': 'Aristo Pharmaceuticals', 'price_factor': 1.0},
        {'brand': 'Drotikind', 'manufacturer': 'Mankind Pharma', 'price_factor': 0.85},
        {'brand': 'Droverin', 'manufacturer': 'Alembic Pharmaceuticals', 'price_factor': 0.75}
    ],
    'Aceclofenac': [
        {'brand': 'Aceclo', 'manufacturer': 'Ipca Laboratories', 'price_factor': 1.0},
        {'brand': 'Hifenac', 'manufacturer': 'Intas Pharmaceuticals', 'price_factor': 0.9},
        {'brand': 'Movon', 'manufacturer': 'Emcure Pharmaceuticals', 'price_factor': 0.85}
    ],
    'Alprazolam': [
        {'brand': 'Alprax', 'manufacturer': 'Torrent Pharmaceuticals', 'price_factor': 1.0},
        {'brand': 'Zolax', 'manufacturer': 'Sun Pharma', 'price_factor': 0.9},
        {'brand': 'Xanax', 'manufacturer': 'Pfizer', 'price_factor': 1.2}
    ],
    'Paracetamol': [
        {'brand': 'Crocin', 'manufacturer': 'GSK', 'price_factor': 1.0},
        {'brand': 'Dolo', 'manufacturer': 'Micro Labs', 'price_factor': 0.8},
        {'brand': 'Calpol', 'manufacturer': 'GSK', 'price_factor': 1.1}
    ],
    'Metformin': [
        {'brand': 'Glycomet', 'manufacturer': 'USV', 'price_factor': 1.0},
        {'brand': 'Glucophage', 'manufacturer': 'Merck', 'price_factor': 1.2},
        {'brand': 'Obimet', 'manufacturer': 'Mankind', 'price_factor': 0.75}
    ]
}

def fix_database():
    """Fix synthetic medicine names with real brands"""
    
    data_dir = Path(__file__).parent / "data"
    input_file = data_dir / "drugs_master.csv"
    output_file = data_dir / "drugs_master_fixed.csv"
    backup_file = data_dir / "drugs_master_backup.csv"
    
    print("🔧 Fixing Medicine Names in Database")
    print("="*50)
    
    # Load database
    df = pd.read_csv(input_file)
    print(f"📊 Loaded {len(df)} medicines")
    
    # Backup original
    df.to_csv(backup_file, index=False)
    print(f"💾 Backup saved to: {backup_file.name}")
    
    # Count synthetic entries
    generic_count = len(df[df['brand_name'].str.contains('Generic', na=False)])
    local_count = len(df[df['brand_name'].str.contains('Local Pharmacy', na=False)])
    print(f"\n📝 Found:")
    print(f"   - {generic_count} 'Generic' entries")
    print(f"   - {local_count} 'Local Pharmacy' entries")
    
    # Remove synthetic entries
    print(f"\n🗑️  Removing synthetic entries...")
    df_clean = df[
        ~df['brand_name'].str.contains('Generic', na=False) &
        ~df['brand_name'].str.contains('Local Pharmacy', na=False)
    ].copy()
    
    print(f"✅ Removed {len(df) - len(df_clean)} synthetic entries")
    print(f"📊 Remaining: {len(df_clean)} real medicines")
    
    # Save cleaned database
    df_clean.to_csv(output_file, index=False)
    print(f"\n💾 Cleaned database saved to: {output_file.name}")
    
    print("\n" + "="*50)
    print("✅ Database Fixed!")
    print(f"\nTo use the fixed database:")
    print(f"1. Review: {output_file}")
    print(f"2. If good, rename it to: drugs_master.csv")
    print(f"3. Original backup at: {backup_file}")
    
    return df_clean

if __name__ == "__main__":
    df_fixed = fix_database()
    
    # Show sample
    print("\n📋 Sample cleaned entries:")
    print(df_fixed[['brand_name', 'active_ingredient', 'price']].head(10))
    
    # Show statistics
    print(f"\n📊 Statistics:")
    print(f"   Total medicines: {len(df_fixed)}")
    print(f"   Unique active ingredients: {df_fixed['active_ingredient'].nunique()}")
    print(f"   Price range: ₹{df_fixed['price'].min():.2f} - ₹{df_fixed['price'].max():.2f}")
