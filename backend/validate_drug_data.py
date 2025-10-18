import pandas as pd
from pathlib import Path

CSV = Path(__file__).parent.parent / "data" / "drugs_expanded.csv"

REQUIRED_COLS = [
    "brand_name",
    "active_ingredient",
    "generic_name",
    "use_case",
    "side_effects",
    "price",
    "manufacturer",
    "precautions",
]

def main():
    df = pd.read_csv(CSV)
    errors = []

    # Column schema
    if list(df.columns) != REQUIRED_COLS:
        errors.append(f"Columns mismatch. Found: {list(df.columns)}")

    # Types and ranges
    # Coerce price to numeric and report any rows that fail conversion
    df["price_numeric"] = pd.to_numeric(df["price"], errors="coerce")
    if df["price_numeric"].isna().any():
        bad_rows = df[df["price_numeric"].isna()][["brand_name", "price"]].head(10)
        errors.append(
            f"Non-numeric prices detected in rows (showing up to 10):\n{bad_rows.to_string(index=False)}"
        )
    if (df["price_numeric"] < 0).any():
        errors.append("Negative prices detected")

    # Duplicates
    dup = df.duplicated(subset=["brand_name"], keep=False)
    if dup.any():
        dups = df.loc[dup, "brand_name"].unique().tolist()
        errors.append(f"Duplicate brand_name entries: {dups[:10]}{'...' if len(dups)>10 else ''}")

    # Basic sanity checks
    if (df["brand_name"].str.len() < 1).any():
        errors.append("Empty brand_name entries")

    print(f"Rows: {len(df)}")
    if errors:
        print("Validation: FAIL")
        for e in errors:
            print(" -", e)
        raise SystemExit(1)
    else:
        print("Validation: PASS")

if __name__ == "__main__":
    main()
