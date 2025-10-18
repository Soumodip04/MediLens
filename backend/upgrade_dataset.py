import pandas as pd
import re
from pathlib import Path
from collections import Counter

DATA_DIR = Path(__file__).parent.parent / "data"
SRC = DATA_DIR / "drugs_expanded.csv"
DST = DATA_DIR / "drugs_master.csv"

MASTER_COLS = [
    "brand_name","active_ingredient","generic_name","use_case","side_effects","price","manufacturer","precautions",
    "strength","dosage_form","is_otc","schedule","age_group","interactions","contraindications","hindi_name"
]

DOSAGE_FORMS = [
    ("Inhaler", "Inhaler"), ("Cream", "Cream"), ("Ointment", "Ointment"), ("Gel", "Gel"), ("Shampoo", "Shampoo"),
    ("Spray", "Spray"), ("Drops", "Drops"), ("Syrup", "Syrup"), ("Suspension", "Suspension"), ("Nasal", "Nasal Spray"),
    ("Lotion", "Lotion"), ("Sachet", "Sachet"), ("Powder", "Powder"), ("Tablet", "Tablet"), ("Cap", "Capsule"),
]

# Simple class maps (heuristic)
OTC_SET = set([
    "Paracetamol","Cetirizine","Loratadine","Levocetirizine","Fexofenadine","Cholecalciferol","Vitamin C (Ascorbic Acid)",
    "Tocopherol","Calcium Carbonate","Magnesium + Aluminium Hydroxide + Simethicone","Povidone Iodine",
    "Psyllium Husk","Oral Rehydration Salts","Zinc Sulfate","Calamine + Diphenhydramine","Xylometazoline","Choline Salicylate + Lignocaine",
])

H1_ANTIBIOTICS = set([
    "Azithromycin","Ciprofloxacin","Levofloxacin","Cefixime","Cefuroxime","Cefpodoxime","Linezolid","Ofloxacin",
])

INTERACTION_MAP = {
    "NSAID": "Avoid with active ulcers/anticoagulants; take with food.",
    "PPI": "May reduce absorption of some drugs; take before meals.",
    "ACEi": "Avoid in pregnancy; monitor potassium and renal function.",
    "Statin": "Avoid grapefruit; risk of myopathy with some antibiotics.",
    "Metformin": "Hold with contrast studies; avoid in severe renal impairment.",
    "Fluoroquinolone": "Risk of tendon rupture; avoid with steroids if possible.",
    "SSRI": "Risk of serotonin syndrome with MAOIs/Triptans.",
}

CONTRA_MAP = {
    "NSAID": "Active GI bleed, severe ulcer disease, hypersensitivity.",
    "PPI": "Hypersensitivity.",
    "ACEi": "Pregnancy, history of angioedema.",
    "Statin": "Active liver disease, pregnancy.",
    "Metformin": "Severe renal impairment, lactic acidosis risk.",
    "Fluoroquinolone": "History of tendinopathy with quinolones.",
    "SSRI": "MAOI use within 14 days.",
}

CLASS_RULES = [
    (re.compile(r"diclofenac|aceclofenac|etoricoxib|naproxen|mefenamic", re.I), "NSAID"),
    (re.compile(r"panto|rabep|esomep|omep", re.I), "PPI"),
    (re.compile(r"pril\\b|sartan|olol|carvedilol|bisoprolol|furosemide|spironolactone|hydrochlorothiazide", re.I), "ACEi"),
    (re.compile(r"statin", re.I), "Statin"),
    (re.compile(r"metformin|glimepiride|gliclazide|sitagliptin|vildagliptin|teneligliptin|dapagliflozin|empagliflozin", re.I), "Metformin"),
    (re.compile(r"floxacin", re.I), "Fluoroquinolone"),
    (re.compile(r"fluoxetine|sertraline|escitalopram|duloxetine|amitriptyline", re.I), "SSRI"),
]

MANUFACTURER_NORMALIZE = {
    "GSK": "GlaxoSmithKline",
    "J&J": "Johnson & Johnson",
    "USV Ltd": "USV Limited",
    "Sun Pharma": "Sun Pharmaceutical",
    "Dr. Reddy's": "Dr. Reddy's Laboratories",
    "Ranbaxy": "Sun Pharmaceutical",  # acquired
    "Alembic": "Alembic Pharmaceuticals",
    "Cadila": "Zydus Cadila",
}

