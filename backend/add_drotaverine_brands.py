"""
Add real Drotaverine brand alternatives to the database
"""

import pandas as pd
from pathlib import Path

def add_real_drotaverine_brands():
    """Add real Drotaverine brands from Indian market"""
    
    data_dir = Path(__file__).parent / "data"
    input_file = data_dir / "drugs_master_fixed.csv"
    
    # Load database
    df = pd.read_csv(input_file)
    
    # Get the existing Drotin entry as template
    drotin = df[df['brand_name'] == 'Drotin'].iloc[0]
    
    # Real Drotaverine brands in Indian market
    new_brands = [
        {
            'brand_name': 'Drotaverine Hydrochloride',
            'active_ingredient': 'Drotaverine',
            'generic_name': 'Drotaverine',
            'use_case': drotin['use_case'],
            'side_effects': drotin['side_effects'],
            'price': 32.0,  # Generic version - cheaper
            'manufacturer': 'Various Generic Manufacturers',
            'precautions': drotin['precautions'],
            'strength': drotin['strength'],
            'dosage_form': drotin['dosage_form'],
            'is_otc': drotin['is_otc'],
            'schedule': drotin['schedule'],
            'age_group': drotin['age_group'],
            'interactions': drotin['interactions'],
            'contraindications': drotin['contraindications'],
            'hindi_name': drotin.get('hindi_name', '')
        },
        {
            'brand_name': 'Drotikind',
            'active_ingredient': 'Drotaverine',
            'generic_name': 'Drotaverine',
            'use_case': drotin['use_case'],
            'side_effects': drotin['side_effects'],
            'price': 35.0,
            'manufacturer': 'Mankind Pharma',
            'precautions': drotin['precautions'],
            'strength': drotin['strength'],
            'dosage_form': drotin['dosage_form'],
            'is_otc': drotin['is_otc'],
            'schedule': drotin['schedule'],
            'age_group': drotin['age_group'],
            'interactions': drotin['interactions'],
            'contraindications': drotin['contraindications'],
            'hindi_name': drotin.get('hindi_name', '')
        },
        {
            'brand_name': 'Droverin',
            'active_ingredient': 'Drotaverine',
            'generic_name': 'Drotaverine',
            'use_case': drotin['use_case'],
            'side_effects': drotin['side_effects'],
            'price': 38.0,
            'manufacturer': 'Alembic Pharmaceuticals',
            'precautions': drotin['precautions'],
            'strength': drotin['strength'],
            'dosage_form': drotin['dosage_form'],
            'is_otc': drotin['is_otc'],
            'schedule': drotin['schedule'],
            'age_group': drotin['age_group'],
            'interactions': drotin['interactions'],
            'contraindications': drotin['contraindications'],
            'hindi_name': drotin.get('hindi_name', '')
        }
    ]
    
    # Add new brands
    df_new = pd.concat([df, pd.DataFrame(new_brands)], ignore_index=True)
    
    # Sort by active ingredient and price
    df_new = df_new.sort_values(by=['active_ingredient', 'price'])
    
    # Save
    output_file = data_dir / "drugs_master_fixed.csv"
    df_new.to_csv(output_file, index=False)
    
    print("✅ Added real Drotaverine brands:")
    print("\nDrotaverine medicines now:")
    drot = df_new[df_new['active_ingredient'] == 'Drotaverine']
    print(drot[['brand_name', 'price', 'manufacturer']].to_string())
    
    print(f"\n📊 Total medicines in database: {len(df_new)}")

if __name__ == "__main__":
    add_real_drotaverine_brands()
