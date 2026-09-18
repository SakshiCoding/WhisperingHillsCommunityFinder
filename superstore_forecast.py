import argparse
from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd
from statsmodels.tsa.holtwinters import ExponentialSmoothing


def find_column(columns, candidates):
    normalized = {col.strip().lower(): col for col in columns}
    for candidate in candidates:
        if candidate in normalized:
            return normalized[candidate]
    return None


def load_superstore_data(csv_path):
    df = pd.read_csv(csv_path, encoding="latin1")

    date_col = find_column(
        df.columns,
        ["order date", "order_date", "date"],
    )
    sales_col = find_column(
        df.columns,
        ["sales", "sale"],
    )

    if not date_col or not sales_col:
        raise ValueError(
            "Could not find the required columns. Expected columns like "
            "'Order Date' and 'Sales' in the dataset."
        )

    df[date_col] = pd.to_datetime(df[date_col], errors="coerce")
    df[sales_col] = pd.to_numeric(df[sales_col], errors="coerce")
    df = df.dropna(subset=[date_col, sales_col])

    daily_sales = (
        df.groupby(date_col)[sales_col]
        .sum()
        .sort_index()
        .asfreq("D", fill_value=0)
    )
    return daily_sales


def build_forecast(series, periods):
    seasonal_periods = 7 if len(series) >= 14 else None

    if seasonal_periods:
        model = ExponentialSmoothing(
            series,
            trend="add",
            seasonal="add",
            seasonal_periods=seasonal_periods,
        )
    else:
        model = ExponentialSmoothing(series, trend="add", seasonal=None)

    fitted_model = model.fit(optimized=True)
    forecast = fitted_model.forecast(periods)
    return fitted_model, forecast


def save_outputs(history, forecast, output_dir):
    output_dir.mkdir(parents=True, exist_ok=True)

    forecast_df = pd.DataFrame(
        {
            "date": forecast.index,
            "forecast_sales": forecast.values,
        }
    )
    forecast_csv = output_dir / "forecast.csv"
    forecast_df.to_csv(forecast_csv, index=False)

    plt.figure(figsize=(12, 6))
    plt.plot(history.index, history.values, label="Historical Sales")
    plt.plot(forecast.index, forecast.values, label="Forecasted Sales", linestyle="--")
    plt.title("Superstore Sales Forecast")
    plt.xlabel("Date")
    plt.ylabel("Sales")
    plt.legend()
    plt.tight_layout()

    chart_path = output_dir / "forecast.png"
    plt.savefig(chart_path, dpi=150)
    plt.close()

    return forecast_csv, chart_path


def main():
    parser = argparse.ArgumentParser(
        description="Generate a sales forecast using a Kaggle Superstore dataset."
    )
    parser.add_argument(
        "--input",
        required=True,
        help="Path to the Superstore CSV file downloaded from Kaggle.",
    )
    parser.add_argument(
        "--periods",
        type=int,
        default=30,
        help="Number of future days to forecast. Default: 30",
    )
    parser.add_argument(
        "--output-dir",
        default="forecast_output",
        help="Folder where forecast.csv and forecast.png will be saved.",
    )
    args = parser.parse_args()

    csv_path = Path(args.input)
    output_dir = Path(args.output_dir)

    history = load_superstore_data(csv_path)
    _, forecast = build_forecast(history, args.periods)
    forecast_csv, chart_path = save_outputs(history, forecast, output_dir)

    print(f"Forecast created successfully.")
    print(f"CSV saved to: {forecast_csv}")
    print(f"Chart saved to: {chart_path}")


if __name__ == "__main__":
    main()