HINDI_HINTS = {
    "Paracetamol": "पैरासिटामोल",
    "Cetirizine": "सेटिरीज़ीन",
    "Levocetirizine": "लेवोसेटिरीज़ीन",
    "Fexofenadine": "फेक्सोफेनाडीन",
    "Amlodipine": "एमलोडिपाइन",
    "Telmisartan": "टेल्मिसार्टन",
    "Metformin": "मेटफॉर्मिन",
    "Glimepiride": "ग्लाइमेपिराइड",
    "Insulin": "इंसुलिन",
    "Insulin Glargine": "इंसुलिन ग्लार्जिन",
    "Human Insulin": "मानव इंसुलिन",
    "Insulin Aspart": "इंसुलिन एस्पार्ट",
    "Insulin Lispro": "इंसुलिन लिस्प्रो",
    "Insulin Degludec": "इंसुलिन डिग्लुडे़क",
    "Azithromycin": "एज़िथ्रोमाइसिन",
    "Amoxicillin": "एमोक्सीसिलिन",
    "Clavulanic Acid": "क्लेवुलैनिक एसिड",
    "Cefpodoxime": "सेफपोडोक्सिम",
    "Cefixime": "सेफिक्सिम",
    "Montelukast": "मोंटेलुकास्ट",
    "Budesonide": "बुडे़सोनाइड",
    "Salmeterol": "साल्मेटेरोल",
    "Fluticasone": "फ्लूटिकाज़ोन",
    "Levosalbutamol": "लीवोसल्बुटामोल",
}

# Per-active-ingredient interaction/contraindication overrides
ACTIVE_INTERACTIONS = {
    "Paracetamol": "Avoid duplicate acetaminophen products; caution in liver disease.",
    "Amoxicillin": "May reduce effectiveness of oral contraceptives; report rashes.",
    "Amoxicillin + Clavulanic Acid": "GI upset common; take with food; watch for allergic reactions.",
    "Azithromycin": "QT prolongation risk with other QT-prolonging drugs.",
    "Cefpodoxime": "Reduced absorption with antacids; take with food.",
    "Budesonide": "Rinse mouth after use to prevent thrush; minimal systemic interactions.",
    "Salmeterol + Fluticasone": "Avoid non-selective beta blockers; monitor with strong CYP3A4 inhibitors.",
    "Levosalbutamol": "Additive effects with other sympathomimetics; caution with MAOIs.",
    "Insulin Glargine": "Hypoglycemia with other antidiabetics; adjust with steroids/illness.",
    "Insulin Aspart": "Meal-time insulin; interactions similar to insulin class.",
    "Insulin Lispro": "Rapid-acting insulin; alcohol may increase hypoglycemia risk.",
    "Human Insulin": "Dose changes with renal/hepatic impairment; check glucose closely.",
    "Montelukast + Levocetirizine": "Minimal interactions; additive drowsiness with CNS depressants.",
}

ACTIVE_CONTRA = {
    "Paracetamol": "Severe hepatic impairment.",
    "Amoxicillin": "Hypersensitivity to penicillins.",
    "Amoxicillin + Clavulanic Acid": "History of cholestatic jaundice/hepatic dysfunction with augmentin use.",
    "Azithromycin": "Known QT prolongation; severe hepatic impairment.",
    "Cefpodoxime": "Hypersensitivity to cephalosporins.",
    "Budesonide": "Untreated oral fungal infections.",
    "Salmeterol + Fluticasone": "Primary treatment of status asthmaticus; acute bronchospasm.",
    "Levosalbutamol": "Severe hypersensitivity to albuterol derivatives.",
    "Insulin Glargine": "Hypoglycemia.",
    "Insulin Aspart": "Hypoglycemia.",
    "Insulin Lispro": "Hypoglycemia.",
    "Human Insulin": "Hypoglycemia.",
    "Montelukast + Levocetirizine": "Severe hepatic impairment (caution); known hypersensitivity.",
}

STRENGTH_PAT = re.compile(r"(\d+\s?(?:mg|mcg|g|IU|K))", re.I)
NUM_PAT = re.compile(r"(\d+)(K)?", re.I)


def infer_strength(row):
    text = f"{row['brand_name']} {row['generic_name']} {row['active_ingredient']}"
    m = STRENGTH_PAT.search(text)
    if m:
        s = m.group(1).upper().replace(" ", "")
        if s.endswith('K'):
            return f"{s[:-1]},000 IU"
        return s
    # special cases like 0.5, 60K
    m2 = re.search(r"\b(\d+\.\d+|\d+)(?:\s?mg)?\b", text, re.I)
    if m2:
        num = m2.group(1)
        # guess mg
        if re.search(r"IU|K", text, re.I):
            nm = NUM_PAT.search(text)
            if nm:
                return f"{nm.group(1)}{',000 IU' if nm.group(2) else ' IU'}"
        return f"{num} mg"
    return "Unknown"


def infer_dosage_form(row):
    text = f"{row['brand_name']} {row['use_case']}"
    for key, form in DOSAGE_FORMS:
        if key.lower() in text.lower():
            return form
    return "Tablet"


def is_otc(row):
    ai = str(row["active_ingredient"]).strip()
    return ai in OTC_SET


def schedule_flag(row):
    ai = str(row["active_ingredient"]).strip()
    if ai in H1_ANTIBIOTICS:
        return "H1"
    return "H" if not is_otc(row) else "OTC"


def age_group(row):
    form = row.get("dosage_form", "Tablet")
    if form in ("Syrup","Drops","Suspension","Sachet"):
        return "pediatric"
    if form in ("Inhaler","Nasal Spray"):
        return "both"
    return "adult"


def map_class(row):
    text = f"{row['brand_name']} {row['generic_name']} {row['active_ingredient']}"
    for rx, cname in CLASS_RULES:
        if rx.search(text):
            return cname
    return None


def interactions_for(row):
    ai = str(row.get("active_ingredient", "")).strip()
    if ai in ACTIVE_INTERACTIONS:
        return ACTIVE_INTERACTIONS[ai]
    cname = row.get("drug_class")
    return INTERACTION_MAP.get(cname, "Consult your doctor; check for interactions.")


def contraindications_for(row):
    ai = str(row.get("active_ingredient", "")).strip()
    if ai in ACTIVE_CONTRA:
        return ACTIVE_CONTRA[ai]
    cname = row.get("drug_class")
    return CONTRA_MAP.get(cname, "Contraindications depend on patient condition; seek medical advice.")


def normalize_mfr(name: str) -> str:
    name = str(name).strip()
    return MANUFACTURER_NORMALIZE.get(name, name)


def hindi_name_for(row):
    ai = str(row["active_ingredient"]).strip()
    return HINDI_HINTS.get(ai, "")


def alt_brand_suggestions(df):
    # Precompute sorted alternatives by active_ingredient and price
    grouped = {}
    for ai, sub in df.groupby("active_ingredient"):
        grouped[ai] = sub.sort_values(by="price")[["brand_name","price","manufacturer"]].to_dict("records")
    return grouped


def synthesize_generics(df: pd.DataFrame) -> pd.DataFrame:
    out_rows = []
    for ai, sub in df.groupby("active_ingredient"):
        if len(sub) == 0:
            continue
        median_price = float(sub["price"].median()) if pd.notna(sub["price"]).any() else 50.0
        # majority form/strength
        form_mode = Counter(sub["dosage_form"]).most_common(1)[0][0]
        strength_mode = Counter(sub["strength"]).most_common(1)[0][0]
        base_row = sub.iloc[0].to_dict()
        for label, factor, mfr in (
            (f"Generic {ai}", 0.75, "Generic Manufacturer"),
            (f"Local Pharmacy {ai}", 0.65, "Local Pharmacy"),
        ):
            new_row = base_row.copy()
            new_row.update({
                "brand_name": label if label not in set(df["brand_name"]) else f"{label} {strength_mode}",
                "price": round(max(median_price * factor, 5.0), 2),
                "manufacturer": mfr,
                "strength": strength_mode,
                "dosage_form": form_mode,
                "hindi_name": hindi_name_for(base_row),
            })
            out_rows.append(new_row)
    return pd.DataFrame(out_rows)

def add_extra_pediatric_and_insulin(df: pd.DataFrame) -> pd.DataFrame:
    extra = []

    def make_row(**k):
        extra.append(k)

    # Pediatric formulations
    # Amoxicillin + Clavulanic Acid Dry Syrup 125/31.25 mg per 5 ml (multiple brands)
    for brand in ["Augmentin DS","Moxclav DS","Clavam DS"]:
        make_row(brand_name=brand + " Dry Syrup", active_ingredient="Amoxicillin + Clavulanic Acid", generic_name="Amoxicillin + Clavulanic Acid",
                 use_case="Bacterial infections (pediatric)", side_effects="Diarrhea; Rash", price=130.0, manufacturer="Generic",
                 precautions="Reconstitute and refrigerate; complete full course", strength="125/31.25 mg per 5 ml", dosage_form="Suspension",
                 is_otc=False, schedule="H", age_group="pediatric", interactions=ACTIVE_INTERACTIONS.get("Amoxicillin + Clavulanic Acid",""),
                 contraindications=ACTIVE_CONTRA.get("Amoxicillin + Clavulanic Acid",""), hindi_name=f"{HINDI_HINTS.get('Amoxicillin','')} + {HINDI_HINTS.get('Clavulanic Acid','')}")

    # Azithromycin pediatric suspension 100/5 ml and 200/5 ml
    for strength, price in [("100 mg/5 ml", 95.0),("200 mg/5 ml", 165.0)]:
        for brand in ["Azithral Liquid","Azee Suspension","AZM Kid"]:
            make_row(brand_name=brand, active_ingredient="Azithromycin", generic_name="Azithromycin",
                     use_case="Bacterial infections (pediatric)", side_effects="Nausea; Diarrhea", price=price, manufacturer="Generic",
                     precautions="Dose once daily; complete course", strength=strength, dosage_form="Suspension",
                     is_otc=False, schedule="H1", age_group="pediatric", interactions=ACTIVE_INTERACTIONS.get("Azithromycin",""),
                     contraindications=ACTIVE_CONTRA.get("Azithromycin",""), hindi_name=HINDI_HINTS.get('Azithromycin',''))

    # Cefpodoxime suspension strengths
    for strength, price in [("50 mg/5 ml", 155.0),("100 mg/5 ml", 225.0)]:
        for brand in ["Cefodox Dry Syrup","Cefoprox Suspension","Cefpod DS"]:
            make_row(brand_name=brand, active_ingredient="Cefpodoxime", generic_name="Cefpodoxime",
                     use_case="Bacterial infections (pediatric)", side_effects="Diarrhea; Abdominal pain", price=price, manufacturer="Generic",
                     precautions="Give with food", strength=strength, dosage_form="Suspension",
                     is_otc=False, schedule="H1", age_group="pediatric", interactions=ACTIVE_INTERACTIONS.get("Cefpodoxime",""),
                     contraindications=ACTIVE_CONTRA.get("Cefpodoxime",""), hindi_name=HINDI_HINTS.get('Cefpodoxime',''))

    # Montelukast + Levocetirizine pediatric syrups
    for brand in ["Montair-LC Kid","Montelast-LC Kid","Levmont Kid"]:
        make_row(brand_name=brand + " Syrup", active_ingredient="Montelukast + Levocetirizine", generic_name="Montelukast + Levocetirizine",
                 use_case="Allergic rhinitis (pediatric)", side_effects="Drowsiness; Headache", price=165.0, manufacturer="Cipla",
                 precautions="Evening dose preferred", strength="4 mg/2.5 mg per 5 ml", dosage_form="Syrup",
                 is_otc=False, schedule="H", age_group="pediatric", interactions=ACTIVE_INTERACTIONS.get("Montelukast + Levocetirizine",""),
                 contraindications=ACTIVE_CONTRA.get("Montelukast + Levocetirizine",""), hindi_name=f"{HINDI_HINTS.get('Montelukast','')} + {HINDI_HINTS.get('Levocetirizine','')}")

    # Inhaler strengths
    for strength, price in [("100 mcg", 245.0),("200 mcg", 295.0)]:
        make_row(brand_name=f"Budecort {strength.split()[0]}", active_ingredient="Budesonide", generic_name="Budesonide",
                 use_case="Asthma maintenance", side_effects="Oral thrush; Hoarseness", price=price, manufacturer="Cipla",
                 precautions="Rinse mouth after use", strength=strength, dosage_form="Inhaler",
                 is_otc=False, schedule="H", age_group="both", interactions=ACTIVE_INTERACTIONS.get("Budesonide",""),
                 contraindications=ACTIVE_CONTRA.get("Budesonide",""), hindi_name=HINDI_HINTS.get('Budesonide',''))

    for fluti in [100,250,500]:
        make_row(brand_name=f"Seroflo {fluti}", active_ingredient="Salmeterol + Fluticasone", generic_name="Salmeterol + Fluticasone",
                 use_case="Asthma/COPD maintenance", side_effects="Hoarseness; Thrush", price=400.0 + (fluti-100)*0.6,
                 manufacturer="Cipla", precautions="Not for rescue; regular use only", strength=f"{fluti}/50 mcg", dosage_form="Inhaler",
                 is_otc=False, schedule="H", age_group="both", interactions=ACTIVE_INTERACTIONS.get("Salmeterol + Fluticasone",""),
                 contraindications=ACTIVE_CONTRA.get("Salmeterol + Fluticasone",""), hindi_name=f"{HINDI_HINTS.get('Salmeterol','')} + {HINDI_HINTS.get('Fluticasone','')}")

    # Levosalbutamol nebulizer solutions
    for strength, price in [("0.63 mg/2.5 ml", 18.0),("1.25 mg/2.5 ml", 22.0)]:
        for brand in ["Levolin Neb","Levosal Neb","Xovent Neb"]:
            make_row(brand_name=brand, active_ingredient="Levosalbutamol", generic_name="Levosalbutamol",
                     use_case="Bronchospasm (nebulization)", side_effects="Tremors; Palpitations", price=price, manufacturer="Cipla",
                     precautions="Use with nebulizer as directed", strength=strength, dosage_form="Nebulizer Solution",
                     is_otc=False, schedule="H", age_group="both", interactions=ACTIVE_INTERACTIONS.get("Levosalbutamol",""),
                     contraindications=ACTIVE_CONTRA.get("Levosalbutamol",""), hindi_name=HINDI_HINTS.get('Levosalbutamol',''))

    # Insulin variety
    for brand, ai, mfr, price in [
        ("Basaglar", "Insulin Glargine", "Eli Lilly", 780.0),
        ("Apidra", "Insulin Glulisine", "Sanofi", 860.0),
        ("Insulatard", "Human Insulin (NPH)", "Novo Nordisk", 420.0),
        ("Actrapid", "Human Insulin (Regular)", "Novo Nordisk", 410.0),
    ]:
        make_row(brand_name=brand, active_ingredient=ai, generic_name=ai, use_case="Diabetes insulin therapy",
                 side_effects="Hypoglycemia; Injection site reactions", price=price, manufacturer=mfr, precautions="Store in fridge",
                 strength="100 IU/ml", dosage_form="Injection", is_otc=False, schedule="H", age_group="adult",
                 interactions=ACTIVE_INTERACTIONS.get(ai.split(" (")[0], ""), contraindications=ACTIVE_CONTRA.get(ai.split(" (")[0], ""),
                 hindi_name=HINDI_HINTS.get(ai.split(" (")[0], HINDI_HINTS.get("Insulin","")))

    return pd.concat([df, pd.DataFrame(extra)], ignore_index=True)


def main():
    df = pd.read_csv(SRC)
    # Coerce price
    df["price"] = pd.to_numeric(df["price"], errors="coerce").fillna(0)
    # Normalize manufacturers
    df["manufacturer"] = df["manufacturer"].apply(normalize_mfr)
    # Infer new fields
    df["strength"] = df.apply(infer_strength, axis=1)
    df["dosage_form"] = df.apply(infer_dosage_form, axis=1)
    df["is_otc"] = df.apply(is_otc, axis=1)
    df["schedule"] = df.apply(schedule_flag, axis=1)
    df["age_group"] = df.apply(age_group, axis=1)
    df["drug_class"] = df.apply(map_class, axis=1)
    df["interactions"] = df.apply(interactions_for, axis=1)
    df["contraindications"] = df.apply(contraindications_for, axis=1)
    df["hindi_name"] = df.apply(hindi_name_for, axis=1)

    # Synthesize generic/affordable options
    synth = synthesize_generics(df)
    if not synth.empty:
        df = pd.concat([df, synth], ignore_index=True)

    # Add extra pediatric and insulin variants to push coverage
    df = add_extra_pediatric_and_insulin(df)

    # Reorder/ensure all columns exist
    for col in MASTER_COLS:
        if col not in df.columns:
            df[col] = ""
    df = df[MASTER_COLS]

    # Deduplicate brand_name within active_ingredient by keeping cheapest
    df.sort_values(by=["active_ingredient","brand_name","price"], inplace=True)
    df = df.drop_duplicates(subset=["brand_name","active_ingredient"], keep="first")

    # Write master
    df.to_csv(DST, index=False)
    print(f"Wrote master dataset: {DST} with {len(df)} rows")

if __name__ == "__main__":
    main()
